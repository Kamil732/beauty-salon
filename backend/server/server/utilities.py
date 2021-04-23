import datetime
from django.db.models import Q

from data.models import Data


def get_working_hours(week_day):
    is_non_working_hour = False
    start = end = 0

    days = {}
    for date in Data.objects.filter(Q(name__startswith='start_work') | Q(name__startswith='end_work')):
        days[date.name] = date.value

    if (week_day == 0):
        if not(days['start_work_monday']):
            is_non_working_hour = True
        else:
            start = int(days['start_work_monday'].split(':')[0]) * 60 + int(days['start_work_monday'].split(':')[1])
            end = int(days['end_work_monday'].split(':')[0]) * 60 + int(days['end_work_monday'].split(':')[1])

    elif (week_day == 1):
        if not(days['start_work_tuesday']):
            is_non_working_hour = True
        else:
            start = int(days['start_work_tuesday'].split(':')[0]) * 60 + int(days['start_work_tuesday'].split(':')[1])
            end = int(days['end_work_tuesday'].split(':')[0]) * 60 + int(days['end_work_tuesday'].split(':')[1])

    elif (week_day == 2):
        if not(days['start_work_wednesday']):
            is_non_working_hour = True
        else:
            start = int(days['start_work_wednesday'].split(':')[0]) * 60 + \
                int(days['start_work_wednesday'].split(':')[1])
            end = int(days['end_work_wednesday'].split(':')[0]) * 60 + int(days['end_work_wednesday'].split(':')[1])

    elif (week_day == 3):
        if not(days['start_work_thursday']):
            is_non_working_hour = True
        else:
            start = int(days['start_work_thursday'].split(':')[0]) * 60 + int(days['start_work_thursday'].split(':')[1])
            end = int(days['end_work_thursday'].split(':')[0]) * 60 + int(days['end_work_thursday'].split(':')[1])

    elif (week_day == 4):
        if not(days['start_work_friday']):
            is_non_working_hour = True
        else:
            start = int(days['start_work_friday'].split(':')[0]) * 60 + int(days['start_work_friday'].split(':')[1])
            end = int(days['end_work_friday'].split(':')[0]) * 60 + int(days['end_work_friday'].split(':')[1])

    elif (week_day == 5):
        if not(days['start_work_saturday']):
            is_non_working_hour = True
        else:
            start = int(days['start_work_saturday'].split(':')[0]) * 60 + int(days['start_work_saturday'].split(':')[1])
            end = int(days['end_work_saturday'].split(':')[0]) * 60 + int(days['end_work_saturday'].split(':')[1])

    elif (week_day == 6):
        if not(days['start_work_sunday']):
            is_non_working_hour = True
        else:
            start = int(days['start_work_sunday'].split(':')[0]) * 60 + int(days['start_work_sunday'].split(':')[1])
            end = int(days['end_work_sunday'].split(':')[0]) * 60 + int(days['end_work_sunday'].split(':')[1])

    return {
        'start': start,
        'end': end,
        'is_non_working_hour': is_non_working_hour,
    }
