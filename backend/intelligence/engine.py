import logging
from django.conf import settings
from sentence_transformers import SentenceTransformer
from .models import JobEmbedding, UserEmbedding

logger = logging.getLogger(__name__)

class IntelligenceEngine:
    _model = None

    @classmethod
    def get_model(cls):
        if cls._model is None:
            # Using a lightweight, high-performance model
            cls._model = SentenceTransformer('all-MiniLM-L6-v2')
        return cls._model

    @classmethod
    def generate_embedding(cls, text):
        try:
            model = cls.get_model()
            embedding = model.encode(text)
            return embedding.tolist()
        except Exception as e:
            logger.error(f"Error generating embedding: {e}")
            return None

    @classmethod
    def sync_job_embedding(cls, job):
        text = f"{job.title} {job.company_name} {job.description} {job.location}"
        vector = cls.generate_embedding(text)
        if vector:
            obj, created = JobEmbedding.objects.update_or_create(
                job=job,
                defaults={'vector': vector}
            )
            return obj
        return None

    @classmethod
    def sync_user_embedding(cls, user):
        # Combine bio, headline, and profile data
        text = f"{user.headline or ''} {user.bio or ''}"
        vector = cls.generate_embedding(text)
        if vector:
            obj, created = UserEmbedding.objects.update_or_create(
                user=user,
                defaults={'vector': vector}
            )
            return obj
        return None
