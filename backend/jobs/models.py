from django.db import models
from django.utils.text import slugify
from users.models import User


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
        ('on_site', 'On-site'),
    ]

    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior Level'),
        ('lead', 'Lead'),
        ('executive', 'Executive'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('expired', 'Expired'),
        ('closed', 'Closed'),
        ('draft', 'Draft'),
    ]

    # Keep legacy alias for JOB_TYPES
    JOB_TYPES = JOB_TYPE_CHOICES

    employer = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name='jobs', null=True, blank=True
    )
    company_name = models.CharField(max_length=200)
    company_logo_url = models.URLField(blank=True, null=True)
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, blank=True)
    description = models.TextField()
    location = models.CharField(max_length=100, blank=True, default='Remote')
    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES, default='full_time')
    remote_type = models.CharField(max_length=20, choices=REMOTE_TYPE_CHOICES, default='fully_remote')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, blank=True, null=True)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=3, default='USD', blank=True)
    category = models.ForeignKey(
        'categories.Category', on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs'
    )
    skill_tags = models.ManyToManyField('categories.SkillTag', blank=True, related_name='jobs')
    source_url = models.URLField(max_length=500, blank=True, null=True, unique=True)
    application_url = models.URLField(max_length=500, blank=True, null=True)
    source_name = models.CharField(max_length=100, blank=True, default='')
    is_aggregated = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    deadline = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(f"{self.title}-{self.company_name}")[:250]
        super().save(*args, **kwargs)
