from rest_framework import serializers
from django.contrib.auth.models import User
from .models import *
from .models import begarduser


class SuggestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


#class UserSerializer(serializers.ModelSerializer):
#    owner = serializers.ReadOnlyField(source='owner.username')
#    begardusers = serializers.PrimaryKeyRelatedField(many=True, queryset=begarduser.objects.all())

    #class Meta:
        #model = begarduser
        #fields = '__all__'


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
        model = HistoricalPlace
        fields = '__all__'


class RecreationalPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecreationalPlace
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    begardusers = serializers.PrimaryKeyRelatedField(many=True, queryset=begarduser.objects.all())

    class Meta:
        model = begarduser
        fields = '__all__'
