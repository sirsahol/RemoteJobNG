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
        ('on_site', 'On-Site'),
    ]
    EXPERIENCE_LEVEL_CHOICES = [
        ('entry', 'Entry Level'),
        ('mid', 'Mid Level'),
        ('senior', 'Senior'),
        ('lead', 'Lead / Principal'),
        ('any', 'Any'),
    ]
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('active', 'Active'),
        ('paused', 'Paused'),
        ('closed', 'Closed'),
        ('expired', 'Expired'),
    ]

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    title = models.CharField(max_length=200)
    slug = models.SlugField(max_length=250, unique=True, blank=True)
    company_name = models.CharField(max_length=200)
    company_logo_url = models.URLField(blank=True, default='')
    company_website = models.URLField(blank=True, default='')
    description = models.TextField()
    responsibilities = models.TextField(blank=True, default='')
    requirements = models.TextField(blank=True, default='')
    nice_to_have = models.TextField(blank=True, default='')
    location = models.CharField(max_length=100, blank=True, default='')
    country = models.CharField(max_length=100, blank=True, default='')
    timezone_requirement = models.CharField(max_length=100, blank=True, default='')
    job_type = models.CharField(max_length=50, choices=JOB_TYPE_CHOICES, default='full_time')
    remote_type = models.CharField(max_length=20, choices=REMOTE_TYPE_CHOICES, default='fully_remote')
    experience_level = models.CharField(max_length=20, choices=EXPERIENCE_LEVEL_CHOICES, default='any')
    salary_min = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_max = models.DecimalField(max_digits=12, decimal_places=2, null=True, blank=True)
    salary_currency = models.CharField(max_length=10, default='USD', blank=True)
    is_salary_public = models.BooleanField(default=True)
    category = models.ForeignKey(
        'categories.Category', on_delete=models.SET_NULL, null=True, blank=True, related_name='jobs'
    )
    skill_tags = models.ManyToManyField('categories.SkillTag', blank=True, related_name='jobs')
    application_url = models.URLField(blank=True, default='')
    apply_email = models.EmailField(blank=True, default='')
    is_featured = models.BooleanField(default=False)
    is_aggregated = models.BooleanField(default=False)
    source_name = models.CharField(max_length=100, blank=True, default='')
    source_url = models.URLField(blank=True, default='')
    application_count = models.PositiveIntegerField(default=0)
    view_count = models.PositiveIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    is_active = models.BooleanField(default=True)
    deadline = models.DateTimeField(null=True, blank=True)
    published_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-is_featured', '-published_at', '-created_at']

    def save(self, *args, **kwargs):
        if not self.slug:
            base_slug = slugify(self.title)
            slug = base_slug
            counter = 1
            while Job.objects.filter(slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title


class SavedJob(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='saved_jobs')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='saved_by')
    saved_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ['user', 'job']
        ordering = ['-saved_at']

    def __str__(self):
        return f"{self.user.username} saved {self.job.title}"
