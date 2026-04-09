from rest_framework import serializers
from .models import PaymentPlan, JobPayment


class PaymentPlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = PaymentPlan
        fields = ['id', 'tier', 'name', 'description', 'price_ngn', 'price_usd',
                  'duration_days', 'max_job_posts', 'is_featured', 'features']


class JobPaymentSerializer(serializers.ModelSerializer):
    plan_detail = PaymentPlanSerializer(source='plan', read_only=True)

    class Meta:
        model = JobPayment
        fields = ['id', 'job', 'plan', 'plan_detail', 'amount', 'currency',
                  'reference', 'status', 'channel', 'created_at', 'paid_at']
        read_only_fields = ['id', 'reference', 'status', 'channel', 'created_at', 'paid_at', 'paystack_id']


class InitiatePaymentSerializer(serializers.Serializer):
    job_id = serializers.IntegerField()
    plan_id = serializers.IntegerField()
    currency = serializers.ChoiceField(choices=['NGN', 'USD'], default='NGN')
