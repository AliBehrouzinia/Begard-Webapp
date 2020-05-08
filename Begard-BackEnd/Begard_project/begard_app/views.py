import datetime
import enum
from itertools import chain

from django.db.models import Q
from django.http import JsonResponse
from rest_framework import status, generics
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework.views import APIView

from . import models, serializers
from .permissions import *
from .managers.time_table import TimeTable
from .serializers import PlanItemSerializer, PlanSerializer, GlobalSearchSerializer, AdvancedSearchSerializer, \
    SavePostSerializer, ShowPostSerializer, FollowingsSerializer, TopPostSerializer, LocationPostSerializer, \
    ImageSerializer, TopPlannerSerializer


class CitiesListView(generics.ListAPIView):
    """List of cities in database, include name and id"""
    queryset = models.City.objects.all()
    serializer_class = serializers.CitySerializer
    permission_classes = [AllowAny]


class SuggestListView(generics.ListAPIView):
    """List of some suggestion according to selected city"""
    serializer_class = serializers.SuggestSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        city_id = self.kwargs.get('id')
        city = get_object_or_404(models.City, pk=city_id)
        queryset = list(models.Restaurant.objects.filter(city=city).order_by('-rating')[0:3])
        queryset += models.RecreationalPlace.objects.filter(city=city).order_by('-rating')[0:3]
        queryset += models.Museum.objects.filter(city=city).order_by('-rating')[0:3]

        return queryset


class SuggestPlanView(APIView):
    """Get a plan suggestion to user"""
    permission_classes = [AllowAny]

    def get(self, request):
        dest_city = models.City.objects.get(pk=self.kwargs.get('id'))
        start_day = datetime.datetime.strptime(self.request.query_params.get('start_date'), "%Y-%m-%dT%H:%MZ")
        finish_day = datetime.datetime.strptime(self.request.query_params.get('finish_date'), "%Y-%m-%dT%H:%MZ")

        result = self.get_plan(dest_city, start_day, finish_day)

        return JsonResponse(data=result, status=status.HTTP_200_OK)

    def get_plan(self, dest_city, start_date, finish_date):
        time_table = TimeTable(start_date, finish_date)
        time_table.create_table(120, 60)
        time_table.tagging()
        time_table.set_places(dest_city)
        plan = time_table.get_json_table()

        return plan


class SavePlanView(generics.ListCreateAPIView, generics.RetrieveUpdateDestroyAPIView):
    serializer_class = serializers.PlanSerializer
    permission_classes = (IsAuthenticated,)

    def get_queryset(self):
        user = self.request.user
        return models.Plan.objects.filter(user=user)

    def post(self, request, *args, **kwargs):
        plan = self.create_plan(request.data)
        self.create_plan_items(request.data['plan_items'], plan.id)
        post = self.save_post(request.data, plan.id)
        post_id = post.pk
        image = request.data['image']
        modified_data = {'post': post_id, 'image': image}
        serializer = ImageSerializer(data=modified_data)
        if serializer.is_valid(True):
            serializer.save()
        return Response(status=status.HTTP_200_OK)

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
        serializer = SavePostSerializer(data=data)
        if serializer.is_valid(True):
            return serializer.save()


