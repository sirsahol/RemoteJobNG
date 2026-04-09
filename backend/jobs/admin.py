from django.contrib import admin
from .models import Job, SavedJob


@admin.register(Job)
class JobAdmin(admin.ModelAdmin):
    list_display = ['title', 'company_name', 'job_type', 'remote_type', 'experience_level', 'status', 'is_featured', 'is_aggregated', 'created_at']
    list_filter = ['status', 'job_type', 'remote_type', 'experience_level', 'is_aggregated', 'is_featured']
    search_fields = ['title', 'company_name', 'description']
    list_editable = ['status', 'is_featured']
    prepopulated_fields = {'slug': ('title',)}
    filter_horizontal = ['skill_tags']
    date_hierarchy = 'created_at'


@admin.register(SavedJob)
class SavedJobAdmin(admin.ModelAdmin):
    list_display = ['user', 'job', 'saved_at']
