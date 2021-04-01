from django.urls import path, include
from rest_framework.routers import DefaultRouter

from . import views

router = DefaultRouter()
router.register('gallery', views.CustomerImageViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('csrf_cookie/', views.GetCSRFToken.as_view()),
    path('register/', views.RegisterAPIView.as_view()),
    path('login/', views.LoginAPIView.as_view()),
    path('logout/', views.LogoutAPIView.as_view()),
    path('current/', views.CurrentAccountAPIView.as_view()),
]
