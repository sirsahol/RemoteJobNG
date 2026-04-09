from django.test import TestCase
from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status

User = get_user_model()


class UserModelTest(TestCase):
    def test_create_user(self):
        user = User.objects.create_user(
            username="testuser",
            email="test@example.com",
            password="testpass123",
        )
        self.assertEqual(user.username, "testuser")
        self.assertEqual(user.email, "test@example.com")
        self.assertEqual(user.role, "job_seeker")
        self.assertTrue(user.check_password("testpass123"))

    def test_create_employer(self):
        user = User.objects.create_user(
            username="employer1",
            email="employer@example.com",
            password="pass123",
            role="employer",
        )
        self.assertEqual(user.role, "employer")

    def test_user_str(self):
        user = User.objects.create_user(username="alice", email="alice@example.com", password="p")
        self.assertIn("alice", str(user))

    def test_slug_auto_generated(self):
        user = User.objects.create_user(username="slugtest", email="slug@example.com", password="p")
        self.assertEqual(user.slug, "slugtest")


class AuthAPITest(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(
            username="authuser", email="auth@example.com", password="authpass123"
        )

    def test_obtain_token(self):
        resp = self.client.post(
            "/api/token/",
            {"username": "authuser", "password": "authpass123"},
            format="json",
        )
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertIn("access", resp.data)
        self.assertIn("refresh", resp.data)

    def test_register_user(self):
        resp = self.client.post(
            "/api/v1/users/",
            {
                "username": "newuser",
                "email": "new@example.com",
                "password": "newpass123",
            },
            format="json",
        )
        # Accept 200 or 201
        self.assertIn(resp.status_code, [status.HTTP_200_OK, status.HTTP_201_CREATED])

    def test_profile_requires_auth(self):
        resp = self.client.get("/api/v1/users/me/")
        self.assertEqual(resp.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_profile_with_auth(self):
        self.client.force_authenticate(user=self.user)
        resp = self.client.get("/api/v1/users/me/")
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertEqual(resp.data["username"], "authuser")
