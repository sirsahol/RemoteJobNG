from django.db import models
from django.conf import settings

class VerificationRequest(models.Model):
    VERIFICATION_TYPES = [
        ('IDENTITY', 'Identity Verification'),
        ('SKILL', 'Skill Certification'),
        ('INFRASTRUCTURE', 'Infrastructure Asset (Solar/Starlink/ISP)'),
        ('COMPANY', 'Company Registration (KYB)'),
    ]
    
    STATUS_CHOICES = [
        ('PENDING', 'Pending Review'),
        ('IN_PROGRESS', 'In Progress'),
        ('VERIFIED', 'Verified'),
        ('REJECTED', 'Rejected'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='verification_requests')
    request_type = models.CharField(max_length=20, choices=VERIFICATION_TYPES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='PENDING')
    evidence = models.FileField(upload_to='verification/evidence/', blank=True, null=True)
    document_url = models.URLField(max_length=500, blank=True, null=True)
    metadata = models.JSONField(default=dict, blank=True)
    notes = models.TextField(blank=True)
    rejection_reason = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return f"{self.user.username} - {self.request_type} ({self.status})"

class TrustBadge(models.Model):
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True)
    icon = models.CharField(max_length=50) # Emoji or SVG path name
    description = models.TextField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name

class UserBadge(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='badges')
    badge = models.ForeignKey(TrustBadge, on_delete=models.CASCADE)
    verified_at = models.DateTimeField(auto_now_add=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ('user', 'badge')

    def __str__(self):
        return f"{self.user.username} - {self.badge.name}"
