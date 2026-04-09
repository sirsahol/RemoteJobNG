from django.contrib import admin
from .models import Job, SavedJob


class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'employer', 'location', 'job_type', 'remote_type', 'status', 'created_at')
    search_fields = ('title', 'employer__username', 'location', 'company_name')
    list_filter = ('job_type', 'remote_type', 'status', 'is_featured', 'created_at')

admin.site.register(Job, JobAdmin)
admin.site.register(SavedJob)
