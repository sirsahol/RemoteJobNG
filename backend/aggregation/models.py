from django.db import models
from jobs.models import Job


class FetchLog(models.Model):
    """Tracks every aggregation run per source."""
    SOURCE_CHOICES = [
        ('remotive_rss', 'Remotive RSS'),
        ('weworkremotely_rss', 'WeWorkRemotely RSS'),
        ('adzuna_api', 'Adzuna API'),
        ('jsearch_api', 'JSearch API'),
        ('manual', 'Manual Import'),
    ]

    STATUS_CHOICES = [
        ('running', 'Running'),
        ('success', 'Success'),
        ('partial', 'Partial Success'),
        ('failed', 'Failed'),
    ]

    source = models.CharField(max_length=50, choices=SOURCE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='running')
    jobs_fetched = models.PositiveIntegerField(default=0)
    jobs_created = models.PositiveIntegerField(default=0)
    jobs_skipped = models.PositiveIntegerField(default=0)  # duplicates
    jobs_updated = models.PositiveIntegerField(default=0)
    error_message = models.TextField(blank=True, null=True)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-started_at']

    def __str__(self):
        return f"{self.source} — {self.status} at {self.started_at:%Y-%m-%d %H:%M}"

    @property
    def duration_seconds(self):
        if self.completed_at:
            return (self.completed_at - self.started_at).seconds
        return None
