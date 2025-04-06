import React, { useState } from "react";
import {
  LightBulbIcon,
  ChevronDownIcon,
  ChevronUpIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  FireIcon,
  ChartBarSquareIcon,
  FlagIcon,
} from "@heroicons/react/24/outline";

interface Insight {
  type: "trend" | "observation" | "outlier" | "recommendation" | "risk";
  content: string;
  impact?: "positive" | "negative" | "neutral";
  severity?: "low" | "medium" | "high";
}

interface InsightsPanelProps {
  title: string;
  insights: Insight[];
  showByDefault?: boolean;
}

// Map insight types to their icons and colors
const insightTypeConfig = {
  trend: {
    icon: ArrowTrendingUpIcon,
    baseColor: "text-blue-600",
    bgColor: "bg-blue-50",
    borderColor: "border-blue-200",
    label: "Trend",
  },
  observation: {
    icon: ChartBarSquareIcon,
    baseColor: "text-purple-600",
    bgColor: "bg-purple-50",
    borderColor: "border-purple-200",
    label: "Observation",
  },
  outlier: {
    icon: FireIcon,
    baseColor: "text-orange-600",
    bgColor: "bg-orange-50",
    borderColor: "border-orange-200",
    label: "Outlier",
  },
  recommendation: {
    icon: LightBulbIcon,
    baseColor: "text-yellow-600",
    bgColor: "bg-yellow-50",
    borderColor: "border-yellow-200",
    label: "Recommendation",
  },
  risk: {
    icon: FlagIcon,
    baseColor: "text-red-600",
    bgColor: "bg-red-50",
    borderColor: "border-red-200",
    label: "Risk",
  },
};

// Map impact to colors
const impactColors = {
  positive: "text-green-600",
  negative: "text-red-600",
  neutral: "text-gray-600",
};

// Map severity to visual indicators
const severityIndicators = {
  low: { color: "bg-yellow-400", width: "w-2" },
  medium: { color: "bg-orange-500", width: "w-4" },
  high: { color: "bg-red-600", width: "w-6" },
};

