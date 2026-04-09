from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from jobs.models import Job
from .models import Notification, JobAlert

User = get_user_model()


class NotificationModelTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="notif_user", email="notif@example.com", password="pass"
        )

    def test_create_notification(self):
        notif = Notification.objects.create(
            user=self.user,
            notification_type="system",
            title="Welcome",
            message="You have a new application",
        )
        self.assertEqual(notif.user, self.user)
        self.assertFalse(notif.is_read)

    def test_notification_str(self):
        notif = Notification.objects.create(
            user=self.user,
            notification_type="system",
            title="Test",
            message="Test message",
        )
        self.assertIn("notif_user", str(notif))


class NotificationAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='testuser', email='testuser@example.com', password='pass'
        )
        Notification.objects.create(
            user=self.user,
            notification_type='system',
            title='Welcome!',
            message='Welcome to RemoteWorkNaija.',
        )

    def test_list_notifications_requires_auth(self):
        response = self.client.get('/api/v1/notifications/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_list_notifications_authenticated(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get('/api/v1/notifications/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['count'], 1)

    def test_mark_as_read(self):
        notif = Notification.objects.filter(user=self.user).first()
        self.client.force_authenticate(user=self.user)
        response = self.client.patch(f'/api/v1/notifications/{notif.id}/read/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        notif.refresh_from_db()
        self.assertTrue(notif.is_read)


class JobAlertTest(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username="alert_user", email="alert@example.com", password="pass"
        )

    def test_create_job_alert(self):
        alert = JobAlert.objects.create(
            user=self.user,
            keywords="python remote",
        )
        self.assertEqual(alert.user, self.user)
        self.assertIn("python", alert.keywords)

    def test_job_alert_str(self):
        alert = JobAlert.objects.create(
            user=self.user,
            name="My Alert",
            keywords="django",
        )
        self.assertIn("alert_user", str(alert))

    def test_matches_job(self):
        employer = User.objects.create_user(
            username="alert_emp", email="alert_emp@example.com", password="pass", role="employer"
        )
        job = Job.objects.create(
            title="Python Developer",
            company_name="TechCo",
            description="Build Django apps",
            location="Remote",
            employer=employer,
            job_type="full_time",
        )
        alert = JobAlert.objects.create(
            user=self.user,
            keywords="python",
        )
        self.assertTrue(alert.matches_job(job))

    def test_no_match_job(self):
        employer = User.objects.create_user(
            username="alert_emp2", email="alert_emp2@example.com", password="pass", role="employer"
        )
        job = Job.objects.create(
            title="Java Developer",
            company_name="JavaCo",
            description="Build Java apps",
            location="Remote",
            employer=employer,
        )
        alert = JobAlert.objects.create(
            user=self.user,
            keywords="python",
        )
        self.assertFalse(alert.matches_job(job))


class JobAlertAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username='alertapiuser', email='alertapi@example.com', password='pass'
        )

    def test_create_job_alert(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.post('/api/v1/job-alerts/', {
            'name': 'Python Jobs',
            'keywords': 'Python, Django',
            'frequency': 'daily',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['name'], 'Python Jobs')

    def test_job_alert_requires_auth(self):
        response = self.client.post('/api/v1/job-alerts/', {'name': 'Test'})
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
