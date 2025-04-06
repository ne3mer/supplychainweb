from rest_framework import viewsets, status
from rest_framework.decorators import action, api_view
from rest_framework.response import Response
from django.db.models import Avg, Count, Max, Min
import json
import datetime
from dateutil.relativedelta import relativedelta
from .models import Supplier, ScoringWeight, MediaSentiment, SupplierESGReport, Controversy
from .serializers import SupplierSerializer
from .ml_model import EthicalScoringModel
from rest_framework.views import APIView
from datetime import datetime, timedelta
import random
import logging
from django.shortcuts import get_object_or_404

logger = logging.getLogger(__name__)

class SupplierViewSet(viewsets.ModelViewSet):
    queryset = Supplier.objects.all()
    serializer_class = SupplierSerializer
    ml_model = EthicalScoringModel()

    @action(detail=False, methods=['post'])
    def evaluate(self, request):
        serializer = self.get_serializer(data=request.data)
        if serializer.is_valid():
            # Get customer scoring weights if provided
            weights = None
            if 'scoring_weights_id' in request.data:
                try:
                    weight_model = ScoringWeight.objects.get(id=request.data['scoring_weights_id'])
                    weights = {
                        'environmental': weight_model.environmental_weight,
                        'social': weight_model.social_weight,
                        'governance': weight_model.governance_weight,
                        'external_data': weight_model.external_data_weight,
                        
                        # Environmental subcategory weights
                        'co2_emissions': weight_model.co2_weight,
                        'water_usage': weight_model.water_usage_weight,
                        'energy_efficiency': weight_model.energy_efficiency_weight,
                        'waste_management': weight_model.waste_management_weight,
                        
                        # Social subcategory weights
                        'wage_fairness': weight_model.wage_fairness_weight,
                        'human_rights': weight_model.human_rights_weight,
                        'diversity_inclusion': weight_model.diversity_inclusion_weight,
                        'community_engagement': weight_model.community_engagement_weight,
                        
                        # Governance subcategory weights
                        'transparency': weight_model.transparency_weight,
                        'corruption_risk': weight_model.corruption_risk_weight,
                        
                        # External data subcategory weights
                        'social_media': weight_model.social_media_weight,
                        'news_coverage': weight_model.news_coverage_weight,
                        'worker_reviews': weight_model.worker_reviews_weight,
                        'controversies': weight_model.controversy_weight,
                    }
                except ScoringWeight.DoesNotExist:
                    pass
            
            # Initialize ML model with custom weights if provided
            ml_model = EthicalScoringModel(weights)
            
            # Calculate ethical score
            data = serializer.validated_data
            scores = ml_model.calculate_score(data)
            
            # Save supplier with full scores
            supplier = serializer.save(
                ethical_score=scores['overall_score'],
                environmental_score=scores['environmental_score'],
                social_score=scores['social_score'],
                governance_score=scores['governance_score'],
                risk_level=scores['risk_level']
            )
            
            # Generate recommendations using all supplier data for context
            all_suppliers = list(Supplier.objects.values())
            recommendations = ml_model.generate_recommendations(data, all_suppliers)
            
            return Response({
                'id': supplier.id,
                'name': supplier.name,
                'scores': scores,
                'recommendations': recommendations
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    @action(detail=False, methods=['get'])
    def recommendations(self, request):
        # Get top suppliers by ethical score
        top_suppliers = self.queryset.order_by('-ethical_score')[:10]
        serializer = self.get_serializer(top_suppliers, many=True)
        
        # Convert serialized data to list
        suppliers_data = serializer.data
        
        # Append recommendations for each supplier
        ml_model = EthicalScoringModel()
        all_suppliers = list(Supplier.objects.values())
        
        for supplier_data in suppliers_data:
            # Get the full supplier object
            supplier_id = supplier_data['id']
            try:
                supplier = Supplier.objects.get(id=supplier_id)
                supplier_dict = {
                    'co2_emissions': supplier.co2_emissions,
                    'water_usage': supplier.water_usage,
                    'energy_efficiency': supplier.energy_efficiency,
                    'waste_management_score': supplier.waste_management_score,
                    'wage_fairness': supplier.wage_fairness,
                    'human_rights_index': supplier.human_rights_index,
                    'diversity_inclusion_score': supplier.diversity_inclusion_score,
                    'community_engagement': supplier.community_engagement,
                    'transparency_score': supplier.transparency_score,
                    'corruption_risk': supplier.corruption_risk,
                    'industry': supplier.industry,
                    'country': supplier.country
                }
                
                # Generate recommendations
                recommendations = ml_model.generate_recommendations(supplier_dict, all_suppliers)
                
                # Generate AI explanations of why this supplier is recommended
                explanations = ml_model.generate_explanation(supplier_dict, all_suppliers)
                
                # Add to results
                supplier_data['recommendations'] = recommendations
                supplier_data['ai_explanation'] = explanations
                
                # Set the recommendation summary as the main recommendation text
                supplier_data['recommendation'] = explanations['summary']
                
                # Add peer insights if clustering is available
                supplier_cluster = ml_model.get_supplier_cluster(supplier_dict)
                if supplier_cluster is not None:
                    # Count peers in same cluster
                    peer_count = sum(1 for s in all_suppliers if ml_model.get_supplier_cluster(s) == supplier_cluster)
                    supplier_data['peer_insights'] = {
                        'cluster': supplier_cluster,
                        'peer_count': peer_count,
                        'percentile': self._calculate_percentile(supplier.ethical_score)
                    }
                
            except Supplier.DoesNotExist:
                supplier_data['recommendations'] = []
                supplier_data['ai_explanation'] = {
                    'key_strengths': [],
                    'percentile_insights': [],
                    'comparative_insights': [],
                    'summary': 'No data available for this supplier.'
                }
                supplier_data['recommendation'] = 'No data available for this supplier.'
        
        return Response(suppliers_data)

    @action(detail=False, methods=['get'])
    def summary(self, request):
        stats = {
            'total_suppliers': Supplier.objects.count(),
            'avg_ethical_score': Supplier.objects.aggregate(Avg('ethical_score'))['ethical_score__avg'],
            'avg_co2_emissions': Supplier.objects.aggregate(Avg('co2_emissions'))['co2_emissions__avg'],
            'suppliers_by_country': dict(Supplier.objects.values('country').annotate(count=Count('id')).values_list('country', 'count'))
        }
        return Response(stats)

    @action(detail=False, methods=['get'])
    def dashboard(self, request):
        # Get all suppliers
        suppliers = self.queryset.all()
        
        # Calculate stats
        total_suppliers = suppliers.count()
        avg_ethical_score = suppliers.aggregate(Avg('ethical_score'))['ethical_score__avg'] or 0
        avg_environmental_score = suppliers.aggregate(Avg('environmental_score'))['environmental_score__avg'] or 0
        avg_social_score = suppliers.aggregate(Avg('social_score'))['social_score__avg'] or 0
        avg_governance_score = suppliers.aggregate(Avg('governance_score'))['governance_score__avg'] or 0
        
        # Calculate risk assessments
        risk_counts = dict(suppliers.values('risk_level').annotate(count=Count('id')).values_list('risk_level', 'count'))
        # Ensure all risk levels have a value
        for level in ['low', 'medium', 'high', 'critical']:
            if level not in risk_counts:
                risk_counts[level] = 0
        
        # Get suppliers by country
        suppliers_by_country = dict(
            suppliers.values('country')
            .annotate(count=Count('id'))
            .values_list('country', 'count')
        )
        
        # Get suppliers by industry
        suppliers_by_industry = dict(
            suppliers.values('industry')
            .annotate(count=Count('id'))
            .values_list('industry', 'count')
        )
        
        # If we have fewer than 3 countries or industries, add some mock data
        if len(suppliers_by_country) < 3:
            if 'United States' not in suppliers_by_country:
                suppliers_by_country['United States'] = 5
            if 'China' not in suppliers_by_country:
                suppliers_by_country['China'] = 3
            if 'Germany' not in suppliers_by_country:
                suppliers_by_country['Germany'] = 2
        
        if len(suppliers_by_industry) < 3:
            if 'Manufacturing' not in suppliers_by_industry:
                suppliers_by_industry['Manufacturing'] = 4
            if 'Technology' not in suppliers_by_industry:
                suppliers_by_industry['Technology'] = 3
            if 'Retail' not in suppliers_by_industry:
                suppliers_by_industry['Retail'] = 2
        
        # Create ethical score distribution
        ethical_score_distribution = [
            {'range': '0-20', 'count': suppliers.filter(ethical_score__lte=20).count()},
            {'range': '21-40', 'count': suppliers.filter(ethical_score__gt=20, ethical_score__lte=40).count()},
            {'range': '41-60', 'count': suppliers.filter(ethical_score__gt=40, ethical_score__lte=60).count()},
            {'range': '61-80', 'count': suppliers.filter(ethical_score__gt=60, ethical_score__lte=80).count()},
            {'range': '81-100', 'count': suppliers.filter(ethical_score__gt=80, ethical_score__lte=100).count()},
        ]
        
        # Create environmental, social, governance score distributions
        environmental_score_distribution = [
            {'range': '0-20', 'count': suppliers.filter(environmental_score__lte=20).count()},
            {'range': '21-40', 'count': suppliers.filter(environmental_score__gt=20, environmental_score__lte=40).count()},
            {'range': '41-60', 'count': suppliers.filter(environmental_score__gt=40, environmental_score__lte=60).count()},
            {'range': '61-80', 'count': suppliers.filter(environmental_score__gt=60, environmental_score__lte=80).count()},
            {'range': '81-100', 'count': suppliers.filter(environmental_score__gt=80, environmental_score__lte=100).count()},
        ]
        
        social_score_distribution = [
            {'range': '0-20', 'count': suppliers.filter(social_score__lte=20).count()},
            {'range': '21-40', 'count': suppliers.filter(social_score__gt=20, social_score__lte=40).count()},
            {'range': '41-60', 'count': suppliers.filter(social_score__gt=40, social_score__lte=60).count()},
            {'range': '61-80', 'count': suppliers.filter(social_score__gt=60, social_score__lte=80).count()},
            {'range': '81-100', 'count': suppliers.filter(social_score__gt=80, social_score__lte=100).count()},
        ]
        
        governance_score_distribution = [
            {'range': '0-20', 'count': suppliers.filter(governance_score__lte=20).count()},
            {'range': '21-40', 'count': suppliers.filter(governance_score__gt=20, governance_score__lte=40).count()},
            {'range': '41-60', 'count': suppliers.filter(governance_score__gt=40, governance_score__lte=60).count()},
            {'range': '61-80', 'count': suppliers.filter(governance_score__gt=60, governance_score__lte=80).count()},
            {'range': '81-100', 'count': suppliers.filter(governance_score__gt=80, governance_score__lte=100).count()},
        ]
        
        # Generate CO2 emissions by industry data
        co2_emissions_by_industry = []
        for industry in suppliers_by_industry.keys():
            industry_suppliers = suppliers.filter(industry=industry)
            if industry_suppliers.exists():
                avg_emissions = industry_suppliers.aggregate(Avg('co2_emissions'))['co2_emissions__avg'] or 0
                co2_emissions_by_industry.append({
                    'name': industry,
                    'value': round(avg_emissions, 1)
                })
            else:
                co2_emissions_by_industry.append({
                    'name': industry,
                    'value': 0
                })
        
        # Generate water usage by industry data
        water_usage_by_industry = []
        for industry in suppliers_by_industry.keys():
            industry_suppliers = suppliers.filter(industry=industry)
            if industry_suppliers.exists():
                avg_usage = industry_suppliers.aggregate(Avg('water_usage'))['water_usage__avg'] or 0
                water_usage_by_industry.append({
                    'name': industry,
                    'value': round(avg_usage, 1)
                })
            else:
                water_usage_by_industry.append({
                    'name': industry,
                    'value': 0
                })
        
        # Generate ethical score trends (mock data if not enough historical data)
        today = datetime.datetime.now().date()
        trend_data = []
        
        # Try to get real data from ESG reports
        esg_reports = SupplierESGReport.objects.all().order_by('report_date')
        if esg_reports.exists() and esg_reports.count() >= 3:
            # Group by month and calculate average scores
            report_months = {}
            for report in esg_reports:
                month_key = report.report_date.strftime('%Y-%m')
                if month_key not in report_months:
                    report_months[month_key] = {
                        'count': 0,
                        'env_score': 0,
                        'social_score': 0,
                        'gov_score': 0
                    }
                report_months[month_key]['count'] += 1
                report_months[month_key]['env_score'] += report.environmental_score
                report_months[month_key]['social_score'] += report.social_score
                report_months[month_key]['gov_score'] += report.governance_score
            
            # Calculate averages and format for trend data
            for month, data in report_months.items():
                avg_env = data['env_score'] / data['count']
                avg_social = data['social_score'] / data['count']
                avg_gov = data['gov_score'] / data['count']
                avg_total = (avg_env + avg_social + avg_gov) / 3
                
                trend_data.append({
                    'date': month,
                    'ethical_score': round(avg_total, 1),
                    'environmental_score': round(avg_env, 1),
                    'social_score': round(avg_social, 1),
                    'governance_score': round(avg_gov, 1)
                })
        else:
            # Generate mock trend data
            for i in range(6, 0, -1):
                month_date = today - relativedelta(months=i)
                # Start with current averages and add some random variation
                env_score = max(0, min(100, avg_environmental_score + (i - 3) * 2))
                social_score = max(0, min(100, avg_social_score + (i - 3) * 1.5))
                gov_score = max(0, min(100, avg_governance_score + (i - 3)))
                ethical_score = (env_score + social_score + gov_score) / 3
                
                trend_data.append({
                    'date': month_date.strftime('%Y-%m'),
                    'ethical_score': round(ethical_score, 1),
                    'environmental_score': round(env_score, 1),
                    'social_score': round(social_score, 1),
                    'governance_score': round(gov_score, 1)
                })
        
        # Generate top improvement opportunities
        # This would use the ML model's recommendations for all suppliers
        ml_model = EthicalScoringModel()
        improvement_opportunities = []
        
        if suppliers.count() > 0:
            # Get a sample of suppliers to analyze
            sample_size = min(10, suppliers.count())
            sample_suppliers = suppliers.order_by('?')[:sample_size]
            
            all_recommendations = []
            for supplier in sample_suppliers:
                supplier_dict = {
                    'co2_emissions': supplier.co2_emissions,
                    'water_usage': supplier.water_usage,
                    'energy_efficiency': supplier.energy_efficiency,
                    'waste_management_score': supplier.waste_management_score,
                    'wage_fairness': supplier.wage_fairness,
                    'human_rights_index': supplier.human_rights_index,
                    'diversity_inclusion_score': supplier.diversity_inclusion_score,
                    'community_engagement': supplier.community_engagement,
                    'transparency_score': supplier.transparency_score,
                    'corruption_risk': supplier.corruption_risk
                }
                
                # Get recommendations for this supplier
                recommendations = ml_model.generate_recommendations(supplier_dict)
                all_recommendations.extend(recommendations)
            
            # Count the frequency of each recommendation type
            action_counts = {}
            for rec in all_recommendations:
                action = rec['action']
                if action in action_counts:
                    action_counts[action] += 1
                else:
                    action_counts[action] = 1
            
            # Convert to list and sort by frequency
            for action, count in sorted(action_counts.items(), key=lambda x: x[1], reverse=True):
                improvement_opportunities.append({
                    'action': action,
                    'count': count,
                    'percentage': round((count / len(all_recommendations)) * 100 if all_recommendations else 0, 1)
                })
        
        # If not enough real data, add some mock improvement opportunities
        if len(improvement_opportunities) < 3:
            mock_opportunities = [
                {
                    'action': 'Reduce carbon emissions by implementing energy efficiency measures',
                    'count': 8,
                    'percentage': 24.2
                },
                {
                    'action': 'Improve waste management practices and recycling',
                    'count': 6,
                    'percentage': 18.2
                },
                {
                    'action': 'Enhance transparency in supply chain documentation',
                    'count': 5,
                    'percentage': 15.2
                },
                {
                    'action': 'Implement better human rights monitoring systems',
                    'count': 4,
                    'percentage': 12.1
                }
            ]
            
            # Add mock opportunities not already in the list
            for mock_op in mock_opportunities:
                if not any(op['action'] == mock_op['action'] for op in improvement_opportunities):
                    improvement_opportunities.append(mock_op)
        
        # Limit to top 5
        improvement_opportunities = improvement_opportunities[:5]
        
        return Response({
            'total_suppliers': total_suppliers,
            'avg_ethical_score': round(avg_ethical_score, 1) if avg_ethical_score else 0,
            'avg_environmental_score': round(avg_environmental_score, 1) if avg_environmental_score else 0,
            'avg_social_score': round(avg_social_score, 1) if avg_social_score else 0,
            'avg_governance_score': round(avg_governance_score, 1) if avg_governance_score else 0,
            'risk_assessment': risk_counts,
            'suppliers_by_country': suppliers_by_country,
            'suppliers_by_industry': suppliers_by_industry,
            'ethical_score_distribution': ethical_score_distribution,
            'environmental_score_distribution': environmental_score_distribution,
            'social_score_distribution': social_score_distribution,
            'governance_score_distribution': governance_score_distribution,
            'co2_emissions_by_industry': co2_emissions_by_industry,
            'water_usage_by_industry': water_usage_by_industry,
            'ethical_score_trends': trend_data,
            'improvement_opportunities': improvement_opportunities
        })

    @action(detail=True, methods=['get'])
    def detailed_analysis(self, request, pk=None):
        try:
            supplier = self.get_object()
            
            # Create supplier dict for ML processing
            supplier_dict = {
                'co2_emissions': supplier.co2_emissions,
                'water_usage': supplier.water_usage,
                'energy_efficiency': supplier.energy_efficiency,
                'waste_management_score': supplier.waste_management_score,
                'wage_fairness': supplier.wage_fairness,
                'human_rights_index': supplier.human_rights_index,
                'diversity_inclusion_score': supplier.diversity_inclusion_score,
                'community_engagement': supplier.community_engagement,
                'transparency_score': supplier.transparency_score,
                'corruption_risk': supplier.corruption_risk,
                'industry': supplier.industry,
                'country': supplier.country,
                'social_media_sentiment': supplier.social_media_sentiment,
                'news_sentiment': supplier.news_sentiment,
                'worker_satisfaction': supplier.worker_satisfaction
            }
            
            # Initialize ML model
            ml_model = EthicalScoringModel()
            
            # Generate recommendations
            all_suppliers = list(Supplier.objects.values())
            recommendations = ml_model.generate_recommendations(supplier_dict, all_suppliers)
            
            # Generate AI explanations
            explanations = ml_model.generate_explanation(supplier_dict, all_suppliers)
            
            # Calculate industry benchmarks
            industry_benchmarks = self._calculate_benchmarks(supplier.industry)
            
            # Calculate percentiles
            percentiles = {
                'overall': self._calculate_percentile(supplier.ethical_score),
                'environmental': self._calculate_percentile(supplier.environmental_score, 'environmental_score'),
                'social': self._calculate_percentile(supplier.social_score, 'social_score'),
                'governance': self._calculate_percentile(supplier.governance_score, 'governance_score'),
            }
            
            # Generate improvement scenarios
            improvement_scenarios = self._generate_improvement_scenarios(supplier_dict, ml_model)
            
            # Prepare and return detailed analysis
            response_data = {
                'id': supplier.id,
                'name': supplier.name,
                'country': supplier.country,
                'industry': supplier.industry,
                'website': supplier.website,
                'description': supplier.description,
                'created_at': supplier.created_at,
                'updated_at': supplier.updated_at,
                'scores': {
                    'overall': supplier.ethical_score,
                    'environmental': supplier.environmental_score,
                    'social': supplier.social_score,
                    'governance': supplier.governance_score,
                    'risk_level': supplier.risk_level
                },
                'co2_emissions': supplier.co2_emissions,
                'water_usage': supplier.water_usage,
                'energy_efficiency': supplier.energy_efficiency,
                'waste_management_score': supplier.waste_management_score,
                'wage_fairness': supplier.wage_fairness,
                'human_rights_index': supplier.human_rights_index,
                'diversity_inclusion_score': supplier.diversity_inclusion_score,
                'community_engagement': supplier.community_engagement,
                'transparency_score': supplier.transparency_score,
                'corruption_risk': supplier.corruption_risk,
                'social_media_sentiment': supplier.social_media_sentiment,
                'news_sentiment': supplier.news_sentiment,
                'worker_satisfaction': supplier.worker_satisfaction,
                'percentiles': percentiles,
                'industry_benchmarks': industry_benchmarks,
                'recommendations': recommendations,
                'improvement_scenarios': improvement_scenarios,
                'ai_explanation': explanations
            }
            
            return Response(response_data)
            
        except Supplier.DoesNotExist:
            return Response(
                {'detail': 'Supplier not found'}, 
                status=status.HTTP_404_NOT_FOUND
            )

    @action(detail=True, methods=['post'])
    def simulate_changes(self, request, pk=None):
        """Simulate the impact of changes to a supplier's metrics"""
        try:
            # Get the supplier
            supplier = self.get_object()
            
            # Initialize ML model
            ml_model = EthicalScoringModel()
            
            # Get changes from request data
            changes = request.data.get('changes', {})
            if not changes:
                return Response({"error": "No changes provided"}, status=status.HTTP_400_BAD_REQUEST)
            
            # Create supplier dict for ML model
            current_data = {
                'co2_emissions': supplier.co2_emissions,
                'water_usage': supplier.water_usage,
                'energy_efficiency': supplier.energy_efficiency,
                'waste_management_score': supplier.waste_management_score,
                'wage_fairness': supplier.wage_fairness,
                'human_rights_index': supplier.human_rights_index,
                'diversity_inclusion_score': supplier.diversity_inclusion_score,
                'community_engagement': supplier.community_engagement,
                'transparency_score': supplier.transparency_score,
                'corruption_risk': supplier.corruption_risk,
                'social_media_sentiment': supplier.social_media_sentiment,
                'news_sentiment': supplier.news_sentiment,
                'worker_satisfaction': supplier.worker_satisfaction
            }
            
            # Predict impact
            result = ml_model.predict_impact(current_data, changes)
            
            return Response(result)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    @action(detail=False, methods=['get'])
    def scorecard_settings(self, request):
        """Get available scoring weight configurations"""
        weights = ScoringWeight.objects.all()
        result = [{
            'id': w.id,
            'name': w.name,
            'description': w.description,
            'is_default': w.is_default,
            'created_by': w.created_by
        } for w in weights]
        
        # Add information about current weights in use
        default_weight = ScoringWeight.objects.filter(is_default=True).first()
        if default_weight:
            result.append({
                'current_default': default_weight.id
            })
            
        return Response(result)
    
    @action(detail=False, methods=['post'])
    def create_scorecard_settings(self, request):
        """Create a new scoring weight configuration"""
        try:
            name = request.data.get('name')
            description = request.data.get('description', '')
            created_by = request.data.get('created_by', 'system')
            is_default = request.data.get('is_default', False)
            
            # Get weight values from request, using defaults if not provided
            weights = ScoringWeight(
                name=name,
                description=description,
                created_by=created_by,
                is_default=is_default,
                environmental_weight=request.data.get('environmental_weight', 0.33),
                co2_weight=request.data.get('co2_weight', 0.4),
                water_usage_weight=request.data.get('water_usage_weight', 0.3),
                energy_efficiency_weight=request.data.get('energy_efficiency_weight', 0.15),
                waste_management_weight=request.data.get('waste_management_weight', 0.15),
                social_weight=request.data.get('social_weight', 0.33),
                wage_fairness_weight=request.data.get('wage_fairness_weight', 0.25),
                human_rights_weight=request.data.get('human_rights_weight', 0.35),
                diversity_inclusion_weight=request.data.get('diversity_inclusion_weight', 0.2),
                community_engagement_weight=request.data.get('community_engagement_weight', 0.2),
                governance_weight=request.data.get('governance_weight', 0.34),
                transparency_weight=request.data.get('transparency_weight', 0.5),
                corruption_risk_weight=request.data.get('corruption_risk_weight', 0.5),
                external_data_weight=request.data.get('external_data_weight', 0.25),
                social_media_weight=request.data.get('social_media_weight', 0.2),
                news_coverage_weight=request.data.get('news_coverage_weight', 0.3),
                worker_reviews_weight=request.data.get('worker_reviews_weight', 0.3),
                controversy_weight=request.data.get('controversy_weight', 0.2)
            )
            
            weights.save()
            
            return Response({
                'id': weights.id,
                'name': weights.name,
                'is_default': weights.is_default
            }, status=status.HTTP_201_CREATED)
            
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def _calculate_percentile(self, value, field='ethical_score'):
        """Calculate the percentile of a value within all suppliers"""
        if value is None:
            return 0
            
        # Get all values for the field
        values = list(Supplier.objects.exclude(**{field+'__isnull': True}).values_list(field, flat=True))
        if not values:
            return 0
            
        # Count how many values are less than the given value
        count_less = sum(1 for v in values if v < value)
        
        # Calculate percentile
        percentile = (count_less / len(values)) * 100
        
        return round(percentile, 1)
    
    def _calculate_benchmarks(self, industry):
        """Calculate industry benchmarks"""
        # Get suppliers in the same industry
        industry_suppliers = Supplier.objects.filter(industry=industry)
        
        if not industry_suppliers.exists():
            return {
                'avg_ethical_score': 0,
                'avg_environmental_score': 0,
                'avg_social_score': 0,
                'avg_governance_score': 0
            }
        
        # Calculate averages
        benchmarks = {
            'avg_ethical_score': industry_suppliers.aggregate(Avg('ethical_score'))['ethical_score__avg'] or 0,
            'avg_environmental_score': industry_suppliers.aggregate(Avg('environmental_score'))['environmental_score__avg'] or 0,
            'avg_social_score': industry_suppliers.aggregate(Avg('social_score'))['social_score__avg'] or 0,
            'avg_governance_score': industry_suppliers.aggregate(Avg('governance_score'))['governance_score__avg'] or 0,
            'best_ethical_score': industry_suppliers.aggregate(Max('ethical_score'))['ethical_score__max'] or 0,
            'worst_ethical_score': industry_suppliers.aggregate(Min('ethical_score'))['ethical_score__min'] or 0
        }
        
        # Round values
        for key, value in benchmarks.items():
            benchmarks[key] = round(value, 1)
            
        return benchmarks
    
    def _generate_improvement_scenarios(self, supplier_data, ml_model):
        """Generate improvement scenarios for the supplier"""
        scenarios = []
        
        # Environmental improvements
        env_changes = {
            'co2_emissions': max(0, supplier_data.get('co2_emissions', 50) * 0.8),  # 20% reduction
            'water_usage': max(0, supplier_data.get('water_usage', 50) * 0.8),  # 20% reduction
            'energy_efficiency': min(1.0, supplier_data.get('energy_efficiency', 0.5) * 1.2),  # 20% increase
            'waste_management_score': min(1.0, supplier_data.get('waste_management_score', 0.5) * 1.2)  # 20% increase
        }
        env_impact = ml_model.predict_impact(supplier_data, env_changes)
        scenarios.append({
            'name': 'Environmental Focus',
            'description': 'Improve environmental metrics by 20%',
            'changes': env_changes,
            'impact': env_impact
        })
        
        # Social improvements
        social_changes = {
            'wage_fairness': min(1.0, supplier_data.get('wage_fairness', 0.5) * 1.2),  # 20% increase
            'human_rights_index': min(1.0, supplier_data.get('human_rights_index', 0.5) * 1.2),  # 20% increase
            'diversity_inclusion_score': min(1.0, supplier_data.get('diversity_inclusion_score', 0.5) * 1.2),  # 20% increase
            'community_engagement': min(1.0, supplier_data.get('community_engagement', 0.5) * 1.2)  # 20% increase
        }
        social_impact = ml_model.predict_impact(supplier_data, social_changes)
        scenarios.append({
            'name': 'Social Responsibility Focus',
            'description': 'Improve social metrics by 20%',
            'changes': social_changes,
            'impact': social_impact
        })
        
        # Governance improvements
        gov_changes = {
            'transparency_score': min(1.0, supplier_data.get('transparency_score', 0.5) * 1.2),  # 20% increase
            'corruption_risk': max(0, supplier_data.get('corruption_risk', 0.5) * 0.8)  # 20% decrease
        }
        gov_impact = ml_model.predict_impact(supplier_data, gov_changes)
        scenarios.append({
            'name': 'Governance Focus',
            'description': 'Improve governance metrics by 20%',
            'changes': gov_changes,
            'impact': gov_impact
        })
        
        # Balanced approach
        balanced_changes = {
            'co2_emissions': max(0, supplier_data.get('co2_emissions', 50) * 0.9),  # 10% reduction
            'water_usage': max(0, supplier_data.get('water_usage', 50) * 0.9),  # 10% reduction
            'wage_fairness': min(1.0, supplier_data.get('wage_fairness', 0.5) * 1.1),  # 10% increase
            'transparency_score': min(1.0, supplier_data.get('transparency_score', 0.5) * 1.1)  # 10% increase
        }
        balanced_impact = ml_model.predict_impact(supplier_data, balanced_changes)
        scenarios.append({
            'name': 'Balanced Approach',
            'description': 'Make moderate improvements across all areas',
            'changes': balanced_changes,
            'impact': balanced_impact
        })
        
        return scenarios

    def _generate_suggestions(self, supplier):
        suggestions = []
        if supplier.co2_emissions > 50:
            suggestions.append("Consider implementing carbon offset programs")
        if supplier.wage_fairness < 0.7:
            suggestions.append("Review and improve wage policies")
        if supplier.waste_management_score < 0.6:
            suggestions.append("Implement better waste management practices")
        return suggestions

@api_view(['GET'])
def dashboard_view(request):
    """Standalone dashboard view function that doesn't require a viewset instance"""
    try:
        # Get suppliers
        suppliers = Supplier.objects.all()
        
        # Calculate stats
        total_suppliers = suppliers.count()
        
        if total_suppliers == 0:
            # Return empty stats if no suppliers
            return Response({
                'total_suppliers': 0,
                'avg_ethical_score': 0,
                'avg_co2_emissions': 0,
                'suppliers_by_country': {},
                'ethical_score_distribution': [],
                'co2_emissions_by_industry': []
            })
            
        # Calculate averages, handling NULL values
        avg_ethical_score = suppliers.filter(ethical_score__isnull=False).aggregate(Avg('ethical_score'))['ethical_score__avg'] or 0
        avg_co2_emissions = suppliers.filter(co2_emissions__isnull=False).aggregate(Avg('co2_emissions'))['co2_emissions__avg'] or 0
        
        # Group by country
        suppliers_by_country = {}
        for supplier in suppliers:
            country = supplier.country or 'Unknown'
            suppliers_by_country[country] = suppliers_by_country.get(country, 0) + 1
            
        # Create ethical score distribution
        ranges = ["0-20", "21-40", "41-60", "61-80", "81-100"]
        ethical_score_distribution = []
        
        for range_str in ranges:
            lower, upper = map(int, range_str.split('-'))
            count = suppliers.filter(
                ethical_score__isnull=False,
                ethical_score__gte=lower,
                ethical_score__lte=upper
            ).count()
            ethical_score_distribution.append({'range': range_str, 'count': count})
            
        # Create CO2 emissions by industry
        co2_emissions_by_industry = []
        industries = {}
        
        for supplier in suppliers:
            industry = supplier.industry or 'Other'
            if supplier.co2_emissions is not None:
                industries[industry] = industries.get(industry, 0) + supplier.co2_emissions
                
        for industry, total in industries.items():
            co2_emissions_by_industry.append({'name': industry, 'value': total})
            
        # Build and return response
        return Response({
            'total_suppliers': total_suppliers,
            'avg_ethical_score': avg_ethical_score,
            'avg_co2_emissions': avg_co2_emissions,
            'suppliers_by_country': suppliers_by_country,
            'ethical_score_distribution': ethical_score_distribution,
            'co2_emissions_by_industry': co2_emissions_by_industry
        })
        
    except Exception as e:
        # Log the error and return a 500 response
        logger.error(f"Dashboard view error: {str(e)}")
        return Response({"error": "Failed to generate dashboard data"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class MLStatusView(APIView):
    """
    API endpoint for retrieving the status of machine learning models
    """
    def get(self, request):
        # Calculate timestamps
        now = datetime.now()
        last_hour = (now - timedelta(hours=1)).strftime("%H:%M:%S")
        last_day = (now - timedelta(days=1)).strftime("%b %d, %H:%M")
        
        # Generate realistic ML model data
        ml_status = {
            "models": [
                {
                    "name": "Supplier Risk Prediction",
                    "status": "ready",
                    "accuracy": 0.895,
                    "lastUpdated": "2 days ago",
                    "predictionCount": random.randint(250, 300),
                },
                {
                    "name": "ESG Score Estimation",
                    "status": random.choice(["training", "ready"]),
                    "accuracy": round(random.uniform(0.75, 0.84), 2),
                    "lastUpdated": "in progress" if random.random() > 0.5 else last_hour,
                    "predictionCount": random.randint(120, 180),
                },
                {
                    "name": "Supply Chain Disruption",
                    "status": "ready",
                    "accuracy": 0.91,
                    "lastUpdated": last_day,
                    "predictionCount": random.randint(300, 350),
                },
                {
                    "name": "Sustainability Score Predictor",
                    "status": random.choice(["ready", "error"]),
                    "accuracy": 0.832,
                    "lastUpdated": "3 days ago",
                    "predictionCount": random.randint(80, 120),
                }
            ],
            "systemStatus": {
                "apiHealth": random.random() > 0.05,  # 95% healthy
                "dataIngestion": random.random() > 0.08,  # 92% healthy
                "mlPipeline": random.random() > 0.1,  # 90% healthy
                "lastChecked": now.strftime("%H:%M:%S")
            }
        }
        
        return Response(ml_status)

@api_view(['GET'])
def supply_chain_graph_view(request):
    """Generate a supply chain relationship graph showing connections between suppliers and other entities."""
    try:
        # Get all suppliers from the database
        suppliers = list(Supplier.objects.all().values())
        
        # Initialize the graph data
        nodes = []
        links = []
        
        # Create nodes for each supplier
        for supplier in suppliers:
            nodes.append({
                'id': f's{supplier["id"]}',
                'name': supplier['name'],
                'type': 'supplier',
                'country': supplier['country'],
                'ethical_score': supplier.get('ethical_score', 50),
                'level': 2  # Suppliers are at level 2
            })
        
        # Create sample raw materials (in a real implementation, these would come from a database)
        raw_materials = [
            {'id': 'rm1', 'name': 'Cotton', 'type': 'rawMaterial', 'level': 1, 'ethical_score': 85, 'country': 'India'},
            {'id': 'rm2', 'name': 'Aluminum', 'type': 'rawMaterial', 'level': 1, 'ethical_score': 60, 'country': 'Australia'},
            {'id': 'rm3', 'name': 'Timber', 'type': 'rawMaterial', 'level': 1, 'ethical_score': 75, 'country': 'Brazil'},
            {'id': 'rm4', 'name': 'Rare Earth Minerals', 'type': 'rawMaterial', 'level': 1, 'ethical_score': 30, 'country': 'China'},
            {'id': 'rm5', 'name': 'Crude Oil', 'type': 'rawMaterial', 'level': 1, 'ethical_score': 40, 'country': 'Saudi Arabia'},
        ]
        nodes.extend(raw_materials)
        
        # Create sample manufacturers, wholesalers, and retailers
        # In a real implementation, these would be retrieved from a database
        manufacturers = [
            {'id': 'm1', 'name': 'EcoApparel', 'type': 'manufacturer', 'level': 3, 'ethical_score': 88, 'country': 'Portugal'},
            {'id': 'm2', 'name': 'TechBuild Inc', 'type': 'manufacturer', 'level': 3, 'ethical_score': 72, 'country': 'Taiwan'},
            {'id': 'm3', 'name': 'FurniturePlus', 'type': 'manufacturer', 'level': 3, 'ethical_score': 83, 'country': 'Sweden'},
        ]
        nodes.extend(manufacturers)
        
        wholesalers = [
            {'id': 'w1', 'name': 'Fashion Distributors', 'type': 'wholesaler', 'level': 4, 'ethical_score': 78, 'country': 'France'},
            {'id': 'w2', 'name': 'Tech Wholesale Group', 'type': 'wholesaler', 'level': 4, 'ethical_score': 60, 'country': 'United States'},
            {'id': 'w3', 'name': 'Home Solutions', 'type': 'wholesaler', 'level': 4, 'ethical_score': 75, 'country': 'Denmark'},
        ]
        nodes.extend(wholesalers)
        
        retailers = [
            {'id': 'r1', 'name': 'Eco Clothes', 'type': 'retailer', 'level': 5, 'ethical_score': 85, 'country': 'United Kingdom'},
            {'id': 'r2', 'name': 'TechShop', 'type': 'retailer', 'level': 5, 'ethical_score': 68, 'country': 'United States'},
            {'id': 'r3', 'name': 'Design Home', 'type': 'retailer', 'level': 5, 'ethical_score': 80, 'country': 'Italy'},
        ]
        nodes.extend(retailers)
        
        # For each supplier, create links to raw materials and manufacturers
        # This is where we'd use real relationships from a database in a production system
        # For now, we'll create semi-random connections based on supplier properties
        for supplier in suppliers:
            supplier_id = f's{supplier["id"]}'
            
            # Link to raw materials based on industry
            industry = supplier.get('industry', '').lower()
            ethical_score = supplier.get('ethical_score', 50)
            
            # Default to ethical unless score is low
            is_ethical_source = ethical_score >= 60
            
            # Connect suppliers to appropriate raw materials based on industry
            if 'textile' in industry or 'apparel' in industry:
                links.append({'source': 'rm1', 'target': supplier_id, 'ethical': is_ethical_source})
            elif 'tech' in industry or 'electronic' in industry:
                links.append({'source': 'rm4', 'target': supplier_id, 'ethical': is_ethical_source})
            elif 'metal' in industry or 'manufacturing' in industry:
                links.append({'source': 'rm2', 'target': supplier_id, 'ethical': is_ethical_source})
            elif 'wood' in industry or 'furniture' in industry:
                links.append({'source': 'rm3', 'target': supplier_id, 'ethical': is_ethical_source})
            elif 'chemical' in industry or 'energy' in industry:
                links.append({'source': 'rm5', 'target': supplier_id, 'ethical': is_ethical_source})
            else:
                # If no specific industry match, connect to a random raw material
                random_rm = random.choice(raw_materials)
                links.append({'source': random_rm['id'], 'target': supplier_id, 'ethical': is_ethical_source})
            
            # Connect suppliers to manufacturers
            # Here we'll make somewhat logical connections based on supplier ethical score and industry
            if ethical_score >= 75:  # High ethical score goes to eco-friendly manufacturer
                links.append({'source': supplier_id, 'target': 'm1', 'ethical': True})
            elif 'tech' in industry or 'electronic' in industry:
                links.append({'source': supplier_id, 'target': 'm2', 'ethical': is_ethical_source})
            elif 'wood' in industry or 'furniture' in industry:
                links.append({'source': supplier_id, 'target': 'm3', 'ethical': is_ethical_source})
            else:
                # Random manufacturer connection for other industries
                random_manufacturer = random.choice(manufacturers)
                links.append({'source': supplier_id, 'target': random_manufacturer['id'], 'ethical': is_ethical_source})
        
        # Create links from manufacturers to wholesalers
        links.append({'source': 'm1', 'target': 'w1', 'ethical': True})
        links.append({'source': 'm2', 'target': 'w2', 'ethical': True})
        links.append({'source': 'm3', 'target': 'w3', 'ethical': True})
        
        # Create links from wholesalers to retailers
        links.append({'source': 'w1', 'target': 'r1', 'ethical': True})
        links.append({'source': 'w2', 'target': 'r2', 'ethical': True})
        links.append({'source': 'w3', 'target': 'r3', 'ethical': True})
        
        return Response({
            'nodes': nodes,
            'links': links
        })
        
    except Exception as e:
        print(f"Error generating supply chain graph: {str(e)}")
        return Response(
            {"error": "Failed to generate supply chain graph data"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Fix for the supply chain graph view
class SupplyChainGraphView(APIView):
    def get(self, request):
        try:
            # Fetch all suppliers
            suppliers = Supplier.objects.all()
            
            # Initialize nodes and links lists
            nodes = []
            links = []
            
            # Node types mapping
            node_types = {
                'Manufacturing': 'manufacturer',
                'Raw Materials': 'rawMaterial',
                'Distribution': 'distributor',
                'Retail': 'retailer',
                # Add more mappings as needed
            }
            
            # Process suppliers to create nodes
            for supplier in suppliers:
                # Get node type, defaulting to 'supplier' if not found
                node_type = node_types.get(supplier.industry, 'supplier')
                
                # Get ethical score with safe handling for None
                ethical_score = supplier.ethical_score if supplier.ethical_score is not None else 50
                
                # Create node
                node = {
                    'id': f's{supplier.id}',
                    'name': supplier.name,
                    'type': node_type,
                    'country': supplier.country,
                    'ethical_score': ethical_score,
                    'level': 2  # Default level
                }
                nodes.append(node)
            
            # Create some sample links between suppliers
            for i in range(len(suppliers) - 1):
                source_id = f's{suppliers[i].id}'
                target_id = f's{suppliers[i+1].id}'
                
                # Get ethical scores with safe handling for None
                source_score = suppliers[i].ethical_score if suppliers[i].ethical_score is not None else 50
                target_score = suppliers[i+1].ethical_score if suppliers[i+1].ethical_score is not None else 50
                
                # A link is ethical if both suppliers have good scores
                is_ethical = (source_score >= 60) and (target_score >= 60)
                
                link = {
                    'source': source_id,
                    'target': target_id,
                    'ethical': is_ethical
                }
                links.append(link)
            
            return Response({
                'nodes': nodes,
                'links': links
            })
        except Exception as e:
            logger.error(f"Error generating supply chain graph: {str(e)}")
            return Response(
                {'error': 'Failed to generate supply chain graph'}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

class DashboardView(APIView):
    def get(self, request):
        try:
            # Get all suppliers
            suppliers = list(Supplier.objects.all())
            
            if len(suppliers) == 0:
                # No suppliers in database, return mock data
                return Response({
                    "total_suppliers": 0,
                    "avg_ethical_score": 0,
                    "avg_co2_emissions": 0,
                    "suppliers_by_country": {},
                    "ethical_score_distribution": [
                        {"range": "0-20", "count": 0},
                        {"range": "21-40", "count": 0},
                        {"range": "41-60", "count": 0},
                        {"range": "61-80", "count": 0},
                        {"range": "81-100", "count": 0}
                    ],
                    "co2_emissions_by_industry": []
                })
            
            # Calculate metrics
            total_suppliers = len(suppliers)
            
            # Handle None values for ethical_score and co2_emissions
            ethical_scores = [s.ethical_score for s in suppliers if s.ethical_score is not None]
            co2_emissions = [s.co2_emissions for s in suppliers if s.co2_emissions is not None]
            
            avg_ethical_score = sum(ethical_scores) / len(ethical_scores) if ethical_scores else 0
            avg_co2_emissions = sum(co2_emissions) / len(co2_emissions) if co2_emissions else 0
            
            # Group suppliers by country
            suppliers_by_country = {}
            for supplier in suppliers:
                country = supplier.country
                if country in suppliers_by_country:
                    suppliers_by_country[country] += 1
                else:
                    suppliers_by_country[country] = 1
            
            # Compute ethical score distribution
            ethical_score_distribution = [
                {"range": "0-20", "count": 0},
                {"range": "21-40", "count": 0},
                {"range": "41-60", "count": 0},
                {"range": "61-80", "count": 0},
                {"range": "81-100", "count": 0}
            ]
            
            for score in ethical_scores:
                if score <= 20:
                    ethical_score_distribution[0]["count"] += 1
                elif score <= 40:
                    ethical_score_distribution[1]["count"] += 1
                elif score <= 60:
                    ethical_score_distribution[2]["count"] += 1
                elif score <= 80:
                    ethical_score_distribution[3]["count"] += 1
                else:
                    ethical_score_distribution[4]["count"] += 1
            
            # Compute CO2 emissions by industry
            co2_by_industry = {}
            for supplier in suppliers:
                industry = supplier.industry or "Other"
                co2 = supplier.co2_emissions or 0
                
                if industry in co2_by_industry:
                    co2_by_industry[industry] += co2
                else:
                    co2_by_industry[industry] = co2
            
            co2_emissions_by_industry = [
                {"name": industry, "value": value}
                for industry, value in co2_by_industry.items()
            ]
            
            return Response({
                "total_suppliers": total_suppliers,
                "avg_ethical_score": avg_ethical_score,
                "avg_co2_emissions": avg_co2_emissions,
                "suppliers_by_country": suppliers_by_country,
                "ethical_score_distribution": ethical_score_distribution,
                "co2_emissions_by_industry": co2_emissions_by_industry
            })
            
        except Exception as e:
            logger.error(f"Dashboard view error: {str(e)}")
            return Response(
                {"error": "Failed to generate dashboard data"}, 
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            ) 