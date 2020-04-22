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
    SavePostSerializer, ShowPostSerializer, FollowingsSerializer, TopPostSerializer, LocationPostSerializer


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
        data['type'] = 'plan_post'
        data['creation_date'] = datetime.datetime.now()
        data['user'] = self.request.user.id
        data['plan_id'] = plan_id
        print(1)
        serializer = SavePostSerializer(data=data)
        if serializer.is_valid(True):
            print(2)
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

        plan_items_create_data = []
        plan_items_update_data = []
        plan_items_update_id = []
        instances = []
        for plan_item in plan_items:
            plan_item['plan'] = plan_id
            plan_item_id = plan_item.get('id')
            if plan_item_id is None:
                plan_items_create_data.append(plan_item)
            else:
                plan_items_update_data.append(plan_item)
                plan_items_update_id.append(plan_item_id)
                instances.append(models.PlanItem.objects.get(pk=plan_item_id))

        serializer = serializers.PatchPlanItemSerializer(instance=instances,
                                                         data=plan_items_update_data, many=True)
        if serializer.is_valid():
            serializer.save()

        models.PlanItem.objects.filter(plan=plan_id).exclude(id__in=plan_items_update_id).delete()

        serializer = serializers.PatchPlanItemSerializer(data=plan_items_create_data, many=True)
        if serializer.is_valid():
            serializer.save()

        return Response(status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        models.Plan.objects.filter(pk=self.kwargs.get('id')).delete()
        return Response(status=status.HTTP_200_OK)


class GlobalSearchList(generics.ListAPIView):
    serializer_class = GlobalSearchSerializer

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

    def get(self, request, *args, **kwargs):
        user = self.request.user.id
        following_users = [item['following_user_id'] for item in
                           models.UserFollowing.objects.filter(user_id=user).values('following_user_id')]
        page_number = int(self.request.query_params.get('page'))
        posts = models.Post.objects.filter(Q(user__in=following_users) |
                                           Q(user__is_public=True)).order_by('-creation_date')[(page_number - 1)
                                                                                               * 20:page_number * 20]

        posts_data = serializers.ShowPostSerializer(instance=posts, many=True).data
        for data in posts_data:
            data['destination_city'] = models.Plan.objects.get(id=data['plan_id']).destination_city.name
            data['user_name'] = models.BegardUser.objects.get(id=data['user']).email
            data['user_profile_image'] = models.BegardUser.objects.get(id=data['user']).profile_img.url

            if following_users.__contains__(data['user']):
                data['following_state'] = 'following'
            else:
                data['following_state'] = 'follow'

        return Response(posts_data, status=status.HTTP_200_OK)


class SearchPostView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShowPostSerializer

    def get_queryset(self):
        user = self.request.user.id
        user_following = models.UserFollowing.objects.filter(user_id=user)
        city = self.request.query_params.get('city', None)
        plans = models.Plan.objects.filter(destination_city=city)
        queryset = models.Post.objects.filter((Q(plan__in=plans) & Q(user__id__in=user_following)) |
                                              (Q(plan__in=plans) & Q(user__is_public=True)))
        return queryset


class CommentsOnPostView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = serializers.CreateCommentSerializer

    def get_queryset(self):
        post_id = self.kwargs.get('id')
        return models.Comment.objects.filter(post=post_id)

    def post(self, request, *args, **kwargs):
        data = self.request.data
        data['post'] = self.kwargs.get('id')
        data['user'] = self.request.user.id
        comment_serializer = serializers.CreateCommentSerializer(data=data)
        if comment_serializer.is_valid():
            comment_serializer.save()

        return Response(status=status.HTTP_201_CREATED)


class FollowingsView(generics.CreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FollowingsSerializer

    def post(self, request, *args, **kwargs):
        data = request.data
        self.add_following(data)
        return Response()

    def get(self, request, *args, **kwargs):
        user = self.request.user.id
        models.UserFollowing.objects.filter(user_id=user)
        return Response()

    def delete(self, request, *args, **kwargs):
        user_id = self.request.user.id
        data = request.data
        following_id = data['following_id']
        models.UserFollowing.objects.filter(Q(user_id=user_id) & Q(following_user_id=following_id)).delete()
        return Response()

    def add_following(self, data):
        data['user_id'] = self.request.user.id
        serializer = FollowingsSerializer(data=data)
        if serializer.is_valid(True):
            serializer.save()


class FollowersView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FollowingsSerializer

    def get_queryset(self):
        user = self.request.user.id
        queryset = models.UserFollowing.objects.filter(Q(following_user_id=user))
        return queryset


class LikeOnPostView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = models.Like

    def get(self, request, *args, **kwargs):
        post_id = self.kwargs.get('id')
        like_numbers = models.Like.objects.filter(post=post_id).count()
        return Response(data={'like_numbers': like_numbers}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = self.request.data
        data['user'] = self.request.user.id
        data['post'] = self.kwargs.get('id')

        exist_like = models.Like.objects.get(Q(user=data['user']) & Q(post=data['post']))
        if exist_like is not None:
            return Response(status=status.HTTP_200_OK)

        serializer = serializers.CreateLikeSerializer(data=data)
        if serializer.is_valid(True):
            serializer.save()

        return Response(status=status.HTTP_201_CREATED)


class FollowRequestView(generics.ListCreateAPIView, generics.DestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.FollowRequestSerializer

    def get_queryset(self):
        return models.FollowRequest.objects.filter(request_to=self.request.user)

    def post(self, request, *args, **kwargs):
        data = self.request.data
        data['request_from'] = self.request.user.id
        serializer = serializers.FollowRequestSerializer(data=data)
        if serializer.is_valid():
            serializer.save()

        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        follow_request_id = self.request.data['follow_request_id']
        models.FollowRequest.objects.get(id=follow_request_id).delete()

        return Response(status=status.HTTP_200_OK)


class TopPostsView(generics.ListAPIView):
    serializer_class = TopPostSerializer

    def get_queryset(self):
        page_number = int(self.request.query_params.get('page'))
        posts = models.Post.objects.filter(Q(user__is_public=True)).order_by('-rate')[(page_number - 1) * 5
                                                                                      :page_number * 5]
        return posts


class LocationPostView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LocationPostSerializer

    def post(self, request, *args, **kwargs):
        self.get_queryset(request.data)
        return Response()

    def get_queryset(self, data):
        data['creation_date'] = datetime.datetime.now()
        data['user'] = self.request.user.id
        serializer = LocationPostSerializer(data=data)
        if serializer.is_valid(True):
            serializer.save()
            print(serializer)