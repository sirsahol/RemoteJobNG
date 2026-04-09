from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from jobs.models import Job
from .models import Application

User = get_user_model()


class ApplicationAPITest(APITestCase):
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

    def test_submit_application(self):
        self.client.force_authenticate(user=self.seeker)
        response = self.client.post('/api/v1/applications/', {
            'job': self.job.id,
            'cover_letter': 'I am a great fit because...',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        app = Application.objects.get(job=self.job, applicant=self.seeker)
        self.assertEqual(app.status, 'pending')

    def test_application_requires_auth(self):
        response = self.client.post('/api/v1/applications/', {
            'job': self.job.id,
            'cover_letter': 'Test',
        })
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_seeker_sees_own_applications(self):
        Application.objects.create(
            job=self.job, applicant=self.seeker, cover_letter='Test'
        )
        self.client.force_authenticate(user=self.seeker)
        response = self.client.get('/api/v1/applications/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(response.data['count'], 0)

    def test_application_status_choices(self):
        app = Application.objects.create(
            job=self.job, applicant=self.seeker, cover_letter='Test'
        )
        self.assertEqual(app.status, 'pending')
        valid_statuses = ['pending', 'reviewing', 'shortlisted',
                          'interview_scheduled', 'offer_made', 'accepted',
                          'rejected', 'withdrawn']
        self.assertIn(app.status, valid_statuses)
