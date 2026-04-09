from django.core.management.base import BaseCommand
from django.utils import timezone
from jobs.models import Job


class Command(BaseCommand):
    help = "Mark jobs past their deadline as expired"

    def handle(self, *args, **options):
        expired = Job.objects.filter(
            is_active=True,
            status='active',
            deadline__lt=timezone.now()
        )
        count = expired.count()
        expired.update(status='expired', is_active=False)
        self.stdout.write(self.style.SUCCESS(f"Expired {count} jobs."))