const InsightsPanel: React.FC<InsightsPanelProps> = ({
  title,
  insights,
  showByDefault = false,
}) => {
  const [isExpanded, setIsExpanded] = useState(showByDefault);

  return (
    <div className="mt-4 rounded-lg border border-gray-200 overflow-hidden">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full px-4 py-3 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors duration-200"
      >
        <div className="flex items-center">
          <LightBulbIcon className="h-5 w-5 text-yellow-500 mr-2" />
          <span className="font-medium text-gray-700">{title}</span>
          <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-1.5 py-0.5 rounded-full">
            {insights.length}
          </span>
        </div>
        {isExpanded ? (
          <ChevronUpIcon className="h-5 w-5 text-gray-500" />
        ) : (
          <ChevronDownIcon className="h-5 w-5 text-gray-500" />
        )}
      </button>

      {isExpanded && (
        <div className="divide-y divide-gray-200">
          {insights.map((insight, index) => {
            const config = insightTypeConfig[insight.type];
            const Icon = config.icon;

            return (
              <div
                key={index}
                className={`px-4 py-3 ${config.bgColor} ${
                  insight.severity ? "border-l-4" : ""
                } ${
                  insight.severity
                    ? severityIndicators[insight.severity].color
                    : ""
                }`}
              >
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <Icon className={`h-5 w-5 ${config.baseColor} mt-0.5`} />
                  </div>
                  <div className="ml-3">
                    <div className="flex items-center space-x-2 mb-1">
                      <span
                        className={`text-xs font-medium px-2 py-0.5 rounded-full ${config.bgColor} ${config.baseColor} border ${config.borderColor}`}
                      >
                        {config.label}
                      </span>
                      {insight.impact && (
                        <span
                          className={`text-xs ${impactColors[insight.impact]}`}
                        >
                          {insight.impact.charAt(0).toUpperCase() +
                            insight.impact.slice(1)}{" "}
                          Impact
                        </span>
                      )}
                      {insight.severity && (
                        <div className="flex items-center space-x-1">
                          <span className="text-xs text-gray-500">
                            Severity:
                          </span>
                          <div className="flex items-center space-x-0.5">
                            <div
                              className={`h-2 ${severityIndicators.low.width} ${
                                insight.severity === "low"
                                  ? severityIndicators.low.color
                                  : "bg-gray-300"
                              } rounded-sm`}
                            ></div>
                            <div
                              className={`h-2 ${
                                severityIndicators.medium.width
                              } ${
                                insight.severity === "medium" ||
                                insight.severity === "high"
                                  ? severityIndicators.medium.color
                                  : "bg-gray-300"
                              } rounded-sm`}
                            ></div>
                            <div
                              className={`h-2 ${
                                severityIndicators.high.width
                              } ${
                                insight.severity === "high"
                                  ? severityIndicators.high.color
                                  : "bg-gray-300"
                              } rounded-sm`}
                            ></div>
                          </div>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{insight.content}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

// Sample insights for each chart type
export const chartInsights = {
  ethicalScore: [
    {
      type: "trend" as const,
      content:
        "The proportion of suppliers scoring above 60 has increased by 15% year-over-year, indicating successful supplier development programs.",
      impact: "positive" as const,
    },
    {
      type: "observation" as const,
      content:
        "There is a bimodal distribution pattern, with clusters in the 41-60 and 61-80 ranges, suggesting two distinct supplier groups.",
      impact: "neutral" as const,
    },
    {
      type: "risk" as const,
      content:
        "10% of suppliers score below 40, representing significant ethical risk exposure that requires immediate attention.",
      impact: "negative" as const,
      severity: "high" as const,
    },
    {
      type: "recommendation" as const,
      content:
        "Focus improvement efforts on moving suppliers from the 41-60 range into the 61-80 range through targeted interventions.",
      impact: "positive" as const,
    },
  ],
  co2Emissions: [
    {
      type: "observation" as const,
      content:
        "Manufacturing sector accounts for 42% of total emissions, followed by Transportation at 28%, highlighting key focus areas.",
      impact: "neutral" as const,
    },
    {
      type: "trend" as const,
      content:
        "Technology sector emissions have decreased by 23% since last year due to increased adoption of cloud efficiency measures.",
      impact: "positive" as const,
    },
    {
      type: "recommendation" as const,
      content:
        "Prioritize emission reduction initiatives in Manufacturing and Transportation sectors for maximum impact.",
      impact: "positive" as const,
    },
    {
      type: "risk" as const,
      content:
        "Agricultural emissions are increasing contrary to the overall downward trend, potentially due to expanded production.",
      impact: "negative" as const,
      severity: "medium" as const,
    },
  ],
  waterUsage: [
    {
      type: "trend" as const,
      content:
        "Water usage has decreased consistently month-over-month, with a 34.8% total reduction since January.",
      impact: "positive" as const,
    },
    {
      type: "observation" as const,
      content:
        "The rate of improvement is slowing in recent months, suggesting diminishing returns from current initiatives.",
      impact: "neutral" as const,
    },
    {
      type: "recommendation" as const,
      content:
        "Implement advanced water recycling systems to maintain improvement momentum beyond simple efficiency measures.",
      impact: "positive" as const,
    },
    {
      type: "observation" as const,
      content:
        "Current water usage (86 gallons/unit) is already below the target threshold of 100 gallons/unit, exceeding goals.",
      impact: "positive" as const,
    },
  ],
  renewableEnergy: [
    {
      type: "observation" as const,
      content:
        "Renewable energy sources now account for 83% of total energy usage, with solar (35%) and wind (28%) as the largest contributors.",
      impact: "positive" as const,
    },
    {
      type: "trend" as const,
      content:
        "Traditional energy sources have decreased from 42% to 17% over the past two years, significantly reducing carbon footprint.",
      impact: "positive" as const,
    },
    {
      type: "outlier" as const,
      content:
        "Biomass adoption (8%) is significantly lower than other renewable sources due to supply chain constraints.",
      impact: "neutral" as const,
    },
    {
      type: "recommendation" as const,
      content:
        "Set a goal of 95% renewable energy by 2026, focusing on transitioning the remaining 17% of traditional energy usage.",
      impact: "positive" as const,
    },
  ],
  sustainablePractices: [
    {
      type: "observation" as const,
      content:
        "Recycling has the highest adoption rate at 78%, approaching the target of 95% due to longstanding programs.",
      impact: "positive" as const,
    },
    {
      type: "risk" as const,
      content:
        "Circularity initiatives show the largest gap between current adoption (38%) and target (80%), requiring significant investment.",
      impact: "negative" as const,
      severity: "medium" as const,
    },
    {
      type: "trend" as const,
      content:
        "Green Packaging adoption has increased by 18% in six months following new supplier incentive programs.",
      impact: "positive" as const,
    },
    {
      type: "recommendation" as const,
      content:
        "Develop specialized training and resource-sharing programs focused on Circularity to accelerate adoption.",
      impact: "positive" as const,
    },
  ],
  sustainabilityMetrics: [
    {
      type: "observation" as const,
      content:
        "Your supply chain outperforms industry averages across all sustainability metrics, with an average advantage of 17 points.",
      impact: "positive" as const,
    },
    {
      type: "outlier" as const,
      content:
        "Renewable Energy shows the largest performance gap (+21 points above industry average), reflecting successful energy initiatives.",
      impact: "positive" as const,
    },
    {
      type: "risk" as const,
      content:
        "Social Impact shows the smallest advantage (+12 points), indicating a potential area of vulnerability relative to other metrics.",
      impact: "negative" as const,
      severity: "low" as const,
    },
    {
      type: "recommendation" as const,
      content:
        "Develop a targeted Social Impact improvement plan to maintain leadership across all sustainability dimensions.",
      impact: "positive" as const,
    },
  ],
};

export default InsightsPanel;
