from django.db import models
from django.contrib.auth.models import AbstractBaseUser
from django.contrib.auth.models import PermissionsMixin
from django.utils.translation import gettext_lazy as _
from django.utils import timezone

from .managers import BegardUserManager


class BegardUser(AbstractBaseUser, PermissionsMixin):
    email = models.EmailField(_('email address'), unique=True)
    is_staff = models.BooleanField(default=True)
    is_active = models.BooleanField(default=True)
    date_joined = models.DateTimeField(default=timezone.now)
    is_admin = True

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    objects = BegardUserManager()

    def __str__(self):
        return self.email

    @property
    def is_superuser(self):
        return self.is_admin

    @property
    def is_staff(self):
        return self.is_admin

    def has_perm(self, perm, obj=None):
        return self.is_admin

    def has_module_perms(self, app_label):
        return self.is_admin

    @is_staff.setter
    def is_staff(self, value):
        self._is_staff = value


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


class TouristAttraction(Place):

    def __str__(self):
        return self.city.name+"-"+self.name


class RecreationalPlace(Place):

    def __str__(self):
        return self.city.name+"-"+self.name
