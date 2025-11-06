from django.contrib import admin
from .models import User


class UserAdmin(admin.ModelAdmin):
    list_display = ('username', 'email', 'role', 'is_active')
    search_fields = ('username', 'email')
    list_filter = ('role', 'is_active')

admin.site.register(User, UserAdmin)
