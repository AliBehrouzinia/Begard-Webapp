from django.utils import timezone
from rest_framework import status, generics, mixins
from rest_framework import permissions

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from . import models, serializers
from .permissions import IsOwnerOrReadOnly

from .time_table import TimeTable
import datetime

permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                      IsOwnerOrReadOnly]


class CitiesList(generics.ListAPIView):
    """List of cities in database, include name and id"""
    queryset = models.City.objects.all()
    serializer_class = serializers.CitySerializer


class SuggestList(generics.ListAPIView):
    """List of some suggestion according to selected city"""
    serializer_class = serializers.SuggestSerializer

    def get_queryset(self):
        city_id = self.kwargs.get('id')
        city = models.City.objects.get(pk=city_id)

        queryset = list(models.Restaurant.objects.filter(city=city).order_by('-rating')[0:3])
        queryset += models.RecreationalPlace.objects.filter(city=city).order_by('-rating')[0:3]
        queryset += models.Museum.objects.filter(city=city).order_by('-rating')[0:3]

        return queryset


class SuggestPlan(mixins.ListModelMixin):

    def list(self, request, *args, **kwargs):

        plan_data = {"start_day": request.data["start_day"],
                     "finish_day": request.data["finish_day"],
                     "destination_city": kwargs.get("id"),
                     "user": None}

        new_plan = serializers.SuggestPlanSerializer(plan_data)
        if not new_plan.is_valid():
            return Response(new_plan.error_messages)

        self.generate_items(new_plan, new_plan.destination_city,
                            timezone.datetime(2020, 4, 1, 18, 0),
                            timezone.datetime(2020, 4, 3, 16, 0))

        result = {'plan': serializers.SuggestPlanSerializer(new_plan)}

        return Response(result, status=status.HTTP_200_OK)

    def generate_items(self, plan, city_id, start_date, finish_date):

        time_table = TimeTable(start_date, finish_date)
        time_table.create_table(120, 60)

        places = self.places(city_id)

        for i in time_table.Table.count():
            time_table.Table[i].place_id = places[i].place_id
            time_table.Table[i].plan_id = plan

        return time_table.Table

    def places(self, city_id):
        city = models.City.objects.get(pk=city_id)

        all_place = list(models.Restaurant.objects.filter(city=city).order_by('-rating'))
        all_place += models.RecreationalPlace.objects.filter(city=city).order_by('-rating')
        all_place += models.Museum.objects.filter(city=city).order_by('-rating')
        all_place += models.ShoppingMall.objects.filter(city=city).order_by('-rating')
        all_place += models.Cafe.objects.filter(city=city).order_by('-rating')

        return all_place
