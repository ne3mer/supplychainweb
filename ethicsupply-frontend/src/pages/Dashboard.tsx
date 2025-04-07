import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ArrowTrendingUpIcon,
  ExclamationCircleIcon,
  ArrowPathIcon,
  ArrowRightIcon,
  ShieldExclamationIcon,
  GlobeAltIcon,
  InformationCircleIcon,
  UsersIcon,
  ScaleIcon,
  CloudIcon,
  SparklesIcon,
  LightBulbIcon,
  CheckCircleIcon,
  Activity,
  BuildingOfficeIcon,
  CheckBadgeIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  ClipboardDocumentCheckIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Cell,
  PieChart,
  Pie,
  AreaChart,
  Area,
  ComposedChart,
  Line,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ReferenceLine,
} from "recharts";
import { getDashboardData } from "../services/api";
import MachineLearningStatus from "../components/MachineLearningStatus";
import EthicalScoreDistributionChart from "../components/EthicalScoreDistributionChart";
import CO2EmissionsChart from "../components/CO2EmissionsChart";
import SupplierGeoChart from "../components/SupplierGeoChart";
import RecentSuppliersList from "../components/RecentSuppliersList";
import EthicalScoreTooltip from "../components/tooltips/EthicalScoreTooltip";
import CO2EmissionsTooltip from "../components/tooltips/CO2EmissionsTooltip";
import WaterUsageTooltip from "../components/tooltips/WaterUsageTooltip";
import RenewableEnergyTooltip from "../components/tooltips/RenewableEnergyTooltip";
import SustainablePracticesTooltip from "../components/tooltips/SustainablePracticesTooltip";
import SustainabilityMetricsTooltip from "../components/tooltips/SustainabilityMetricsTooltip";
import ChartInfoOverlay from "../components/ChartInfoOverlay";
import ChartMetricsExplainer from "../components/ChartMetricsExplainer";
import InsightsPanel, { chartInsights } from "../components/InsightsPanel";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { DashboardData } from "../services/api";

// Constant needed for pie chart calculations
const RADIAN = Math.PI / 180;

// Define chart info content
const chartInfoContent = {
  ethicalScore: {
    title: "Ethical Score Distribution",
    description:
      "Distribution of suppliers across ethical score ranges from 0-100.",
  },
  co2Emissions: {
    title: "CO₂ Emissions by Industry",
    description:
      "Carbon emissions breakdown by industry sector in your supply chain.",
  },
  waterUsage: {
    title: "Water Usage Trend",
    description: "Monthly water consumption per production unit over time.",
  },
  renewableEnergy: {
    title: "Renewable Energy Adoption",
    description: "Breakdown of energy sources used across your supply chain.",
  },
  sustainablePractices: {
    title: "Sustainable Practices Adoption",
    description:
      "Current adoption rates versus target goals for key sustainable practices.",
  },
  sustainabilityMetrics: {
    title: "Sustainability Performance",
    description: "Your sustainability metrics compared to industry averages.",
  },
  riskBreakdown: {
    title: "Risk Breakdown",
    description: "Distribution of suppliers by risk category",
  },
  industryDistribution: {
    title: "Industry Distribution",
    description: "Breakdown of suppliers by industry sector",
  },
  complianceRate: {
    title: "Compliance Rate Trend",
    description: "Monthly supplier compliance rate over the past year",
  },
};

// Define colors for charts
const COLORS = [
  "#10B981",
  "#3B82F6",
  "#8B5CF6",
  "#EC4899",
  "#F59E0B",
  "#EF4444",
];

// Sample data for sustainable practices
const sustainablePracticesData = [
  { practice: "Recycling", adoption: 92, target: 95 },
  { practice: "Emissions Reduction", adoption: 68, target: 80 },
  { practice: "Water Conservation", adoption: 76, target: 85 },
  { practice: "Renewable Energy", adoption: 83, target: 90 },
  { practice: "Zero Waste", adoption: 54, target: 75 },
];

// Sample data for water usage trend
const waterUsageTrendData = [
  { month: "Jan", usage: 135 },
  { month: "Feb", usage: 128 },
  { month: "Mar", usage: 124 },
  { month: "Apr", usage: 118 },
  { month: "May", usage: 113 },
  { month: "Jun", usage: 108 },
  { month: "Jul", usage: 102 },
  { month: "Aug", usage: 94 },
  { month: "Sep", usage: 89 },
  { month: "Oct", usage: 86 },
  { month: "Nov", usage: 82 },
  { month: "Dec", usage: 79 },
];

