from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticatedOrReadOnly
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.response import Response
from rest_framework import status
from .models import Application
from .serializers import ApplicationSerializer
from jobs.models import Job

# ✅ Create an application (user applies for a job, public or logged-in)
@api_view(['POST'])
@permission_classes([IsAuthenticatedOrReadOnly])
@parser_classes([MultiPartParser, FormParser])
def create_application(request):
    try:
        job_id = request.data.get('job')
        job = Job.objects.get(id=job_id)
    except Job.DoesNotExist:
        return Response({'error': 'Job not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ApplicationSerializer(data=request.data)
    if serializer.is_valid():
        # If user is authenticated, attach applicant. Else, None (public apply)
        applicant = request.user if request.user.is_authenticated else None
        serializer.save(applicant=applicant, job=job)
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Get all applications
@api_view(['GET'])
def get_all_applications(request):
    applications = Application.objects.all()
    serializer = ApplicationSerializer(applications, many=True)
    return Response(serializer.data)


# ✅ Get single application by ID
@api_view(['GET'])
def get_application(request, pk):
    try:
        application = Application.objects.get(pk=pk)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ApplicationSerializer(application)
    return Response(serializer.data)


# ✅ Update an application (e.g. cover_letter or resume)
@api_view(['PUT'])
@parser_classes([MultiPartParser, FormParser])
def update_application(request, pk):
    try:
        application = Application.objects.get(pk=pk)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    serializer = ApplicationSerializer(application, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ✅ Delete an application
@api_view(['DELETE'])
def delete_application(request, pk):
    try:
        application = Application.objects.get(pk=pk)
    except Application.DoesNotExist:
        return Response({'error': 'Application not found'}, status=status.HTTP_404_NOT_FOUND)

    application.delete()
    return Response({'message': 'Application deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
