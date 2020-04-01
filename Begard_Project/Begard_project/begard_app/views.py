import datetime

from rest_framework import status, generics, mixins
from rest_framework import permissions

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from . import models, serializers
from .permissions import IsOwnerOrReadOnly
from .serializers import PlanSerializer, PlanItemSerializer, SavePlanSerializer

permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                      IsOwnerOrReadOnly]


class CitiesListView(generics.ListAPIView):
    """List of cities in database, include name and id"""
    queryset = models.City.objects.all()
    serializer_class = serializers.CitySerializer


class SuggestListView(generics.ListAPIView):
    """List of some suggestion according to selected city"""
    serializer_class = serializers.SuggestSerializer

    def get_queryset(self):
        city_id = self.kwargs.get('id')
        city = models.City.objects.get(pk=city_id)

        queryset = list(models.Restaurant.objects.filter(city=city).order_by('-rating')[0:3])
        queryset += models.RecreationalPlace.objects.filter(city=city).order_by('-rating')[0:3]
        queryset += models.Museum.objects.filter(city=city).order_by('-rating')[0:3]

        return queryset


class SavePlanView(generics.CreateAPIView):
    serializer_class = serializers.PlanSerializer
    permission_classes = (IsAuthenticated, )

    def post(self, request, *args, **kwargs):
        validation = SavePlanSerializer(data=request.data)
        if validation.is_valid(True):
            created_plan = self.create_plan(request.data)
            self.create_plan_item(request.data)
            created_plan.save()
        return Response()

    def create_plan_item(self, data):
        plan_items = data['plan_items']
        for item in plan_items:
            validation = PlanItemSerializer(data=item)
            if validation.is_valid(True):
                plan_item = models.PlanItem(place_id=item['place_id'], start_date=item['start_date'],
                                            finish_date=item['finish_date'])
                plan_item.save()

    def create_plan(self, data):
        city_id = self.kwargs.get('id')
        destination_city = models.City.objects.get(pk=city_id)
        creation_date = datetime.datetime.now()
        plan = models.Plan(user=self.request.user, destination_city=destination_city, description=data['description'],
                           creation_date=creation_date, start_day=data['start_day'], finish_day=data['finish_day'])
        return plan
