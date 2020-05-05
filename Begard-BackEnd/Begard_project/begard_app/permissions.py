from rest_framework import permissions
from .models import Plan


class IsOwnerOrReadOnly(permissions.BasePermission):

    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        return obj.owner == request.user


class GetUpdateDeletePlanPermission(permissions.BasePermission):

    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            if request.method == "GET":
                plan = Plan.objects.get(pk=view.kwargs['id'])
                if not plan.is_public:
                    user = plan.user
                    if request.user == user:
                        return True
                    return False
                return True
            plan = Plan.objects.get(pk=view.kwargs['id'])
            user = plan.user
            if request.user == user:
                return True
            return False
