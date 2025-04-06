import { useEffect, useState } from "react";
import { getDashboardData } from "../services/api";
import {
  GlobeAltIcon,
  ScaleIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  CloudIcon,
  SparklesIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  ReferenceLine,
} from "recharts";

// Import our custom tooltip components and chart info overlay
import {
  EthicalScoreTooltip,
  CO2EmissionsTooltip,
  WaterUsageTooltip,
  RenewableEnergyTooltip,
  SustainablePracticesTooltip,
  SustainabilityMetricsTooltip,
} from "../components/ChartTooltips";
import ChartInfoOverlay, {
  chartInfoContent,
} from "../components/ChartInfoOverlay";
import ChartMetricsExplainer from "../components/ChartMetricsExplainer";
import InsightsPanel, { chartInsights } from "../components/InsightsPanel";

// Define the dashboard data interface to fix type errors
interface EthicalScoreData {
  range: string;
  count: number;
}

interface CO2EmissionData {
  name: string;
  value: number;
}

interface DashboardData {
  total_suppliers: number;
  avg_ethical_score: number;
  avg_co2_emissions: number;
  suppliers_by_country: Record<string, number>;
  ethical_score_distribution: EthicalScoreData[];
  co2_emissions_by_industry: CO2EmissionData[];
  isMockData?: boolean;
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData>({
    total_suppliers: 0,
    avg_ethical_score: 0,
    avg_co2_emissions: 0,
    suppliers_by_country: {},
    ethical_score_distribution: [],
    co2_emissions_by_industry: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const dashboardData = await getDashboardData();
        console.log("Dashboard data received:", dashboardData);
        setData(dashboardData);

        // Check if we're using mock data based on the API indicator
        const isMock = dashboardData.isMockData === true;
        console.log("Using mock dashboard data:", isMock);
        setUsingMockData(isMock);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Using sample data instead.");
        setUsingMockData(true);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      name: "Total Suppliers",
      value: data.total_suppliers,
      icon: UserGroupIcon,
      change: "+4.75%",
      changeType: "positive",
      bgColor: "bg-emerald-100",
      iconBg: "bg-emerald-500",
    },
    {
      name: "Average Ethical Score",
      value: `${
        data.avg_ethical_score && data.avg_ethical_score.toFixed
          ? data.avg_ethical_score.toFixed(1)
          : "0"
      }%`,
      icon: ScaleIcon,
      change: "+2.3%",
      changeType: "positive",
      bgColor: "bg-teal-100",
      iconBg: "bg-teal-500",
    },
    {
      name: "Average CO₂ Emissions",
      value: `${
        data.avg_co2_emissions && data.avg_co2_emissions.toFixed
          ? data.avg_co2_emissions.toFixed(1)
          : "0"
      } t`,
      icon: CloudIcon,
      change: "-1.8%",
      changeType: "negative",
      bgColor: "bg-blue-100",
      iconBg: "bg-blue-500",
    },
    {
      name: "Countries",
      value: Object.keys(data.suppliers_by_country || {}).length,
      icon: GlobeAltIcon,
      change: "+2",
      changeType: "positive",
      bgColor: "bg-green-100",
      iconBg: "bg-green-500",
    },
  ];

  const COLORS = [
    "#10b981", // emerald-500
    "#0ea5e9", // sky-500
    "#14b8a6", // teal-500
    "#22c55e", // green-500
    "#84cc16", // lime-500
    "#06b6d4", // cyan-500
  ];

  // Water usage trend data
  const waterUsageTrendData = [
    { month: "Jan", usage: 132 },
    { month: "Feb", usage: 125 },
    { month: "Mar", usage: 116 },
    { month: "Apr", usage: 107 },
    { month: "May", usage: 102 },
    { month: "Jun", usage: 95 },
    { month: "Jul", usage: 90 },
    { month: "Aug", usage: 88 },
    { month: "Sep", usage: 86 },
  ];

  // Renewable energy adoption
  const renewableEnergyData = [
    { name: "Solar", value: 35 },
    { name: "Wind", value: 28 },
    { name: "Hydro", value: 12 },
    { name: "Biomass", value: 8 },
    { name: "Traditional", value: 17 },
  ];

  // Sustainable practices adoption data
  const sustainablePracticesData = [
    { practice: "Recycling", adoption: 78, target: 95 },
    { practice: "Waste Reduction", adoption: 65, target: 90 },
    { practice: "Green Packaging", adoption: 52, target: 85 },
    { practice: "Carbon Offsets", adoption: 45, target: 75 },
    { practice: "Circularity", adoption: 38, target: 80 },
  ];

  // Sustainability metrics radar chart data
  const sustainabilityMetricsData = [
    { metric: "CO₂ Reduction", current: 65, industry: 48 },
    { metric: "Water Conservation", current: 72, industry: 53 },
    { metric: "Waste Management", current: 58, industry: 45 },
    { metric: "Renewable Energy", current: 83, industry: 62 },
    { metric: "Social Impact", current: 70, industry: 58 },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Sustainability Dashboard
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Loading sustainability data...
          </p>
        </div>
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Sustainability Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md p-4 sm:p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div>
            <h1 className="text-2xl font-bold text-white">
              EthicSupply Sustainability Report
            </h1>
            <p className="mt-1 text-emerald-100">
              Helping your supply chain reach carbon neutrality by 2030
            </p>
          </div>
          <div className="mt-4 sm:mt-0 bg-white bg-opacity-20 rounded-lg px-4 py-3 text-center">
            <div className="text-3xl font-bold text-white">73.5%</div>
            <div className="text-xs text-emerald-100">
              Overall Sustainability Score
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center h-64">
          <ArrowPathIcon className="h-8 w-8 text-emerald-500 animate-spin" />
          <span className="ml-2 text-emerald-700">
            Loading dashboard data...
          </span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border-l-4 border-red-400 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-8">
          {usingMockData && (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
              <div className="flex">
                <div className="flex-shrink-0">
                  <ExclamationCircleIcon className="h-5 w-5 text-blue-400" />
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Using demo data. Connect to the API for real-time
                    information.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {stats.map((item) => (
              <div
                key={item.name}
                className={`relative overflow-hidden rounded-lg ${item.bgColor} px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6 transition-transform duration-300 hover:scale-105`}
              >
                <dt>
                  <div className={`absolute rounded-md ${item.iconBg} p-3`}>
                    <item.icon
                      className="h-6 w-6 text-white"
                      aria-hidden="true"
                    />
                  </div>
                  <p className="ml-16 truncate text-sm font-medium text-gray-700">
                    {item.name}
                  </p>
                </dt>
                <dd className="ml-16 flex items-baseline pb-6 sm:pb-7">
                  <p className="text-2xl font-semibold text-gray-900">
                    {item.value}
                  </p>
                  <p
                    className={`ml-2 flex items-baseline text-sm font-semibold ${
                      item.changeType === "positive"
                        ? "text-green-600"
                        : "text-red-600"
                    }`}
                  >
                    {item.change}
                  </p>
                </dd>
              </div>
            ))}
          </div>

          {/* Rest of the dashboard content */}
          {/* ... */}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
