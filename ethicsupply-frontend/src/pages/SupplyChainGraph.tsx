import { useState, useEffect, useRef, useCallback } from "react";
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
import ForceGraph2D from "react-force-graph-2d";

const SupplyChainGraph = () => {
  const graphRef = useRef(null);
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
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState<GraphNode | null>(null);

  // Load data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const data = await getSupplyChainGraphData();
        // Convert sources and targets to string IDs if they're objects
        const processedLinks = data.links.map((link) => ({
          ...link,
          source:
            typeof link.source === "object" ? link.source.id : link.source,
          target:
            typeof link.target === "object" ? link.target.id : link.target,
        }));

        setGraphData({
          nodes: data.nodes,
          links: processedLinks,
        });
        setUsingMockData(!!data.isMockData);
        setError(null);
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
  const getFilteredGraphData = useCallback(() => {
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
  }, [graphData, filterEthicalScore, showEthicalPathsOnly]);

  // Node color based on type and ethical score
  const getNodeColor = useCallback((node) => {
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
    if (node.type === "supplier" || node.type === "manufacturer") {
      const score = node.ethical_score || 50;
      return score >= 70
        ? "#059669" // Green for high score
        : score >= 50
        ? "#D97706" // Amber for medium
        : "#DC2626"; // Red for low score
    }

    // Return base color for different node types
    return baseColors[node.type] || "#9CA3AF";
  }, []);

  // Link color based on ethical status
  const getLinkColor = useCallback((link) => {
    return link.ethical ? "#059669" : "#DC2626";
  }, []);

  // Handle node hover
  const handleNodeHover = useCallback(
    (node) => {
      setHoverNode(node);

      if (!node) {
        setHighlightNodes(new Set());
        setHighlightLinks(new Set());
        return;
      }

      // Get connected nodes and links
      const connectedNodes = new Set([node.id]);
      const connectedLinks = new Set();

      // Add connected nodes and links in both directions
      graphData.links.forEach((link) => {
        const sourceId =
          typeof link.source === "object" ? link.source.id : link.source;
        const targetId =
          typeof link.target === "object" ? link.target.id : link.target;

        if (sourceId === node.id) {
          connectedNodes.add(targetId);
          connectedLinks.add(link);
        }
        if (targetId === node.id) {
          connectedNodes.add(sourceId);
          connectedLinks.add(link);
        }
      });

      setHighlightNodes(connectedNodes);
      setHighlightLinks(connectedLinks);
    },
    [graphData]
  );

  // Handle node click
  const handleNodeClick = useCallback((node) => {
    setSelectedNode(node);

    if (graphRef.current) {
      // Zoom in on the selected node
      graphRef.current.centerAt(node.x, node.y, 1000);
      graphRef.current.zoom(2.5, 1000);
    }
  }, []);

  // Handle background click to deselect node
  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);

    if (graphRef.current) {
      // Reset zoom
      graphRef.current.centerAt(0, 0, 1000);
      graphRef.current.zoom(1, 1000);
    }
  }, []);

  // Custom node canvasing
  const paintNode = useCallback(
    (node, ctx, globalScale) => {
      const isHighlighted = highlightNodes.has(node.id);
      const isSelected = selectedNode && selectedNode.id === node.id;

      // Calculate node size based on type and if it's highlighted
      let size =
        node.type === "rawMaterial"
          ? 6
          : node.type === "supplier"
          ? 8
          : node.type === "manufacturer"
          ? 8
          : node.type === "wholesaler"
          ? 7
          : node.type === "retailer"
          ? 9
          : 6;

      // Increase size if highlighted or selected
      if (isHighlighted) size *= 1.2;
      if (isSelected) size *= 1.4;

      // Get node color
      const color = getNodeColor(node);

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x, node.y, size, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw border if highlighted or selected
      if (isHighlighted || isSelected) {
        ctx.strokeStyle = "#ffffff";
        ctx.lineWidth = isSelected ? 2 : 1.5;
        ctx.stroke();
      }

      // Add label for larger nodes or when selected/highlighted
      if (size > 6 || isSelected || isHighlighted) {
        ctx.font = `${Math.max(8, 12 / globalScale)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = "#ffffff";
        ctx.fillText(node.name, node.x, node.y + size + 8 / globalScale);
      }
    },
    [getNodeColor, highlightNodes, selectedNode]
  );

  // Custom link rendering
  const paintLink = useCallback(
    (link, ctx) => {
      const isHighlighted = highlightLinks.has(link);
      const color = getLinkColor(link);

      // Draw link
      ctx.beginPath();
      ctx.moveTo(link.source.x, link.source.y);
      ctx.lineTo(link.target.x, link.target.y);
      ctx.strokeStyle = color;
      ctx.lineWidth = isHighlighted ? 2.5 : 1.5;

      // Add dashed effect for non-ethical links
      if (!link.ethical) {
        ctx.setLineDash([5, 3]);
      } else {
        ctx.setLineDash([]);
      }

      ctx.stroke();

      // Reset line dash
      ctx.setLineDash([]);

      // Draw direction arrow if highlighted
      if (isHighlighted) {
        const deltaX = link.target.x - link.source.x;
        const deltaY = link.target.y - link.source.y;
        const angle = Math.atan2(deltaY, deltaX);

        // Position the arrow near the target node
        const arrowLength = 10;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const targetNodeSize = 8; // Approximate

        // Calculate position to draw arrow (before the target node)
        const posX = link.source.x + deltaX * (1 - targetNodeSize / distance);
        const posY = link.source.y + deltaY * (1 - targetNodeSize / distance);

        ctx.beginPath();
        ctx.moveTo(posX, posY);
        ctx.lineTo(
          posX - arrowLength * Math.cos(angle - Math.PI / 6),
          posY - arrowLength * Math.sin(angle - Math.PI / 6)
        );
        ctx.lineTo(
          posX - arrowLength * Math.cos(angle + Math.PI / 6),
          posY - arrowLength * Math.sin(angle + Math.PI / 6)
        );
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      }
    },
    [getLinkColor, highlightLinks]
  );

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
            <span className="w-6 h-1 border-t-2 border-dashed border-red-600 mr-1"></span>
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
              <>
                <ForceGraph2D
                  ref={graphRef}
                  graphData={getFilteredGraphData()}
                  nodeAutoColorBy="type"
                  linkDirectionalArrowLength={0}
                  linkDirectionalArrowRelPos={1}
                  linkCurvature={0}
                  nodeCanvasObject={paintNode}
                  linkCanvasObject={paintLink}
                  onNodeHover={handleNodeHover}
                  onNodeClick={handleNodeClick}
                  onBackgroundClick={handleBackgroundClick}
                  cooldownTicks={100}
                  d3AlphaDecay={0.02}
                  d3VelocityDecay={0.2}
                  d3Force={
                    ("link",
                    (link) => {
                      // Adjust link strength based on type
                      link.strength((l) => (l.ethical ? 0.7 : 0.3));
                    })
                  }
                  nodeRelSize={6}
                  width={800}
                  height={600}
                  backgroundColor="#ffffff"
                />

                {/* Hover tooltip */}
                {hoverNode && (
                  <div className="absolute top-2 left-2 bg-white p-2 rounded-md shadow-lg border border-gray-200 text-xs">
                    <div className="font-bold">{hoverNode.name}</div>
                    <div>
                      Type: <span className="capitalize">{hoverNode.type}</span>
                    </div>
                    <div>Country: {hoverNode.country}</div>
                    {hoverNode.ethical_score && (
                      <div>Ethical Score: {hoverNode.ethical_score}</div>
                    )}
                  </div>
                )}
              </>
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

                  {/* Relationships section */}
                  <div className="border-t border-gray-200 pt-2 mt-2">
                    <h4 className="font-medium mb-1">Connections:</h4>
                    <div className="max-h-40 overflow-y-auto">
                      {/* List incoming connections */}
                      {graphData.links
                        .filter((link) => {
                          const targetId =
                            typeof link.target === "object"
                              ? link.target.id
                              : link.target;
                          return targetId === selectedNode.id;
                        })
                        .map((link, idx) => {
                          const sourceId =
                            typeof link.source === "object"
                              ? link.source.id
                              : link.source;
                          const sourceNode = graphData.nodes.find(
                            (n) => n.id === sourceId
                          );
                          return (
                            <div key={`in-${idx}`} className="text-xs mb-1">
                              <span className="mr-1">←</span>
                              <span
                                className={
                                  link.ethical
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {sourceNode?.name || sourceId}
                              </span>
                              <span className="text-gray-500">
                                {" "}
                                ({sourceNode?.type})
                              </span>
                            </div>
                          );
                        })}

                      {/* List outgoing connections */}
                      {graphData.links
                        .filter((link) => {
                          const sourceId =
                            typeof link.source === "object"
                              ? link.source.id
                              : link.source;
                          return sourceId === selectedNode.id;
                        })
                        .map((link, idx) => {
                          const targetId =
                            typeof link.target === "object"
                              ? link.target.id
                              : link.target;
                          const targetNode = graphData.nodes.find(
                            (n) => n.id === targetId
                          );
                          return (
                            <div key={`out-${idx}`} className="text-xs mb-1">
                              <span className="mr-1">→</span>
                              <span
                                className={
                                  link.ethical
                                    ? "text-green-600"
                                    : "text-red-600"
                                }
                              >
                                {targetNode?.name || targetId}
                              </span>
                              <span className="text-gray-500">
                                {" "}
                                ({targetNode?.type})
                              </span>
                            </div>
                          );
                        })}
                    </div>
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
