from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.http import JsonResponse
from .views import (
    SupplierViewSet,
    SupplierListAPIView,
    SupplierDetailAPIView,
    DashboardAPIView,
    SupplyChainGraphAPIView,
    TestAPIView,
    SimpleTestAPIView,
)

# Set up router for ViewSets
router = DefaultRouter()
router.register(r'suppliers-viewset', SupplierViewSet, basename='suppliers-viewset')

# Simple test endpoint for debugging
@api_view(['GET', 'OPTIONS'])
def test_endpoint(request):
    if request.method == 'OPTIONS':
        return Response({})
        
    response_data = {
        "status": "success",
        "message": "API is working correctly",
        "cors": "CORS headers should be applied automatically",
        "request_headers": {k: v for k, v in request.headers.items()},
        "origin": request.headers.get('Origin', 'No origin header')
    }
    
    return Response(response_data)

# Fallback test endpoint that doesn't use DRF
def simple_test(request):
    response = JsonResponse({
        "status": "success",
        "message": "Simple test endpoint working",
        "method": request.method
    })
    
    # Manually add CORS headers
    response["Access-Control-Allow-Origin"] = "*"
    response["Access-Control-Allow-Methods"] = "GET, OPTIONS"
    response["Access-Control-Allow-Headers"] = "Content-Type, Authorization"
    
    return response

# The DefaultRouter will automatically create the URL patterns for:
# GET/POST /suppliers/
# GET/PUT/PATCH/DELETE /suppliers/{id}/
# 
# And our custom actions:
# POST /suppliers/evaluate/
# GET /suppliers/recommendations/
# GET /suppliers/summary/
# GET /suppliers/dashboard/
# GET /suppliers/{id}/detailed_analysis/
# POST /suppliers/{id}/simulate_changes/
# GET /suppliers/scorecard_settings/
# POST /suppliers/create_scorecard_settings/

urlpatterns = [
    # Include router URLs
    path('', include(router.urls)),
    
    # API view URLs
    path('suppliers/', SupplierListAPIView.as_view(), name='supplier-list'),
    path('suppliers/<int:pk>/', SupplierDetailAPIView.as_view(), name='supplier-detail'),
    path('dashboard/', DashboardAPIView.as_view(), name='dashboard'),
    path('supply-chain-graph/', SupplyChainGraphAPIView.as_view(), name='supply-chain-graph'),
    path('test/', TestAPIView.as_view(), name='test'),
    path('simple-test/', SimpleTestAPIView.as_view(), name='simple-test'),
] 