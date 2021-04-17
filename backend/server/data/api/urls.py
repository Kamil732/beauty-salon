from django.urls import path

from . import views

urlpatterns = [
    path('', views.DataListAPIView.as_view(), name='get-data-list'),
    path('update/<slug:data_name>/', views.UpdateDataAPIView.as_view(), name='update-data'),
]
