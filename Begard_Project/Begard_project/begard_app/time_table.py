import enum
import datetime
from .models import *


def calculate_total_hours(start_time, end_time):
    hours = (start_time.day - end_time.day - 2) * 24
    hours += end_time.hour
    hours += 24 - start_time.hour
    return hours


class Tags(enum.Enum):
    Unavailable = 1
    BreakFast = 2
    Lunch = 3
    Dinner = 4
    Rest = 5
    Museum = 6
    RecreationalPlace = 7
    TouristAttraction = 8
    ShoppingMall = 9


class Slot:
    def __init__(self, start, finish):
        self.Start = start
        self.Finish = finish
        self.Place_id = None
        self.Plan_id = None
        self.Tags = []
        self.Is_Lock_for_Tagging = False


class TimeTable:
    def __init__(self, start, finish):
        self.Table = []
        self.StartDateTime = start
        self.FinishDateTime = finish

    def create_table(self, activity_minute, rest_minute):
        total_days = self.FinishDateTime.day - self.StartDateTime.day + 1
        slot_count_per_day = 24 / (activity_minute + rest_minute)

        activity_timedelta = datetime.timedelta(0, 0, 0, activity_minute/60, activity_minute % 60)
        rest_timedelta = datetime.timedelta(0, 0, 0, rest_minute/60, rest_minute % 60)

        for day in range(total_days):
            self.Table.append([])
            flag = datetime.datetime(self.StartDateTime.year, self.StartDateTime.month, self.StartDateTime.day, 0, 0, 0)
            for s in range(slot_count_per_day):
                self.Table[day].append(Slot(flag, flag + activity_timedelta))
                flag = flag + activity_timedelta + rest_timedelta

    def choose(self, slot, places, type_of_place):
        selected_place = places[type_of_place][0]
        slot.Place_id = selected_place['place_id']
        places[type_of_place].remove(selected_place)

    def unavailable_choose_location(self, slot, places):
        slot.Place_id = "unavailable"
        return places

    def breakfast_choose_location(self, slot, places):
        self.choose(slot, places, 'cafe')
        return places

    def lunch_dinner_choose_location(self, slot, places):
        self.choose(slot, places, 'restaurant')
        return places

    def rest_choose_location(self, slot, places):
        slot.Place_id = "rest"
        return places

    def museum_choose_location(self, slot, places):
        self.choose(slot, places, 'museum')
        return places

    def recreational_choose_location(self, slot, places):
        self.choose(slot, places, 'recreational_place')
        return places

    def tourist_attraction_choose_location(self, slot, places):
        self.choose(slot, places, 'tourist_attraction')
        return places

    def shopping_mall_choose_location(self, slot, places):
        self.choose(slot, places, 'shopping_mall')
        return places

    select_location = {
        Tags.Unavailable: unavailable_choose_location,
        Tags.BreakFast: breakfast_choose_location,
        Tags.Lunch: lunch_dinner_choose_location,
        Tags.Dinner: lunch_dinner_choose_location,
        Tags.Rest: rest_choose_location,
        Tags.Museum: museum_choose_location,
        Tags.RecreationalPlace: recreational_choose_location,
        Tags.TouristAttraction: tourist_attraction_choose_location,
        Tags.ShoppingMall: shopping_mall_choose_location
    }

    def set_places(self):
        places = self.top_from_all_models(10)
        chosen_so_far = {
            Tags.Museum: 0,
            Tags.RecreationalPlace: 0,
            Tags.TouristAttraction: 0,
            Tags.ShoppingMall: 0
        }

        for slot in range(len(self.Table[0])):
            for day in range(len(self.Table)):
                slot = self.Table[day][slot]
                tag = self.get_least_used(slot.Tags, chosen_so_far)
                places = self.select_location[tag](slot, places)

    @staticmethod
    def top_from_all_models(n):
        """get top n places from every model in database according to rating"""
        result = {
            "restaurant": list(Restaurant.objects.order_by('-rating')[0:n]),
            "museum": list(Museum.objects.order_by('-rating')[0:n]),
            "tourist_attraction": list(TouristAttraction.objects.order_by('-rating')[0:n]),
            "recreational_place": list(RecreationalPlace.objects.order_by('-rating')[0:n]),
            "cafe": list(Cafe.objects.order_by('-rating')[0:n]),
            "shopping_all": list(ShoppingMall.objects.order_by('-rating')[0:n]),
        }

        return result

    def tagging(self):
        self.unavailable_tags(self.Table)
        self.rest_tags(self.Table)
        self.breakfast_lunch_dinner_tags(self.Table)
        self.museum_touristattraction_tags(self.Table)
        self.recreationalplace_shoppingmall_tags(self.Table)

    def unavailable_tags(self, table):
        hour_start_trip = self.StartDateTime.hour
        hour_finish_trip = self.FinishDateTime

        for slot in table[0]:
            if slot.Start.hour < hour_start_trip:
                slot.Tags.append(Tags.Unavailable)
                slot.Is_Lock_for_Tagging = True

        last = len(table) - 1
        for slot in table[last]:
            if slot.Finish.hour > hour_finish_trip:
                slot.Tags.append(Tags.Unavailable)
                slot.Is_Lock_for_Tagging = True

    def rest_tags(self, table, intervals_per_day=None):
        if intervals_per_day is None:
            intervals_per_day = [(0, 8), (22, 24)]

        for day in table:
            for slot in day:
                if not slot.Is_Lock_for_Tagging:
                    for i in intervals_per_day:
                        if i[0] <= slot.Start.hour <= (i[1] - 1):
                            slot.Tags.append(Tags.Rest)
                            slot.Is_Lock_for_Tagging = True

    def breakfast_lunch_dinner_tags(self, table, breakfast, lunch, dinner):
        for day in table:
            for slot in day:
                if not slot.Is_Lock_for_Tagging:
                    if slot.Start.hour <= breakfast <= slot.Finish.hour:
                        slot.Tags.append(Tags.BreakFast)
                        slot.Is_Lock_for_Tagging = True
                    elif slot.Start.hour <= lunch <= slot.Finish.hour:
                        slot.Tags.append(Tags.Lunch)
                        slot.Is_Lock_for_Tagging = True
                    elif slot.Start.hour <= dinner <= slot.Finish.hour:
                        slot.Tags.append(Tags.Dinner)
                        slot.Is_Lock_for_Tagging = True

    def museum_touristattraction_tags(self, table):
        for day in table:
            for slot in day:
                if not slot.Is_Lock_for_Tagging:
                    if slot.Start.hour <= 16:
                        slot.Tags.append(Tags.Museum)
                        slot.Tags.append(Tags.TouristAttraction)

    def recreationalplace_shoppingmall_tags(self, table):
        for day in table:
            for slot in day:
                if not slot.Is_Lock_for_Tagging:
                    slot.Tags.append(Tags.RecreationalPlace)
                    slot.Tags.append(Tags.ShoppingMall)

    def get_least_used(self, tags, chosen_so_far):
        if len(tags)==1:
            return tags[0]

        my_list = {}
        for t in tags:
            my_list[t] = chosen_so_far[t]

        tag = sorted(my_list, key=lambda items: items[1])[0]

        return tag[0]
