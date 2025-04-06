from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import SupplierViewSet, dashboard_view

router = DefaultRouter()
router.register(r'suppliers', SupplierViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('dashboard/', dashboard_view, name='dashboard'),
] 