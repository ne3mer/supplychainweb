import { useState, useEffect, useRef } from "react";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  CircleMarker,
  useMap,
} from "react-leaflet";
import { getSuppliers, Supplier } from "../services/api";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import {
  GlobeAltIcon,
  BuildingOfficeIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  BellIcon,
  BellAlertIcon,
  ShieldExclamationIcon,
  FireIcon,
  CloudIcon,
  ScaleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";

// Fix for default marker icons
// @ts-ignore
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Risk categories with their color and icon
const riskTypes = {
  political: {
    color: "#ef4444",
    name: "Political Instability",
    icon: <ShieldExclamationIcon className="w-5 h-5" />,
    description: "Regions with political unrest, sanctions or instability",
  },
  environmental: {
    color: "#3b82f6",
    name: "Environmental Risk",
    icon: <CloudIcon className="w-5 h-5" />,
    description:
      "Areas with water scarcity, natural disasters or extreme climate vulnerability",
  },
  socialEthical: {
    color: "#8b5cf6",
    name: "Social/Ethical Concerns",
    icon: <UserGroupIcon className="w-5 h-5" />,
    description:
      "Regions with human rights issues, child labor or poor working conditions",
  },
  conflict: {
    color: "#f97316",
    name: "Active Conflicts",
    icon: <FireIcon className="w-5 h-5" />,
    description: "Areas with ongoing armed conflicts or civil unrest",
  },
  regulatory: {
    color: "#f59e0b",
    name: "Regulatory Changes",
    icon: <ScaleIcon className="w-5 h-5" />,
    description:
      "Recent or upcoming regulatory changes affecting business operations",
  },
};

// Mock country-specific risk data
const countryRiskData = {
  China: ["political", "socialEthical"],
  "United States": ["regulatory"],
  India: ["environmental", "socialEthical"],
  Russia: ["political", "conflict", "regulatory"],
  Brazil: ["environmental", "political"],
  Mexico: ["conflict", "socialEthical"],
  Ukraine: ["conflict", "political"],
  Bangladesh: ["environmental", "socialEthical"],
  Vietnam: ["political", "socialEthical"],
  Thailand: ["political", "environmental"],
  Egypt: ["political", "conflict"],
  "South Africa": ["environmental", "socialEthical"],
  Indonesia: ["environmental", "political"],
  Turkey: ["political", "regulatory"],
  Philippines: ["environmental", "conflict"],
  Pakistan: ["political", "conflict", "environmental"],
  Nigeria: ["conflict", "political", "environmental"],
};

// Mock geocoding data (country name -> lat/lng)
const countryCoordinates = {
  "United States": [38.89511, -77.03637],
  China: [39.90571, 116.39127],
  India: [28.61389, 77.209],
  Germany: [52.52437, 13.41053],
  "United Kingdom": [51.50853, -0.12574],
  France: [48.85661, 2.35222],
  Brazil: [-15.77972, -47.92972],
  Italy: [41.89193, 12.51133],
  Canada: [45.42351, -75.69989],
  Japan: [35.6895, 139.69171],
  "South Korea": [37.56639, 126.99977],
  Australia: [-35.28092, 149.13],
  Spain: [40.4167, -3.70332],
  Mexico: [19.42847, -99.12766],
  Indonesia: [-6.1744, 106.8294],
  Netherlands: [52.37022, 4.89517],
  "Saudi Arabia": [24.68859, 46.72204],
  Turkey: [39.93353, 32.85972],
  Switzerland: [46.94799, 7.44744],
  Poland: [52.22977, 21.01178],
  Thailand: [13.75249, 100.49351],
  Sweden: [59.33258, 18.06489],
  Belgium: [50.85034, 4.35171],
  Nigeria: [9.07648, 7.39859],
  Austria: [48.2082, 16.3738],
  Norway: [59.91603, 10.73874],
  "United Arab Emirates": [24.45385, 54.37729],
  Israel: [31.769, 35.21633],
  Ireland: [53.34976, -6.26026],
  Singapore: [1.35208, 103.81984],
  Vietnam: [21.02776, 105.83416],
  Malaysia: [3.13898, 101.68689],
  Denmark: [55.67592, 12.56553],
  Philippines: [14.59951, 120.98422],
  Pakistan: [33.69296, 73.0545],
  Colombia: [4.60971, -74.08175],
  Chile: [-33.44901, -70.66927],
  Finland: [60.16749, 24.94278],
  Bangladesh: [23.81032, 90.41249],
  Egypt: [30.04443, 31.23571],
  "South Africa": [-25.74787, 28.22932],
  "New Zealand": [-41.28874, 174.77721],
  Argentina: [-34.60368, -58.38157],
  Russia: [55.75045, 37.61742],
  Ukraine: [50.4501, 30.5234],
  Other: [0, 0],
};

// Mock recent alerts
const initialAlerts = [
  {
    id: 1,
    date: "2024-04-05",
    title: "Political Unrest in Thailand",
    description:
      "Increasing political protests in Bangkok may cause supply chain disruptions",
    type: "political",
    country: "Thailand",
    read: false,
  },
  {
    id: 2,
    date: "2024-04-04",
    title: "Water Scarcity Alert: India",
    description:
      "Severe water shortages reported in manufacturing regions of South India",
    type: "environmental",
    country: "India",
    read: false,
  },
  {
    id: 3,
    date: "2024-04-03",
    title: "New Labor Regulations in China",
    description:
      "Chinese government announces stricter labor laws affecting manufacturing",
    type: "regulatory",
    country: "China",
    read: true,
  },
  {
    id: 4,
    date: "2024-04-02",
    title: "Child Labor Investigation in Bangladesh",
    description:
      "NGO report highlights child labor concerns in textile industry",
    type: "socialEthical",
    country: "Bangladesh",
    read: true,
  },
  {
    id: 5,
    date: "2024-04-01",
    title: "Conflict Escalation in Nigeria",
    description:
      "Civil unrest increases in Lagos region, affecting oil suppliers",
    type: "conflict",
    country: "Nigeria",
    read: true,
  },
];

// Risk overlay component
interface RiskOverlayProps {
  country: string;
  riskTypes: string[];
}

const RiskOverlay: React.FC<RiskOverlayProps> = ({ country, riskTypes }) => {
  const coordinates = countryCoordinates[country] || [0, 0];

  if (coordinates[0] === 0 && coordinates[1] === 0) return null;

  return (
    <>
      {riskTypes.map((riskType, index) => (
        <CircleMarker
          key={`${country}-${riskType}-${index}`}
          center={[coordinates[0], coordinates[1]]}
          radius={15 + index * 5}
          pathOptions={{
            color: riskTypes[riskType]?.color || "#000",
            fillColor: riskTypes[riskType]?.color || "#000",
            fillOpacity: 0.2,
            weight: 1,
          }}
        />
      ))}
    </>
  );
};

interface Alert {
  id: number;
  date: string;
  title: string;
  description: string;
  type: string;
  country: string;
  read: boolean;
}

const GeoRiskMapping = () => {
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRiskTypes, setActiveRiskTypes] = useState<string[]>(
    Object.keys(riskTypes)
  );
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [showAlerts, setShowAlerts] = useState<boolean>(false);
  const [highlightedCountry, setHighlightedCountry] = useState<string | null>(
    null
  );
  const [showTutorial, setShowTutorial] = useState<boolean>(false);

  // Fetch suppliers
  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const suppliersData = await getSuppliers();
        setSuppliers(suppliersData);
      } catch (err) {
        console.error("Error fetching suppliers for map:", err);
        setError("Failed to load supplier data. Please try again later.");
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Mark an alert as read
  const markAlertAsRead = (alertId: number) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  // Toggle risk type visibility
  const toggleRiskType = (riskType: string) => {
    if (activeRiskTypes.includes(riskType)) {
      setActiveRiskTypes(activeRiskTypes.filter((type) => type !== riskType));
    } else {
      setActiveRiskTypes([...activeRiskTypes, riskType]);
    }
  };

  // Filter suppliers by country with active risks
  const getCountriesWithActiveRisks = () => {
    return Object.entries(countryRiskData)
      .filter(([_, risks]) =>
        risks.some((risk) => activeRiskTypes.includes(risk))
      )
      .map(([country]) => country);
  };

  // Count unread alerts
  const unreadAlertsCount = alerts.filter((alert) => !alert.read).length;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <GlobeAltIcon className="h-6 w-6 text-blue-600 mr-2" />
            Geo-AI Risk Mapping
          </h1>
          <p className="text-gray-600 mt-1">
            Visualize suppliers and global risk factors in real-time
          </p>
        </div>

        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            onClick={() => setShowTutorial(true)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <InformationCircleIcon className="h-5 w-5 mr-1 text-blue-500" />
            Help
          </button>

          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm leading-4 font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
          >
            {unreadAlertsCount > 0 ? (
              <BellAlertIcon className="h-5 w-5 mr-1 text-red-500" />
            ) : (
              <BellIcon className="h-5 w-5 mr-1 text-gray-500" />
            )}
            Alerts
            {unreadAlertsCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
                {unreadAlertsCount}
              </span>
            )}
          </button>
        </div>
      </div>

      {/* Risk Type Filters */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-lg font-semibold mb-3">Risk Overlays</h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(riskTypes).map(([key, { name, color, icon }]) => (
            <button
              key={key}
              onClick={() => toggleRiskType(key)}
              className={`inline-flex items-center px-3 py-2 rounded-full text-sm font-medium ${
                activeRiskTypes.includes(key)
                  ? "bg-gray-800 text-white"
                  : "bg-gray-100 text-gray-700"
              }`}
              style={{
                borderLeft: activeRiskTypes.includes(key)
                  ? `4px solid ${color}`
                  : undefined,
              }}
            >
              <span className="mr-2">{icon}</span>
              {name}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Map container */}
        <div className="md:col-span-3 bg-white rounded-lg shadow">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold">Supplier Risk Map</h2>
            <p className="text-sm text-gray-500">
              {loading
                ? "Loading supplier locations..."
                : `Showing ${suppliers.length} suppliers with active risk overlays`}
            </p>
          </div>

          {error ? (
            <div className="p-8 text-center">
              <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <p className="text-red-500">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <ArrowPathIcon className="h-4 w-4 mr-2" />
                Retry
              </button>
            </div>
          ) : (
            <div className="h-[600px] w-full">
              <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <TileLayer
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />

                {/* Risk Overlays */}
                {Object.entries(countryRiskData).map(([country, risks]) => {
                  const activeRisks = risks.filter((risk) =>
                    activeRiskTypes.includes(risk)
                  );

                  if (activeRisks.length === 0) return null;

                  return (
                    <RiskOverlay
                      key={country}
                      country={country}
                      riskTypes={activeRisks}
                    />
                  );
                })}

                {/* Supplier Markers */}
                {!loading &&
                  suppliers.map((supplier) => {
                    const coordinates = countryCoordinates[
                      supplier.country
                    ] || [0, 0];

                    if (coordinates[0] === 0 && coordinates[1] === 0)
                      return null;

                    const hasRisks = countryRiskData[supplier.country]?.some(
                      (risk) => activeRiskTypes.includes(risk)
                    );

                    return (
                      <Marker
                        key={supplier.id}
                        position={[coordinates[0], coordinates[1]]}
                        icon={L.divIcon({
                          className: "custom-div-icon",
                          html: `<div style="background-color: ${
                            hasRisks ? "#ef4444" : "#3b82f6"
                          }; width: 10px; height: 10px; border-radius: 50%; border: 2px solid white;"></div>`,
                          iconSize: [12, 12],
                          iconAnchor: [6, 6],
                        })}
                      >
                        <Popup>
                          <div className="p-2">
                            <h3 className="font-bold">{supplier.name}</h3>
                            <p className="text-sm">
                              <span className="font-semibold">Country:</span>{" "}
                              {supplier.country}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">Industry:</span>{" "}
                              {supplier.industry || "N/A"}
                            </p>
                            <p className="text-sm">
                              <span className="font-semibold">
                                Ethical Score:
                              </span>{" "}
                              <span
                                className={
                                  (supplier.ethical_score || 0) > 75
                                    ? "text-green-600"
                                    : (supplier.ethical_score || 0) > 50
                                    ? "text-yellow-600"
                                    : "text-red-600"
                                }
                              >
                                {supplier.ethical_score || "N/A"}
                              </span>
                            </p>

                            {/* Risk warnings if any */}
                            {countryRiskData[supplier.country] && (
                              <div className="mt-2 pt-2 border-t">
                                <p className="text-sm font-semibold text-red-600 flex items-center">
                                  <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                                  Risk Factors:
                                </p>
                                <ul className="text-xs mt-1">
                                  {countryRiskData[supplier.country]
                                    .filter((risk) =>
                                      activeRiskTypes.includes(risk)
                                    )
                                    .map((risk) => (
                                      <li
                                        key={risk}
                                        className="flex items-center mt-1"
                                        style={{ color: riskTypes[risk].color }}
                                      >
                                        {riskTypes[risk].icon}
                                        <span className="ml-1">
                                          {riskTypes[risk].name}
                                        </span>
                                      </li>
                                    ))}
                                </ul>
                              </div>
                            )}
                          </div>
                        </Popup>
                      </Marker>
                    );
                  })}
              </MapContainer>
            </div>
          )}
        </div>

        {/* Alerts panel */}
        <div
          className={`bg-white rounded-lg shadow ${
            showAlerts ? "block" : "hidden md:block"
          }`}
        >
          <div className="p-4 border-b flex justify-between items-center">
            <h2 className="text-lg font-semibold">Recent Alerts</h2>
            {unreadAlertsCount > 0 && (
              <span className="bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
                {unreadAlertsCount} New
              </span>
            )}
          </div>

          <div className="p-2 max-h-[550px] overflow-y-auto">
            {alerts.length > 0 ? (
              <div className="divide-y divide-gray-200">
                {alerts.map((alert) => (
                  <div
                    key={alert.id}
                    className={`p-3 hover:bg-gray-50 cursor-pointer transition-all ${
                      !alert.read ? "bg-blue-50" : ""
                    }`}
                    onClick={() => markAlertAsRead(alert.id)}
                  >
                    <div className="flex justify-between">
                      <p
                        className="text-sm font-semibold"
                        style={{ color: riskTypes[alert.type]?.color }}
                      >
                        {alert.title}
                      </p>
                      {!alert.read && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-1.5 py-0.5 rounded-full">
                          New
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 mt-1">{alert.date}</p>
                    <p className="text-sm mt-1">{alert.description}</p>
                    <div className="flex mt-2">
                      <span
                        className="text-xs px-2 py-1 rounded-full"
                        style={{
                          backgroundColor: `${riskTypes[alert.type]?.color}20`,
                          color: riskTypes[alert.type]?.color,
                        }}
                      >
                        {riskTypes[alert.type]?.name}
                      </span>
                      <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-800 ml-2">
                        {alert.country}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 text-center text-gray-500">
                <BellIcon className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                <p>No recent alerts</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Help/Tutorial Modal */}
      {showTutorial && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">How to Use the Risk Map</h2>
                <button
                  onClick={() => setShowTutorial(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
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

              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg">Map Overview</h3>
                  <p className="text-gray-600">
                    The Geo-AI Risk Map visualizes your suppliers on a world
                    map, overlaid with various risk factors that might affect
                    your supply chain.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Risk Overlays</h3>
                  <p className="text-gray-600 mb-2">
                    Each colored overlay represents a different type of risk.
                    You can toggle them on/off using the buttons above the map.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {Object.entries(riskTypes).map(
                      ([key, { name, color, icon, description }]) => (
                        <div
                          key={key}
                          className="flex p-3 rounded-lg"
                          style={{
                            backgroundColor: `${color}10`,
                            borderLeft: `4px solid ${color}`,
                          }}
                        >
                          <div className="mr-3">{icon}</div>
                          <div>
                            <h4 className="font-semibold" style={{ color }}>
                              {name}
                            </h4>
                            <p className="text-xs text-gray-600">
                              {description}
                            </p>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Alerts System</h3>
                  <p className="text-gray-600">
                    The alerts panel shows real-time notifications about
                    emerging risks that could affect your suppliers. Click on an
                    alert to mark it as read.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-lg">Supplier Markers</h3>
                  <p className="text-gray-600">
                    Each dot on the map represents a supplier. Red markers
                    indicate suppliers in high-risk regions. Click on a marker
                    to see detailed information and specific risks affecting
                    that supplier.
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t">
                <button
                  onClick={() => setShowTutorial(false)}
                  className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Got it
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default GeoRiskMapping;
