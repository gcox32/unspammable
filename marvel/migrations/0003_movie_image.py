# Generated by Django 3.2.7 on 2021-11-26 13:40

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('marvel', '0002_movie_url'),
    ]

    operations = [
        migrations.AddField(
            model_name='movie',
            name='image',
            field=models.CharField(blank=True, max_length=256, null=True),
        ),
    ]
