from django.db import models
from users.models import User
from jobs.models import Job


class Application(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending Review'),
        ('reviewing', 'Under Review'),
        ('shortlisted', 'Shortlisted'),
        ('interview_scheduled', 'Interview Scheduled'),
        ('offer_made', 'Offer Made'),
        ('accepted', 'Accepted'),
        ('rejected', 'Rejected'),
        ('withdrawn', 'Withdrawn by Applicant'),
    ]

    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='applications')
    applicant = models.ForeignKey(User, on_delete=models.CASCADE, related_name='applications', null=True, blank=True)

    # Application content
    cover_letter = models.TextField(blank=True, null=True)
    resume = models.FileField(upload_to='resumes/', blank=True, null=True)
    resume_url = models.URLField(blank=True, null=True)  # external URL (Cloudinary - Sprint 4)

    # Contact fallback (for unauthenticated apply)
    applicant_name = models.CharField(max_length=200, blank=True, null=True)
    applicant_email = models.EmailField(blank=True, null=True)

    # Status tracking
    status = models.CharField(max_length=30, choices=STATUS_CHOICES, default='pending')
    is_withdrawn = models.BooleanField(default=False)
    withdrawn_at = models.DateTimeField(null=True, blank=True)

    # Employer notes (private)
    employer_notes = models.TextField(blank=True, null=True)
    interview_date = models.DateTimeField(null=True, blank=True)
    interview_notes = models.TextField(blank=True, null=True)

    # Timestamps
    applied_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-applied_at']
        indexes = [
            models.Index(fields=['status']),
            models.Index(fields=['job', 'status']),
            models.Index(fields=['applicant']),
        ]

    def __str__(self):
        name = self.applicant.username if self.applicant else self.applicant_email
        return f"{name} → {self.job.title}"
