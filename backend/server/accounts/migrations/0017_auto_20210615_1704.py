# Generated by Django 3.1.7 on 2021-06-15 15:04

import autoslug.fields
from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion
import phonenumber_field.modelfields


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0016_auto_20210527_1240'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='account',
            name='bookings',
        ),
        migrations.RemoveField(
            model_name='account',
            name='fax_number',
        ),
        migrations.RemoveField(
            model_name='account',
            name='first_name',
        ),
        migrations.RemoveField(
            model_name='account',
            name='last_name',
        ),
        migrations.RemoveField(
            model_name='account',
            name='no_shows',
        ),
        migrations.RemoveField(
            model_name='account',
            name='phone_number',
        ),
        migrations.RemoveField(
            model_name='account',
            name='revenue',
        ),
        migrations.RemoveField(
            model_name='account',
            name='slug',
        ),
        migrations.RemoveField(
            model_name='account',
            name='trusted',
        ),
        migrations.CreateModel(
            name='Customer',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('first_name', models.CharField(max_length=20, verbose_name='Imię')),
                ('last_name', models.CharField(max_length=20, verbose_name='Nazwisko')),
                ('phone_number', phonenumber_field.modelfields.PhoneNumberField(max_length=128, region=None, verbose_name='Numer telefonu')),
                ('fax_number', phonenumber_field.modelfields.PhoneNumberField(blank=True, max_length=128, region=None, verbose_name='Zapasowy Numer telefonu')),
                ('bookings', models.PositiveIntegerField(default=0)),
                ('no_shows', models.PositiveIntegerField(default=0)),
                ('revenue', models.PositiveIntegerField(default=0)),
                ('trusted', models.BooleanField(default=False)),
                ('slug', autoslug.fields.AutoSlugField(editable=False, populate_from='first_name', unique=True)),
                ('account', models.OneToOneField(blank=True, null=True, on_delete=django.db.models.deletion.SET_NULL, related_name='profile', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]