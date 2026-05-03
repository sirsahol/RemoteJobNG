from django.urls import path
from .views import JobMatchView, SemanticSearchView, CandidateMatchView

urlpatterns = [
    path('jobs/match/', JobMatchView.as_view(), name='job-match'),
    path('jobs/search/', SemanticSearchView.as_view(), name='semantic-search'),
    path('candidates/match/', CandidateMatchView.as_view(), name='candidate-match'),
]
