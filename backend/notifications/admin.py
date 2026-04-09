from django.contrib import admin
from .models import Notification, JobAlert


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):
    list_display = ['user', 'notification_type', 'title', 'is_read', 'created_at']
    list_filter = ['notification_type', 'is_read']
    search_fields = ['user__username', 'title']


@admin.register(JobAlert)
class JobAlertAdmin(admin.ModelAdmin):
    list_display = ['user', 'name', 'keywords', 'frequency', 'is_active', 'last_sent_at']
    list_filter = ['frequency', 'is_active']
    search_fields = ['user__username', 'keywords', 'name']
