from django.urls import path

from . import views

urlpatterns = [
    path('', views.DataListAPIView.as_view(), name='get-data-list'),
]
