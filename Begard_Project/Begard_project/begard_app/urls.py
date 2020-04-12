from django.urls import path
from . import views

my_app = 'begard_app'
urlpatterns = [
    path('cities/', views.CitiesListView.as_view()),
    path('cities/<int:id>/', views.SuggestListView.as_view()),
    path('cities/<int:id>/suggest-plan/', views.SuggestPlanView.as_view()),
    path('plans/', views.SavePlanView.as_view()),
    path('plans/<int:id>/', views.GetUpdateDeletePlanView.as_view()),
    path('cities/<int:id>/search/simple/', views.GlobalSearchList.as_view()),
    path('cities/<int:id>/search/advanced/', views.AdvancedSearch.as_view()),
    path('plans/<int:id>/posts/', views.ShowPostView.as_view()),
    path('plans/<int:id>/posts/search/', views.SearchPostView.as_view()),
]
