from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework.routers import DefaultRouter
from drf_spectacular.views import SpectacularAPIView, SpectacularSwaggerView
from rest_framework_simplejwt.views import TokenVerifyView
from users.views import UserViewSet, CookieTokenObtainPairView, CookieTokenRefreshView
from jobs.views import JobViewSet, SavedJobViewSet
from applications.views import ApplicationViewSet
from categories.views import CategoryViewSet, SkillTagViewSet
from notifications.views import NotificationViewSet, JobAlertViewSet
from aggregation.views import AggregationStatsView
from payments.views import (
    PaymentPlanListView, InitiatePaymentView, VerifyPaymentView,
    PaystackWebhookView, MyPaymentsView
)

router = DefaultRouter()
router.register(r'users', UserViewSet, basename='user')
router.register(r'jobs', JobViewSet, basename='job')
router.register(r'saved-jobs', SavedJobViewSet, basename='savedjob')
router.register(r'applications', ApplicationViewSet, basename='application')
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'skill-tags', SkillTagViewSet, basename='skilltag')
router.register(r'notifications', NotificationViewSet, basename='notification')
router.register(r'job-alerts', JobAlertViewSet, basename='jobalert')
router.register(r'my-payments', MyPaymentsView, basename='mypayment')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/v1/', include(router.urls)),
    path('api/schema/', SpectacularAPIView.as_view(), name='schema'),
    path('api/docs/', SpectacularSwaggerView.as_view(url_name='schema'), name='swagger-ui'),
    path('api/token/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    path('api/v1/aggregation/stats/', AggregationStatsView.as_view(), name='aggregation-stats'),
    path('api/v1/payment/plans/', PaymentPlanListView.as_view()),
    path('api/v1/payment/initiate/', InitiatePaymentView.as_view()),
    path('api/v1/payment/verify/', VerifyPaymentView.as_view()),
    path('api/v1/payment/webhook/', PaystackWebhookView.as_view()),
    path('api/v1/intelligence/', include('intelligence.urls')),
    path('api/v1/verification/', include('verification.urls')),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
