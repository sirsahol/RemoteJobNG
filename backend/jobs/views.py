from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny, IsAuthenticatedOrReadOnly
from django_filters.rest_framework import DjangoFilterBackend
from django.utils import timezone
from .models import Job, SavedJob
from .serializers import JobListSerializer, JobDetailSerializer, JobWriteSerializer, SavedJobSerializer
from .filters import JobFilter


class JobViewSet(viewsets.ModelViewSet):
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_class = JobFilter
    search_fields = ['title', 'company_name', 'description', 'location', 'skill_tags__name']
    ordering_fields = ['created_at', 'published_at', 'view_count', 'application_count', 'salary_min']
    ordering = ['-is_featured', '-published_at', '-created_at']

    def get_queryset(self):
        qs = Job.objects.filter(is_active=True, status='active').select_related('category').prefetch_related('skill_tags')
        # Employers can see their own draft/paused jobs
        if self.request.user.is_authenticated and self.request.user.role == 'employer':
            if self.request.query_params.get('mine') == 'true':
                qs = Job.objects.filter(employer=self.request.user).select_related('category').prefetch_related('skill_tags')
        return qs

    def get_serializer_class(self):
        if self.action == 'list':
            return JobListSerializer
        if self.action in ['create', 'update', 'partial_update']:
            return JobWriteSerializer
        return JobDetailSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        if self.action == 'create':
            return [IsAuthenticated()]
        if self.action in ['update', 'partial_update', 'destroy']:
            return [IsAuthenticated()]
        return [IsAuthenticatedOrReadOnly()]

    def perform_create(self, serializer):
        serializer.save(
            employer=self.request.user,
            published_at=timezone.now(),
            status='active'
        )

    def retrieve(self, request, *args, **kwargs):
        instance = self.get_object()
        # Increment view count
        Job.objects.filter(pk=instance.pk).update(view_count=instance.view_count + 1)
        serializer = self.get_serializer(instance)
        return Response(serializer.data)

    def update(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.employer != request.user and not request.user.is_staff:
            return Response({'error': 'You do not own this job listing.'}, status=status.HTTP_403_FORBIDDEN)
        return super().update(request, *args, **kwargs)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        if instance.employer != request.user and not request.user.is_staff:
            return Response({'error': 'You do not own this job listing.'}, status=status.HTTP_403_FORBIDDEN)
        instance.status = 'closed'
        instance.is_active = False
        instance.save()
        return Response({'message': 'Job closed successfully.'}, status=status.HTTP_200_OK)

    @action(detail=False, methods=['get'], permission_classes=[IsAuthenticated], url_path='my-jobs')
    def my_jobs(self, request):
        """Employer: list all their own job postings (all statuses)."""
        if request.user.role != 'employer':
            return Response({'error': 'Only employers can access this endpoint.'}, status=status.HTTP_403_FORBIDDEN)
        jobs = Job.objects.filter(employer=request.user).select_related('category').prefetch_related('skill_tags')
        serializer = JobListSerializer(jobs, many=True, context={'request': request})
        return Response(serializer.data)

    @action(detail=True, methods=['get'], permission_classes=[IsAuthenticated], url_path='applicants')
    def applicants(self, request, pk=None):
        """Employer: view all applicants for a specific job."""
        job = self.get_object()
        if job.employer != request.user and not request.user.is_staff:
            return Response({'error': 'Permission denied.'}, status=status.HTTP_403_FORBIDDEN)
        from applications.serializers import ApplicationSerializer
        applications = job.applications.select_related('applicant').order_by('-applied_at')
        serializer = ApplicationSerializer(applications, many=True)
        return Response(serializer.data)


class SavedJobViewSet(viewsets.ModelViewSet):
    serializer_class = SavedJobSerializer
    permission_classes = [IsAuthenticated]
    http_method_names = ['get', 'post', 'delete']

    def get_queryset(self):
        return SavedJob.objects.filter(user=self.request.user).select_related('job__category').prefetch_related('job__skill_tags')

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    def create(self, request, *args, **kwargs):
        # Allow toggle: if already saved, unsave it
        job_id = request.data.get('job_id')
        existing = SavedJob.objects.filter(user=request.user, job_id=job_id).first()
        if existing:
            existing.delete()
            return Response({'saved': False}, status=status.HTTP_200_OK)
        return super().create(request, *args, **kwargs)
