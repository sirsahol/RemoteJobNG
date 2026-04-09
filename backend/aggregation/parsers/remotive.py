import feedparser
import logging
from typing import List, Dict, Any
from .base import BaseJobParser

logger = logging.getLogger(__name__)

REMOTIVE_RSS_URL = "https://remotive.com/remote-jobs/feed"

# Map Remotive category strings to our category names
CATEGORY_MAP = {
    "Software Dev": "Technology",
    "Design": "Design & Creative",
    "Marketing": "Marketing & Sales",
    "Writing": "Writing & Content",
    "Finance / Legal": "Finance & Accounting",
    "Customer Service": "Customer Support",
    "Data": "Data & Analytics",
    "Product": "Product Management",
    "HR": "Operations & HR",
    "DevOps / Sysadmin": "Technology",
    "QA": "Technology",
    "Management": "Operations & HR",
    "Business": "Operations & HR",
    "Sales": "Marketing & Sales",
}


class RemotiveRSSParser(BaseJobParser):
    source_name = "Remotive"

    def fetch(self) -> List[Dict[str, Any]]:
        jobs = []
        try:
            feed = feedparser.parse(REMOTIVE_RSS_URL)
            logger.info(f"[Remotive] Fetched {len(feed.entries)} entries from RSS")

            for entry in feed.entries:
                # Remotive RSS entries have: title, link, summary, tags, category
                source_url = entry.get("link", "").strip()
                if not source_url:
                    continue

                title = entry.get("title", "").strip()
                company = ""
                # Remotive often puts "JobTitle at CompanyName" in title
                if " at " in title:
                    parts = title.rsplit(" at ", 1)
                    title = parts[0].strip()
                    company = parts[1].strip()

                # Get category from tags
                tags = [t.get("term", "") for t in entry.get("tags", [])]
                category_hint = None
                for tag in tags:
                    if tag in CATEGORY_MAP:
                        category_hint = CATEGORY_MAP[tag]
                        break

                job = {
                    "title": title,
                    "company_name": company or "Unknown",
                    "description": entry.get("summary", "").strip(),
                    "source_url": source_url,
                    "application_url": source_url,
                    "location": "Remote",
                    "job_type": "full_time",
                    "remote_type": "fully_remote",
                    "category_hint": category_hint,
                    "tags": [t for t in tags if t not in CATEGORY_MAP and len(t) < 50],
                }
                jobs.append(self.normalize(job))

        except Exception as e:
            logger.error(f"[Remotive] Parse error: {e}")

        return jobs
