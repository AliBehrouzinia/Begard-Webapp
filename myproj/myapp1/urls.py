from django.urls import path
from .views import GoogleApiRestaurants, api

my_app = 'myapp1'
urlpatterns = [
    path('tehran/', GoogleApiRestaurants.as_view()),
    path('load/', api),
]
