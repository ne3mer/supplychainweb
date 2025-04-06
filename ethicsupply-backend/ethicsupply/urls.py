from django.contrib import admin
from django.urls import path, include
from django.http import JsonResponse

# Simple health check endpoint
def health_check(request):
    return JsonResponse({
        "status": "ok",
        "message": "Backend service is running",
        "version": "1.0.0"
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('health/', health_check, name='health_check'),
] 