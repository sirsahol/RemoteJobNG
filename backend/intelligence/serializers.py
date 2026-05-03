from rest_framework import serializers
from .models import ATSMatch
from jobs.serializers import JobListSerializer

class ATSMatchSerializer(serializers.ModelSerializer):
    job = JobListSerializer(read_only=True)

    class Meta:
        model = ATSMatch
        fields = ['id', 'job', 'score', 'analysis', 'created_at']
