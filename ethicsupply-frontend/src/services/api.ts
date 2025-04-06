import axios from "axios";

// Define the API URL in one place for easy updates
// Using a dynamic approach to determine API URL based on environment
const API_BASE_URL =
  import.meta.env.VITE_API_URL ||
  (window.location.hostname === "localhost"
    ? "http://localhost:8000/api"
    : "https://ethicsupply-backend.onrender.com/api"); // Update with your actual backend URL

export interface Supplier {
  id: number;
  name: string;
  country: string;
  industry?: string;
  co2_emissions: number;
  delivery_efficiency: number;
  wage_fairness: number;
  human_rights_index: number;
  waste_management_score: number;
  ethical_score: number | null;

  // Additional fields for enhanced data
  environmental_score?: number;
  social_score?: number;
  governance_score?: number;
  risk_level?: string;

  created_at: string;
  updated_at: string;
  isMockData?: boolean;
}

export interface SupplierEvaluation {
  // Basic Information
  name: string;
  country: string;
  industry: string;

  // Environmental Metrics
  co2_emissions: number; // Carbon emissions in tons
  water_usage: number; // Water usage in cubic meters
  energy_efficiency: number; // Energy efficiency score (0-1)
  waste_management_score: number; // Waste management score (0-1)
  renewable_energy_percent: number; // Percentage of renewable energy used
  pollution_control: number; // Pollution control measures score (0-1)

  // Social Metrics
  wage_fairness: number; // Wage fairness score (0-1)
  human_rights_index: number; // Human rights compliance score (0-1)
  diversity_inclusion_score: number; // Diversity and inclusion score (0-1)
  community_engagement: number; // Community engagement score (0-1)
  worker_safety: number; // Worker safety score (0-1)

  // Governance Metrics
  transparency_score: number; // Transparency score (0-1)
  corruption_risk: number; // Corruption risk score (0-1)
  board_diversity: number; // Board diversity score (0-1)
  ethics_program: number; // Ethics program strength score (0-1)
  compliance_systems: number; // Compliance systems score (0-1)

  // Supply Chain Metrics
  delivery_efficiency: number; // Delivery efficiency score (0-1)
  quality_control_score: number; // Quality control score (0-1)
  supplier_diversity: number; // Supplier diversity score (0-1)
  traceability: number; // Supply chain traceability score (0-1)

  // Risk Factors
  geopolitical_risk: number; // Geopolitical risk exposure (0-1)
  climate_risk: number; // Climate risk exposure (0-1)
  labor_dispute_risk: number; // Labor dispute risk (0-1)
}

export interface EvaluationResult {
  id: number;
  name: string;

  // Overall Scores
  ethical_score: number; // Overall ethical score
  environmental_score: number; // Environmental category score
  social_score: number; // Social category score
  governance_score: number; // Governance category score
  supply_chain_score: number; // Supply chain category score
  risk_score: number; // Risk assessment score

  // Detailed Assessment
  assessment: {
    strengths: string[]; // Key strengths identified
    weaknesses: string[]; // Areas needing improvement
    opportunities: string[]; // Opportunities for enhancement
    threats: string[]; // Potential threats or risks
  };

  // Recommendations
  recommendation: string; // Overall recommendation
  suggestions: string[]; // Specific improvement suggestions

  // Risk Assessment
  risk_factors: {
    factor: string; // Risk factor name
    severity: string; // Severity level (Low, Medium, High)
    probability: string; // Probability level (Low, Medium, High)
    mitigation: string; // Suggested mitigation strategy
  }[];

  // Compliance Status
  compliance: {
    status: string; // Overall compliance status
    standards_met: string[]; // Standards the supplier meets
    certifications: string[]; // Current certifications
    gaps: string[]; // Compliance gaps identified
  };

  // Comparison Data
  industry_comparison: {
    percentile: number; // Percentile ranking in industry
    average_score: number; // Industry average score
    top_performer_score: number; // Top performer score in industry
  };

  isMockData?: boolean; // Flag for mock data
}

export interface DashboardData {
  total_suppliers: number;
  avg_ethical_score: number;
  avg_co2_emissions: number;
  suppliers_by_country: Record<string, number>;
  ethical_score_distribution: Array<{ range: string; count: number }>;
  co2_emissions_by_industry: Array<{ name: string; value: number }>;
  isMockData?: boolean;
}

export interface Recommendation {
  action: string;
  impact: string;
  difficulty: string;
  timeframe: string;
  details: string;
}

export interface ImprovementScenario {
  name: string;
  description: string;
  changes: Record<string, number>;
  impact: {
    current_scores: any;
    predicted_scores: any;
    improvements: Record<string, number>;
  };
}

export interface DetailedAnalysis {
  id: number;
  name: string;
  country: string;
  industry: string;
  scores: {
    overall: number;
    environmental: number;
    social: number;
    governance: number;
    risk_level: string;
  };
  industry_benchmarks: {
    avg_ethical_score: number;
    avg_environmental_score: number;
    avg_social_score: number;
    avg_governance_score: number;
    best_ethical_score: number;
    worst_ethical_score: number;
  };
  percentiles: {
    overall: number;
    environmental: number;
    social: number;
    governance: number;
  };
  recommendations: Recommendation[];
  improvement_scenarios: ImprovementScenario[];
  isMockData?: boolean;
}

