import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { addSupplier } from "../services/api";
import {
  BuildingOfficeIcon,
  GlobeAltIcon,
  BriefcaseIcon,
  LinkIcon,
  DocumentTextIcon,
  CloudIcon,
  WaterIcon,
  LightBulbIcon,
  TrashIcon,
  UserGroupIcon,
  ScaleIcon,
  UsersIcon,
  HandRaisedIcon,
  EyeIcon,
  ExclamationTriangleIcon,
  TruckIcon,
  CheckCircleIcon,
  InformationCircleIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const AddSupplier = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // Form sections initial state
  const [formData, setFormData] = useState({
    // Basic info
    name: "",
    country: "",
    industry: "Manufacturing",
    description: "",
    website: "",

    // Environmental metrics
    co2_emissions: 50,
    water_usage: 50,
    energy_efficiency: 0.5,
    waste_management_score: 0.5,

    // Social metrics
    wage_fairness: 0.5,
    human_rights_index: 0.5,
    diversity_inclusion_score: 0.5,
    community_engagement: 0.5,

    // Governance metrics
    transparency_score: 0.5,
    corruption_risk: 0.5,

    // Supply chain metrics
    delivery_efficiency: 0.5,
    quality_control_score: 0.5,
  });

  // List of countries for the dropdown
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

  // List of industries for the dropdown
  const industries = [
    "Manufacturing",
    "Technology",
    "Agriculture",
    "Energy",
    "Healthcare",
    "Retail",
    "Finance",
    "Transportation",
    "Construction",
    "Food & Beverage",
    "Textiles",
    "Chemicals",
    "Pharmaceuticals",
    "Automotive",
    "Electronics",
    "Mining",
    "Telecommunications",
    "Entertainment",
    "Education",
    "Other",
  ];

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle different input types
    const processedValue = type === "number" ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const response = await addSupplier(formData);

      console.log("Supplier added successfully:", response);
      setSuccess(true);

      // Redirect to the new supplier's page after 2 seconds
      setTimeout(() => {
        navigate(`/suppliers/${response.id}`);
      }, 2000);
    } catch (err) {
      console.error("Error adding supplier:", err);
      setError(
        err.response?.data?.detail ||
          err.message ||
          "Failed to add supplier. Please check your input and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8 bg-neutral-50">
      <div className="px-4 py-6 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-bold">Add New Supplier</h1>
        <p className="mt-2 text-blue-100">
          Register a new supplier with detailed information for comprehensive
          analysis
        </p>
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

      {error && (
        <div className="rounded-md bg-red-50 p-4 border-l-4 border-red-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <ExclamationTriangleIcon className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">{error}</div>
            </div>
          </div>
        </div>
      )}

      {success && (
        <div className="rounded-md bg-green-50 p-4 border-l-4 border-green-400">
          <div className="flex">
            <div className="flex-shrink-0">
              <CheckCircleIcon className="h-5 w-5 text-green-400" />
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-green-800">Success!</h3>
              <div className="mt-2 text-sm text-green-700">
                Supplier added successfully. Redirecting to supplier details...
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white shadow-lg rounded-lg overflow-hidden">
        <div className="p-6">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <BuildingOfficeIcon className="h-5 w-5 mr-2 text-blue-500" />
                Basic Information
              </h3>
              <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Supplier Name <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="text"
                      name="name"
                      id="name"
                      required
                      value={formData.name}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="country"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Country <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="country"
                      name="country"
                      required
                      value={formData.country}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      <option value="">Select a country</option>
                      {countries.map((country) => (
                        <option key={country} value={country}>
                          {country}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="industry"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Industry <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <select
                      id="industry"
                      name="industry"
                      required
                      value={formData.industry}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md"
                    >
                      {industries.map((industry) => (
                        <option key={industry} value={industry}>
                          {industry}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="website"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Website
                  </label>
                  <div className="mt-1">
                    <div className="flex rounded-md shadow-sm">
                      <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                        <LinkIcon className="h-4 w-4" />
                      </span>
                      <input
                        type="url"
                        name="website"
                        id="website"
                        value={formData.website}
                        onChange={handleChange}
                        placeholder="https://example.com"
                        className="flex-1 min-w-0 block w-full px-3 py-2 rounded-none rounded-r-md focus:ring-blue-500 focus:border-blue-500 sm:text-sm border-gray-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="sm:col-span-6">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Description
                  </label>
                  <div className="mt-1">
                    <textarea
                      id="description"
                      name="description"
                      rows={3}
                      value={formData.description}
                      onChange={handleChange}
                      className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border border-gray-300 rounded-md"
                    />
                  </div>
                  <p className="mt-2 text-sm text-gray-500">
                    Brief description of the supplier's business and operations.
                  </p>
                </div>
              </div>
            </div>

            {/* Environmental Metrics */}
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <CloudIcon className="h-5 w-5 mr-2 text-green-500" />
                Environmental Metrics
              </h3>
              <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="co2_emissions"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CO₂ Emissions (tons) <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="co2_emissions"
                      id="co2_emissions"
                      required
                      min="0"
                      max="100"
                      step="1"
                      value={formData.co2_emissions}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.co2_emissions}
                      </span>
                      <span>High (100)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Lower values indicate better environmental performance
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="water_usage"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Water Usage <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="water_usage"
                      id="water_usage"
                      required
                      min="0"
                      max="100"
                      step="1"
                      value={formData.water_usage}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.water_usage}
                      </span>
                      <span>High (100)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Lower values indicate better water conservation
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="energy_efficiency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Energy Efficiency <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="energy_efficiency"
                      id="energy_efficiency"
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.energy_efficiency}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.energy_efficiency}
                      </span>
                      <span>High (1)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Higher values indicate better energy efficiency
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="waste_management_score"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Waste Management Score{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="waste_management_score"
                      id="waste_management_score"
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.waste_management_score}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.waste_management_score}
                      </span>
                      <span>High (1)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Higher values indicate better waste management practices
                  </p>
                </div>
              </div>
            </div>

            {/* Social Metrics */}
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <UserGroupIcon className="h-5 w-5 mr-2 text-purple-500" />
                Social Metrics
              </h3>
              <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="wage_fairness"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Wage Fairness <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="wage_fairness"
                      id="wage_fairness"
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.wage_fairness}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.wage_fairness}
                      </span>
                      <span>High (1)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Higher values indicate more equitable wages
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="human_rights_index"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Human Rights Index <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="human_rights_index"
                      id="human_rights_index"
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.human_rights_index}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.human_rights_index}
                      </span>
                      <span>High (1)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Higher values indicate better human rights practices
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="diversity_inclusion_score"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Diversity & Inclusion Score{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="diversity_inclusion_score"
                      id="diversity_inclusion_score"
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.diversity_inclusion_score}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.diversity_inclusion_score}
                      </span>
                      <span>High (1)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Higher values indicate better diversity & inclusion
                    practices
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="community_engagement"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Community Engagement <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="community_engagement"
                      id="community_engagement"
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.community_engagement}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.community_engagement}
                      </span>
                      <span>High (1)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Higher values indicate better community engagement
                  </p>
                </div>
              </div>
            </div>

            {/* Governance Metrics */}
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <ScaleIcon className="h-5 w-5 mr-2 text-amber-500" />
                Governance Metrics
              </h3>
              <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="transparency_score"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Transparency Score <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="transparency_score"
                      id="transparency_score"
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.transparency_score}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.transparency_score}
                      </span>
                      <span>High (1)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Higher values indicate better transparency in operations
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="corruption_risk"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Corruption Risk <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="corruption_risk"
                      id="corruption_risk"
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.corruption_risk}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.corruption_risk}
                      </span>
                      <span>High (1)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Lower values indicate less corruption risk
                  </p>
                </div>
              </div>
            </div>

            {/* Supply Chain Metrics */}
            <div>
              <h3 className="text-lg leading-6 font-medium text-gray-900 flex items-center">
                <TruckIcon className="h-5 w-5 mr-2 text-red-500" />
                Supply Chain Metrics
              </h3>
              <div className="mt-5 grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-6">
                <div className="sm:col-span-3">
                  <label
                    htmlFor="delivery_efficiency"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Delivery Efficiency <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="delivery_efficiency"
                      id="delivery_efficiency"
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.delivery_efficiency}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.delivery_efficiency}
                      </span>
                      <span>High (1)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Higher values indicate more efficient delivery systems
                  </p>
                </div>

                <div className="sm:col-span-3">
                  <label
                    htmlFor="quality_control_score"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Quality Control Score{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1">
                    <input
                      type="range"
                      name="quality_control_score"
                      id="quality_control_score"
                      required
                      min="0"
                      max="1"
                      step="0.1"
                      value={formData.quality_control_score}
                      onChange={handleChange}
                      className="block w-full"
                    />
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Low (0)</span>
                      <span className="font-medium text-blue-600">
                        {formData.quality_control_score}
                      </span>
                      <span>High (1)</span>
                    </div>
                  </div>
                  <p className="mt-2 text-xs text-gray-500">
                    Higher values indicate better quality control processes
                  </p>
                </div>
              </div>
            </div>

            {/* Form Actions */}
            <div className="pt-5 border-t border-gray-200">
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => navigate("/suppliers")}
                  className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center">
                      <ArrowPathIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                      Adding...
                    </span>
                  ) : (
                    "Add Supplier"
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div className="bg-blue-50 rounded-lg p-4 shadow-sm border border-blue-100">
        <div className="flex">
          <div className="flex-shrink-0">
            <InformationCircleIcon className="h-5 w-5 text-blue-400" />
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-blue-800">
              About this form
            </h3>
            <div className="mt-2 text-sm text-blue-700">
              <p>
                This comprehensive form collects detailed supplier information
                for sustainability and ethical assessment. All fields marked
                with * are required. After submission, the data will be
                processed by our AI to generate ethical scores and
                recommendations.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddSupplier;
