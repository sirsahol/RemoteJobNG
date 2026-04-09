import logging
from typing import List, Dict, Any
from django.utils import timezone
from jobs.models import Job
from categories.models import Category, SkillTag

logger = logging.getLogger(__name__)


def ingest_jobs(jobs: List[Dict[str, Any]], fetch_log) -> Dict[str, int]:
    """
    Takes a list of normalized job dicts and persists them.
    Deduplicates by source_url.
    Returns counts: created, skipped, updated, errors.
    """
    counts = {"created": 0, "skipped": 0, "updated": 0, "errors": 0}

    for job_data in jobs:
        source_url = job_data.get("source_url")
        if not source_url:
            logger.warning("Job without source_url skipped")
            counts["errors"] += 1
            continue

        try:
            # Resolve category
            category = None
            category_hint = job_data.pop("category_hint", None)
            if category_hint:
                category = Category.objects.filter(name__iexact=category_hint).first()

            # Resolve skill tags
            tag_names = job_data.pop("tags", [])
            tag_ids = []
            for tag_name in tag_names[:10]:  # cap at 10 tags per job
                tag, _ = SkillTag.objects.get_or_create(
                    name__iexact=tag_name,
                    defaults={"name": tag_name}
                )
                tag_ids.append(tag.id)

            # Remove non-model fields
            job_data.pop("is_aggregated", None)
            job_data.pop("status", None)

            existing = Job.objects.filter(source_url=source_url).first()

            if existing:
                # Only update if title or company changed (lightweight update)
                changed = (
                    existing.title != job_data.get("title", existing.title) or
                    existing.company_name != job_data.get("company_name", existing.company_name)
                )
                if changed:
                    for field, value in job_data.items():
                        if hasattr(existing, field) and value:
                            setattr(existing, field, value)
                    if category:
                        existing.category = category
                    existing.save()
                    if tag_ids:
                        existing.skill_tags.set(tag_ids)
                    counts["updated"] += 1
                else:
                    counts["skipped"] += 1
            else:
                # Create new job
                job = Job(
                    **{k: v for k, v in job_data.items() if hasattr(Job, k)},
                    category=category,
                    is_aggregated=True,
                    status="active",
                    is_active=True,
                    published_at=timezone.now(),
                )
                job.save()
                if tag_ids:
                    job.skill_tags.set(tag_ids)
                counts["created"] += 1

        except Exception as e:
            logger.error(f"Error ingesting job {source_url}: {e}")
            counts["errors"] += 1

    return counts
