# Generated by Django 3.2.7 on 2021-12-27 18:49

from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='Game',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name_text', models.CharField(max_length=64)),
                ('image', models.CharField(max_length=128)),
                ('file_loc', models.CharField(max_length=128)),
            ],
        ),
    ]
