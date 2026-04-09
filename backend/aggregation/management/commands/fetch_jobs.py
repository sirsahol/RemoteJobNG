from django.core.management.base import BaseCommand
from django.utils import timezone
from aggregation.models import FetchLog
from aggregation.parsers.remotive import RemotiveRSSParser
from aggregation.parsers.weworkremotely import WeWorkRemotelyParser
from aggregation.ingestor import ingest_jobs
import logging

logger = logging.getLogger(__name__)

PARSERS = {
    "remotive": RemotiveRSSParser,
    "weworkremotely": WeWorkRemotelyParser,
}


class Command(BaseCommand):
    help = "Fetch jobs from all configured aggregation sources"

    def add_arguments(self, parser):
        parser.add_argument(
            '--source',
            type=str,
            default='all',
            help='Source to fetch from: remotive | weworkremotely | all',
        )
        parser.add_argument(
            '--dry-run',
            action='store_true',
            help='Fetch and parse but do not save to database',
        )

    def handle(self, *args, **options):
        source = options.get('source', 'all')
        dry_run = options.get('dry_run', False)

        sources_to_run = PARSERS if source == 'all' else {source: PARSERS[source]} if source in PARSERS else {}

        if not sources_to_run:
            self.stdout.write(self.style.ERROR(f"Unknown source: {source}. Options: {list(PARSERS.keys())}"))
            return

        for source_key, ParserClass in sources_to_run.items():
            self.stdout.write(f"\n→ Fetching from {source_key}...")
            parser = ParserClass()

            # Create fetch log
            log_source_map = {
                "remotive": "remotive_rss",
                "weworkremotely": "weworkremotely_rss",
            }
            log = FetchLog.objects.create(source=log_source_map.get(source_key, "manual"))

            try:
                jobs = parser.fetch()
                log.jobs_fetched = len(jobs)
                self.stdout.write(f"  Fetched {len(jobs)} jobs from {source_key}")

                if dry_run:
                    self.stdout.write(self.style.WARNING("  [DRY RUN] Not saving to database."))
                    for job in jobs[:3]:
                        self.stdout.write(f"    Sample: {job.get('title')} @ {job.get('company_name')}")
                else:
                    counts = ingest_jobs(jobs, log)
                    log.jobs_created = counts["created"]
                    log.jobs_skipped = counts["skipped"]
                    log.jobs_updated = counts["updated"]
                    log.status = "success" if counts["errors"] == 0 else "partial"
                    self.stdout.write(self.style.SUCCESS(
                        f"  Created: {counts['created']} | Updated: {counts['updated']} | Skipped: {counts['skipped']} | Errors: {counts['errors']}"
                    ))

            except Exception as e:
                log.status = "failed"
                log.error_message = str(e)
                self.stdout.write(self.style.ERROR(f"  Failed: {e}"))
                logger.exception(f"Aggregation failed for {source_key}")
            finally:
                log.completed_at = timezone.now()
                log.save()

        self.stdout.write(self.style.SUCCESS("\nAggregation complete."))
