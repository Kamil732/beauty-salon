import json

from django.urls import reverse
from django.template.defaultfilters import slugify
from rest_framework.test import APIClient, APITestCase

from faker import Faker
from accounts.models import Account
from data.models import Data


class TestData(APITestCase):
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
        self.data_list_url = reverse('data-list')
        self.data_update_url = lambda name: reverse('data-update', args=[name])

    def test_get_data(self):
        res = self.client.get(self.data_list_url)

        self.assertEqual(res.status_code, 200)

    def test_update_data_not_logged(self):
        # Create Data
        display_name = self.faker.word()
        name = slugify(display_name)
        Data.objects.create(
            display_name=display_name,
            name=name,
            value=self.faker.word()
        )

        # Update Data
        data = json.dumps({
            'value': self.faker.word(),
        })
        res = self.client.put(self.data_update_url(name), data=data, content_type='application/json')

        self.assertEqual(res.status_code, 403)

    def test_update_data_not_admin(self):
        # Create Data
        display_name = self.faker.word()
        name = slugify(display_name)
        Data.objects.create(
            display_name=display_name,
            name=name,
            value=self.faker.word()
        )

        # Login
        data = json.dumps({
            'email': self.email,
            'password': self.password,
        })
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Update Data
        data = json.dumps({
            'value': self.faker.word(),
        })
        res = self.client.put(self.data_update_url(name), data=data, content_type='application/json')

        self.assertEqual(res.status_code, 403)

    def test_update_data(self):
        # Create Data
        display_name = self.faker.word()
        name = slugify(display_name)
        Data.objects.create(
            display_name=display_name,
            name=name,
            value=self.faker.word()
        )

        # Login
        data = json.dumps({
            'email': self.admin_email,
            'password': self.admin_password,
        })
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Update Data
        value = self.faker.word()
        data = json.dumps({
            'value': value,
        })
        res = self.client.put(self.data_update_url(name), data=data, content_type='application/json')

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['value'], value)
