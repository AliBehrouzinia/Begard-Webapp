from rest_framework import serializers
from .models import Restaurant


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['city', 'place_id', 'name', 'rating', 'address', 'photo_ref', 'lng', 'lat', 'type']
