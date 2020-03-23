from django.core.exceptions import ObjectDoesNotExist
from django.db import IntegrityError
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status, generics, decorators
from . import models, serializers, google_map_api
from rest_framework.authentication import TokenAuthentication
from rest_framework.permissions import IsAuthenticated
from .models import begarduser
from .serializers import UserSerializer
from rest_framework import permissions
from .permissions import IsOwnerOrReadOnly


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


class CitiesList(generics.ListAPIView):
    """List of cities in database, include name and id"""
    queryset = models.City.objects.all()
    serializer_class = serializers.CitySerializer


class SuggestList(generics.ListAPIView):
    """List of some suggestion according to selected city"""
    serializer_class = serializers.SuggestSerializer

    def get_queryset(self):
        city_id = self.kwargs.get('id')
        city = models.City.objects.get(pk=city_id)

        queryset = list(models.Restaurant.objects.filter(city=city).order_by('-rating')[0:3])
        queryset += models.RecreationalPlace.objects.filter(city=city).order_by('-rating')[0:3]
        queryset += models.Museum.objects.filter(city=city).order_by('-rating')[0:3]

        return queryset


@decorators.api_view(['GET'])
def get_data(request):
    api = google_map_api.API()

    lat = 35.738222
    lng = 51.506882
    place_type = 'tourist_attraction'

    result = api.search_nearby(lat, lng, place_type)
    city = models.City.objects.get(name="Tehran")
    for r in result:
        try:
            obj = models.HistoricalPlace(city=city, place_id=r['place_id'], name=r['name'], rating=r['rating'],
                                         address=r['vicinity'], photo_ref=r['photos'][0]['photo_reference'],
                                         lng=r['geometry']['location']['lng'], lat=r['geometry']['location']['lat'])
            if not models.HistoricalPlace.objects.filter(place_id=obj.place_id).exists():
                obj.save()
        except KeyError:
            pass

    return Response(result, status.HTTP_200_OK)
