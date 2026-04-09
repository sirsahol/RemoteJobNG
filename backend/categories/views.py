from rest_framework import viewsets
from rest_framework.permissions import AllowAny
from .models import Category, SkillTag
from .serializers import CategoryListSerializer, SkillTagSerializer


class CategoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategoryListSerializer
    permission_classes = [AllowAny]


class SkillTagViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = SkillTag.objects.all()
    serializer_class = SkillTagSerializer
    permission_classes = [AllowAny]
