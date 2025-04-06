from django.db import models
from django.core.validators import MinValueValidator, MaxValueValidator

class SupplierESGReport(models.Model):
    supplier = models.ForeignKey('Supplier', related_name='esg_reports', on_delete=models.CASCADE)
    report_date = models.DateField()
    report_url = models.URLField(blank=True, null=True)
    environmental_score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    social_score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    governance_score = models.FloatField(validators=[MinValueValidator(0), MaxValueValidator(100)])
    carbon_footprint = models.FloatField(blank=True, null=True, help_text="Annual carbon emissions in tons CO2e")
    water_usage = models.FloatField(blank=True, null=True, help_text="Annual water usage in cubic meters")
    renewable_energy_percentage = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    waste_recycled_percentage = models.FloatField(blank=True, null=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.supplier.name} ESG Report ({self.report_date})"

class MediaSentiment(models.Model):
    SENTIMENT_CHOICES = [
        ('positive', 'Positive'),
        ('neutral', 'Neutral'),
        ('negative', 'Negative'),
    ]
    
    SOURCE_CHOICES = [
        ('social_media', 'Social Media'),
        ('news', 'News'),
        ('review', 'Employee Review'),
    ]
    
    supplier = models.ForeignKey('Supplier', related_name='media_sentiments', on_delete=models.CASCADE)
    source_type = models.CharField(max_length=20, choices=SOURCE_CHOICES)
    source_name = models.CharField(max_length=100)
    source_url = models.URLField(blank=True, null=True)
    sentiment = models.CharField(max_length=10, choices=SENTIMENT_CHOICES)
    sentiment_score = models.FloatField(validators=[MinValueValidator(-1.0), MaxValueValidator(1.0)])
    content_snippet = models.TextField(blank=True, null=True)
    publication_date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.supplier.name} - {self.source_type} - {self.sentiment}"

class Controversy(models.Model):
    SEVERITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('critical', 'Critical'),
    ]
    
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('resolved', 'Resolved'),
        ('disputed', 'Disputed'),
    ]
    
    supplier = models.ForeignKey('Supplier', related_name='controversies', on_delete=models.CASCADE)
    title = models.CharField(max_length=200)
    description = models.TextField()
    severity = models.CharField(max_length=10, choices=SEVERITY_CHOICES)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES)
    date_occurred = models.DateField()
    date_resolved = models.DateField(blank=True, null=True)
    source_url = models.URLField(blank=True, null=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.supplier.name} - {self.title} ({self.severity})"
    
    class Meta:
        verbose_name_plural = "Controversies"

class Supplier(models.Model):
    name = models.CharField(max_length=200)
    country = models.CharField(max_length=100)
    industry = models.CharField(max_length=100, default='Manufacturing')
    description = models.TextField(blank=True, null=True)
    website = models.URLField(blank=True, null=True)
    
    # Environmental metrics
    co2_emissions = models.FloatField()
    water_usage = models.FloatField(default=0, help_text="Annual water usage in cubic meters")
    energy_efficiency = models.FloatField(default=0.5, validators=[MinValueValidator(0), MaxValueValidator(1)])
    waste_management_score = models.FloatField()
    
    # Social metrics
    wage_fairness = models.FloatField()
    human_rights_index = models.FloatField()
    diversity_inclusion_score = models.FloatField(default=0.5, validators=[MinValueValidator(0), MaxValueValidator(1)])
    community_engagement = models.FloatField(default=0.5, validators=[MinValueValidator(0), MaxValueValidator(1)])
    
    # Governance metrics
    transparency_score = models.FloatField(default=0.5, validators=[MinValueValidator(0), MaxValueValidator(1)])
    corruption_risk = models.FloatField(default=0.5, validators=[MinValueValidator(0), MaxValueValidator(1)])
    
    # Supply chain metrics
    delivery_efficiency = models.FloatField()
    quality_control_score = models.FloatField(default=0.5, validators=[MinValueValidator(0), MaxValueValidator(1)])
    
    # Aggregate scores (calculated by AI model)
    ethical_score = models.FloatField(null=True, blank=True)
    environmental_score = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    social_score = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    governance_score = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(100)])
    
    # Sentiment analysis scores (calculated by AI model)
    social_media_sentiment = models.FloatField(null=True, blank=True, validators=[MinValueValidator(-1.0), MaxValueValidator(1.0)])
    news_sentiment = models.FloatField(null=True, blank=True, validators=[MinValueValidator(-1.0), MaxValueValidator(1.0)])
    worker_satisfaction = models.FloatField(null=True, blank=True, validators=[MinValueValidator(0), MaxValueValidator(5.0)])
    
    # Risk assessment (calculated by AI model)
    risk_level = models.CharField(max_length=10, choices=[
        ('low', 'Low Risk'),
        ('medium', 'Medium Risk'),
        ('high', 'High Risk'),
        ('critical', 'Critical Risk'),
    ], default='medium')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-ethical_score']

    def __str__(self):
        return f"{self.name} ({self.country})"

class ScoringWeight(models.Model):
    """
    Allows customization of the ethical scoring algorithm weights
    """
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True, null=True)
    is_default = models.BooleanField(default=False)
    created_by = models.CharField(max_length=100, blank=True, null=True)
    
    # Environmental weights
    environmental_weight = models.FloatField(default=0.33, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    co2_weight = models.FloatField(default=0.4, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    water_usage_weight = models.FloatField(default=0.3, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    energy_efficiency_weight = models.FloatField(default=0.15, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    waste_management_weight = models.FloatField(default=0.15, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    
    # Social weights
    social_weight = models.FloatField(default=0.33, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    wage_fairness_weight = models.FloatField(default=0.25, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    human_rights_weight = models.FloatField(default=0.35, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    diversity_inclusion_weight = models.FloatField(default=0.2, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    community_engagement_weight = models.FloatField(default=0.2, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    
    # Governance weights
    governance_weight = models.FloatField(default=0.34, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    transparency_weight = models.FloatField(default=0.5, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    corruption_risk_weight = models.FloatField(default=0.5, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    
    # External data weights
    external_data_weight = models.FloatField(default=0.25, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    social_media_weight = models.FloatField(default=0.2, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    news_coverage_weight = models.FloatField(default=0.3, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    worker_reviews_weight = models.FloatField(default=0.3, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    controversy_weight = models.FloatField(default=0.2, validators=[MinValueValidator(0.0), MaxValueValidator(1.0)])
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return self.name
    
    def save(self, *args, **kwargs):
        # If this is set as default, unset others
        if self.is_default:
            ScoringWeight.objects.filter(is_default=True).update(is_default=False)
        super().save(*args, **kwargs) 