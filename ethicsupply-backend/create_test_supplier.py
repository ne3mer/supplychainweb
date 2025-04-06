import django
import os
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'ethicsupply.settings')
django.setup()

from api.models import Supplier

# Check if the test supplier already exists
if not Supplier.objects.filter(name='Test Supplier').exists():
    supplier = Supplier(
        name='Test Supplier',
        country='United States',
        industry='Manufacturing',
        co2_emissions=25,
        water_usage=50,
        energy_efficiency=0.5,
        waste_management_score=0.8,
        wage_fairness=0.9,
        human_rights_index=0.95,
        delivery_efficiency=0.85
    )
    supplier.save()
    print('Test supplier created successfully!')
else:
    print('Test supplier already exists!') 