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


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BegardUser
        fields = 'email'


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BegardUser
        fields = ('email',)
        read_only_fields = ('email',)


class PlanSerializer(serializers.ModelSerializer):
    user = UserSerializer

    class Meta:
        model = Plan
        fields = ['user', 'destination_city', 'description', 'is_public', 'like',
                  'like_user', 'creation_date', 'start_day', 'finish_day', ]


class PlanItemSerializer(serializers.ModelSerializer):
    plan = PlanSerializer

    class Meta:
        model = PlanItem
        fields = ['plan', 'place_id', 'start_date', 'finish_date', ]
