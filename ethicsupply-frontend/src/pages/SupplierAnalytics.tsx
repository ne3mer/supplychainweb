import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
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

const API_BASE_URL = "http://localhost:8000/api";

interface Supplier {
  id: number;
  name: string;
  country: string;
  industry: string;
  ethical_score: number;
  environmental_score: number;
  social_score: number;
  governance_score: number;
  overall_score: number;
  risk_level: string;
  co2_emissions: number;
  water_usage: number;
  energy_efficiency: number;
  waste_management_score: number;
  wage_fairness: number;
  human_rights_index: number;
  diversity_inclusion_score: number;
  community_engagement: number;
  transparency_score: number;
  corruption_risk: number;
  delivery_efficiency: number;
  quality_control_score: number;
  esg_reports?: {
    year: number;
    environmental: number;
    social: number;
    governance: number;
  }[];
  media_sentiment?: {
    source: string;
    date: string;
    score: number;
    headline: string;
  }[];
  controversies?: {
    issue: string;
    date: string;
    severity: string;
    status: string;
  }[];
}

interface ClusterInfo {
  cluster_id: number;
  size: number;
  avg_ethical_score: number;
  avg_environmental_score: number;
  avg_social_score: number;
  avg_governance_score: number;
  description: string;
}

interface AnalyticsData {
  supplier: Supplier;
  industry_average: {
    [key: string]: number;
  };
  similar_suppliers: Supplier[];
  recommendations: {
    area: string;
    suggestion: string;
    impact: string;
    difficulty: string;
  }[];
  improvement_potential: {
    [key: string]: number;
  };
  risk_factors: {
    factor: string;
    severity: string;
    probability: string;
    description: string;
  }[];
  cluster_info: ClusterInfo;
  prediction: {
    next_quarter_score: number;
    confidence: number;
    factors: {
      factor: string;
      impact: number;
    }[];
  };
}

// Color constants for visual consistency
const COLORS = {
  ethical: "#3b82f6",
  environmental: "#10b981",
  social: "#8b5cf6",
  governance: "#f59e0b",
  risk: "#ef4444",
  improvement: "#2dd4bf",
};

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

        // In a real app, this would hit the backend API
        // For now, we'll simulate a response with mock data
        const response = await axios.get(
          `${API_BASE_URL}/suppliers/${id}/analytics/`
        );
        setAnalytics(response.data);
      } catch (err) {
        console.error("Error fetching supplier analytics:", err);

        // For demo purposes, use mock data if API fails
        setAnalytics(getMockAnalyticsData());

        setError(
          "Could not fetch supplier analytics data. Using sample data for demonstration."
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchAnalytics();
  }, [id]);

  // Placeholder for mock data
  const getMockAnalyticsData = (): AnalyticsData => {
    return {
      supplier: {
        id: parseInt(id || "1"),
        name: "Acme Global Solutions",
        country: "United States",
        industry: "Manufacturing",
        ethical_score: 0.78,
        environmental_score: 0.72,
        social_score: 0.82,
        governance_score: 0.76,
        overall_score: 0.77,
        risk_level: "Medium",
        co2_emissions: 65,
        water_usage: 58,
        energy_efficiency: 0.68,
        waste_management_score: 0.75,
        wage_fairness: 0.85,
        human_rights_index: 0.79,
        diversity_inclusion_score: 0.82,
        community_engagement: 0.73,
        transparency_score: 0.74,
        corruption_risk: 0.22,
        delivery_efficiency: 0.88,
        quality_control_score: 0.91,
        esg_reports: [
          { year: 2021, environmental: 0.65, social: 0.78, governance: 0.7 },
          { year: 2022, environmental: 0.68, social: 0.8, governance: 0.73 },
          { year: 2023, environmental: 0.72, social: 0.82, governance: 0.76 },
        ],
        media_sentiment: [
          {
            source: "Industry News",
            date: "2023-10-15",
            score: 0.8,
            headline: "Acme Leads in Sustainable Manufacturing",
          },
          {
            source: "Financial Times",
            date: "2023-09-08",
            score: 0.6,
            headline: "Mixed Results for Acme's Q3 Performance",
          },
          {
            source: "Twitter",
            date: "2023-11-20",
            score: -0.2,
            headline: "Customers Report Delays in Acme's Supply Chain",
          },
        ],
        controversies: [
          {
            issue: "Employee Complaint",
            date: "2023-07-12",
            severity: "Low",
            status: "Resolved",
          },
          {
            issue: "Environmental Fine",
            date: "2022-05-18",
            severity: "Medium",
            status: "Resolved",
          },
        ],
      },
      industry_average: {
        ethical_score: 0.65,
        environmental_score: 0.6,
        social_score: 0.68,
        governance_score: 0.63,
        overall_score: 0.64,
        co2_emissions: 75,
        water_usage: 70,
        energy_efficiency: 0.58,
        waste_management_score: 0.62,
        wage_fairness: 0.72,
        human_rights_index: 0.68,
        diversity_inclusion_score: 0.65,
        community_engagement: 0.6,
        transparency_score: 0.61,
        corruption_risk: 0.3,
        delivery_efficiency: 0.75,
        quality_control_score: 0.8,
      },
      similar_suppliers: [],
      recommendations: [
        {
          area: "Environmental",
          suggestion:
            "Implement water recycling systems in manufacturing plants",
          impact: "High",
          difficulty: "Medium",
        },
        {
          area: "Social",
          suggestion:
            "Expand community engagement program to include educational initiatives",
          impact: "Medium",
          difficulty: "Low",
        },
        {
          area: "Governance",
          suggestion:
            "Enhance board diversity and establish an independent ethics committee",
          impact: "Medium",
          difficulty: "Medium",
        },
      ],
      improvement_potential: {
        co2_emissions: 18,
        water_usage: 22,
        energy_efficiency: 15,
        waste_management_score: 12,
        transparency_score: 18,
        corruption_risk: 10,
      },
      risk_factors: [
        {
          factor: "Supply Chain Disruption",
          severity: "Medium",
          probability: "Medium",
          description:
            "Potential disruptions due to reliance on suppliers in regions with geopolitical instability",
        },
        {
          factor: "Regulatory Compliance",
          severity: "High",
          probability: "Low",
          description:
            "Risk of non-compliance with upcoming carbon emissions regulations",
        },
      ],
      cluster_info: {
        cluster_id: 2,
        size: 15,
        avg_ethical_score: 0.75,
        avg_environmental_score: 0.71,
        avg_social_score: 0.78,
        avg_governance_score: 0.73,
        description:
          "Above-average performers with strong social responsibility programs",
      },
      prediction: {
        next_quarter_score: 0.79,
        confidence: 0.85,
        factors: [
          { factor: "Seasonal efficiency improvements", impact: 0.02 },
          { factor: "Expanding diversity initiatives", impact: 0.03 },
          { factor: "Pending environmental litigation", impact: -0.01 },
        ],
      },
    };
  };

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

  const {
    supplier,
    industry_average,
    recommendations,
    risk_factors,
    cluster_info,
    prediction,
  } = analytics;

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

        {/* Other tabs will be implemented in future updates */}
        {activeTab !== "overview" && (
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
