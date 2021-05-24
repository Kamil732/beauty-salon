from django.urls import path, include

from . import views

urlpatterns = [
    path('csrf_cookie/', views.GetCSRFToken.as_view(), name='set-csrf-cookie'),
    path('register/', views.RegisterAPIView.as_view(), name='register'),
    path('login/', views.LoginAPIView.as_view(), name='login'),
    path('logout/', views.LogoutAPIView.as_view(), name='logout'),
    path('current/', views.CurrentAccountAPIView.as_view(), name='current-account'),
    path('barbers/<slug:barber_slug>/', views.UpdateBarberAPIView.as_view(), name='update-barber'),
    path('gallery/', include([
        path('', views.CustomerImageListAPIView.as_view(), name='gallery-list'),
        path('<int:id>/', views.CustomerImageDetailAPIView.as_view(), name='gallery-detail'),
    ])),
    path('choice-list/', include([
        path('customers/', views.CustomerListAPIView.as_view(), name='customer-choice-list'),
        path('barbers/', views.BarberListAPIView.as_view(), name='barber-choice-list'),
    ])),
]
