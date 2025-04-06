import { API_BASE_URL } from "../config";

// Define the dashboard data interface
export interface DashboardData {
  total_suppliers: number;
  avg_ethical_score: number;
  avg_co2_emissions: number;
  suppliers_by_country: Record<string, number>;
  ethical_score_distribution: Array<{ range: string; count: number }>;
  co2_emissions_by_industry: Array<{ name: string; value: number }>;
  isMockData?: boolean;
}

/**
 * Fetches dashboard data from the API
 * Falls back to mock data if the API request fails
 */
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

/**
 * Checks if the API is connected and responding
 */
export const checkApiConnection = async (): Promise<boolean> => {
  try {
    console.log("Checking API connection...");
    const response = await fetch(`${API_BASE_URL}/health-check/`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.ok;
  } catch (error) {
    console.error("API connection check failed:", error);
    return false;
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
