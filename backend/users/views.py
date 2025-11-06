from django.shortcuts import render
from django.contrib.auth.hashers import make_password
from django.contrib.auth import authenticate
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework import status
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from .models import User
from .serializers import UserSerializer


# -------------------------------
# Signup / Create user (Public)
# -------------------------------
@api_view(['POST'])
def create_user(request):
    data = request.data.copy()
    data['password'] = make_password(data['password'])
    serializer = UserSerializer(data=data)

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# Login user (Public)
# -------------------------------
@api_view(['POST'])
def login_user(request):
    username = request.data.get('username')
    password = request.data.get('password')

    if not username or not password:
        return Response({'error': 'Username and password are required'}, status=status.HTTP_400_BAD_REQUEST)

    user = authenticate(username=username, password=password)
    if user:
        refresh = RefreshToken.for_user(user)
        return Response({
            'refresh': str(refresh),
            'access': str(refresh.access_token),
        })
    else:
        return Response({'detail': 'No active account found with the given credentials'}, status=status.HTTP_401_UNAUTHORIZED)


# -------------------------------
# Get all users (Admin only)
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAdminUser])
def get_all_users(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)


# -------------------------------
# Get single user (Authenticated)
# -------------------------------
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Restrict to own profile unless admin
    if request.user != user and not request.user.is_staff:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    serializer = UserSerializer(user)
    return Response(serializer.data)


# -------------------------------
# Update user (Authenticated)
# -------------------------------
@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    # Restrict to own profile unless admin
    if request.user != user and not request.user.is_staff:
        return Response({'error': 'Permission denied'}, status=status.HTTP_403_FORBIDDEN)

    serializer = UserSerializer(user, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# -------------------------------
# Delete user (Admin only)
# -------------------------------
@api_view(['DELETE'])
@permission_classes([IsAdminUser])
def delete_user(request, pk):
    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response({'error': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

    user.delete()
    return Response({'message': 'User deleted successfully'}, status=status.HTTP_204_NO_CONTENT)
