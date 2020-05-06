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
