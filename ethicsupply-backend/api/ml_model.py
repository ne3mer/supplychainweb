class EthicalScoringModel:
    def __init__(self):
        # No initialization needed for simplified model
        pass
    
    def calculate_score(self, data):
        """
        A simplified scoring model that doesn't require ML libraries.
        Calculates a weighted average of the supplier's metrics.
        """
        # Define weights for each feature
        weights = {
            'co2_emissions': 0.2,
            'delivery_efficiency': 0.15,
            'wage_fairness': 0.25,
            'human_rights_index': 0.25,
            'waste_management_score': 0.15
        }
        
        # Calculate weighted score
        # For co2_emissions, lower is better, so we invert the score
        co2_score = max(0, 100 - data['co2_emissions'])
        
        # Other metrics are on a 0-1 scale, so we multiply by 100
        total_score = (
            weights['co2_emissions'] * co2_score +
            weights['delivery_efficiency'] * data['delivery_efficiency'] * 100 +
            weights['wage_fairness'] * data['wage_fairness'] * 100 +
            weights['human_rights_index'] * data['human_rights_index'] * 100 +
            weights['waste_management_score'] * data['waste_management_score'] * 100
        )
        
        # Round to 2 decimal places
        return round(total_score, 2) 