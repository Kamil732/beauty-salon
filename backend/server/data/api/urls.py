from django.urls import path, include

from . import views

urlpatterns = [
    path('cms/', views.DataListAPIView.as_view(), name='data-list'),
    path('services/', include([
        path('', views.ServiceCreateAPIView.as_view(), name='create-service'),
        path('<int:service_id>/', views.ServiceDetailAPIView.as_view(), name='detail-service'),
    ])),
    path('notifications/', include([
        path('', views.NotificationListAPIView.as_view(), name='notification-list'),
        path('<int:notification_id>/', views.NotificationDetailAPIView.as_view(), name='notification-detail'),
        path('unread-amount/', views.NotificationsUnreadAmountAPIView.as_view(), name='notification-unread-amount'),
    ])),
]
