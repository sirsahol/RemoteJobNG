from rest_framework.views import APIView
from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework import status
from django.conf import settings
from django.utils import timezone
import json
import logging

from .models import PaymentPlan, JobPayment
from .serializers import PaymentPlanSerializer, JobPaymentSerializer, InitiatePaymentSerializer
from .services import initialize_transaction, verify_transaction, generate_reference, verify_webhook_signature
from jobs.models import Job

logger = logging.getLogger(__name__)


class PaymentPlanListView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        plans = PaymentPlan.objects.filter(is_active=True)
        serializer = PaymentPlanSerializer(plans, many=True)
        return Response(serializer.data)


class InitiatePaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        serializer = InitiatePaymentSerializer(data=request.data)
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        job_id = serializer.validated_data['job_id']
        plan_id = serializer.validated_data['plan_id']
        currency = serializer.validated_data.get('currency', 'NGN')

        try:
            job = Job.objects.get(pk=job_id, employer=request.user)
            plan = PaymentPlan.objects.get(pk=plan_id, is_active=True)
        except (Job.DoesNotExist, PaymentPlan.DoesNotExist) as e:
            return Response({'error': str(e)}, status=status.HTTP_404_NOT_FOUND)

        reference = generate_reference()
        amount_ngn = plan.price_ngn
        amount_kobo = int(amount_ngn * 100)

        callback_url = f"{getattr(settings, 'FRONTEND_URL', 'https://remoteworknaija.com')}/payment/verify?reference={reference}"

        paystack_response = initialize_transaction(
            email=request.user.email,
            amount_kobo=amount_kobo,
            reference=reference,
            callback_url=callback_url,
            metadata={"job_id": job_id, "plan_id": plan_id, "user_id": request.user.id}
        )

        if paystack_response.get("status"):
            JobPayment.objects.create(
                employer=request.user,
                job=job,
                plan=plan,
                amount=amount_ngn,
                currency=currency,
                reference=reference,
                status='pending',
            )
            return Response({
                "authorization_url": paystack_response["data"]["authorization_url"],
                "reference": reference,
            })

        return Response({'error': paystack_response.get('message', 'Payment initiation failed.')},
                        status=status.HTTP_502_BAD_GATEWAY)


class VerifyPaymentView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        reference = request.data.get('reference')
        if not reference:
            return Response({'error': 'Reference required.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payment = JobPayment.objects.get(reference=reference, employer=request.user)
        except JobPayment.DoesNotExist:
            return Response({'error': 'Payment record not found.'}, status=status.HTTP_404_NOT_FOUND)

        paystack_response = verify_transaction(reference)
        if paystack_response.get("status") and paystack_response["data"]["status"] == "success":
            payment.status = "success"
            payment.paystack_id = str(paystack_response["data"].get("id", ""))
            payment.channel = paystack_response["data"].get("channel", "")
            payment.paid_at = timezone.now()
            payment.paystack_response = paystack_response["data"]
            payment.save()

            # Activate the job and mark as featured if plan includes it
            if payment.job and payment.plan:
                payment.job.status = 'active'
                payment.job.is_active = True
                if payment.plan.is_featured:
                    payment.job.is_featured = True
                payment.job.save()

            return Response({'status': 'success', 'message': 'Payment verified. Job is now live.'})

        payment.status = 'failed'
        payment.save()
        return Response({'status': 'failed', 'message': 'Payment verification failed.'}, status=status.HTTP_400_BAD_REQUEST)


class PaystackWebhookView(APIView):
    """Receive Paystack webhook events."""
    permission_classes = [AllowAny]

    def post(self, request):
        signature = request.META.get('HTTP_X_PAYSTACK_SIGNATURE', '')
        if not verify_webhook_signature(request.body, signature):
            return Response({'error': 'Invalid signature'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            payload = json.loads(request.body)
        except json.JSONDecodeError:
            return Response({'error': 'Invalid JSON'}, status=status.HTTP_400_BAD_REQUEST)

        event = payload.get('event')
        data = payload.get('data', {})

        if event == 'charge.success':
            reference = data.get('reference')
            try:
                payment = JobPayment.objects.get(reference=reference)
                if payment.status != 'success':
                    payment.status = 'success'
                    payment.paid_at = timezone.now()
                    payment.paystack_response = data
                    payment.save()
                    if payment.job and payment.plan:
                        payment.job.status = 'active'
                        payment.job.is_active = True
                        if payment.plan.is_featured:
                            payment.job.is_featured = True
                        payment.job.save()
                    logger.info(f"[Webhook] Payment {reference} confirmed via webhook.")
            except JobPayment.DoesNotExist:
                logger.warning(f"[Webhook] Payment {reference} not found in DB.")

        return Response({'received': True})


class MyPaymentsView(ReadOnlyModelViewSet):
    serializer_class = JobPaymentSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return JobPayment.objects.filter(employer=self.request.user).select_related('plan', 'job')
