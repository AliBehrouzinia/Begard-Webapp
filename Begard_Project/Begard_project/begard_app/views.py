import datetime

from rest_framework import status, generics, mixins
from rest_framework import permissions

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from . import models, serializers
from .permissions import IsOwnerOrReadOnly
from .time_table import TimeTable

from .serializers import PlanItemSerializer, PlanSerializer


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


class SuggestPlanView(APIView):
    """Get a plan suggestion to user"""
    def get(self, request, id):

        dest_city = models.City.objects.get(pk=id)
        start_day = datetime.strptime(self.request.data["start_day"], "%Y-%m-%dT%H:%MZ")
        finish_day = datetime.strptime(self.request.data["finish_day"], "%Y-%m-%dT%H:%MZ")

        result = self.get_plan(dest_city, start_day, finish_day)

        return Response(result, status=status.HTTP_200_OK)

    def get_plan(self, dest_city, start_date, finish_date):

        time_table = TimeTable(start_date, finish_date)
        time_table.create_table(120, 60)
        time_table.tagging()
        time_table.set_places(dest_city)
        plan = time_table.get_json_table()

        return plan


class SavePlanView(generics.CreateAPIView):
    serializer_class = serializers.PlanSerializer
    permission_classes = (IsAuthenticated,)

    def post(self, request, *args, **kwargs):
        plan = self.create_plan(request.data)
        self.create_plan_items(request.data['plan_items'], plan.id)
        return Response()

    def create_plan_items(self, plan_items, plan_id):
        for item in plan_items:
            item['plan'] = plan_id
            serializer = PlanItemSerializer(data=item)
            if serializer.is_valid(True):
                serializer.save()

    def create_plan(self, plan_dict):
        plan_dict['user'] = self.request.user.id
        plan_dict['creation_date'] = datetime.datetime.now()
        serializer = PlanSerializer(data=plan_dict)
        if serializer.is_valid(True):
            plan = serializer.save()
            return plan
        return None
