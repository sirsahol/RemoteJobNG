from rest_framework import serializers
from .models import Category, SkillTag


class SkillTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillTag
        fields = ['id', 'name', 'slug']


class CategoryListSerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon']


class CategoryDetailSerializer(serializers.ModelSerializer):
    skill_tags = SkillTagSerializer(many=True, read_only=True)

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'is_active', 'skill_tags', 'created_at']
