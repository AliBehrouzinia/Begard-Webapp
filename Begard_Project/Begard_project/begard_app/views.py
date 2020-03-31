from rest_framework import status, generics, mixins
from rest_framework import permissions

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated

from . import models, serializers
from .permissions import IsOwnerOrReadOnly
from .serializers import PlanSerializer, PlanItemSerializer
import time

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


class CreatePlan(generics.CreateAPIView):

    def __init__(self, current_plan=None, **kwargs):
        super().__init__(**kwargs)
        self.listOfPlanItem = []
        self.CurrentPlan = current_plan

    def create_plan(self, data):

        self.CurrentPlan = None
        data['like'] = 0
        data['creation_time'] = time.timezone.now()
        current_plan = PlanSerializer(data)

        if current_plan.is_valid():
            return True

        return False

        return Response()

    def create_plan_item(self, data):
        data['plan'] = self.CurrentPlan
        item = PlanItemSerializer(data)

        if item.is_valid():
            self.listOfPlanItem.append(item)
            return True
        return False

        return Response()


class SavePlan(generics.ListAPIView):
    def get(self, request, *args, **kwargs):
        plan = PlanSerializer(request.data)
        plan.save()


class SuggestPlan(generics.CreateAPIView):

    def post(self, request, *args, **kwargs):
        planning = CreatePlan()
        planning.create_plan(request.data)
        place_id = None

        data = {'place_id': None, 'plan': None, 'start_date': 8, 'finish_date': 9.5}
        planning.create_plan_item(data=data)

        data = {'place_id': None, 'plan': None, 'start_date': 10, 'finish_date': 11.5}
        planning.create_plan_item(data=data)

        planning.create_plan_item(place_id=place_id, start=12, finish=13.5)
        planning.create_plan_item(place_id=place_id, start=13.5, finish=14.5)
        planning.create_plan_item(place_id=place_id, start=15, finish=16)
        planning.create_plan_item(place_id=place_id, start=16.5, finish=18.5)
        planning.create_plan_item(place_id=place_id, start=19, finish=21)
        planning.create_plan_item(place_id=place_id, start=21.5, finish=22.5)

        return Response()


