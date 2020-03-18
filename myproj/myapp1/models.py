from django.db import models
# from django.contrib.gis.db.models import PointField


class City(models.Model):
    name = models.CharField(max_length=100, null=True)

    def ___str__(self):
        return "{}".format(self.name)


class Place(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True,)
    place_id = models.CharField(max_length=500, primary_key=True, default="0")
    name = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    address = models.TextField(default="Nothing")
    photo_ref = models.TextField(default="Nothing")

    class Meta:
        abstract = True


class Restaurant(Place):
    # location = models.PointField()
    lng = models.DecimalField(max_digits=13, decimal_places=9, null=True)
    lat = models.DecimalField(max_digits=13, decimal_places=9, null=True)
    type = models.CharField(max_length=100, default="restaurant")

    def __str__(self):
        return "{}|{}|{}|{}|{}|{}".format(self.city.name, self.name, self.rating, self.lng, self.lat, self.type)


class Hotel(Place):
    # location = models.PointField()
    def __str__(self):
        return "{}|{}|{}|{}".format(self.city,self.name,self.rating,self.address)


class Meseum(Place):
    # location = models.PointField()
    def __str__(self):
        return "{}|{}|{}|{}".format(self.city,self.name,self.rating,self.address)


class HistoricalPlace(Place):
    # location = models.PointField()
    def __str__(self):
        return "{}|{}|{}|{}".format(self.city,self.name,self.rating,self.address)


class RecreationalPlace(Place):
    # location = models.PointField()
    def __str__(self):
        return "{}|{}|{}|{}".format(self.city,self.name,self.rating,self.address)
