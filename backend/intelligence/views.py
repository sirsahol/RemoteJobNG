from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .models import JobEmbedding, UserEmbedding, ATSMatch
from .serializers import ATSMatchSerializer
from .engine import IntelligenceEngine
from jobs.models import Job
from jobs.serializers import JobListSerializer
from django.db.models import F

# Check if pgvector is available
try:
    from pgvector.django import CosineDistance
    HAS_PGVECTOR = True
except ImportError:
    HAS_PGVECTOR = False

class JobMatchView(APIView):
    """
    Get jobs matched to the user's profile using semantic similarity.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        
        # Try to get or create embedding
        try:
            user_embedding = user.intelligence_embedding
        except Exception:
            user_embedding = IntelligenceEngine.sync_user_embedding(user)

        if not user_embedding or not user_embedding.vector:
            return Response(
                {"detail": "Neural Profile not initialized. Please update your bio/headline."},
                status=status.HTTP_400_BAD_REQUEST
            )

        if HAS_PGVECTOR:
            try:
                # High-performance Postgres vector search
                matches = JobEmbedding.objects.annotate(
                    distance=CosineDistance('vector', user_embedding.vector)
                ).order_by('distance')[:12]
                
                jobs = [m.job for m in matches]
            except Exception:
                # Fallback if DB doesn't support pgvector yet
                jobs = Job.objects.filter(is_active=True)[:12]
        else:
            # Fallback for non-postgres DB
            jobs = Job.objects.filter(is_active=True)[:12]

        serializer = JobListSerializer(jobs, many=True, context={'request': request})
        return Response(serializer.data)

class SemanticSearchView(APIView):
    """
    Search for jobs using natural language (semantic search).
    """
    def get(self, request):
        query = request.query_params.get('q', '')
        if not query:
            return Response([])

        query_vector = IntelligenceEngine.generate_embedding(query)
        if not query_vector:
            return Response({"detail": "Failed to generate search vector"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

        if HAS_PGVECTOR:
            try:
                matches = JobEmbedding.objects.annotate(
                    distance=CosineDistance('vector', query_vector)
                ).order_by('distance')[:20]
                jobs = [m.job for m in matches]
            except Exception:
                jobs = Job.objects.filter(title__icontains=query)[:20]
        else:
            # Fallback to standard search if no pgvector
            jobs = Job.objects.filter(title__icontains=query)[:20]

        serializer = JobListSerializer(jobs, many=True, context={'request': request})
        return Response(serializer.data)

class CandidateMatchView(APIView):
    """
    Rank candidates for a specific job or general employer search, 
    weighting Verified Integrity Scores.
    """
    permission_classes = [IsAuthenticated]

    def get(self, request):
        query = request.query_params.get('q', '')
        # Only employers should see this ranked view
        if request.user.role != 'employer':
            return Response({"detail": "Only employers can access the candidate match engine."}, status=403)

        if not query:
            # Default: Show high-reputation candidates
            users = User.objects.filter(role='job_seeker', is_profile_public=True).order_by('-reputation_score')[:20]
            from users.serializers import UserPublicSerializer
            return Response(UserPublicSerializer(users, many=True).data)

        query_vector = IntelligenceEngine.generate_embedding(query)
        if not query_vector:
            return Response({"detail": "Failed to generate search vector"}, status=500)

        if HAS_PGVECTOR:
            # Weighted Ranking: 70% Semantic similarity, 30% Reputation/Trust
            # Since distance is 1-similarity, we want to maximize (1-distance)*0.7 + (reputation/100)*0.3
            try:
                matches = UserEmbedding.objects.filter(
                    user__role='job_seeker', 
                    user__is_profile_public=True
                ).annotate(
                    distance=CosineDistance('vector', query_vector),
                    reputation=F('user__reputation_score')
                ).annotate(
                    # Custom ranking score (Higher is better)
                    rank_score=(1.0 - F('distance')) * 0.7 + (F('reputation') / 100.0) * 0.3
                ).order_by('-rank_score')[:20]
                
                users = [m.user for m in matches]
            except Exception as e:
                logger.error(f"Weighted search failed: {e}")
                users = User.objects.filter(role='job_seeker', bio__icontains=query)[:20]
        else:
            users = User.objects.filter(role='job_seeker', bio__icontains=query).order_by('-reputation_score')[:20]

        from users.serializers import UserPublicSerializer
        serializer = UserPublicSerializer(users, many=True, context={'request': request})
        return Response(serializer.data)
