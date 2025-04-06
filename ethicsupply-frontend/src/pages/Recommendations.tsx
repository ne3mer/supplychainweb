import { useEffect, useState } from "react";
import { getRecommendations } from "../services/api";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  InformationCircleIcon,
  XCircleIcon,
  ChartBarIcon,
  LightBulbIcon,
  SparklesIcon,
  ChartPieIcon,
  AcademicCapIcon,
} from "@heroicons/react/24/outline";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);
  const [expandedSupplier, setExpandedSupplier] = useState(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        const data = await getRecommendations();
        console.log("Recommendations data received:", data);
        setRecommendations(data);
        setError(null);

        // Check explicitly if we're using mock data based on flag
        // Only set usingMockData to true if the data has the isMockData flag
        if (data && Array.isArray(data) && data.length > 0) {
          const isMock = data[0].isMockData === true;
          console.log("Using mock recommendations data:", isMock);
          setUsingMockData(isMock);
        } else {
          setUsingMockData(false);
        }
      } catch (err) {
        console.error("Error fetching recommendations:", err);
        setError("Failed to fetch recommendations. Please try again later.");
        setUsingMockData(true); // Likely using mock data if there's an error
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, []);

  const getScoreBadge = (score) => {
    let variant = "success";
    let icon = ArrowTrendingUpIcon;
    if (score < 60) {
      variant = "danger";
      icon = ArrowTrendingDownIcon;
    } else if (score < 80) {
      variant = "warning";
      icon = MinusIcon;
    }
    return { variant, icon };
  };

  const toggleExpandSupplier = (supplierId) => {
    if (expandedSupplier === supplierId) {
      setExpandedSupplier(null);
    } else {
      setExpandedSupplier(supplierId);
    }
  };

  if (loading) {
    return (
      <div className="space-y-8 bg-neutral-50">
        <div className="px-4 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md text-white">
          <h1 className="text-3xl font-bold">Recommendations</h1>
          <p className="mt-2 text-emerald-100">
            Loading supplier recommendations...
          </p>
        </div>
        <div className="bg-white shadow-md rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error && recommendations.length === 0) {
    return (
      <div className="space-y-8 bg-neutral-50">
        <div className="px-4 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md text-white">
          <h1 className="text-3xl font-bold">Recommendations</h1>
          <p className="mt-2 text-emerald-100">Error loading recommendations</p>
        </div>
        <div className="rounded-md bg-yellow-50 p-4 border-l-4 border-yellow-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-yellow-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-yellow-700">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 bg-neutral-50 p-4">
      <div className="px-4 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-bold">Recommendations</h1>
        <p className="mt-2 text-emerald-100">
          AI-powered supplier recommendations based on ethical and environmental
          criteria
        </p>
      </div>

      {usingMockData && (
        <div className="rounded-md bg-blue-50 p-4 border-l-4 border-blue-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
              <div className="mt-2 text-sm text-blue-700">
                You are viewing demo data. The API endpoint is not available at
                this time. All recommendations shown are sample data.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <div className="p-4">
          <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
            <AcademicCapIcon className="h-5 w-5 text-emerald-600 mr-2" />
            Transparent AI Recommendations
          </h2>

          <div className="space-y-6">
            {recommendations.map((supplier, index) => {
              const { variant, icon: Icon } = getScoreBadge(
                supplier.ethical_score
              );
              const isExpanded = expandedSupplier === supplier.id;

              return (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-md"
                >
                  <div className="flex flex-col md:flex-row md:items-center p-4 bg-gray-50">
                    <div className="flex-1">
                      <h3 className="text-lg font-medium text-gray-900">
                        {supplier.name}
                      </h3>
                      <div className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                        <span>{supplier.country}</span>
                        <span className="text-gray-300">•</span>
                        <span>{supplier.industry || "Manufacturing"}</span>
                      </div>
                    </div>

                    <div className="mt-2 md:mt-0 flex items-center gap-4">
                      <div className="flex items-center">
                        <Icon
                          className={`h-5 w-5 ${
                            variant === "success"
                              ? "text-green-500"
                              : variant === "warning"
                              ? "text-yellow-500"
                              : "text-red-500"
                          }`}
                        />
                        <span
                          className={`ml-1 font-medium ${
                            variant === "success"
                              ? "text-green-600"
                              : variant === "warning"
                              ? "text-yellow-600"
                              : "text-red-600"
                          }`}
                        >
                          {supplier.ethical_score?.toFixed(1)}%
                        </span>
                      </div>

                      <button
                        onClick={() => toggleExpandSupplier(supplier.id)}
                        className="text-sm font-medium text-emerald-600 hover:text-emerald-800 flex items-center transition-colors"
                      >
                        {isExpanded ? "Hide details" : "Show details"}
                      </button>
                    </div>
                  </div>

                  <div className="p-4 border-t border-gray-200">
                    <div className="flex items-start gap-3">
                      <LightBulbIcon className="h-5 w-5 text-yellow-500 flex-shrink-0 mt-0.5" />
                      <p className="text-gray-800">{supplier.recommendation}</p>
                    </div>
                  </div>

                  {isExpanded && supplier.ai_explanation && (
                    <div className="border-t border-gray-200 p-4 bg-gray-50">
                      <div className="space-y-4">
                        {/* Key Strengths */}
                        {supplier.ai_explanation.key_strengths &&
                          supplier.ai_explanation.key_strengths.length > 0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <SparklesIcon className="h-4 w-4 text-emerald-500 mr-1" />
                                Key Strengths
                              </h4>
                              <ul className="space-y-2">
                                {supplier.ai_explanation.key_strengths.map(
                                  (strength, i) => (
                                    <li
                                      key={i}
                                      className="text-sm bg-white p-2 rounded border border-emerald-100 text-gray-700"
                                    >
                                      {strength}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Percentile Insights */}
                        {supplier.ai_explanation.percentile_insights &&
                          supplier.ai_explanation.percentile_insights.length >
                            0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <ChartBarIcon className="h-4 w-4 text-blue-500 mr-1" />
                                Industry Comparison
                              </h4>
                              <ul className="space-y-2">
                                {supplier.ai_explanation.percentile_insights.map(
                                  (insight, i) => (
                                    <li
                                      key={i}
                                      className="text-sm bg-white p-2 rounded border border-blue-100 text-gray-700"
                                    >
                                      {insight}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}

                        {/* Comparative Insights */}
                        {supplier.ai_explanation.comparative_insights &&
                          supplier.ai_explanation.comparative_insights.length >
                            0 && (
                            <div>
                              <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                                <ChartPieIcon className="h-4 w-4 text-purple-500 mr-1" />
                                Performance Metrics
                              </h4>
                              <ul className="space-y-2">
                                {supplier.ai_explanation.comparative_insights.map(
                                  (insight, i) => (
                                    <li
                                      key={i}
                                      className="text-sm bg-white p-2 rounded border border-purple-100 text-gray-700"
                                    >
                                      {insight}
                                    </li>
                                  )
                                )}
                              </ul>
                            </div>
                          )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}

            {recommendations.length === 0 && (
              <div className="text-center text-gray-500 py-10">
                No recommendations available
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden p-4 border-t-4 border-emerald-500">
        <div className="flex items-start">
          <div className="flex-shrink-0 bg-emerald-100 rounded-full p-2">
            <InformationCircleIcon className="h-5 w-5 text-emerald-600" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-gray-900">
              About our AI recommendation engine
            </h3>
            <div className="mt-2 text-sm text-gray-600">
              <p>
                Our transparent AI recommendation engine analyzes multiple
                ethical and environmental factors to recommend suppliers. Each
                recommendation includes:
              </p>
              <ul className="list-disc list-inside mt-2 space-y-1">
                <li>
                  Key strengths based on emissions, labor policies, and resource
                  usage
                </li>
                <li>Percentile rankings compared to industry peers</li>
                <li>
                  Specific performance metrics with quantifiable comparisons
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
