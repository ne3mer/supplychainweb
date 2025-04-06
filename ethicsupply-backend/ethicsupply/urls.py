from django.contrib import admin
from django.urls import path, include
from api.views import MLStatusView
from django.http import JsonResponse, HttpResponse

# Simple health check endpoint
def health_check(request):
    return JsonResponse({
        "status": "ok",
        "message": "Backend service is running",
        "version": "1.0.0"
    })

# Root URL handler
def root_view(request):
    return HttpResponse("""
    <html>
        <head>
            <title>EthicSupply Backend API</title>
            <style>
                body { font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px; }
                h1 { color: #4f46e5; }
                .endpoint { background: #f3f4f6; padding: 8px; border-radius: 4px; margin-bottom: 4px; }
            </style>
        </head>
        <body>
            <h1>EthicSupply Backend API</h1>
            <p>The backend API is running successfully. Here are the available endpoints:</p>
            <div class="endpoint">/api/test/ - Test endpoint</div>
            <div class="endpoint">/api/simple-test/ - Simple test endpoint</div>
            <div class="endpoint">/api/ml/status/ - ML status endpoint</div>
            <div class="endpoint">/api/suppliers/ - Suppliers endpoint</div>
            <div class="endpoint">/health/ - Health check endpoint</div>
            <p>For more information, please refer to the documentation.</p>
        </body>
    </html>
    """, content_type="text/html")

urlpatterns = [
    path('', root_view, name='root'),
    path('health/', health_check, name='health_check'),
    path('admin/', admin.site.urls),
    path('api/', include('api.urls')),
    path('api/ml/status/', MLStatusView.as_view(), name='ml-status'),
] 