import datetime

from django.db.models import Q

from data.models import Data


def get_working_hours(week_day, converted_time=True):
    is_non_working_hour = False
    start = end = 0
    data = Data.objects.first()

    if (week_day == 0):
        if not(data.start_work_monday):
            is_non_working_hour = True
        else:
            start = data.start_work_monday
            end = data.end_work_monday

    elif (week_day == 1):
        if not(data.start_work_tuesday):
            is_non_working_hour = True
        else:
            start = data.start_work_tuesday
            end = data.end_work_tuesday

    elif (week_day == 2):
        if not(data.start_work_wednesday):
            is_non_working_hour = True
        else:
            start = data.start_work_wednesday
            end = data.end_work_wednesday

    elif (week_day == 3):
        if not(data.start_work_thursday):
            is_non_working_hour = True
        else:
            start = data.start_work_thursday
            end = data.end_work_thursday

    elif (week_day == 4):
        if not(data.start_work_friday):
            is_non_working_hour = True
        else:
            start = data.start_work_friday
            end = data.end_work_friday

    elif (week_day == 5):
        if not(data.start_work_saturday):
            is_non_working_hour = True
        else:
            start = data.start_work_saturday
            end = data.end_work_saturday

    elif (week_day == 6):
        if not(data.start_work_sunday):
            is_non_working_hour = True
        else:
            start = data.start_work_sunday
            end = data.end_work_sunday

    if converted_time:
        start = int(start.hour) * 60 + int(start.minute)
        end = int(end.hour) * 60 + int(end.minute)

    return {
        'start': start,
        'end': end,
        'is_non_working_hour': is_non_working_hour,
    }
