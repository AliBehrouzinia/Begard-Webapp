from rest_framework import serializers
from .models import Restaurant
from django.contrib.auth.models import User
from myapp1.models import begarduser

class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = ['city', 'place_id', 'name', 'rating', 'address', 'photo_ref', 'lng', 'lat', 'type']



class UserSerializer(serializers.ModelSerializer):
    owner = serializers.ReadOnlyField(source='owner.username')
    begardusers = serializers.PrimaryKeyRelatedField(many=True, queryset=begarduser.objects.all())
    class Meta:
        model = begarduser
        fields = '__all__'
