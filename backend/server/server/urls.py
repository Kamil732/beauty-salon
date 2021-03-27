from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include([
        path('accounts/', include('accounts.api.urls')),
        path('meetings/', include('meetings.api.urls')),
    ])),
]

urlpatterns += [re_path(r'^.*', TemplateView.as_view(template_name='index.html'))]
