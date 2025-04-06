import { useState, useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph";
import {
  GlobeAltIcon,
  ArrowPathIcon,
  ChevronDownIcon,
  InformationCircleIcon,
  FilterIcon,
  ScaleIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import {
  getSupplyChainGraphData,
  GraphNode,
  GraphLink,
  GraphData,
} from "../services/api";

const SupplyChainGraph = () => {
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
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
      isFullChainEthical(link.source as string)
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
    let filteredLinks = graphData.links.filter(
      (link) =>
        filteredNodeIds.has(link.source as string) &&
        filteredNodeIds.has(link.target as string)
    );

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
            <ForceGraph2D
              graphData={getFilteredGraphData()}
              nodeLabel={(node) =>
                `${node.name}\nType: ${node.type}\nCountry: ${node.country}\nEthical Score: ${node.ethical_score}`
              }
              nodeColor={getNodeColor}
              linkColor={getLinkColor}
              linkWidth={2}
              nodeRelSize={6}
              onNodeClick={(node) => setSelectedNode(node)}
              cooldownTicks={100}
              onEngineStop={() => {}}
            />

            {/* Node details panel */}
            {selectedNode && (
              <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow-lg w-80">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{selectedNode.name}</h3>
                  <button
                    onClick={() => setSelectedNode(null)}
                    className="text-gray-400 hover:text-gray-500"
                  >
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-3">
                  <p className="text-sm">
                    <span className="font-medium">Type:</span>{" "}
                    {selectedNode.type}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Country:</span>{" "}
                    {selectedNode.country}
                  </p>
                  <p className="text-sm">
                    <span className="font-medium">Ethical Score:</span>{" "}
                    <span
                      className={
                        (selectedNode.ethical_score || 0) >= 70
                          ? "text-green-600"
                          : (selectedNode.ethical_score || 0) >= 50
                          ? "text-amber-600"
                          : "text-red-600"
                      }
                    >
                      {selectedNode.ethical_score || "N/A"}
                    </span>
                  </p>
                </div>

                <div className="mt-2 pt-2 border-t border-gray-200">
                  <p className="text-sm font-medium">Supply Chain Status:</p>
                  <div className="mt-1 flex items-center">
                    <div
                      className={`w-3 h-3 rounded-full mr-2 ${
                        isFullChainEthical(selectedNode.id)
                          ? "bg-green-500"
                          : "bg-red-500"
                      }`}
                    ></div>
                    <p className="text-sm">
                      {isFullChainEthical(selectedNode.id)
                        ? "Full ethical supply chain"
                        : "Contains non-ethical links"}
                    </p>
                  </div>
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
