# Generated by Django 3.2.7 on 2021-12-08 18:01

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('marvel', '0009_movie_description'),
    ]

    operations = [
        migrations.AddField(
            model_name='series',
            name='description',
            field=models.CharField(blank=True, max_length=1024, null=True),
        ),
    ]
