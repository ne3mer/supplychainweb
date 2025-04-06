import { useState, useEffect } from "react";
import {
  GlobeAltIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  getSupplyChainGraphData,
  GraphNode,
  GraphLink,
  GraphData,
} from "../services/api";

// Simple custom graph implementation to avoid library compatibility issues
const SupplyChainGraph = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterEthicalScore, setFilterEthicalScore] = useState<number>(0);
  const [showEthicalPathsOnly, setShowEthicalPathsOnly] =
    useState<boolean>(false);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSupplyChainGraphData();
        setGraphData(data);
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

  // Function to compute if a full chain is ethical
  const isFullChainEthical = (nodeId: string): boolean => {
    // For a retailer, check if all connections back to raw materials are ethical
    const node = graphData.nodes.find((n) => n.id === nodeId);
    if (!node) return false;

    // If this is a raw material, it's the start of the chain
    if (node.type === "rawMaterial") return true;

    // Get all incoming links
    const incomingLinks = graphData.links.filter(
      (link) => link.target === nodeId
    );

    // If no incoming links, or any aren't ethical, the chain isn't fully ethical
    if (incomingLinks.length === 0) return false;
    if (incomingLinks.some((link) => link.ethical === false)) return false;

    // Check all sources recursively
    return incomingLinks.every((link) =>
      isFullChainEthical(
        typeof link.source === "string" ? link.source : link.source.toString()
      )
    );
  };

  // Filter nodes based on ethical score
  const getFilteredGraphData = () => {
    if (filterEthicalScore === 0 && !showEthicalPathsOnly) {
      return graphData;
    }

    // Filter nodes based on ethical score threshold
    const filteredNodes = graphData.nodes.filter(
      (node) => (node.ethical_score || 0) >= filterEthicalScore
    );

    // Get IDs of filtered nodes
    const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));

    // Filter links to only include connections between filtered nodes
    let filteredLinks = graphData.links.filter((link) => {
      const sourceId =
        typeof link.source === "object" ? link.source.id : link.source;
      const targetId =
        typeof link.target === "object" ? link.target.id : link.target;
      return filteredNodeIds.has(sourceId) && filteredNodeIds.has(targetId);
    });

    // If showing only ethical paths, filter further
    if (showEthicalPathsOnly) {
      filteredLinks = filteredLinks.filter((link) => link.ethical);
    }

    return {
      nodes: filteredNodes,
      links: filteredLinks,
    };
  };

  // Node color based on type and ethical score
  const getNodeColor = (node) => {
    // Base color on node type
    const baseColors = {
      rawMaterial: "#8B5CF6", // Purple
      supplier: "#3B82F6", // Blue
      manufacturer: "#10B981", // Green
      wholesaler: "#F59E0B", // Amber
      distributor: "#6366F1", // Indigo
      retailer: "#EC4899", // Pink
    };

    // Adjust color based on ethical score
    const score = node.ethical_score || 50;
    const ethicalColor =
      score >= 70
        ? "#059669" // Green for high score
        : score >= 50
        ? "#D97706" // Amber for medium
        : "#DC2626"; // Red for low score

    // Return base color for different node types, with ethical tint for suppliers and manufacturers
    return node.type === "supplier" || node.type === "manufacturer"
      ? ethicalColor
      : baseColors[node.type] || "#9CA3AF";
  };

  // Link color based on ethical status
  const getLinkColor = (link) => {
    return link.ethical ? "#059669" : "#DC2626";
  };

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

        <div className="flex flex-wrap space-x-2 mt-4 md:mt-0">
          {/* Ethical score filter */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Min. Ethical Score
            </label>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={filterEthicalScore}
              onChange={(e) =>
                setFilterEthicalScore(parseInt(e.target.value, 10))
              }
              className="w-32 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <span className="ml-2 text-sm text-gray-600">
              {filterEthicalScore}
            </span>
          </div>

          {/* Toggle ethical paths only */}
          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Ethical Paths Only
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                checked={showEthicalPathsOnly}
                onChange={() => setShowEthicalPathsOnly(!showEthicalPathsOnly)}
                className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
              />
              <span className="ml-2 text-sm text-gray-600">
                Show only ethical connections
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-sm font-medium text-gray-700 mb-2">Legend</h2>
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
            <span className="text-xs">Raw Material</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
            <span className="text-xs">Supplier</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
            <span className="text-xs">Manufacturer</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
            <span className="text-xs">Wholesaler</span>
          </div>
          <div className="flex items-center">
            <span className="w-3 h-3 rounded-full bg-pink-500 mr-1"></span>
            <span className="text-xs">Retailer</span>
          </div>
          <div className="border-l border-gray-300 pl-2 flex items-center">
            <span className="w-6 h-1 bg-green-600 mr-1"></span>
            <span className="text-xs">Ethical Link</span>
          </div>
          <div className="flex items-center">
            <span className="w-6 h-1 bg-red-600 mr-1"></span>
            <span className="text-xs">Non-ethical Link</span>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
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
              onClick={() => window.location.reload()}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              <ArrowPathIcon className="h-4 w-4 mr-2" />
              Retry
            </button>
          </div>
        ) : (
          <div className="relative" style={{ height: "70vh" }}>
            {getFilteredGraphData().nodes.length > 0 ? (
              <div className="p-12 text-center">
                <p className="text-gray-600">
                  Graph visualization is temporarily unavailable due to library
                  compatibility issues.
                </p>
                <p className="text-gray-600 mt-2">
                  The API is connected and has {graphData.nodes.length} nodes
                  and {graphData.links.length} connections.
                </p>
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                  <h3 className="text-lg font-medium mb-3">
                    Supply Chain Data:
                  </h3>
                  <div className="text-left overflow-y-auto max-h-96 p-4 bg-white rounded border">
                    <h4 className="font-medium mb-2">Node Types:</h4>
                    <ul className="list-disc pl-5 mb-4">
                      {Array.from(
                        new Set(graphData.nodes.map((node) => node.type))
                      ).map((type) => (
                        <li key={type}>
                          {type}:{" "}
                          {
                            graphData.nodes.filter((node) => node.type === type)
                              .length
                          }{" "}
                          nodes
                        </li>
                      ))}
                    </ul>
                    <h4 className="font-medium mb-2">Ethical Status:</h4>
                    <ul className="list-disc pl-5">
                      <li>
                        Ethical links:{" "}
                        {graphData.links.filter((link) => link.ethical).length}
                      </li>
                      <li>
                        Non-ethical links:{" "}
                        {graphData.links.filter((link) => !link.ethical).length}
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full">
                <p className="text-gray-500">
                  No nodes match the current filters.
                </p>
              </div>
            )}

            {/* Selected node info panel */}
            {selectedNode && (
              <div className="absolute top-4 right-4 w-72 bg-white p-4 rounded-lg shadow-lg border border-gray-200">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="text-lg font-semibold">{selectedNode.name}</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <span className="sr-only">Close</span>
                    &times;
                  </button>
                </div>
                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">Type:</span>{" "}
                    <span className="capitalize">{selectedNode.type}</span>
                  </p>
                  <p>
                    <span className="font-medium">Country:</span>{" "}
                    {selectedNode.country}
                  </p>
                  <p>
                    <span className="font-medium">Ethical Score:</span>{" "}
                    {selectedNode.ethical_score}
                  </p>
                  {selectedNode.type === "supplier" && (
                    <p>
                      <span className="font-medium">Is Ethical Chain:</span>{" "}
                      {isFullChainEthical(selectedNode.id) ? "Yes" : "No"}
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyChainGraph;
