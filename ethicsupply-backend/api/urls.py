from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.decorators import api_view
from rest_framework.response import Response
from .views import SupplierViewSet, SupplyChainGraphView, DashboardView

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)

# Simple test endpoint for debugging
@api_view(['GET'])
def test_endpoint(request):
    return Response({
        "status": "success",
        "message": "API is working correctly",
        "cors": "CORS headers are being applied correctly"
    })

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
    path('', include(router.urls)),
    path('dashboard/', DashboardView.as_view(), name='dashboard'),
    path('supply-chain-graph/', SupplyChainGraphView.as_view(), name='supply-chain-graph'),
    path('test/', test_endpoint, name='test-endpoint'),
] 