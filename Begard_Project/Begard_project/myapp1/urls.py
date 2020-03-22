from django.urls import path
from .views import GoogleApiRestaurants, api
from . import views

my_app = 'myapp1'
urlpatterns = [
    path('tehran/', GoogleApiRestaurants.as_view()),
    path('load/', api),
    path('users/', views.begarduserList.as_view()),
    path('users/<int:pk>/', views.begarduserDetail.as_view()),
]
