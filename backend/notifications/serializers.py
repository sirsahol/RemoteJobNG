from rest_framework import serializers
from .models import Notification, JobAlert
from categories.serializers import CategoryListSerializer


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = ['id', 'notification_type', 'title', 'message', 'link', 'is_read', 'created_at']
        read_only_fields = ['id', 'notification_type', 'title', 'message', 'link', 'created_at']


class JobAlertSerializer(serializers.ModelSerializer):
    category_detail = CategoryListSerializer(source='category', read_only=True)

    class Meta:
        model = JobAlert
        fields = [
            'id', 'name', 'keywords', 'job_type', 'remote_type', 'experience_level',
            'category', 'category_detail', 'min_salary', 'salary_currency',
            'frequency', 'is_active', 'last_sent_at', 'created_at',
        ]
        read_only_fields = ['id', 'last_sent_at', 'created_at']
