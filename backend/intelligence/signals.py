from django.db.models.signals import post_save
from django.dispatch import receiver
from jobs.models import Job
from users.models import User
from .engine import IntelligenceEngine

@receiver(post_save, sender=Job)
def sync_job_embedding(sender, instance, created, **kwargs):
    # Skip if it's a bulk operation or specific flag
    if getattr(instance, '_skip_signal', False):
        return
    # Generate/Sync embedding
    IntelligenceEngine.sync_job_embedding(instance)

@receiver(post_save, sender=User)
def sync_user_embedding(sender, instance, created, **kwargs):
    # Only sync if bio or headline changed (or if created)
    # For simplicity, we sync on every save if they have content
    if instance.bio or instance.headline:
        IntelligenceEngine.sync_user_embedding(instance)
