from django.db import models
from django.conf import settings
from django.db.models.signals import post_save
from django.dispatch import receiver
from rest_framework.authtoken.models import Token


class begarduser(models.Model):
    username = models.CharField(max_length=100)
    password = models.CharField(max_length=100)
    token = models.CharField(max_length=300)


@receiver(post_save, sender=settings.AUTH_USER_MODEL)
def create_auth_token(sender, instance=None, created=False, **kwargs):
    if created:
        Token.objects.create(user=instance)


class City(models.Model):
    name = models.CharField(max_length=100, null=True)

    def ___str__(self):
        return self.name


class Place(models.Model):
    city = models.ForeignKey(City, on_delete=models.CASCADE, null=True,)
    place_id = models.CharField(max_length=500, primary_key=True, default="none")
    name = models.CharField(max_length=100)
    rating = models.DecimalField(max_digits=2, decimal_places=1, default=0.0)
    address = models.TextField(default="Nothing")
    photo_ref = models.TextField(default="Nothing")
    lng = models.DecimalField(max_digits=13, decimal_places=9, null=True)
    lat = models.DecimalField(max_digits=13, decimal_places=9, null=True)

    class Meta:
        abstract = True


class Restaurant(Place):

    def __str__(self):
        return self.city.name+"-"+self.name


class Hotel(Place):

    def __str__(self):
        return self.city.name+"-"+self.name


class Museum(Place):

    def __str__(self):
        return self.city.name+"-"+self.name


class HistoricalPlace(Place):

    def __str__(self):
        return self.city.name+"-"+self.name


class RecreationalPlace(Place):

    def __str__(self):
        return self.city.name+"-"+self.name
