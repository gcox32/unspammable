# Generated by Django 3.2.7 on 2022-01-23 17:46

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('fitness', '0011_auto_20220121_1453'),
    ]

    operations = [
        migrations.AlterModelOptions(
            name='fitnesslog',
            options={},
        ),
        migrations.AlterModelOptions(
            name='measurementlog',
            options={},
        ),
        migrations.AddField(
            model_name='exerciseentry',
            name='rpe',
            field=models.IntegerField(blank=True, db_column='RPE', null=True),
        ),
        migrations.AddField(
            model_name='workout',
            name='grade',
            field=models.CharField(blank=True, max_length=2, null=True),
        ),
        migrations.AddField(
            model_name='workout',
            name='name',
            field=models.CharField(blank=True, max_length=64, null=True),
        ),
    ]
