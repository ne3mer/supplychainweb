import { useState, useEffect } from "react";
import { evaluateSupplier } from "../services/api";
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  ScaleIcon,
  UserGroupIcon,
  LightBulbIcon,
  TruckIcon,
  ClockIcon,
  CheckCircleIcon,
  SparklesIcon,
  InformationCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const EvaluateSupplier = () => {
  const [formData, setFormData] = useState({
    name: "",
    country: "",
    co2_emissions: "50",
    delivery_efficiency: "0.5",
    wage_fairness: "0.5",
    human_rights_index: "0.5",
    waste_management_score: "0.5",
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [usingMockData, setUsingMockData] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Convert string values to numbers for submission
    const dataToSubmit = {
      ...formData,
      co2_emissions: parseFloat(formData.co2_emissions) || 0,
      delivery_efficiency: parseFloat(formData.delivery_efficiency) || 0,
      wage_fairness: parseFloat(formData.wage_fairness) || 0,
      human_rights_index: parseFloat(formData.human_rights_index) || 0,
      waste_management_score: parseFloat(formData.waste_management_score) || 0,
    };

    try {
      const evaluation = await evaluateSupplier(dataToSubmit);
      setResult(evaluation);
      setError(null);
      setActiveTab("results");

      // Check if using mock data based on flag from API service
      setUsingMockData(evaluation.isMockData === true);
    } catch (err) {
      setError("Failed to evaluate supplier. Please try again.");
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorForValue = (value) => {
    if (value < 0.3) return "bg-red-500";
    if (value < 0.7) return "bg-yellow-500";
    return "bg-green-500";
  };

  const textFields = [
    {
      name: "name",
      label: "Supplier Name",
      icon: BuildingOfficeIcon,
      type: "text",
    },
    {
      name: "country",
      label: "Country",
      icon: GlobeAltIcon,
      type: "text",
    },
  ];

  const sliderFields = [
    {
      name: "co2_emissions",
      label: "CO₂ Emissions (tons)",
      icon: GlobeAltIcon,
      min: 0,
      max: 100,
      step: 1,
      description: "Lower values are better for the environment",
      colorClass:
        formData.co2_emissions > 70
          ? "text-red-600"
          : formData.co2_emissions > 30
          ? "text-yellow-600"
          : "text-green-600",
    },
    {
      name: "delivery_efficiency",
      label: "Delivery Efficiency",
      icon: TruckIcon,
      min: 0,
      max: 1,
      step: 0.1,
      description: "Higher values indicate more efficient delivery systems",
      colorClass:
        formData.delivery_efficiency < 0.3
          ? "text-red-600"
          : formData.delivery_efficiency < 0.7
          ? "text-yellow-600"
          : "text-green-600",
    },
    {
      name: "wage_fairness",
      label: "Wage Fairness",
      icon: UserGroupIcon,
      min: 0,
      max: 1,
      step: 0.1,
      description: "Higher values indicate more equitable wages",
      colorClass:
        formData.wage_fairness < 0.3
          ? "text-red-600"
          : formData.wage_fairness < 0.7
          ? "text-yellow-600"
          : "text-green-600",
    },
    {
      name: "human_rights_index",
      label: "Human Rights Index",
      icon: UserGroupIcon,
      min: 0,
      max: 1,
      step: 0.1,
      description: "Higher values indicate better human rights practices",
      colorClass:
        formData.human_rights_index < 0.3
          ? "text-red-600"
          : formData.human_rights_index < 0.7
          ? "text-yellow-600"
          : "text-green-600",
    },
    {
      name: "waste_management_score",
      label: "Waste Management Score",
      icon: LightBulbIcon,
      min: 0,
      max: 1,
      step: 0.1,
      description: "Higher values indicate better waste management practices",
      colorClass:
        formData.waste_management_score < 0.3
          ? "text-red-600"
          : formData.waste_management_score < 0.7
          ? "text-yellow-600"
          : "text-green-600",
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Evaluate Supplier
        </h1>
        <p className="mt-2 text-sm text-gray-700">
          Evaluate a supplier's ethical and environmental performance
        </p>
      </div>

      {error && (
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
      )}

      {usingMockData && (
        <div className="rounded-md bg-blue-50 p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <InformationCircleIcon className="h-5 w-5 text-blue-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-blue-800">Demo Mode</h3>
              <div className="mt-2 text-sm text-blue-700">
                Using simulated evaluation data. The API endpoint is not
                available at this time, but the application will function as
                expected with demo data.
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow sm:rounded-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex">
            <button
              onClick={() => setActiveTab("form")}
              className={`${
                activeTab === "form"
                  ? "border-primary-500 text-primary-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              <ScaleIcon className="h-5 w-5 mr-2" />
              Input Data
            </button>
            <button
              onClick={() => setActiveTab("results")}
              disabled={!result}
              className={`${
                activeTab === "results"
                  ? "border-primary-500 text-primary-600"
                  : !result
                  ? "border-transparent text-gray-300 cursor-not-allowed"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } whitespace-nowrap py-4 px-6 border-b-2 font-medium text-sm flex items-center`}
            >
              <SparklesIcon className="h-5 w-5 mr-2" />
              View Results
            </button>
          </nav>
        </div>

        {activeTab === "form" && (
          <form onSubmit={handleSubmit} className="px-4 py-5 sm:p-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 mb-8">
              {textFields.map((field) => (
                <div key={field.name}>
                  <label
                    htmlFor={field.name}
                    className="block text-sm font-medium text-gray-700"
                  >
                    {field.label}
                  </label>
                  <div className="mt-1 relative rounded-md shadow-sm">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <field.icon
                        className="h-5 w-5 text-gray-400"
                        aria-hidden="true"
                      />
                    </div>
                    <input
                      type={field.type}
                      name={field.name}
                      id={field.name}
                      value={formData[field.name]}
                      onChange={handleChange}
                      required
                      className="focus:ring-primary-500 focus:border-primary-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                <span className="flex items-center">
                  <SparklesIcon className="h-5 w-5 text-primary-500 mr-2" />
                  Sustainability Metrics
                </span>
              </h3>

              {sliderFields.map((field) => (
                <div key={field.name} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label
                      htmlFor={field.name}
                      className="block text-sm font-medium text-gray-700 flex items-center"
                    >
                      <field.icon
                        className="h-5 w-5 mr-2 text-gray-500"
                        aria-hidden="true"
                      />
                      {field.label}
                    </label>
                    <span className={`font-medium ${field.colorClass}`}>
                      {formData[field.name]}
                    </span>
                  </div>
                  <div className="relative">
                    <input
                      type="range"
                      name={field.name}
                      id={field.name}
                      min={field.min}
                      max={field.max}
                      step={field.step}
                      value={formData[field.name]}
                      onChange={handleChange}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                    <div
                      className="absolute inset-y-0 left-0 rounded-l-full"
                      style={{
                        width: `${
                          field.name === "co2_emissions"
                            ? 100 - parseFloat(formData[field.name])
                            : parseFloat(formData[field.name]) * 100
                        }%`,
                        background: `linear-gradient(to right, ${
                          field.name === "co2_emissions"
                            ? "#ef4444, #f59e0b, #10b981"
                            : "#10b981, #f59e0b, #ef4444"
                        })`,
                        height: "0.5rem",
                        top: "0.25rem",
                      }}
                    ></div>
                  </div>
                  <p className="text-xs text-gray-500">{field.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex justify-end">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isSubmitting ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
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
                    Evaluating...
                  </>
                ) : (
                  <>
                    <CheckCircleIcon className="h-5 w-5 mr-2" />
                    Evaluate Supplier
                  </>
                )}
              </button>
            </div>
          </form>
        )}

        {activeTab === "results" && result && (
          <div className="px-4 py-5 sm:p-6">
            <div className="mb-8">
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Evaluation Results for {result.name}
              </h3>
              <p className="text-sm text-gray-500">
                Based on the provided metrics, here's our AI-powered analysis
              </p>
            </div>

            <div className="mb-8 overflow-hidden bg-gray-50 rounded-lg shadow-inner">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between">
                  <div className="text-center sm:text-left mb-4 sm:mb-0">
                    <h4 className="text-sm font-medium text-gray-500">
                      Overall Ethical Score
                    </h4>
                    <div className="mt-1 flex items-baseline">
                      <p className="text-4xl font-extrabold text-gray-900">
                        {result.ethical_score
                          ? result.ethical_score.toFixed(1)
                          : 0}
                      </p>
                      <p className="ml-2 text-sm font-medium text-gray-500">
                        / 100
                      </p>
                    </div>
                  </div>

                  <div className="w-full sm:w-2/3">
                    <div className="h-4 w-full bg-gray-200 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full ${
                          result.ethical_score >= 80
                            ? "bg-green-500"
                            : result.ethical_score >= 60
                            ? "bg-yellow-500"
                            : "bg-red-500"
                        }`}
                        style={{ width: `${result.ethical_score}%` }}
                      ></div>
                    </div>
                    <div className="mt-2 flex justify-between text-xs text-gray-500">
                      <span>Poor</span>
                      <span>Average</span>
                      <span>Excellent</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mb-8">
              <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <SparklesIcon className="h-5 w-5 text-primary-500 mr-2" />
                Recommendation
              </h4>
              <div className="bg-primary-50 rounded-lg p-4 border border-primary-200">
                <p className="text-sm text-primary-800">
                  {result.recommendation || "No recommendation available."}
                </p>
              </div>
            </div>

            <div>
              <h4 className="text-base font-medium text-gray-900 mb-4 flex items-center">
                <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
                Suggestions for Improvement
              </h4>
              <ul className="space-y-3">
                {result.suggestions &&
                  result.suggestions.map((suggestion, index) => (
                    <li
                      key={index}
                      className="flex items-start p-3 bg-gradient-to-r from-white to-gray-50 rounded-lg border border-gray-100 shadow-sm"
                    >
                      <span className="flex-shrink-0 h-6 w-6 text-yellow-500 bg-yellow-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                        <span className="text-sm font-medium">{index + 1}</span>
                      </span>
                      <span className="text-sm text-gray-700">
                        {suggestion}
                      </span>
                    </li>
                  ))}
                {(!result.suggestions || result.suggestions.length === 0) && (
                  <li className="text-sm text-gray-500 italic">
                    No improvement suggestions available.
                  </li>
                )}
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EvaluateSupplier;
