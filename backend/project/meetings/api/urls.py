from django.urls import path, include

from . import views


urlpatterns = [
    path('', views.MeetingListAPIView.as_view(), name='meeting-list'),
    path('<int:meeting_id>/', views.MeetingDetailAPIView.as_view(), name='meeting-detail'),
]
