import { useState, useEffect } from "react";
import {
  GlobeAltIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import { getSupplyChainGraphData } from "../services/api";

const SupplyChainGraph = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSupplyChainGraphData();
        setUsingMockData(!!data.isMockData);
      } catch (err) {
        console.error("Error fetching supply chain graph data:", err);
        setError("Failed to load supply chain data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <GlobeAltIcon className="h-6 w-6 text-indigo-600 mr-2" />
            Supply Chain Relationship Graph
          </h1>
          <p className="text-gray-600 mt-1">
            Visualize supplier connections and trace materials through your
            supply chain
          </p>
          {usingMockData && (
            <p className="text-xs text-amber-600 mt-1 flex items-center">
              <InformationCircleIcon className="h-4 w-4 mr-1" />
              Using demonstration data. Connect to the API for real supply chain
              data.
            </p>
          )}
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow overflow-hidden p-8">
        {loading ? (
          <div className="p-12 text-center">
            <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading supply chain data...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-4 text-red-500">{error}</p>
            <button
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="text-center p-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              Graph Visualization
            </h2>
            <p className="text-gray-600 mb-6">
              The interactive supply chain graph is currently being upgraded.
              Please check back soon for the full visualization feature.
            </p>
            <p className="text-gray-500 text-sm">
              Supply chain data is available and ready to be visualized.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyChainGraph;
