from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Job, SavedJob

User = get_user_model()


class JobModelTest(TestCase):
    def setUp(self):
        self.employer = User.objects.create_user(
            username='employer', password='pass', role='employer'
        )

    def test_create_job(self):
        job = Job.objects.create(
            employer=self.employer,
            title='Senior Python Developer',
            company_name='TestCorp',
            description='We need a Python dev.',
        )
        self.assertEqual(job.title, 'Senior Python Developer')
        self.assertIsNotNone(job.slug)
        self.assertTrue(job.is_active)
        self.assertEqual(job.status, 'active')

    def test_slug_auto_generated(self):
        job = Job.objects.create(
            title='React Developer',
            company_name='Acme',
            description='Build UIs.',
        )
        self.assertIn('react-developer', job.slug)

    def test_aggregated_job_no_employer(self):
        job = Job.objects.create(
            title='Remote Job',
            company_name='Remote Corp',
            description='Work remotely.',
            is_aggregated=True,
            source_url='https://example.com/job/1',
            source_name='Remotive',
        )
        self.assertIsNone(job.employer)
        self.assertTrue(job.is_aggregated)


class JobAPITest(APITestCase):
    def setUp(self):
        self.employer = User.objects.create_user(
            username='employer', password='pass', role='employer'
        )
        self.seeker = User.objects.create_user(
            username='seeker', password='pass', role='job_seeker'
        )
        self.job = Job.objects.create(
            employer=self.employer,
            title='Test Job',
            company_name='TestCo',
            description='A test job.',
        )

    def test_list_jobs_public(self):
        response = self.client.get('/api/v1/jobs/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn('results', response.data)

    def test_job_detail_public(self):
        response = self.client.get(f'/api/v1/jobs/{self.job.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['title'], 'Test Job')

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
