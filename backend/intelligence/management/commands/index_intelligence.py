import os
from django.core.management.base import BaseCommand
from jobs.models import Job
from django.contrib.auth import get_user_model
from intelligence.engine import IntelligenceEngine

User = get_user_model()

class Command(BaseCommand):
    help = 'Indexes all existing jobs and users for neural matching'

    def handle(self, *args, **options):
        self.stdout.write("Starting intelligence indexing...")
        
        jobs = Job.objects.all()
        self.stdout.write(f"Indexing {jobs.count()} jobs...")
        for job in jobs:
            IntelligenceEngine.sync_job_embedding(job)
            
        users = User.objects.all()
        self.stdout.write(f"Indexing {users.count()} users...")
        for user in users:
            IntelligenceEngine.sync_user_embedding(user)
            
        self.stdout.write(self.style.SUCCESS("Successfully indexed all data!"))
