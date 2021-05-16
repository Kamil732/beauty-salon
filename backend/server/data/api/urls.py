from django.urls import path, include

from . import views

urlpatterns = [
    path('cms/', views.DataListAPIView.as_view(), name='data-list'),
    path('notifications/', include([
        path('', views.NotificationListAPIView.as_view(), name='notification-list'),
        path('unread-amount/', views.NotificationsUnreadAmountAPIView.as_view(), name='notification-unread-amount'),
    ])),
]
