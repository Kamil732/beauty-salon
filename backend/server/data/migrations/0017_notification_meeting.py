# Generated by Django 3.1.7 on 2021-05-19 18:40

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('meetings', '0013_meeting_confirmed'),
        ('data', '0016_auto_20210516_1338'),
    ]

    operations = [
        migrations.AddField(
            model_name='notification',
            name='meeting',
            field=models.ForeignKey(blank=True, null=True, on_delete=django.db.models.deletion.CASCADE, to='meetings.meeting'),
        ),
    ]