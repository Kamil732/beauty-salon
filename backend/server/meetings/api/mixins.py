from server.permissions import IsAdminOrReadOnly
from . import serializers


class MeetingMixin(object):
    permission_classes = (IsAdminOrReadOnly,)

    def get_serializer_class(self):
        if self.request.user.is_authenticated and self.request.user.is_admin:
            return serializers.AdminMeetingSerializer
        return serializers.CustomerMeetingSerializer
