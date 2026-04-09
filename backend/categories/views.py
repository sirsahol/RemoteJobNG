from rest_framework.viewsets import ReadOnlyModelViewSet
from rest_framework.permissions import AllowAny
from .models import Category, SkillTag
from .serializers import CategorySerializer, CategoryListSerializer, SkillTagSerializer


class CategoryViewSet(ReadOnlyModelViewSet):
    queryset = Category.objects.filter(is_active=True).prefetch_related('skill_tags')
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        if self.action == 'list':
            return CategoryListSerializer
        return CategorySerializer


class SkillTagViewSet(ReadOnlyModelViewSet):
    queryset = SkillTag.objects.filter(is_active=True)
    serializer_class = SkillTagSerializer
    permission_classes = [AllowAny]
    filterset_fields = ['category']
    search_fields = ['name']
