from django.db import models
from users.models import User

# Create your models here.
class Job(models.Model):
    JOB_TYPES = [
        ('full_time', 'Full Time'),
        ('part_time', 'Part Time'),
        ('remote', 'Remote'),
        ('contract', 'Contract'),
    ]

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='jobs')
    company_name = models.CharField(max_length=200)  
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=100)
    job_type = models.CharField(max_length=50, choices=JOB_TYPES)
    salary = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    def __str__(self):
        return self.title
