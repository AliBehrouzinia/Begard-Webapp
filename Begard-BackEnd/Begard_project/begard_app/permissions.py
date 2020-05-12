from django.shortcuts import get_object_or_404
from rest_framework import permissions
from . import models


class ActionOnFollowRequestPermission(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method == 'DELETE':
            return request.user == obj.request_from

        if request.method == 'GET':
            return request.user == obj.request_to


class GetUpdateDeletePlanPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            if request.method == "GET":
                plan = models.Plan.objects.get(pk=view.kwargs['id'])
                if not plan.is_public:
                    user = plan.user
                    if request.user == user:
                        return True
                    return False
                return True
            plan = models.Plan.objects.get(pk=view.kwargs['id'])
            user = plan.user
            if request.user == user:
                return True
            return False


class LikeAndCommentOnPostPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        post_id = view.kwargs.get('id')
        user = request.user
        post = get_object_or_404(models.Post, id=post_id)

        if post.user.is_public:
            return True

        if models.UserFollowing.objects.filter(user_id=user, following_user_id=post.user).exists():
            return True

        return False


class AllowGetUserPosts(permissions.BasePermission):

    def has_permission(self, request, view):
        target_user = get_object_or_404(models.BegardUser, id=view.kwargs.get('id'))
        source_user = request.user

        if not target_user.is_public:
            if not models.UserFollowing.objects.filter(user_id=source_user.id,
                                                       following_user_id=target_user.id).exists():
                return False

        return True
