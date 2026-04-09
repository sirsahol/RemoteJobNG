from django.core.management.base import BaseCommand
from payments.models import PaymentPlan


PLANS = [
    {
        "tier": "basic",
        "name": "Basic Listing",
        "description": "Standard job post visible to all job seekers",
        "price_ngn": 5000,
        "price_usd": 5,
        "duration_days": 30,
        "max_job_posts": 1,
        "is_featured": False,
        "features": ["30-day listing", "Standard visibility", "Applicant management", "Email support"],
    },
    {
        "tier": "featured",
        "name": "Featured Listing",
        "description": "Highlighted job post with priority placement",
        "price_ngn": 15000,
        "price_usd": 12,
        "duration_days": 30,
        "max_job_posts": 1,
        "is_featured": True,
        "features": ["30-day listing", "Featured badge", "Top of search results", "Priority placement", "Email support"],
    },
    {
        "tier": "premium",
        "name": "Employer Bundle",
        "description": "5 featured listings for growing teams",
        "price_ngn": 50000,
        "price_usd": 40,
        "duration_days": 60,
        "max_job_posts": 5,
        "is_featured": True,
        "features": ["5 featured listings", "60-day duration", "Analytics dashboard", "Priority support", "Logo on listings"],
    },
]


class Command(BaseCommand):
    help = "Seed default payment plans"

    def handle(self, *args, **kwargs):
        for plan_data in PLANS:
            plan, created = PaymentPlan.objects.update_or_create(
                tier=plan_data["tier"],
                defaults=plan_data
            )
            self.stdout.write(f"{'Created' if created else 'Updated'}: {plan.name}")
        self.stdout.write(self.style.SUCCESS("Plans seeded."))
