from django.test import TestCase
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Category, SkillTag


class CategoryModelTest(TestCase):
    def test_create_category(self):
        cat = Category.objects.create(
            name='Technology', slug='technology', description='Tech jobs'
        )
        self.assertEqual(str(cat), 'Technology')

    def test_create_skill_tag(self):
        tag = SkillTag.objects.create(name='Python')
        self.assertEqual(str(tag), 'Python')


class CategoryAPITest(APITestCase):
    def setUp(self):
        Category.objects.create(name='Technology', slug='technology')
        SkillTag.objects.create(name='Python')
        SkillTag.objects.create(name='Django')

    def test_list_categories_public(self):
        response = self.client.get('/api/v1/categories/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_list_skill_tags_public(self):
        response = self.client.get('/api/v1/skill-tags/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_search_skill_tags(self):
        response = self.client.get('/api/v1/skill-tags/?search=Python')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
