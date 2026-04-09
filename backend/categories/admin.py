from django.contrib import admin
from .models import Category, SkillTag


@admin.register(Category)
class CategoryAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'is_active', 'sort_order']
    list_editable = ['is_active', 'sort_order']
    prepopulated_fields = {'slug': ('name',)}


@admin.register(SkillTag)
class SkillTagAdmin(admin.ModelAdmin):
    list_display = ['name', 'slug', 'category', 'usage_count', 'is_active']
    list_filter = ['category', 'is_active']
    search_fields = ['name']
