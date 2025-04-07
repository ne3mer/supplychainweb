import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  getSupplyChainGraphData,
  GraphNode,
  GraphLink,
  GraphData,
} from "../services/api";
import ForceGraph3D from "react-force-graph-3d";
import ForceGraph2D from "react-force-graph-2d";
import { useInView } from "react-intersection-observer";
import * as THREE from "three";
import {
  Network,
  Factory,
  Truck,
  Store,
  Package,
  BarChart3,
  Maximize,
  Minimize,
  AlertTriangle,
  RefreshCw,
  Info,
  Eye,
  EyeOff,
  Filter,
  Search,
} from "lucide-react";

// Extended interfaces to fix typing issues
interface NodeObject extends GraphNode {
  x?: number;
  y?: number;
  z?: number;
}

interface LinkObject extends GraphLink {
  source: string | NodeObject;
  target: string | NodeObject;
}

// Extended graph data interface
interface ExtendedGraphData extends GraphData {
  isMockData?: boolean;
  nodes: NodeObject[];
  links: LinkObject[];
}

// Simple SpriteText implementation for text labels
class SpriteText {
  sprite: THREE.Sprite;
  color: string = "#ffffff";
  textHeight: number = 8;
  position: { x: number; y: number; z: number } = { x: 0, y: 0, z: 0 };

  constructor(text: string) {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    if (context) {
      context.font = "24px Arial";
      context.fillStyle = "white";
      context.fillText(text, 5, 20);
    }

    const texture = new THREE.CanvasTexture(canvas);
    const material = new THREE.SpriteMaterial({ map: texture });
    this.sprite = new THREE.Sprite(material);
    return this;
  }
}

// Define types for the force graph refs
type ForceGraph2DInstance = {
  centerAt: (x: number, y: number, ms: number) => void;
  zoom: (scale: number, ms: number) => void;
} & React.ComponentType<{
  ref: React.RefObject<any>;
  graphData: any;
  nodeLabel?: (node: NodeObject) => string;
  nodeCanvasObject?: (
    node: NodeObject,
    ctx: CanvasRenderingContext2D,
    globalScale: number
  ) => void;
  linkCanvasObject?: (link: LinkObject, ctx: CanvasRenderingContext2D) => void;
  onNodeHover?: (node: NodeObject | null) => void;
  onNodeClick?: (node: NodeObject) => void;
  onBackgroundClick?: () => void;
  cooldownTicks?: number;
  d3AlphaDecay?: number;
  d3VelocityDecay?: number;
  nodeRelSize?: number;
  backgroundColor?: string;
}>;

type ForceGraph3DInstance = {
  cameraPosition: (
    position: { x: number; y: number; z: number },
    lookAt?: { x: number; y: number; z: number },
    ms?: number
  ) => void;
} & React.ComponentType<{
  ref: React.RefObject<any>;
  graphData: any;
  nodeLabel?: (node: NodeObject) => string;
  nodeColor?: (node: NodeObject) => string;
  nodeThreeObject?: (node: NodeObject) => THREE.Object3D;
  linkColor?: (link: LinkObject) => string;
  linkWidth?: (link: LinkObject) => number;
  linkDirectionalParticles?: (link: LinkObject) => number;
  linkDirectionalParticleWidth?: number;
  linkDirectionalParticleSpeed?: number;
  linkDirectionalArrowLength?: number;
  linkDirectionalArrowRelPos?: number;
  linkCurvature?: number;
  onNodeHover?: (node: NodeObject | null) => void;
  onNodeClick?: (node: NodeObject) => void;
  onBackgroundClick?: () => void;
  backgroundColor?: string;
}>;

