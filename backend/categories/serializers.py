from rest_framework import serializers
from .models import Category, SkillTag


class SkillTagSerializer(serializers.ModelSerializer):
    class Meta:
        model = SkillTag
        fields = ['id', 'name', 'slug', 'usage_count']


class CategorySerializer(serializers.ModelSerializer):
    skill_tags = SkillTagSerializer(many=True, read_only=True)
    job_count = serializers.SerializerMethodField()

    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'description', 'icon', 'job_count', 'skill_tags']

    def get_job_count(self, obj):
        return obj.jobs.filter(is_active=True).count()


class CategoryListSerializer(serializers.ModelSerializer):
    """Lightweight version for nav menus."""
    class Meta:
        model = Category
        fields = ['id', 'name', 'slug', 'icon']
