# Generated by Django 4.1.5 on 2023-02-04 21:39

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('genone', '0003_savestate'),
    ]

    operations = [
        migrations.AlterField(
            model_name='savestate',
            name='data',
            field=models.JSONField(),
        ),
    ]
