from rest_framework import serializers
from .models import VerificationRequest, TrustBadge, UserBadge

from users.serializers import UserPublicSerializer

class TrustBadgeSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrustBadge
        fields = '__all__'

class UserBadgeSerializer(serializers.ModelSerializer):
    badge = TrustBadgeSerializer(read_only=True)
    
    class Meta:
        model = UserBadge
        fields = ['id', 'badge', 'verified_at', 'metadata']

class VerificationRequestSerializer(serializers.ModelSerializer):
    user = UserPublicSerializer(read_only=True)
    evidence = serializers.SerializerMethodField()
    
    class Meta:
        model = VerificationRequest
        fields = [
            'id', 'user', 'request_type', 'status', 
            'evidence', 'document_url', 'metadata', 'notes', 
            'rejection_reason', 'created_at', 'updated_at'
        ]
        read_only_fields = ['status', 'created_at', 'updated_at']

    def get_evidence(self, obj):
        if not obj.evidence:
            return None
        request = self.context.get('request')
        if request:
            # Generate the URL for the download_evidence action
            return request.build_absolute_uri(
                f"/api/v1/verification/requests/{obj.id}/download_evidence/"
            )
        return None
