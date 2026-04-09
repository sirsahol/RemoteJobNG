from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import FetchLog
from jobs.models import Job


class AggregationStatsView(APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        recent_logs = FetchLog.objects.all()[:20]
        return Response({
            "total_aggregated_jobs": Job.objects.filter(is_aggregated=True, is_active=True).count(),
            "total_manual_jobs": Job.objects.filter(is_aggregated=False, is_active=True).count(),
            "recent_fetches": [
                {
                    "source": log.source,
                    "status": log.status,
                    "created": log.jobs_created,
                    "skipped": log.jobs_skipped,
                    "started": log.started_at,
                    "duration": log.duration_seconds,
                }
                for log in recent_logs
            ]
        })
