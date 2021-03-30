from django.urls import path

from . import views

urlpatterns = [
    path('csrf_cookie/', views.GetCSRFToken.as_view()),
    path('register/', views.RegisterAPIView.as_view()),
    path('login/', views.LoginAPIView.as_view()),
    path('logout/', views.LogoutAPIView.as_view()),
    path('current/', views.CurrentAccountAPIView.as_view()),
]
