import feedparser
import logging
import re
from typing import List, Dict, Any
from .base import BaseJobParser

logger = logging.getLogger(__name__)

WWR_FEEDS = [
    ("https://weworkremotely.com/categories/remote-programming-jobs.rss", "Technology"),
    ("https://weworkremotely.com/categories/remote-design-jobs.rss", "Design & Creative"),
    ("https://weworkremotely.com/categories/remote-devops-sysadmin-jobs.rss", "Technology"),
    ("https://weworkremotely.com/categories/remote-marketing-jobs.rss", "Marketing & Sales"),
    ("https://weworkremotely.com/remote-jobs.rss", None),  # general feed
]


class WeWorkRemotelyParser(BaseJobParser):
    source_name = "WeWorkRemotely"

    def fetch(self) -> List[Dict[str, Any]]:
        jobs = []
        seen_urls = set()

        for feed_url, category_hint in WWR_FEEDS:
            try:
                feed = feedparser.parse(feed_url)
                logger.info(f"[WWR] {feed_url}: {len(feed.entries)} entries")

                for entry in feed.entries:
                    source_url = entry.get("link", "").strip()
                    if not source_url or source_url in seen_urls:
                        continue
                    seen_urls.add(source_url)

                    title = entry.get("title", "").strip()
                    # WWR format: "Company: Job Title"
                    company = ""
                    if ": " in title:
                        parts = title.split(": ", 1)
                        company = parts[0].strip()
                        title = parts[1].strip()

                    # Clean HTML from description
                    description = entry.get("summary", "")
                    description = re.sub(r'<[^>]+>', ' ', description).strip()
                    description = re.sub(r'\s+', ' ', description)

                    # Region/location often in title or region tag
                    region = entry.get("region", "Worldwide")

                    job = {
                        "title": title,
                        "company_name": company or "Unknown",
                        "description": description,
                        "source_url": source_url,
                        "application_url": source_url,
                        "location": f"Remote — {region}" if region else "Remote",
                        "job_type": "full_time",
                        "remote_type": "fully_remote",
                        "category_hint": category_hint,
                    }
                    jobs.append(self.normalize(job))

            except Exception as e:
                logger.error(f"[WWR] Error parsing {feed_url}: {e}")

        return jobs