const SupplyChainGraph = () => {
  // Refs for the graph components
  const graph2DRef = useRef<ForceGraph2DInstance | null>(null);
  const graph3DRef = useRef<ForceGraph3DInstance | null>(null);

  // State management
  const [graphData, setGraphData] = useState<ExtendedGraphData>({
    nodes: [],
    links: [],
  });
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedNode, setSelectedNode] = useState<NodeObject | null>(null);
  const [filterEthicalScore, setFilterEthicalScore] = useState<number>(0);
  const [showEthicalPathsOnly, setShowEthicalPathsOnly] =
    useState<boolean>(false);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  const [highlightNodes, setHighlightNodes] = useState(new Set());
  const [highlightLinks, setHighlightLinks] = useState(new Set());
  const [hoverNode, setHoverNode] = useState<NodeObject | null>(null);

  // UI state
  const [view3D, setView3D] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(false);
  const [showControls, setShowControls] = useState<boolean>(true);
  const [nodeSize, setNodeSize] = useState<number>(1);
  const [linkWidth, setLinkWidth] = useState<number>(1);
  const [showLabels, setShowLabels] = useState<boolean>(true);
  const [showLegend, setShowLegend] = useState<boolean>(true);
  const [filterPanelOpen, setFilterPanelOpen] = useState<boolean>(false);
  const [analyticsPanelOpen, setAnalyticsPanelOpen] = useState<boolean>(false);
  const [isFullscreen, setIsFullscreen] = useState<boolean>(false);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [colorByType, setColorByType] = useState<boolean>(true);
  const [colorByScore, setColorByScore] = useState<boolean>(false);

  // Animation states for UI elements
  const { ref: animationRef, inView: elementsInView } = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

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
            typeof link.source === "object" &&
            link.source !== null &&
            "id" in link.source
              ? link.source.id
              : link.source,
          target:
            typeof link.target === "object" &&
            link.target !== null &&
            "id" in link.target
              ? link.target.id
              : link.target,
        }));

        setGraphData({
          nodes: data.nodes as NodeObject[],
          links: processedLinks as LinkObject[],
          isMockData: data.isMockData,
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
  const isFullChainEthical = useCallback(
    (nodeId: string): boolean => {
      // For a retailer, check if all connections back to raw materials are ethical
      const node = graphData.nodes.find((n) => n.id === nodeId);
      if (!node) return false;

      // If this is a raw material, it's the start of the chain
      if (node.type === "rawMaterial") return true;

      // Get all incoming links
      const incomingLinks = graphData.links.filter((link) => {
        const target =
          typeof link.target === "object" && link.target !== null
            ? link.target.id
            : link.target;
        return target === nodeId;
      });

      // If no incoming links, or any aren't ethical, the chain isn't fully ethical
      if (incomingLinks.length === 0) return false;
      if (incomingLinks.some((link) => link.ethical === false)) return false;

      // Check all sources recursively
      return incomingLinks.every((link) => {
        const source =
          typeof link.source === "object" && link.source !== null
            ? link.source.id
            : link.source;
        return isFullChainEthical(
          typeof source === "string" ? source : String(source)
        );
      });
    },
    [graphData]
  );

  // Filter nodes based on search term and ethical score
  const getFilteredGraphData = useCallback(() => {
    let filteredNodes = graphData.nodes;

    // Filter by search term
    if (searchTerm) {
      const lowerSearchTerm = searchTerm.toLowerCase();
      filteredNodes = filteredNodes.filter(
        (node) =>
          node.name.toLowerCase().includes(lowerSearchTerm) ||
          (node.country && node.country.toLowerCase().includes(lowerSearchTerm))
      );
    }

    // Filter by ethical score
    if (filterEthicalScore > 0) {
      filteredNodes = filteredNodes.filter(
        (node) => (node.ethical_score || 0) >= filterEthicalScore
      );
    }

    // Get IDs of filtered nodes
    const filteredNodeIds = new Set(filteredNodes.map((node) => node.id));

    // Filter links to only include connections between filtered nodes
    let filteredLinks = graphData.links.filter((link) => {
      const sourceId =
        typeof link.source === "object" && link.source !== null
          ? link.source.id
          : link.source;
      const targetId =
        typeof link.target === "object" && link.target !== null
          ? link.target.id
          : link.target;

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
  }, [graphData, filterEthicalScore, showEthicalPathsOnly, searchTerm]);

  // Memoized filtered data to prevent unnecessary recalculations
  const filteredGraphData = useMemo(
    () => getFilteredGraphData(),
    [getFilteredGraphData]
  );

  // Node color based on type and ethical score
  const getNodeColor = useCallback(
    (node: NodeObject) => {
      if (!colorByType && colorByScore && node.ethical_score !== undefined) {
        // Color by ethical score
        const score = node.ethical_score;
        if (score >= 80) return "#059669"; // Green for high score
        if (score >= 60) return "#059669"; // Green-yellow for good score
        if (score >= 40) return "#D97706"; // Yellow for medium score
        return "#DC2626"; // Red for low score
      }

      // Base color on node type
      const baseColors: Record<string, string> = {
        rawMaterial: "#8B5CF6", // Purple
        supplier: "#3B82F6", // Blue
        manufacturer: "#10B981", // Green
        wholesaler: "#F59E0B", // Amber
        distributor: "#6366F1", // Indigo
        retailer: "#EC4899", // Pink
      };

      return baseColors[node.type] || "#9CA3AF";
    },
    [colorByType, colorByScore]
  );

  // Link color based on ethical status
  const getLinkColor = useCallback(
    (link: LinkObject) => {
      return link.ethical
        ? darkMode
          ? "#10B981"
          : "#059669" // Green in dark/light mode
        : darkMode
        ? "#EF4444"
        : "#DC2626"; // Red in dark/light mode
    },
    [darkMode]
  );

  // Get node icon by type
  const getNodeIcon = useCallback((type: string) => {
    switch (type) {
      case "rawMaterial":
        return Package;
      case "supplier":
        return Truck;
      case "manufacturer":
        return Factory;
      case "wholesaler":
        return Store;
      case "retailer":
        return Store;
      default:
        return null;
    }
  }, []);

  // Handle node hover
  const handleNodeHover = useCallback(
    (node: NodeObject | null) => {
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
          typeof link.source === "object" && link.source !== null
            ? link.source.id
            : link.source;
        const targetId =
          typeof link.target === "object" && link.target !== null
            ? link.target.id
            : link.target;

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
  const handleNodeClick = useCallback(
    (node: NodeObject) => {
      setSelectedNode(node);

      if (view3D && graph3DRef.current) {
        // Zoom in on the selected node
        const distance = 100;
        const distRatio =
          1 + distance / Math.hypot(node.x || 0, node.y || 0, node.z || 0);

        graph3DRef.current.cameraPosition(
          {
            x: (node.x || 0) * distRatio,
            y: (node.y || 0) * distRatio,
            z: (node.z || 0) * distRatio,
          },
          node,
          1000
        );
      } else if (!view3D && graph2DRef.current) {
        // Zoom in on the selected node in 2D
        graph2DRef.current.centerAt(node.x || 0, node.y || 0, 1000);
        graph2DRef.current.zoom(2.5, 1000);
      }
    },
    [view3D]
  );

  // Handle background click to deselect node
  const handleBackgroundClick = useCallback(() => {
    setSelectedNode(null);

    if (view3D && graph3DRef.current) {
      // Reset camera in 3D
      graph3DRef.current.cameraPosition(
        { x: 0, y: 0, z: 500 },
        { x: 0, y: 0, z: 0 },
        1000
      );
    } else if (!view3D && graph2DRef.current) {
      // Reset zoom in 2D
      graph2DRef.current.centerAt(0, 0, 1000);
      graph2DRef.current.zoom(1, 1000);
    }
  }, [view3D]);

  // Custom node object for 3D view
  const nodeThreeObject = useCallback(
    (node: NodeObject) => {
      const isHighlighted = highlightNodes.has(node.id);
      const isSelected = selectedNode && selectedNode.id === node.id;

      // Calculate node size based on type, if it's highlighted, and the user size setting
      let size =
        (node.type === "rawMaterial" ? 5 : node.type === "retailer" ? 8 : 6) *
        nodeSize;

      // Increase size if highlighted or selected
      if (isHighlighted) size *= 1.2;
      if (isSelected) size *= 1.4;

      // Create a sphere
      const sphere = new THREE.Mesh(
        new THREE.SphereGeometry(size),
        new THREE.MeshLambertMaterial({
          color: getNodeColor(node),
          transparent: !isHighlighted && !isSelected,
          opacity: !isHighlighted && !isSelected ? 0.8 : 1.0,
        })
      );

      // Add a text label if needed
      if (showLabels || isHighlighted || isSelected) {
        const sprite = new SpriteText(node.name);
        sprite.color = darkMode ? "#ffffff" : "#000000";
        sprite.textHeight = isSelected ? 10 : 8;
        sprite.position.y = size + 10;
        sphere.add(sprite.sprite);
      }

      return sphere;
    },
    [getNodeColor, highlightNodes, selectedNode, nodeSize, showLabels, darkMode]
  );

  // Custom node canvasing for 2D view
  const paintNode = useCallback(
    (node: NodeObject, ctx: CanvasRenderingContext2D, globalScale: number) => {
      const isHighlighted = highlightNodes.has(node.id);
      const isSelected = selectedNode && selectedNode.id === node.id;

      // Calculate node size based on type, if it's highlighted, and user size setting
      let size =
        (node.type === "rawMaterial"
          ? 6
          : node.type === "supplier"
          ? 8
          : node.type === "manufacturer"
          ? 8
          : node.type === "wholesaler"
          ? 7
          : node.type === "retailer"
          ? 9
          : 6) * nodeSize;

      // Increase size if highlighted or selected
      if (isHighlighted) size *= 1.2;
      if (isSelected) size *= 1.4;

      // Get node color
      const color = getNodeColor(node);

      // Draw node
      ctx.beginPath();
      ctx.arc(node.x || 0, node.y || 0, size, 0, 2 * Math.PI);
      ctx.fillStyle = color;
      ctx.fill();

      // Draw border if highlighted or selected
      if (isHighlighted || isSelected) {
        ctx.strokeStyle = darkMode ? "#ffffff" : "#000000";
        ctx.lineWidth = isSelected ? 2 : 1.5;
        ctx.stroke();
      }

      // Add label if enabled or node is highlighted/selected
      if (showLabels || isSelected || isHighlighted) {
        ctx.font = `${Math.max(8, 12 / globalScale)}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = darkMode ? "#ffffff" : "#000000";
        ctx.fillText(
          node.name,
          node.x || 0,
          (node.y || 0) + size + 8 / globalScale
        );
      }
    },
    [getNodeColor, highlightNodes, selectedNode, nodeSize, showLabels, darkMode]
  );

  // Custom link rendering for 2D view
  const paintLink = useCallback(
    (link: LinkObject, ctx: CanvasRenderingContext2D) => {
      const isHighlighted = highlightLinks.has(link);
      const color = getLinkColor(link);

      // Extract coordinates
      const source = link.source as any;
      const target = link.target as any;

      const sourceX = source.x !== undefined ? source.x : 0;
      const sourceY = source.y !== undefined ? source.y : 0;
      const targetX = target.x !== undefined ? target.x : 0;
      const targetY = target.y !== undefined ? target.y : 0;

      // Draw link with width based on user setting
      ctx.beginPath();
      ctx.moveTo(sourceX, sourceY);
      ctx.lineTo(targetX, targetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = isHighlighted ? 2.5 * linkWidth : 1.5 * linkWidth;

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
        const deltaX = targetX - sourceX;
        const deltaY = targetY - sourceY;
        const angle = Math.atan2(deltaY, deltaX);

        // Position the arrow near the target node
        const arrowLength = 10;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const targetNodeSize = 8; // Approximate

        // Calculate position to draw arrow (before the target node)
        const posX = sourceX + deltaX * (1 - targetNodeSize / distance);
        const posY = sourceY + deltaY * (1 - targetNodeSize / distance);

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
    [getLinkColor, highlightLinks, linkWidth]
  );

  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch((err) => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);

  return (
    <div
      className={`min-h-screen ${
        darkMode ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-900"
      } transition-colors duration-300`}
    >
      {/* Header Section */}
      <div className="container mx-auto py-6 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6"
        >
          <div>
            <h1 className="text-2xl md:text-3xl font-bold flex items-center">
              <Network
                className={`h-8 w-8 ${
                  darkMode ? "text-blue-400" : "text-blue-600"
                } mr-2`}
              />
              Supply Chain Relationship Graph
            </h1>
            <p
              className={`mt-1 ${darkMode ? "text-gray-300" : "text-gray-600"}`}
            >
              Interactive visualization of your entire supply chain network
            </p>
            {usingMockData && (
              <p className="text-xs text-amber-500 mt-1 flex items-center">
                <Info className="h-4 w-4 mr-1" />
                Using demonstration data. Connect to the API for real supply
                chain data.
              </p>
            )}
          </div>

          {/* Main Controls */}
          <div className="flex flex-wrap gap-3 mt-4 md:mt-0">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView3D(!view3D)}
              className={`px-3 py-2 rounded-lg shadow-sm flex items-center ${
                darkMode
                  ? "bg-gray-800 text-blue-400 hover:bg-gray-700"
                  : "bg-white text-blue-600 hover:bg-gray-50"
              }`}
            >
              {view3D ? "2D View" : "3D View"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setDarkMode(!darkMode)}
              className={`px-3 py-2 rounded-lg shadow-sm flex items-center ${
                darkMode
                  ? "bg-gray-800 text-blue-400 hover:bg-gray-700"
                  : "bg-white text-blue-600 hover:bg-gray-50"
              }`}
            >
              {darkMode ? "Light Mode" : "Dark Mode"}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleFullscreen}
              className={`px-3 py-2 rounded-lg shadow-sm flex items-center ${
                darkMode
                  ? "bg-gray-800 text-blue-400 hover:bg-gray-700"
                  : "bg-white text-blue-600 hover:bg-gray-50"
              }`}
            >
              {isFullscreen ? (
                <Minimize className="w-5 h-5" />
              ) : (
                <Maximize className="w-5 h-5" />
              )}
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setFilterPanelOpen(!filterPanelOpen)}
              className={`px-3 py-2 rounded-lg shadow-sm flex items-center ${
                darkMode
                  ? "bg-gray-800 text-blue-400 hover:bg-gray-700"
                  : "bg-white text-blue-600 hover:bg-gray-50"
              }`}
            >
              <Filter className="w-5 h-5 mr-1" />
              Filters
            </motion.button>
          </div>
        </motion.div>

        {/* Search and Filter Panel */}
        <AnimatePresence>
          {filterPanelOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className={`mb-6 rounded-lg shadow-sm overflow-hidden ${
                darkMode ? "bg-gray-800" : "bg-white"
              }`}
            >
              <div className="p-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Search */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Search Suppliers
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        placeholder="Search by name or country"
                        className={`w-full px-4 py-2 rounded-lg border ${
                          darkMode
                            ? "bg-gray-700 border-gray-600 text-white placeholder-gray-400"
                            : "bg-white border-gray-300 text-gray-900 placeholder-gray-500"
                        }`}
                      />
                      <Search className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" />
                    </div>
                  </div>

                  {/* Ethical Score Filter */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Min. Ethical Score: {filterEthicalScore}
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
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  {/* Toggle Ethical Paths */}
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="ethical-paths"
                      checked={showEthicalPathsOnly}
                      onChange={() =>
                        setShowEthicalPathsOnly(!showEthicalPathsOnly)
                      }
                      className="h-4 w-4 rounded"
                    />
                    <label
                      htmlFor="ethical-paths"
                      className={`ml-2 block text-sm ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Show only ethical connections
                    </label>
                  </div>

                  {/* Visualization Options */}
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Visualization Options
                    </label>
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => setShowLabels(!showLabels)}
                        className={`px-2 py-1 text-xs rounded ${
                          showLabels
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        {showLabels ? (
                          <Eye className="w-3 h-3 inline mr-1" />
                        ) : (
                          <EyeOff className="w-3 h-3 inline mr-1" />
                        )}
                        Labels
                      </button>
                      <button
                        onClick={() => setColorByScore(!colorByScore)}
                        className={`px-2 py-1 text-xs rounded ${
                          colorByScore
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <BarChart3 className="w-3 h-3 inline mr-1" />
                        Score Colors
                      </button>
                      <button
                        onClick={() => setColorByType(!colorByType)}
                        className={`px-2 py-1 text-xs rounded ${
                          colorByType
                            ? "bg-blue-100 text-blue-800"
                            : "bg-gray-100 text-gray-800"
                        }`}
                      >
                        <Filter className="w-3 h-3 inline mr-1" />
                        Type Colors
                      </button>
                    </div>
                  </div>
                </div>

                {/* Advanced controls */}
                <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Node Size: {nodeSize.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={nodeSize}
                      onChange={(e) => setNodeSize(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>

                  <div>
                    <label
                      className={`block text-sm font-medium mb-2 ${
                        darkMode ? "text-gray-300" : "text-gray-700"
                      }`}
                    >
                      Link Width: {linkWidth.toFixed(1)}
                    </label>
                    <input
                      type="range"
                      min="0.5"
                      max="2"
                      step="0.1"
                      value={linkWidth}
                      onChange={(e) => setLinkWidth(parseFloat(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Legend */}
        {showLegend && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className={`mb-4 p-4 rounded-lg shadow-sm ${
              darkMode ? "bg-gray-800" : "bg-white"
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <h2
                className={`text-sm font-medium ${
                  darkMode ? "text-gray-300" : "text-gray-700"
                }`}
              >
                Legend
              </h2>
              <button
                onClick={() => setShowLegend(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <span className="sr-only">Close</span>
                &times;
              </button>
            </div>
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-purple-500 mr-1"></span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Raw Material
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-blue-500 mr-1"></span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Supplier
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-green-500 mr-1"></span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Manufacturer
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-amber-500 mr-1"></span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Wholesaler
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-3 h-3 rounded-full bg-pink-500 mr-1"></span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Retailer
                </span>
              </div>
              <div
                className={`border-l ${
                  darkMode ? "border-gray-700" : "border-gray-300"
                } pl-2 flex items-center`}
              >
                <span className="w-6 h-1 bg-green-600 mr-1"></span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Ethical Link
                </span>
              </div>
              <div className="flex items-center">
                <span className="w-6 h-1 border-t-2 border-dashed border-red-600 mr-1"></span>
                <span
                  className={`text-xs ${
                    darkMode ? "text-gray-300" : "text-gray-700"
                  }`}
                >
                  Non-ethical Link
                </span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Main content */}
        <div
          className={`rounded-lg shadow overflow-hidden ${
            darkMode ? "bg-gray-800 border border-gray-700" : "bg-white"
          }`}
        >
          {loading ? (
            <div className="p-12 text-center">
              <RefreshCw
                className={`h-12 w-12 ${
                  darkMode ? "text-gray-500" : "text-gray-400"
                } animate-spin mx-auto`}
              />
              <p
                className={`mt-4 ${
                  darkMode ? "text-gray-300" : "text-gray-600"
                }`}
              >
                Loading supply chain data...
              </p>
            </div>
          ) : error ? (
            <div className="p-12 text-center">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto" />
              <p className="mt-4 text-red-500">{error}</p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Retry
              </motion.button>
            </div>
          ) : (
            <div className="relative" style={{ height: "70vh" }}>
              {filteredGraphData.nodes.length > 0 ? (
                <>
                  {/* 3D or 2D Graph based on view selection */}
                  {view3D ? (
                    <ForceGraph3D
                      ref={graph3DRef}
                      graphData={filteredGraphData}
                      nodeLabel={(node) =>
                        `${node.name} (${node.type})\nEthical Score: ${
                          node.ethical_score || "N/A"
                        }\nCountry: ${node.country || "Unknown"}`
                      }
                      nodeColor={getNodeColor}
                      nodeThreeObject={nodeThreeObject}
                      linkColor={getLinkColor}
                      linkWidth={(link) =>
                        highlightLinks.has(link) ? 2 * linkWidth : linkWidth
                      }
                      linkDirectionalParticles={(link) =>
                        link.ethical ? 4 : 0
                      }
                      linkDirectionalParticleWidth={2}
                      linkDirectionalParticleSpeed={0.005}
                      linkDirectionalArrowLength={3.5}
                      linkDirectionalArrowRelPos={1}
                      linkCurvature={0.1}
                      onNodeHover={handleNodeHover}
                      onNodeClick={handleNodeClick}
                      onBackgroundClick={handleBackgroundClick}
                      backgroundColor={darkMode ? "#1F2937" : "#ffffff"}
                    />
                  ) : (
                    <ForceGraph2D
                      ref={graph2DRef}
                      graphData={filteredGraphData}
                      nodeCanvasObject={paintNode}
                      linkCanvasObject={paintLink}
                      onNodeHover={handleNodeHover}
                      onNodeClick={handleNodeClick}
                      onBackgroundClick={handleBackgroundClick}
                      cooldownTicks={100}
                      d3AlphaDecay={0.02}
                      d3VelocityDecay={0.2}
                      nodeRelSize={6}
                      backgroundColor={darkMode ? "#1F2937" : "#ffffff"}
                    />
                  )}

                  {/* Hover tooltip */}
                  {hoverNode && (
                    <div
                      className={`absolute top-2 left-2 p-2 rounded-md shadow-lg border text-xs z-10 ${
                        darkMode
                          ? "bg-gray-800 border-gray-700 text-white"
                          : "bg-white border-gray-200 text-gray-800"
                      }`}
                    >
                      <div className="font-bold">{hoverNode.name}</div>
                      <div>
                        Type:{" "}
                        <span className="capitalize">{hoverNode.type}</span>
                      </div>
                      <div>Country: {hoverNode.country}</div>
                      {hoverNode.ethical_score && (
                        <div>Ethical Score: {hoverNode.ethical_score}</div>
                      )}
                    </div>
                  )}

                  {/* Selected node info panel */}
                  <AnimatePresence>
                    {selectedNode && (
                      <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.3 }}
                        className={`absolute top-4 right-4 w-72 p-4 rounded-lg shadow-lg border z-10 ${
                          darkMode
                            ? "bg-gray-800 border-gray-700 text-white"
                            : "bg-white border-gray-200 text-gray-800"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="text-lg font-semibold">
                            {selectedNode.name}
                          </h3>
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
                            <span className="capitalize">
                              {selectedNode.type}
                            </span>
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
                              <span className="font-medium">
                                Is Ethical Chain:
                              </span>{" "}
                              {isFullChainEthical(selectedNode.id)
                                ? "Yes"
                                : "No"}
                            </p>
                          )}

                          {/* Relationships section */}
                          <div
                            className={`border-t pt-2 mt-2 ${
                              darkMode ? "border-gray-700" : "border-gray-200"
                            }`}
                          >
                            <h4 className="font-medium mb-1">Connections:</h4>
                            <div className="max-h-40 overflow-y-auto">
                              {/* List incoming connections */}
                              {graphData.links
                                .filter((link) => {
                                  const targetId =
                                    typeof link.target === "object" &&
                                    link.target
                                      ? link.target.id
                                      : link.target;
                                  return targetId === selectedNode.id;
                                })
                                .map((link, idx) => {
                                  const sourceId =
                                    typeof link.source === "object" &&
                                    link.source
                                      ? link.source.id
                                      : link.source;
                                  const sourceNode = graphData.nodes.find(
                                    (n) => n.id === sourceId
                                  );
                                  return (
                                    <div
                                      key={`in-${idx}`}
                                      className="text-xs mb-1"
                                    >
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
                                      <span
                                        className={`${
                                          darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                        }`}
                                      >
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
                                    typeof link.source === "object" &&
                                    link.source
                                      ? link.source.id
                                      : link.source;
                                  return sourceId === selectedNode.id;
                                })
                                .map((link, idx) => {
                                  const targetId =
                                    typeof link.target === "object" &&
                                    link.target
                                      ? link.target.id
                                      : link.target;
                                  const targetNode = graphData.nodes.find(
                                    (n) => n.id === targetId
                                  );
                                  return (
                                    <div
                                      key={`out-${idx}`}
                                      className="text-xs mb-1"
                                    >
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
                                      <span
                                        className={`${
                                          darkMode
                                            ? "text-gray-400"
                                            : "text-gray-500"
                                        }`}
                                      >
                                        {" "}
                                        ({targetNode?.type})
                                      </span>
                                    </div>
                                  );
                                })}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p
                    className={`${
                      darkMode ? "text-gray-400" : "text-gray-500"
                    }`}
                  >
                    No nodes match the current filters.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplyChainGraph;
