"""
Simplified ML model for EthicSupply without numpy/pandas/sklearn dependencies for Vercel deployment
"""
import datetime
import logging
import os

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
        
        logger.info("Simplified ML model initialized successfully")
    
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
        """Calculate impact from external data sources - simplified"""
        # Default to 1.0 (no impact) for simplicity
        return 1.0
    
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
            
            # Apply category weights
            weighted_score = (
                self.weights['environmental'] * environmental_score +
                self.weights['social'] * social_score +
                self.weights['governance'] * governance_score
            )
            
            # No external data impact for simplified model
            external_impact = 1.0
            
            # Apply external data impact
            overall_score = weighted_score * external_impact
            
            # Determine risk level based on overall score
            if overall_score >= 80:
                risk_level = 'low'
            elif overall_score >= 60:
                risk_level = 'medium'
            elif overall_score >= 40:
                risk_level = 'high'
            else:
                risk_level = 'critical'
            
            return {
                'overall_score': overall_score,
                'environmental_score': environmental_score,
                'social_score': social_score,
                'governance_score': governance_score,
                'risk_level': risk_level
            }
        
        except Exception as e:
            logger.error(f"Error calculating score: {e}")
            # Return default scores in case of error
            return {
                'overall_score': 50,
                'environmental_score': 50,
                'social_score': 50,
                'governance_score': 50,
                'risk_level': 'medium'
            }
    
    def get_supplier_cluster(self, supplier_data):
        """Simplified version that doesn't use clustering"""
        return 0
    
    def generate_recommendations(self, supplier_data, all_suppliers_data=None):
        """
        Generate recommendations for supplier improvement
        
        Args:
            supplier_data: Dict with supplier metrics
            all_suppliers_data: Optional list of all suppliers for comparison
            
        Returns:
            List of recommendation objects
        """
        # Simplified recommendations based on lowest scores
        recommendations = []
        
        # Get current scores
        scores = self.calculate_score(supplier_data)
        environmental_score = scores['environmental_score']
        social_score = scores['social_score']
        governance_score = scores['governance_score']
        
        # Identify weakest areas
        if environmental_score < 60:
            recommendations.append({
                'area': 'Environmental',
                'suggestion': 'Improve carbon emissions tracking and reduction',
                'impact': 'High',
                'difficulty': 'Medium'
            })
            recommendations.append({
                'area': 'Environmental',
                'suggestion': 'Implement waste reduction and recycling programs',
                'impact': 'Medium',
                'difficulty': 'Low'
            })
        
        if social_score < 60:
            recommendations.append({
                'area': 'Social',
                'suggestion': 'Enhance worker safety programs and monitoring',
                'impact': 'High',
                'difficulty': 'Medium'
            })
            recommendations.append({
                'area': 'Social',
                'suggestion': 'Develop comprehensive human rights policy and auditing',
                'impact': 'High',
                'difficulty': 'High'
            })
        
        if governance_score < 60:
            recommendations.append({
                'area': 'Governance',
                'suggestion': 'Improve transparency in business practices and reporting',
                'impact': 'Medium',
                'difficulty': 'Medium'
            })
            recommendations.append({
                'area': 'Governance',
                'suggestion': 'Strengthen anti-corruption measures and training',
                'impact': 'High',
                'difficulty': 'Medium'
            })
        
        # Add general recommendations if not enough specific ones
        if len(recommendations) < 3:
            recommendations.append({
                'area': 'General',
                'suggestion': 'Pursue sustainability certifications relevant to your industry',
                'impact': 'Medium',
                'difficulty': 'Medium'
            })
            recommendations.append({
                'area': 'General',
                'suggestion': 'Implement regular ESG performance monitoring and reporting',
                'impact': 'Medium',
                'difficulty': 'Low'
            })
        
        return recommendations[:5]  # Return top 5 recommendations
    
    def generate_explanation(self, supplier_data, all_suppliers_data=None):
        """
        Generate AI explanation of supplier ethical performance
        
        Args:
            supplier_data: Dict with supplier metrics
            all_suppliers_data: Optional list of all suppliers for comparison
            
        Returns:
            Dict with explanation components
        """
        scores = self.calculate_score(supplier_data)
        
        # Find highest and lowest scores
        score_values = [
            ('Environmental', scores['environmental_score']),
            ('Social', scores['social_score']),
            ('Governance', scores['governance_score'])
        ]
        
        score_values.sort(key=lambda x: x[1], reverse=True)
        strengths = [f"Strong performance in {score_values[0][0]} factors"]
        if score_values[0][1] - score_values[-1][1] > 20:
            weaknesses = [f"Needs improvement in {score_values[-1][0]} factors"]
        else:
            weaknesses = ["Relatively balanced performance across categories"]
        
        # Create a summary
        summary = f"This supplier demonstrates {scores['risk_level']} risk with an overall ethical score of {scores['overall_score']:.1f}."
        if score_values[0][1] > 75:
            summary += f" Particularly strong in {score_values[0][0]} metrics."
        if score_values[-1][1] < 50:
            summary += f" Improvement needed in {score_values[-1][0]} performance."
        
        return {
            'key_strengths': strengths,
            'key_weaknesses': weaknesses,
            'summary': summary
        } 