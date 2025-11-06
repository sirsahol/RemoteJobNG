from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Job
from .serializers import JobSerializer

# Create a new job (only for logged-in users)
@api_view(['POST'])
def create_job(request):
    serializer = JobSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save(employer=request.user)  # 👈 Add this line
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Get all jobs
@api_view(['GET'])
def get_all_jobs(request):
    jobs = Job.objects.all()
    serializer = JobSerializer(jobs, many=True)
    return Response(serializer.data)


# Get a single job by ID
@api_view(['GET'])
def get_job(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
    
    serializer = JobSerializer(job)
    return Response(serializer.data)


# Update a job by ID
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_job(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
    
    
    if job.employer != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    serializer = JobSerializer(job, data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# Delete a job by ID
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_job(request, pk):
    try:
        job = Job.objects.get(pk=pk)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)
    
   
    if job.employer != request.user:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    job.delete()
    return Response({'message': 'Job deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
