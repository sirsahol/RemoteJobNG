from django.db import models
from django.utils.text import slugify


class Category(models.Model):
    """Top-level job categories (e.g. Technology, Design, Marketing)."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    description = models.TextField(blank=True)
    icon = models.CharField(max_length=50, blank=True)  # emoji or icon name
    is_active = models.BooleanField(default=True)
    sort_order = models.PositiveSmallIntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        verbose_name_plural = 'categories'
        ordering = ['sort_order', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name


class SkillTag(models.Model):
    """Skill tags used on both jobs and user profiles (e.g. Python, React, SEO)."""
    name = models.CharField(max_length=100, unique=True)
    slug = models.SlugField(max_length=100, unique=True, blank=True)
    category = models.ForeignKey(
        Category, on_delete=models.SET_NULL, null=True, blank=True, related_name='skill_tags'
    )
    is_active = models.BooleanField(default=True)
    usage_count = models.PositiveIntegerField(default=0)  # denormalized counter for perf

    class Meta:
        ordering = ['-usage_count', 'name']

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = slugify(self.name)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