export interface SupplierAnalytics {
  supplier: {
    id: number;
    name: string;
    country: string;
    industry: string;
    ethical_score: number;
    environmental_score: number;
    social_score: number;
    governance_score: number;
    overall_score: number;
    risk_level: string;
    co2_emissions: number;
    water_usage: number;
    energy_efficiency: number;
    waste_management_score: number;
    wage_fairness: number;
    human_rights_index: number;
    diversity_inclusion_score: number;
    community_engagement: number;
    transparency_score: number;
    corruption_risk: number;
    delivery_efficiency: number;
    quality_control_score: number;
    esg_reports?: {
      year: number;
      environmental: number;
      social: number;
      governance: number;
    }[];
    media_sentiment?: {
      source: string;
      date: string;
      score: number;
      headline: string;
    }[];
    controversies?: {
      issue: string;
      date: string;
      severity: string;
      status: string;
    }[];
  };
  industry_average: {
    [key: string]: number;
  };
  similar_suppliers: Supplier[];
  recommendations: {
    area: string;
    suggestion: string;
    impact: string;
    difficulty: string;
  }[];
  improvement_potential: {
    [key: string]: number;
  };
  risk_factors: {
    factor: string;
    severity: string;
    probability: string;
    description: string;
  }[];
  cluster_info: {
    cluster_id: number;
    size: number;
    avg_ethical_score: number;
    avg_environmental_score: number;
    avg_social_score: number;
    avg_governance_score: number;
    description: string;
  };
  prediction: {
    next_quarter_score: number;
    confidence: number;
    factors: {
      factor: string;
      impact: number;
    }[];
  };
}

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Mock data for suppliers
const mockSuppliers: Supplier[] = [
  {
    id: 1,
    name: "Procter & Gamble",
    country: "United States",
    industry: "Consumer Goods",
    co2_emissions: 2.4, // Million metric tons CO2e
    delivery_efficiency: 0.92,
    wage_fairness: 0.88,
    human_rights_index: 0.85,
    waste_management_score: 0.83,
    ethical_score: 81.5,
    environmental_score: 78,
    social_score: 82,
    governance_score: 85,
    risk_level: "Low",
    created_at: "2023-05-15T10:30:00Z",
    updated_at: "2024-01-12T09:45:00Z",
  },
  {
    id: 2,
    name: "Foxconn Technology Group",
    country: "Taiwan",
    industry: "Electronics Manufacturing",
    co2_emissions: 4.3, // Million metric tons CO2e
    delivery_efficiency: 0.89,
    wage_fairness: 0.61,
    human_rights_index: 0.58,
    waste_management_score: 0.75,
    ethical_score: 67.4,
    environmental_score: 70,
    social_score: 59,
    governance_score: 72,
    risk_level: "Medium",
    created_at: "2023-06-20T08:15:00Z",
    updated_at: "2024-02-18T11:30:00Z",
  },
  {
    id: 3,
    name: "Unilever",
    country: "United Kingdom",
    industry: "Consumer Goods",
    co2_emissions: 1.9, // Million metric tons CO2e
    delivery_efficiency: 0.87,
    wage_fairness: 0.84,
    human_rights_index: 0.87,
    waste_management_score: 0.89,
    ethical_score: 84.2,
    environmental_score: 85,
    social_score: 83,
    governance_score: 84,
    risk_level: "Low",
    created_at: "2023-04-10T09:20:00Z",
    updated_at: "2024-01-25T16:40:00Z",
  },
  {
    id: 4,
    name: "Samsung Electronics",
    country: "South Korea",
    industry: "Electronics",
    co2_emissions: 16.1, // Million metric tons CO2e
    delivery_efficiency: 0.91,
    wage_fairness: 0.82,
    human_rights_index: 0.79,
    waste_management_score: 0.81,
    ethical_score: 77.8,
    environmental_score: 75,
    social_score: 78,
    governance_score: 82,
    risk_level: "Low",
    created_at: "2023-07-05T11:45:00Z",
    updated_at: "2024-02-01T13:20:00Z",
  },
  {
    id: 5,
    name: "Nestlé",
    country: "Switzerland",
    industry: "Food & Beverage",
    co2_emissions: 92, // Million metric tons CO2e
    delivery_efficiency: 0.84,
    wage_fairness: 0.76,
    human_rights_index: 0.73,
    waste_management_score: 0.77,
    ethical_score: 72.5,
    environmental_score: 69,
    social_score: 74,
    governance_score: 80,
    risk_level: "Medium",
    created_at: "2023-03-18T07:30:00Z",
    updated_at: "2024-02-10T10:15:00Z",
  },
  {
    id: 6,
    name: "Li & Fung",
    country: "Hong Kong",
    industry: "Supply Chain Management",
    co2_emissions: 0.8, // Million metric tons CO2e
    delivery_efficiency: 0.94,
    wage_fairness: 0.73,
    human_rights_index: 0.68,
    waste_management_score: 0.65,
    ethical_score: 71.2,
    environmental_score: 68,
    social_score: 70,
    governance_score: 75,
    risk_level: "Medium",
    created_at: "2023-08-12T13:10:00Z",
    updated_at: "2024-01-27T09:50:00Z",
  },
  {
    id: 7,
    name: "Tyson Foods",
    country: "United States",
    industry: "Food Processing",
    co2_emissions: 25, // Million metric tons CO2e
    delivery_efficiency: 0.82,
    wage_fairness: 0.71,
    human_rights_index: 0.68,
    waste_management_score: 0.66,
    ethical_score: 68.9,
    environmental_score: 64,
    social_score: 69,
    governance_score: 73,
    risk_level: "Medium",
    created_at: "2023-05-25T08:20:00Z",
    updated_at: "2024-01-15T14:30:00Z",
  },
  {
    id: 8,
    name: "Danone",
    country: "France",
    industry: "Food & Beverage",
    co2_emissions: 24.7, // Million metric tons CO2e
    delivery_efficiency: 0.85,
    wage_fairness: 0.83,
    human_rights_index: 0.81,
    waste_management_score: 0.84,
    ethical_score: 80.6,
    environmental_score: 82,
    social_score: 81,
    governance_score: 79,
    risk_level: "Low",
    created_at: "2023-06-14T10:45:00Z",
    updated_at: "2024-02-05T11:20:00Z",
  },
  {
    id: 9,
    name: "General Mills",
    country: "United States",
    industry: "Food & Beverage",
    co2_emissions: 12, // Million metric tons CO2e
    delivery_efficiency: 0.87,
    wage_fairness: 0.85,
    human_rights_index: 0.82,
    waste_management_score: 0.79,
    ethical_score: 79.8,
    environmental_score: 76,
    social_score: 83,
    governance_score: 82,
    risk_level: "Low",
    created_at: "2023-04-28T09:30:00Z",
    updated_at: "2024-01-18T16:15:00Z",
  },
  {
    id: 10,
    name: "Nike",
    country: "United States",
    industry: "Apparel & Footwear",
    co2_emissions: 0.3, // Million metric tons CO2e (direct operations)
    delivery_efficiency: 0.89,
    wage_fairness: 0.74,
    human_rights_index: 0.76,
    waste_management_score: 0.86,
    ethical_score: 78.3,
    environmental_score: 81,
    social_score: 75,
    governance_score: 80,
    risk_level: "Low",
    created_at: "2023-07-10T14:20:00Z",
    updated_at: "2024-02-12T10:40:00Z",
  },
  {
    id: 11,
    name: "VF Corporation",
    country: "United States",
    industry: "Apparel & Footwear",
    co2_emissions: 2.2, // Million metric tons CO2e
    delivery_efficiency: 0.86,
    wage_fairness: 0.78,
    human_rights_index: 0.77,
    waste_management_score: 0.81,
    ethical_score: 77.4,
    environmental_score: 79,
    social_score: 76,
    governance_score: 78,
    risk_level: "Low",
    created_at: "2023-05-22T11:15:00Z",
    updated_at: "2024-01-20T09:30:00Z",
  },
  {
    id: 12,
    name: "Haier",
    country: "China",
    industry: "Home Appliances",
    co2_emissions: 18.5, // Million metric tons CO2e
    delivery_efficiency: 0.84,
    wage_fairness: 0.69,
    human_rights_index: 0.65,
    waste_management_score: 0.72,
    ethical_score: 68.7,
    environmental_score: 71,
    social_score: 67,
    governance_score: 70,
    risk_level: "Medium",
    created_at: "2023-06-30T08:45:00Z",
    updated_at: "2024-02-08T15:10:00Z",
  },
];

export const getSuppliers = async (): Promise<Supplier[]> => {
  try {
    console.log("Fetching suppliers from API...");
    let allSuppliers: Supplier[] = [];
    let nextUrl = `${API_BASE_URL}/suppliers/`;

    // Fetch all pages of suppliers
    while (nextUrl) {
      const response = await fetch(nextUrl);

      if (!response.ok) {
        throw new Error(`API returned status ${response.status}`);
      }

      const data = await response.json();
      console.log("API response data:", data);

      // Handle paginated response (Django REST Framework format)
      if (data && typeof data === "object") {
        // Check if the response has a 'results' field (paginated response)
        if (data.results && Array.isArray(data.results)) {
          console.log("Using paginated API results:", data.results);
          if (data.results.length > 0) {
            allSuppliers = [...allSuppliers, ...data.results];
          }
          // Update nextUrl for pagination
          nextUrl = data.next;
        } else if (Array.isArray(data) && data.length > 0) {
          // Handle non-paginated response
          console.log("Using non-paginated API results");
          allSuppliers = data;
          break; // No pagination, exit loop
        } else {
          break; // No more data
        }
      } else {
        break; // Unexpected response format
      }
    }

    return allSuppliers.map((supplier) => ({
      ...supplier,
      isMockData: false,
    }));
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    throw error;
  }
};

