# Generated by Django 5.1 on 2024-08-16 14:03

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('inventory', '0009_alter_userprofile_role_alter_userprofile_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='productionrecord',
            name='quantityDamaged',
            field=models.PositiveIntegerField(null=True),
        ),
    ]