class GetUpdateDeletePlanView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = [IsAuthenticated, GetUpdateDeletePlanPermission]

    def get(self, request, *args, **kwargs):
        plan_id = self.kwargs.get('id')
        plan = get_object_or_404(models.Plan, pk=plan_id)

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
        plan = get_object_or_404(models.Plan, id=plan_id)

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
                instances.append(get_object_or_404(models.PlanItem, pk=plan_item_id))

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
    permission_classes = [AllowAny]

    def get_queryset(self):
        city_id = self.kwargs.get('id')
        city = get_object_or_404(models.City, pk=city_id)
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
    permission_classes = [AllowAny]

    def post(self, request, *args, **kwargs):
        all_result = self.get_queryset(request.data)
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
    permission_classes = [AllowAny]
    serializer_class = ShowPostSerializer

    def get_queryset(self):
        pass

    def get(self, request, *args, **kwargs):
        user = self.request.user.id
        following_users = [item['following_user_id'] for item in
                           models.UserFollowing.objects.filter(user_id=user).values('following_user_id')]
        if not self.request.query_params.get('page').isdigit():
            return Response({"error": "the page number is not correct."}, status.HTTP_400_BAD_REQUEST)
        page_number = int(self.request.query_params.get('page'))
        posts = models.Post.objects.filter(Q(user__in=following_users) |
                                           Q(user__is_public=True)).order_by('-creation_date')[(page_number - 1)
                                                                                               * 20:page_number * 20]
        posts_data = serializers.ShowPostSerializer(instance=posts, many=True).data
        for data in posts_data:
            data['destination_city'] = get_object_or_404(models.Plan, id=data['plan_id']).destination_city.name
            data['user_name'] = get_object_or_404(models.BegardUser, id=data['user']).email
            data['user_profile_image'] = get_object_or_404(models.BegardUser, id=data['user']).profile_img.url
            data['number_of_likes'] = models.Like.objects.filter(post=data['id']).count()
            data['is_liked'] = models.Like.objects.filter(Q(user=user) & Q(post=data['id'])).exists()
            images = models.Image.objects.filter(post=data['id'])
            data['images'] = [image.image.url for image in images]
            if following_users.__contains__(data['user']):
                data['following_state'] = 'following'
            else:
                data['following_state'] = 'follow'

        return Response(posts_data, status=status.HTTP_200_OK)


class SearchPostView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = ShowPostSerializer

    def get(self, request, *args, **kwargs):
        user = self.request.user.id
        user_following = models.UserFollowing.objects.filter(user_id=user)
        if not (self.request.query_params.get('city')).isdigit():
            return Response(data={"error: ": "the page number is not correct."}, status=status.HTTP_400_BAD_REQUEST)
        city = self.request.query_params.get('city', None)
        plans = models.Plan.objects.filter(destination_city=city)
        queryset = models.Post.objects.filter((Q(plan_id__in=plans) & Q(user__id__in=user_following)) |
                                              (Q(plan_id__in=plans) & Q(user__is_public=True)))
        return Response(status=status.HTTP_200_OK)

    def get_queryset(self):
        pass


