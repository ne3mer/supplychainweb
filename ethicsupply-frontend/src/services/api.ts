import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

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
  name: string;
  country: string;
  co2_emissions: number;
  delivery_efficiency: number;
  wage_fairness: number;
  human_rights_index: number;
  waste_management_score: number;
}

export interface EvaluationResult {
  id: number;
  name: string;
  ethical_score: number;
  recommendation?: string;
  suggestions: string[];
  isMockData?: boolean;
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
    name: "EcoTech Solutions",
    country: "United States",
    co2_emissions: 28.5,
    delivery_efficiency: 0.85,
    wage_fairness: 0.92,
    human_rights_index: 0.88,
    waste_management_score: 0.76,
    ethical_score: 87.4,
    created_at: "2023-09-15T10:30:00Z",
    updated_at: "2023-12-05T14:45:00Z",
  },
  {
    id: 2,
    name: "Global Manufacturing Ltd",
    country: "China",
    co2_emissions: 65.2,
    delivery_efficiency: 0.72,
    wage_fairness: 0.58,
    human_rights_index: 0.45,
    waste_management_score: 0.52,
    ethical_score: 59.8,
    created_at: "2023-08-20T08:15:00Z",
    updated_at: "2023-11-18T11:30:00Z",
  },
  {
    id: 3,
    name: "Precision Parts GmbH",
    country: "Germany",
    co2_emissions: 32.7,
    delivery_efficiency: 0.91,
    wage_fairness: 0.88,
    human_rights_index: 0.82,
    waste_management_score: 0.79,
    ethical_score: 83.2,
    created_at: "2023-07-10T09:20:00Z",
    updated_at: "2023-10-25T16:40:00Z",
  },
  {
    id: 4,
    name: "Tech Components Inc",
    country: "Japan",
    co2_emissions: 24.6,
    delivery_efficiency: 0.89,
    wage_fairness: 0.87,
    human_rights_index: 0.86,
    waste_management_score: 0.82,
    ethical_score: 88.7,
    created_at: "2023-09-05T11:45:00Z",
    updated_at: "2023-12-01T13:20:00Z",
  },
  {
    id: 5,
    name: "Textile Exports Ltd",
    country: "India",
    co2_emissions: 48.3,
    delivery_efficiency: 0.68,
    wage_fairness: 0.52,
    human_rights_index: 0.48,
    waste_management_score: 0.44,
    ethical_score: 51.9,
    created_at: "2023-06-18T07:30:00Z",
    updated_at: "2023-11-10T10:15:00Z",
  },
  {
    id: 6,
    name: "Sustainable Materials Co",
    country: "Brazil",
    co2_emissions: 21.8,
    delivery_efficiency: 0.76,
    wage_fairness: 0.71,
    human_rights_index: 0.75,
    waste_management_score: 0.84,
    ethical_score: 78.5,
    created_at: "2023-08-12T13:10:00Z",
    updated_at: "2023-11-27T09:50:00Z",
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
        console.warn(
          `Suppliers API returned status ${response.status}. Using mock data.`
        );
        return mockSuppliers.map((supplier) => ({
          ...supplier,
          isMockData: true,
        }));
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

    if (allSuppliers.length > 0) {
      return allSuppliers;
    }

    // Only if the API returns empty data, use mock data
    console.warn("API returned empty data. Using mock data.");
    return mockSuppliers.map((supplier) => ({
      ...supplier,
      isMockData: true,
    }));
  } catch (error) {
    console.error("Error fetching suppliers:", error);
    // Return mock data if the API endpoint errors out
    return mockSuppliers.map((supplier) => ({
      ...supplier,
      isMockData: true,
    }));
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
  return {
    id: Math.floor(Math.random() * 1000) + 100,
    name: supplierData.name,
    ethical_score: calculateMockScore(supplierData),
    recommendation: generateMockRecommendation(supplierData),
    suggestions: generateMockSuggestions(supplierData),
    isMockData: true,
  };
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
    console.log(
      "Fetching dashboard data from API:",
      `${API_BASE_URL}/dashboard/`
    );
    const response = await fetch(`${API_BASE_URL}/dashboard/`);

    if (!response.ok) {
      console.warn(
        `Dashboard API returned status ${response.status}. Using mock data.`
      );
      return getMockDashboardData();
    }

    const data = await response.json();
    console.log("Dashboard API response:", data);

    // Handle potential paginated response
    if (data && typeof data === "object") {
      // Check if it's a paginated response
      if (data.results && typeof data.results === "object") {
        console.log("Using paginated API results for dashboard");
        return data.results;
      }

      // If it's a regular object (not paginated), just use it directly
      if (!Array.isArray(data)) {
        console.log("Using direct API results for dashboard");
        return data;
      }
    }

    // If we get here, the API didn't return usable data
    console.warn(
      "API returned unexpected dashboard data format. Using mock data."
    );
    return getMockDashboardData();
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    // Return mock data in case of error
    return getMockDashboardData();
  }
};

