import datetime
import random
from faker import Faker

from django.core.management.base import BaseCommand
from django.utils import timezone

from server.utilities import get_working_hours
from accounts.models import Account
from meetings.models import Meeting


class Command(BaseCommand):
    help = 'Populate meetings'

    def add_arguments(self, parser):
        parser.add_argument('start', nargs='+', type=str)
        parser.add_argument('end', nargs='+', type=str)

    def handle(self, *args, **options):
        faker = Faker('pl_PL')
        self.stdout.write(self.style.WARNING('\n\nPopulating meetings DATABASE\n'))

        current_date = datetime.datetime.strptime(options['start'][0], '%Y-%m-%d')

        end_date = datetime.datetime.strptime(options['end'][0], '%Y-%m-%d')

        barber1 = Account.objects.get(is_admin=True, email='kamilkamil554@wp.pl')
        barber2 = Account.objects.get(is_admin=True, email='fryzjer@fryzjer.pl')

        while current_date <= end_date:
            work_hours = get_working_hours(current_date.weekday(), False)

            if not(work_hours['is_non_working_hour']):
                current_time = current_date.replace(
                    hour=int(work_hours['start'].hour), minute=int(work_hours['start'].minute))
                end_time = current_date.replace(hour=int(work_hours['end'].hour), minute=int(work_hours['end'].minute))

                while current_time < end_time:
                    customer1, _ = Account.objects.get_or_create(
                        email=faker.unique.email(),
                        first_name=faker.first_name(),
                        last_name=faker.last_name(),
                        phone_number='+48500484315',
                        trusted_customer=faker.boolean()
                    )

                    customer2, _ = Account.objects.get_or_create(
                        email=faker.unique.email(),
                        first_name=faker.first_name(),
                        last_name=faker.last_name(),
                        phone_number='+48500484315',
                        trusted_customer=faker.boolean()
                    )

                    Meeting.objects.create(
                        barber=barber1,
                        customer=customer1,
                        customer_first_name=customer1.first_name,
                        customer_last_name=customer1.last_name,
                        customer_phone_number=customer1.phone_number,
                        type=random.choice(['hair', 'beard']),
                        start=current_time
                    )

                    Meeting.objects.create(
                        barber=barber2,
                        customer=customer2,
                        customer_first_name=customer2.first_name,
                        customer_last_name=customer2.last_name,
                        customer_phone_number=customer2.phone_number,
                        type=random.choice(['hair', 'beard']),
                        start=current_time
                    )

                    current_time += datetime.timedelta(minutes=30)

            current_date += datetime.timedelta(days=1)

        self.stdout.write(self.style.SUCCESS('\nMeetings DATABASE was populated\n\n'))
