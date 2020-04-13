import datetime
import enum
from itertools import chain
from django.db.models import Q

from django.http import JsonResponse
from rest_framework import status, generics

from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework import filters

from . import models, serializers
from .managers.time_table import TimeTable

from .serializers import PlanItemSerializer, PlanSerializer
from .permissions import IsOwnerOrReadOnly
from .serializers import PlanItemSerializer, PlanSerializer, GlobalSearchSerializer, AdvancedSearchSerializer, \
    SavePostSerializer, ShowPostSerializer, SearchPostSerializer


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
        start_day = datetime.datetime.strptime(self.request.query_params.get('start_date'), "%Y-%m-%dT%H:%MZ")
        finish_day = datetime.datetime.strptime(self.request.query_params.get('finish_date'), "%Y-%m-%dT%H:%MZ")

        result = self.get_plan(dest_city, start_day, finish_day)

        return JsonResponse(data=result)

    def get_plan(self, dest_city, start_date, finish_date):
        time_table = TimeTable(start_date, finish_date)
        time_table.create_table(120, 60)
        time_table.tagging()
        time_table.set_places(dest_city)
        plan = time_table.get_json_table()

        return plan


class SavePlanView(generics.CreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PlanSerializer
    permission_classes = (IsAuthenticated,)

    def get(self, request, *args, **kwargs):
        self.get_queryset()
        return Response()

    def get_queryset(self):
        user = self.request.user
        all_result = models.Plan.objects.filter(user=user)
        return all_result

    def post(self, request, *args, **kwargs):
        plan = self.create_plan(request.data)
        self.save_post(request.data, plan.id)
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

    def save_post(self, data, plan_id):
        data['creation_date'] = datetime.datetime.now()
        data['user'] = self.request.user.id
        data['plan'] = plan_id
        serializer = SavePostSerializer(data=data)
        if serializer.is_valid(True):
            serializer.save()

    def save_post(self, data, plan_id):
        data['creation_date'] = datetime.datetime.now()
        data['user'] = self.request.user.id
        data['plan'] = plan_id
        serializer = SavePostSerializer(data=data)
        if serializer.is_valid(True):
            serializer.save()


class GetUpdateDeletePlanView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        plan_id = self.kwargs.get('id')
        plan = models.Plan.objects.get(pk=plan_id)

        plan_details = serializers.PlanSerializer(instance=plan).data
        plan_details.pop('user')
        plan_details['plan_items'] = []

        plan_items = models.PlanItem.objects.filter(plan=plan)
        for plan_item in plan_items:
            plan_item_details = serializers.PlanItemSerializer(plan_item).data
            plan_item_details.pop('plan')
            plan_details['plan_items'].append(plan_item_details)

        return Response(data=plan_details)

    def patch(self, request, *args, **kwargs):
        plan_items = self.request.data['plan_items']
        plan_id = self.kwargs.get('id')
        plan = models.Plan.objects.get(id=plan_id)

        plan_detail = self.request.data
        plan_detail['id'] = plan_id

        plan_detail.pop('plan_items')

        plan_serializer = serializers.UpdatePlanSerializer(instance=plan, data=plan_detail)
        if plan_serializer.is_valid():
            plan_serializer.save()

        list_of_items_id = []
        for plan_item in plan_items:

            plan_item['plan'] = plan_id

            if plan_item.__contains__('id'):
                plan_item_id = plan_item.get('id')
                list_of_items_id.append(plan_item_id)

                plan_item_instance = models.PlanItem.objects.get(id=plan_item_id)
                plan_item_serializer = serializers.PlanItemSerializer(instance=plan_item_instance, data=plan_item)
                if plan_item_serializer.is_valid():
                    plan_item_serializer.save()
            else:
                plan_new_item_serializer = serializers.PlanItemSerializer(data=plan_item)
                if plan_new_item_serializer.is_valid():
                    plan_new_item = plan_new_item_serializer.save()
                    list_of_items_id.append(plan_new_item.id)

        for item_id in models.PlanItem.objects.filter(plan=plan_id):
            if not list_of_items_id.__contains__(item_id.id):
                item_id.delete()

        return Response(status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        plan = models.Plan.objects.filter(pk=self.kwargs.get('id'))
        if plan.count() == 1:
            plan.delete()
        return Response(status.HTTP_200_OK)


class GlobalSearchList(generics.ListAPIView):
    serializer_class = GlobalSearchSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        city_id = self.kwargs.get('id')
        city = models.City.objects.get(pk=city_id)
        query = self.request.query_params.get('query', None)
        restaurants = models.Restaurant.objects.filter(Q(name__icontains=query) & Q(city=city))
        museums = models.Museum.objects.filter(Q(name__icontains=query) & Q(city=city))
        cafes = models.Cafe.objects.filter(Q(name__icontains=query) & Q(city=city))
        recreationalplaces = models.RecreationalPlace.objects.filter(Q(name__icontains=query) & Q(city=city))
        touristattractions = models.TouristAttraction.objects.filter(Q(name__icontains=query) & Q(city=city))
        hotels = models.Hotel.objects.filter(Q(name__icontains=query) & Q(city=city))
        shoppingmalls = models.ShoppingMall.objects.filter(Q(name__icontains=query) & Q(city=city))
        all_results = list(chain(restaurants, museums, cafes, recreationalplaces,
                                 touristattractions, hotels, shoppingmalls))
        return all_results


class LocationTypes(enum.Enum):
    Restaurant = 1
    Museum = 2
    Cafe = 3
    Hotel = 4
    RecreationalPlace = 5
    TouristAttraction = 6
    ShoppingMall = 7


class AdvancedSearch(generics.CreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = AdvancedSearchSerializer

    def post(self, request, *args, **kwargs):
        all_result = self.get_queryset(request.data)
        print(all_result)
        return Response()

    def get_queryset(self, data):
        city_id = self.kwargs.get('id')
        city = models.City.objects.get(pk=city_id)
        rate = data['rate']
        for type_loc in data['types']:
            if type_loc == LocationTypes.Restaurant.value:
                all_results = list(models.Restaurant.objects.filter(Q(rating__gte=rate) & Q(city=city)))
            elif type_loc == LocationTypes.Museum.value:
                all_results += models.Museum.objects.filter(Q(rating__gte=rate) & Q(city=city))
            elif type_loc == LocationTypes.Hotel.value:
                all_results += models.Hotel.objects.filter(Q(rating__gte=rate) & Q(city=city))
            elif type_loc == LocationTypes.Cafe.value:
                all_results += models.Cafe.objects.filter(Q(rating__gte=rate) & Q(city=city))
            elif type_loc == LocationTypes.RecreationalPlace.value:
                all_results += models.RecreationalPlace.objects.filter(Q(rating__gte=rate) & Q(city=city))
            elif type_loc == LocationTypes.TouristAttraction.value:
                all_results += models.TouristAttraction.objects.filter(Q(rating__gte=rate) & Q(city=city))
            elif type_loc == LocationTypes.ShoppingMall.value:
                all_results += models.ShoppingMall.objects.filter(Q(rating__gte=rate) & Q(city=city))

        return all_results


class ShowPostView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShowPostSerializer

    def get_queryset(self):
        page_num = int(self.request.query_params.get('query', None))
        posts = models.Post.objects.filter(Q(id__lte=page_num*5) & Q(id__gte=page_num*5-5))
        return posts


class SearchPostView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        data = request.data
        serializer = SearchPostSerializer(data=data)
        if serializer.is_valid(True):
            self.get_queryset(data)
        return Response()

    def get_queryset(self, info):
        city = info['destination_city']
        user = info['user']
        plans = models.Plan.objects.filter(destination_city=city)
        queryset = models.Post.objects.filter(Q(user=user) & Q(plan=plans[0]))
        return queryset
