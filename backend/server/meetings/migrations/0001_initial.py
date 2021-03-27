# Generated by Django 3.1.7 on 2021-03-27 14:08

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        migrations.swappable_dependency(settings.AUTH_USER_MODEL),
    ]

    operations = [
        migrations.CreateModel(
            name='Meeting',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('type', models.CharField(choices=[('hair', 'Włosy'), ('beard', 'Broda')], max_length=5)),
                ('start', models.DateTimeField()),
                ('account', models.OneToOneField(blank=True, on_delete=django.db.models.deletion.DO_NOTHING, related_name='meetings', to=settings.AUTH_USER_MODEL)),
            ],
        ),
    ]
