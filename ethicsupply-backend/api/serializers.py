from rest_framework import serializers
from .models import Supplier, ScoringWeight, MediaSentiment, SupplierESGReport, Controversy

class SupplierSerializer(serializers.ModelSerializer):
    class Meta:
        model = Supplier
        fields = '__all__'
        read_only_fields = ('ethical_score', 'environmental_score', 'social_score', 
                           'governance_score', 'social_media_sentiment', 'news_sentiment',
                           'worker_satisfaction', 'risk_level', 'created_at', 'updated_at')

class ScoringWeightSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoringWeight
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class MediaSentimentSerializer(serializers.ModelSerializer):
    class Meta:
        model = MediaSentiment
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class SupplierESGReportSerializer(serializers.ModelSerializer):
    class Meta:
        model = SupplierESGReport
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at')

class ControversySerializer(serializers.ModelSerializer):
    class Meta:
        model = Controversy
        fields = '__all__'
        read_only_fields = ('created_at', 'updated_at') 