# Generated by Django 3.1.7 on 2021-05-06 18:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('data', '0011_data_work_time'),
    ]

    operations = [
        migrations.AddField(
            model_name='data',
            name='one_slot_max_meetings',
            field=models.PositiveIntegerField(default=0, editable=False),
        ),
    ]