from django.urls import path

from . import views

urlpatterns = [
    path('', views.DataListAPIView.as_view(), name='data-list'),
]
