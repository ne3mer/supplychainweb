import numpy as np
import pandas as pd
from sklearn.cluster import KMeans
from sklearn.preprocessing import StandardScaler
import datetime
import joblib
import os
import logging

logger = logging.getLogger(__name__)

class EthicalScoringModel:
    def __init__(self, scoring_weights=None):
        """
        Initialize the model with customizable scoring weights
        
        Args:
            scoring_weights: Optional dict containing custom weights for scoring algorithm
        """
        # Initialize default weights if none provided
        self.weights = scoring_weights or {
            # Main category weights
            'environmental': 0.33,
            'social': 0.33,
            'governance': 0.34,
            'external_data': 0.25,  # This is applied as a multiplier to the final score
            
            # Environmental subcategory weights
            'co2_emissions': 0.4,
            'water_usage': 0.3,
            'energy_efficiency': 0.15,
            'waste_management': 0.15,
            
            # Social subcategory weights
            'wage_fairness': 0.25,
            'human_rights': 0.35,
            'diversity_inclusion': 0.2,
            'community_engagement': 0.2,
            
            # Governance subcategory weights
            'transparency': 0.5,
            'corruption_risk': 0.5,
            
            # External data subcategory weights
            'social_media': 0.2,
            'news_coverage': 0.3,
            'worker_reviews': 0.3,
            'controversies': 0.2,
        }
        
        # Initialize other model components
        self.scaler = StandardScaler()
        self.clustering_model = None
        self.model_path = os.path.join(os.path.dirname(__file__), 'models', 'ethical_scoring_model.joblib')
        
        # Try to load existing model if it exists
        try:
            self._load_model()
        except (FileNotFoundError, ValueError, AttributeError) as e:
            logger.warning(f"Could not load existing model: {e}. Will initialize new model.")
    
    def _load_model(self):
        """Load model from disk if available"""
        if os.path.exists(self.model_path):
            loaded_data = joblib.load(self.model_path)
            self.clustering_model = loaded_data.get('clustering_model')
            self.scaler = loaded_data.get('scaler')
            self.weights = loaded_data.get('weights', self.weights)
            logger.info("Model loaded successfully")
    
    def _save_model(self):
        """Save model to disk"""
        os.makedirs(os.path.dirname(self.model_path), exist_ok=True)
        model_data = {
            'clustering_model': self.clustering_model,
            'scaler': self.scaler,
            'weights': self.weights
        }
        joblib.dump(model_data, self.model_path)
        logger.info("Model saved successfully")
    
    def calculate_environmental_score(self, data):
        """Calculate environmental sub-score"""
        # For co2_emissions, lower is better, so we invert the score
        co2_score = max(0, 100 - data.get('co2_emissions', 50))
        
        # Convert other metrics to 0-100 scale
        water_usage_score = max(0, 100 - data.get('water_usage', 50))
        energy_efficiency_score = data.get('energy_efficiency', 0.5) * 100
        waste_management_score = data.get('waste_management_score', 0.5) * 100
        
        # Calculate weighted environmental score
        return (
            self.weights['co2_emissions'] * co2_score +
            self.weights['water_usage'] * water_usage_score +
            self.weights['energy_efficiency'] * energy_efficiency_score +
            self.weights['waste_management'] * waste_management_score
        )
    
    def calculate_social_score(self, data):
        """Calculate social sub-score"""
        # Convert all metrics to 0-100 scale
        wage_fairness_score = data.get('wage_fairness', 0.5) * 100
        human_rights_score = data.get('human_rights_index', 0.5) * 100
        diversity_score = data.get('diversity_inclusion_score', 0.5) * 100
        community_score = data.get('community_engagement', 0.5) * 100
        
        # Calculate weighted social score
        return (
            self.weights['wage_fairness'] * wage_fairness_score +
            self.weights['human_rights'] * human_rights_score +
            self.weights['diversity_inclusion'] * diversity_score +
            self.weights['community_engagement'] * community_score
        )
    
    def calculate_governance_score(self, data):
        """Calculate governance sub-score"""
        # Convert all metrics to 0-100 scale
        transparency_score = data.get('transparency_score', 0.5) * 100
        # For corruption_risk, lower is better, so we invert the score
        corruption_score = (1 - data.get('corruption_risk', 0.5)) * 100
        
        # Calculate weighted governance score
        return (
            self.weights['transparency'] * transparency_score +
            self.weights['corruption_risk'] * corruption_score
        )
    
    def calculate_external_data_impact(self, supplier_data):
        """Calculate impact from external data sources"""
        # Default to 1.0 (no impact) if no external data
        impact_multiplier = 1.0
        
        # Get sentiment data
        social_media_sentiment = supplier_data.get('social_media_sentiment')
        news_sentiment = supplier_data.get('news_sentiment')
        worker_satisfaction = supplier_data.get('worker_satisfaction')
        
        # Get controversy data (count and severity)
        controversies = supplier_data.get('controversies', [])
        controversy_count = len(controversies)
        
        # Only calculate if we have enough data
        has_enough_data = (social_media_sentiment is not None or 
                          news_sentiment is not None or
                          worker_satisfaction is not None or
                          controversy_count > 0)
        
        if has_enough_data:
            # Convert sentiments to 0-1 scale (they range from -1 to 1)
            if social_media_sentiment is not None:
                social_media_impact = (social_media_sentiment + 1) / 2
            else:
                social_media_impact = 0.5
                
            if news_sentiment is not None:
                news_impact = (news_sentiment + 1) / 2
            else:
                news_impact = 0.5
                
            # Worker satisfaction is on 0-5 scale, convert to 0-1
            if worker_satisfaction is not None:
                worker_impact = worker_satisfaction / 5
            else:
                worker_impact = 0.5
                
            # Calculate controversy impact (0-1 scale, where 0 is bad)
            if controversy_count > 0:
                # More controversies and higher severity mean lower score
                max_controversies = 5  # Capping at 5 for calculation
                controversy_impact = max(0, 1 - (min(controversy_count, max_controversies) / max_controversies))
            else:
                controversy_impact = 1.0
                
            # Combine all external factors with their weights
            external_impact = (
                self.weights['social_media'] * social_media_impact +
                self.weights['news_coverage'] * news_impact +
                self.weights['worker_reviews'] * worker_impact +
                self.weights['controversies'] * controversy_impact
            )
            
            # Scale to get a multiplier around 1.0 (0.75 to 1.25)
            impact_multiplier = 0.75 + (external_impact * 0.5)
            
        return impact_multiplier
    
    def calculate_score(self, data):
        """
        Calculate the overall ethical score based on supplier data
        
        Args:
            data: Dict containing supplier metrics
            
        Returns:
            Dict with overall_score and sub-scores
        """
        try:
            # Calculate sub-scores
            environmental_score = self.calculate_environmental_score(data)
            social_score = self.calculate_social_score(data)
            governance_score = self.calculate_governance_score(data)
            
            # Calculate base score using main category weights
            base_score = (
                self.weights['environmental'] * environmental_score +
                self.weights['social'] * social_score +
                self.weights['governance'] * governance_score
            )
            
            # Apply external data impact if available
            external_impact = self.calculate_external_data_impact(data)
            final_score = base_score * external_impact
            
            # Determine risk level
            if final_score >= 80:
                risk_level = 'low'
            elif final_score >= 60:
                risk_level = 'medium'
            elif final_score >= 40:
                risk_level = 'high'
            else:
                risk_level = 'critical'
                
            # Round scores to 2 decimal places
            return {
                'overall_score': round(final_score, 2),
                'environmental_score': round(environmental_score, 2),
                'social_score': round(social_score, 2),
                'governance_score': round(governance_score, 2),
                'risk_level': risk_level
            }
            
        except Exception as e:
            logger.error(f"Error calculating score: {e}")
            # Return default scores if calculation fails
            return {
                'overall_score': 50.0,
                'environmental_score': 50.0,
                'social_score': 50.0,
                'governance_score': 50.0,
                'risk_level': 'medium'
            }
    
    def train_clustering(self, suppliers_data):
        """
        Train a clustering model to group similar suppliers
        
        Args:
            suppliers_data: List of supplier data dicts
        """
        if not suppliers_data or len(suppliers_data) < 5:
            logger.warning("Not enough suppliers to train clustering model")
            return False
            
        try:
            # Extract relevant features for clustering
            features = []
            for supplier in suppliers_data:
                # Select features for clustering
                feature_vector = [
                    supplier.get('co2_emissions', 50),
                    supplier.get('water_usage', 50),
                    supplier.get('energy_efficiency', 0.5),
                    supplier.get('waste_management_score', 0.5),
                    supplier.get('wage_fairness', 0.5),
                    supplier.get('human_rights_index', 0.5),
                    supplier.get('diversity_inclusion_score', 0.5),
                    supplier.get('transparency_score', 0.5),
                    supplier.get('corruption_risk', 0.5)
                ]
                features.append(feature_vector)
                
            # Convert to numpy array and normalize
            X = np.array(features)
            X_scaled = self.scaler.fit_transform(X)
            
            # Determine optimal number of clusters (2-6 based on dataset size)
            max_clusters = min(6, len(suppliers_data) // 2)
            n_clusters = max(2, min(max_clusters, len(suppliers_data) // 5))
            
            # Train K-means model
            self.clustering_model = KMeans(n_clusters=n_clusters, random_state=42)
            self.clustering_model.fit(X_scaled)
            
            # Save the trained model
            self._save_model()
            
            return True
            
        except Exception as e:
            logger.error(f"Error training clustering model: {e}")
            return False
    
    def get_supplier_cluster(self, supplier_data):
        """
        Get the cluster for a specific supplier
        
        Args:
            supplier_data: Dict with supplier metrics
            
        Returns:
            int: Cluster ID, or None if clustering model is not available
        """
        if self.clustering_model is None:
            return None
            
        try:
            # Extract features in the same order as training
            feature_vector = np.array([
                supplier_data.get('co2_emissions', 50),
                supplier_data.get('water_usage', 50),
                supplier_data.get('energy_efficiency', 0.5),
                supplier_data.get('waste_management_score', 0.5),
                supplier_data.get('wage_fairness', 0.5),
                supplier_data.get('human_rights_index', 0.5),
                supplier_data.get('diversity_inclusion_score', 0.5),
                supplier_data.get('transparency_score', 0.5),
                supplier_data.get('corruption_risk', 0.5)
            ]).reshape(1, -1)
            
            # Scale and predict
            X_scaled = self.scaler.transform(feature_vector)
            cluster = self.clustering_model.predict(X_scaled)[0]
            
            return int(cluster)
            
        except Exception as e:
            logger.error(f"Error predicting cluster: {e}")
            return None
    
    def generate_recommendations(self, supplier_data, all_suppliers_data=None):
        """
        Generate personalized recommendations for improving supplier's ethical score
        
        Args:
            supplier_data: Dict with current supplier metrics
            all_suppliers_data: Optional list of all suppliers for comparative analysis
            
        Returns:
            List of recommendation dictionaries with action, impact, and difficulty
        """
        recommendations = []
        
        # Calculate current score
        current_scores = self.calculate_score(supplier_data)
        
        # Identify weak areas
        weak_areas = []
        
        # Check environmental metrics
        env_score = current_scores['environmental_score']
        if env_score < 70:
            weak_areas.append({
                'category': 'environmental',
                'score': env_score,
                'metrics': []
            })
            
            if supplier_data.get('co2_emissions', 50) > 30:
                weak_areas[-1]['metrics'].append('co2_emissions')
            if supplier_data.get('water_usage', 50) > 30:
                weak_areas[-1]['metrics'].append('water_usage')
            if supplier_data.get('energy_efficiency', 0.5) < 0.6:
                weak_areas[-1]['metrics'].append('energy_efficiency')
            if supplier_data.get('waste_management_score', 0.5) < 0.6:
                weak_areas[-1]['metrics'].append('waste_management_score')
        
        # Check social metrics
        social_score = current_scores['social_score']
        if social_score < 70:
            weak_areas.append({
                'category': 'social',
                'score': social_score,
                'metrics': []
            })
            
            if supplier_data.get('wage_fairness', 0.5) < 0.6:
                weak_areas[-1]['metrics'].append('wage_fairness')
            if supplier_data.get('human_rights_index', 0.5) < 0.6:
                weak_areas[-1]['metrics'].append('human_rights_index')
            if supplier_data.get('diversity_inclusion_score', 0.5) < 0.6:
                weak_areas[-1]['metrics'].append('diversity_inclusion_score')
            if supplier_data.get('community_engagement', 0.5) < 0.6:
                weak_areas[-1]['metrics'].append('community_engagement')
        
        # Check governance metrics
        gov_score = current_scores['governance_score']
        if gov_score < 70:
            weak_areas.append({
                'category': 'governance',
                'score': gov_score,
                'metrics': []
            })
            
            if supplier_data.get('transparency_score', 0.5) < 0.6:
                weak_areas[-1]['metrics'].append('transparency_score')
            if supplier_data.get('corruption_risk', 0.5) > 0.4:
                weak_areas[-1]['metrics'].append('corruption_risk')
        
        # Filter out categories with no weak metrics
        weak_areas = [area for area in weak_areas if area['metrics']]
        
        # Generate recommendations based on weak areas
        for area in weak_areas:
            category = area['category']
            for metric in area['metrics']:
                recommendation = self._create_recommendation(category, metric, supplier_data)
                if recommendation:
                    recommendations.append(recommendation)
        
        # Add peer comparison recommendations if we have cluster data
        if all_suppliers_data and len(all_suppliers_data) >= 5:
            cluster_recommendations = self._generate_cluster_recommendations(
                supplier_data, all_suppliers_data
            )
            recommendations.extend(cluster_recommendations)
        
        # Sort recommendations by impact (highest first)
        recommendations.sort(key=lambda x: x['impact'], reverse=True)
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def _create_recommendation(self, category, metric, supplier_data):
        """Create a specific recommendation based on category and metric"""
        current_value = supplier_data.get(metric, 0)
        
        if category == 'environmental':
            if metric == 'co2_emissions':
                return {
                    'action': 'Reduce carbon emissions by implementing energy efficiency measures',
                    'impact': 'high',
                    'difficulty': 'medium',
                    'timeframe': 'long-term',
                    'details': f'Current emissions are at {current_value}. Aim to reduce by 15% over the next year.'
                }
            elif metric == 'water_usage':
                return {
                    'action': 'Implement water conservation and recycling systems',
                    'impact': 'medium',
                    'difficulty': 'medium',
                    'timeframe': 'medium-term',
                    'details': f'Current water usage is at {current_value}. Aim to reduce by 20% within 6 months.'
                }
            elif metric == 'energy_efficiency':
                return {
                    'action': 'Invest in renewable energy sources and efficiency upgrades',
                    'impact': 'high',
                    'difficulty': 'high',
                    'timeframe': 'long-term',
                    'details': f'Current efficiency score is {current_value*100:.1f}%. Target 25% improvement.'
                }
            elif metric == 'waste_management_score':
                return {
                    'action': 'Implement comprehensive recycling program and reduce waste generation',
                    'impact': 'medium',
                    'difficulty': 'low',
                    'timeframe': 'short-term',
                    'details': f'Current waste management score is {current_value*100:.1f}%. Quick improvements possible with better practices.'
                }
        
        elif category == 'social':
            if metric == 'wage_fairness':
                return {
                    'action': 'Conduct wage equity audit and adjust compensation policies',
                    'impact': 'high',
                    'difficulty': 'medium',
                    'timeframe': 'medium-term',
                    'details': f'Current wage fairness score is {current_value*100:.1f}%. Addressing disparities will improve score.'
                }
            elif metric == 'human_rights_index':
                return {
                    'action': 'Develop comprehensive human rights policy and audit supply chain',
                    'impact': 'high',
                    'difficulty': 'high',
                    'timeframe': 'long-term',
                    'details': f'Current human rights index is {current_value*100:.1f}%. Focus on supply chain transparency.'
                }
            elif metric == 'diversity_inclusion_score':
                return {
                    'action': 'Implement diversity and inclusion training and hiring practices',
                    'impact': 'medium',
                    'difficulty': 'medium',
                    'timeframe': 'medium-term',
                    'details': f'Current diversity score is {current_value*100:.1f}%. Set specific diversity targets.'
                }
            elif metric == 'community_engagement':
                return {
                    'action': 'Develop community outreach programs and local partnerships',
                    'impact': 'medium',
                    'difficulty': 'low',
                    'timeframe': 'short-term',
                    'details': f'Current community engagement score is {current_value*100:.1f}%. Quick wins possible here.'
                }
        
        elif category == 'governance':
            if metric == 'transparency_score':
                return {
                    'action': 'Publish detailed ESG reports and improve public disclosures',
                    'impact': 'high',
                    'difficulty': 'medium',
                    'timeframe': 'medium-term',
                    'details': f'Current transparency score is {current_value*100:.1f}%. Regular reporting will improve this.'
                }
            elif metric == 'corruption_risk':
                return {
                    'action': 'Implement anti-corruption policy and compliance training',
                    'impact': 'high',
                    'difficulty': 'medium',
                    'timeframe': 'medium-term',
                    'details': f'Current corruption risk is {current_value*100:.1f}%. Strong policies can mitigate this.'
                }
        
        return None
    
    def _generate_cluster_recommendations(self, supplier_data, all_suppliers_data):
        """Generate recommendations based on peer comparison within clusters"""
        recommendations = []
        
        # Get supplier's cluster
        supplier_cluster = self.get_supplier_cluster(supplier_data)
        if supplier_cluster is None:
            return recommendations
        
        # Find peers in the same cluster
        peers = []
        for supplier in all_suppliers_data:
            peer_cluster = self.get_supplier_cluster(supplier)
            if peer_cluster == supplier_cluster:
                peers.append(supplier)
        
        if len(peers) < 3:  # Need at least a few peers for comparison
            return recommendations
        
        # Calculate average metrics for the cluster
        avg_metrics = {}
        for metric in ['co2_emissions', 'water_usage', 'energy_efficiency', 'waste_management_score',
                      'wage_fairness', 'human_rights_index', 'diversity_inclusion_score',
                      'transparency_score', 'corruption_risk']:
            values = [peer.get(metric, 0) for peer in peers if metric in peer]
            if values:
                avg_metrics[metric] = sum(values) / len(values)
        
        # Find metrics where supplier is significantly below average
        for metric, avg_value in avg_metrics.items():
            supplier_value = supplier_data.get(metric, 0)
            
            # For metrics where lower is better (CO2, water usage, corruption risk)
            if metric in ['co2_emissions', 'water_usage', 'corruption_risk']:
                if supplier_value > avg_value * 1.2:  # 20% worse than average
                    recommendations.append({
                        'action': f'Improve {metric.replace("_", " ")} to match industry peers',
                        'impact': 'high',
                        'difficulty': 'medium',
                        'timeframe': 'medium-term',
                        'details': f'Your peers in the same industry average {avg_value:.1f} compared to your {supplier_value:.1f}.',
                        'peer_comparison': True
                    })
            # For metrics where higher is better
            else:
                if supplier_value < avg_value * 0.8:  # 20% worse than average
                    recommendations.append({
                        'action': f'Improve {metric.replace("_", " ")} to match industry peers',
                        'impact': 'high',
                        'difficulty': 'medium',
                        'timeframe': 'medium-term',
                        'details': f'Your peers in the same industry average {avg_value:.1f} compared to your {supplier_value:.1f}.',
                        'peer_comparison': True
                    })
        
        return recommendations
    
    def predict_impact(self, current_data, changes):
        """
        Predict the impact of proposed changes on the ethical score
        
        Args:
            current_data: Dict with current supplier metrics
            changes: Dict with proposed changes to metrics
            
        Returns:
            Dict with predicted scores and percentage changes
        """
        # Calculate current score
        current_scores = self.calculate_score(current_data)
        
        # Create a copy of current data and apply changes
        modified_data = current_data.copy()
        for metric, new_value in changes.items():
            modified_data[metric] = new_value
        
        # Calculate new score with changes
        new_scores = self.calculate_score(modified_data)
        
        # Calculate percentage improvements
        improvements = {}
        for key in ['overall_score', 'environmental_score', 'social_score', 'governance_score']:
            current = current_scores[key]
            new = new_scores[key]
            pct_change = ((new - current) / current) * 100 if current > 0 else 0
            improvements[key] = round(pct_change, 2)
        
        return {
            'current_scores': current_scores,
            'predicted_scores': new_scores,
            'improvements': improvements
        }
    
    def generate_explanation(self, supplier_data, all_suppliers=None):
        """
        Generate human-readable explanations for why a supplier was recommended
        using explainable AI (XAI) principles.
        
        Args:
            supplier_data: Dict with supplier metrics
            all_suppliers: Optional list of all suppliers for percentile calculations
            
        Returns:
            Dict containing key strengths, areas of excellence, and comparative insights
        """
        try:
            explanations = {
                "key_strengths": [],
                "percentile_insights": [],
                "comparative_insights": []
            }
            
            # Calculate current scores
            scores = self.calculate_score(supplier_data)
            
            # Identify top strengths (metrics with highest scores)
            strengths = []
            
            # Environmental metrics
            if supplier_data.get('co2_emissions', 50) < 20:
                strengths.append({
                    "category": "environmental", 
                    "metric": "co2_emissions", 
                    "value": supplier_data.get('co2_emissions', 50),
                    "score": 100 - supplier_data.get('co2_emissions', 50)
                })
            
            if supplier_data.get('water_usage', 50) < 20:
                strengths.append({
                    "category": "environmental", 
                    "metric": "water_usage", 
                    "value": supplier_data.get('water_usage', 50),
                    "score": 100 - supplier_data.get('water_usage', 50)
                })
                
            if supplier_data.get('energy_efficiency', 0.5) > 0.7:
                strengths.append({
                    "category": "environmental", 
                    "metric": "energy_efficiency", 
                    "value": supplier_data.get('energy_efficiency', 0.5),
                    "score": supplier_data.get('energy_efficiency', 0.5) * 100
                })
                
            if supplier_data.get('waste_management_score', 0.5) > 0.7:
                strengths.append({
                    "category": "environmental", 
                    "metric": "waste_management", 
                    "value": supplier_data.get('waste_management_score', 0.5),
                    "score": supplier_data.get('waste_management_score', 0.5) * 100
                })
            
            # Social metrics
            if supplier_data.get('wage_fairness', 0.5) > 0.7:
                strengths.append({
                    "category": "social", 
                    "metric": "wage_fairness", 
                    "value": supplier_data.get('wage_fairness', 0.5),
                    "score": supplier_data.get('wage_fairness', 0.5) * 100
                })
                
            if supplier_data.get('human_rights_index', 0.5) > 0.7:
                strengths.append({
                    "category": "social", 
                    "metric": "human_rights", 
                    "value": supplier_data.get('human_rights_index', 0.5),
                    "score": supplier_data.get('human_rights_index', 0.5) * 100
                })
                
            if supplier_data.get('diversity_inclusion_score', 0.5) > 0.7:
                strengths.append({
                    "category": "social", 
                    "metric": "diversity", 
                    "value": supplier_data.get('diversity_inclusion_score', 0.5),
                    "score": supplier_data.get('diversity_inclusion_score', 0.5) * 100
                })
                
            if supplier_data.get('community_engagement', 0.5) > 0.7:
                strengths.append({
                    "category": "social", 
                    "metric": "community", 
                    "value": supplier_data.get('community_engagement', 0.5),
                    "score": supplier_data.get('community_engagement', 0.5) * 100
                })
            
            # Governance metrics
            if supplier_data.get('transparency_score', 0.5) > 0.7:
                strengths.append({
                    "category": "governance", 
                    "metric": "transparency", 
                    "value": supplier_data.get('transparency_score', 0.5),
                    "score": supplier_data.get('transparency_score', 0.5) * 100
                })
                
            if supplier_data.get('corruption_risk', 0.5) < 0.3:
                strengths.append({
                    "category": "governance", 
                    "metric": "anti_corruption", 
                    "value": supplier_data.get('corruption_risk', 0.5),
                    "score": (1 - supplier_data.get('corruption_risk', 0.5)) * 100
                })
            
            # Sort strengths by score and take top 3
            strengths.sort(key=lambda x: x["score"], reverse=True)
            top_strengths = strengths[:3]
            
            # Generate human-readable explanations for top strengths
            for strength in top_strengths:
                if strength["category"] == "environmental":
                    if strength["metric"] == "co2_emissions":
                        explanations["key_strengths"].append(
                            f"Carbon emissions of {strength['value']:.1f} tons are exceptionally low, placing this supplier among top performers for climate impact."
                        )
                    elif strength["metric"] == "water_usage":
                        explanations["key_strengths"].append(
                            f"Water usage of {strength['value']:.1f} units demonstrates excellent water conservation practices."
                        )
                    elif strength["metric"] == "energy_efficiency":
                        explanations["key_strengths"].append(
                            f"Energy efficiency score of {strength['value']*100:.1f}% indicates strong investment in renewable energy and efficiency measures."
                        )
                    elif strength["metric"] == "waste_management":
                        explanations["key_strengths"].append(
                            f"Waste management score of {strength['value']*100:.1f}% shows excellent recycling and waste reduction programs."
                        )
                
                elif strength["category"] == "social":
                    if strength["metric"] == "wage_fairness":
                        explanations["key_strengths"].append(
                            f"Wage fairness score of {strength['value']*100:.1f}% indicates this supplier pays above regional wage standards."
                        )
                    elif strength["metric"] == "human_rights":
                        explanations["key_strengths"].append(
                            f"Human rights index of {strength['value']*100:.1f}% demonstrates excellent labor rights practices and successful third-party audits."
                        )
                    elif strength["metric"] == "diversity":
                        explanations["key_strengths"].append(
                            f"Diversity and inclusion score of {strength['value']*100:.1f}% shows commitment to workplace equality and representation."
                        )
                    elif strength["metric"] == "community":
                        explanations["key_strengths"].append(
                            f"Community engagement score of {strength['value']*100:.1f}% indicates strong investment in local communities."
                        )
                
                elif strength["category"] == "governance":
                    if strength["metric"] == "transparency":
                        explanations["key_strengths"].append(
                            f"Transparency score of {strength['value']*100:.1f}% reflects excellent reporting practices and disclosure policies."
                        )
                    elif strength["metric"] == "anti_corruption":
                        explanations["key_strengths"].append(
                            f"Low corruption risk of {strength['value']*100:.1f}% indicates robust anti-corruption policies and compliance."
                        )
            
            # Calculate percentiles if we have all suppliers data
            if all_suppliers and len(all_suppliers) > 0:
                # Get supplier's cluster
                supplier_cluster = self.get_supplier_cluster(supplier_data)
                
                # Find peers in the same cluster/industry
                if supplier_cluster is not None:
                    peers = []
                    for supplier in all_suppliers:
                        peer_cluster = self.get_supplier_cluster(supplier)
                        if peer_cluster == supplier_cluster:
                            peers.append(supplier)
                    
                    if len(peers) >= 3:
                        # Calculate percentiles for key metrics
                        metrics_to_check = ['co2_emissions', 'water_usage', 'energy_efficiency', 
                                           'waste_management_score', 'wage_fairness', 'human_rights_index',
                                           'diversity_inclusion_score', 'transparency_score']
                        
                        for metric in metrics_to_check:
                            if metric not in supplier_data:
                                continue
                                
                            values = [peer.get(metric, 0) for peer in peers if metric in peer]
                            if not values:
                                continue
                                
                            # For metrics where lower is better
                            if metric in ['co2_emissions', 'water_usage', 'corruption_risk']:
                                values.sort(reverse=True)  # High to low (because lower is better)
                                supplier_value = supplier_data.get(metric, 0)
                                position = next((i for i, x in enumerate(values) if x <= supplier_value), len(values))
                                percentile = ((len(values) - position) / len(values)) * 100
                            else:
                                values.sort()  # Low to high (because higher is better)
                                supplier_value = supplier_data.get(metric, 0)
                                position = next((i for i, x in enumerate(values) if x >= supplier_value), len(values))
                                percentile = (position / len(values)) * 100
                            
                            # Only add insights for high percentiles (top 25%)
                            if percentile >= 75:
                                if metric == 'co2_emissions':
                                    explanations["percentile_insights"].append(
                                        f"This supplier ranks in the top {100-percentile:.0f}% for carbon emissions reduction compared to industry peers."
                                    )
                                elif metric == 'water_usage':
                                    explanations["percentile_insights"].append(
                                        f"This supplier ranks in the top {100-percentile:.0f}% for water sustainability compared to industry peers."
                                    )
                                elif metric == 'wage_fairness':
                                    explanations["percentile_insights"].append(
                                        f"This supplier ranks in the top {percentile:.0f}% for fair wages, paying above the regional standards."
                                    )
                                elif metric == 'human_rights_index':
                                    explanations["percentile_insights"].append(
                                        f"This supplier ranks in the top {percentile:.0f}% for human rights protection and fair labor practices."
                                    )
                                elif metric == 'energy_efficiency':
                                    explanations["percentile_insights"].append(
                                        f"This supplier ranks in the top {percentile:.0f}% for energy efficiency within their industry."
                                    )
                                elif metric == 'diversity_inclusion_score':
                                    explanations["percentile_insights"].append(
                                        f"This supplier ranks in the top {percentile:.0f}% for diversity and inclusion practices."
                                    )
                                elif metric == 'transparency_score':
                                    explanations["percentile_insights"].append(
                                        f"This supplier ranks in the top {percentile:.0f}% for transparency and ethical reporting."
                                    )
            
            # Add comparative insights based on industry averages
            industry = supplier_data.get('industry')
            if industry and all_suppliers:
                industry_suppliers = [s for s in all_suppliers if s.get('industry') == industry]
                
                if len(industry_suppliers) >= 3:
                    # Calculate industry average for key metrics
                    industry_averages = {}
                    for metric in ['co2_emissions', 'water_usage', 'energy_efficiency', 'waste_management_score', 
                                  'wage_fairness', 'human_rights_index']:
                        values = [s.get(metric, 0) for s in industry_suppliers if metric in s]
                        if values:
                            industry_averages[metric] = sum(values) / len(values)
                    
                    # Add comparative insights for metrics significantly better than average
                    for metric, avg in industry_averages.items():
                        if metric not in supplier_data:
                            continue
                            
                        supplier_value = supplier_data.get(metric)
                        
                        # For metrics where lower is better
                        if metric in ['co2_emissions', 'water_usage']:
                            if supplier_value < avg * 0.7:  # At least 30% better than average
                                if metric == 'co2_emissions':
                                    explanations["comparative_insights"].append(
                                        f"CO₂ emissions are {((avg - supplier_value) / avg * 100):.0f}% lower than the industry average of {avg:.1f} tons."
                                    )
                                elif metric == 'water_usage':
                                    explanations["comparative_insights"].append(
                                        f"Water usage is {((avg - supplier_value) / avg * 100):.0f}% lower than the industry average."
                                    )
                        # For metrics where higher is better
                        else:
                            if supplier_value > avg * 1.3:  # At least 30% better than average
                                if metric == 'energy_efficiency':
                                    explanations["comparative_insights"].append(
                                        f"Energy efficiency is {((supplier_value - avg) / avg * 100):.0f}% higher than the industry average."
                                    )
                                elif metric == 'waste_management_score':
                                    explanations["comparative_insights"].append(
                                        f"Waste management practices are {((supplier_value - avg) / avg * 100):.0f}% better than the industry average."
                                    )
                                elif metric == 'wage_fairness':
                                    explanations["comparative_insights"].append(
                                        f"Wage fairness is {((supplier_value - avg) / avg * 100):.0f}% higher than the industry average, indicating exceptional compensation practices."
                                    )
                                elif metric == 'human_rights_index':
                                    explanations["comparative_insights"].append(
                                        f"Human rights practices are {((supplier_value - avg) / avg * 100):.0f}% better than the industry average."
                                    )
            
            # Limit the number of insights
            explanations["percentile_insights"] = explanations["percentile_insights"][:2]
            explanations["comparative_insights"] = explanations["comparative_insights"][:2]
            
            # Create a single summary explanation string that combines the top insights
            explanation_points = []
            if explanations["key_strengths"]:
                explanation_points.extend(explanations["key_strengths"][:2])
            if explanations["percentile_insights"]:
                explanation_points.append(explanations["percentile_insights"][0])
            if explanations["comparative_insights"]:
                explanation_points.append(explanations["comparative_insights"][0])
                
            explanations["summary"] = " ".join(explanation_points[:3])
            
            return explanations
            
        except Exception as e:
            logger.error(f"Error generating explanation: {e}")
            return {
                "key_strengths": ["This supplier demonstrates good ethical performance across multiple metrics."],
                "percentile_insights": [],
                "comparative_insights": [],
                "summary": "This supplier demonstrates good ethical performance across multiple metrics."
            } 