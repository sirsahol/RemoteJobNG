from django.db import models
from django.contrib.auth.models import AbstractUser
from django.utils.text import slugify


class User(AbstractUser):
    ROLE_CHOICES = [
        ('job_seeker', 'Job Seeker'),
        ('employer', 'Employer'),
    ]
    AVAILABILITY_CHOICES = [
        ('available', 'Available'),
        ('open', 'Open to offers'),
        ('not_available', 'Not Available'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='job_seeker')
    phone = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    company_name = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)
    headline = models.CharField(max_length=200, blank=True, default='')
    location = models.CharField(max_length=100, blank=True, default='')
    slug = models.SlugField(max_length=150, unique=True, blank=True, null=True)
    availability = models.CharField(max_length=20, choices=AVAILABILITY_CHOICES, default='available')
    is_profile_public = models.BooleanField(default=True)
    website = models.URLField(blank=True, default='')
    github_url = models.URLField(blank=True, default='')
    linkedin_url = models.URLField(blank=True, default='')
    twitter_url = models.URLField(blank=True, default='')
    reputation_score = models.IntegerField(default=50) # 0-100 base score
    is_verified = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.username)
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.username} ({self.role})"


class UserSkill(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='skills')
    skill_tag = models.ForeignKey(
        'categories.SkillTag', on_delete=models.CASCADE, null=True, blank=True
    )
    name = models.CharField(max_length=100, blank=True, default='')
    proficiency = models.CharField(max_length=20, blank=True, default='')

    class Meta:
        unique_together = ['user', 'skill_tag']

    def __str__(self):
        return f"{self.user.username} - {self.skill_tag or self.name}"
