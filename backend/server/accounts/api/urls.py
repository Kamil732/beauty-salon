from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('gallery', views.CustomerImageViewSet, basename='gallery')

urlpatterns = [
    path('', include(router.urls)),
    path('csrf_cookie/', views.GetCSRFToken.as_view(), name='set-csrf-cookie'),
    path('register/', views.RegisterAPIView.as_view(), name='register'),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('current/', views.CurrentAccountAPIView.as_view(), name='current-account'),
    path('<slug:account_slug>/', views.UpdateAccountAPIView.as_view(), name='update-account'),
    path('choice-list/', include([
        path('customers/', views.CustomerListAPIView.as_view(), name='customer-choice-list'),
        path('barbers/', views.BarberListAPIView.as_view(), name='barber-choice-list'),
    ])),
]
