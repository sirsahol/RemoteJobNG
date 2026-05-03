from django.core.management.base import BaseCommand
from jobs.models import Job
from categories.models import Category
from django.utils import timezone
import random

JOBS = [
    {
        'title': 'Senior Python Developer',
        'company_name': 'Techflow Global',
        'location': 'Remote (US Timezones)',
        'description': 'We are looking for a Senior Python Developer to join our core backend team. You will be responsible for building scalable APIs and microservices.',
        'salary_min': 5000,
        'salary_max': 8000,
        'salary_currency': 'USD',
        'job_type': 'full_time',
        'experience_level': 'senior',
        'application_url': 'https://example.com/apply/python-dev',
        'category_name': 'Technology'
    },
    {
        'title': 'UX/UI Designer',
        'company_name': 'Creative Pulse',
        'location': 'Remote (UK Timezones)',
        'description': 'Join our design studio and help us create beautiful, user-centric interfaces for international clients.',
        'salary_min': 3000,
        'salary_max': 5000,
        'salary_currency': 'USD',
        'job_type': 'full_time',
        'experience_level': 'mid',
        'application_url': 'https://example.com/apply/ux-designer',
        'category_name': 'Design & Creative'
    },
    {
        'title': 'Technical Content Writer',
        'company_name': 'DevDocs Inc',
        'location': 'Remote',
        'description': 'We need a writer who can translate complex technical concepts into clear, engaging documentation and blog posts.',
        'salary_min': 2000,
        'salary_max': 4000,
        'salary_currency': 'USD',
        'job_type': 'contract',
        'experience_level': 'mid',
        'application_url': 'https://example.com/apply/tech-writer',
        'category_name': 'Writing & Content'
    },
    {
        'title': 'React Native Developer',
        'company_name': 'MobileFirst',
        'location': 'Remote (Europe)',
        'description': 'Build cross-platform mobile applications using React Native. Experience with TypeScript and Redux is a plus.',
        'salary_min': 4000,
        'salary_max': 7000,
        'salary_currency': 'EUR',
        'job_type': 'full_time',
        'experience_level': 'mid',
        'application_url': 'https://example.com/apply/react-native',
        'category_name': 'Technology'
    },
    {
        'title': 'Customer Success Specialist',
        'company_name': 'GlobalSupport',
        'location': 'Remote',
        'description': 'Help our customers succeed with our platform. Excellent communication skills and empathy are required.',
        'salary_min': 1500,
        'salary_max': 2500,
        'salary_currency': 'USD',
        'job_type': 'full_time',
        'experience_level': 'entry',
        'application_url': 'https://example.com/apply/customer-success',
        'category_name': 'Customer Support'
    }
]

class Command(BaseCommand):
    help = 'Seed initial jobs for testing'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding jobs...')
        
        for job_data in JOBS:
            category_name = job_data.pop('category_name')
            category = Category.objects.filter(name=category_name).first()
            
            if not category:
                self.stdout.write(self.style.WARNING(f"Category {category_name} not found. Skipping {job_data['title']}"))
                continue
                
            job, created = Job.objects.get_or_create(
                title=job_data['title'],
                company_name=job_data['company_name'],
                defaults={
                    **job_data,
                    'category': category,
                    'is_active': True,
                    'is_featured': random.choice([True, False]),
                }
            )
            
            if created:
                self.stdout.write(self.style.SUCCESS(f"Created job: {job.title}"))
            else:
                self.stdout.write(f"Job exists: {job.title}")

        self.stdout.write(self.style.SUCCESS('Job seeding complete.'))
