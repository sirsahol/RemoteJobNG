from django.db import models
from jobs.models import Job
from users.models import User
from pgvector.django import VectorField

class JobEmbedding(models.Model):
    job = models.OneToOneField(Job, on_delete=models.CASCADE, related_name='intelligence_embedding')
    # 384 dimensions for all-MiniLM-L6-v2 (sentence-transformers)
    # 1536 dimensions for text-embedding-3-small (OpenAI)
    vector = VectorField(dimensions=384, null=True, blank=True)
    last_synced_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Embedding for {self.job.title}"

class UserEmbedding(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='intelligence_embedding')
    vector = VectorField(dimensions=384, null=True, blank=True)
    last_synced_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"Embedding for {self.user.email}"

class ATSMatch(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='ats_matches')
    job = models.ForeignKey(Job, on_delete=models.CASCADE, related_name='ats_matches')
    score = models.FloatField() # 0.0 to 1.0
    analysis = models.JSONField(default=dict) # Detailed breakdown of match
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'job')
        ordering = ['-score']
