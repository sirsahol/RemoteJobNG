from rest_framework import serializers
from .models import Job, SavedJob
from categories.serializers import CategoryListSerializer, SkillTagSerializer


class JobListSerializer(serializers.ModelSerializer):
    """Lightweight serializer for job listing cards."""
    category = CategoryListSerializer(read_only=True)
    skill_tags = SkillTagSerializer(many=True, read_only=True)
    is_saved = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'slug', 'title', 'company_name', 'company_logo_url',
            'location', 'country', 'job_type', 'remote_type', 'experience_level',
            'salary_min', 'salary_max', 'salary_currency', 'is_salary_public',
            'category', 'skill_tags', 'is_featured', 'is_aggregated',
            'source_name', 'application_count', 'view_count',
            'published_at', 'created_at', 'deadline', 'is_saved',
        ]

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False


class JobDetailSerializer(serializers.ModelSerializer):
    """Full serializer for job detail page."""
    category = CategoryListSerializer(read_only=True)
    skill_tags = SkillTagSerializer(many=True, read_only=True)
    is_saved = serializers.SerializerMethodField()
    has_applied = serializers.SerializerMethodField()

    class Meta:
        model = Job
        fields = [
            'id', 'slug', 'title', 'company_name', 'company_logo_url',
            'company_website', 'location', 'country', 'timezone_requirement',
            'job_type', 'remote_type', 'experience_level',
            'description', 'responsibilities', 'requirements', 'nice_to_have',
            'salary_min', 'salary_max', 'salary_currency', 'is_salary_public',
            'category', 'skill_tags',
            'application_url', 'apply_email',
            'is_featured', 'is_aggregated', 'source_name', 'source_url',
            'application_count', 'view_count',
            'status', 'deadline', 'published_at', 'created_at', 'updated_at',
            'is_saved', 'has_applied',
        ]

    def get_is_saved(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return SavedJob.objects.filter(user=request.user, job=obj).exists()
        return False

    def get_has_applied(self, obj):
        request = self.context.get('request')
        if request and request.user.is_authenticated:
            return obj.applications.filter(applicant=request.user).exists()
        return False


class JobWriteSerializer(serializers.ModelSerializer):
    """Serializer for creating and updating jobs (employer only)."""
    skill_tag_ids = serializers.ListField(
        child=serializers.IntegerField(), write_only=True, required=False
    )

    class Meta:
        model = Job
        fields = [
            'title', 'company_name', 'company_logo_url', 'company_website',
            'description', 'responsibilities', 'requirements', 'nice_to_have',
            'category', 'skill_tag_ids', 'job_type', 'remote_type', 'experience_level',
            'location', 'country', 'timezone_requirement',
            'salary_min', 'salary_max', 'salary_currency', 'is_salary_public',
            'application_url', 'apply_email', 'deadline', 'status',
        ]

    def create(self, validated_data):
        skill_tag_ids = validated_data.pop('skill_tag_ids', [])
        job = Job.objects.create(**validated_data)
        if skill_tag_ids:
            job.skill_tags.set(skill_tag_ids)
        return job

    def update(self, instance, validated_data):
        skill_tag_ids = validated_data.pop('skill_tag_ids', None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        if skill_tag_ids is not None:
            instance.skill_tags.set(skill_tag_ids)
        return instance


class SavedJobSerializer(serializers.ModelSerializer):
    job = JobListSerializer(read_only=True)
    job_id = serializers.IntegerField(write_only=True)

    class Meta:
        model = SavedJob
        fields = ['id', 'job', 'job_id', 'saved_at']
        read_only_fields = ['id', 'saved_at']
