from django.contrib import admin
from .models import Job


class JobAdmin(admin.ModelAdmin):
    list_display = ('title', 'employer', 'location', 'job_type', 'salary', 'created_at')
    search_fields = ('title', 'employer__username', 'location')
    list_filter = ('job_type', 'created_at')

admin.site.register(Job, JobAdmin)
