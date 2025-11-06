from django.contrib import admin
from .models import Application

class ApplicationAdmin(admin.ModelAdmin):
    list_display = ('job', 'applicant', 'status', 'applied_at')
    search_fields = ('job__title', 'applicant__username')
    list_filter = ('status', 'applied_at')

admin.site.register(Application, ApplicationAdmin)
