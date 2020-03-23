from django.urls import path
from . import views

my_app = 'myapp1'
urlpatterns = [
    # path('tehran/', GoogleApiRestaurants.as_view()),
    path('load/', views.get_data),
    path('cities/', views.CitiesList.as_view()),
    path('location/<int:id>/', views.SuggestList.as_view()),
    path('users/', views.begarduserList.as_view()),
    path('users/<int:pk>/', views.begarduserDetail.as_view()),
]
