from django.contrib import admin
from .models import FetchLog


@admin.register(FetchLog)
class FetchLogAdmin(admin.ModelAdmin):
    list_display = ['source', 'status', 'jobs_fetched', 'jobs_created', 'jobs_skipped', 'started_at', 'duration_seconds']
    list_filter = ['source', 'status']
    readonly_fields = ['started_at', 'completed_at', 'jobs_fetched', 'jobs_created', 'jobs_skipped', 'jobs_updated']
    ordering = ['-started_at']
