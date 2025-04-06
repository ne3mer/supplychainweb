import { useEffect, useState } from "react";
import { getRecommendations } from "../services/api";
import {
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  MinusIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const Recommendations = () => {
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const data = await getRecommendations();
        setRecommendations(data);
        setError(null);

        // Check if we're using mock data based on flag from API service
        setUsingMockData(data.length > 0 && data[0].isMockData === true);
      } catch (err) {
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

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Recommendations
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Loading supplier recommendations...
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

  if (error && recommendations.length === 0) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Recommendations
          </h1>
          <p className="mt-2 text-sm text-gray-700">
            Error loading recommendations
          </p>
        </div>
        <div className="rounded-md bg-red-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Recommendations
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          AI-powered supplier recommendations based on ethical and environmental
          criteria
        </p>
      </div>

      {usingMockData && (
        <div className="rounded-md bg-blue-50 p-4">
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

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Supplier
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Country
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Industry
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Ethical Score
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    CO₂ Emissions
                  </th>
                  <th
                    scope="col"
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  >
                    Recommendation
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recommendations.map((supplier, index) => {
                  const { variant, icon: Icon } = getScoreBadge(
                    supplier.ethical_score
                  );
                  return (
                    <tr key={index} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {supplier.name}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {supplier.country}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {supplier.industry || "Manufacturing"}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
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
                            className={`ml-2 text-sm font-medium ${
                              variant === "success"
                                ? "text-green-600"
                                : variant === "warning"
                                ? "text-yellow-600"
                                : "text-red-600"
                            }`}
                          >
                            {supplier.ethical_score.toFixed(1)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-500">
                          {supplier.co2_emissions.toFixed(1)} t
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-500">
                          {supplier.recommendation}
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {recommendations.length === 0 && (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-6 py-4 text-center text-sm text-gray-500"
                    >
                      No recommendations available
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;
