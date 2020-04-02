from django.urls import path
from . import views

my_app = 'begard_app'
urlpatterns = [
    path('cities/', views.CitiesListView.as_view()),
    path('cities/<int:id>/', views.SuggestListView.as_view()),
    path('plans/', views.SavePlanView.as_view()),
    path('search/', views.GlobalSearchList.as_view()),
]
