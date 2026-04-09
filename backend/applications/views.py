from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from django.utils import timezone
from django_filters.rest_framework import DjangoFilterBackend
from .models import Application
from .serializers import ApplicationSerializer, ApplicationCreateSerializer, ApplicationStatusUpdateSerializer


class ApplicationViewSet(viewsets.ModelViewSet):
    parser_classes = [MultiPartParser, FormParser, JSONParser]
    filter_backends = [DjangoFilterBackend, filters.OrderingFilter]
    filterset_fields = ['status', 'job']
    ordering_fields = ['applied_at', 'status']
    ordering = ['-applied_at']

    def get_queryset(self):
        user = self.request.user
        if not user.is_authenticated:
            return Application.objects.none()
        if user.is_staff:
            return Application.objects.all().select_related('job', 'applicant')
        if user.role == 'employer':
            # Employer sees applications to their jobs
            return Application.objects.filter(job__employer=user).select_related('job', 'applicant')
        # Job seeker sees their own applications
        return Application.objects.filter(applicant=user).select_related('job', 'applicant')

    def get_serializer_class(self):
        if self.action == 'create':
            return ApplicationCreateSerializer
        if self.action == 'update_status':
            return ApplicationStatusUpdateSerializer
        return ApplicationSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [IsAuthenticatedOrReadOnly()]
        return [IsAuthenticated()]

    def perform_create(self, serializer):
        applicant = self.request.user if self.request.user.is_authenticated else None
        application = serializer.save(applicant=applicant)
        # Increment application_count on job
        from jobs.models import Job
        Job.objects.filter(pk=application.job.pk).update(
            application_count=application.job.application_count + 1
        )

    @action(detail=True, methods=['patch'], permission_classes=[IsAuthenticated], url_path='status')
    def update_status(self, request, pk=None):
        """Employer: update application status."""
        application = self.get_object()
        if application.job.employer != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        serializer = ApplicationStatusUpdateSerializer(application, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=True, methods=['post'], permission_classes=[IsAuthenticated], url_path='withdraw')
    def withdraw(self, request, pk=None):
        """Job seeker: withdraw their application."""
        application = self.get_object()
        if application.applicant != request.user:
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        if application.is_withdrawn:
            return Response({'error': 'Application already withdrawn.'}, status=status.HTTP_400_BAD_REQUEST)
        application.is_withdrawn = True
        application.withdrawn_at = timezone.now()
        application.status = 'withdrawn'
        application.save()
        return Response({'message': 'Application withdrawn successfully.'})
