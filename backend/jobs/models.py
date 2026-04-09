from django.db import models
from django.utils.text import slugify
from users.models import User
from categories.models import Category, SkillTag
import uuid


class Job(models.Model):
    JOB_TYPE_CHOICES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('contract', 'Contract'),
        ('freelance', 'Freelance'),
        ('internship', 'Internship'),
    ]

    REMOTE_TYPE_CHOICES = [
        ('fully_remote', 'Fully Remote'),
        ('hybrid', 'Hybrid'),
        ('on_site', 'On-Site'),
    ]

    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level (0–2 years)'),
        ('mid', 'Mid Level (2–5 years)'),
        ('senior', 'Senior (5–10 years)'),
        ('lead', 'Lead / Principal (10+ years)'),
        ('any', 'Any Level'),
    ]

    SALARY_CURRENCY_CHOICES = [
        ('USD', 'US Dollar'),
        ('GBP', 'British Pound'),
        ('EUR', 'Euro'),
        ('NGN', 'Nigerian Naira'),
        ('CAD', 'Canadian Dollar'),
        ('AUD', 'Australian Dollar'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('closed', 'Closed'),
        ('expired', 'Expired'),
    ]

    # Identity
    id = models.BigAutoField(primary_key=True)
    slug = models.SlugField(max_length=300, unique=True, blank=True)
    external_id = models.CharField(max_length=255, blank=True, null=True)  # ID from source (aggregated)

    # Ownership
    employer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='posted_jobs',
        null=True, blank=True  # null for aggregated jobs
    )

    # Core job info
    title = models.CharField(max_length=250)
    company_name = models.CharField(max_length=250)
    company_logo_url = models.URLField(blank=True, null=True)
    company_website = models.URLField(blank=True, null=True)
    description = models.TextField()
    responsibilities = models.TextField(blank=True, null=True)
    requirements = models.TextField(blank=True, null=True)
    nice_to_have = models.TextField(blank=True, null=True)

    # Categorisation
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs'
    )
    skill_tags = models.ManyToManyField(SkillTag, blank=True, related_name='jobs')
    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES, default='full_time')
    remote_type = models.CharField(max_length=20, choices=REMOTE_TYPE_CHOICES, default='fully_remote')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, default='any')

    # Location
    location = models.CharField(max_length=200, blank=True, default='Remote')
    country = models.CharField(max_length=100, blank=True, null=True)  # e.g. "United States"
    timezone_requirement = models.CharField(max_length=100, blank=True, null=True)  # e.g. "UTC±3"

    # Compensation
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=3, choices=SALARY_CURRENCY_CHOICES, default='USD')
    is_salary_public = models.BooleanField(default=True)

    # Apply
    application_url = models.URLField(blank=True, null=True)  # external apply link
    apply_email = models.EmailField(blank=True, null=True)

    # Source & aggregation
    is_aggregated = models.BooleanField(default=False)
    source_name = models.CharField(max_length=100, blank=True, null=True)  # e.g. "Remotive", "Adzuna"
    source_url = models.URLField(blank=True, null=True, unique=True)  # used for dedup

    # Status & lifecycle
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_active = models.BooleanField(default=True)
    is_featured = models.BooleanField(default=False)
    deadline = models.DateTimeField(null=True, blank=True)

    # Metrics (denormalised for performance)
    view_count = models.PositiveIntegerField(default=0)
    application_count = models.PositiveIntegerField(default=0)

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    published_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-is_featured', '-published_at', '-created_at']
        indexes = [
            models.Index(fields=['status', 'is_active']),
            models.Index(fields=['category']),
            models.Index(fields=['job_type']),
            models.Index(fields=['remote_type']),
            models.Index(fields=['experience_level']),
            models.Index(fields=['is_aggregated']),
            models.Index(fields=['source_url']),
            models.Index(fields=['created_at']),
        ]

    def save(self, *args, **kwargs):
        if not self.slug:
            base = slugify(f"{self.title}-{self.company_name}")[:250]
            slug = base
            counter = 1
            while Job.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.title} @ {self.company_name}"


class SavedJob(models.Model):
    """Job seeker bookmarks a job."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')
        ordering = ['-saved_at']

    def __str__(self):
        return f"{self.user.username} saved {self.job.title}"
