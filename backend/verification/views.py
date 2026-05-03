from rest_framework import viewsets, permissions, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import FileResponse, HttpResponseForbidden
import os
import mimetypes
from .models import VerificationRequest, TrustBadge, UserBadge
from .serializers import VerificationRequestSerializer, TrustBadgeSerializer, UserBadgeSerializer

class VerificationRequestViewSet(viewsets.ModelViewSet):
    serializer_class = VerificationRequestSerializer
    permission_classes = [permissions.IsAuthenticated]

    @action(detail=False, methods=['get'], url_path='admin/requests', permission_classes=[permissions.IsAdminUser])
    def admin_list(self, request):
        """Dedicated endpoint for administrative review of all requests."""
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data)

    def get_queryset(self):
        if self.request.user.is_staff:
            return VerificationRequest.objects.all()
        return VerificationRequest.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def approve(self, request, pk=None):
        verification_request = self.get_object()
        verification_request.status = 'VERIFIED'
        verification_request.save()
        
        # Update user trust signals
        user = verification_request.user
        user.is_verified = True
        
        # Increase reputation score based on verification type
        bonus = {
            'IDENTITY': 15,
            'INFRASTRUCTURE': 20,
            'SKILL': 10,
            'COMPANY': 25
        }.get(verification_request.request_type, 10)
        
        user.reputation_score = min(100, user.reputation_score + bonus)
        user.save()

        # Assign badge
        badge_slug_map = {
            'IDENTITY': 'verified-id',
            'INFRASTRUCTURE': 'infrastructure-pro',
            'SKILL': 'certified-expert',
            'COMPANY': 'verified-business'
        }
        
        slug = badge_slug_map.get(verification_request.request_type)
        if slug:
            try:
                badge = TrustBadge.objects.get(slug=slug)
                UserBadge.objects.get_or_create(user=verification_request.user, badge=badge)
            except TrustBadge.DoesNotExist:
                pass
                
        return Response({'status': 'verified'})

    @action(detail=True, methods=['post'], permission_classes=[permissions.IsAdminUser])
    def reject(self, request, pk=None):
        verification_request = self.get_object()
        verification_request.status = 'REJECTED'
        verification_request.notes = request.data.get('notes', '')
        verification_request.save()
        return Response({'status': 'rejected'})

    @action(detail=True, methods=['get'])
    def download_evidence(self, request, pk=None):
        """
        Securely serve the evidence file.
        Only the owner of the request or a staff member can download it.
        """
        verification_request = self.get_object()
        
        # Security check: already handled by get_object + get_queryset
        # but being explicit for sensitive data is good.
        if not request.user.is_staff and verification_request.user != request.user:
            return Response(
                {"detail": "You do not have permission to access this file."},
                status=status.HTTP_403_FORBIDDEN
            )

        if not verification_request.evidence:
            return Response(
                {"detail": "No evidence file provided for this request."},
                status=status.HTTP_404_NOT_FOUND
            )

        file_path = verification_request.evidence.path
        if not os.path.exists(file_path):
            return Response(
                {"detail": "File not found on server."},
                status=status.HTTP_404_NOT_FOUND
            )

        content_type, _ = mimetypes.guess_type(file_path)
        response = FileResponse(open(file_path, 'rb'), content_type=content_type)
        response['Content-Disposition'] = f'attachment; filename="{os.path.basename(file_path)}"'
        return response

class BadgeViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = TrustBadge.objects.filter(is_active=True)
    serializer_class = TrustBadgeSerializer
    permission_classes = [permissions.AllowAny]

    @action(detail=False, methods=['get'], permission_classes=[permissions.IsAuthenticated])
    def my_badges(self, request):
        badges = UserBadge.objects.filter(user=request.user)
        serializer = UserBadgeSerializer(badges, many=True)
        return Response(serializer.data)
