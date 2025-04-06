from django.contrib import admin
from django.urls import path, include
from api.views import MLStatusView

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/ml/status/', MLStatusView.as_view(), name='ml-status'),
] 