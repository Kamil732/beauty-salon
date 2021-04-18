import json

from django.urls import reverse
from django.template.defaultfilters import slugify
from rest_framework.test import APIClient, APITestCase

from faker import Faker
from accounts.models import Account
from meetings.models import Meeting


class TestMeetings(APITestCase):
    def setUp(self):
        self.faker = Faker('pl_PL')

        self.email = self.faker.email()
        self.password = self.faker.sentence()
        Account.objects.create_user(
            email=self.email,
            password=self.password,
            first_name=self.faker.first_name(),
            last_name=self.faker.last_name(),
            phone_number=self.faker.phone_number()
        )

        self.admin_email = self.faker.email()
        self.admin_password = self.faker.sentence()
        admin = Account.objects.create_user(
            email=self.admin_email,
            password=self.admin_password,
            first_name=self.faker.first_name(),
            last_name=self.faker.last_name(),
            phone_number=self.faker.phone_number(),
        )
        admin.is_admin = True
        admin.save()

        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.meeting_list_url = reverse('meeting-list')
        self.meeting_detail_url = lambda id: reverse('meeting-detail', args=[id])
