from django.core.management.base import BaseCommand
from verification.models import TrustBadge

class Command(BaseCommand):
    help = 'Seeds initial trust badges'

    def handle(self, *args, **kwargs):
        badges = [
            {
                'name': 'Identity Verified',
                'slug': 'identity-verified',
                'icon': '✅',
                'description': 'User identity has been verified via official government documentation.'
            },
            {
                'name': 'Starlink Verified',
                'slug': 'starlink-verified',
                'icon': '📡',
                'description': 'High-speed Starlink satellite connection verified at the user location.'
            },
            {
                'name': 'Solar Powered',
                'slug': 'solar-powered',
                'icon': '☀️',
                'description': 'User facility is powered by a reliable solar energy system.'
            },
            {
                'name': 'Elite Talent',
                'slug': 'elite-talent',
                'icon': '💎',
                'description': 'User has completed advanced skill assessments with top-tier results.'
            },
            {
                'name': 'Verified Employer',
                'slug': 'verified-employer',
                'icon': '🏢',
                'description': 'Company registration and legal status have been fully vetted.'
            }
        ]

        for b_data in badges:
            badge, created = TrustBadge.objects.get_or_create(
                slug=b_data['slug'],
                defaults=b_data
            )
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created badge: {badge.name}"))
            else:
                self.stdout.write(f"Badge already exists: {badge.name}")
