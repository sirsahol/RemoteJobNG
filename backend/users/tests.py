from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APITestCase
from rest_framework import status

User = get_user_model()


class UserModelTest(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(
            username='testuser', password='testpass123', role='job_seeker'
        )
        self.assertEqual(user.username, 'testuser')
        self.assertEqual(user.role, 'job_seeker')
        self.assertIsNotNone(user.slug)

    def test_slug_auto_generated(self):
        user = User.objects.create_user(username='john-doe', password='pass')
        self.assertEqual(user.slug, 'john-doe')

    def test_employer_role(self):
        user = User.objects.create_user(
            username='employer1', password='pass', role='employer'
        )
        self.assertEqual(user.role, 'employer')


class UserRegistrationAPITest(APITestCase):
    def test_register_seeker(self):
        response = self.client.post('/api/v1/users/', {
            'username': 'newseeker',
            'password': 'testpass123',
            'email': 'seeker@test.com',
            'role': 'job_seeker',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(response.data['role'], 'job_seeker')

    def test_register_employer(self):
        response = self.client.post('/api/v1/users/', {
            'username': 'newemployer',
            'password': 'testpass123',
            'email': 'employer@test.com',
            'role': 'employer',
        })
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

    def test_me_requires_auth(self):
        response = self.client.get('/api/v1/users/me/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_me_returns_profile(self):
        user = User.objects.create_user(username='authuser', password='pass123')
        self.client.force_authenticate(user=user)
        response = self.client.get('/api/v1/users/me/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data['username'], 'authuser')
