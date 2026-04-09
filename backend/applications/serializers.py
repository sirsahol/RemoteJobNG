from rest_framework import serializers
from .models import Application
from jobs.serializers import JobListSerializer
from users.serializers import UserPublicSerializer


class ApplicationSerializer(serializers.ModelSerializer):
    job_detail = JobListSerializer(source='job', read_only=True)
    applicant_detail = UserPublicSerializer(source='applicant', read_only=True)

    class Meta:
        model = Application
        fields = [
            'id', 'job', 'job_detail', 'applicant', 'applicant_detail',
            'cover_letter', 'resume', 'resume_url',
            'applicant_name', 'applicant_email',
            'status', 'is_withdrawn', 'withdrawn_at',
            'interview_date', 'interview_notes',
            'applied_at', 'updated_at',
        ]
        read_only_fields = [
            'id', 'applicant', 'status', 'is_withdrawn', 'withdrawn_at',
            'interview_date', 'interview_notes', 'applied_at', 'updated_at',
            'job_detail', 'applicant_detail',
        ]


class ApplicationCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Application
        fields = ['job', 'cover_letter', 'resume', 'applicant_name', 'applicant_email']


class ApplicationStatusUpdateSerializer(serializers.ModelSerializer):
    """Employer-only: update status, interview date, notes."""
    class Meta:
        model = Application
        fields = ['status', 'interview_date', 'employer_notes', 'interview_notes']
