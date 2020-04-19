from rest_framework import serializers
from .models import *
from .models import BegardUser


class SuggestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'


class MuseumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Museum
        fields = '__all__'


class HistoricalPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TouristAttraction
        fields = '__all__'


class RecreationalPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecreationalPlace
        fields = '__all__'


class CafeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cafe
        fields = '__all__'


class ShoppingMallSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingMall
        fields = '__all__'


class TouristAttractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TouristAttraction
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BegardUser
        fields = 'email'


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BegardUser
        fields = ('email',)
        read_only_fields = ('email',)


class PlanItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanItem
        fields = ['place_id', 'plan', 'start_date', 'finish_date']


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['user', 'destination_city', 'description', 'creation_date', 'start_date', 'finish_date']


class UpdatePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'description', 'is_public', 'start_date', 'finish_date']


class PlanItemListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        for i in range(len(instance)):
            self.validated_data[i]['plan'] = self.validated_data[i]['plan'].id
            serializer = PlanItemSerializer(instance[i], self.validated_data[i])
            if serializer.is_valid(raise_exception=True):
                serializer.save()

        return instance


class PatchPlanItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanItem
        fields = '__all__'
        list_serializer_class = PlanItemListSerializer


class GlobalSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

    def to_native(self, obj):
        if isinstance(obj, Restaurant):
            serializer = RestaurantSerializer(obj)
        elif isinstance(obj, Hotel):
            serializer = HotelSerializer(obj)
        elif isinstance(obj, Museum):
            serializer = MuseumSerializer(obj)
        elif isinstance(obj, Cafe):
            serializer = CafeSerializer(obj)
        elif isinstance(obj, ShoppingMall):
            serializer = ShoppingMallSerializer(obj)
        elif isinstance(obj, TouristAttraction):
            serializer = TouristAttractionSerializer(obj)
        elif isinstance(obj, RecreationalPlace):
            serializer = RecreationalPlaceSerializer(obj)
        else:
            raise Exception("Neither a model instance!")
        return serializer.data


class AdvancedSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class SavePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class ShowPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment


class FollowingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollowing
        fields = '__all__'


class CreateLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'
