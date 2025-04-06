from django.db import models

class Supplier(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    industry = models.CharField(max_length=100, null=True, blank=True)
    co2_emissions = models.FloatField()
    delivery_efficiency = models.FloatField()
    wage_fairness = models.FloatField()
    human_rights_index = models.FloatField()
    waste_management_score = models.FloatField()
    community_engagement = models.FloatField(null=True, blank=True, default=0.5)
    energy_efficiency = models.FloatField(null=True, blank=True, default=0.5)
    water_usage = models.FloatField(null=True, blank=True, default=50)
    renewable_energy_percent = models.FloatField(null=True, blank=True, default=0)
    pollution_control = models.FloatField(null=True, blank=True, default=0.5)
    diversity_inclusion_score = models.FloatField(null=True, blank=True, default=0.5)
    worker_safety = models.FloatField(null=True, blank=True, default=0.5)
    transparency_score = models.FloatField(null=True, blank=True, default=0.5)
    corruption_risk = models.FloatField(null=True, blank=True, default=0.5)
    board_diversity = models.FloatField(null=True, blank=True, default=0.5)
    ethics_program = models.FloatField(null=True, blank=True, default=0.5)
    compliance_systems = models.FloatField(null=True, blank=True, default=0.5)
    quality_control_score = models.FloatField(null=True, blank=True, default=0.5)
    supplier_diversity = models.FloatField(null=True, blank=True, default=0.5)
    traceability = models.FloatField(null=True, blank=True, default=0.5)
    geopolitical_risk = models.FloatField(null=True, blank=True, default=0.5)
    climate_risk = models.FloatField(null=True, blank=True, default=0.5)
    labor_dispute_risk = models.FloatField(null=True, blank=True, default=0.5)
    ethical_score = models.FloatField(null=True, blank=True)
    environmental_score = models.FloatField(null=True, blank=True)
    social_score = models.FloatField(null=True, blank=True)
    governance_score = models.FloatField(null=True, blank=True)
    risk_level = models.CharField(max_length=20, null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-ethical_score']

    def __str__(self):
        return f"{self.name} ({self.country})"

class ScoringWeight(models.Model):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_default = models.BooleanField(default=False)
    created_by = models.CharField(max_length=100, default='system')
    
    # Main category weights
    environmental_weight = models.FloatField(default=0.33)
    social_weight = models.FloatField(default=0.33)
    governance_weight = models.FloatField(default=0.34)
    external_data_weight = models.FloatField(default=0.25)
    
    # Environmental subcategory weights
    co2_weight = models.FloatField(default=0.25)
    water_usage_weight = models.FloatField(default=0.25)
    energy_efficiency_weight = models.FloatField(default=0.25)
    waste_management_weight = models.FloatField(default=0.25)
    
    # Social subcategory weights
    wage_fairness_weight = models.FloatField(default=0.25)
    human_rights_weight = models.FloatField(default=0.25)
    diversity_inclusion_weight = models.FloatField(default=0.25)
    community_engagement_weight = models.FloatField(default=0.25)
    
    # Governance subcategory weights
    transparency_weight = models.FloatField(default=0.5)
    corruption_risk_weight = models.FloatField(default=0.5)
    
    # External data subcategory weights
    social_media_weight = models.FloatField(default=0.25)
    news_coverage_weight = models.FloatField(default=0.25)
    worker_reviews_weight = models.FloatField(default=0.25)
    controversy_weight = models.FloatField(default=0.25)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name

class MediaSentiment(models.Model):
    supplier = models.ForeignKey(Supplier, related_name="media_sentiments", on_delete=models.CASCADE)
    source = models.CharField(max_length=100)
    date = models.DateField()
    sentiment_score = models.FloatField()
    summary = models.TextField()
    
    class Meta:
        ordering = ['-date']
    
    def __str__(self):
        return f"{self.supplier.name} - {self.source} ({self.date})"

class SupplierESGReport(models.Model):
    supplier = models.ForeignKey(Supplier, related_name="esg_reports", on_delete=models.CASCADE)
    report_date = models.DateField()
    environmental_score = models.FloatField()
    social_score = models.FloatField()
    governance_score = models.FloatField()
    summary = models.TextField()
    
    class Meta:
        ordering = ['-report_date']
    
    def __str__(self):
        return f"{self.supplier.name} ESG Report ({self.report_date})"

class Controversy(models.Model):
    supplier = models.ForeignKey(Supplier, related_name="controversies", on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    date = models.DateField()
    severity = models.CharField(max_length=20, choices=[
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ])
    description = models.TextField()
    resolution_status = models.CharField(max_length=20, choices=[
        ('unresolved', 'Unresolved'),
        ('in_progress', 'In Progress'),
        ('resolved', 'Resolved'),
    ])
    
    class Meta:
        ordering = ['-date']
        verbose_name_plural = "Controversies"
    
    def __str__(self):
        return f"{self.supplier.name} - {self.title} ({self.date})" 