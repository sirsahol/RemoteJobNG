from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify
import uuid


class User(AbstractUser):
    ROLE_CHOICES = [
        ('job_seeker', 'Job Seeker'),
        ('employer', 'Employer'),
        ('admin', 'Admin'),
    ]

    AVAILABILITY_CHOICES = [
        ('available', 'Available Now'),
        ('open', 'Open to Opportunities'),
        ('not_available', 'Not Available'),
    ]

    # Core identity
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='job_seeker')
    profile_slug = models.SlugField(max_length=150, unique=True, blank=True)

    # Contact & profile
    phone = models.CharField(max_length=20, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    location = models.CharField(max_length=150, blank=True, null=True)  # e.g. "Lagos, Nigeria"
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)

    # Employer-specific
    company_name = models.CharField(max_length=200, blank=True, null=True)
    company_website = models.URLField(blank=True, null=True)
    company_logo = models.ImageField(upload_to='company_logos/', blank=True, null=True)
    company_size = models.CharField(max_length=50, blank=True, null=True)  # e.g. "1-10", "50-200"
    is_verified_employer = models.BooleanField(default=False)

    # Job seeker-specific
    headline = models.CharField(max_length=200, blank=True, null=True)  # e.g. "Senior React Developer"
    years_experience = models.PositiveSmallIntegerField(null=True, blank=True)
    linkedin_url = models.URLField(blank=True, null=True)
    portfolio_url = models.URLField(blank=True, null=True)
    github_url = models.URLField(blank=True, null=True)
    resume_url = models.URLField(blank=True, null=True)  # Cloudinary URL (Sprint 4)
    availability = models.CharField(
        max_length=20, choices=AVAILABILITY_CHOICES, default='open', blank=True
    )

    # Platform metadata
    is_profile_public = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.profile_slug:
            base_slug = slugify(self.username)
            slug = base_slug
            counter = 1
            while User.objects.filter(profile_slug=slug).exclude(pk=self.pk).exists():
                slug = f"{base_slug}-{counter}"
                counter += 1
            self.profile_slug = slug
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"


class UserSkill(models.Model):
    """Skills attached to a job seeker's profile."""
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    skill_name = models.CharField(max_length=100)
    proficiency = models.CharField(
        max_length=20,
        choices=[('beginner', 'Beginner'), ('intermediate', 'Intermediate'), ('expert', 'Expert')],
        default='intermediate'
    )

    class Meta:
        unique_together = ('user', 'skill_name')

    def __str__(self):
        return f"{self.user.username} — {self.skill_name}"
