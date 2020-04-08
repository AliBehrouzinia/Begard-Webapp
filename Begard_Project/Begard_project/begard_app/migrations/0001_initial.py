# Generated by Django 3.0.4 on 2020-04-01 19:31

from django.conf import settings
import django.contrib.postgres.fields
from django.db import migrations, models
import django.db.models.deletion
import django.utils.timezone


class Migration(migrations.Migration):

    initial = True

    dependencies = [
        ('auth', '0011_update_proxy_permissions'),
    ]

    operations = [
        migrations.CreateModel(
            name='BegardUser',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('password', models.CharField(max_length=128, verbose_name='password')),
                ('last_login', models.DateTimeField(blank=True, null=True, verbose_name='last login')),
                ('email', models.EmailField(max_length=254, unique=True, verbose_name='email address')),
                ('is_active', models.BooleanField(default=True)),
                ('date_joined', models.DateTimeField(default=django.utils.timezone.now)),
                ('groups', models.ManyToManyField(blank=True, help_text='The groups this user belongs to. A user will get all permissions granted to each of their groups.', related_name='user_set', related_query_name='user', to='auth.Group', verbose_name='groups')),
                ('user_permissions', models.ManyToManyField(blank=True, help_text='Specific permissions for this user.', related_name='user_set', related_query_name='user', to='auth.Permission', verbose_name='user permissions')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='City',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, null=True)),
            ],
        ),
        migrations.CreateModel(
            name='Plan',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('is_public', models.BooleanField(default=True)),
                ('like', models.IntegerField(default=0)),
                ('like_user', django.contrib.postgres.fields.ArrayField(base_field=models.CharField(blank=True, max_length=200), null=True, size=None)),
                ('creation_date', models.DateTimeField()),
                ('start_day', models.DateTimeField()),
                ('finish_day', models.DateTimeField()),
                ('destination_city', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='begard_app.City')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='TouristAttraction',
            fields=[
                ('place_id', models.CharField(default='none', max_length=500, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('rating', models.DecimalField(decimal_places=1, default=0.0, max_digits=2)),
                ('address', models.TextField(default='Nothing')),
                ('photo_ref', models.TextField(default='Nothing')),
                ('lng', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('lat', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('city', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='begard_app.City')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='ShoppingMall',
            fields=[
                ('place_id', models.CharField(default='none', max_length=500, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('rating', models.DecimalField(decimal_places=1, default=0.0, max_digits=2)),
                ('address', models.TextField(default='Nothing')),
                ('photo_ref', models.TextField(default='Nothing')),
                ('lng', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('lat', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('city', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='begard_app.City')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Restaurant',
            fields=[
                ('place_id', models.CharField(default='none', max_length=500, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('rating', models.DecimalField(decimal_places=1, default=0.0, max_digits=2)),
                ('address', models.TextField(default='Nothing')),
                ('photo_ref', models.TextField(default='Nothing')),
                ('lng', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('lat', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('city', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='begard_app.City')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='RecreationalPlace',
            fields=[
                ('place_id', models.CharField(default='none', max_length=500, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('rating', models.DecimalField(decimal_places=1, default=0.0, max_digits=2)),
                ('address', models.TextField(default='Nothing')),
                ('photo_ref', models.TextField(default='Nothing')),
                ('lng', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('lat', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('city', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='begard_app.City')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='PlanItem',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('place_id', models.CharField(max_length=300)),
                ('start_date', models.DateTimeField()),
                ('finish_date', models.DateTimeField()),
                ('plan', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='begard_app.Plan')),
            ],
        ),
        migrations.CreateModel(
            name='Museum',
            fields=[
                ('place_id', models.CharField(default='none', max_length=500, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('rating', models.DecimalField(decimal_places=1, default=0.0, max_digits=2)),
                ('address', models.TextField(default='Nothing')),
                ('photo_ref', models.TextField(default='Nothing')),
                ('lng', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('lat', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('city', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='begard_app.City')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Hotel',
            fields=[
                ('place_id', models.CharField(default='none', max_length=500, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('rating', models.DecimalField(decimal_places=1, default=0.0, max_digits=2)),
                ('address', models.TextField(default='Nothing')),
                ('photo_ref', models.TextField(default='Nothing')),
                ('lng', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('lat', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('city', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='begard_app.City')),
            ],
            options={
                'abstract': False,
            },
        ),
        migrations.CreateModel(
            name='Comment',
            fields=[
                ('id', models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('content', models.TextField()),
                ('plan', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='begard_app.Plan')),
                ('user', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to=settings.AUTH_USER_MODEL)),
            ],
        ),
        migrations.CreateModel(
            name='Cafe',
            fields=[
                ('place_id', models.CharField(default='none', max_length=500, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=100)),
                ('rating', models.DecimalField(decimal_places=1, default=0.0, max_digits=2)),
                ('address', models.TextField(default='Nothing')),
                ('photo_ref', models.TextField(default='Nothing')),
                ('lng', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('lat', models.DecimalField(decimal_places=9, max_digits=13, null=True)),
                ('city', models.ForeignKey(null=True, on_delete=django.db.models.deletion.CASCADE, to='begard_app.City')),
            ],
            options={
                'abstract': False,
            },
        ),
    ]
