import json
import random
import datetime

from django.urls import reverse
from django.template.defaultfilters import slugify
from rest_framework.test import APIClient, APITestCase

from phonenumber_field.phonenumber import PhoneNumber
from faker import Faker
from accounts.models import Account
from meetings.models import Meeting


class TestMeetings(APITestCase):
    def setUp(self):
        self.faker = Faker('pl_PL')

        self.email = self.faker.email()
        self.password = self.faker.sentence()
        self.phone_number = '+48500484315'
        self.account = Account.objects.create_user(
            email=self.email,
            password=self.password,
            first_name=self.faker.first_name(),
            last_name=self.faker.last_name(),
            phone_number=self.phone_number
        )

        self.email2 = self.faker.email()
        self.account2 = Account.objects.create_user(
            email=self.email2,
            password=self.password,
            first_name=self.faker.first_name(),
            last_name=self.faker.last_name(),
            phone_number=self.phone_number
        )

        self.admin_email = self.faker.email()
        self.admin_password = self.faker.sentence()
        self.admin = Account.objects.create_user(
            email=self.admin_email,
            password=self.admin_password,
            first_name=self.faker.first_name(),
            last_name=self.faker.last_name(),
            phone_number=self.phone_number,
        )
        self.admin.is_admin = True
        self.admin.save()

        self.admin2 = Account.objects.create_user(
            email=self.faker.email(),
            password=self.admin_password,
            first_name=self.faker.first_name(),
            last_name=self.faker.last_name(),
            phone_number=self.phone_number,
        )
        self.admin2.is_admin = True
        self.admin2.save()

        self.login_url = reverse('login')
        self.logout_url = reverse('logout')
        self.meeting_list_url = reverse('meeting-list')
        self.meeting_detail_url = lambda id: reverse('meeting-detail', args=[id])

    def test_get_meeting(self):
        res = self.client.get(self.meeting_list_url)

        self.assertEqual(res.status_code, 200)

    def test_get_meetings_from_to(self):
        today = datetime.date.today()
        monday = today - datetime.timedelta(days=today.weekday())

        res = self.client.get(self.meeting_list_url, {
            'from': monday,
            'to': monday + datetime.timedelta(days=7),
        }, indent=4, sort_keys=True, default=str)

        self.assertEqual(res.status_code, 200)

    def test_create_meeting_not_logged(self):
        end = datetime.datetime.now() + datetime.timedelta(minutes=60)
        start = datetime.datetime.now() + datetime.timedelta(minutes=30)
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin.slug,
            'customer': self.account.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account.first_name,
            'customer_last_name': self.account.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.post(self.meeting_list_url, data=data, content_type='application/json')

        self.assertEqual(res.status_code, 403)

    def test_create_meeting_not_admin(self):
        # Login
        data = json.dumps({
            'email': self.email,
            'password': self.password,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Create meeting
        end = datetime.datetime.now() + datetime.timedelta(minutes=60)
        start = datetime.datetime.now() + datetime.timedelta(minutes=30)
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin.slug,
            'customer': self.account.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account.first_name,
            'customer_last_name': self.account.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.post(self.meeting_list_url, data=data, content_type='application/json')

        self.assertEqual(res.status_code, 201)
        self.assertIsNotNone(res.data.get('id'))
        self.assertIsNotNone(res.data.get('do_not_work'))
        self.assertEqual(res.data['barber_first_name'], self.admin.first_name)
        self.assertEqual(res.data['customer_last_name'], self.account.last_name)
        self.assertEqual(res.data['customer_first_name'], self.account.first_name)
        self.assertEqual(res.data['customer_phone_number'], self.phone_number)
        self.assertEqual(res.data['customer_fax_number'], self.phone_number)
        self.assertEqual(res.data['type'], 'Włosy' if type == 'hair' else 'Broda')

    def test_create_meeting(self):
        # Login
        data = json.dumps({
            'email': self.admin_email,
            'password': self.admin_password,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Create meeting
        end = datetime.datetime.now() + datetime.timedelta(minutes=60)
        start = datetime.datetime.now() + datetime.timedelta(minutes=30)
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin.slug,
            'customer': self.account.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account.first_name,
            'customer_last_name': self.account.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.post(self.meeting_list_url, data=data, content_type='application/json')

        self.assertEqual(res.status_code, 201)
        self.assertIsNotNone(res.data.get('id'))
        self.assertIsNotNone(res.data.get('do_not_work'))
        self.assertEqual(res.data['barber_first_name'], self.admin.first_name)
        self.assertEqual(res.data['customer_last_name'], self.account.last_name)
        self.assertEqual(res.data['customer_first_name'], self.account.first_name)
        self.assertEqual(res.data['customer_phone_number'], self.phone_number)
        self.assertEqual(res.data['customer_fax_number'], self.phone_number)
        self.assertEqual(res.data['type'], 'Włosy' if type == 'hair' else 'Broda')

    def test_update_meeting_not_logged(self):
        # Login
        data = json.dumps({
            'email': self.admin_email,
            'password': self.admin_password,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Create meeting
        end = datetime.datetime.now() + datetime.timedelta(minutes=60)
        start = datetime.datetime.now() + datetime.timedelta(minutes=30)
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin.slug,
            'customer': self.account.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account.first_name,
            'customer_last_name': self.account.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.post(self.meeting_list_url, data=data, content_type='application/json')

        # Logout
        data = json.dumps({
            'withCredentials': True,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.logout_url, data=data, content_type='application/json')

        # Update data
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin2.slug,
            'customer': self.account2.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account2.first_name,
            'customer_last_name': self.account2.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.put(self.meeting_detail_url(res.data['id']), data=data, content_type='application/json')

        self.assertEqual(res.status_code, 403)

    def test_update_meeting_not_owner(self):
        # Login
        data = json.dumps({
            'email': self.email,
            'password': self.password,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Create meeting
        end = datetime.datetime.now() + datetime.timedelta(minutes=60)
        start = datetime.datetime.now() + datetime.timedelta(minutes=30)
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin.slug,
            'customer': self.account.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account.first_name,
            'customer_last_name': self.account.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.post(self.meeting_list_url, data=data, content_type='application/json')

        # Logout
        data = json.dumps({
            'withCredentials': True,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.logout_url, data=data, content_type='application/json')

        # Login
        data = json.dumps({
            'email': self.email2,
            'password': self.password,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Update data
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin2.slug,
            'customer': self.account2.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account2.first_name,
            'customer_last_name': self.account2.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.put(self.meeting_detail_url(res.data['id']), data=data, content_type='application/json')

        self.assertEqual(res.status_code, 403)

    def test_update_meeting(self):
        # Login
        data = json.dumps({
            'email': self.email,
            'password': self.password,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Create meeting
        end = datetime.datetime.now() + datetime.timedelta(minutes=60)
        start = datetime.datetime.now() + datetime.timedelta(minutes=30)
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin.slug,
            'customer': self.account.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account.first_name,
            'customer_last_name': self.account.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.post(self.meeting_list_url, data=data, content_type='application/json')

        # Update data
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin2.slug,
            'customer': self.account2.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account2.first_name,
            'customer_last_name': self.account2.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.put(self.meeting_detail_url(res.data['id']), data=data, content_type='application/json')

        self.assertEqual(res.status_code, 200)
        self.assertEqual(res.data['barber_first_name'], self.admin2.first_name)
        self.assertEqual(res.data['customer_fax_number'], self.phone_number)
        self.assertEqual(res.data['customer_first_name'], self.account2.first_name)
        self.assertEqual(res.data['customer_last_name'], self.account2.last_name)
        self.assertEqual(res.data['customer_phone_number'], self.phone_number)
        self.assertEqual(res.data['type'], 'Włosy' if type == 'hair' else 'Broda')

    def test_delete_meeting_not_logged(self):
        # Login
        data = json.dumps({
            'email': self.admin_email,
            'password': self.admin_password,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Create meeting
        end = datetime.datetime.now() + datetime.timedelta(minutes=60)
        start = datetime.datetime.now() + datetime.timedelta(minutes=30)
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin.slug,
            'customer': self.account.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account.first_name,
            'customer_last_name': self.account.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.post(self.meeting_list_url, data=data, content_type='application/json')

        # Logout
        data = json.dumps({
            'withCredentials': True,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.logout_url, data=data, content_type='application/json')

        # Delete data
        res = self.client.delete(self.meeting_detail_url(res.data['id']), data=data, content_type='application/json')

        self.assertEqual(res.status_code, 403)

    def test_delete_meeting_not_owner(self):
        # Login
        data = json.dumps({
            'email': self.email,
            'password': self.password,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Create meeting
        end = datetime.datetime.now() + datetime.timedelta(minutes=60)
        start = datetime.datetime.now() + datetime.timedelta(minutes=30)
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin.slug,
            'customer': self.account.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account.first_name,
            'customer_last_name': self.account.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.post(self.meeting_list_url, data=data, content_type='application/json')

        # Logout
        data = json.dumps({
            'withCredentials': True,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.logout_url, data=data, content_type='application/json')

        # Login
        data = json.dumps({
            'email': self.email2,
            'password': self.password,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Delete data
        res = self.client.delete(self.meeting_detail_url(res.data['id']), data=data, content_type='application/json')

        self.assertEqual(res.status_code, 403)

    def test_delete_meeting(self):
        # Login
        data = json.dumps({
            'email': self.admin_email,
            'password': self.admin_password,
        }, indent=4, sort_keys=True, default=str)
        self.client.post(self.login_url, data=data, content_type='application/json')

        # Create meeting
        end = datetime.datetime.now() + datetime.timedelta(minutes=60)
        start = datetime.datetime.now() + datetime.timedelta(minutes=30)
        type = random.choice(['hair', 'beard'])
        data = json.dumps({
            'barber': self.admin.slug,
            'customer': self.account.slug,
            'customer_fax_number': self.phone_number,
            'customer_first_name': self.account.first_name,
            'customer_last_name': self.account.last_name,
            'customer_phone_number': self.phone_number,
            'end': end,
            'start': start,
            'type': type,
        }, indent=4, sort_keys=True, default=str)
        res = self.client.post(self.meeting_list_url, data=data, content_type='application/json')

        # Delete data
        res = self.client.delete(self.meeting_detail_url(res.data['id']), data=data, content_type='application/json')

        self.assertEqual(res.status_code, 204)
