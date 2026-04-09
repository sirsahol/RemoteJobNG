from django.contrib import admin
from .models import Category, SkillTag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'created_at']
    prepopulated_fields = {'slug': ('name',)}
    search_fields = ['name']


@admin.register(SkillTag)
class SkillTagAdmin(admin.ModelAdmin):
    list_display = ['name']
    search_fields = ['name']