export const evaluateSupplier = async (
  supplierData: SupplierEvaluation
): Promise<EvaluationResult> => {
  try {
    console.log("Submitting supplier data to API:", supplierData);
    const response = await fetch(`${API_BASE_URL}/suppliers/evaluate/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplierData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("API error:", response.status, errorText);

      // Return mock result if API is not available
      if (response.status === 404) {
        console.warn("Evaluation API endpoint not available. Using mock data.");
        return createMockEvaluationResult(supplierData);
      }

      throw new Error(
        `Failed to evaluate supplier: ${response.status} ${errorText}`
      );
    }

    // Process the real API response
    const data = await response.json();
    console.log("Evaluation API response:", data);
    return data;
  } catch (error) {
    console.error("Error in evaluateSupplier:", error);

    // If the error is related to the API not being available, return mock data
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("NetworkError")
    ) {
      console.warn("Evaluation API endpoint not available. Using mock data.");
      return createMockEvaluationResult(supplierData);
    }

    throw error;
  }
};

// Helper function to create mock evaluation result
function createMockEvaluationResult(
  supplierData: SupplierEvaluation
): EvaluationResult {
  // Calculate main category scores
  const environmentalScore = calculateEnvironmentalScore(supplierData);
  const socialScore = calculateSocialScore(supplierData);
  const governanceScore = calculateGovernanceScore(supplierData);
  const supplyChainScore = calculateSupplyChainScore(supplierData);
  const riskScore = calculateRiskScore(supplierData);

  // Calculate overall ethical score as weighted average
  const ethicalScore =
    (environmentalScore * 0.25 +
      socialScore * 0.25 +
      governanceScore * 0.25 +
      supplyChainScore * 0.15 +
      (1 - riskScore) * 0.1) *
    100;

  // Generate strengths and weaknesses based on scores
  const strengths = generateStrengths(supplierData);
  const weaknesses = generateWeaknesses(supplierData);

  // Generate risk factors
  const riskFactors = generateRiskFactors(supplierData);

  return {
    id: Math.floor(Math.random() * 1000) + 100,
    name: supplierData.name,

    // Overall scores (convert 0-1 scores to 0-100 for display)
    ethical_score: parseFloat(ethicalScore.toFixed(1)),
    environmental_score: parseFloat((environmentalScore * 100).toFixed(1)),
    social_score: parseFloat((socialScore * 100).toFixed(1)),
    governance_score: parseFloat((governanceScore * 100).toFixed(1)),
    supply_chain_score: parseFloat((supplyChainScore * 100).toFixed(1)),
    risk_score: parseFloat((riskScore * 100).toFixed(1)),

    // Detailed assessment
    assessment: {
      strengths: strengths.slice(0, 3),
      weaknesses: weaknesses.slice(0, 3),
      opportunities: generateOpportunities(supplierData),
      threats: generateThreats(supplierData),
    },

    // Recommendations
    recommendation: generateMockRecommendation(supplierData),
    suggestions: generateMockSuggestions(supplierData),

    // Risk factors
    risk_factors: riskFactors,

    // Compliance information
    compliance: {
      status:
        ethicalScore > 75
          ? "Compliant"
          : ethicalScore > 50
          ? "Partially Compliant"
          : "Non-Compliant",
      standards_met: generateStandardsMet(supplierData),
      certifications: generateCertifications(supplierData),
      gaps: generateComplianceGaps(supplierData),
    },

    // Industry comparison
    industry_comparison: {
      percentile: Math.min(
        95,
        Math.max(5, Math.round(ethicalScore * 0.8 + Math.random() * 20))
      ),
      average_score: 68.5,
      top_performer_score: 94.2,
    },

    isMockData: true,
  };
}

// Helper functions for score calculations
function calculateEnvironmentalScore(data: SupplierEvaluation): number {
  const metrics = [
    1 - Math.min(1, data.co2_emissions / 100), // Lower is better for CO2
    1 - Math.min(1, data.water_usage / 100), // Lower is better for water usage
    data.energy_efficiency || 0.5,
    data.waste_management_score || 0.5,
    data.renewable_energy_percent ? data.renewable_energy_percent / 100 : 0.3,
    data.pollution_control || 0.5,
  ];
  return metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
}

function calculateSocialScore(data: SupplierEvaluation): number {
  const metrics = [
    data.wage_fairness || 0.5,
    data.human_rights_index || 0.5,
    data.diversity_inclusion_score || 0.5,
    data.community_engagement || 0.5,
    data.worker_safety || 0.5,
  ];
  return metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
}

function calculateGovernanceScore(data: SupplierEvaluation): number {
  const metrics = [
    data.transparency_score || 0.5,
    1 - (data.corruption_risk || 0.5), // Lower corruption risk is better
    data.board_diversity || 0.5,
    data.ethics_program || 0.5,
    data.compliance_systems || 0.5,
  ];
  return metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
}

function calculateSupplyChainScore(data: SupplierEvaluation): number {
  const metrics = [
    data.delivery_efficiency || 0.5,
    data.quality_control_score || 0.5,
    data.supplier_diversity || 0.5,
    data.traceability || 0.5,
  ];
  return metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
}

function calculateRiskScore(data: SupplierEvaluation): number {
  const metrics = [
    data.geopolitical_risk || 0.5,
    data.climate_risk || 0.5,
    data.labor_dispute_risk || 0.5,
  ];
  return metrics.reduce((sum, val) => sum + val, 0) / metrics.length;
}

// Helper functions for generating assessment items
function generateStrengths(data: SupplierEvaluation): string[] {
  const strengths = [];

  if ((data.co2_emissions || 50) < 30)
    strengths.push("Low carbon emissions compared to industry average");

  if ((data.waste_management_score || 0) > 0.7)
    strengths.push("Excellent waste management practices");

  if ((data.renewable_energy_percent || 0) > 50)
    strengths.push("High utilization of renewable energy sources");

  if ((data.wage_fairness || 0) > 0.7)
    strengths.push("Strong commitment to fair wage practices");

  if ((data.human_rights_index || 0) > 0.7)
    strengths.push("Strong human rights protections and policies");

  if ((data.diversity_inclusion_score || 0) > 0.7)
    strengths.push("Excellent diversity and inclusion initiatives");

  if ((data.transparency_score || 0) > 0.7)
    strengths.push("High level of corporate transparency");

  if ((data.corruption_risk || 1) < 0.3) strengths.push("Low corruption risk");

  if ((data.ethics_program || 0) > 0.7)
    strengths.push("Robust ethics program implementation");

  if ((data.delivery_efficiency || 0) > 0.7)
    strengths.push("Highly efficient delivery systems");

  if ((data.quality_control_score || 0) > 0.7)
    strengths.push("Superior quality control processes");

  // If we don't have enough strengths, add some generic ones
  if (strengths.length < 3) {
    strengths.push(
      "Established reputation in the industry",
      "Commitment to sustainability principles",
      "Responsive management structure"
    );
  }

  return strengths;
}

function generateWeaknesses(data: SupplierEvaluation): string[] {
  const weaknesses = [];

  if ((data.co2_emissions || 50) > 70)
    weaknesses.push("High carbon emissions relative to industry standards");

  if ((data.waste_management_score || 0) < 0.3)
    weaknesses.push("Poor waste management practices");

  if ((data.renewable_energy_percent || 0) < 20)
    weaknesses.push("Low utilization of renewable energy sources");

  if ((data.wage_fairness || 0) < 0.3)
    weaknesses.push("Concerning wage fairness practices");

  if ((data.human_rights_index || 0) < 0.3)
    weaknesses.push("Human rights compliance issues identified");

  if ((data.diversity_inclusion_score || 0) < 0.3)
    weaknesses.push("Limited diversity and inclusion initiatives");

  if ((data.transparency_score || 0) < 0.3)
    weaknesses.push("Lack of corporate transparency");

  if ((data.corruption_risk || 0) > 0.7)
    weaknesses.push("High corruption risk identified");

  if ((data.ethics_program || 0) < 0.3)
    weaknesses.push("Inadequate ethics program implementation");

  if ((data.delivery_efficiency || 0) < 0.3)
    weaknesses.push("Inefficient delivery systems");

  if ((data.quality_control_score || 0) < 0.3)
    weaknesses.push("Deficient quality control processes");

  // If we don't have enough weaknesses, add some generic ones
  if (weaknesses.length < 2) {
    weaknesses.push(
      "Limited documentation of sustainability practices",
      "Potential challenges with supply chain visibility",
      "Opportunity to enhance stakeholder engagement"
    );
  }

  return weaknesses;
}

function generateOpportunities(data: SupplierEvaluation): string[] {
  return [
    "Implement advanced emissions tracking technology",
    "Develop comprehensive sustainability reporting framework",
    "Expand renewable energy initiatives across operations",
    "Strengthen supplier diversity program",
    "Enhance worker development and training programs",
  ].slice(0, 3);
}

function generateThreats(data: SupplierEvaluation): string[] {
  const threats = [];

  if ((data.geopolitical_risk || 0) > 0.5)
    threats.push("Exposure to geopolitical instability in operating regions");

  if ((data.climate_risk || 0) > 0.5)
    threats.push("Vulnerability to climate change impacts on operations");

  if ((data.labor_dispute_risk || 0) > 0.5)
    threats.push("Potential labor disputes affecting production continuity");

  // Add generic threats if needed
  if (threats.length < 2) {
    threats.push(
      "Increasing regulatory pressure in key markets",
      "Rising consumer expectations for ethical sourcing",
      "Competitive pressure from more sustainable market alternatives"
    );
  }

  return threats.slice(0, 3);
}

function generateRiskFactors(data: SupplierEvaluation): any[] {
  const riskFactors = [];

  // Environmental risks
  if ((data.co2_emissions || 50) > 70) {
    riskFactors.push({
      factor: "Carbon Emissions Compliance",
      severity: "High",
      probability: "Medium",
      mitigation: "Implement emissions reduction program with strict targets",
    });
  }

  // Social risks
  if ((data.human_rights_index || 0.5) < 0.4) {
    riskFactors.push({
      factor: "Human Rights Violations",
      severity: "High",
      probability: "Medium",
      mitigation: "Develop comprehensive human rights due diligence process",
    });
  }

  // Governance risks
  if ((data.corruption_risk || 0.5) > 0.6) {
    riskFactors.push({
      factor: "Corruption and Bribery",
      severity: "High",
      probability: "Medium",
      mitigation:
        "Strengthen anti-corruption policies and whistleblower protection",
    });
  }

  // Supply chain risks
  if ((data.traceability || 0.5) < 0.4) {
    riskFactors.push({
      factor: "Supply Chain Opacity",
      severity: "Medium",
      probability: "High",
      mitigation: "Implement blockchain-based supply chain tracking",
    });
  }

  // Add generic risk factor if needed
  if (riskFactors.length < 2) {
    riskFactors.push({
      factor: "Regulatory Compliance",
      severity: "Medium",
      probability: "Medium",
      mitigation: "Establish regulatory intelligence system to track changes",
    });
  }

  return riskFactors;
}

function generateStandardsMet(data: SupplierEvaluation): string[] {
  const standards = [];

  // Environmental standards
  if (calculateEnvironmentalScore(data) > 0.6) {
    standards.push("ISO 14001 Environmental Management");
  }

  // Social standards
  if (calculateSocialScore(data) > 0.6) {
    standards.push("SA8000 Social Accountability");
  }

  // Governance standards
  if (calculateGovernanceScore(data) > 0.6) {
    standards.push("ISO 37001 Anti-Bribery Management");
  }

  // Generic standards
  standards.push("UN Global Compact Principles");

  return standards;
}

function generateCertifications(data: SupplierEvaluation): string[] {
  const certifications = [];

  // Based on environmental performance
  if ((data.renewable_energy_percent || 0) > 50) {
    certifications.push("Green Energy Certification");
  }

  // Based on social performance
  if ((data.wage_fairness || 0.5) > 0.7) {
    certifications.push("Fair Labor Association Certification");
  }

  // Generic certifications
  if (certifications.length < 2) {
    certifications.push("ISO 9001 Quality Management");
  }

  return certifications;
}

function generateComplianceGaps(data: SupplierEvaluation): string[] {
  const gaps = [];

  if ((data.co2_emissions || 50) > 60) {
    gaps.push("Carbon emissions reduction targets not met");
  }

  if ((data.water_usage || 50) > 60) {
    gaps.push("Water conservation requirements not fulfilled");
  }

  if ((data.worker_safety || 0.5) < 0.5) {
    gaps.push("Worker safety protocols below industry standards");
  }

  if ((data.transparency_score || 0.5) < 0.5) {
    gaps.push("Insufficient disclosure of supply chain information");
  }

  return gaps.slice(0, 3);
}

export const getRecommendations = async () => {
  try {
    console.log("Fetching recommendations from API...");
    const response = await fetch(`${API_BASE_URL}/suppliers/recommendations/`);

    if (!response.ok) {
      console.warn(
        `Recommendations API returned status ${response.status}. Using mock data.`
      );
      // Return sorted mock suppliers if the endpoint is not available
      return mockSuppliers
        .sort((a, b) => (b.ethical_score || 0) - (a.ethical_score || 0))
        .map((supplier) => ({
          ...supplier,
          recommendation: generateMockRecommendation(supplier),
          isMockData: true,
        }));
    }

    const data = await response.json();
    console.log("Recommendations API response:", data);

    // Handle paginated response (Django REST Framework format)
    if (data && typeof data === "object") {
      // Check if the response has a 'results' field (paginated response)
      if (data.results && Array.isArray(data.results)) {
        console.log(
          "Using paginated API results for recommendations:",
          data.results
        );
        if (data.results.length > 0) {
          return data.results;
        }
      }

      // Handle non-paginated response
      if (Array.isArray(data) && data.length > 0) {
        console.log("Using non-paginated API results for recommendations");
        return data;
      }
    }

    // Return mock data if we couldn't get valid data from the API
    console.warn("API returned empty recommendations data. Using mock data.");
    return mockSuppliers
      .sort((a, b) => (b.ethical_score || 0) - (a.ethical_score || 0))
      .map((supplier) => ({
        ...supplier,
        recommendation: generateMockRecommendation(supplier),
        isMockData: true,
      }));
  } catch (error) {
    console.error("Error fetching recommendations:", error);
    // Return sorted mock suppliers in case of error
    return mockSuppliers
      .sort((a, b) => (b.ethical_score || 0) - (a.ethical_score || 0))
      .map((supplier) => ({
        ...supplier,
        recommendation: generateMockRecommendation(supplier),
        isMockData: true,
      }));
  }
};

export const getDashboardData = async (): Promise<DashboardData> => {
  try {
    console.log("Fetching dashboard data from API...");
    const response = await fetch(`${API_BASE_URL}/dashboard/`);

    if (!response.ok) {
      console.warn(
        `Dashboard API returned status ${response.status}. Using mock data.`
      );
      return getMockDashboardData();
    }

    const data = await response.json();
    console.log("Dashboard API response:", data);

    return {
      ...data,
      isMockData: false,
    };
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return mock data in case of error
    return getMockDashboardData();
  }
};

// Mock dashboard data
const getMockDashboardData = (): DashboardData => {
  console.log("Using mock dashboard data");
  return {
    total_suppliers: 12,
    avg_ethical_score: 75.3,
    avg_co2_emissions: 23.9,
    suppliers_by_country: {
      "United States": 4,
      "United Kingdom": 1,
      Taiwan: 1,
      "South Korea": 1,
      Switzerland: 1,
      "Hong Kong": 1,
      France: 1,
      China: 1,
    },
    ethical_score_distribution: [
      { range: "0-20", count: 0 },
      { range: "21-40", count: 0 },
      { range: "41-60", count: 2 },
      { range: "61-80", count: 7 },
      { range: "81-100", count: 3 },
    ],
    co2_emissions_by_industry: [
      { name: "Consumer Goods", value: 4.3 },
      { name: "Electronics", value: 20.4 },
      { name: "Food & Beverage", value: 128.7 },
      { name: "Apparel", value: 2.5 },
      { name: "Home Appliances", value: 18.5 },
    ],
    isMockData: true,
  };
};

export const getDetailedAnalysis = async (
  supplierId: number
): Promise<DetailedAnalysis> => {
  try {
    console.log(`Fetching detailed analysis for supplier ${supplierId}...`);
    const response = await fetch(
      `${API_BASE_URL}/suppliers/${supplierId}/detailed_analysis/`
    );

    if (!response.ok) {
      console.warn(
        `Detailed analysis API returned status ${response.status}. Using mock data.`
      );
      return getMockDetailedAnalysis(supplierId);
    }

    const data = await response.json();
    console.log("Detailed analysis API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching detailed analysis:", error);
    return getMockDetailedAnalysis(supplierId);
  }
};

export const simulateChanges = async (
  supplierId: number,
  changes: Record<string, number>
): Promise<any> => {
  try {
    console.log(`Simulating changes for supplier ${supplierId}:`, changes);
    const response = await fetch(
      `${API_BASE_URL}/suppliers/${supplierId}/simulate_changes/`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ changes }),
      }
    );

    if (!response.ok) {
      console.warn(
        `Simulation API returned status ${response.status}. Using mock data.`
      );
      return getMockSimulationResult(supplierId, changes);
    }

    const data = await response.json();
    console.log("Simulation API response:", data);
    return data;
  } catch (error) {
    console.error("Error simulating changes:", error);
    return getMockSimulationResult(supplierId, changes);
  }
};

// Mock data generators for the new endpoints
function getMockDetailedAnalysis(supplierId: number): DetailedAnalysis {
  const supplier =
    mockSuppliers.find((s) => s.id === supplierId) || mockSuppliers[0];
  const score = supplier.ethical_score || 75;

  return {
    id: supplier.id,
    name: supplier.name,
    country: supplier.country,
    industry: "Manufacturing",
    scores: {
      overall: score,
      environmental: score - 5 + Math.random() * 10,
      social: score - 5 + Math.random() * 10,
      governance: score - 5 + Math.random() * 10,
      risk_level:
        score > 80
          ? "low"
          : score > 60
          ? "medium"
          : score > 40
          ? "high"
          : "critical",
    },
    industry_benchmarks: {
      avg_ethical_score: 72.5,
      avg_environmental_score: 68.2,
      avg_social_score: 71.8,
      avg_governance_score: 74.3,
      best_ethical_score: 91.2,
      worst_ethical_score: 48.7,
    },
    percentiles: {
      overall: 65,
      environmental: 58,
      social: 72,
      governance: 61,
    },
    recommendations: [
      {
        action:
          "Reduce carbon emissions by implementing energy efficiency measures",
        impact: "high",
        difficulty: "medium",
        timeframe: "long-term",
        details:
          "Current emissions are at 35.2. Aim to reduce by 15% over the next year.",
      },
      {
        action: "Implement water conservation and recycling systems",
        impact: "medium",
        difficulty: "medium",
        timeframe: "medium-term",
        details:
          "Current water usage is at 42.3. Aim to reduce by 20% within 6 months.",
      },
      {
        action: "Invest in renewable energy sources and efficiency upgrades",
        impact: "high",
        difficulty: "high",
        timeframe: "long-term",
        details: "Current efficiency score is 62.5%. Target 25% improvement.",
      },
    ],
    improvement_scenarios: [
      {
        name: "Environmental Focus",
        description: "Improve environmental metrics by 20%",
        changes: {
          co2_emissions: supplier.co2_emissions * 0.8,
          waste_management_score: supplier.waste_management_score * 1.2,
        },
        impact: {
          current_scores: {
            overall_score: score,
            environmental_score: score - 5 + Math.random() * 10,
            social_score: score - 5 + Math.random() * 10,
            governance_score: score - 5 + Math.random() * 10,
          },
          predicted_scores: {
            overall_score: score + 8.5,
            environmental_score: score - 5 + Math.random() * 10 + 15.2,
            social_score: score - 5 + Math.random() * 10,
            governance_score: score - 5 + Math.random() * 10,
          },
          improvements: {
            overall_score: 11.3,
            environmental_score: 22.4,
            social_score: 0,
            governance_score: 0,
          },
        },
      },
      {
        name: "Social Responsibility Focus",
        description: "Improve social metrics by 20%",
        changes: {
          wage_fairness: supplier.wage_fairness * 1.2,
          human_rights_index: supplier.human_rights_index * 1.2,
        },
        impact: {
          current_scores: {
            overall_score: score,
            environmental_score: score - 5 + Math.random() * 10,
            social_score: score - 5 + Math.random() * 10,
            governance_score: score - 5 + Math.random() * 10,
          },
          predicted_scores: {
            overall_score: score + 7.2,
            environmental_score: score - 5 + Math.random() * 10,
            social_score: score - 5 + Math.random() * 10 + 18.5,
            governance_score: score - 5 + Math.random() * 10,
          },
          improvements: {
            overall_score: 9.6,
            environmental_score: 0,
            social_score: 25.8,
            governance_score: 0,
          },
        },
      },
    ],
    isMockData: true,
  };
}

function getMockSimulationResult(
  supplierId: number,
  changes: Record<string, number>
): any {
  const supplier =
    mockSuppliers.find((s) => s.id === supplierId) || mockSuppliers[0];
  const currentScore = supplier.ethical_score || 75;

  // Calculate a simple impact based on changes
  let improvement = 0;
  if (changes.co2_emissions && changes.co2_emissions < supplier.co2_emissions) {
    improvement += 3;
  }
  if (changes.wage_fairness && changes.wage_fairness > supplier.wage_fairness) {
    improvement += 3;
  }
  if (
    changes.human_rights_index &&
    changes.human_rights_index > supplier.human_rights_index
  ) {
    improvement += 3;
  }
  if (
    changes.waste_management_score &&
    changes.waste_management_score > supplier.waste_management_score
  ) {
    improvement += 3;
  }

  const newScore = Math.min(100, currentScore + improvement);
  const percentChange = ((newScore - currentScore) / currentScore) * 100;

  return {
    current_scores: {
      overall_score: currentScore,
      environmental_score: currentScore - 5 + Math.random() * 10,
      social_score: currentScore - 5 + Math.random() * 10,
      governance_score: currentScore - 5 + Math.random() * 10,
    },
    predicted_scores: {
      overall_score: newScore,
      environmental_score:
        currentScore -
        5 +
        Math.random() * 10 +
        (changes.co2_emissions ? 5 : 0) +
        (changes.waste_management_score ? 5 : 0),
      social_score:
        currentScore -
        5 +
        Math.random() * 10 +
        (changes.wage_fairness ? 5 : 0) +
        (changes.human_rights_index ? 5 : 0),
      governance_score: currentScore - 5 + Math.random() * 10,
    },
    improvements: {
      overall_score: percentChange.toFixed(2),
      environmental_score:
        changes.co2_emissions || changes.waste_management_score
          ? (5 + Math.random() * 5).toFixed(2)
          : "0.00",
      social_score:
        changes.wage_fairness || changes.human_rights_index
          ? (5 + Math.random() * 5).toFixed(2)
          : "0.00",
      governance_score: "0.00",
    },
  };
}

// Add this new function to handle adding suppliers
export const addSupplier = async (supplierData: any): Promise<Supplier> => {
  try {
    console.log("Adding new supplier to API:", supplierData);
    const response = await fetch(`${API_BASE_URL}/suppliers/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(supplierData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(
        "API error when adding supplier:",
        response.status,
        errorText
      );

      if (response.status === 404) {
        console.warn(
          "Add supplier API endpoint not available. Creating mock supplier."
        );
        // Create a mock supplier with a new ID higher than existing mock suppliers
        const newId = Math.max(...mockSuppliers.map((s) => s.id)) + 1;
        const mockSupplier: Supplier = {
          id: newId,
          name: supplierData.name,
          country: supplierData.country,
          industry: supplierData.industry || "Manufacturing",
          co2_emissions: supplierData.co2_emissions || 50,
          delivery_efficiency: supplierData.delivery_efficiency || 0.5,
          wage_fairness: supplierData.wage_fairness || 0.5,
          human_rights_index: supplierData.human_rights_index || 0.5,
          waste_management_score: supplierData.waste_management_score || 0.5,
          ethical_score: calculateMockEthicalScore(supplierData),
          environmental_score: calculateMockEnvironmentalScore(supplierData),
          social_score: calculateMockSocialScore(supplierData),
          governance_score: calculateMockGovernanceScore(supplierData),
          risk_level: calculateMockRiskLevel(supplierData),
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          isMockData: true,
        };

        // Add this new supplier to the mockSuppliers array so it will show up in future getSuppliers calls
        mockSuppliers.push(mockSupplier);
        return mockSupplier;
      }

      throw new Error(
        `Failed to add supplier: ${response.status} ${errorText}`
      );
    }

    // Process the real API response
    const data = await response.json();
    console.log("Add supplier API response:", data);
    return data;
  } catch (error) {
    console.error("Error in addSupplier:", error);

    // If the error is related to the API not being available, create a mock supplier
    if (
      error.message?.includes("Failed to fetch") ||
      error.message?.includes("NetworkError")
    ) {
      console.warn(
        "Add supplier API endpoint not available. Creating mock supplier."
      );
      // Create a mock supplier with a new ID
      const newId = Math.max(...mockSuppliers.map((s) => s.id)) + 1;
      const mockSupplier: Supplier = {
        id: newId,
        name: supplierData.name,
        country: supplierData.country,
        industry: supplierData.industry || "Manufacturing",
        co2_emissions: supplierData.co2_emissions || 50,
        delivery_efficiency: supplierData.delivery_efficiency || 0.5,
        wage_fairness: supplierData.wage_fairness || 0.5,
        human_rights_index: supplierData.human_rights_index || 0.5,
        waste_management_score: supplierData.waste_management_score || 0.5,
        ethical_score: calculateMockEthicalScore(supplierData),
        environmental_score: calculateMockEnvironmentalScore(supplierData),
        social_score: calculateMockSocialScore(supplierData),
        governance_score: calculateMockGovernanceScore(supplierData),
        risk_level: calculateMockRiskLevel(supplierData),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        isMockData: true,
      };

      // Add this new supplier to the mockSuppliers array
      mockSuppliers.push(mockSupplier);
      return mockSupplier;
    }

    throw error;
  }
};

// Helper functions for mock supplier creation
const calculateMockEthicalScore = (data: any): number => {
  // Simple algorithm to calculate a mock ethical score based on input data
  const scores = [
    data.co2_emissions ? Math.max(0, 100 - data.co2_emissions) / 100 : 0.5,
    data.delivery_efficiency || 0.5,
    data.wage_fairness || 0.5,
    data.human_rights_index || 0.5,
    data.waste_management_score || 0.5,
    data.energy_efficiency || 0.5,
    data.diversity_inclusion_score || 0.5,
    data.transparency_score || 0.5,
    1 - (data.corruption_risk || 0.5),
    data.quality_control_score || 0.5,
  ];

  // Average score multiplied by 100
  return (
    Math.round(
      (scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100
    ) / 100
  );
};

const calculateMockEnvironmentalScore = (data: any): number => {
  const scores = [
    data.co2_emissions ? Math.max(0, 100 - data.co2_emissions) / 100 : 0.5,
    data.waste_management_score || 0.5,
    data.energy_efficiency || 0.5,
    data.water_usage ? Math.max(0, 100 - data.water_usage) / 100 : 0.5,
  ];

  return (
    Math.round(
      (scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100
    ) / 100
  );
};

const calculateMockSocialScore = (data: any): number => {
  const scores = [
    data.wage_fairness || 0.5,
    data.human_rights_index || 0.5,
    data.diversity_inclusion_score || 0.5,
    data.community_engagement || 0.5,
  ];

  return (
    Math.round(
      (scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100
    ) / 100
  );
};

const calculateMockGovernanceScore = (data: any): number => {
  const scores = [
    data.transparency_score || 0.5,
    1 - (data.corruption_risk || 0.5),
  ];

  return (
    Math.round(
      (scores.reduce((sum, score) => sum + score, 0) / scores.length) * 100
    ) / 100
  );
};

const calculateMockRiskLevel = (data: any): string => {
  const ethicalScore = calculateMockEthicalScore(data);
  if (ethicalScore >= 0.8) return "Low";
  if (ethicalScore >= 0.6) return "Medium";
  return "High";
};

export const getSupplierAnalytics = async (
  supplierId: number
): Promise<SupplierAnalytics> => {
  try {
    console.log(`Fetching analytics for supplier ${supplierId}...`);
    const response = await fetch(
      `${API_BASE_URL}/suppliers/${supplierId}/analytics/`
    );

    if (!response.ok) {
      console.warn(
        `Analytics API returned status ${response.status}. Using mock data.`
      );
      return getMockSupplierAnalytics(supplierId);
    }

    const data = await response.json();
    console.log("Supplier analytics API response:", data);
    return data;
  } catch (error) {
    console.error("Error fetching supplier analytics:", error);
    return getMockSupplierAnalytics(supplierId);
  }
};

// Mock data generator for supplier analytics
function getMockSupplierAnalytics(supplierId: number): SupplierAnalytics {
  const supplier =
    mockSuppliers.find((s) => s.id === supplierId) || mockSuppliers[0];

  return {
    supplier: {
      id: supplier.id,
      name: supplier.name,
      country: supplier.country,
      industry: "Manufacturing",
      ethical_score: supplier.ethical_score || 78,
      environmental_score: supplier.ethical_score
        ? supplier.ethical_score * 0.9
        : 72,
      social_score: supplier.ethical_score ? supplier.ethical_score * 1.05 : 82,
      governance_score: supplier.ethical_score
        ? supplier.ethical_score * 0.98
        : 76,
      overall_score: supplier.ethical_score
        ? supplier.ethical_score * 0.99
        : 77,
      risk_level: "Medium",
      co2_emissions: supplier.co2_emissions || 65,
      water_usage: 58,
      energy_efficiency: 0.68,
      waste_management_score: supplier.waste_management_score || 0.75,
      wage_fairness: supplier.wage_fairness || 0.85,
      human_rights_index: supplier.human_rights_index || 0.79,
      diversity_inclusion_score: 0.82,
      community_engagement: 0.73,
      transparency_score: 0.74,
      corruption_risk: 0.22,
      delivery_efficiency: supplier.delivery_efficiency || 0.88,
      quality_control_score: 0.91,
      esg_reports: [
        { year: 2021, environmental: 0.65, social: 0.78, governance: 0.7 },
        { year: 2022, environmental: 0.68, social: 0.8, governance: 0.73 },
        { year: 2023, environmental: 0.72, social: 0.82, governance: 0.76 },
      ],
      media_sentiment: [
        {
          source: "Industry News",
          date: "2023-10-15",
          score: 0.8,
          headline: `${supplier.name} Leads in Sustainable Manufacturing`,
        },
        {
          source: "Financial Times",
          date: "2023-09-08",
          score: 0.6,
          headline: `Mixed Results for ${supplier.name}'s Q3 Performance`,
        },
        {
          source: "Twitter",
          date: "2023-11-20",
          score: -0.2,
          headline: `Customers Report Delays in ${supplier.name}'s Supply Chain`,
        },
      ],
      controversies: [
        {
          issue: "Employee Complaint",
          date: "2023-07-12",
          severity: "Low",
          status: "Resolved",
        },
        {
          issue: "Environmental Fine",
          date: "2022-05-18",
          severity: "Medium",
          status: "Resolved",
        },
      ],
    },
    industry_average: {
      ethical_score: 65,
      environmental_score: 60,
      social_score: 68,
      governance_score: 63,
      overall_score: 64,
      co2_emissions: 75,
      water_usage: 70,
      energy_efficiency: 0.58,
      waste_management_score: 0.62,
      wage_fairness: 0.72,
      human_rights_index: 0.68,
      diversity_inclusion_score: 0.65,
      community_engagement: 0.6,
      transparency_score: 0.61,
      corruption_risk: 0.3,
      delivery_efficiency: 0.75,
      quality_control_score: 0.8,
    },
    similar_suppliers: [],
    recommendations: [
      {
        area: "Environmental",
        suggestion: "Implement water recycling systems in manufacturing plants",
        impact: "High",
        difficulty: "Medium",
      },
      {
        area: "Social",
        suggestion:
          "Expand community engagement program to include educational initiatives",
        impact: "Medium",
        difficulty: "Low",
      },
      {
        area: "Governance",
        suggestion:
          "Enhance board diversity and establish an independent ethics committee",
        impact: "Medium",
        difficulty: "Medium",
      },
    ],
    improvement_potential: {
      co2_emissions: 18,
      water_usage: 22,
      energy_efficiency: 15,
      waste_management_score: 12,
      transparency_score: 18,
      corruption_risk: 10,
    },
    risk_factors: [
      {
        factor: "Supply Chain Disruption",
        severity: "Medium",
        probability: "Medium",
        description:
          "Potential disruptions due to reliance on suppliers in regions with geopolitical instability",
      },
      {
        factor: "Regulatory Compliance",
        severity: "High",
        probability: "Low",
        description:
          "Risk of non-compliance with upcoming carbon emissions regulations",
      },
    ],
    cluster_info: {
      cluster_id: 2,
      size: 15,
      avg_ethical_score: 0.75,
      avg_environmental_score: 0.71,
      avg_social_score: 0.78,
      avg_governance_score: 0.73,
      description:
        "Above-average performers with strong social responsibility programs",
    },
    prediction: {
      next_quarter_score: 0.79,
      confidence: 0.85,
      factors: [
        { factor: "Seasonal efficiency improvements", impact: 0.02 },
        { factor: "Expanding diversity initiatives", impact: 0.03 },
        { factor: "Pending environmental litigation", impact: -0.01 },
      ],
    },
  };
}

// ML Status Interfaces
export interface MLModelStatus {
  name: string;
  status: "training" | "ready" | "error";
  accuracy: number;
  lastUpdated: string;
  predictionCount: number;
}

export interface MLSystemStatus {
  apiHealth: boolean;
  dataIngestion: boolean;
  mlPipeline: boolean;
  lastChecked: string;
}

export interface MLStatus {
  models: MLModelStatus[];
  systemStatus: MLSystemStatus;
  isMockData?: boolean;
}

// Get Machine Learning Status from the API
export const getMLStatus = async (): Promise<MLStatus> => {
  try {
    console.log("Fetching ML status from API...");
    const response = await fetch(`${API_BASE_URL}/ml/status/`);

    if (!response.ok) {
      console.warn(
        `ML Status API returned status ${response.status}. Using mock data.`
      );
      return getMockMLStatus();
    }

    const data = await response.json();
    console.log("ML Status API response:", data);
    return {
      ...data,
      isMockData: false,
    };
  } catch (error) {
    console.error("Error fetching ML status:", error);
    return getMockMLStatus();
  }
};

// Helper function to get mock ML status
function getMockMLStatus(): MLStatus {
  return {
    models: [
      {
        name: "Supplier Risk Prediction",
        status: "ready",
        accuracy: 0.89,
        lastUpdated: "2 hours ago",
        predictionCount: 287,
      },
      {
        name: "ESG Score Estimation",
        status: "training",
        accuracy: 0.75,
        lastUpdated: "in progress",
        predictionCount: 143,
      },
      {
        name: "Supply Chain Disruption",
        status: "ready",
        accuracy: 0.91,
        lastUpdated: "30 minutes ago",
        predictionCount: 321,
      },
    ],
    systemStatus: {
      apiHealth: true,
      dataIngestion: true,
      mlPipeline: true,
      lastChecked: new Date().toLocaleTimeString(),
    },
    isMockData: true,
  };
}

// Export a function to check if the API is available
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    const response = await fetch(`${API_BASE_URL}/ml/status/`, {
      method: "HEAD",
      cache: "no-cache",
    });
    return response.ok;
  } catch (error) {
    console.error("API connection check failed:", error);
    return false;
  }
};

// Add new interfaces for supply chain graph
export interface GraphNode {
  id: string;
  name: string;
  type:
    | "supplier"
    | "manufacturer"
    | "wholesaler"
    | "rawMaterial"
    | "distributor"
    | "retailer";
  country?: string;
  ethical_score?: number;
  group?: number;
  level?: number;
}

export interface GraphLink {
  source: string;
  target: string;
  type?: string;
  strength?: number;
  ethical?: boolean;
}

export interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
}

// Function to get supply chain graph data
export const getSupplyChainGraphData = async (): Promise<GraphData> => {
  const isConnected = await checkApiConnection();

  if (isConnected) {
    try {
      const response = await fetch(`${API_BASE_URL}/supply-chain-graph/`);

      if (!response.ok) {
        console.warn(
          `Supply Chain Graph API returned status ${response.status}. Using mock data.`
        );
        return getMockSupplyChainGraphData();
      }

      const data = await response.json();
      return {
        nodes: data.nodes,
        links: data.links,
      };
    } catch (error) {
      console.error("Error fetching supply chain graph data:", error);
      return getMockSupplyChainGraphData();
    }
  } else {
    console.warn("API not available, using mock data for supply chain graph");
    return getMockSupplyChainGraphData();
  }
};

// Mock data for supply chain graph
const getMockSupplyChainGraphData = (): GraphData => {
  return {
    nodes: [
      // Raw Materials
      {
        id: "cotton",
        name: "Cotton",
        type: "rawMaterial",
        level: 1,
        ethical_score: 85,
        country: "India",
      },
      {
        id: "oil",
        name: "Crude Oil",
        type: "rawMaterial",
        level: 1,
        ethical_score: 40,
        country: "Saudi Arabia",
      },
      {
        id: "minerals",
        name: "Rare Earth Minerals",
        type: "rawMaterial",
        level: 1,
        ethical_score: 30,
        country: "China",
      },
      {
        id: "aluminum",
        name: "Aluminum",
        type: "rawMaterial",
        level: 1,
        ethical_score: 60,
        country: "Australia",
      },
      {
        id: "timber",
        name: "Timber",
        type: "rawMaterial",
        level: 1,
        ethical_score: 75,
        country: "Brazil",
      },

      // Suppliers
      {
        id: "s1",
        name: "EcoFabrics Inc",
        type: "supplier",
        level: 2,
        ethical_score: 90,
        country: "India",
      },
      {
        id: "s2",
        name: "PlastiCorp",
        type: "supplier",
        level: 2,
        ethical_score: 45,
        country: "China",
      },
      {
        id: "s3",
        name: "GlobalMetal Ltd",
        type: "supplier",
        level: 2,
        ethical_score: 65,
        country: "Australia",
      },
      {
        id: "s4",
        name: "WoodWorks",
        type: "supplier",
        level: 2,
        ethical_score: 80,
        country: "Canada",
      },
      {
        id: "s5",
        name: "ChemTech Industries",
        type: "supplier",
        level: 2,
        ethical_score: 55,
        country: "Germany",
      },

      // Manufacturers
      {
        id: "m1",
        name: "EcoApparel",
        type: "manufacturer",
        level: 3,
        ethical_score: 88,
        country: "Portugal",
      },
      {
        id: "m2",
        name: "TechBuild Inc",
        type: "manufacturer",
        level: 3,
        ethical_score: 72,
        country: "Taiwan",
      },
      {
        id: "m3",
        name: "GlobalProducts",
        type: "manufacturer",
        level: 3,
        ethical_score: 50,
        country: "Mexico",
      },
      {
        id: "m4",
        name: "FurniturePlus",
        type: "manufacturer",
        level: 3,
        ethical_score: 83,
        country: "Sweden",
      },
      {
        id: "m5",
        name: "AutoParts Ltd",
        type: "manufacturer",
        level: 3,
        ethical_score: 65,
        country: "Japan",
      },

      // Wholesalers
      {
        id: "w1",
        name: "Fashion Distributors",
        type: "wholesaler",
        level: 4,
        ethical_score: 78,
        country: "France",
      },
      {
        id: "w2",
        name: "Tech Wholesale Group",
        type: "wholesaler",
        level: 4,
        ethical_score: 60,
        country: "United States",
      },
      {
        id: "w3",
        name: "Global Goods Inc",
        type: "wholesaler",
        level: 4,
        ethical_score: 55,
        country: "Netherlands",
      },
      {
        id: "w4",
        name: "Home Solutions",
        type: "wholesaler",
        level: 4,
        ethical_score: 75,
        country: "Denmark",
      },
      {
        id: "w5",
        name: "Auto Wholesale",
        type: "wholesaler",
        level: 4,
        ethical_score: 62,
        country: "Germany",
      },

      // Retailers
      {
        id: "r1",
        name: "Eco Clothes",
        type: "retailer",
        level: 5,
        ethical_score: 85,
        country: "United Kingdom",
      },
      {
        id: "r2",
        name: "TechShop",
        type: "retailer",
        level: 5,
        ethical_score: 68,
        country: "United States",
      },
      {
        id: "r3",
        name: "Global Mart",
        type: "retailer",
        level: 5,
        ethical_score: 52,
        country: "Canada",
      },
      {
        id: "r4",
        name: "Design Home",
        type: "retailer",
        level: 5,
        ethical_score: 80,
        country: "Italy",
      },
      {
        id: "r5",
        name: "Auto World",
        type: "retailer",
        level: 5,
        ethical_score: 60,
        country: "France",
      },
    ],
    links: [
      // Raw Materials to Suppliers
      { source: "cotton", target: "s1", ethical: true },
      { source: "oil", target: "s2", ethical: false },
      { source: "minerals", target: "s2", ethical: false },
      { source: "aluminum", target: "s3", ethical: true },
      { source: "timber", target: "s4", ethical: true },

      // Some suppliers to multiple manufacturers
      { source: "s1", target: "m1", ethical: true },
      { source: "s2", target: "m2", ethical: false },
      { source: "s2", target: "m3", ethical: false },
      { source: "s3", target: "m5", ethical: true },
      { source: "s3", target: "m2", ethical: true },
      { source: "s4", target: "m4", ethical: true },
      { source: "s5", target: "m3", ethical: false },
      { source: "s5", target: "m5", ethical: false },

      // Manufacturers to Wholesalers
      { source: "m1", target: "w1", ethical: true },
      { source: "m2", target: "w2", ethical: true },
      { source: "m3", target: "w3", ethical: false },
      { source: "m4", target: "w4", ethical: true },
      { source: "m5", target: "w5", ethical: true },
      { source: "m2", target: "w3", ethical: true },

      // Wholesalers to Retailers
      { source: "w1", target: "r1", ethical: true },
      { source: "w2", target: "r2", ethical: true },
      { source: "w3", target: "r3", ethical: false },
      { source: "w4", target: "r4", ethical: true },
      { source: "w5", target: "r5", ethical: true },
    ],
    isMockData: true,
  };
};
