import django_filters
from .models import Job


class JobFilter(django_filters.FilterSet):
    title = django_filters.CharFilter(field_name='title', lookup_expr='icontains')
    company = django_filters.CharFilter(field_name='company_name', lookup_expr='icontains')
    location = django_filters.CharFilter(field_name='location', lookup_expr='icontains')
    category = django_filters.NumberFilter(field_name='category__id')
    category_slug = django_filters.CharFilter(field_name='category__slug')
    skill = django_filters.CharFilter(method='filter_by_skill')
    job_type = django_filters.MultipleChoiceFilter(choices=Job.JOB_TYPE_CHOICES)
    remote_type = django_filters.MultipleChoiceFilter(choices=Job.REMOTE_TYPE_CHOICES)
    experience_level = django_filters.MultipleChoiceFilter(choices=Job.EXPERIENCE_LEVEL_CHOICES)
    salary_min = django_filters.NumberFilter(field_name='salary_min', lookup_expr='gte')
    salary_max = django_filters.NumberFilter(field_name='salary_max', lookup_expr='lte')
    salary_currency = django_filters.CharFilter(field_name='salary_currency')
    is_featured = django_filters.BooleanFilter(field_name='is_featured')
    is_aggregated = django_filters.BooleanFilter(field_name='is_aggregated')
    posted_after = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='gte')
    posted_before = django_filters.DateTimeFilter(field_name='created_at', lookup_expr='lte')

    class Meta:
        model = Job
        fields = [
            'job_type', 'remote_type', 'experience_level', 'salary_currency',
            'is_featured', 'is_aggregated', 'category',
        ]

    def filter_by_skill(self, queryset, name, value):
        return queryset.filter(skill_tags__name__icontains=value).distinct()
