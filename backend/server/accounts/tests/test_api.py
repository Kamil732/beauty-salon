import json

from rest_framework.test import APIClient, APITestCase
from django.urls import reverse
from faker import Faker

from accounts.models import Account


class TestAuthentication(APITestCase):
    def setUp(self):
        self.faker = Faker('pl_PL')

        self.email = self.faker.email()
        self.password = self.faker.sentence()
        self.first_name = self.faker.first_name()
        self.last_name = self.faker.last_name()

        Account.objects.create_user(
            email=self.email,
            password=self.password,
            first_name=self.first_name,
            last_name=self.last_name,
            phone_number=self.faker.phone_number()
        )

        self.set_csrf_cookie_url = reverse('set-csrf-cookie')
        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.current_account_url = reverse('current-account')

    def test_set_csrf_cookie(self):
        res = self.client.get(self.set_csrf_cookie_url)

        self.assertEqual(res.status_code, 200)

    def test_login_correct_data(self):
        data = json.dumps({
            'email': self.email,
            'password': self.password,
        })
        res = self.client.post(self.login_url, data=data, content_type='application/json')

        self.assertEqual(res.status_code, 200)
        self.assertNotEqual(res.data.get('message'), None)
        self.assertNotEqual(res.data.get('user'), None)
        self.assertNotEqual(res.data['user'].get('id'), None)
        self.assertEqual(res.data['user']['first_name'], self.first_name)
        self.assertEqual(res.data['user']['last_name'], self.last_name)
        self.assertEqual(res.data['user']['is_admin'], False)

    def test_login_incorrect_data(self):
        data = json.dumps({
            'email': self.faker.email(),
            'password': self.faker.sentence(),
        })
        res = self.client.post(self.login_url, data=data, content_type='application/json')

        self.assertEqual(res.status_code, 400)
        self.assertNotEqual(res.data.get('detail', 'empty'), 'empty')

    def test_get_current_account_not_logged(self):
        res = self.client.get(self.current_account_url)

        self.assertEqual(res.status_code, 403)

    def test_get_current_account(self):
        data = json.dumps({
            'email': self.email,
            'password': self.password,
        })
        self.client.post(self.login_url, data=data, content_type='application/json')
        res = self.client.get(self.current_account_url)

        self.assertEqual(res.status_code, 200)
        self.assertNotEqual(res.data.get('id'), None)
        self.assertEqual(res.data['first_name'], self.first_name)
        self.assertEqual(res.data['last_name'], self.last_name)
        self.assertEqual(res.data['is_admin'], False)

    def test_logout_not_logged(self):
        data = json.dumps({
            'withCredentials': True,
        })
        res = self.client.post(self.logout_url, data=data, content_type='application/json')

        self.assertEqual(res.status_code, 403)

    def test_logout(self):
        data = json.dumps({
            'email': self.email,
            'password': self.password,
        })
        self.client.post(self.login_url, data=data, content_type='application/json')
        data = json.dumps({
            'withCredentials': True,
        })
        res = self.client.post(self.logout_url, data=data, content_type='application/json')

        self.assertEqual(res.status_code, 200)
        self.assertNotEqual(res.data.get('message'), None)


class TestChoiceListsAndGallery(APITestCase):
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
        self.barber_choice_list_url = reverse('barber-choice-list')
        self.customer_choice_list_url = reverse('customer-choice-list')
        self.gallery_list_url = reverse('gallery-list')

    def test_get_barber_choice_list(self):
        res = self.client.get(self.barber_choice_list_url)

        self.assertEqual(res.status_code, 200)

    def test_get_customer_choice_list_not_logged(self):
        res = self.client.get(self.customer_choice_list_url)

        self.assertEqual(res.status_code, 403)

    def test_get_customer_choice_list_not_admin(self):
        data = json.dumps({
            'email': self.email,
            'password': self.password,
        })
        self.client.post(self.login_url, data=data, content_type='application/json')
        res = self.client.get(self.customer_choice_list_url)

        self.assertEqual(res.status_code, 403)

    def test_get_customer_choice_list(self):
        data = json.dumps({
            'email': self.admin_email,
            'password': self.admin_password,
        })
        res = self.client.post(self.login_url, data=data, content_type='application/json')
        res = self.client.get(self.customer_choice_list_url)

        self.assertEqual(res.status_code, 200)

    def test_get_gallery(self):
        res = self.client.get(self.gallery_list_url)

        self.assertEqual(res.status_code, 200)
