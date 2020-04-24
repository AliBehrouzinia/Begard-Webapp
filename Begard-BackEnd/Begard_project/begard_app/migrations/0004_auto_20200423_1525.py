# Generated by Django 3.0.4 on 2020-04-23 15:25

from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('begard_app', '0003_auto_20200422_2301'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='post',
            name='image',
        ),
        migrations.CreateModel(
            name='Image',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('image', models.ImageField(upload_to='images')),
                ('post', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='begard_app.Post')),
            ],
        ),
    ]
