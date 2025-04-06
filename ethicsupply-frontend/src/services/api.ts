import axios from "axios";

const API_BASE_URL = "http://localhost:8000/api";

export interface Supplier {
  id: number;
  name: string;
  country: string;
  co2_emissions: number;
  delivery_efficiency: number;
  wage_fairness: number;
  human_rights_index: number;
  waste_management_score: number;
  ethical_score: number | null;
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
    const response = await fetch(`${API_BASE_URL}/suppliers/`);

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
          return data.results;
        }
      }

      // Handle non-paginated response
      if (Array.isArray(data) && data.length > 0) {
        console.log("Using non-paginated API results");
        return data;
      }
    }

    // Only if the API returns an empty array, use mock data
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
