import { useState, useEffect } from "react";
import {
  ArrowPathIcon,
  BeakerIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

// Interface for the ML status props
interface MachineLearningStatusProps {
  isVisible?: boolean;
}

// Interface for ML model data
interface MLModelStatus {
  name: string;
  status: "training" | "ready" | "error";
  accuracy: number;
  lastUpdated: string;
  predictionCount: number;
}

const MachineLearningStatus: React.FC<MachineLearningStatusProps> = ({
  isVisible = true,
}) => {
  const [expanded, setExpanded] = useState(false);
  const [models, setModels] = useState<MLModelStatus[]>([
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
  ]);

  const [systemStatus, setSystemStatus] = useState({
    apiHealth: true,
    dataIngestion: true,
    mlPipeline: true,
    lastChecked: new Date().toLocaleTimeString(),
  });

  // Simulate real-time updates to models and system status
  useEffect(() => {
    const interval = setInterval(() => {
      // Update model status
      setModels((prevModels) => {
        return prevModels.map((model) => {
          // Randomly update training models
          if (model.status === "training") {
            const newAccuracy = Math.min(
              0.99,
              model.accuracy + Math.random() * 0.05
            );
            return {
              ...model,
              accuracy: Number(newAccuracy.toFixed(2)),
              lastUpdated: "in progress",
            };
          }

          // Occasionally increment prediction counts for ready models
          if (model.status === "ready" && Math.random() > 0.7) {
            return {
              ...model,
              predictionCount:
                model.predictionCount + Math.floor(Math.random() * 5),
            };
          }

          return model;
        });
      });

      // Simulate API health check
      if (Math.random() > 0.95) {
        setSystemStatus((prev) => ({
          ...prev,
          apiHealth: !prev.apiHealth,
          lastChecked: new Date().toLocaleTimeString(),
        }));
      }

      // Update data ingestion status
      if (Math.random() > 0.97) {
        setSystemStatus((prev) => ({
          ...prev,
          dataIngestion: !prev.dataIngestion,
          lastChecked: new Date().toLocaleTimeString(),
        }));
      }

      // Update ML pipeline status
      if (Math.random() > 0.98) {
        setSystemStatus((prev) => ({
          ...prev,
          mlPipeline: !prev.mlPipeline,
          lastChecked: new Date().toLocaleTimeString(),
        }));
      }
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Occasionally simulate finishing training
  useEffect(() => {
    const trainingCheck = setInterval(() => {
      const trainingModels = models.filter(
        (model) => model.status === "training"
      );

      if (trainingModels.length > 0 && Math.random() > 0.85) {
        const modelIndex = models.findIndex(
          (model) => model.status === "training"
        );

        if (modelIndex !== -1) {
          setModels((prevModels) => {
            const updatedModels = [...prevModels];
            updatedModels[modelIndex] = {
              ...updatedModels[modelIndex],
              status: "ready",
              lastUpdated: "just now",
            };
            return updatedModels;
          });
        }
      }
    }, 10000);

    return () => clearInterval(trainingCheck);
  }, [models]);

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
        </div>
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

      {expanded && (
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            {models.map((model) => (
              <div
                key={model.name}
                className="border rounded-lg p-3 bg-gray-50"
              >
                <div className="flex justify-between items-start">
                  <h4 className="font-medium text-gray-800">{model.name}</h4>
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
            <h4 className="font-medium text-gray-700 mb-2">System Status</h4>
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
                    systemStatus.dataIngestion ? "bg-green-500" : "bg-red-500"
                  }`}
                ></div>
                <span className="text-sm text-gray-600">Data Ingestion</span>
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
        </div>
      )}
    </div>
  );
};

export default MachineLearningStatus;
