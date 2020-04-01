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
    class Meta:
        model = Plan
        fields = ['destination_city', 'description',
                  'creation_date', 'start_date', 'finish_date']


class PlanItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanItem
        fields = ['place_id', 'start_date', 'finish_date']


class SavePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['description', 'start_date', 'finish_date']
