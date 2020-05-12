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
    path('posts/', views.ShowPostView.as_view()),
    path('posts/search/', views.SearchPostView.as_view()),
    path('posts/<int:id>/comments/', views.CommentsOnPostView.as_view()),
    path('followings/', views.FollowingsView.as_view()),
    path('followers/', views.FollowersView.as_view()),
    path('posts/<int:id>/likes/', views.LikeOnPostView.as_view()),
    path('follow-request/', views.FollowRequestView.as_view()),
    path('follow-request/<int:id>/', views.ActionOnFollowRequestView.as_view()),
    path('top-posts/', views.TopPostsView.as_view()),
    path('location-post/', views.LocationPostView.as_view()),
    path('top-planners/', views.TopPlannerView.as_view()),
    path('plans/<int:id>/locations/', views.LocationsOfPlanView.as_view()),
]