// Extract mock dashboard data to a function for reuse
const getMockDashboardData = (): DashboardData => {
  return {
    total_suppliers: 42,
    avg_ethical_score: 73.5,
    avg_co2_emissions: 35.8,
    suppliers_by_country: {
      "United States": 12,
      China: 8,
      Germany: 6,
      Japan: 5,
      India: 4,
      Brazil: 3,
      Other: 4,
    },
    ethical_score_distribution: [
      { range: "0-20", count: 2 },
      { range: "21-40", count: 5 },
      { range: "41-60", count: 8 },
      { range: "61-80", count: 15 },
      { range: "81-100", count: 12 },
    ],
    co2_emissions_by_industry: [
      { name: "Manufacturing", value: 35 },
      { name: "Technology", value: 20 },
      { name: "Retail", value: 15 },
      { name: "Agriculture", value: 30 },
    ],
    isMockData: true,
  };
};

// Helper functions for mock data generation
function calculateMockScore(data: any): number {
  // Calculate a weighted score based on the supplier data
  const laborWeight = 0.25;
  const environmentalWeight = 0.3;
  const socialWeight = 0.25;
  const co2Weight = 0.2;

  let score = 0;

  if (data.wage_fairness !== undefined) {
    score += data.wage_fairness * 100 * laborWeight;
  }

  if (data.human_rights_index !== undefined) {
    score += data.human_rights_index * 100 * socialWeight;
  }

  if (data.waste_management_score !== undefined) {
    score += data.waste_management_score * 100 * environmentalWeight;
  }

  if (data.co2_emissions !== undefined) {
    // Inverse relationship - lower emissions mean higher score
    const co2Score = Math.max(0, 100 - data.co2_emissions);
    score += co2Score * co2Weight;
  }

  return parseFloat(score.toFixed(1));
}

function generateMockRecommendation(data: any): string {
  const score = data.ethical_score || calculateMockScore(data);

  if (score >= 80) {
    return "This supplier demonstrates excellent ethical practices and should be prioritized for future partnerships. Consider highlighting this supplier in sustainability reports.";
  } else if (score >= 65) {
    return "This supplier meets most ethical standards but has room for improvement. Maintain the partnership while encouraging enhancements in weaker areas.";
  } else if (score >= 50) {
    return "This supplier shows moderate ethical performance. Consider requesting improvements in key areas before expanding business relationships.";
  } else {
    return "This supplier falls below acceptable ethical standards. It is recommended to find alternative suppliers or require significant improvements before continuing the partnership.";
  }
}

function generateMockSuggestions(data: any): string[] {
  const suggestions = [];

  if (data.wage_fairness < 0.7) {
    suggestions.push(
      "Implement fair wage policies that align with international standards"
    );
  }

  if (data.human_rights_index < 0.7) {
    suggestions.push(
      "Improve human rights compliance through worker protections and anti-discrimination policies"
    );
  }

  if (data.waste_management_score < 0.7) {
    suggestions.push(
      "Develop more effective waste management systems to reduce environmental impact"
    );
  }

  if (data.co2_emissions > 40) {
    suggestions.push(
      "Invest in renewable energy sources to reduce carbon footprint"
    );
  }

  if (data.delivery_efficiency < 0.7) {
    suggestions.push(
      "Optimize logistics operations to improve delivery efficiency and reduce emissions"
    );
  }

  if (suggestions.length === 0) {
    suggestions.push(
      "Continue to maintain high ethical standards and consider implementing advanced sustainability reporting"
    );
  }

  return suggestions;
}

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
