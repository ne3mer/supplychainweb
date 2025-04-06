import { useState, useEffect } from "react";
import {
  GlobeAltIcon,
  ExclamationTriangleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
  BellIcon,
  ShieldExclamationIcon,
  FireIcon,
  CloudIcon,
  ScaleIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import { getSuppliers } from "../services/api";

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
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeRiskTypes, setActiveRiskTypes] = useState<string[]>(
    Object.keys(riskTypes)
  );
  const [alerts, setAlerts] = useState<Alert[]>(initialAlerts);
  const [showAlerts, setShowAlerts] = useState<boolean>(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        await getSuppliers(); // Just to simulate API call
        setLoading(false);
      } catch (err) {
        console.error("Error fetching supplier data:", err);
        setError("Failed to load supplier data. Please try again later.");
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const markAlertAsRead = (alertId: number) => {
    setAlerts(
      alerts.map((alert) =>
        alert.id === alertId ? { ...alert, read: true } : alert
      )
    );
  };

  const toggleRiskType = (riskType: string) => {
    setActiveRiskTypes(
      activeRiskTypes.includes(riskType)
        ? activeRiskTypes.filter((type) => type !== riskType)
        : [...activeRiskTypes, riskType]
    );
  };

  const unreadAlerts = alerts.filter((alert) => !alert.read).length;

  return (
    <div className="container mx-auto py-6 px-4">
      <div className="flex flex-col md:flex-row justify-between items-start mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center">
            <GlobeAltIcon className="h-6 w-6 text-indigo-600 mr-2" />
            Geopolitical Risk Mapping
          </h1>
          <p className="text-gray-600 mt-1">
            Monitor and analyze global supply chain risks across regions
          </p>
        </div>

        {/* Alert button */}
        <div className="mt-4 md:mt-0">
          <button
            onClick={() => setShowAlerts(!showAlerts)}
            className="relative inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {unreadAlerts > 0 ? (
              <>
                <BellIcon className="h-5 w-5 mr-2 animate-pulse" />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                  {unreadAlerts}
                </span>
              </>
            ) : (
              <BellIcon className="h-5 w-5 mr-2" />
            )}
            Alerts
          </button>
        </div>
      </div>

      {/* Filter options */}
      <div className="bg-white p-4 rounded-lg shadow mb-4">
        <h2 className="text-sm font-medium text-gray-700 mb-2">
          Filter Risk Types
        </h2>
        <div className="flex flex-wrap gap-2">
          {Object.entries(riskTypes).map(([key, risk]) => (
            <button
              key={key}
              onClick={() => toggleRiskType(key)}
              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${
                activeRiskTypes.includes(key)
                  ? `bg-${risk.color.substring(1)} text-white`
                  : "bg-gray-100 text-gray-800"
              }`}
              style={{
                backgroundColor: activeRiskTypes.includes(key)
                  ? risk.color
                  : "#f3f4f6",
                color: activeRiskTypes.includes(key) ? "white" : "#1f2937",
              }}
            >
              <span className="mr-1">{risk.icon}</span>
              {risk.name}
            </button>
          ))}
        </div>
      </div>

      {/* Main content */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-12 text-center">
            <ArrowPathIcon className="h-12 w-12 text-gray-400 animate-spin mx-auto" />
            <p className="mt-4 text-gray-600">Loading risk data...</p>
          </div>
        ) : error ? (
          <div className="p-12 text-center">
            <ExclamationTriangleIcon className="h-12 w-12 text-red-500 mx-auto" />
            <p className="mt-4 text-red-500">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
        ) : (
          <div className="p-12 text-center">
            <div className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">
                Interactive Risk Map
              </h2>
              <p className="text-gray-600 mb-6">
                The interactive geopolitical risk map is currently being
                upgraded to improve performance. Please check back soon for the
                full visualization.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg inline-block">
                <div className="flex items-start">
                  <InformationCircleIcon className="h-5 w-5 text-blue-500 mr-2 mt-0.5" />
                  <div className="text-left">
                    <p className="text-blue-700 text-sm font-medium">
                      Supply chain risk data is available
                    </p>
                    <p className="text-blue-600 text-xs mt-1">
                      You can still view and manage risk alerts below while the
                      map visualization is being updated.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Alerts panel */}
            {showAlerts && (
              <div className="mt-6 bg-white rounded-lg shadow-lg border border-gray-200 p-4 max-w-2xl mx-auto">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="font-semibold text-gray-900">Recent Alerts</h3>
                  <span className="text-xs text-gray-500">
                    {unreadAlerts} unread
                  </span>
                </div>
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-3 rounded-lg border ${
                        alert.read
                          ? "border-gray-200 bg-white"
                          : "border-indigo-200 bg-indigo-50"
                      }`}
                    >
                      <div className="flex justify-between">
                        <div className="flex items-center">
                          <span
                            className="w-2 h-2 rounded-full mr-2"
                            style={{
                              backgroundColor:
                                riskTypes[alert.type as keyof typeof riskTypes]
                                  ?.color || "#000",
                            }}
                          ></span>
                          <h4 className="font-medium text-sm">{alert.title}</h4>
                        </div>
                        <span className="text-xs text-gray-500">
                          {alert.date}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        {alert.description}
                      </p>
                      <div className="flex justify-between items-center mt-2">
                        <span className="text-xs text-gray-500">
                          {alert.country}
                        </span>
                        {!alert.read && (
                          <button
                            onClick={() => markAlertAsRead(alert.id)}
                            className="text-xs text-indigo-600 hover:text-indigo-800"
                          >
                            Mark as read
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GeoRiskMapping;
