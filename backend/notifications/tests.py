from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Notification, JobAlert

User = get_user_model()


class NotificationAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='pass')
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


class JobAlertAPITest(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='alertuser', password='pass')

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
