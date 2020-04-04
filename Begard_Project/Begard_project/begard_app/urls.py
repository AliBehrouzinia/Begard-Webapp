from django.urls import path
from . import views

my_app = 'begard_app'
urlpatterns = [
    path('cities/', views.CitiesList.as_view()),
    path('location/<int:id>/', views.SuggestList.as_view()),
    path('cities/<int:id>/suggest-plan/', views.SuggestPlanView.as_view()),
]
