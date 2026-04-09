from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView

# Import ViewSets (these will be refactored in Sprint 2; for Sprint 1 keep function views working)
from users.views import create_user, login_user, get_user, update_user, delete_user, get_all_users
from jobs.views import create_job, get_all_jobs, get_job, update_job, delete_job
from applications.views import (
    create_application, get_all_applications, get_application,
    update_application, delete_application
)
from categories.views import CategoryViewSet, SkillTagViewSet
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView, TokenVerifyView

router = DefaultRouter()
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'skill-tags', SkillTagViewSet, basename='skilltag')

urlpatterns = [
    path('admin/', admin.site.urls),

    # API v1 router (ViewSets)
    path('api/v1/', include(router.urls)),

    # API docs
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),

    # Auth
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),

    # Legacy function-based views (kept for backwards compat, replaced in Sprint 2)
    path('api/users/create/', create_user),
    path('api/users/all/', get_all_users),
    path('api/users/<int:pk>/', get_user),
    path('api/users/update/<int:pk>/', update_user),
    path('api/users/delete/<int:pk>/', delete_user),
    path('api/jobs/create/', create_job),
    path('api/jobs/all/', get_all_jobs),
    path('api/jobs/<int:pk>/', get_job),
    path('api/jobs/update/<int:pk>/', update_job),
    path('api/jobs/delete/<int:pk>/', delete_job),
    path('api/applications/create/', create_application),
    path('api/applications/all/', get_all_applications),
    path('api/applications/<int:pk>/', get_application),
    path('api/applications/update/<int:pk>/', update_application),
    path('api/applications/delete/<int:pk>/', delete_application),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
