from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, dashboard_view, supply_chain_graph_view, health_check, supplier_list, evaluate_supplier
from rest_framework.decorators import api_view
from rest_framework.response import Response

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)

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

@api_view(['GET'])
def health_check(request):
    return Response({"status": "healthy"})

@api_view(['GET'])
def api_root(request):
    return Response({
        "suppliers": "https://optiethic-backend.onrender.com/api/suppliers/",
        "dashboard": "https://optiethic-backend.onrender.com/api/dashboard/",
        "supply_chain_graph": "https://optiethic-backend.onrender.com/api/supply-chain-graph/",
        "health_check": "https://optiethic-backend.onrender.com/api/health-check/",
        "ml_status": "https://optiethic-backend.onrender.com/api/ml/status/"
    })

urlpatterns = [
    path('', api_root, name='api-root'),
    path('', include(router.urls)),
    path('dashboard/', dashboard_view, name='dashboard'),
    path('supply-chain-graph/', supply_chain_graph_view, name='supply_chain_graph'),
    path('health/', health_check, name='health_check'),
    path('suppliers/', supplier_list, name='supplier_list'),
    path('suppliers/evaluate/', evaluate_supplier, name='evaluate_supplier'),
] 