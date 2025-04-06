import { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  BeakerIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
  ServerIcon,
} from "@heroicons/react/24/outline";
import {
  getMLStatus,
  MLModelStatus,
  MLSystemStatus,
  MLStatus,
  checkApiConnection,
} from "../services/api";

// Interface for the ML status props
interface MachineLearningStatusProps {
  isVisible?: boolean;
}

const MachineLearningStatus: React.FC<MachineLearningStatusProps> = ({
  isVisible = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [models, setModels] = useState<MLModelStatus[]>([]);
  const [systemStatus, setSystemStatus] = useState<MLSystemStatus>({
    apiHealth: true,
    dataIngestion: true,
    mlPipeline: true,
    lastChecked: new Date().toLocaleTimeString(),
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // seconds
  const [lastRefreshed, setLastRefreshed] = useState<string>(
    new Date().toLocaleTimeString()
  );
  const [usingMockData, setUsingMockData] = useState(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  // Check if API is connected
  const checkConnection = async () => {
    const isConnected = await checkApiConnection();
    setApiConnected(isConnected);
    return isConnected;
  };

  // Enhanced fetch ML status with connection check
  const fetchMLStatus = async () => {
    try {
      setLoading(true);
      setError(null);

      // First check connection
      const isConnected = await checkConnection();
      if (!isConnected) {
        setError(
          "Cannot connect to backend server. Please ensure the server is running."
        );
        // Let user manually choose to use mock data
        return;
      }

      const mlStatus = await getMLStatus();
      setModels(mlStatus.models);
      setSystemStatus(mlStatus.systemStatus);
      setLastRefreshed(new Date().toLocaleTimeString());
      setUsingMockData(!!mlStatus.isMockData);

      // If using mock data due to API error, show a specific error
      if (mlStatus.isMockData) {
        setError(
          "The ML Status API returned an error. Using mock data instead."
        );
      }
    } catch (error) {
      console.error("Error fetching ML status:", error);
      setError(
        "Failed to connect to ML API. Please ensure the backend server is running."
      );
      // Don't automatically fall back to mock data
      setUsingMockData(false);
    } finally {
      setLoading(false);
    }
  };

  // Initial data fetch
  useEffect(() => {
    fetchMLStatus();
  }, []);

  // Set up auto-refresh on interval
  useEffect(() => {
    const intervalId = setInterval(() => {
      fetchMLStatus();
    }, refreshInterval * 1000);

    return () => clearInterval(intervalId);
  }, [refreshInterval]);

  // Handle manual refresh
  const handleRefresh = () => {
    fetchMLStatus();
  };

  // Change refresh interval
  const handleIntervalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setRefreshInterval(Number(e.target.value));
  };

  if (!isVisible) return null;

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div
        className="px-4 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex justify-between items-center cursor-pointer"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex items-center">
          <BeakerIcon className="h-5 w-5 mr-2" />
          <h3 className="font-medium">Machine Learning Pipeline Status</h3>
          {loading && <ArrowPathIcon className="h-4 w-4 ml-2 animate-spin" />}
          {apiConnected !== null && (
            <div className="ml-2 flex items-center">
              <div
                className={`h-2 w-2 rounded-full mr-1 ${
                  apiConnected ? "bg-green-400" : "bg-red-400"
                }`}
              ></div>
              <span className="text-xs">
                {apiConnected ? "Connected" : "Disconnected"}
              </span>
            </div>
          )}
        </div>
        <div className="flex items-center">
          {usingMockData && (
            <span className="text-xs bg-yellow-200 text-yellow-800 px-2 py-0.5 rounded mr-2">
              Demo Data
            </span>
          )}
          <span className="text-xs mr-3 opacity-75">
            Last updated: {lastRefreshed}
          </span>
          <button
            className="text-white focus:outline-none p-1 hover:bg-white hover:bg-opacity-10 rounded-full mr-2"
            onClick={(e) => {
              e.stopPropagation();
              handleRefresh();
            }}
            title="Refresh data"
          >
            <ArrowPathIcon className="h-4 w-4" />
          </button>
          <button className="text-white focus:outline-none">
            {expanded ? (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 15l7-7 7 7"
                />
              </svg>
            ) : (
              <svg
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            )}
          </button>
        </div>
      </div>

      {expanded && (
        <div className="p-4">
          {error ? (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
                </div>
                <div className="ml-3 flex-grow">
                  <p className="text-sm text-red-700">{error}</p>
                  <div className="mt-2 flex justify-between">
                    <button
                      className="px-3 py-1 text-xs bg-red-100 text-red-800 rounded-md hover:bg-red-200"
                      onClick={handleRefresh}
                    >
                      Try Again
                    </button>

                    <button
                      className="px-3 py-1 text-xs bg-blue-100 text-blue-800 rounded-md hover:bg-blue-200"
                      onClick={() => {
                        // Use mock data as fallback
                        const mockData = {
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

                        setModels(mockData.models);
                        setSystemStatus(mockData.systemStatus);
                        setUsingMockData(true);
                        setError(null);
                        setLastRefreshed(new Date().toLocaleTimeString());
                      }}
                    >
                      Use Demo Data
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ) : loading && models.length === 0 ? (
            <div className="flex justify-center items-center py-8">
              <ArrowPathIcon className="h-8 w-8 text-indigo-500 animate-spin" />
              <span className="ml-2 text-gray-600">
                Loading ML pipeline data...
              </span>
            </div>
          ) : (
            <>
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium text-gray-700">ML Models</h4>
                <div className="flex items-center space-x-2">
                  <label className="text-sm text-gray-600">
                    Refresh every:
                  </label>
                  <select
                    value={refreshInterval}
                    onChange={handleIntervalChange}
                    className="text-sm border rounded-md px-2 py-1"
                  >
                    <option value="10">10s</option>
                    <option value="30">30s</option>
                    <option value="60">1m</option>
                    <option value="300">5m</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                {models.map((model) => (
                  <div
                    key={model.name}
                    className="border rounded-lg p-3 bg-gray-50"
                  >
                    <div className="flex justify-between items-start">
                      <h4 className="font-medium text-gray-800">
                        {model.name}
                      </h4>
                      {model.status === "training" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          <ArrowPathIcon className="h-3 w-3 mr-1 animate-spin" />
                          Training
                        </span>
                      ) : model.status === "ready" ? (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800">
                          <CheckCircleIcon className="h-3 w-3 mr-1" />
                          Ready
                        </span>
                      ) : (
                        <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-red-100 text-red-800">
                          <ExclamationCircleIcon className="h-3 w-3 mr-1" />
                          Error
                        </span>
                      )}
                    </div>

                    <div className="mt-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-500">Accuracy:</span>
                        <span className="font-medium">
                          {(model.accuracy * 100).toFixed(1)}%
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                        <div
                          className={`h-2 rounded-full ${
                            model.accuracy > 0.9
                              ? "bg-green-500"
                              : model.accuracy > 0.8
                              ? "bg-emerald-500"
                              : model.accuracy > 0.7
                              ? "bg-yellow-500"
                              : "bg-orange-500"
                          }`}
                          style={{ width: `${model.accuracy * 100}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="mt-3 flex justify-between text-xs text-gray-500">
                      <span>Updated: {model.lastUpdated}</span>
                      <span>{model.predictionCount} predictions</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-3">
                <h4 className="font-medium text-gray-700 mb-2">
                  System Status
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${
                        systemStatus.apiHealth ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600">API Health</span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${
                        systemStatus.dataIngestion
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600">
                      Data Ingestion
                    </span>
                  </div>
                  <div className="flex items-center">
                    <div
                      className={`h-3 w-3 rounded-full mr-2 ${
                        systemStatus.mlPipeline ? "bg-green-500" : "bg-red-500"
                      }`}
                    ></div>
                    <span className="text-sm text-gray-600">ML Pipeline</span>
                  </div>
                </div>
                <div className="text-right text-xs text-gray-400 mt-2">
                  Last checked: {systemStatus.lastChecked}
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default MachineLearningStatus;
