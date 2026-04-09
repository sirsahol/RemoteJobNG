from django.contrib import admin
from .models import PaymentPlan, JobPayment


@admin.register(PaymentPlan)
class PaymentPlanAdmin(admin.ModelAdmin):
    list_display = ['tier', 'name', 'price_ngn', 'price_usd', 'duration_days', 'is_featured', 'is_active']
    list_editable = ['is_active', 'is_featured']


@admin.register(JobPayment)
class JobPaymentAdmin(admin.ModelAdmin):
    list_display = ['employer', 'job', 'plan', 'amount', 'currency', 'status', 'channel', 'created_at', 'paid_at']
    list_filter = ['status', 'currency', 'channel']
    search_fields = ['reference', 'employer__username']
    readonly_fields = ['reference', 'paystack_id', 'paystack_response', 'paid_at']
