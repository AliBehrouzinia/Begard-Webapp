import enum
import datetime
from .models import *
from .serializers import SuggestPlanSerializer, PlanItemSerializer


def calculate_total_hours(start_time, end_time):
    hours = (start_time.day - end_time.day - 2) * 24
    hours += end_time.hour
    hours += 24 - start_time.hour
    return hours


class Slot:
    def __init__(self, start, finish):
        self.Start = start
        self.Finish = finish
        self.Place_id = None
        self.Plan_id = None
        self.Tags = None


class TimeTable:
    def __init__(self, start, finish):
        self.Table = []
        self.StartDateTime = start
        self.FinishDateTime = finish

    def create_slots(self, activity_minute, rest_minute):

        total_hours = calculate_total_hours(self.StartDateTime, self.FinishDateTime)
        total_days = self.FinishDateTime.day - self.StartDateTime.day + 1
        slot_count = total_hours / (activity_minute + rest_minute)

        activity_datetime = datetime.timedelta(0, 0, 0, activity_minute/60, activity_minute % 60)
        rest_datetime = datetime.timedelta(0, 0, 0, rest_minute/60, rest_minute % 60)

        flag = self.StartDateTime
        for i in range(total_days):
            self.Table.append(Slot(flag, flag + activity_datetime))
            flag = flag + activity_datetime + rest_datetime
