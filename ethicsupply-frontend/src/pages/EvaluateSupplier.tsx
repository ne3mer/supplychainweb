import { useState, useEffect } from "react";
import { evaluateSupplier, getSuppliers } from "../services/api";
import { useSearchParams } from "react-router-dom";
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

// Define types for the form data
interface FormData {
  name: string;
  country: string;
  co2_emissions: string;
  delivery_efficiency: string;
  wage_fairness: string;
  human_rights_index: string;
  waste_management_score: string;
  [key: string]: string; // Index signature to allow field.name access
}

// Define the evaluation result type
interface EvaluationResult {
  name: string;
  ethical_score: number;
  recommendation?: string;
  suggestions?: string[];
  isMockData?: boolean;
}

const EvaluateSupplier = () => {
  const [searchParams] = useSearchParams();
  const supplierId = searchParams.get("id");

  // Add list of countries
  const countries = [
    "United States",
    "China",
    "India",
    "Germany",
    "United Kingdom",
    "France",
    "Brazil",
    "Italy",
    "Canada",
    "Japan",
    "South Korea",
    "Australia",
    "Spain",
    "Mexico",
    "Indonesia",
    "Netherlands",
    "Saudi Arabia",
    "Turkey",
    "Switzerland",
    "Poland",
    "Thailand",
    "Sweden",
    "Belgium",
    "Nigeria",
    "Austria",
    "Norway",
    "United Arab Emirates",
    "Israel",
    "Ireland",
    "Singapore",
    "Vietnam",
    "Malaysia",
    "Denmark",
    "Philippines",
    "Pakistan",
    "Colombia",
    "Chile",
    "Finland",
    "Bangladesh",
    "Egypt",
    "South Africa",
    "New Zealand",
    "Argentina",
    "Other",
  ];

  const [formData, setFormData] = useState({
    name: "",
    country: "",
    co2_emissions: "50",
    delivery_efficiency: "0.5",
    wage_fairness: "0.5",
    human_rights_index: "0.5",
    waste_management_score: "0.5",
  });

  const [loadingSupplier, setLoadingSupplier] = useState(false);
  const [result, setResult] = useState<EvaluationResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [usingMockData, setUsingMockData] = useState(false);

  // Load supplier data if an ID is provided
  useEffect(() => {
    const loadSupplierData = async () => {
      if (!supplierId) return;

      try {
        setLoadingSupplier(true);
        setError(null);

        console.log(`Loading supplier ${supplierId} for evaluation...`);
        const suppliers = await getSuppliers();
        console.log(
          `Suppliers data for evaluation: ${suppliers.length} suppliers`,
          suppliers
        );

        const supplier = suppliers.find(
          (s) => s.id === parseInt(supplierId, 10)
        );

        if (supplier) {
          console.log("Found supplier for evaluation:", supplier);
          setFormData({
            name: supplier.name,
            country: supplier.country,
            co2_emissions: supplier.co2_emissions.toString(),
            delivery_efficiency: supplier.delivery_efficiency.toString(),
            wage_fairness: supplier.wage_fairness.toString(),
            human_rights_index: supplier.human_rights_index.toString(),
            waste_management_score: supplier.waste_management_score.toString(),
          });

          // Check explicitly for the mock data flag
          const isMock = supplier.isMockData === true;
          console.log("Using mock data for evaluation:", isMock);
          setUsingMockData(isMock);
        } else {
          console.error(
            `Supplier with ID ${supplierId} not found in the ${suppliers.length} suppliers returned`
          );
          setError(
            `Supplier with ID ${supplierId} not found. The API returned ${suppliers.length} suppliers, but none matched this ID.`
          );
        }
      } catch (err: unknown) {
        console.error("Error loading supplier for evaluation:", err);
        setError(
          `Failed to load supplier data: ${
            err instanceof Error ? err.message : "Unknown error"
          }`
        );
      } finally {
        setLoadingSupplier(false);
      }
    };

    loadSupplierData();
  }, [supplierId]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
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
      console.log("Submitting evaluation data:", dataToSubmit);
      // @ts-ignore - API type mismatch but our implementation is correct
      const evaluation = await evaluateSupplier(dataToSubmit);
      console.log("Evaluation result:", evaluation);
      setResult(evaluation);
      setError(null);
      setActiveTab("results");

      // Check if using mock data based on flag from API service
      const isMock = evaluation.isMockData === true;
      console.log("Using mock data for evaluation result:", isMock);
      setUsingMockData(isMock);
    } catch (err: unknown) {
      console.error("Error during evaluation:", err);
      setError("Failed to evaluate supplier. Please try again.");
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorForValue = (value: number): string => {
    if (value < 0.3) return "bg-red-500";
    if (value < 0.7) return "bg-yellow-500";
    return "bg-green-500";
  };

  // Helper function to compare string values that represent numbers
  const compareStringNumber = (
    value: string,
    comparisonValue: number,
    operator: "lt" | "gt"
  ): boolean => {
    const numberValue = parseFloat(value);
    return operator === "lt"
      ? numberValue < comparisonValue
      : numberValue > comparisonValue;
  };

  // Define interfaces for field types
  interface TextField {
    name: string;
    label: string;
    icon: React.ElementType;
    type: string;
    options?: string[];
  }

  interface SliderField {
    name: string;
    label: string;
    icon: React.ElementType;
    min: number;
    max: number;
    step: number;
    description: string;
    colorClass: () => string;
  }

  const textFields: TextField[] = [
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
      type: "select",
      options: countries,
    },
  ];

  const sliderFields: SliderField[] = [
    {
      name: "co2_emissions",
      label: "CO₂ Emissions (tons)",
      icon: GlobeAltIcon,
      min: 0,
      max: 100,
      step: 1,
      description: "Lower values are better for the environment",
      colorClass: () => {
        const value = formData.co2_emissions;
        if (compareStringNumber(value, 70, "gt")) return "text-red-600";
        if (compareStringNumber(value, 30, "gt")) return "text-yellow-600";
        return "text-green-600";
      },
    },
    {
      name: "delivery_efficiency",
      label: "Delivery Efficiency",
      icon: TruckIcon,
      min: 0,
      max: 1,
      step: 0.1,
      description: "Higher values indicate more efficient delivery systems",
      colorClass: () => {
        const value = formData.delivery_efficiency;
        if (compareStringNumber(value, 0.3, "lt")) return "text-red-600";
        if (compareStringNumber(value, 0.7, "lt")) return "text-yellow-600";
        return "text-green-600";
      },
    },
    {
      name: "wage_fairness",
      label: "Wage Fairness",
      icon: UserGroupIcon,
      min: 0,
      max: 1,
      step: 0.1,
      description: "Higher values indicate more equitable wages",
      colorClass: () => {
        const value = formData.wage_fairness;
        if (compareStringNumber(value, 0.3, "lt")) return "text-red-600";
        if (compareStringNumber(value, 0.7, "lt")) return "text-yellow-600";
        return "text-green-600";
      },
    },
    {
      name: "human_rights_index",
      label: "Human Rights Index",
      icon: UserGroupIcon,
      min: 0,
      max: 1,
      step: 0.1,
      description: "Higher values indicate better human rights practices",
      colorClass: () => {
        const value = formData.human_rights_index;
        if (compareStringNumber(value, 0.3, "lt")) return "text-red-600";
        if (compareStringNumber(value, 0.7, "lt")) return "text-yellow-600";
        return "text-green-600";
      },
    },
    {
      name: "waste_management_score",
      label: "Waste Management Score",
      icon: LightBulbIcon,
      min: 0,
      max: 1,
      step: 0.1,
      description: "Higher values indicate better waste management practices",
      colorClass: () => {
        const value = formData.waste_management_score;
        if (compareStringNumber(value, 0.3, "lt")) return "text-red-600";
        if (compareStringNumber(value, 0.7, "lt")) return "text-yellow-600";
        return "text-green-600";
      },
    },
  ];

  return (
    <div className="space-y-8 bg-neutral-50">
      <div className="px-4 py-6 bg-gradient-to-r from-emerald-700 to-teal-700 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-bold">Supplier Evaluation</h1>
        <p className="mt-2 text-emerald-100">
          Assess suppliers based on ethical and environmental criteria
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
                this time. Evaluations will be performed with sample data.
              </div>
            </div>
          </div>
        </div>
      )}

      {error && (
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
      )}

      <div className="bg-white shadow-md rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-lg">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex" aria-label="Tabs">
            <button
              onClick={() => setActiveTab("form")}
              className={`${
                activeTab === "form"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base transition-colors duration-200`}
            >
              Evaluation Form
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`${
                activeTab === "results"
                  ? "border-emerald-500 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base transition-colors duration-200`}
              disabled={!result}
            >
              Results
            </button>
          </nav>
        </div>

        <div className="p-4 sm:p-6">
          {activeTab === "form" && (
            <form onSubmit={handleSubmit} className="space-y-6">
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
                      {field.type === "select" ? (
                        <select
                          name={field.name}
                          id={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                          className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        >
                          <option value="">Select a {field.label}</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                        </select>
                      ) : (
                        <input
                          type={field.type}
                          name={field.name}
                          id={field.name}
                          value={formData[field.name]}
                          onChange={handleChange}
                          required
                          className="focus:ring-emerald-500 focus:border-emerald-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                        />
                      )}
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">
                  <span className="flex items-center">
                    <SparklesIcon className="h-5 w-5 text-emerald-500 mr-2" />
                    Sustainability Metrics
                  </span>
                </h3>

                {sliderFields.map((field) => (
                  <div key={field.name} className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label
                        htmlFor={field.name}
                        className="text-sm font-medium text-gray-700 flex items-center"
                      >
                        <field.icon
                          className="h-5 w-5 mr-2 text-gray-500"
                          aria-hidden="true"
                        />
                        {field.label}
                      </label>
                      <span
                        className={`font-medium ${
                          typeof field.colorClass === "function"
                            ? field.colorClass()
                            : field.colorClass
                        }`}
                      >
                        {formData[field.name as keyof FormData]}
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
                        value={formData[field.name as keyof FormData]}
                        onChange={handleChange}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                      <div
                        className="absolute inset-y-0 left-0 rounded-l-full"
                        style={{
                          width: `${
                            field.name === "co2_emissions"
                              ? 100 -
                                parseFloat(
                                  formData[field.name as keyof FormData]
                                )
                              : parseFloat(
                                  formData[field.name as keyof FormData]
                                ) * 100
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

              <div className="flex justify-end space-x-3">
                <button
                  type="reset"
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                >
                  Reset
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
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
                    </span>
                  ) : (
                    "Evaluate Supplier"
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
                  <SparklesIcon className="h-5 w-5 text-emerald-500 mr-2" />
                  Recommendation
                </h4>
                <div className="bg-emerald-50 rounded-lg p-4 border border-emerald-200">
                  <p className="text-sm text-emerald-800">
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
                          <span className="text-sm font-medium">
                            {index + 1}
                          </span>
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
    </div>
  );
};

export default EvaluateSupplier;
