import { useEffect, useState } from "react";
import { getDashboardData } from "../services/api";
import {
  ChartBarIcon,
  GlobeAltIcon,
  ScaleIcon,
  UserGroupIcon,
  ExclamationCircleIcon,
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
        setData(dashboardData);

        // Check if we're using mock data based on the API indicator
        // The API or the service function may set this flag
        setUsingMockData(dashboardData.isMockData === true);
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
    },
    {
      name: "Average Ethical Score",
      value: `${data.avg_ethical_score.toFixed(1)}%`,
      icon: ScaleIcon,
      change: "+2.3%",
      changeType: "positive",
    },
    {
      name: "Average CO₂ Emissions",
      value: `${data.avg_co2_emissions.toFixed(1)} t`,
      icon: GlobeAltIcon,
      change: "-1.8%",
      changeType: "negative",
    },
    {
      name: "Countries",
      value: Object.keys(data.suppliers_by_country).length,
      icon: ChartBarIcon,
      change: "+2",
      changeType: "positive",
    },
  ];

  const COLORS = [
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#8884D8",
    "#82ca9d",
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
          <p className="mt-2 text-sm text-gray-700">
            Loading dashboard data...
          </p>
        </div>
        <div className="bg-white shadow sm:rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-sm text-gray-700">
          Overview of your supply chain sustainability metrics
        </p>
      </div>

      {usingMockData && (
        <div className="rounded-md bg-blue-50 p-4">
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
        <div className="rounded-md bg-yellow-50 p-4">
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
            className="relative overflow-hidden rounded-lg bg-white px-4 pt-5 pb-12 shadow sm:px-6 sm:pt-6"
          >
            <dt>
              <div className="absolute rounded-md bg-primary-500 p-3">
                <item.icon className="h-6 w-6 text-white" aria-hidden="true" />
              </div>
              <p className="ml-16 truncate text-sm font-medium text-gray-500">
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

      {/* Charts */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Ethical Score Distribution */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">
            Ethical Score Distribution
          </h2>
          <div className="mt-4 h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.ethical_score_distribution || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="count" fill="#0ea5e9" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CO₂ Emissions by Industry */}
        <div className="rounded-lg bg-white p-6 shadow">
          <h2 className="text-lg font-medium text-gray-900">
            CO₂ Emissions by Industry
          </h2>
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
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
