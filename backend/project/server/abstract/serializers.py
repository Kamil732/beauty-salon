from rest_framework import serializers


class Subgroups(serializers.ModelSerializer):
    subgroups = serializers.SerializerMethodField('get_subgroups')

    def get_subgroups(self, obj):
        return self.__class__(self.Meta.model.objects.filter(parent=obj.id), many=True).data

    class Meta:
        exclude = ('parent',)
