import React, { useState } from "react";
import {
  InformationCircleIcon,
  XMarkIcon,
  LightBulbIcon,
  ChartBarIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface ChartInfoProps {
  content?: {
    title?: string;
    description?: string;
    insights?: string[];
    recommendations?: string[];
    methodology?: string;
    dataSource?: string;
    chartType?: string;
  };
}

const ChartInfoOverlay: React.FC<ChartInfoProps> = ({
  content = {
    title: "",
    description: "",
    insights: [],
    recommendations: [],
    methodology: "",
    dataSource: "Supplier data collected from Jan-Aug 2025",
    chartType: "",
  },
}) => {
  const [isOpen, setIsOpen] = useState(false);

  // Chart type descriptive content
  const getChartTypeDescription = (type: string = "") => {
    if (!type)
      return "This chart visualizes key sustainability metrics for analysis and decision-making.";

    const descriptions: Record<string, string> = {
      bar: "Bar charts display categorical data with rectangular bars proportional to the values they represent. They're excellent for comparing data across categories.",
      pie: "Pie charts show the proportion of each category as a slice of the whole circle. They're ideal for showing composition and percentage distribution.",
      line: "Line charts display information as a series of data points connected by straight line segments. They effectively show trends over time.",
      area: "Area charts are similar to line charts but with the area below the line filled in. They emphasize the magnitude of change over time.",
      radar:
        "Radar charts compare multiple variables on a two-dimensional plane. They're useful for showing performance metrics across multiple categories.",
      composed:
        "Composed charts combine multiple chart types (like bars and lines) to represent related but different data sets together.",
    };

    return (
      descriptions[type.toLowerCase()] ||
      "This chart visualizes key sustainability metrics for analysis and decision-making."
    );
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="text-gray-400 hover:text-gray-600 focus:outline-none"
        aria-label={`Show information about ${content.title || "this chart"}`}
      >
        <InformationCircleIcon className="h-5 w-5" />
      </button>

      {isOpen && (
        <div className="absolute right-0 z-10 mt-2 w-72 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5">
          <div className="p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-gray-900">
                {content.title || "Chart Information"}
              </h3>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <span aria-hidden="true">&times;</span>
              </button>
            </div>
            <div className="mt-2">
              <p className="text-sm text-gray-500">
                {content.description ||
                  getChartTypeDescription(content.chartType)}
              </p>
            </div>
            {content.insights && content.insights.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Key Insights
                </h4>
                <ul className="space-y-2">
                  {content.insights.map((insight, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-emerald-500 mr-2 flex-shrink-0 mt-0.5">
                        •
                      </span>
                      <span className="text-sm text-gray-600">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.recommendations && content.recommendations.length > 0 && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <LightBulbIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  Recommendations
                </h4>
                <ul className="space-y-2">
                  {content.recommendations.map((rec, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRightIcon className="h-4 w-4 text-emerald-500 mr-1 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{rec}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            {content.methodology && (
              <div className="mt-2">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Methodology
                </h4>
                <p className="text-sm text-gray-600">{content.methodology}</p>
              </div>
            )}
            <div className="mt-2 pt-2 border-t border-gray-200">
              <p className="text-xs text-gray-500 italic">
                Data Source:{" "}
                {content.dataSource ||
                  "Supplier data collected from Jan-Aug 2025"}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Predefined chart info objects
export const chartInfoContent = {
  ethicalScore: {
    title: "Ethical Score Distribution",
    chartType: "bar",
    description:
      "Distribution of suppliers across ethical score ranges from 0-100.",
    insights: [
      "The majority of suppliers fall in the 61-80 range, indicating generally good ethical practices.",
      "There are still 15% of suppliers in the concerning range (below 40), requiring immediate attention.",
      "Top performers (81-100) represent only 18% of suppliers, suggesting room for improvement across the supply chain.",
      "The distribution follows a slightly right-skewed normal curve, which is typical for ethical scoring systems.",
    ],
    recommendations: [
      "Focus improvement efforts on suppliers scoring below 60.",
      "Develop a mentorship program where top-scoring suppliers can share best practices.",
      "Set a goal to shift the distribution curve toward higher scores over the next fiscal year.",
    ],
    methodology:
      "Ethical scores are calculated based on a weighted composite of environmental practices, labor conditions, human rights compliance, and governance transparency metrics. Each supplier is evaluated quarterly.",
  },
  co2Emissions: {
    title: "CO₂ Emissions by Industry",
    chartType: "pie",
    description:
      "Carbon emissions breakdown by industry sector in your supply chain.",
    insights: [
      "Food & Beverage sector accounts for over 70% of total CO₂ emissions in your supply chain.",
      "Electronics suppliers contribute significantly despite their smaller numbers.",
      "Consumer Goods and Apparel have relatively low emissions but represent growing segments.",
      "Small improvements in high-emitting sectors can have disproportionately positive impacts.",
    ],
    recommendations: [
      "Prioritize emission reduction programs with Food & Beverage suppliers.",
      "Implement supplier-specific carbon reduction targets based on industry benchmarks.",
      "Explore carbon offset programs for industries where direct reductions are most challenging.",
    ],
    methodology:
      "CO₂ emissions are measured in metric tons of CO₂ equivalent (tCO₂e) and include Scope 1 and 2 emissions reported by suppliers. Data is normalized by production volume.",
  },
  waterUsage: {
    title: "Water Usage Trend",
    chartType: "area",
    description: "Monthly water consumption per production unit over time.",
    insights: [
      "Water usage has consistently decreased month-over-month, demonstrating successful conservation efforts.",
      "The 41.5% reduction since January exceeds the annual goal of 25%.",
      "The steepest reduction occurred between February and April, coinciding with the implementation of new water-saving technologies.",
      "The rate of improvement is slowing, suggesting that the easiest optimization opportunities have been implemented.",
    ],
    recommendations: [
      "Investigate advanced water recycling systems for continued improvements.",
      "Share successful water conservation methods across all supplier facilities.",
      "Set more aggressive targets for high water-usage industries in your supply chain.",
    ],
    methodology:
      "Water usage is measured in gallons per production unit and accounts for all process water, excluding rainwater harvesting. The target line represents the 2025 year-end goal.",
  },
  renewableEnergy: {
    title: "Renewable Energy Adoption",
    chartType: "pie",
    description: "Breakdown of energy sources used across your supply chain.",
    insights: [
      "Renewable energy sources now account for 83% of your supply chain's energy mix, exceeding industry averages.",
      "Solar and wind energy represent the largest renewable sources, reflecting their cost-effectiveness and scalability.",
      "Traditional energy sources have decreased from 42% to 17% over the past two years.",
      "Biomass adoption remains relatively low due to availability constraints in certain regions.",
    ],
    recommendations: [
      "Set a target of 95% renewable energy by 2026 with a focus on reducing the remaining traditional energy usage.",
      "Explore combined solar and wind installations for suppliers with suitable facilities.",
      "Develop a transition plan for suppliers still heavily reliant on traditional energy sources.",
    ],
    methodology:
      "Energy data is collected from supplier facilities and categorized by source. Percentages represent the proportion of total energy consumption across all suppliers.",
  },
  sustainablePractices: {
    title: "Sustainable Practices Adoption",
    chartType: "composed",
    description:
      "Current adoption rates versus target goals for key sustainable practices.",
    insights: [
      "Recycling has the highest adoption rate at 92%, approaching the target of 95%.",
      "Zero Waste initiatives have the lowest adoption rate at 54%, reflecting the complexity of implementation.",
      "The gap between current adoption and targets is largest for Emissions Reduction and Water Conservation.",
      "Renewable Energy adoption is accelerating due to recent supplier incentive programs.",
    ],
    recommendations: [
      "Provide additional support for Zero Waste initiatives through training and resource sharing.",
      "Create a supplier recognition program for those meeting or exceeding targets across multiple practices.",
      "Develop industry-specific roadmaps for implementing the more challenging practices.",
    ],
    methodology:
      "Adoption rates are calculated based on supplier self-reporting, verified by audit sampling. Targets are set based on industry best practices and organizational sustainability goals.",
  },
  sustainabilityMetrics: {
    title: "Sustainability Performance",
    chartType: "radar",
    description: "Your sustainability metrics compared to industry averages.",
    insights: [
      "Your supply chain outperforms industry averages across all sustainability metrics.",
      "The largest performance gap is in Waste Reduction, where you exceed the industry average by 32 points.",
      "The smallest performance gap is in Social Impact, suggesting an area for potential focus.",
      "Energy Efficiency shows strong performance relative to industry benchmarks, validating recent initiatives.",
    ],
    recommendations: [
      "Leverage your leadership position in Waste Reduction to attract environmentally conscious customers and partners.",
      "Develop a targeted Social Impact improvement plan to address the narrower performance gap.",
      "Share your Energy Efficiency strategies with suppliers who are underperforming in this area.",
    ],
    methodology:
      "Metrics are scored on a scale of 0-100 based on quantitative performance indicators. Industry averages are derived from benchmark studies across comparable organizations in your sector.",
  },
  riskBreakdown: {
    title: "Risk Breakdown",
    chartType: "pie",
    description:
      "Distribution of suppliers by risk category, from low to critical risk levels.",
    insights: [
      "Low Risk suppliers form the largest category at 42%, indicating overall good risk management.",
      "Critical Risk suppliers represent 8% of the total and require immediate attention.",
      "The Medium Risk category has grown by 15% since last quarter, suggesting emerging challenges.",
      "Risk distribution correlates strongly with geographical location and industry type.",
    ],
    recommendations: [
      "Implement enhanced monitoring for all Medium Risk suppliers to prevent escalation.",
      "Develop detailed remediation plans for each Critical Risk supplier within 30 days.",
      "Create a risk mitigation knowledge base based on strategies used by Low Risk suppliers.",
      "Conduct monthly reviews of High Risk suppliers with cross-functional team involvement.",
    ],
    methodology:
      "Risk categories are determined using a composite score across 14 risk factors including financial stability, geopolitical exposure, environmental compliance, and labor practices.",
    dataSource:
      "Quarterly risk assessments and continuous monitoring data through March 2025",
  },
  industryDistribution: {
    title: "Industry Distribution",
    chartType: "bar",
    description:
      "Breakdown of suppliers by industry sector, showing the composition of your supply chain.",
    insights: [
      "Electronics represents your largest supplier category at 33%, reflecting the tech-focused nature of your products.",
      "Consumer Goods suppliers have increased by 27% over the past year as part of your diversification strategy.",
      "Food & Beverage suppliers, though fewer in number, account for the highest procurement spend.",
      "Your Automotive supplier base is the smallest but has the highest average ethical score.",
    ],
    recommendations: [
      "Consider expanding your Automotive supplier network given their strong ethical performance.",
      "Develop industry-specific sustainability programs tailored to each sector's unique challenges.",
      "Evaluate opportunities to consolidate Electronics suppliers for improved oversight and efficiency.",
      "Create cross-industry innovation initiatives to share best practices between sectors.",
    ],
    methodology:
      "Suppliers are categorized according to standard industry classification codes and their primary business activities. Some suppliers may operate across multiple sectors but are classified by their predominant business.",
    dataSource:
      "Supplier registration data and quarterly business reviews as of Q1 2025",
  },
  complianceRate: {
    title: "Compliance Rate Trend",
    chartType: "line",
    description:
      "Monthly supplier compliance rate over the past year, showing improvement in adherence to ethical standards.",
    insights: [
      "Compliance rates have increased steadily from 63% to 90% over the 12-month period.",
      "The sharpest improvement occurred between September and November, following the implementation of the new compliance training program.",
      "The 70% threshold was passed in April, six months ahead of the projected timeline.",
      "Seasonal fluctuations are minimal, indicating robust compliance practices regardless of production cycles.",
    ],
    recommendations: [
      "Share the successful compliance improvement methodology with other business units.",
      "Set a new target of 95% compliance by Q4 2025 with appropriate incentives.",
      "Develop case studies based on the most improved suppliers to identify replicable strategies.",
      "Implement monthly compliance pulse checks rather than quarterly assessments to catch issues earlier.",
    ],
    methodology:
      "Compliance rate measures the percentage of suppliers meeting or exceeding the minimum compliance score of 70 points. The score encompasses legal, ethical, environmental, and social responsibility criteria assessed through documentation review and on-site audits.",
    dataSource:
      "Monthly supplier compliance audits and self-reporting verification through December 2024",
  },
};

export default ChartInfoOverlay;
