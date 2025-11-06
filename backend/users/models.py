from django.db import models
from django.contrib.auth.models import AbstractUser
# Create your models here.

class User(AbstractUser):
    ROLE_CHOICES = [
        ('job_seeker', 'Job Seeker'),
        ('employer', 'Employer'),
    ]

    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='job_seeker')
    phone = models.CharField(max_length=20, blank=True, null=True)
    profile_picture = models.ImageField(upload_to='profile_pics/', blank=True, null=True)
    company_name = models.CharField(max_length=100, blank=True, null=True)
    bio = models.TextField(blank=True, null=True)


    def __str__(self):
        return f"{self.username} ({self.role})"