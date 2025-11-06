from django.contrib import admin
from django.urls import path
from users.views import (
    create_user, get_all_users, get_user, update_user, delete_user
)
from jobs.views import (
    create_job, get_all_jobs, get_job, update_job, delete_job
)
from applications.views import (
    create_application, get_all_applications, get_application, update_application, delete_application
)
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path('admin/', admin.site.urls),

    # Users endpoints
    path('api/users/create/', create_user),
    path('api/users/all/', get_all_users),
    path('api/users/<int:pk>/', get_user),
    path('api/users/update/<int:pk>/', update_user),
    path('api/users/delete/<int:pk>/', delete_user),

    # Jobs endpoints
    path('api/jobs/create/', create_job),
    path('api/jobs/all/', get_all_jobs),
    path('api/jobs/<int:pk>/', get_job),
    path('api/jobs/update/<int:pk>/', update_job),
    path('api/jobs/delete/<int:pk>/', delete_job),

    # Applications endpoints
    path('api/applications/create/', create_application),
    path('api/applications/all/', get_all_applications),
    path('api/applications/<int:pk>/', get_application),
    path('api/applications/update/<int:pk>/', update_application),
    path('api/applications/delete/<int:pk>/', delete_application),

    # JWT authentication endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),  
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),  
]
