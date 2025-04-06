import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getSuppliers,
  evaluateSupplier,
  SupplierEvaluation,
  EvaluationResult,
} from "../../services/api";
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
  ChartBarIcon,
  ShieldCheckIcon,
  BriefcaseIcon,
  DocumentTextIcon,
  BeakerIcon,
  CloudIcon,
  EyeIcon,
  IdentificationIcon,
  CurrencyDollarIcon,
  WrenchScrewdriverIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const SupplierAssessment = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const supplierId = searchParams.get("id");

  // List of countries
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

  // List of industries
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

  // Initialize form data with all categories
  const [formData, setFormData] = useState({
    // Basic Information
    name: "",
    country: "",
    industry: "",

    // Environmental Metrics
    co2_emissions: 50,
    water_usage: 50,
    energy_efficiency: 0.5,
    waste_management_score: 0.5,
    renewable_energy_percent: 20,
    pollution_control: 0.5,

    // Social Metrics
    wage_fairness: 0.5,
    human_rights_index: 0.5,
    diversity_inclusion_score: 0.5,
    community_engagement: 0.5,
    worker_safety: 0.5,

    // Governance Metrics
    transparency_score: 0.5,
    corruption_risk: 0.5,
    board_diversity: 0.5,
    ethics_program: 0.5,
    compliance_systems: 0.5,

    // Supply Chain Metrics
    delivery_efficiency: 0.5,
    quality_control_score: 0.5,
    supplier_diversity: 0.5,
    traceability: 0.5,

    // Risk Factors
    geopolitical_risk: 0.5,
    climate_risk: 0.5,
    labor_dispute_risk: 0.5,
  });

  // State variables
  const [loadingSupplier, setLoadingSupplier] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeTab, setActiveTab] = useState("form");
  const [activeSection, setActiveSection] = useState("basic");
  const [usingMockData, setUsingMockData] = useState(false);

  // Load supplier data if an ID is provided
  useEffect(() => {
    const loadSupplierData = async () => {
      if (!supplierId) return;

      try {
        setLoadingSupplier(true);
        setError(null);

        console.log(`Loading supplier ${supplierId} for assessment...`);
        const suppliers = await getSuppliers();
        console.log(
          `Suppliers data for assessment: ${suppliers.length} suppliers`,
          suppliers
        );

        const supplier = suppliers.find(
          (s) => s.id === parseInt(supplierId, 10)
        );

        if (supplier) {
          console.log("Found supplier for assessment:", supplier);

          // Set the basic data we have
          const updatedFormData = {
            ...formData,
            name: supplier.name,
            country: supplier.country,
            industry: supplier.industry || "Manufacturing",
            co2_emissions: supplier.co2_emissions,
            delivery_efficiency: supplier.delivery_efficiency,
            wage_fairness: supplier.wage_fairness,
            human_rights_index: supplier.human_rights_index,
            waste_management_score: supplier.waste_management_score,
          };

          // If we have enhanced data, use it
          if (supplier.environmental_score) {
            updatedFormData.energy_efficiency = 0.7; // Estimated
            updatedFormData.renewable_energy_percent = 30; // Estimated
            updatedFormData.pollution_control = 0.6; // Estimated
          }

          if (supplier.social_score) {
            updatedFormData.diversity_inclusion_score = 0.6; // Estimated
            updatedFormData.community_engagement = 0.7; // Estimated
            updatedFormData.worker_safety = 0.65; // Estimated
          }

          if (supplier.governance_score) {
            updatedFormData.transparency_score = 0.7; // Estimated
            updatedFormData.corruption_risk = 0.3; // Estimated
            updatedFormData.board_diversity = 0.6; // Estimated
            updatedFormData.ethics_program = 0.7; // Estimated
            updatedFormData.compliance_systems = 0.65; // Estimated
          }

          // Set the form data
          setFormData(updatedFormData);

          // Check explicitly for the mock data flag
          const isMock = supplier.isMockData === true;
          console.log("Using mock data for assessment:", isMock);
          setUsingMockData(isMock);
        } else {
          console.error(
            `Supplier with ID ${supplierId} not found in the ${suppliers.length} suppliers returned`
          );
          setError(
            `Supplier with ID ${supplierId} not found. The API returned ${suppliers.length} suppliers, but none matched this ID.`
          );
        }
      } catch (err) {
        console.error("Error loading supplier for assessment:", err);
        setError(
          `Failed to load supplier data: ${err.message || "Unknown error"}`
        );
      } finally {
        setLoadingSupplier(false);
      }
    };

    loadSupplierData();
  }, [supplierId]);

  const handleChange = (e) => {
    const { name, value, type } = e.target;

    // Handle different input types
    const processedValue =
      type === "number" || type === "range" ? parseFloat(value) : value;

    setFormData((prev) => ({
      ...prev,
      [name]: processedValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      console.log("Submitting assessment data:", formData);

      // Convert form data to proper SupplierEvaluation format
      const evaluationData: SupplierEvaluation = {
        // Basic Information
        name: formData.name,
        country: formData.country,
        industry: formData.industry || "Manufacturing",

        // Environmental Metrics
        co2_emissions: formData.co2_emissions,
        water_usage: formData.water_usage,
        energy_efficiency: formData.energy_efficiency,
        waste_management_score: formData.waste_management_score,
        renewable_energy_percent: formData.renewable_energy_percent,
        pollution_control: formData.pollution_control,

        // Social Metrics
        wage_fairness: formData.wage_fairness,
        human_rights_index: formData.human_rights_index,
        diversity_inclusion_score: formData.diversity_inclusion_score,
        community_engagement: formData.community_engagement,
        worker_safety: formData.worker_safety,

        // Governance Metrics
        transparency_score: formData.transparency_score,
        corruption_risk: formData.corruption_risk,
        board_diversity: formData.board_diversity,
        ethics_program: formData.ethics_program,
        compliance_systems: formData.compliance_systems,

        // Supply Chain Metrics
        delivery_efficiency: formData.delivery_efficiency,
        quality_control_score: formData.quality_control_score,
        supplier_diversity: formData.supplier_diversity,
        traceability: formData.traceability,

        // Risk Factors
        geopolitical_risk: formData.geopolitical_risk,
        climate_risk: formData.climate_risk,
        labor_dispute_risk: formData.labor_dispute_risk,
      };

      // Call the API function to evaluate the supplier
      const evaluation = await evaluateSupplier(evaluationData);

      console.log("Assessment result:", evaluation);
      setResult(evaluation);
      setError(null);
      setActiveTab("results");
      setUsingMockData(evaluation.isMockData === true);
    } catch (err) {
      console.error("Error during assessment:", err);
      setError(
        `Failed to assess supplier: ${
          err.message || "Unknown error"
        }. Please try again.`
      );
      setResult(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getColorForValue = (value, isInverted = false) => {
    if (isInverted) {
      // For metrics where lower is better (like CO2, risk)
      if (value > 0.7) return "text-red-600";
      if (value > 0.3) return "text-yellow-600";
      return "text-green-600";
    } else {
      // For metrics where higher is better
      if (value < 0.3) return "text-red-600";
      if (value < 0.7) return "text-yellow-600";
      return "text-green-600";
    }
  };

  // Define form sections
  const formSections = [
    {
      id: "basic",
      name: "Basic Information",
      icon: IdentificationIcon,
      fields: [
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
        {
          name: "industry",
          label: "Industry",
          icon: BriefcaseIcon,
          type: "select",
          options: industries,
        },
      ],
    },
    {
      id: "environmental",
      name: "Environmental Metrics",
      icon: CloudIcon,
      fields: [
        {
          name: "co2_emissions",
          label: "CO2 Emissions",
          icon: CloudIcon,
          type: "range",
          min: 0,
          max: 100,
          step: 1,
          tooltip:
            "Relative CO2 emissions compared to industry average (lower is better)",
          isInverted: true,
        },
        {
          name: "water_usage",
          label: "Water Usage",
          icon: BeakerIcon,
          type: "range",
          min: 0,
          max: 100,
          step: 1,
          tooltip:
            "Water consumption compared to industry average (lower is better)",
          isInverted: true,
        },
        {
          name: "energy_efficiency",
          label: "Energy Efficiency",
          icon: LightBulbIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Energy efficiency score (higher is better)",
        },
        {
          name: "waste_management_score",
          label: "Waste Management",
          icon: DocumentTextIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Effectiveness of waste reduction and recycling programs",
        },
        {
          name: "renewable_energy_percent",
          label: "Renewable Energy (%)",
          icon: SparklesIcon,
          type: "range",
          min: 0,
          max: 100,
          step: 1,
          tooltip: "Percentage of energy from renewable sources",
        },
        {
          name: "pollution_control",
          label: "Pollution Control",
          icon: ShieldCheckIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Effectiveness of pollution prevention measures",
        },
      ],
    },
    {
      id: "social",
      name: "Social Metrics",
      icon: UserGroupIcon,
      fields: [
        {
          name: "wage_fairness",
          label: "Wage Fairness",
          icon: CurrencyDollarIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip:
            "Fair compensation compared to regional standards and living wage",
        },
        {
          name: "human_rights_index",
          label: "Human Rights Index",
          icon: CheckCircleIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Compliance with human rights standards and labor practices",
        },
        {
          name: "diversity_inclusion_score",
          label: "Diversity & Inclusion",
          icon: UserGroupIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Effectiveness of diversity and inclusion initiatives",
        },
        {
          name: "community_engagement",
          label: "Community Engagement",
          icon: BuildingOfficeIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Level of positive community involvement and support",
        },
        {
          name: "worker_safety",
          label: "Worker Safety",
          icon: ShieldCheckIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Safety measures and incident prevention effectiveness",
        },
      ],
    },
    {
      id: "governance",
      name: "Governance Metrics",
      icon: ScaleIcon,
      fields: [
        {
          name: "transparency_score",
          label: "Transparency",
          icon: EyeIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Level of disclosure and information transparency",
        },
        {
          name: "corruption_risk",
          label: "Corruption Risk",
          icon: XCircleIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip:
            "Risk level for corruption and unethical practices (lower is better)",
          isInverted: true,
        },
        {
          name: "board_diversity",
          label: "Board Diversity",
          icon: UserGroupIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Diversity in board composition and leadership",
        },
        {
          name: "ethics_program",
          label: "Ethics Program",
          icon: DocumentTextIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip:
            "Strength and effectiveness of ethics program and code of conduct",
        },
        {
          name: "compliance_systems",
          label: "Compliance Systems",
          icon: CheckCircleIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Robustness of regulatory compliance systems and processes",
        },
      ],
    },
    {
      id: "supply",
      name: "Supply Chain Metrics",
      icon: TruckIcon,
      fields: [
        {
          name: "delivery_efficiency",
          label: "Delivery Efficiency",
          icon: ClockIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "On-time delivery performance and efficiency",
        },
        {
          name: "quality_control_score",
          label: "Quality Control",
          icon: CheckCircleIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Effectiveness of quality control and assurance programs",
        },
        {
          name: "supplier_diversity",
          label: "Supplier Diversity",
          icon: UserGroupIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Diversity in the supplier's own supply chain",
        },
        {
          name: "traceability",
          label: "Traceability",
          icon: EyeIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip:
            "Ability to trace materials and components through the supply chain",
        },
      ],
    },
    {
      id: "risk",
      name: "Risk Assessment",
      icon: ShieldCheckIcon,
      fields: [
        {
          name: "geopolitical_risk",
          label: "Geopolitical Risk",
          icon: GlobeAltIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip:
            "Exposure to geopolitical instability and trade barriers (lower is better)",
          isInverted: true,
        },
        {
          name: "climate_risk",
          label: "Climate Risk",
          icon: CloudIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Vulnerability to climate change impacts (lower is better)",
          isInverted: true,
        },
        {
          name: "labor_dispute_risk",
          label: "Labor Dispute Risk",
          icon: UserGroupIcon,
          type: "range",
          min: 0,
          max: 1,
          step: 0.01,
          tooltip: "Likelihood of labor disputes and strikes (lower is better)",
          isInverted: true,
        },
      ],
    },
  ];

  return (
    <div className="space-y-8 bg-neutral-50">
      <div className="px-4 py-6 bg-gradient-to-r from-blue-700 to-indigo-700 rounded-lg shadow-md text-white">
        <h1 className="text-3xl font-bold">
          Comprehensive Supplier Assessment
        </h1>
        <p className="mt-2 text-blue-100">
          Advanced evaluation of suppliers across environmental, social,
          governance, and supply chain dimensions
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
                this time. Assessments will be performed with sample data.
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
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              } w-1/2 py-4 px-1 text-center border-b-2 font-medium text-sm sm:text-base transition-colors duration-200`}
            >
              Assessment Form
            </button>
            <button
              onClick={() => setActiveTab("results")}
              className={`${
                activeTab === "results"
                  ? "border-blue-500 text-blue-600"
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
            <div>
              <p className="text-sm text-gray-500 mb-6">
                Complete all fields for a comprehensive assessment. Fields are
                organized by category for easier navigation.
              </p>

              {/* Form section navigation */}
              <div className="flex flex-wrap gap-2 mb-6">
                <button
                  onClick={() => setActiveSection("basic")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeSection === "basic"
                      ? "bg-blue-100 text-blue-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <IdentificationIcon className="inline-block h-5 w-5 mr-1" />
                  Basic Info
                </button>
                <button
                  onClick={() => setActiveSection("environmental")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeSection === "environmental"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <CloudIcon className="inline-block h-5 w-5 mr-1" />
                  Environmental
                </button>
                <button
                  onClick={() => setActiveSection("social")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeSection === "social"
                      ? "bg-purple-100 text-purple-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <UserGroupIcon className="inline-block h-5 w-5 mr-1" />
                  Social
                </button>
                <button
                  onClick={() => setActiveSection("governance")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeSection === "governance"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ScaleIcon className="inline-block h-5 w-5 mr-1" />
                  Governance
                </button>
                <button
                  onClick={() => setActiveSection("supply")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeSection === "supply"
                      ? "bg-indigo-100 text-indigo-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <TruckIcon className="inline-block h-5 w-5 mr-1" />
                  Supply Chain
                </button>
                <button
                  onClick={() => setActiveSection("risk")}
                  className={`px-3 py-2 rounded-md text-sm font-medium ${
                    activeSection === "risk"
                      ? "bg-red-100 text-red-800"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  <ShieldCheckIcon className="inline-block h-5 w-5 mr-1" />
                  Risk Assessment
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Form will be rendered based on activeSection */}
                {activeSection === "basic" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      <span className="flex items-center">
                        <IdentificationIcon className="h-5 w-5 text-blue-500 mr-2" />
                        Basic Information
                      </span>
                    </h3>
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                      {formSections[0].fields.map((field) => (
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
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                              >
                                <option value="">Select {field.label}</option>
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
                                className="focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 sm:text-sm border-gray-300 rounded-md"
                              />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Environmental section */}
                {activeSection === "environmental" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      <span className="flex items-center">
                        <CloudIcon className="h-5 w-5 text-green-500 mr-2" />
                        Environmental Metrics
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Evaluate the supplier's environmental performance,
                      including emissions, resource usage, and sustainability
                      practices.
                    </p>
                    <div className="space-y-6">
                      {formSections[1].fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <div className="flex justify-between">
                            <label
                              htmlFor={field.name}
                              className="block text-sm font-medium text-gray-700 flex items-center"
                            >
                              <field.icon
                                className="h-5 w-5 text-gray-400 mr-2"
                                aria-hidden="true"
                              />
                              {field.label}
                              <span className="group relative ml-2">
                                <InformationCircleIcon
                                  className="h-4 w-4 text-gray-400 cursor-help"
                                  aria-hidden="true"
                                />
                                <span className="invisible group-hover:visible absolute z-10 -ml-28 w-56 px-3 py-2 text-xs text-white bg-gray-700 rounded-md shadow-sm">
                                  {field.tooltip}
                                </span>
                              </span>
                            </label>
                            <span
                              className={`text-sm font-medium ${
                                field.isInverted
                                  ? getColorForValue(
                                      formData[field.name] / (field.max || 100),
                                      true
                                    )
                                  : getColorForValue(
                                      formData[field.name] / (field.max || 1)
                                    )
                              }`}
                            >
                              {field.name === "renewable_energy_percent"
                                ? `${formData[field.name]}%`
                                : formData[field.name]}
                            </span>
                          </div>
                          <input
                            type="range"
                            name={field.name}
                            id={field.name}
                            min={field.min || 0}
                            max={field.max || 1}
                            step={field.step || 0.01}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{field.isInverted ? "Better" : "Poor"}</span>
                            <span>
                              {field.isInverted ? "Poor" : "Excellent"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Social section */}
                {activeSection === "social" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      <span className="flex items-center">
                        <UserGroupIcon className="h-5 w-5 text-purple-500 mr-2" />
                        Social Metrics
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Evaluate the supplier's social responsibility, including
                      labor practices, community engagement, and human rights
                      compliance.
                    </p>
                    <div className="space-y-6">
                      {formSections[2].fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <div className="flex justify-between">
                            <label
                              htmlFor={field.name}
                              className="block text-sm font-medium text-gray-700 flex items-center"
                            >
                              <field.icon
                                className="h-5 w-5 text-gray-400 mr-2"
                                aria-hidden="true"
                              />
                              {field.label}
                              <span className="group relative ml-2">
                                <InformationCircleIcon
                                  className="h-4 w-4 text-gray-400 cursor-help"
                                  aria-hidden="true"
                                />
                                <span className="invisible group-hover:visible absolute z-10 -ml-28 w-56 px-3 py-2 text-xs text-white bg-gray-700 rounded-md shadow-sm">
                                  {field.tooltip}
                                </span>
                              </span>
                            </label>
                            <span
                              className={`text-sm font-medium ${getColorForValue(
                                formData[field.name]
                              )}`}
                            >
                              {formData[field.name].toFixed(2)}
                            </span>
                          </div>
                          <input
                            type="range"
                            name={field.name}
                            id={field.name}
                            min={field.min || 0}
                            max={field.max || 1}
                            step={field.step || 0.01}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Poor</span>
                            <span>Excellent</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Governance section */}
                {activeSection === "governance" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      <span className="flex items-center">
                        <ScaleIcon className="h-5 w-5 text-yellow-500 mr-2" />
                        Governance Metrics
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Evaluate the supplier's governance practices, including
                      transparency, ethics, and compliance with regulations.
                    </p>
                    <div className="space-y-6">
                      {formSections[3].fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <div className="flex justify-between">
                            <label
                              htmlFor={field.name}
                              className="block text-sm font-medium text-gray-700 flex items-center"
                            >
                              <field.icon
                                className="h-5 w-5 text-gray-400 mr-2"
                                aria-hidden="true"
                              />
                              {field.label}
                              <span className="group relative ml-2">
                                <InformationCircleIcon
                                  className="h-4 w-4 text-gray-400 cursor-help"
                                  aria-hidden="true"
                                />
                                <span className="invisible group-hover:visible absolute z-10 -ml-28 w-56 px-3 py-2 text-xs text-white bg-gray-700 rounded-md shadow-sm">
                                  {field.tooltip}
                                </span>
                              </span>
                            </label>
                            <span
                              className={`text-sm font-medium ${
                                field.isInverted
                                  ? getColorForValue(formData[field.name], true)
                                  : getColorForValue(formData[field.name])
                              }`}
                            >
                              {formData[field.name].toFixed(2)}
                            </span>
                          </div>
                          <input
                            type="range"
                            name={field.name}
                            id={field.name}
                            min={field.min || 0}
                            max={field.max || 1}
                            step={field.step || 0.01}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>{field.isInverted ? "Better" : "Poor"}</span>
                            <span>
                              {field.isInverted ? "Poor" : "Excellent"}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Supply Chain section */}
                {activeSection === "supply" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      <span className="flex items-center">
                        <TruckIcon className="h-5 w-5 text-indigo-500 mr-2" />
                        Supply Chain Metrics
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Evaluate the supplier's supply chain performance,
                      including delivery efficiency, quality control, and
                      transparency.
                    </p>
                    <div className="space-y-6">
                      {formSections[4].fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <div className="flex justify-between">
                            <label
                              htmlFor={field.name}
                              className="block text-sm font-medium text-gray-700 flex items-center"
                            >
                              <field.icon
                                className="h-5 w-5 text-gray-400 mr-2"
                                aria-hidden="true"
                              />
                              {field.label}
                              <span className="group relative ml-2">
                                <InformationCircleIcon
                                  className="h-4 w-4 text-gray-400 cursor-help"
                                  aria-hidden="true"
                                />
                                <span className="invisible group-hover:visible absolute z-10 -ml-28 w-56 px-3 py-2 text-xs text-white bg-gray-700 rounded-md shadow-sm">
                                  {field.tooltip}
                                </span>
                              </span>
                            </label>
                            <span
                              className={`text-sm font-medium ${getColorForValue(
                                formData[field.name]
                              )}`}
                            >
                              {formData[field.name].toFixed(2)}
                            </span>
                          </div>
                          <input
                            type="range"
                            name={field.name}
                            id={field.name}
                            min={field.min || 0}
                            max={field.max || 1}
                            step={field.step || 0.01}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Poor</span>
                            <span>Excellent</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Risk Assessment section */}
                {activeSection === "risk" && (
                  <div>
                    <h3 className="text-lg font-medium text-gray-900 mb-4">
                      <span className="flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 text-red-500 mr-2" />
                        Risk Assessment
                      </span>
                    </h3>
                    <p className="text-sm text-gray-600 mb-6">
                      Evaluate the supplier's exposure to various risks that
                      could impact their operations and your supply chain.
                    </p>
                    <div className="space-y-6">
                      {formSections[5].fields.map((field) => (
                        <div key={field.name} className="space-y-2">
                          <div className="flex justify-between">
                            <label
                              htmlFor={field.name}
                              className="block text-sm font-medium text-gray-700 flex items-center"
                            >
                              <field.icon
                                className="h-5 w-5 text-gray-400 mr-2"
                                aria-hidden="true"
                              />
                              {field.label}
                              <span className="group relative ml-2">
                                <InformationCircleIcon
                                  className="h-4 w-4 text-gray-400 cursor-help"
                                  aria-hidden="true"
                                />
                                <span className="invisible group-hover:visible absolute z-10 -ml-28 w-56 px-3 py-2 text-xs text-white bg-gray-700 rounded-md shadow-sm">
                                  {field.tooltip}
                                </span>
                              </span>
                            </label>
                            <span
                              className={`text-sm font-medium ${getColorForValue(
                                formData[field.name],
                                true
                              )}`}
                            >
                              {formData[field.name].toFixed(2)}
                            </span>
                          </div>
                          <input
                            type="range"
                            name={field.name}
                            id={field.name}
                            min={field.min || 0}
                            max={field.max || 1}
                            step={field.step || 0.01}
                            value={formData[field.name]}
                            onChange={handleChange}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                          <div className="flex justify-between text-xs text-gray-500">
                            <span>Low Risk</span>
                            <span>High Risk</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Submit button */}
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
                          Submitting...
                        </span>
                      ) : (
                        "Complete Assessment"
                      )}
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Results tab content will go here */}
          {activeTab === "results" && result && (
            <div className="space-y-8">
              <div className="bg-white overflow-hidden shadow rounded-lg">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h2 className="text-lg font-medium text-gray-900">
                    Assessment Results: {result.name}
                  </h2>
                  <p className="mt-1 max-w-2xl text-sm text-gray-500">
                    Comprehensive ethical and sustainability evaluation
                  </p>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="grid grid-cols-2 gap-6 md:grid-cols-3 lg:grid-cols-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-lg text-center">
                      <span className="text-sm font-medium text-gray-500">
                        Ethical Score
                      </span>
                      <div
                        className={`text-2xl font-bold mt-1 ${
                          result.ethical_score >= 80
                            ? "text-green-600"
                            : result.ethical_score >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.ethical_score}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg text-center">
                      <span className="text-sm font-medium text-gray-500">
                        Environmental
                      </span>
                      <div
                        className={`text-2xl font-bold mt-1 ${
                          result.environmental_score >= 80
                            ? "text-green-600"
                            : result.environmental_score >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.environmental_score}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-lg text-center">
                      <span className="text-sm font-medium text-gray-500">
                        Social
                      </span>
                      <div
                        className={`text-2xl font-bold mt-1 ${
                          result.social_score >= 80
                            ? "text-green-600"
                            : result.social_score >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.social_score}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg text-center">
                      <span className="text-sm font-medium text-gray-500">
                        Governance
                      </span>
                      <div
                        className={`text-2xl font-bold mt-1 ${
                          result.governance_score >= 80
                            ? "text-green-600"
                            : result.governance_score >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.governance_score}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 p-4 rounded-lg text-center">
                      <span className="text-sm font-medium text-gray-500">
                        Supply Chain
                      </span>
                      <div
                        className={`text-2xl font-bold mt-1 ${
                          result.supply_chain_score >= 80
                            ? "text-green-600"
                            : result.supply_chain_score >= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.supply_chain_score}
                      </div>
                    </div>
                    <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg text-center">
                      <span className="text-sm font-medium text-gray-500">
                        Risk Score
                      </span>
                      <div
                        className={`text-2xl font-bold mt-1 ${
                          result.risk_score <= 30
                            ? "text-green-600"
                            : result.risk_score <= 60
                            ? "text-yellow-600"
                            : "text-red-600"
                        }`}
                      >
                        {result.risk_score}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">
                    SWOT Analysis
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-gray-200">
                    <div className="p-4 sm:p-6">
                      <h4 className="text-base font-medium text-green-700 mb-3 flex items-center">
                        <CheckCircleIcon className="h-5 w-5 mr-2" />
                        Strengths
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {result.assessment.strengths.map((strength, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-green-500 mr-2">•</span>
                            {strength}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h4 className="text-base font-medium text-red-700 mb-3 flex items-center">
                        <XCircleIcon className="h-5 w-5 mr-2" />
                        Weaknesses
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {result.assessment.weaknesses.map((weakness, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-red-500 mr-2">•</span>
                            {weakness}
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h4 className="text-base font-medium text-blue-700 mb-3 flex items-center">
                        <LightBulbIcon className="h-5 w-5 mr-2" />
                        Opportunities
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {result.assessment.opportunities.map(
                          (opportunity, index) => (
                            <li key={index} className="flex items-start">
                              <span className="text-blue-500 mr-2">•</span>
                              {opportunity}
                            </li>
                          )
                        )}
                      </ul>
                    </div>
                    <div className="p-4 sm:p-6">
                      <h4 className="text-base font-medium text-yellow-700 mb-3 flex items-center">
                        <ShieldCheckIcon className="h-5 w-5 mr-2" />
                        Threats
                      </h4>
                      <ul className="space-y-1 text-sm text-gray-600">
                        {result.assessment.threats.map((threat, index) => (
                          <li key={index} className="flex items-start">
                            <span className="text-yellow-500 mr-2">•</span>
                            {threat}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900">
                    Recommendation
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <p className="text-gray-700">{result.recommendation}</p>

                  <h4 className="mt-6 text-base font-medium text-gray-900">
                    Suggested Improvements
                  </h4>
                  <ul className="mt-3 space-y-2">
                    {result.suggestions.map((suggestion, index) => (
                      <li key={index} className="flex items-start">
                        <div className="flex-shrink-0">
                          <SparklesIcon className="h-5 w-5 text-blue-500" />
                        </div>
                        <p className="ml-3 text-sm text-gray-700">
                          {suggestion}
                        </p>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <ShieldCheckIcon className="h-5 w-5 mr-2 text-red-500" />
                    Risk Factors
                  </h3>
                </div>
                <div className="border-t border-gray-200">
                  <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Risk Factor
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Severity
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Probability
                          </th>
                          <th
                            scope="col"
                            className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                          >
                            Mitigation Strategy
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {result.risk_factors.map((risk, index) => (
                          <tr key={index}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {risk.factor}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  risk.severity === "High"
                                    ? "bg-red-100 text-red-800"
                                    : risk.severity === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {risk.severity}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm">
                              <span
                                className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                  risk.probability === "High"
                                    ? "bg-red-100 text-red-800"
                                    : risk.probability === "Medium"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-green-100 text-green-800"
                                }`}
                              >
                                {risk.probability}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-gray-500">
                              {risk.mitigation}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <div className="bg-white shadow rounded-lg overflow-hidden">
                <div className="px-4 py-5 sm:px-6 bg-gray-50">
                  <h3 className="text-lg font-medium text-gray-900 flex items-center">
                    <ChartBarIcon className="h-5 w-5 mr-2 text-blue-500" />
                    Industry Comparison
                  </h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-500 mb-2">
                      Percentile Ranking
                    </p>
                    <div className="text-3xl font-bold text-blue-600">
                      {result.industry_comparison.percentile}%
                    </div>
                    <p className="mt-1 text-sm text-gray-500">
                      This supplier ranks better than{" "}
                      {result.industry_comparison.percentile}% of suppliers in
                      the industry
                    </p>
                  </div>

                  <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
                    <div className="border border-gray-200 rounded-md p-4">
                      <span className="text-sm font-medium text-gray-500">
                        Industry Average
                      </span>
                      <div className="mt-1 text-2xl font-bold">
                        {result.industry_comparison.average_score}
                      </div>
                    </div>
                    <div className="border border-gray-200 rounded-md p-4">
                      <span className="text-sm font-medium text-gray-500">
                        Top Performer
                      </span>
                      <div className="mt-1 text-2xl font-bold">
                        {result.industry_comparison.top_performer_score}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setActiveTab("form")}
                  className="bg-gray-100 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Back to Form
                </button>
                <button
                  type="button"
                  onClick={() => navigate("/suppliers")}
                  className="ml-3 bg-blue-600 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  View All Suppliers
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupplierAssessment;
