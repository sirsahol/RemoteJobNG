from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from .models import Job, SavedJob

User = get_user_model()


class JobModelTest(TestCase):
    def setUp(self):
        self.employer = User.objects.create_user(
            username="emp", email="emp@example.com", password="pass", role="employer"
        )

    def test_create_job(self):
        job = Job.objects.create(
            employer=self.employer,
            title='Senior Python Developer',
            company_name='TestCorp',
            description='We need a Python dev.',
            location='Remote',
        )
        self.assertEqual(job.title, 'Senior Python Developer')
        self.assertIsNotNone(job.slug)
        self.assertTrue(job.is_active)
        self.assertEqual(job.status, 'active')

    def test_job_str(self):
        job = Job.objects.create(
            title="Engineer",
            company_name="Acme",
            location="Remote",
            description="...",
            employer=self.employer,
        )
        self.assertIn("Engineer", str(job))

    def test_slug_auto_generated(self):
        job = Job.objects.create(
            title='React Developer',
            company_name='Acme',
            description='Build UIs.',
            location='Remote',
            employer=self.employer,
        )
        self.assertTrue(job.slug)

    def test_aggregated_job_no_employer(self):
        job = Job.objects.create(
            title='Remote Job',
            company_name='Remote Corp',
            description='Work remotely.',
            location='Remote',
            is_aggregated=True,
            source_url='https://example.com/job/1',
            source_name='Remotive',
        )
        self.assertIsNone(job.employer)
        self.assertTrue(job.is_aggregated)


class SavedJobTest(TestCase):
    def setUp(self):
        self.seeker = User.objects.create_user(
            username="seeker", email="seeker@example.com", password="pass"
        )
        self.employer = User.objects.create_user(
            username="emp2", email="emp2@example.com", password="pass", role="employer"
        )
        self.job = Job.objects.create(
            title="Test Job",
            company_name="Co",
            location="Remote",
            description="Desc",
            employer=self.employer,
        )

    def test_save_job(self):
        saved = SavedJob.objects.create(user=self.seeker, job=self.job)
        self.assertEqual(saved.user, self.seeker)
        self.assertEqual(saved.job, self.job)

    def test_saved_job_str(self):
        saved = SavedJob.objects.create(user=self.seeker, job=self.job)
        self.assertIn("seeker", str(saved))


class JobAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.employer = User.objects.create_user(
            username="emp3", email="emp3@example.com", password="pass", role="employer"
        )
        self.seeker = User.objects.create_user(
            username="seeker2", email="seeker2@example.com", password="pass", role="job_seeker"
        )
        self.job = Job.objects.create(
            title="API Job",
            company_name="APIco",
            location="Remote",
            description="desc",
            employer=self.employer,
            is_active=True,
        )

    def test_list_jobs_public(self):
        resp = self.client.get("/api/v1/jobs/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn('results', resp.data)

    def test_job_detail_public(self):
        response = self.client.get(f'/api/v1/jobs/{self.job.slug}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'API Job')

    def test_create_job_requires_auth(self):
        response = self.client.post('/api/v1/jobs/', {
            'title': 'New Job', 'company_name': 'Co', 'description': 'Desc'
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_create_job_authenticated(self):
        self.client.force_authenticate(user=self.employer)
        response = self.client.post('/api/v1/jobs/', {
            'title': 'New Job',
            'company_name': 'TestCo',
            'description': 'Full description here.',
            'job_type': 'full_time',
            'remote_type': 'fully_remote',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_save_job(self):
        self.client.force_authenticate(user=self.seeker)
        response = self.client.post('/api/v1/saved-jobs/', {'job_id': self.job.id})
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_filter_by_job_type(self):
        response = self.client.get('/api/v1/jobs/?job_type=full_time')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
