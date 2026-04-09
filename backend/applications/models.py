from django.db import models
from users.models import User
from jobs.models import Job


class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('reviewing', 'Reviewing'),
        ('shortlisted', 'Shortlisted'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('offer_made', 'Offer Made'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications', null=True, blank=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    resume_url = models.URLField(blank=True, default='')
    cover_letter = models.TextField(blank=True, null=True)
    applicant_name = models.CharField(max_length=200, blank=True, default='')
    applicant_email = models.EmailField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    is_withdrawn = models.BooleanField(default=False)
    withdrawn_at = models.DateTimeField(null=True, blank=True)
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_notes = models.TextField(blank=True, default='')
    employer_notes = models.TextField(blank=True, default='')
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']

    def __str__(self):
        name = self.applicant.username if self.applicant else self.applicant_name
        return f"{name} applied for {self.job.title}"