// Sample data for renewable energy adoption
const renewableEnergyData = [
  { name: "Solar", value: 38 },
  { name: "Wind", value: 27 },
  { name: "Hydro", value: 12 },
  { name: "Biomass", value: 6 },
  { name: "Traditional", value: 17 },
];

// Sample data for sustainability metrics
const sustainabilityMetricsData = [
  { metric: "Carbon Footprint", current: 82, industry: 68 },
  { metric: "Water Usage", current: 76, industry: 62 },
  { metric: "Waste Reduction", current: 91, industry: 59 },
  { metric: "Energy Efficiency", current: 84, industry: 71 },
  { metric: "Social Impact", current: 70, industry: 58 },
];

// Define the dashboard data interface to fix type errors
interface DashboardData {
  total_suppliers: number;
  avg_ethical_score: number;
  avg_co2_emissions: number;
  suppliers_by_country: Record<string, number>;
  ethical_score_distribution: Array<{ range: string; count: number }>;
  co2_emissions_by_industry: Array<{ name: string; value: number }>;
  risk_breakdown: { [key: string]: number };
  water_usage_trend: Array<{ month: string; usage: number }>;
  renewable_energy_adoption: Array<{ name: string; value: number }>;
  sustainable_practices: Array<{
    practice: string;
    adoption: number;
    target: number;
  }>;
  sustainability_metrics: Array<{
    metric: string;
    current: number;
    industry: number;
  }>;
  recent_suppliers: Array<{
    id: number;
    name: string;
    country: string;
    ethical_score: number;
    trend: string;
    date: string;
  }>;
  industry_distribution: Record<string, number>;
  compliance_rate_trend: Array<{ month: string; rate: number }>;
  isMockData?: boolean;
}

const apiEndpoint = "/api/dashboard/";

