from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import VerificationRequestViewSet, BadgeViewSet

router = DefaultRouter()
router.register(r'requests', VerificationRequestViewSet, basename='verification-request')
router.register(r'badges', BadgeViewSet, basename='badge')

urlpatterns = [
    path('', include(router.urls)),
]
