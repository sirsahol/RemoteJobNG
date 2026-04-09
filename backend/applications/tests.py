from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from jobs.models import Job
from .models import Application

User = get_user_model()


class ApplicationModelTest(TestCase):
    def setUp(self):
        self.seeker = User.objects.create_user(
            username="appl_seeker", email="appl@example.com", password="pass"
        )
        self.employer = User.objects.create_user(
            username="appl_emp", email="appl_emp@example.com", password="pass", role="employer"
        )
        self.job = Job.objects.create(
            title="Dev",
            company_name="Co",
            location="Remote",
            description="desc",
            employer=self.employer,
        )

    def test_create_application(self):
        app = Application.objects.create(job=self.job, applicant=self.seeker)
        self.assertEqual(app.job, self.job)
        self.assertEqual(app.applicant, self.seeker)
        self.assertEqual(app.status, "pending")

    def test_application_str(self):
        app = Application.objects.create(job=self.job, applicant=self.seeker)
        self.assertIn("Dev", str(app))
        self.assertIn("appl_seeker", str(app))

    def test_application_status_choices(self):
        app = Application.objects.create(
            job=self.job, applicant=self.seeker, cover_letter='Test'
        )
        self.assertEqual(app.status, 'pending')
        valid_statuses = ['pending', 'reviewing', 'shortlisted',
                          'interview_scheduled', 'offer_made', 'accepted',
                          'rejected', 'withdrawn']
        self.assertIn(app.status, valid_statuses)


class ApplicationAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.seeker = User.objects.create_user(
            username="api_seeker", email="api_seeker@example.com", password="pass"
        )
        self.employer = User.objects.create_user(
            username="api_emp", email="api_emp@example.com", password="pass", role="employer"
        )
        self.job = Job.objects.create(
            title="API Job",
            company_name="Co",
            location="Remote",
            description="desc",
            employer=self.employer,
        )

    def test_applications_require_auth(self):
        resp = self.client.get("/api/v1/applications/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_submit_application(self):
        self.client.force_authenticate(user=self.seeker)
        response = self.client.post('/api/v1/applications/', {
            'job': self.job.id,
            'cover_letter': 'I am a great fit because...',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        app = Application.objects.get(job=self.job, applicant=self.seeker)
        self.assertEqual(app.status, 'pending')

    def test_seeker_sees_own_applications(self):
        Application.objects.create(
            job=self.job, applicant=self.seeker, cover_letter='Test'
        )
        self.client.force_authenticate(user=self.seeker)
        response = self.client.get('/api/v1/applications/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertGreater(response.data['count'], 0)
