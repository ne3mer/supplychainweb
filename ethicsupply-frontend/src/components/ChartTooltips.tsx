import React from "react";
import { TooltipProps } from "recharts";
import {
  InformationCircleIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  CheckCircleIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

// Common tooltip wrapper component with enhanced styling
const TooltipWrapper = ({ children, title }) => (
  <div className="bg-white shadow-lg rounded-lg border border-gray-200 p-3 min-w-[200px] max-w-[300px]">
    {title && <h4 className="font-medium text-gray-900 mb-2">{title}</h4>}
    {children}
  </div>
);

// Enhanced tooltip for the ethical score distribution chart
export const EthicalScoreTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const scoreRange = data.range;
  const count = data.count;

  // Define recommendations based on score range
  const getScoreRangeContext = (range) => {
    switch (range) {
      case "81-100":
        return {
          status: "Excellent",
          text: "These are your top-performing suppliers with exceptional ethical practices.",
          color: "text-emerald-700",
          icon: CheckCircleIcon,
        };
      case "61-80":
        return {
          status: "Good",
          text: "These suppliers demonstrate strong ethical practices with some room for improvement.",
          color: "text-green-600",
          icon: CheckCircleIcon,
        };
      case "41-60":
        return {
          status: "Average",
          text: "These suppliers meet minimum ethical standards but need significant improvements.",
          color: "text-yellow-600",
          icon: InformationCircleIcon,
        };
      case "21-40":
        return {
          status: "Poor",
          text: "These suppliers have concerning ethical practices that require immediate attention.",
          color: "text-orange-600",
          icon: ExclamationCircleIcon,
        };
      default:
        return {
          status: "Critical",
          text: "These suppliers have critical ethical violations. Consider replacing them.",
          color: "text-red-600",
          icon: ExclamationCircleIcon,
        };
    }
  };

  const context = getScoreRangeContext(scoreRange);
  const Icon = context.icon;

  return (
    <TooltipWrapper title="Ethical Score Distribution">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Score Range:</span>
          <span className="font-medium text-gray-900">{scoreRange}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Supplier Count:</span>
          <span className="font-medium text-gray-900">{count}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Status:</span>
          <span className={`font-medium ${context.color}`}>
            {context.status}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <div className="flex items-start gap-2">
            <Icon className={`h-5 w-5 ${context.color} flex-shrink-0 mt-0.5`} />
            <p className="text-sm text-gray-600">{context.text}</p>
          </div>
        </div>
      </div>
    </TooltipWrapper>
  );
};

// Enhanced tooltip for CO2 emissions by industry
export const CO2EmissionsTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const industryName = data.name;
  const emissions = data.value;

  // Industry context data
  const getIndustryContext = (industry) => {
    const industryMap = {
      Technology: {
        avgReduction: "12%",
        mainSource: "Data centers and manufacturing",
        bestPractice: "Renewable energy for cloud operations",
        impact: "Medium",
      },
      Manufacturing: {
        avgReduction: "8%",
        mainSource: "Industrial processes and energy",
        bestPractice: "Energy-efficient machinery and clean energy",
        impact: "High",
      },
      Agriculture: {
        avgReduction: "5%",
        mainSource: "Livestock and machinery",
        bestPractice: "Regenerative farming and methane capture",
        impact: "High",
      },
      Transportation: {
        avgReduction: "10%",
        mainSource: "Fossil fuel combustion",
        bestPractice: "Electric vehicles and route optimization",
        impact: "Very High",
      },
      Textiles: {
        avgReduction: "7%",
        mainSource: "Manufacturing and chemical processes",
        bestPractice: "Sustainable materials and efficient production",
        impact: "Medium-High",
      },
    };

    return (
      industryMap[industry] || {
        avgReduction: "N/A",
        mainSource: "Various sources",
        bestPractice: "Industry-specific reduction strategies",
        impact: "Variable",
      }
    );
  };

  const context = getIndustryContext(industryName);

  return (
    <TooltipWrapper title={`${industryName} Industry Emissions`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">CO₂ Emissions:</span>
          <span className="font-medium text-gray-900">{emissions} tons</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">YoY Reduction:</span>
          <span className="font-medium text-green-600">
            {context.avgReduction}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Environmental Impact:</span>
          <span className="font-medium text-gray-900">{context.impact}</span>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-1.5">
            <span className="font-medium">Main Sources:</span>{" "}
            {context.mainSource}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Best Practice:</span>{" "}
            {context.bestPractice}
          </p>
        </div>
      </div>
    </TooltipWrapper>
  );
};

