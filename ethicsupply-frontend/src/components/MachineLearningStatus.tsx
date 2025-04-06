import React, { useState, useEffect } from "react";
import {
  CloudArrowUpIcon,
  SparklesIcon,
  ChartBarIcon,
  LightBulbIcon,
  ServerIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from "@heroicons/react/24/outline";
import { getMLStatus, MLStatus, MLModelStatus } from "../services/api";

interface MachineLearningStatusProps {
  isVisible?: boolean;
}

const MachineLearningStatus: React.FC<MachineLearningStatusProps> = ({
  isVisible = true,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [mlStatus, setMlStatus] = useState<MLStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchMlStatus = async () => {
      try {
        setLoading(true);
        const status = await getMLStatus();
        setMlStatus(status);
        setError(null);
      } catch (err) {
        console.error("Error fetching ML status:", err);
        setError("Failed to fetch ML status");
      } finally {
        setLoading(false);
      }
    };

    fetchMlStatus();
    // Refresh status every 60 seconds
    const interval = setInterval(fetchMlStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  if (!isVisible) return null;

  const renderModelStatus = (model: MLModelStatus) => {
    const statusClass =
      model.status === "ready"
        ? "bg-green-100 text-green-800"
        : model.status === "training"
        ? "bg-yellow-100 text-yellow-800"
        : "bg-red-100 text-red-800";

    return (
      <div key={model.name} className="bg-white bg-opacity-10 p-4 rounded-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <SparklesIcon className="h-5 w-5 text-indigo-200" />
            <h4 className="ml-2 text-sm font-medium text-white">
              {model.name}
            </h4>
          </div>
          <span className={`text-xs px-2 py-1 rounded-full ${statusClass}`}>
            {model.status}
          </span>
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 text-xs text-indigo-100">
          <div>Accuracy: {(model.accuracy * 100).toFixed(1)}%</div>
          <div>Predictions: {model.predictionCount}</div>
          <div className="col-span-2">Updated: {model.lastUpdated}</div>
        </div>
      </div>
    );
  };

  const renderSystemStatus = () => {
    if (!mlStatus?.systemStatus) return null;

    const { apiHealth, dataIngestion, mlPipeline, lastChecked } =
      mlStatus.systemStatus;

    return (
      <div className="bg-white bg-opacity-10 p-4 rounded-lg col-span-1 sm:col-span-3">
        <div className="flex items-center mb-2">
          <ServerIcon className="h-5 w-5 text-indigo-200" />
          <h4 className="ml-2 text-sm font-medium text-white">System Status</h4>
          <span className="ml-2 text-xs text-indigo-100">
            Last checked: {lastChecked}
          </span>
        </div>
        <div className="grid grid-cols-3 gap-2">
          <div className="flex items-center">
            {apiHealth ? (
              <CheckCircleIcon className="h-4 w-4 text-green-400" />
            ) : (
              <ExclamationCircleIcon className="h-4 w-4 text-red-400" />
            )}
            <span className="ml-1 text-xs text-indigo-100">API Health</span>
          </div>
          <div className="flex items-center">
            {dataIngestion ? (
              <CheckCircleIcon className="h-4 w-4 text-green-400" />
            ) : (
              <ExclamationCircleIcon className="h-4 w-4 text-red-400" />
            )}
            <span className="ml-1 text-xs text-indigo-100">Data Ingestion</span>
          </div>
          <div className="flex items-center">
            {mlPipeline ? (
              <CheckCircleIcon className="h-4 w-4 text-green-400" />
            ) : (
              <ExclamationCircleIcon className="h-4 w-4 text-red-400" />
            )}
            <span className="ml-1 text-xs text-indigo-100">ML Pipeline</span>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-700 rounded-lg shadow-md overflow-hidden">
      <div className="p-4 sm:p-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div className="flex items-center">
            <div className="flex-shrink-0 bg-white bg-opacity-20 p-2 rounded-lg">
              <SparklesIcon className="h-6 w-6 text-white" />
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium text-white">
                AI-Powered Insights
              </h3>
              <p className="text-indigo-100">
                {loading
                  ? "Loading ML system status..."
                  : mlStatus?.isMockData
                  ? "Using demo ML data - connect to API for live status"
                  : "Live ML system status - All models operational"}
              </p>
            </div>
          </div>
          <div className="mt-4 md:mt-0">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium bg-white text-indigo-700 hover:bg-indigo-50"
            >
              {showDetails ? "Hide Details" : "View Status"}
            </button>
          </div>
        </div>

        {showDetails && (
          <div className="mt-6">
            {loading ? (
              <div className="p-4 text-center text-indigo-100">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                <p>Loading ML system status...</p>
              </div>
            ) : error ? (
              <div className="bg-red-800 bg-opacity-30 p-4 rounded-lg text-center">
                <ExclamationCircleIcon className="h-8 w-8 text-red-300 mx-auto mb-2" />
                <p className="text-red-200">{error}</p>
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-4">
                  {mlStatus?.models?.map((model) => renderModelStatus(model))}
                </div>
                <div className="grid grid-cols-1 gap-4">
                  {renderSystemStatus()}
                </div>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MachineLearningStatus;
