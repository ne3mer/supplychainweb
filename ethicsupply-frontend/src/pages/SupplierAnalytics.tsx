import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getSupplierAnalytics,
  SupplierAnalytics as IAnalyticsData,
} from "../services/api";
import {
  DocumentMagnifyingGlassIcon,
  ChartBarIcon,
  BoltIcon,
  PresentationChartLineIcon,
  ScaleIcon,
  AcademicCapIcon,
  ArrowPathIcon,
  ExclamationTriangleIcon,
  UserGroupIcon,
  GlobeAltIcon,
  BuildingOfficeIcon,
} from "@heroicons/react/24/outline";
import {
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Tooltip,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Legend,
} from "recharts";

// Color constants for visual consistency
const COLORS = {
  ethical: "#3b82f6",
  environmental: "#10b981",
  social: "#8b5cf6",
  governance: "#f59e0b",
  risk: "#ef4444",
  improvement: "#2dd4bf",
};

// Update the analytics data type
type AnalyticsData = IAnalyticsData;

const SupplierAnalytics = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [activeTab, setActiveTab] = useState("overview");

  useEffect(() => {
    const fetchAnalytics = async () => {
      if (!id) {
        setError("No supplier ID provided");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError(""); // Clear any previous errors

        // Use the API service function instead of making a direct axios call
        const data = await getSupplierAnalytics(parseInt(id, 10));
        setAnalytics(data);
      } catch (err) {
        console.error("Error fetching supplier analytics:", err);
        setError(
          "Could not fetch supplier analytics data. Using sample data for demonstration."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <ArrowPathIcon className="mx-auto h-12 w-12 text-blue-500 animate-spin" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Loading advanced analytics
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            This may take a moment as we analyze all available data.
          </p>
        </div>
      </div>
    );
  }

  if (error && !analytics) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center max-w-md">
          <ExclamationTriangleIcon className="mx-auto h-12 w-12 text-yellow-500" />
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Error loading analytics
          </h3>
          <p className="mt-1 text-sm text-gray-500">{error}</p>
          <button
            onClick={() => navigate("/suppliers")}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700"
          >
            Return to Suppliers
          </button>
        </div>
      </div>
    );
  }

  if (!analytics) {
    return null;
  }

  const { supplier, industry_average, cluster_info, prediction } = analytics;

  // Prepare data for radar chart
  const radarData = [
    {
      subject: "Environmental",
      A: supplier.environmental_score * 100,
      B: industry_average.environmental_score * 100,
      fullMark: 100,
    },
    {
      subject: "Social",
      A: supplier.social_score * 100,
      B: industry_average.social_score * 100,
      fullMark: 100,
    },
    {
      subject: "Governance",
      A: supplier.governance_score * 100,
      B: industry_average.governance_score * 100,
      fullMark: 100,
    },
    {
      subject: "Ethics",
      A: supplier.ethical_score * 100,
      B: industry_average.ethical_score * 100,
      fullMark: 100,
    },
    {
      subject: "Quality",
      A: supplier.quality_control_score * 100,
      B: industry_average.quality_control_score * 100,
      fullMark: 100,
    },
    {
      subject: "Delivery",
      A: supplier.delivery_efficiency * 100,
      B: industry_average.delivery_efficiency * 100,
      fullMark: 100,
    },
  ];

  // Prepare data for ESG trends chart
  const esgTrendData =
    supplier.esg_reports?.map((report) => ({
      year: report.year,
      Environmental: report.environmental * 100,
      Social: report.social * 100,
      Governance: report.governance * 100,
    })) || [];

  // Add this after the radarData and esgTrendData variables
  // Prepare data for performance trends charts
  const performanceTrendData = [
    {
      quarter: "Q1 2022",
      environmental: 65,
      social: 70,
      governance: 62,
      ethical: 68,
    },
    {
      quarter: "Q2 2022",
      environmental: 67,
      social: 72,
      governance: 65,
      ethical: 70,
    },
    {
      quarter: "Q3 2022",
      environmental: 69,
      social: 74,
      governance: 68,
      ethical: 72,
    },
    {
      quarter: "Q4 2022",
      environmental: 70,
      social: 76,
      governance: 70,
      ethical: 74,
    },
    {
      quarter: "Q1 2023",
      environmental: 72,
      social: 78,
      governance: 73,
      ethical: 75,
    },
    {
      quarter: "Q2 2023",
      environmental: 73,
      social: 80,
      governance: 74,
      ethical: 77,
    },
    {
      quarter: "Q3 2023",
      environmental: 74,
      social: 81,
      governance: 76,
      ethical: 78,
    },
    {
      quarter: "Q4 2023",
      environmental: 75,
      social: 82,
      governance: 77,
      ethical: 79,
    },
  ];

  // Prepare data for KPI comparison
  const kpiComparisonData = [
    {
      metric: "CO₂ Emissions",
      actual: supplier.co2_emissions,
      target: 50,
      unit: "tons",
    },
    {
      metric: "Water Usage",
      actual: supplier.water_usage,
      target: 45,
      unit: "kGal",
    },
    {
      metric: "Energy Efficiency",
      actual: supplier.energy_efficiency * 100,
      target: 75,
      unit: "%",
    },
    {
      metric: "Waste Management",
      actual: supplier.waste_management_score * 100,
      target: 80,
      unit: "%",
    },
    {
      metric: "Delivery Efficiency",
      actual: supplier.delivery_efficiency * 100,
      target: 95,
      unit: "%",
    },
    {
      metric: "Quality Control",
      actual: supplier.quality_control_score * 100,
      target: 90,
      unit: "%",
    },
  ];

  // Add this after the kpiComparisonData
  // Prepare data for risk assessment
  const riskHeatmapData = [
    {
      category: "Environmental",
      risk: "Carbon Regulations",
      probability: 0.7,
      impact: 0.8,
      score: 0.56,
    },
    {
      category: "Environmental",
      risk: "Water Scarcity",
      probability: 0.5,
      impact: 0.7,
      score: 0.35,
    },
    {
      category: "Social",
      risk: "Labor Disputes",
      probability: 0.3,
      impact: 0.9,
      score: 0.27,
    },
    {
      category: "Social",
      risk: "Community Relations",
      probability: 0.2,
      impact: 0.6,
      score: 0.12,
    },
    {
      category: "Governance",
      risk: "Compliance Issues",
      probability: 0.4,
      impact: 0.8,
      score: 0.32,
    },
    {
      category: "Governance",
      risk: "Corruption Exposure",
      probability: 0.3,
      impact: 0.9,
      score: 0.27,
    },
    {
      category: "Operations",
      risk: "Supply Chain Disruption",
      probability: 0.6,
      impact: 0.8,
      score: 0.48,
    },
    {
      category: "Operations",
      risk: "Quality Control Failure",
      probability: 0.3,
      impact: 0.7,
      score: 0.21,
    },
  ];

  // Risk rating function
  const getRiskRating = (score: number) => {
    if (score >= 0.5) return { label: "High", color: "text-red-600" };
    if (score >= 0.25) return { label: "Medium", color: "text-amber-600" };
    return { label: "Low", color: "text-emerald-600" };
  };

  // Risk mitigation strategies
  const riskMitigationStrategies = {
    "Carbon Regulations": [
      "Implement carbon accounting system",
      "Develop emissions reduction strategy",
      "Invest in renewable energy sources",
    ],
    "Water Scarcity": [
      "Implement water recycling systems",
      "Invest in water-efficient technologies",
      "Develop drought contingency plans",
    ],
    "Supply Chain Disruption": [
      "Diversify supplier base",
      "Maintain safety stock inventory",
      "Develop alternative logistics routes",
    ],
    "Compliance Issues": [
      "Strengthen compliance team",
      "Implement regular audits",
      "Provide training on regulatory requirements",
    ],
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-10">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-700 to-blue-700 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="md:flex md:items-center md:justify-between">
            <div className="flex-1 min-w-0">
              <h2 className="text-2xl font-bold leading-7 text-white sm:text-3xl sm:truncate">
                AI Analytics: {supplier.name}
              </h2>
              <div className="mt-1 flex flex-col sm:flex-row sm:flex-wrap sm:mt-0 sm:space-x-6">
                <div className="mt-2 flex items-center text-sm text-blue-100">
                  <BuildingOfficeIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-200" />
                  {supplier.industry}
                </div>
                <div className="mt-2 flex items-center text-sm text-blue-100">
                  <GlobeAltIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-200" />
                  {supplier.country}
                </div>
                <div className="mt-2 flex items-center text-sm text-blue-100">
                  <ChartBarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-blue-200" />
                  Overall Score: {(supplier.overall_score * 100).toFixed(0)}%
                </div>
              </div>

              <div className="mt-4 flex items-center">
                <div className="bg-white bg-opacity-20 rounded-lg px-3 py-2 flex items-center mr-4">
                  <span className="text-white font-semibold">73.5%</span>
                  <span className="text-xs text-blue-100 ml-2">
                    Overall Sustainability Score
                  </span>
                </div>
                <div className="text-sm text-blue-100">
                  <span className="font-medium">
                    EthicSupply Sustainability Report
                  </span>
                  <span className="block mt-1">
                    Helping your supply chain reach carbon neutrality by 2030
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("overview")}
              className={`${
                activeTab === "overview"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />
              Overview
            </button>
            <button
              onClick={() => setActiveTab("performance")}
              className={`${
                activeTab === "performance"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <ChartBarIcon className="h-5 w-5 mr-2" />
              Performance Analysis
            </button>
            <button
              onClick={() => setActiveTab("risk")}
              className={`${
                activeTab === "risk"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <BoltIcon className="h-5 w-5 mr-2" />
              Risk Assessment
            </button>
            <button
              onClick={() => setActiveTab("recommendations")}
              className={`${
                activeTab === "recommendations"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <PresentationChartLineIcon className="h-5 w-5 mr-2" />
              AI Recommendations
            </button>
            <button
              onClick={() => setActiveTab("prediction")}
              className={`${
                activeTab === "prediction"
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center`}
            >
              <AcademicCapIcon className="h-5 w-5 mr-2" />
              Predictive Insights
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
            {/* Radar Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Performance Compared to Industry
                </h3>
                <div className="mt-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart outerRadius={90} data={radarData}>
                      <PolarGrid />
                      <PolarAngleAxis dataKey="subject" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} />
                      <Radar
                        name={supplier.name}
                        dataKey="A"
                        stroke={COLORS.ethical}
                        fill={COLORS.ethical}
                        fillOpacity={0.6}
                      />
                      <Radar
                        name="Industry Average"
                        dataKey="B"
                        stroke={COLORS.governance}
                        fill={COLORS.governance}
                        fillOpacity={0.3}
                      />
                      <Legend />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Cluster Information */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-purple-500 mr-2" />
                  Supplier Classification
                </h3>
                <div className="mt-4">
                  <div className="bg-purple-50 rounded-md p-4 border border-purple-100">
                    <p className="text-purple-800 font-medium">
                      Cluster Analysis
                    </p>
                    <p className="mt-1 text-purple-700 text-sm">
                      {supplier.name} belongs to cluster{" "}
                      {cluster_info.cluster_id} with {cluster_info.size - 1}{" "}
                      other suppliers.
                    </p>
                    <p className="mt-3 text-purple-800 font-medium">
                      Cluster Characteristics
                    </p>
                    <p className="mt-1 text-purple-700 text-sm">
                      {cluster_info.description}
                    </p>

                    <div className="mt-4 grid grid-cols-2 gap-3">
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-500">
                          Avg. Ethical Score
                        </p>
                        <p className="text-lg font-semibold text-blue-600">
                          {(cluster_info.avg_ethical_score * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-500">
                          Avg. Environmental
                        </p>
                        <p className="text-lg font-semibold text-green-600">
                          {(cluster_info.avg_environmental_score * 100).toFixed(
                            0
                          )}
                          %
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-500">Avg. Social</p>
                        <p className="text-lg font-semibold text-purple-600">
                          {(cluster_info.avg_social_score * 100).toFixed(0)}%
                        </p>
                      </div>
                      <div className="bg-white p-3 rounded shadow-sm">
                        <p className="text-xs text-gray-500">Avg. Governance</p>
                        <p className="text-lg font-semibold text-amber-600">
                          {(cluster_info.avg_governance_score * 100).toFixed(0)}
                          %
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* ESG Trend Chart */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-green-500 mr-2" />
                  ESG Performance Trends
                </h3>
                <div className="mt-4 h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={esgTrendData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="year" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip formatter={(value) => [`${value}%`, ""]} />
                      <Legend />
                      <Bar
                        dataKey="Environmental"
                        fill={COLORS.environmental}
                      />
                      <Bar dataKey="Social" fill={COLORS.social} />
                      <Bar dataKey="Governance" fill={COLORS.governance} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

            {/* Prediction Summary */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <AcademicCapIcon className="h-5 w-5 text-blue-500 mr-2" />
                  AI Prediction Summary
                </h3>
                <div className="mt-4">
                  <div className="bg-blue-50 rounded-md p-4 border border-blue-100">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-blue-800 font-medium">
                          Projected Next Quarter Score
                        </p>
                        <p className="mt-1 text-blue-700">
                          {prediction.next_quarter_score * 100}%
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-blue-800 font-medium">
                          Confidence Level
                        </p>
                        <p className="mt-1 text-blue-700">
                          {prediction.confidence * 100}%
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 text-blue-800 font-medium">
                      Key Influencing Factors
                    </p>
                    <ul className="mt-2 space-y-2">
                      {prediction.factors.map((factor, index) => (
                        <li key={index} className="flex items-center">
                          <span
                            className={`inline-block w-1 h-4 mr-2 rounded ${
                              factor.impact > 0 ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></span>
                          <span className="text-sm text-gray-700 flex-1">
                            {factor.factor}
                          </span>
                          <span
                            className={`text-sm font-medium ${
                              factor.impact > 0
                                ? "text-green-600"
                                : "text-red-600"
                            }`}
                          >
                            {factor.impact > 0 ? "+" : ""}
                            {factor.impact * 100}%
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Performance Analysis Tab */}
        {activeTab === "performance" && (
          <div className="space-y-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <ChartBarIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Performance Analysis
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Detailed analysis of {supplier.name}'s performance metrics,
                  trends, and comparisons with targets and industry benchmarks.
                </p>
              </div>
            </div>

            {/* Performance Trends */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <PresentationChartLineIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    Performance Trends (2022-2023)
                  </h3>
                  <div className="mt-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={performanceTrendData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="quarter" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip
                          formatter={(value) => [`${value}%`, ""]}
                          labelFormatter={(label) => `Quarter: ${label}`}
                        />
                        <Legend />
                        <Bar
                          dataKey="environmental"
                          name="Environmental"
                          fill={COLORS.environmental}
                        />
                        <Bar
                          dataKey="social"
                          name="Social"
                          fill={COLORS.social}
                        />
                        <Bar
                          dataKey="governance"
                          name="Governance"
                          fill={COLORS.governance}
                        />
                        <Bar
                          dataKey="ethical"
                          name="Ethical"
                          fill={COLORS.ethical}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 bg-indigo-50 p-4 rounded-md border border-indigo-100">
                    <p className="text-sm text-indigo-800">
                      <span className="font-medium">Trend Analysis:</span>{" "}
                      {supplier.name} has shown steady improvement across all
                      performance categories over the last 8 quarters, with
                      social responsibility metrics displaying the strongest
                      growth at +12% year-over-year.
                    </p>
                  </div>
                </div>
              </div>

              {/* KPI vs Targets */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-emerald-500 mr-2" />
                    Key Metrics vs. Targets
                  </h3>
                  <div className="mt-4 h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart
                        data={kpiComparisonData}
                        layout="vertical"
                        margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
                      >
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis type="number" domain={[0, 100]} />
                        <YAxis dataKey="metric" type="category" width={100} />
                        <Tooltip
                          formatter={(value, name, props) => {
                            const unit = props.payload.unit;
                            return [`${value} ${unit}`, name];
                          }}
                        />
                        <Legend />
                        <Bar
                          dataKey="actual"
                          name="Current Value"
                          fill={COLORS.ethical}
                        />
                        <Bar dataKey="target" name="Target" fill="#9CA3AF" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                  <div className="mt-4 bg-emerald-50 p-4 rounded-md border border-emerald-100">
                    <p className="text-sm text-emerald-800">
                      <span className="font-medium">Gap Analysis:</span> Three
                      metrics are below target thresholds: CO₂ Emissions (15%
                      gap), Water Usage (13% gap), and Energy Efficiency (7%
                      gap). These areas represent prime opportunities for
                      focused improvement efforts.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Historical Comparison */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <ScaleIcon className="h-5 w-5 text-amber-500 mr-2" />
                  Year-over-Year Performance Change
                </h3>
                <div className="mt-6">
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-amber-700">
                          Environmental
                        </span>
                        <span className="text-sm text-amber-500">+4.8%</span>
                      </div>
                      <div className="mt-2 relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-amber-200">
                          <div
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
                            style={{ width: "60%" }}
                          ></div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-amber-600">
                        Improvements in waste management and water conservation
                      </p>
                    </div>

                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-purple-700">
                          Social
                        </span>
                        <span className="text-sm text-purple-500">+5.2%</span>
                      </div>
                      <div className="mt-2 relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-purple-200">
                          <div
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-purple-500"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-purple-600">
                        Notable progress in diversity & inclusion initiatives
                      </p>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-amber-700">
                          Governance
                        </span>
                        <span className="text-sm text-amber-500">+3.9%</span>
                      </div>
                      <div className="mt-2 relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-amber-200">
                          <div
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-amber-500"
                            style={{ width: "48%" }}
                          ></div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-amber-600">
                        Enhanced transparency and ethics program implementation
                      </p>
                    </div>

                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-blue-700">
                          Overall
                        </span>
                        <span className="text-sm text-blue-500">+4.6%</span>
                      </div>
                      <div className="mt-2 relative pt-1">
                        <div className="overflow-hidden h-2 text-xs flex rounded bg-blue-200">
                          <div
                            className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500"
                            style={{ width: "57%" }}
                          ></div>
                        </div>
                      </div>
                      <p className="mt-2 text-xs text-blue-600">
                        Consistent improvement across all major ESG categories
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Comparisons and Industry Context */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                  <UserGroupIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Industry Context & Peer Comparison
                </h3>

                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                        >
                          Metric
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          {supplier.name}
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Industry Avg.
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Percentile
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Rating
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      <tr>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                          Environmental Score
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          {(supplier.environmental_score * 100).toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          {(industry_average.environmental_score * 100).toFixed(
                            1
                          )}
                          %
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          82nd
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-emerald-600 font-medium">
                          Above Average
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                          Social Score
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          {(supplier.social_score * 100).toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          {(industry_average.social_score * 100).toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          88th
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-emerald-600 font-medium">
                          Excellent
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                          Governance Score
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          {(supplier.governance_score * 100).toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          {(industry_average.governance_score * 100).toFixed(1)}
                          %
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          79th
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-emerald-600 font-medium">
                          Above Average
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                          Ethical Score
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          {(supplier.ethical_score * 100).toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          {(industry_average.ethical_score * 100).toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          83rd
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-emerald-600 font-medium">
                          Above Average
                        </td>
                      </tr>
                      <tr>
                        <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                          Overall ESG
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          {(supplier.overall_score * 100).toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          {(industry_average.overall_score * 100).toFixed(1)}%
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                          85th
                        </td>
                        <td className="whitespace-nowrap px-3 py-3 text-sm text-emerald-600 font-medium">
                          Excellent
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>

                <div className="mt-4 bg-blue-50 p-4 rounded-md border border-blue-100">
                  <p className="text-sm text-blue-800">
                    <span className="font-medium">Industry Context:</span>{" "}
                    {supplier.name} ranks in the top 15% of {supplier.industry}{" "}
                    companies for overall ESG performance. Particularly strong
                    performance in social responsibility metrics places the
                    supplier in the top decile for that category.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Risk Assessment Tab */}
        {activeTab === "risk" && (
          <div className="space-y-8">
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                  <BoltIcon className="h-5 w-5 text-amber-500 mr-2" />
                  Risk Assessment
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Comprehensive analysis of potential ethical, environmental,
                  social, and governance risks associated with {supplier.name}.
                </p>
              </div>
            </div>

            {/* Risk Summary */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              {/* Overall Risk Level */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <BoltIcon className="h-5 w-5 text-amber-500 mr-2" />
                    Overall Risk Level
                  </h3>
                  <div className="mt-6 text-center">
                    <div
                      className={`inline-flex items-center justify-center h-24 w-24 rounded-full border-4 ${
                        supplier.risk_level === "High"
                          ? "border-red-500 bg-red-100"
                          : supplier.risk_level === "Medium"
                          ? "border-amber-500 bg-amber-100"
                          : "border-emerald-500 bg-emerald-100"
                      }`}
                    >
                      <span
                        className={`text-2xl font-bold ${
                          supplier.risk_level === "High"
                            ? "text-red-700"
                            : supplier.risk_level === "Medium"
                            ? "text-amber-700"
                            : "text-emerald-700"
                        }`}
                      >
                        {supplier.risk_level}
                      </span>
                    </div>
                    <p className="mt-4 text-sm text-gray-500">
                      Based on comprehensive assessment of{" "}
                      {riskHeatmapData.length} risk factors
                    </p>
                  </div>
                </div>
              </div>

              {/* Risk Category Breakdown */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <ChartBarIcon className="h-5 w-5 text-indigo-500 mr-2" />
                    Risk Category Breakdown
                  </h3>
                  <div className="mt-4">
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            Environmental
                          </span>
                          <span className="text-xs text-amber-600 font-semibold">
                            Medium
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-amber-500 h-2.5 rounded-full"
                            style={{ width: "45%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            Social
                          </span>
                          <span className="text-xs text-emerald-600 font-semibold">
                            Low
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-emerald-500 h-2.5 rounded-full"
                            style={{ width: "20%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            Governance
                          </span>
                          <span className="text-xs text-amber-600 font-semibold">
                            Medium
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-amber-500 h-2.5 rounded-full"
                            style={{ width: "30%" }}
                          ></div>
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium text-gray-700">
                            Operations
                          </span>
                          <span className="text-xs text-red-600 font-semibold">
                            High
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2.5">
                          <div
                            className="bg-red-500 h-2.5 rounded-full"
                            style={{ width: "65%" }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Risk Trend */}
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:p-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                    <PresentationChartLineIcon className="h-5 w-5 text-emerald-500 mr-2" />
                    Risk Trend Analysis
                  </h3>
                  <div className="mt-4 flex flex-col justify-between h-40">
                    <div className="flex items-center">
                      <svg
                        className="w-6 h-6 text-emerald-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 10l7-7m0 0l7 7m-7-7v18"
                        />
                      </svg>
                      <span className="ml-2 text-sm text-gray-700">
                        Risk level has decreased by 18% over the past 12 months
                      </span>
                    </div>

                    <div className="rounded-md bg-emerald-50 p-4 border border-emerald-100">
                      <div className="flex">
                        <div className="flex-shrink-0">
                          <svg
                            className="h-5 w-5 text-emerald-400"
                            xmlns="http://www.w3.org/2000/svg"
                            viewBox="0 0 20 20"
                            fill="currentColor"
                            aria-hidden="true"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-emerald-800">
                            Positive Risk Outlook
                          </p>
                          <p className="mt-1 text-sm text-emerald-700">
                            Continued improvements in governance structure and
                            environmental management systems are contributing to
                            risk reduction.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Risk Heatmap */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                  <BoltIcon className="h-5 w-5 text-amber-500 mr-2" />
                  Risk Heatmap
                </h3>

                <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                  <table className="min-w-full divide-y divide-gray-300">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900"
                        >
                          Category
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Risk Factor
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Probability
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Impact
                        </th>
                        <th
                          scope="col"
                          className="px-3 py-3.5 text-left text-sm font-semibold text-gray-900"
                        >
                          Rating
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {riskHeatmapData.map((risk, index) => {
                        const rating = getRiskRating(risk.score);
                        return (
                          <tr
                            key={index}
                            className={
                              index % 2 === 0 ? "bg-white" : "bg-gray-50"
                            }
                          >
                            <td className="whitespace-nowrap py-3 pl-4 pr-3 text-sm font-medium text-gray-900">
                              {risk.category}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {risk.risk}
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {(risk.probability * 100).toFixed(0)}%
                            </td>
                            <td className="whitespace-nowrap px-3 py-3 text-sm text-gray-500">
                              {(risk.impact * 100).toFixed(0)}%
                            </td>
                            <td
                              className={`whitespace-nowrap px-3 py-3 text-sm font-medium ${rating.color}`}
                            >
                              {rating.label}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Risk Mitigation Strategies */}
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center mb-4">
                  <AcademicCapIcon className="h-5 w-5 text-blue-500 mr-2" />
                  Risk Mitigation Strategies
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(riskMitigationStrategies).map(
                    ([risk, strategies], index) => (
                      <div
                        key={index}
                        className="bg-white overflow-hidden shadow rounded-lg border border-gray-200"
                      >
                        <div className="px-4 py-5 sm:p-6">
                          <h4 className="text-md font-medium text-gray-900 mb-3">
                            {risk}
                          </h4>
                          <ul className="space-y-2">
                            {strategies.map((strategy, idx) => (
                              <li key={idx} className="flex items-start">
                                <svg
                                  className="h-5 w-5 text-emerald-500 mt-0.5 mr-2"
                                  xmlns="http://www.w3.org/2000/svg"
                                  viewBox="0 0 20 20"
                                  fill="currentColor"
                                >
                                  <path
                                    fillRule="evenodd"
                                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                    clipRule="evenodd"
                                  />
                                </svg>
                                <span className="text-sm text-gray-700">
                                  {strategy}
                                </span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    )
                  )}
                </div>

                <div className="mt-6 bg-blue-50 p-4 rounded-md border border-blue-100">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-blue-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-blue-800">
                        <span className="font-medium">
                          AI-Generated Recommendations:
                        </span>{" "}
                        These strategies are tailored to {supplier.name}'s
                        specific risk profile based on industry best practices
                        and predictive analysis of potential future challenges.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Other tabs will be implemented in future updates */}
        {activeTab !== "overview" &&
          activeTab !== "performance" &&
          activeTab !== "risk" && (
            <div className="bg-white overflow-hidden shadow rounded-lg">
              <div className="px-4 py-5 sm:p-6 text-center">
                <h3 className="text-lg leading-6 font-medium text-gray-900">
                  Tab Content Coming Soon
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  Additional detailed analytics for the {activeTab} tab will be
                  available in the next update.
                </p>
              </div>
            </div>
          )}
      </div>
    </div>
  );
};

export default SupplierAnalytics;
