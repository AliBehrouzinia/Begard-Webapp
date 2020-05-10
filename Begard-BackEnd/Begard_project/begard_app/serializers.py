from rest_framework import serializers
from rest_framework.generics import get_object_or_404

from .models import *
from .models import BegardUser
from drf_extra_fields.fields import Base64ImageField
from rest_framework import serializers

from django.core.files.base import ContentFile
import base64
import six
import uuid
import imghdr


class SuggestSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class CitySerializer(serializers.ModelSerializer):
    class Meta:
        model = City
        fields = '__all__'


class RestaurantSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = '__all__'


class MuseumSerializer(serializers.ModelSerializer):
    class Meta:
        model = Museum
        fields = '__all__'


class HistoricalPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = TouristAttraction
        fields = '__all__'


class RecreationalPlaceSerializer(serializers.ModelSerializer):
    class Meta:
        model = RecreationalPlace
        fields = '__all__'


class CafeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cafe
        fields = '__all__'


class ShoppingMallSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShoppingMall
        fields = '__all__'


class TouristAttractionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TouristAttraction
        fields = '__all__'


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = BegardUser
        fields = 'email'


class CustomUserDetailsSerializer(serializers.ModelSerializer):
    class Meta:
        model = BegardUser
        fields = ('email',)
        read_only_fields = ('email',)


class PlanItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanItem
        fields = ['id', 'place_id', 'plan', 'start_date', 'finish_date']


class PlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'user', 'destination_city', 'description', 'creation_date', 'start_date', 'finish_date']


class UpdatePlanSerializer(serializers.ModelSerializer):
    class Meta:
        model = Plan
        fields = ['id', 'description', 'is_public', 'start_date', 'finish_date']


class PlanItemListSerializer(serializers.ListSerializer):
    def update(self, instance, validated_data):
        for i in range(len(instance)):
            self.validated_data[i]['plan'] = self.validated_data[i]['plan'].id
            serializer = PlanItemSerializer(instance[i], self.validated_data[i])
            if serializer.is_valid(raise_exception=True):
                serializer.save()

        return instance


class PatchPlanItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = PlanItem
        fields = '__all__'
        list_serializer_class = PlanItemListSerializer


class GlobalSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'

    def to_native(self, obj):
        if isinstance(obj, Restaurant):
            serializer = RestaurantSerializer(obj)
        elif isinstance(obj, Hotel):
            serializer = HotelSerializer(obj)
        elif isinstance(obj, Museum):
            serializer = MuseumSerializer(obj)
        elif isinstance(obj, Cafe):
            serializer = CafeSerializer(obj)
        elif isinstance(obj, ShoppingMall):
            serializer = ShoppingMallSerializer(obj)
        elif isinstance(obj, TouristAttraction):
            serializer = TouristAttractionSerializer(obj)
        elif isinstance(obj, RecreationalPlace):
            serializer = RecreationalPlaceSerializer(obj)
        else:
            raise Exception("Neither a model instance!")
        return serializer.data


class AdvancedSearchSerializer(serializers.ModelSerializer):
    class Meta:
        model = Restaurant
        fields = '__all__'


class SavePostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class ShowPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'


class CreateCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = '__all__'


class FollowingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserFollowing
        fields = '__all__'


class CreateLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Like
        fields = '__all__'


class FollowRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = FollowRequest
        fields = '__all__'


class TopPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        exclude = ['type', 'content', 'place_name', 'place_id']


class LocationPostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        exclude = ['plan_id']


class Base64ImageField(serializers.ImageField):

    def to_internal_value(self, data):
        if isinstance(data, six.string_types):
            if 'data:' in data and ';base64,' in data:
                header, data = data.split(';base64,')
            try:
                decoded_file = base64.b64decode(data)
            except TypeError:
                self.fail('invalid_image')
            file_name = str(uuid.uuid4())[:12]
            file_extension = self.get_file_extension(file_name, decoded_file)
            complete_file_name = "%s.%s" % (file_name, file_extension,)
            data = ContentFile(decoded_file, name=complete_file_name)
        return super(Base64ImageField, self).to_internal_value(data)

    def get_file_extension(self, file_name, decoded_file):

        extension = imghdr.what(file_name, decoded_file)
        extension = "jpg" if extension == "jpeg" else extension

        return extension


class ImageSerializer(serializers.ModelSerializer):
    image = Base64ImageField()

    class Meta:
        model = Image
        fields = ['image', 'post']

    def create(self, validated_data):
        image = validated_data.pop('image')
        data = validated_data.pop('post')
        return Image.objects.create(post=data, image=image)


class UserPlansSerializer(serializers.ModelSerializer):

    def to_representation(self, instance):
        result = super(UserPlansSerializer, self).to_representation(instance)
        post = get_object_or_404(Post, plan_id=result['id'], type='plan_post')
        image = get_object_or_404(Image, post=post)
        result['cover'] = image.image.url
        return result

    class Meta:
        model = Plan
        fields = ['id', 'destination_city', 'creation_date', 'user']
