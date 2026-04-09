from django.db import models
from users.models import User
from jobs.models import Job


class Notification(models.Model):
    """In-app notification for a user."""
    TYPE_CHOICES = [
        ('application_update', 'Application Status Updated'),
        ('new_job_match', 'New Job Matching Your Alert'),
        ('job_alert', 'Job Alert'),
        ('system', 'System Message'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='notifications')
    notification_type = models.CharField(max_length=30, choices=TYPE_CHOICES)
    title = models.CharField(max_length=200)
    message = models.TextField()
    link = models.URLField(blank=True, null=True)  # relative link e.g. /jobs/slug
    is_read = models.BooleanField(default=False)
    related_job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['user', 'is_read']),
        ]

    def __str__(self):
        return f"[{self.notification_type}] → {self.user.username}: {self.title}"


class JobAlert(models.Model):
    """User-defined job alert — triggers when new jobs match criteria."""
    FREQUENCY_CHOICES = [
        ('instant', 'Instant (on match)'),
        ('daily', 'Daily Digest'),
        ('weekly', 'Weekly Digest'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='job_alerts')
    name = models.CharField(max_length=100, blank=True)  # user-defined label, e.g. "Python Jobs"
    keywords = models.CharField(max_length=300, blank=True)  # comma-separated
    job_type = models.CharField(max_length=50, blank=True, null=True)
    remote_type = models.CharField(max_length=20, blank=True, null=True)
    experience_level = models.CharField(max_length=20, blank=True, null=True)
    category = models.ForeignKey(
        'categories.Category', on_delete=models.SET_NULL, null=True, blank=True
    )
    min_salary = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=3, default='USD', blank=True)
    frequency = models.CharField(max_length=10, choices=FREQUENCY_CHOICES, default='daily')
    is_active = models.BooleanField(default=True)
    last_sent_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username}: {self.name or self.keywords}"

    def matches_job(self, job) -> bool:
        """Check if a Job instance matches this alert's criteria."""
        # Keyword check (title + description + company)
        if self.keywords:
            keywords_list = [k.strip().lower() for k in self.keywords.split(",") if k.strip()]
            job_text = f"{job.title} {job.company_name} {job.description}".lower()
            if not any(kw in job_text for kw in keywords_list):
                return False

        if self.job_type and job.job_type != self.job_type:
            return False
        if self.remote_type and job.remote_type != self.remote_type:
            return False
        if self.experience_level and self.experience_level != 'any' and job.experience_level != self.experience_level:
            return False
        if self.category and job.category != self.category:
            return False
        if self.min_salary and job.salary_min and job.salary_min < self.min_salary:
            return False

        return True
