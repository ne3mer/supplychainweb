from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    co2_emissions = models.FloatField()
    delivery_efficiency = models.FloatField()
    wage_fairness = models.FloatField()
    human_rights_index = models.FloatField()
    waste_management_score = models.FloatField()
    ethical_score = models.FloatField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-ethical_score']

    def __str__(self):
        return f"{self.name} ({self.country})" 