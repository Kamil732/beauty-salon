import datetime

from django.db.models import Q

from data.models import Data


def get_working_hours(week_day, translated_time=True):
    is_non_working_hour = False
    start = end = 0
    days = {}

    for date in Data.objects.filter(Q(name__startswith='start_work') | Q(name__startswith='end_work')):
        days[date.name] = date.value

    if (week_day == 0):
        if not(days['start_work_monday']):
            is_non_working_hour = True
        else:
            start = days['start_work_monday']
            end = days['end_work_monday']

    elif (week_day == 1):
        if not(days['start_work_tuesday']):
            is_non_working_hour = True
        else:
            start = days['start_work_tuesday']
            end = days['end_work_tuesday']

    elif (week_day == 2):
        if not(days['start_work_wednesday']):
            is_non_working_hour = True
        else:
            start = days['start_work_wednesday']
            end = days['end_work_wednesday']

    elif (week_day == 3):
        if not(days['start_work_thursday']):
            is_non_working_hour = True
        else:
            start = days['start_work_thursday']
            end = days['end_work_thursday']

    elif (week_day == 4):
        if not(days['start_work_friday']):
            is_non_working_hour = True
        else:
            start = days['start_work_friday']
            end = days['end_work_friday']

    elif (week_day == 5):
        if not(days['start_work_saturday']):
            is_non_working_hour = True
        else:
            start = days['start_work_saturday']
            end = days['end_work_saturday']

    elif (week_day == 6):
        if not(days['start_work_sunday']):
            is_non_working_hour = True
        else:
            start = days['start_work_sunday']
            end = days['end_work_sunday']

    if translated_time:
        start = int(start.split(':')[0]) * 60 + int(start.split(':')[1])
        end = int(end.split(':')[0]) * 60 + int(end.split(':')[1])

    return {
        'start': start,
        'end': end,
        'is_non_working_hour': is_non_working_hour,
    }
