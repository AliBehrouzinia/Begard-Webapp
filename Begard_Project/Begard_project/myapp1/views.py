from django.shortcuts import render
from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, mixins,decorators
from . import models, serializers
import googlemaps
import time
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from django.http import Http404
from myapp1.models import begarduser
from myapp1.serializers import UserSerializer
from rest_framework import permissions
from myapp1.permissions import IsOwnerOrReadOnly


API_KEY = 'AIzaSyAIFNnz7b2JJ96a_LEAF90j4Yx2iLlCNrY'
API_KEY1 = 'AIzaSyBvEnnTzzWtSJ6nujmphmvPFXVXHMviX1I'




permission_classes = [permissions.IsAuthenticatedOrReadOnly,
                      IsOwnerOrReadOnly]

class begarduserList(generics.ListCreateAPIView):
    queryset = begarduser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class begarduserDetail(generics.RetrieveUpdateDestroyAPIView):
    queryset = begarduser.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class BuildTrigger(APIView):
    authentication_classes = (TokenAuthentication,)
    permission_classes = (IsAuthenticated,)

class GoogleApiRestaurants(generics.ListAPIView):
    """return the list of Restaurant"""
    queryset = models.Restaurant.objects.all()
    serializer_class = serializers.RestaurantSerializer


@decorators.api_view()
def api(request):
    result = get_map_api(request)
    return Response(result, status=status.HTTP_200_OK)


def get_map_api(request):
    gmap = googlemaps.Client(key=API_KEY1, retry_over_query_limit=False)

    place = googlemaps.places.places_nearby(gmap, location='35.710932, 51.409525', radius=10000, type='restaurant')

    time.sleep(1)

    place_result = place['results']

    try:
        teh_city = models.City.objects.get(name='Tehran')
    except ObjectDoesNotExist:
        teh_city = models.City(name="Tehran")
        teh_city.save()

    for Value in place_result:
        try:
            models.Restaurant.objects.create(name=Value['name'], rating=Value['rating'],
                                             photo_ref=Value['photos'][0]['photo_reference'],
                                             city=teh_city,
                                             place_id=Value['place_id'],
                                             lat=Value['geometry']['location']['lat'],
                                             lng=Value['geometry']['location']['lng'])
        except IntegrityError:
            pass
    return place_result