class CommentsOnPostView(generics.ListCreateAPIView):
    permission_classes = [IsAuthenticated, LikeAndCommentOnPostPermission]
    serializer_class = serializers.CreateCommentSerializer

    def get(self, request, *args, **kwargs):
        post_id = self.kwargs.get('id')
        comments = models.Comment.objects.filter(post=post_id)
        serializer_data = serializers.CreateCommentSerializer(instance=comments, many=True).data
        for data in serializer_data:
            user = models.BegardUser.objects.get(id=data['user'])
            data['user_name'] = user.email
            data['user_profile_img'] = user.profile_img.url

        return Response(data=serializer_data, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = self.request.data
        data['post'] = self.kwargs.get('id')
        data['user'] = self.request.user.id
        post = get_object_or_404(models.Post, id=data['post'])

        comment_serializer = serializers.CreateCommentSerializer(data=data)
        if comment_serializer.is_valid():
            comment = comment_serializer.save()
            comment_data = serializers.CreateCommentSerializer(instance=comment).data
            user = get_object_or_404(models.BegardUser, id=comment_data['user'])
            comment_data['user_name'] = user.email
            comment_data['user_profile_img'] = user.profile_img.url
            return Response(data=comment_data, status=status.HTTP_201_CREATED)

        return Response(status=status.HTTP_406_NOT_ACCEPTABLE)


class FollowingsView(generics.RetrieveUpdateDestroyAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FollowingsSerializer

    def get(self, request, *args, **kwargs):
        user = self.request.user.id
        models.UserFollowing.objects.filter(user_id=user)
        return Response(status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        user_id = self.request.user.id
        data = request.data
        following_id = data['following_id']
        models.UserFollowing.objects.filter(Q(user_id=user_id) & Q(following_user_id=following_id)).delete()
        return Response(status=status.HTTP_200_OK)


class FollowersView(generics.ListAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = FollowingsSerializer

    def get_queryset(self):
        user = self.request.user.id
        queryset = models.UserFollowing.objects.filter(Q(following_user_id=user))
        return queryset


class LikeOnPostView(generics.ListCreateAPIView, generics.DestroyAPIView):
    permission_classes = [IsAuthenticated, LikeAndCommentOnPostPermission]
    serializer_class = serializers.CreateLikeSerializer

    def get(self, request, *args, **kwargs):
        post_id = self.kwargs.get('id')
        user_id = self.request.user.id
        like_numbers = models.Like.objects.filter(post=post_id).count()
        is_liked = models.Like.objects.filter(Q(user=user_id) & Q(post=post_id)).exists()
        return Response(data={'like_numbers': like_numbers, 'is_liked': is_liked}, status=status.HTTP_200_OK)

    def post(self, request, *args, **kwargs):
        data = {
            'user': self.request.user.id,
            'post': self.kwargs.get('id')
        }

        post = get_object_or_404(models.Post, id=data['post'])

        exist_like = models.Like.objects.filter(Q(user=data['user']) & Q(post=data['post'])).exists()
        if exist_like:
            return Response(data={"warning": "this post is liked by you.now you are trying to like again."},
                            status=status.HTTP_406_NOT_ACCEPTABLE)

        serializer = serializers.CreateLikeSerializer(data=data)
        if serializer.is_valid(True):
            serializer.save()

        return Response(status=status.HTTP_201_CREATED)

    def delete(self, request, *args, **kwargs):
        data = {
            'user': self.request.user.id,
            'post': self.kwargs.get('id')
        }
        post = get_object_or_404(models.Post, id=data['post'])

        like = models.Like.objects.filter(Q(user=data['user']) & Q(post=post.id))
        if like.exists():
            like.delete()

        return Response(status=status.HTTP_200_OK)


class FollowRequestView(generics.ListCreateAPIView):
    permission_classes = (IsAuthenticated,)
    serializer_class = serializers.FollowRequestSerializer

    def get_queryset(self):
        return models.FollowRequest.objects.filter(request_to=self.request.user)

    def post(self, request, *args, **kwargs):
        data = self.request.data
        data['request_from'] = self.request.user.id

        if type(data['request_to']) is not int:
            return Response({"error": "data is not in valid format."},
                            status.HTTP_400_BAD_REQUEST)

        following_users = models.UserFollowing.objects.filter(user_id=data['request_from'])
        if following_users.filter(following_user_id=data['request_to']).exists():
            return Response(data={'error': 'this user is followed by you, you can not request to follow this user'},
                            status=status.HTTP_400_BAD_REQUEST)

        request_to_user = get_object_or_404(models.BegardUser, id=data['request_to'])

        if request_to_user.is_public:
            follow_user_data = {"user_id": data['request_from'], "following_user_id": data['request_to']}
            serializer = serializers.FollowingsSerializer(data=follow_user_data)
            if serializer.is_valid(True):
                serializer.save()
                return Response(data={"status": "Followed"}, status=status.HTTP_201_CREATED)
        else:
            serializer = serializers.FollowRequestSerializer(data=data)
            if serializer.is_valid(True):
                serializer.save()
                return Response(data={"status": "Requested"}, status=status.HTTP_201_CREATED)

        return Response(status.HTTP_406_NOT_ACCEPTABLE)


class ActionOnFollowRequestView(generics.ListAPIView, generics.DestroyAPIView):
    """Accept or Reject or delete a follow request"""
    permission_classes = [IsAuthenticated, ActionOnFollowRequestPermission]

    def get(self, request, *args, **kwargs):
        follow_request = get_object_or_404(models.FollowRequest, id=self.kwargs.get('id'))

        self.check_object_permissions(request, follow_request)

        action = self.request.query_params.get('action')

        if not ((action == 'accept') or (action == 'reject')):
            return Response({"error: ": "you need 'action' query params with 'accept' or 'reject' value."},
                            status.HTTP_400_BAD_REQUEST)

        if action == 'accept':
            data = {'user_id': follow_request.request_from_id, 'following_user_id': follow_request.request_to_id}
            serializer = serializers.FollowingsSerializer(data=data)
            if serializer.is_valid(True):
                serializer.save()
        else:
            follow_request.delete()

        return Response(status=status.HTTP_200_OK)

    def delete(self, request, *args, **kwargs):
        follow_request = get_object_or_404(models.FollowRequest, id=self.kwargs.get('id'))

        self.check_object_permissions(request, follow_request)
        follow_request.delete()

        return Response(status=status.HTTP_200_OK)


class TopPostsView(generics.ListAPIView):
    serializer_class = TopPostSerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        pass

    def get(self, request, *args, **kwargs):
        if not (self.request.query_params.get('page')).isdigit():
            return Response(data={"error: ": "the page number is not correct."}, status=status.HTTP_400_BAD_REQUEST)
        page_number = int(self.request.query_params.get('page'))
        posts = models.Post.objects.filter(Q(user__is_public=True) & Q(type='plan_post')).order_by('-rate')[
                (page_number - 1) * 5:page_number * 5]
        posts_data = serializers.TopPostSerializer(instance=posts, many=True).data
        for data in posts_data:
            data['city'] = get_object_or_404(models.Plan, id=data['plan_id']).destination_city.name
            data['user_name'] = get_object_or_404(models.BegardUser, id=data['user']).email
            data['profile_image'] = get_object_or_404(models.BegardUser, id=data['user']).profile_img.url
            data['cover'] = get_object_or_404(models.Image, post__pk=data['id']).image.url
        return Response(posts_data, status=status.HTTP_200_OK)


class LocationPostView(generics.CreateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = LocationPostSerializer

    def post(self, request, *args, **kwargs):
        images = request.data['image']
        post = self.save_post(request.data)
        post_id = post.pk
        for image in images:
            modified_data = self.modify_input_for_multiple_files(image['image'], post_id)
            serializer = ImageSerializer(data=modified_data)
            if serializer.is_valid(True):
                serializer.save()
        return Response(status=status.HTTP_200_OK)

    def modify_input_for_multiple_files(self, image, post):
        list_element = {'post': post, 'image': image}
        return list_element

    def save_post(self, data):
        data['creation_date'] = datetime.datetime.now()
        data['user'] = self.request.user.id
        serializer = LocationPostSerializer(data=data)
        if serializer.is_valid(True):
            return serializer.save()


class TopPlannerView(generics.ListAPIView):
    permission_classes = [AllowAny]
    serializer_class = TopPlannerSerializer

    def get_queryset(self):
        user_auth = self.request.user.id
        followers = models.UserFollowing.objects.filter(user_id=user_auth)
        followers_list = list(followers)
        following_id = []
        for item in followers_list:
            following_id.append(item.following_user_id.id)
        users = models.BegardUser.objects.exclude(Q(pk__in=following_id) | Q(pk=user_auth))
        users_list = list(users)
        for person in users_list:
            posts = models.Post.objects.filter(Q(user_id__in=users) & Q(user_id=person.id))
            sum_of_rates = 0
            for item1 in posts:
                sum_of_rates += item1.rate
            if len(posts) != 0:
                person.average_rate = sum_of_rates / len(posts)
            else:
                person.average_rate = 0
        sorted_list = sorted(users_list, key=lambda x: x.average_rate)
        sorted_list.reverse()
        return sorted_list
