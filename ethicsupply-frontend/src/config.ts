// Configuration variables for the OptiEthic frontend application

/**
 * Base URL for API requests
 * In development, we use the local Django server
 * In production, this would be set to the deployed API endpoint
 */
export const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:8000/api";

/**
 * Feature flags to enable/disable certain features
 */
export const FEATURES = {
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === "true" || false, // When true, fallback to mock data if API fails
  ENABLE_ANALYTICS: true, // Analytics features
  ENABLE_ML_FEATURES: true, // Machine learning features
};

/**
 * Application-wide constants
 */
export const APP_CONSTANTS = {
  DEFAULT_PAGINATION_LIMIT: 10,
  CHART_COLORS: [
    "#10B981",
    "#3B82F6",
    "#8B5CF6",
    "#EC4899",
    "#F59E0B",
    "#EF4444",
  ],
  MAP_CENTER: [0, 20], // Default map center [lat, lng]
  MAP_ZOOM: 2, // Default map zoom level
};
