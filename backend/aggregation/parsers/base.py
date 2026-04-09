from abc import ABC, abstractmethod
from typing import List, Dict, Any


class BaseJobParser(ABC):
    """Abstract base class all source parsers must implement."""
    source_name: str = ""

    @abstractmethod
    def fetch(self) -> List[Dict[str, Any]]:
        """
        Fetch raw job data from the source.
        Returns a list of dicts with normalized keys.

        Each dict must have at minimum:
            - title: str
            - company_name: str
            - description: str
            - source_url: str (UNIQUE — used for deduplication)
            - source_name: str

        Optional keys:
            - location: str
            - job_type: str  (must match Job.JOB_TYPE_CHOICES values)
            - remote_type: str  (must match Job.REMOTE_TYPE_CHOICES values)
            - experience_level: str
            - salary_min: float
            - salary_max: float
            - salary_currency: str
            - deadline: datetime
            - company_logo_url: str
            - application_url: str
            - category_hint: str  (used to match a Category by name)
            - tags: List[str]  (skill tag names)
        """
        pass

    def normalize(self, raw: Dict[str, Any]) -> Dict[str, Any]:
        """Apply any shared normalization logic."""
        # Ensure source_name is always set
        raw.setdefault('source_name', self.source_name)
        raw.setdefault('is_aggregated', True)
        raw.setdefault('remote_type', 'fully_remote')
        raw.setdefault('status', 'active')
        raw.setdefault('is_active', True)
        return raw