const Dashboard: React.FC = () => {
  const [data, setData] = useState<DashboardData>({
    total_suppliers: 0,
    avg_ethical_score: 0,
    avg_co2_emissions: 0,
    suppliers_by_country: {},
    ethical_score_distribution: [],
    co2_emissions_by_industry: [],
    risk_breakdown: {},
    water_usage_trend: [],
    renewable_energy_adoption: [],
    sustainable_practices: [],
    sustainability_metrics: [],
    recent_suppliers: [],
    industry_distribution: {},
    compliance_rate_trend: [],
  });
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [usingMockData, setUsingMockData] = useState<boolean>(false);
  const [apiConnected, setApiConnected] = useState<boolean | null>(null);

  const [onboardingPending, setOnboardingPending] = useState(0);
  const [complianceRate, setComplianceRate] = useState(0);

  const [suppliers, setSuppliers] = useState<Array<any>>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [totalSuppliers, setTotalSuppliers] = useState(0);
  const [avgEthicalScore, setAvgEthicalScore] = useState(0);
  const [co2Emissions, setCo2Emissions] = useState(0);
  const [riskBreakdown, setRiskBreakdown] = useState<Record<string, number>>(
    {}
  );
  const [industryDistribution, setIndustryDistribution] = useState<
    Record<string, number>
  >({});
  const [ethicalScoreDistribution, setEthicalScoreDistribution] = useState<
    Array<{ range: string; count: number }>
  >([]);
  const [co2ByIndustry, setCo2ByIndustry] = useState<
    Array<{ name: string; value: number }>
  >([]);

  // Chart state for tooltips
  const [activeChart, setActiveChart] = useState<string | null>(null);
  const [showInfoModal, setShowInfoModal] = useState(false);
  const [chartTitle, setChartTitle] = useState("");
  const [chartDesc, setChartDesc] = useState("");

  // Function to get text description based on ethical score
  const getEthicalScoreText = () => {
    const score = data?.avg_ethical_score || 0;
    if (score >= 80) return "excellent ethical performance";
    if (score >= 60) return "good ethical standards";
    if (score >= 40) return "moderate ethical practices";
    if (score >= 20) return "needs significant improvement";
    return "critical ethical concerns";
  };

  // Stats data for the dashboard
  const stats = [
    {
      name: "Total Suppliers",
      value: data?.total_suppliers || 0,
      icon: UsersIcon,
      change: "+12.5%",
      changeType: "positive",
      bgColor: "bg-blue-50",
      iconBg: "bg-blue-500",
    },
    {
      name: "Avg. Ethical Score",
      value: `${(data?.avg_ethical_score || 0).toFixed(1)}%`,
      icon: ScaleIcon,
      change: "+4.2%",
      changeType: "positive",
      bgColor: "bg-emerald-50",
      iconBg: "bg-emerald-500",
    },
    {
      name: "CO₂ Emissions",
      value: `${(data?.avg_co2_emissions || 0).toFixed(1)}t`,
      icon: CloudIcon,
      change: "-8.1%",
      changeType: "positive",
      bgColor: "bg-teal-50",
      iconBg: "bg-teal-500",
    },
    {
      name: "Risk Score",
      value: "Medium",
      icon: ShieldExclamationIcon,
      change: "-2.3%",
      changeType: "positive",
      bgColor: "bg-amber-50",
      iconBg: "bg-amber-500",
    },
  ];

  // Function to check API connection
  const checkConnection = async () => {
    try {
      const response = await fetch("/api/health-check/");
      setApiConnected(response.status === 200);
    } catch (error) {
      console.error("API connection error:", error);
      setApiConnected(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // First check the API connection
        await checkConnection();

        // Fetch data from the API
        const dashboardData = await getDashboardData();

        // Set the state with the returned data
        setTotalSuppliers(dashboardData.total_suppliers);
        setAvgEthicalScore(dashboardData.avg_ethical_score);
        setCo2Emissions(dashboardData.avg_co2_emissions);
        setEthicalScoreDistribution(dashboardData.ethical_score_distribution);
        setCo2ByIndustry(dashboardData.co2_emissions_by_industry);
        setRiskBreakdown(dashboardData.risk_breakdown);
        setIndustryDistribution(dashboardData.industry_distribution);
        setComplianceRate(dashboardData.compliance_rate_trend);
        setWaterUsageData(dashboardData.water_usage_trend);
        setRenewableEnergyData(dashboardData.renewable_energy_adoption);
        setSustainablePracticesData(dashboardData.sustainable_practices);
        setSustainabilityMetricsData(dashboardData.sustainability_metrics);
        setRecentSuppliers(dashboardData.recent_suppliers);

        // Set onboarding pending (assume 3 suppliers are pending for this example)
        setOnboardingPending(3);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        setError("Failed to load dashboard data. Please try again later.");
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInfoClick = (type: string) => {
    setActiveChart(type);
    setChartTitle(
      chartInfoContent[type as keyof typeof chartInfoContent].title
    );
    setChartDesc(
      chartInfoContent[type as keyof typeof chartInfoContent].description
    );
    setShowInfoModal(true);
  };

  // Custom Pie Chart label renderer
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    index,
    name,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor={x > cx ? "start" : "end"}
        dominantBaseline="central"
        className="text-xs"
      >
        {`${name} ${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Risk color mapping
  const getRiskColor = (risk: string) => {
    const riskColorMap: Record<string, string> = {
      "Low Risk": "#10B981",
      "Medium Risk": "#F59E0B",
      "High Risk": "#EF4444",
      "Critical Risk": "#7F1D1D",
    };
    return riskColorMap[risk] || "#9CA3AF";
  };

  if (loading) {
    return (
      <div className="dashboard-container min-h-screen flex items-center justify-center">
        <div className="dashboard-card p-8 text-center">
          <div className="flex justify-center mb-4">
            <svg
              className="animate-spin h-10 w-10 text-indigo-600"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            Loading Dashboard Data
          </h2>
          <p className="text-gray-500 mt-2">
            Retrieving your supply chain analytics...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container min-h-screen flex items-center justify-center">
        <div className="dashboard-card p-8 text-center">
          <div className="flex justify-center mb-4 text-red-500">
            <ExclamationCircleIcon className="h-12 w-12" />
          </div>
          <h2 className="text-xl font-semibold text-gray-700">
            Error Loading Dashboard
          </h2>
          <p className="text-gray-500 mt-2">{error}</p>
          <button
            className="mt-4 btn btn-primary"
            onClick={() => window.location.reload()}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Sustainability Banner */}
      <div className="gradient-blue-purple dashboard-header bg-pattern text-white">
        <div className="absolute top-0 right-0 opacity-20">
          <svg
            className="w-24 h-24 md:w-32 md:h-32"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M12 3V21M3 12H21"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
            <path
              d="M7 8L17 16M7 16L17 8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">
              Supply Chain Sustainability
            </h1>
            <p className="text-blue-100 mt-2 max-w-2xl">
              Your supply chain sustainability report shows aggregated metrics
              across all suppliers. This dashboard helps identify risk areas and
              opportunities for improvement.
            </p>
          </div>
          <div className="flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4">
            <div className="mr-3">
              <div className="text-sm font-medium text-blue-100">
                Overall Score
              </div>
              <div className="text-3xl font-bold">
                {data?.avg_ethical_score?.toFixed(1) || "0.0"}
                <span className="text-lg">/100</span>
              </div>
            </div>
            <div className="h-16 w-16">
              <CircularProgressbar
                value={data?.avg_ethical_score || 0}
                text={`${data?.avg_ethical_score?.toFixed(1) || "0.0"}`}
                styles={buildStyles({
                  textColor: "white",
                  pathColor:
                    data?.avg_ethical_score >= 70 ? "#10B981" : "#FBBF24",
                  trailColor: "rgba(255,255,255,0.2)",
                })}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="dashboard-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Total Suppliers
              </p>
              <p className="text-2xl font-bold mt-1">
                {data?.total_suppliers || 0}
              </p>
            </div>
            <div className="bg-blue-100 p-2 rounded-lg">
              <BuildingOfficeIcon className="h-6 w-6 text-blue-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">
              +{onboardingPending} pending
            </span>
            <span className="text-gray-400 ml-2">vs. last month</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Avg. Ethical Score
              </p>
              <p className="text-2xl font-bold mt-1">
                {data?.avg_ethical_score?.toFixed(1) || "0.0"}/100
              </p>
            </div>
            <div className="bg-green-100 p-2 rounded-lg">
              <CheckBadgeIcon className="h-6 w-6 text-green-600" />
            </div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className={`h-2 rounded-full ${
                  data?.avg_ethical_score >= 80
                    ? "bg-green-500"
                    : data?.avg_ethical_score >= 60
                    ? "bg-yellow-500"
                    : "bg-red-500"
                }`}
                style={{
                  width: `${data?.avg_ethical_score?.toFixed(1) || "0.0"}%`,
                }}
              ></div>
            </div>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">CO₂ Emissions</p>
              <p className="text-2xl font-bold mt-1">
                {data?.avg_co2_emissions?.toLocaleString() || "0"} tonnes
              </p>
            </div>
            <div className="bg-yellow-100 p-2 rounded-lg">
              <CloudIcon className="h-6 w-6 text-yellow-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowDownIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">-12%</span>
            <span className="text-gray-400 ml-2">vs. last year</span>
          </div>
        </div>

        <div className="dashboard-card">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-gray-500 text-sm font-medium">
                Compliance Rate
              </p>
              <p className="text-2xl font-bold mt-1">{complianceRate}%</p>
            </div>
            <div className="bg-purple-100 p-2 rounded-lg">
              <ClipboardDocumentCheckIcon className="h-6 w-6 text-purple-600" />
            </div>
          </div>
          <div className="mt-4 flex items-center text-sm">
            <ArrowUpIcon className="h-4 w-4 text-green-500 mr-1" />
            <span className="text-green-500 font-medium">+5%</span>
            <span className="text-gray-400 ml-2">vs. last quarter</span>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            Ethical Score Distribution
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={data.ethical_score_distribution.map(
                  ({ range, count }) => ({
                    range,
                    count,
                  })
                )}
                margin={{ top: 5, right: 20, left: 0, bottom: 25 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="range"
                  tick={{ fontSize: 12 }}
                  interval={0}
                  angle={-45}
                  textAnchor="end"
                />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip
                  formatter={(value) => [`${value} suppliers`, "Count"]}
                  labelFormatter={(label) => `Score ${label}`}
                />
                <Bar dataKey="count" fill="#6366F1" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="dashboard-card">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">
            CO₂ Emissions by Industry
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.co2_emissions_by_industry.map(
                    ({ name, value }) => ({
                      name,
                      value,
                    })
                  )}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  label={renderCustomizedLabel}
                >
                  {data.co2_emissions_by_industry.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value) => [
                    `${value.toLocaleString()} tonnes`,
                    "CO₂ Emissions",
                  ]}
                />
                <Legend verticalAlign="bottom" height={36} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Risk Breakdown & Industry Distribution Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Risk Breakdown Chart */}
        <div className="dashboard-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Risk Breakdown
              </h3>
              <p className="text-sm text-gray-500">
                Distribution of suppliers by risk category
              </p>
            </div>
            <ChartInfoOverlay content={chartInfoContent.riskBreakdown} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={Object.entries(riskBreakdown).map(([name, value]) => ({
                    name,
                    value,
                  }))}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) =>
                    `${name}: ${(percent * 100).toFixed(0)}%`
                  }
                >
                  {Object.entries(riskBreakdown).map(([name], index) => {
                    const color = getRiskColor(name);
                    return <Cell key={`cell-${index}`} fill={color} />;
                  })}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [`${value} suppliers`, "Count"]}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Industry Distribution Chart */}
        <div className="dashboard-card">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-800">
                Industry Distribution
              </h3>
              <p className="text-sm text-gray-500">
                Breakdown of suppliers by industry sector
              </p>
            </div>
            <ChartInfoOverlay content={chartInfoContent.industryDistribution} />
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={Object.entries(industryDistribution).map(
                  ([name, value]) => ({ name, value })
                )}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 80, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis
                  type="category"
                  dataKey="name"
                  tick={{ fontSize: 12 }}
                  width={80}
                />
                <Tooltip
                  formatter={(value: number) => [`${value} suppliers`, "Count"]}
                />
                <Bar dataKey="value" fill="#3B82F6">
                  {Object.entries(industryDistribution).map((_, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Compliance Rate Trend */}
      <div className="dashboard-card mt-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Compliance Rate Trend
            </h3>
            <p className="text-sm text-gray-500">
              Monthly supplier compliance rate over the past year
            </p>
          </div>
          <ChartInfoOverlay content={chartInfoContent.complianceRate} />
        </div>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data?.compliance_rate_trend || []}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient
                  id="colorCompliance"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis domain={[50, 100]} tickFormatter={(tick) => `${tick}%`} />
              <Tooltip
                formatter={(value: number) => [`${value}%`, "Compliance Rate"]}
              />
              <Area
                type="monotone"
                dataKey="rate"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#colorCompliance)"
              />
              <ReferenceLine
                y={70}
                stroke="#10B981"
                strokeDasharray="3 3"
                label="Target"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Recent Suppliers */}
      <div className="dashboard-card mt-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-lg font-semibold text-gray-800">
              Recent Suppliers
            </h3>
            <p className="text-sm text-gray-500">
              Latest supplier evaluations and updates
            </p>
          </div>
          <Link
            to="/suppliers"
            className="text-sm text-indigo-600 flex items-center hover:text-indigo-800"
          >
            View all suppliers <ArrowRightIcon className="h-4 w-4 ml-1" />
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead>
              <tr className="bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                <th className="px-6 py-3 border-b border-gray-200">Name</th>
                <th className="px-6 py-3 border-b border-gray-200">Country</th>
                <th className="px-6 py-3 border-b border-gray-200">
                  Ethical Score
                </th>
                <th className="px-6 py-3 border-b border-gray-200">Trend</th>
                <th className="px-6 py-3 border-b border-gray-200">
                  Date Added
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {data?.recent_suppliers && data.recent_suppliers.length > 0 ? (
                data.recent_suppliers.map((supplier) => (
                  <tr key={supplier.id} className="hover:bg-gray-50">
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {supplier.name}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-500">
                        {supplier.country}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium ${
                          supplier.ethical_score >= 80
                            ? "text-green-600"
                            : supplier.ethical_score >= 60
                            ? "text-blue-600"
                            : supplier.ethical_score >= 40
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {supplier.ethical_score}/100
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap">
                      <div
                        className={`text-sm font-medium flex items-center ${
                          supplier.trend.startsWith("+")
                            ? "text-green-600"
                            : "text-red-600"
                        }`}
                      >
                        {supplier.trend.startsWith("+") ? (
                          <ArrowUpIcon className="h-4 w-4 mr-1" />
                        ) : (
                          <ArrowDownIcon className="h-4 w-4 mr-1" />
                        )}
                        {supplier.trend}
                      </div>
                    </td>
                    <td className="px-6 py-3 whitespace-nowrap text-sm text-gray-500">
                      {supplier.date}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={5}
                    className="px-6 py-4 text-center text-sm text-gray-500"
                  >
                    No recent supplier data available
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Section */}
      <div className="dashboard-header gradient-blue-purple bg-pattern text-white mt-8">
        <div className="absolute top-0 right-0 opacity-20">
          <svg
            className="w-24 h-24"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="12"
              cy="12"
              r="8"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M12 8v8M8 12h8"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            />
          </svg>
        </div>
        <div className="relative z-10">
          <h2 className="text-xl md:text-2xl font-bold mb-2">
            OptiEthic Sustainability Report
          </h2>
          <p className="text-blue-100 max-w-3xl">
            This dashboard is automatically updated with the latest data from
            your supply chain. For a detailed breakdown or to schedule a
            consultation on improving your sustainability metrics, please
            contact our support team.
          </p>
          <div className="mt-6 flex items-center bg-white/10 backdrop-blur-sm rounded-lg p-4 w-fit">
            <div className="text-center">
              <div className="text-sm font-medium text-blue-100">
                Overall Sustainability Score
              </div>
              <div className="text-4xl font-bold mt-1">
                {data?.avg_ethical_score?.toFixed(1) || "0.0"}
                <span className="text-lg">/100</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
