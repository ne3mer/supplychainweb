import { useEffect, useState } from "react";
import { getDashboardData } from "../services/api";
import {
  ChartBarIcon,
  GlobeAltIcon,
  ScaleIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
  ArrowTrendingUpIcon,
  LightBulbIcon,
  FireIcon,
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
  LineChart,
  Line,
  Area,
  AreaChart,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ComposedChart,
  Scatter,
  ReferenceLine,
} from "recharts";

const Dashboard = () => {
  const [data, setData] = useState({
    total_suppliers: 0,
    avg_ethical_score: 0,
    avg_co2_emissions: 0,
    suppliers_by_country: {},
    ethical_score_distribution: [],
    co2_emissions_by_industry: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
    <div className="space-y-8 bg-neutral-50">
      <div className="px-4 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-bold">Sustainability Dashboard</h1>
        <p className="mt-2 text-emerald-100">
          Monitoring the environmental and ethical impact of your supply chain
        </p>
      </div>

      {usingMockData && (
        <div className="rounded-md bg-blue-50 p-4 border-l-4 border-blue-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                Note: Using sample data as the backend API is not available.
                Connect to the backend server to see real-time data.
              </p>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-yellow-50 p-4 border-l-4 border-yellow-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationCircleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
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
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
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

      {/* Charts Row 1 */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Ethical Score Distribution */}
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <ScaleIcon className="h-6 w-6 text-emerald-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Ethical Score Distribution
            </h2>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ethical_score_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderColor: "#d1d5db",
                    borderRadius: "6px",
                  }}
                />
                <Bar dataKey="count" fill="#10b981" radius={[4, 4, 0, 0]}>
                  {(data.ethical_score_distribution || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          entry.range === "81-100"
                            ? "#059669"
                            : entry.range === "61-80"
                            ? "#10b981"
                            : entry.range === "41-60"
                            ? "#14b8a6"
                            : entry.range === "21-40"
                            ? "#f59e0b"
                            : "#ef4444"
                        }
                      />
                    )
                  )}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO₂ Emissions by Industry */}
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <CloudIcon className="h-6 w-6 text-blue-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              CO₂ Emissions by Industry
            </h2>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.co2_emissions_by_industry || []}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {(data.co2_emissions_by_industry || []).map(
                    (entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    )
                  )}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderColor: "#d1d5db",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Charts Row 2 - New Sustainability Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Water Usage Trend */}
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <CloudIcon className="h-6 w-6 text-cyan-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Water Usage Trend (Gallons/Unit)
            </h2>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart
                data={waterUsageTrendData}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderColor: "#d1d5db",
                    borderRadius: "6px",
                  }}
                />
                <defs>
                  <linearGradient
                    id="waterGradient"
                    x1="0"
                    y1="0"
                    x2="0"
                    y2="1"
                  >
                    <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0.1} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="usage"
                  stroke="#0ea5e9"
                  fillOpacity={1}
                  fill="url(#waterGradient)"
                />
                <ReferenceLine
                  y={100}
                  label="Target"
                  stroke="#10b981"
                  strokeDasharray="3 3"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            Water usage has decreased by 34.8% since January
          </div>
        </div>

        {/* Renewable Energy Adoption */}
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <LightBulbIcon className="h-6 w-6 text-amber-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Renewable Energy Adoption
            </h2>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={renewableEnergyData}
                  cx="50%"
                  cy="50%"
                  labelLine={true}
                  outerRadius={80}
                  innerRadius={40}
                  fill="#8884d8"
                  dataKey="value"
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {renewableEnergyData.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={
                        entry.name === "Traditional"
                          ? "#9ca3af"
                          : COLORS[index % COLORS.length]
                      }
                    />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderColor: "#d1d5db",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            83% of supplier energy comes from renewable sources
          </div>
        </div>
      </div>

      {/* Charts Row 3 - More Sustainability Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Sustainable Practices Adoption */}
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <ArrowPathIcon className="h-6 w-6 text-green-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Sustainable Practices Adoption
            </h2>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart
                data={sustainablePracticesData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="practice" />
                <YAxis domain={[0, 100]} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderColor: "#d1d5db",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
                <Bar
                  dataKey="adoption"
                  fill="#22c55e"
                  radius={[4, 4, 0, 0]}
                  name="Current Adoption (%)"
                />
                <Line
                  type="monotone"
                  dataKey="target"
                  stroke="#064e3b"
                  strokeWidth={2}
                  name="Target (%)"
                  dot={{ r: 5 }}
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            Tracking adoption of key sustainable practices against targets
          </div>
        </div>

        {/* Sustainability Metrics Radar */}
        <div className="rounded-lg bg-white p-6 shadow-md hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center mb-4">
            <SparklesIcon className="h-6 w-6 text-emerald-500 mr-2" />
            <h2 className="text-lg font-medium text-gray-900">
              Sustainability Performance vs. Industry
            </h2>
          </div>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart outerRadius={90} data={sustainabilityMetricsData}>
                <PolarGrid stroke="#e5e7eb" />
                <PolarAngleAxis dataKey="metric" />
                <PolarRadiusAxis angle={30} domain={[0, 100]} />
                <Radar
                  name="Your Supply Chain"
                  dataKey="current"
                  stroke="#10b981"
                  fill="#10b981"
                  fillOpacity={0.6}
                />
                <Radar
                  name="Industry Average"
                  dataKey="industry"
                  stroke="#6366f1"
                  fill="#6366f1"
                  fillOpacity={0.3}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#f9fafb",
                    borderColor: "#d1d5db",
                    borderRadius: "6px",
                  }}
                />
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-sm text-gray-500 text-center">
            Your supply chain performance compared to industry averages
          </div>
        </div>
      </div>

      {/* Footer section */}
      <div className="bg-gradient-to-r from-teal-700 to-emerald-700 rounded-lg p-6 text-white shadow-md">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div>
            <h3 className="text-lg font-medium">
              EthicSupply Sustainability Report
            </h3>
            <p className="text-sm text-teal-100 mt-1">
              Helping your supply chain reach carbon neutrality by 2030
            </p>
          </div>
          <div className="flex items-center mt-4 md:mt-0">
            <ArrowTrendingUpIcon className="h-8 w-8 text-emerald-300 mr-2" />
            <span className="text-xl font-bold">
              73.5% Overall Sustainability Score
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
