# Generated by Django 3.0.4 on 2020-04-17 13:47

from django.conf import settings
from django.db import migrations, models
import django.db.models.deletion


class Migration(migrations.Migration):

    dependencies = [
        ('begard_app', '0003_auto_20200402_0217'),
    ]

    operations = [
        migrations.RemoveField(
            model_name='comment',
            name='plan',
        ),
        migrations.AlterField(
            model_name='comment',
            name='content',
            field=models.TextField(default='no content added', max_length=200),
        ),
        migrations.CreateModel(
            name='Post',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('creation_date', models.DateTimeField()),
                ('content', models.TextField(default='no content added', max_length=100)),
                ('like', models.IntegerField(default=0)),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='begard_app.Plan')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.AddField(
            model_name='comment',
            name='post',
            field=models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='begard_app.Post'),
        ),
    ]
