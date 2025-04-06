import { useState, useEffect, useRef } from "react";
import ForceGraph2D from "react-force-graph-2d";
import {
  GlobeAltIcon,
  ArrowPathIcon,
  InformationCircleIcon,
  ExclamationTriangleIcon,
  AdjustmentsHorizontalIcon,
} from "@heroicons/react/24/outline";
import { getSupplyChainGraphData } from "../services/api";

// Define data types for the graph
interface GraphNode {
  id: string;
  name: string;
  type: string;
  industry?: string;
  country?: string;
  ethical_score?: number;
  val?: number;
  color?: string;
}

interface GraphLink {
  source: string;
  target: string;
  type: string;
  strength?: number;
  distance?: number;
  color?: string;
}

interface GraphData {
  nodes: GraphNode[];
  links: GraphLink[];
  isMockData?: boolean;
}

// Supply Chain Graph Component with ForceGraph2D visualization
const SupplyChainGraph = () => {
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [graphData, setGraphData] = useState<GraphData>({
    nodes: [],
    links: [],
  });
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  const [highlightNodes, setHighlightNodes] = useState<Set<string>>(new Set());
  const [highlightLinks, setHighlightLinks] = useState<Set<string>>(new Set());
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [filterByType, setFilterByType] = useState<string | null>(null);

  const graphRef = useRef<any>();

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

  // Process node selection
  const handleNodeClick = (node: GraphNode) => {
    setSelectedNode(node === selectedNode ? null : node);

    if (node === selectedNode) {
      setHighlightNodes(new Set());
      setHighlightLinks(new Set());
      return;
    }

    // Get connected nodes/links
    const connectedNodes = new Set<string>([node.id]);
    const connectedLinks = new Set<string>();

    graphData.links.forEach((link) => {
      if (link.source === node.id || link.target === node.id) {
        const targetId =
          typeof link.target === "object"
            ? (link.target as any).id
            : link.target;
        const sourceId =
          typeof link.source === "object"
            ? (link.source as any).id
            : link.source;

        connectedNodes.add(targetId);
        connectedNodes.add(sourceId);
        connectedLinks.add(`${sourceId}-${targetId}`);
      }
    });

    setHighlightNodes(connectedNodes);
    setHighlightLinks(connectedLinks);
  };

  // Filter nodes by type
  const getFilteredData = () => {
    if (!filterByType) return graphData;

    const filteredNodes = graphData.nodes.filter(
      (node) => node.type === filterByType || node.industry === filterByType
    );

    const nodeIds = new Set(filteredNodes.map((n) => n.id));

    const filteredLinks = graphData.links.filter((link) => {
      const sourceId =
        typeof link.source === "object" ? (link.source as any).id : link.source;
      const targetId =
        typeof link.target === "object" ? (link.target as any).id : link.target;

      return nodeIds.has(sourceId) && nodeIds.has(targetId);
    });

    return {
      nodes: filteredNodes,
      links: filteredLinks,
    };
  };

  // Component rendering
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

        {!loading && !error && graphData.nodes.length > 0 && (
          <div className="mt-4 md:mt-0 flex space-x-2">
            <select
              className="rounded border border-gray-300 py-1 px-3 text-sm"
              value={filterByType || ""}
              onChange={(e) => setFilterByType(e.target.value || null)}
            >
              <option value="">All Nodes</option>
              <option value="supplier">Suppliers</option>
              <option value="material">Materials</option>
              <option value="electronics">Electronics Industry</option>
              <option value="automotive">Automotive Industry</option>
              <option value="textile">Textile Industry</option>
              <option value="food">Food Industry</option>
            </select>

            <button
              className="flex items-center text-sm px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded"
              onClick={() => {
                setFilterByType(null);
                setSelectedNode(null);
                setHighlightNodes(new Set());
                setHighlightLinks(new Set());

                // Center the graph
                if (graphRef.current) {
                  graphRef.current.zoomToFit(400);
                }
              }}
            >
              <AdjustmentsHorizontalIcon className="h-4 w-4 mr-1" />
              Reset
            </button>
          </div>
        )}
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
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
              onClick={() => window.location.reload()}
            >
              Try Again
            </button>
          </div>
        ) : graphData.nodes.length > 0 ? (
          <div className="relative">
            {/* Force Graph */}
            <div className="h-[700px] w-full">
              <ForceGraph2D
                ref={graphRef}
                graphData={getFilteredData()}
                nodeLabel={(node: GraphNode) => `${node.name} (${node.type})`}
                nodeColor={(node: GraphNode) => {
                  if (highlightNodes.size > 0) {
                    return highlightNodes.has(node.id)
                      ? node.color || "#4f46e5"
                      : "#ddd";
                  }
                  return node.color || "#4f46e5";
                }}
                nodeVal={(node: GraphNode) => node.val || 1}
                linkColor={(link: GraphLink) => {
                  const sourceId =
                    typeof link.source === "object"
                      ? (link.source as any).id
                      : link.source;
                  const targetId =
                    typeof link.target === "object"
                      ? (link.target as any).id
                      : link.target;

                  if (highlightLinks.size > 0) {
                    return highlightLinks.has(`${sourceId}-${targetId}`)
                      ? link.color || "#666"
                      : "#eee";
                  }
                  return link.color || "#999";
                }}
                linkWidth={(link: GraphLink) => {
                  const sourceId =
                    typeof link.source === "object"
                      ? (link.source as any).id
                      : link.source;
                  const targetId =
                    typeof link.target === "object"
                      ? (link.target as any).id
                      : link.target;

                  if (highlightLinks.size > 0) {
                    return highlightLinks.has(`${sourceId}-${targetId}`)
                      ? 2
                      : 0.5;
                  }
                  return 1;
                }}
                onNodeClick={handleNodeClick}
                cooldownTicks={100}
                onEngineStop={() => graphRef.current?.zoomToFit(400)}
              />
            </div>

            {/* Node details panel */}
            {selectedNode && (
              <div className="absolute top-4 right-4 bg-white p-4 rounded-lg shadow w-64">
                <h3 className="font-semibold text-lg border-b pb-2 mb-2">
                  {selectedNode.name}
                </h3>
                <p className="text-sm mb-1">
                  <span className="font-medium">Type:</span> {selectedNode.type}
                </p>
                {selectedNode.industry && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Industry:</span>{" "}
                    {selectedNode.industry}
                  </p>
                )}
                {selectedNode.country && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Country:</span>{" "}
                    {selectedNode.country}
                  </p>
                )}
                {selectedNode.ethical_score !== undefined && (
                  <p className="text-sm mb-1">
                    <span className="font-medium">Ethical Score:</span>
                    <span
                      className={`ml-1 ${
                        selectedNode.ethical_score > 75
                          ? "text-green-600"
                          : selectedNode.ethical_score > 50
                          ? "text-amber-600"
                          : "text-red-600"
                      }`}
                    >
                      {selectedNode.ethical_score}
                    </span>
                  </p>
                )}
                <button
                  className="w-full mt-3 text-xs text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    setSelectedNode(null);
                    setHighlightNodes(new Set());
                    setHighlightLinks(new Set());
                  }}
                >
                  Close
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center p-12">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">
              No Data Available
            </h2>
            <p className="text-gray-600 mb-6">
              No supply chain relationships found. Try connecting to the API or
              refreshing.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SupplyChainGraph;
