from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from rest_framework import  decorators
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, mixins
from . import models, serializers
import googlemaps
import time

API_KEY = 'AIzaSyAIFNnz7b2JJ96a_LEAF90j4Yx2iLlCNrY'
API_KEY1 = 'AIzaSyBvEnnTzzWtSJ6nujmphmvPFXVXHMviX1I'


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

