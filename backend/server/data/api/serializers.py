from django.db import models
from rest_framework import serializers

from server.abstract.serializers import Subgroups
from data.models import Data, Service, ServiceGroup, ServiceBarber, Notification, Resource, ResourceGroup, ServiceResources


class ResourceGroupSerializer(Subgroups):
    class Meta(Subgroups.Meta):
        model = ResourceGroup


class ResourceSerializer(serializers.ModelSerializer):
    class Meta:
        model = Resource
        fields = '__all__'


class ServiceResourcesSerializer(serializers.ModelSerializer):
    def to_representation(self, instance):
        data = super().to_representation(instance)

        return data['resources']

    class Meta:
        model = ServiceResources
        fields = ('resources',)


class ServiceBarberSerializer(serializers.ModelSerializer):
    display_time = serializers.SerializerMethodField('get_display_time')

    def get_display_time(self, obj):
        hours = obj.time // 60
        minutes = obj.time % 60

        if hours:
            return f'{hours}h {minutes}min'
        return f'{minutes} min'

    class Meta:
        model = ServiceBarber
        fields = ('display_time', 'time', 'service',)


class ServiceSerializer(serializers.ModelSerializer):
    display_time = serializers.SerializerMethodField('get_display_time')
    resources = ServiceResourcesSerializer(source='resources_data', many=True)

    def get_display_time(self, obj):
        hours = obj.time // 60
        minutes = obj.time % 60

        if hours:
            return f'{hours}h {minutes}min'
        return f'{minutes} min'

    class Meta:
        model = Service


class ServiceSerializerAdmin(ServiceSerializer):
    class Meta(ServiceSerializer.Meta):
        fields = '__all__'


class ServiceSerializerCustomer(ServiceSerializer):
    class Meta(ServiceSerializer.Meta):
        exclude = ('private_description', 'choosen_times',)


class ServiceGroupSerializer(Subgroups):
    services = serializers.PrimaryKeyRelatedField(many=True, read_only=True)

    class Meta(Subgroups.Meta):
        model = ServiceGroup


class DataSerializer(serializers.ModelSerializer):
    service_groups = serializers.SerializerMethodField('get_service_groups')
    services = serializers.SerializerMethodField('get_services')
    resource_groups = serializers.SerializerMethodField('get_resource_groups')
    resources = serializers.SerializerMethodField('get_resources')

    def get_services(self, obj):
        user = self.context.get('request').user
        serializer = ServiceSerializerAdmin if user.is_authenticated and user.is_admin else ServiceSerializerCustomer

        return serializer(Service.objects.all(), many=True).data

    def get_service_groups(self, obj):
        return ServiceGroupSerializer(ServiceGroup.objects.filter(parent=None), many=True).data

    def get_resources(self, obj):
        return ResourceSerializer(Resource.objects.all(), many=True).data

    def get_resource_groups(self, obj):
        return ResourceGroupSerializer(ResourceGroup.objects.filter(parent=None), many=True).data

    def to_internal_value(self, data):
        if 'start_work_sunday' in data and not(data['start_work_sunday']):
            data['start_work_sunday'] = None
        if 'end_work_sunday' in data and not(data['end_work_sunday']):
            data['end_work_sunday'] = None
        if 'end_work_saturday' in data and not(data['end_work_saturday']):
            data['end_work_saturday'] = None
        if 'start_work_saturday' in data and not(data['start_work_saturday']):
            data['start_work_saturday'] = None
        if 'end_work_friday' in data and not(data['end_work_friday']):
            data['end_work_friday'] = None
        if 'start_work_friday' in data and not(data['start_work_friday']):
            data['start_work_friday'] = None
        if 'end_work_thursday' in data and not(data['end_work_thursday']):
            data['end_work_thursday'] = None
        if 'start_work_thursday' in data and not(data['start_work_thursday']):
            data['start_work_thursday'] = None
        if 'end_work_wednesday' in data and not(data['end_work_wednesday']):
            data['end_work_wednesday'] = None
        if 'start_work_wednesday' in data and not(data['start_work_wednesday']):
            data['start_work_wednesday'] = None
        if 'end_work_tuesday' in data and not(data['end_work_tuesday']):
            data['end_work_tuesday'] = None
        if 'start_work_tuesday' in data and not(data['start_work_tuesday']):
            data['start_work_tuesday'] = None
        if 'end_work_monday' in data and not(data['end_work_monday']):
            data['end_work_monday'] = None
        if 'start_work_monday' in data and not(data['start_work_monday']):
            data['start_work_monday'] = None

        return super(DataSerializer, self).to_internal_value(data)

    class Meta:
        model = Data
        exclude = ('id',)
        extra_kwargs = {
            'end_work_sunday': {'allow_null': True},
            'start_work_sunday': {'allow_null': True},
            'end_work_saturday': {'allow_null': True},
            'start_work_saturday': {'allow_null': True},
            'end_work_friday': {'allow_null': True},
            'start_work_friday': {'allow_null': True},
            'end_work_thursday': {'allow_null': True},
            'start_work_thursday': {'allow_null': True},
            'end_work_wednesday': {'allow_null': True},
            'start_work_wednesday': {'allow_null': True},
            'end_work_tuesday': {'allow_null': True},
            'start_work_tuesday': {'allow_null': True},
            'end_work_monday': {'allow_null': True},
            'start_work_monday': {'allow_null': True},
        }


class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        exclude = ('recivers',)


class NotificationWriteSerializer(NotificationSerializer):
    class Meta(NotificationSerializer.Meta):
        exclude = ()
        fields = ('read',)
