from django.db import models
from users.models import User
from jobs.models import Job


class PaymentPlan(models.Model):
    """Pricing tiers for job post listings."""
    TIER_CHOICES = [
        ('basic', 'Basic'),
        ('featured', 'Featured'),
        ('premium', 'Premium'),
    ]

    tier = models.CharField(max_length=20, choices=TIER_CHOICES, unique=True)
    name = models.CharField(max_length=100)  # display name
    description = models.TextField(blank=True)
    price_ngn = models.DecimalField(max_digits=12, decimal_places=2)  # in Naira
    price_usd = models.DecimalField(max_digits=10, decimal_places=2)  # in USD
    duration_days = models.PositiveSmallIntegerField(default=30)
    max_job_posts = models.PositiveSmallIntegerField(default=1)
    is_featured = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    features = models.JSONField(default=list)  # list of feature strings for display

    class Meta:
        ordering = ['price_ngn']

    def __str__(self):
        return f"{self.name} — ₦{self.price_ngn}"


class JobPayment(models.Model):
    """Records a payment for a job post."""
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('success', 'Success'),
        ('failed', 'Failed'),
        ('refunded', 'Refunded'),
        ('abandoned', 'Abandoned'),
    ]

    CURRENCY_CHOICES = [
        ('NGN', 'Nigerian Naira'),
        ('USD', 'US Dollar'),
    ]

    employer = models.ForeignKey(User, on_delete=models.CASCADE, related_name='payments')
    job = models.ForeignKey(Job, on_delete=models.SET_NULL, null=True, blank=True, related_name='payment')
    plan = models.ForeignKey(PaymentPlan, on_delete=models.PROTECT, null=True)

    # Payment details
    amount = models.DecimalField(max_digits=12, decimal_places=2)
    currency = models.CharField(max_length=3, choices=CURRENCY_CHOICES, default='NGN')
    reference = models.CharField(max_length=200, unique=True)  # Paystack reference

    # Paystack response data
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    paystack_id = models.CharField(max_length=200, blank=True, null=True)
    channel = models.CharField(max_length=50, blank=True, null=True)  # card, bank, ussd
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    paystack_response = models.JSONField(default=dict, blank=True)  # raw webhook payload

    # Timestamps
    created_at = models.DateTimeField(auto_now_add=True)
    paid_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        ordering = ['-created_at']
        indexes = [
            models.Index(fields=['reference']),
            models.Index(fields=['status']),
            models.Index(fields=['employer']),
        ]

    def __str__(self):
        return f"{self.employer.username} — {self.reference} ({self.status})"
