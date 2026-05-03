from rest_framework import viewsets, status, filters
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django_filters.rest_framework import DjangoFilterBackend
from django.conf import settings
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .models import User, UserSkill
from .serializers import UserPublicSerializer, UserPrivateSerializer, UserCreateSerializer, UserSkillSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.filter(is_active=True, is_profile_public=True)
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    filterset_fields = ['role', 'availability']
    search_fields = ['username', 'headline', 'bio', 'company_name', 'location']
    ordering_fields = ['created_at', 'username']
    ordering = ['-created_at']

    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        if self.action in ['retrieve', 'update', 'partial_update', 'me']:
            # Private view for own profile, public for others
            if self.request.user.is_authenticated:
                try:
                    obj = self.get_object()
                    if obj == self.request.user:
                        return UserPrivateSerializer
                except Exception:
                    # Object lookup may fail for list/create actions; fall through to default serializer
                    pass
            return UserPrivateSerializer  # fallback for /me/
        return UserPublicSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [AllowAny()]
        if self.action in ['list', 'retrieve']:
            return [AllowAny()]
        if self.action in ['update', 'partial_update', 'me', 'add_skill', 'remove_skill']:
            return [IsAuthenticated()]
        if self.action == 'destroy':
            return [IsAdminUser()]
        return [IsAuthenticated()]

    def get_queryset(self):
        qs = User.objects.filter(is_active=True)
        # Non-admins only see public profiles
        if not (self.request.user.is_authenticated and self.request.user.is_staff):
            qs = qs.filter(is_profile_public=True)
        return qs

    @action(detail=False, methods=['get', 'put', 'patch'], permission_classes=[IsAuthenticated])
    def me(self, request):
        """Get or update the currently authenticated user's profile."""
        user = request.user
        if request.method == 'GET':
            serializer = UserPrivateSerializer(user)
            return Response(serializer.data)
        serializer = UserPrivateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['post'], permission_classes=[IsAuthenticated], url_path='me/skills')
    def add_skill(self, request):
        """Add a skill to the current user's profile."""
        serializer = UserSkillSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['delete'], permission_classes=[IsAuthenticated], url_path='me/skills/(?P<skill_id>[^/.]+)')
    def remove_skill(self, request, skill_id=None):
        """Remove a skill from the current user's profile."""
        try:
            skill = UserSkill.objects.get(id=skill_id, user=request.user)
            skill.delete()
            return Response(status=status.HTTP_204_NO_CONTENT)
        except UserSkill.DoesNotExist:
            return Response({'error': 'Skill not found'}, status=status.HTTP_404_NOT_FOUND)

    def perform_create(self, serializer):
        serializer.save()

    @action(detail=False, methods=['post'], permission_classes=[AllowAny])
    def logout(self, request):
        """Logout by clearing cookies."""
        response = Response({"detail": "Successfully logged out."}, status=status.HTTP_200_OK)
        response.delete_cookie(settings.SIMPLE_JWT['AUTH_COOKIE'])
        response.delete_cookie(settings.SIMPLE_JWT['REFRESH_COOKIE'])
        return response

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            refresh_token = response.data.get('refresh')
            
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
            response.set_cookie(
                key=settings.SIMPLE_JWT['REFRESH_COOKIE'],
                value=refresh_token,
                expires=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
        return response

class CookieTokenRefreshView(TokenRefreshView):
    def post(self, request, *args, **kwargs):
        # Look for refresh token in cookies if not in body
        if 'refresh' not in request.data:
            refresh_token = request.COOKIES.get(settings.SIMPLE_JWT['REFRESH_COOKIE'])
            if refresh_token:
                # We need to inject it into request.data which is usually immutable QueryDict
                # but in DRF it might be a dict or we can copy it.
                data = request.data.copy()
                data['refresh'] = refresh_token
                request._full_data = data
                
        response = super().post(request, *args, **kwargs)
        if response.status_code == 200:
            access_token = response.data.get('access')
            
            response.set_cookie(
                key=settings.SIMPLE_JWT['AUTH_COOKIE'],
                value=access_token,
                expires=settings.SIMPLE_JWT['ACCESS_TOKEN_LIFETIME'],
                secure=settings.SIMPLE_JWT['AUTH_COOKIE_SECURE'],
                httponly=settings.SIMPLE_JWT['AUTH_COOKIE_HTTP_ONLY'],
                samesite=settings.SIMPLE_JWT['AUTH_COOKIE_SAMESITE']
            )
        return response
