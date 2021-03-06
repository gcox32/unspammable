# Generated by Django 3.2.7 on 2022-01-21 14:31

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('fitness', '0002_auto_20220116_1606'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='exercise',
            name='corr_abs',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_biceps',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_calves',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_chest',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_forearms',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_glutes',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_hamstrings',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_lats',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_lower_back',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_neck',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_obliques',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_quads',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_rhomboids',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_shoulders',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_traps',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='corr_triceps',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='goal_endurance',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='goal_power',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='goal_speed',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='goal_stamina',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='goal_strength',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='modality',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='movement_type',
        ),
        migrations.RemoveField(
            model_name='exercise',
            name='unilateral',
        ),
    ]
