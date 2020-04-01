from __future__ import unicode_literals
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin

from .forms import BegardUserCreationForm, BegardUserChangeForm
from .models import BegardUser, City, Restaurant, Plan, PlanItem, Hotel, ShoppingMall, Cafe, RecreationalPlace\
    , TouristAttraction, Museum


class BegardUserAdmin(UserAdmin):
    add_form = BegardUserCreationForm
    form = BegardUserChangeForm
    model = BegardUser
    list_display = ('email', 'date_joined')
    list_filter = ('email', 'date_joined')
    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        ('Permissions', {'fields': ('date_joined', 'is_staff')}),
    )
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('email', 'password1', 'password2')}
         ),
    )
    search_fields = ('email',)
    ordering = ('email',)


admin.site.register(BegardUser, BegardUserAdmin)


class CityAdmin(admin.ModelAdmin):
    model = City
    list_display = ('name', 'name')
    # list_filter = 'name'


admin.site.register(City, CityAdmin)


class RestaurantAdmin(admin.ModelAdmin):
    model = Restaurant
    list_display = ('name', 'city')


admin.site.register(Restaurant, RestaurantAdmin)


class PlanAdmin(admin.ModelAdmin):
    model = Plan
    list_display = ('user', 'destination_city')


admin.site.register(Plan, PlanAdmin)


class PlanItemAdmin(admin.ModelAdmin):
    model = PlanItem
    list_display = ('plan', 'start_date')


admin.site.register(PlanItem, PlanItemAdmin)


class HotelAdmin(admin.ModelAdmin):
    model = Hotel
    list_display = ('name', 'city')


admin.site.register(Hotel, HotelAdmin)


class ShoppingMallAdmin(admin.ModelAdmin):
    model = ShoppingMall
    list_display = ('name', 'city')


admin.site.register(ShoppingMall, ShoppingMallAdmin)


class CafeAdmin(admin.ModelAdmin):
    model = Cafe
    list_display = ('name', 'city')


admin.site.register(Cafe, CafeAdmin)


class RecreationalPlaceAdmin(admin.ModelAdmin):
    model = RecreationalPlace
    list_display = ('name', 'city')


admin.site.register(RecreationalPlace, RecreationalPlaceAdmin)


class TouristAttractionAdmin(admin.ModelAdmin):
    model = TouristAttraction
    list_display = ('name', 'city')


admin.site.register(TouristAttraction, TouristAttractionAdmin)


class MuseumAdmin(admin.ModelAdmin):
    model = Museum
    list_display = ('name', 'city')


admin.site.register(Museum, MuseumAdmin)