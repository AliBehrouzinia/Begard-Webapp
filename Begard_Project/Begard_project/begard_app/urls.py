from django.urls import path
from . import views

my_app = 'begard_app'
urlpatterns = [
    path('cities/', views.CitiesList.as_view()),
    path('location/<int:id>/', views.SuggestList.as_view()),
    path('cities/<int:city_id>/suggestion/', views.SuggestPlan.as_view()),
]