// Enhanced tooltip for water usage trend
export const WaterUsageTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const month = data.month;
  const usage = data.usage;

  // Calculate percent change from first month (assuming January is first)
  const firstMonthUsage = 132; // First month value from the dataset
  const percentChange = (
    ((usage - firstMonthUsage) / firstMonthUsage) *
    100
  ).toFixed(1);
  const isReduction = percentChange < 0;

  return (
    <TooltipWrapper title="Water Conservation">
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Month:</span>
          <span className="font-medium text-gray-900">{month}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Usage:</span>
          <span className="font-medium text-gray-900">
            {usage} gallons/unit
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Since Jan:</span>
          <div className="flex items-center">
            {isReduction ? (
              <ArrowTrendingDownIcon className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <ArrowTrendingUpIcon className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span
              className={`font-medium ${
                isReduction ? "text-green-600" : "text-red-600"
              }`}
            >
              {isReduction ? percentChange.replace("-", "") : percentChange}%
            </span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            {isReduction
              ? `Water usage has decreased by ${percentChange.replace(
                  "-",
                  ""
                )}% since January, showing positive conservation trends.`
              : `Water usage has increased by ${percentChange}% since January, indicating areas for improvement.`}
          </p>
        </div>
      </div>
    </TooltipWrapper>
  );
};

// Additional tooltips for other charts...
export const RenewableEnergyTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const data = payload[0].payload;
  const energyType = data.name;
  const percentage = data.value;

  // Energy type context
  const getEnergyContext = (type) => {
    const contextMap = {
      Solar: {
        growth: "+15% YoY",
        costTrend: "Decreasing",
        co2Reduction: "High",
        implementation: "Solar panels on facility rooftops and solar farms",
      },
      Wind: {
        growth: "+12% YoY",
        costTrend: "Stable",
        co2Reduction: "High",
        implementation: "Wind farm contracts and on-site turbines",
      },
      Hydro: {
        growth: "+3% YoY",
        costTrend: "Stable",
        co2Reduction: "Medium-High",
        implementation: "Hydroelectric power purchasing agreements",
      },
      Biomass: {
        growth: "+5% YoY",
        costTrend: "Variable",
        co2Reduction: "Medium",
        implementation: "Waste-to-energy and agricultural byproducts",
      },
      Traditional: {
        growth: "-8% YoY",
        costTrend: "Increasing",
        co2Reduction: "None",
        implementation: "Fossil fuel-based electricity sources",
      },
    };

    return (
      contextMap[type] || {
        growth: "N/A",
        costTrend: "Variable",
        co2Reduction: "Variable",
        implementation: "Various sources",
      }
    );
  };

  const context = getEnergyContext(energyType);
  const isRenewable = energyType !== "Traditional";

  return (
    <TooltipWrapper title={`${energyType} Energy`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Percentage:</span>
          <span className="font-medium text-gray-900">{percentage}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Growth:</span>
          <span
            className={`font-medium ${
              context.growth.includes("+") ? "text-green-600" : "text-red-600"
            }`}
          >
            {context.growth}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">CO₂ Reduction:</span>
          <span
            className={`font-medium ${
              isRenewable ? "text-green-600" : "text-gray-500"
            }`}
          >
            {context.co2Reduction}
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Cost Trend:</span> {context.costTrend}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Implementation:</span>{" "}
            {context.implementation}
          </p>
        </div>
      </div>
    </TooltipWrapper>
  );
};

export const SustainablePracticesTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  // Get data from both payloads (Bar and Line)
  const practice = payload[0]?.payload.practice || "";
  const adoption = payload[0]?.value || 0;
  const target = payload[1]?.value || 0;

  // Calculate gap to target
  const gap = target - adoption;
  const percentComplete = ((adoption / target) * 100).toFixed(0);

  // Practice-specific context
  const getPracticeContext = (practice) => {
    const contextMap = {
      Recycling: {
        impact: "Reduced landfill waste and resource consumption",
        challenge: "Sorting and processing mixed materials",
        timeframe: "Short-term",
        roi: "Medium",
      },
      "Waste Reduction": {
        impact: "Lower environmental footprint and reduced disposal costs",
        challenge: "Redesigning processes and packaging",
        timeframe: "Medium-term",
        roi: "High",
      },
      "Green Packaging": {
        impact: "Reduced plastic pollution and improved brand image",
        challenge: "Cost and durability of alternative materials",
        timeframe: "Medium-term",
        roi: "Medium-High",
      },
      "Carbon Offsets": {
        impact: "Neutralized emissions and support for climate projects",
        challenge: "Verification and ensuring actual impact",
        timeframe: "Immediate",
        roi: "Variable",
      },
      Circularity: {
        impact: "Drastically reduced waste and resource use",
        challenge: "Requires complete redesign of product lifecycle",
        timeframe: "Long-term",
        roi: "Very High (long-term)",
      },
    };

    return (
      contextMap[practice] || {
        impact: "Various environmental benefits",
        challenge: "Implementation and adoption barriers",
        timeframe: "Variable",
        roi: "Dependent on specific practice",
      }
    );
  };

  const context = getPracticeContext(practice);

  return (
    <TooltipWrapper title={`${practice}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Current Adoption:</span>
          <span className="font-medium text-gray-900">{adoption}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Target:</span>
          <span className="font-medium text-gray-900">{target}%</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Progress:</span>
          <span
            className={`font-medium ${
              parseInt(percentComplete) > 75
                ? "text-green-600"
                : parseInt(percentComplete) > 50
                ? "text-yellow-600"
                : "text-orange-600"
            }`}
          >
            {percentComplete}% complete
          </span>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Impact:</span> {context.impact}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Challenge:</span> {context.challenge}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">ROI:</span> {context.roi} (
            {context.timeframe})
          </p>
        </div>
      </div>
    </TooltipWrapper>
  );
};

export const SustainabilityMetricsTooltip = ({
  active,
  payload,
  label,
}: TooltipProps<number, string>) => {
  if (!active || !payload || !payload.length) return null;

  const metric = payload[0]?.payload.metric || "";
  const current = payload[0]?.value || 0;
  const industry = payload[1]?.value || 0;

  // Calculate difference from industry average
  const difference = current - industry;
  const percentDifference = ((difference / industry) * 100).toFixed(0);

  // Metric-specific context
  const getMetricContext = (metric) => {
    const contextMap = {
      "CO₂ Reduction": {
        importance: "Critical for climate change mitigation",
        leadingPractice: "Science-based targets and carbon neutrality plans",
        industry: "Highest performers achieving 80%+ reduction goals",
        impact: "Direct impact on global warming",
      },
      "Water Conservation": {
        importance: "Essential for ecosystem health and resource management",
        leadingPractice: "Closed-loop water systems and rainwater harvesting",
        industry: "Leaders reducing consumption by 40%+ annually",
        impact: "Critical for water-stressed regions",
      },
      "Waste Management": {
        importance: "Reduces pollution and conserves resources",
        leadingPractice: "Zero waste certification and circular approaches",
        industry: "Top performers divert 95%+ waste from landfills",
        impact: "Reduced landfill use and contamination",
      },
      "Renewable Energy": {
        importance: "Key to decarbonization and energy independence",
        leadingPractice: "100% renewable energy commitments",
        industry: "Leaders achieve 90%+ renewable electricity",
        impact: "Significant carbon footprint reduction",
      },
      "Social Impact": {
        importance: "Ensures ethical practices and community benefits",
        leadingPractice: "Fair labor certifications and community investment",
        industry: "Leaders embed social impact throughout business model",
        impact: "Improved livelihoods and reduced inequality",
      },
    };

    return (
      contextMap[metric] || {
        importance: "Contributes to overall sustainability",
        leadingPractice: "Best-in-class industry standards",
        industry: "Varies by sector and region",
        impact: "Depends on implementation",
      }
    );
  };

  const context = getMetricContext(metric);

  return (
    <TooltipWrapper title={`${metric}`}>
      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Your Performance:</span>
          <span className="font-medium text-emerald-600">{current}/100</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Industry Average:</span>
          <span className="font-medium text-indigo-600">{industry}/100</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-gray-600">Difference:</span>
          <div className="flex items-center">
            {difference > 0 ? (
              <ArrowTrendingUpIcon className="h-4 w-4 text-green-600 mr-1" />
            ) : (
              <ArrowTrendingDownIcon className="h-4 w-4 text-red-600 mr-1" />
            )}
            <span
              className={`font-medium ${
                difference > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {difference > 0 ? "+" : ""}
              {percentDifference}%
            </span>
          </div>
        </div>
        <div className="mt-2 pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Importance:</span>{" "}
            {context.importance}
          </p>
          <p className="text-sm text-gray-600 mb-1">
            <span className="font-medium">Leading Practice:</span>{" "}
            {context.leadingPractice}
          </p>
          <p className="text-sm text-gray-600">
            <span className="font-medium">Impact:</span> {context.impact}
          </p>
        </div>
      </div>
    </TooltipWrapper>
  );
};
