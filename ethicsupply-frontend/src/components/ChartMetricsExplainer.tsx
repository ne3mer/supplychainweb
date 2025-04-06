import React, { useState } from "react";
import {
  QuestionMarkCircleIcon,
  XMarkIcon,
  LightBulbIcon,
  ChartBarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  DocumentTextIcon,
  ArrowRightIcon,
} from "@heroicons/react/24/outline";

interface MetricExplanation {
  title: string;
  description: string;
  importance: string;
  calculation: string;
  benchmarks: {
    poor: string;
    average: string;
    good: string;
    excellent: string;
  };
  improvementStrategies: string[];
  industryTrends: string;
  relatedMetrics: string[];
}

const metricExplanations: Record<string, MetricExplanation> = {
  ethical_score: {
    title: "Ethical Score",
    description:
      "A comprehensive metric measuring a supplier's adherence to ethical business practices, human rights standards, environmental responsibility, and fair labor practices.",
    importance:
      "The Ethical Score provides a holistic view of a supplier's sustainability impact, helping identify high-risk suppliers and opportunities for improvement. It's a key predictor of long-term supplier reliability and brand reputation protection.",
    calculation:
      "Calculated as a weighted average of multiple sub-metrics including labor conditions (30%), environmental practices (30%), human rights compliance (25%), and governance transparency (15%).",
    benchmarks: {
      poor: "0-40: High-risk suppliers with significant ethical concerns requiring immediate intervention",
      average:
        "41-60: Suppliers meeting minimum standards but with substantial room for improvement",
      good: "61-80: Ethically sound suppliers with some areas for enhancement",
      excellent:
        "81-100: Industry-leading suppliers with exemplary ethical practices",
    },
    improvementStrategies: [
      "Implement supplier development programs focused on specific areas of weakness",
      "Facilitate knowledge sharing between high-performing and struggling suppliers",
      "Provide incentives for ethical improvements through preferential contracting",
      "Conduct specialized training on ethical sourcing and sustainability practices",
    ],
    industryTrends:
      "The average Ethical Score across industries has improved by 12% in the past three years, with technology and consumer goods sectors showing the fastest improvement rates.",
    relatedMetrics: [
      "Human Rights Index",
      "Environmental Impact Score",
      "Labor Conditions Rating",
    ],
  },
  co2_emissions: {
    title: "CO₂ Emissions",
    description:
      "Measures the carbon dioxide equivalent (CO₂e) emissions produced by a supplier's operations, manufacturing processes, and transportation activities.",
    importance:
      "CO₂ emissions tracking is essential for managing climate impact, meeting regulatory requirements, and achieving carbon neutrality goals. It's increasingly tied to financial performance as carbon taxes and regulations evolve.",
    calculation:
      "Measured in metric tons of CO₂ equivalent, including direct emissions (Scope 1), energy-related indirect emissions (Scope 2), and optionally upstream/downstream emissions (Scope 3).",
    benchmarks: {
      poor: ">75 tons CO₂e per $1M revenue: Significantly above industry average",
      average:
        "45-75 tons CO₂e per $1M revenue: Meeting baseline industry standards",
      good: "20-45 tons CO₂e per $1M revenue: Better than average performance",
      excellent:
        "<20 tons CO₂e per $1M revenue: Industry-leading low carbon operations",
    },
    improvementStrategies: [
      "Transition to renewable energy sources for manufacturing and operations",
      "Optimize logistics and transportation routes to minimize fuel consumption",
      "Implement energy efficiency measures across facilities",
      "Redesign products and packaging to reduce embedded carbon",
    ],
    industryTrends:
      "Global supply chains have reduced carbon intensity by approximately 7% annually over the past five years, with increasing adoption of science-based targets.",
    relatedMetrics: [
      "Energy Efficiency",
      "Renewable Energy Percentage",
      "Transportation Emissions",
    ],
  },
  water_usage: {
    title: "Water Usage",
    description:
      "Measures the total water consumption per unit of production or service delivery, including process water, cooling water, and facility usage.",
    importance:
      "Water is an increasingly scarce resource in many regions. Managing water usage reduces environmental impact, lowers operational costs, and addresses water security risks in your supply chain.",
    calculation:
      "Calculated as gallons of water used per production unit, with normalization factors applied for different industry sectors to ensure fair comparison.",
    benchmarks: {
      poor: ">150 gallons/unit: Excessive water usage requiring immediate attention",
      average: "100-150 gallons/unit: Standard industry water consumption",
      good: "50-100 gallons/unit: Efficient water management practices",
      excellent: "<50 gallons/unit: Best-in-class water conservation",
    },
    improvementStrategies: [
      "Implement closed-loop water recycling systems in production processes",
      "Install water-efficient fixtures and equipment throughout facilities",
      "Harvest rainwater for appropriate non-potable applications",
      "Monitor water usage in real-time to identify and address leaks or inefficiencies",
    ],
    industryTrends:
      "Leading companies have reduced water intensity by 30-40% over five years through technological innovation and process redesign.",
    relatedMetrics: [
      "Wastewater Quality",
      "Water Risk Exposure",
      "Water Recycling Rate",
    ],
  },
  renewable_energy: {
    title: "Renewable Energy Adoption",
    description:
      "Measures the percentage of total energy consumption derived from renewable sources such as solar, wind, hydro, and biomass.",
    importance:
      "Renewable energy adoption reduces carbon emissions, provides long-term energy price stability, and demonstrates commitment to climate goals. It's also increasingly demanded by customers and investors.",
    calculation:
      "Calculated as the percentage of total energy consumption (in kWh) derived from certified renewable sources, including both on-site generation and renewable energy credits.",
    benchmarks: {
      poor: "<25% renewable: Heavy reliance on fossil fuels",
      average: "25-50% renewable: Beginning transition to cleaner energy",
      good: "50-80% renewable: Significant progress toward sustainability",
      excellent: ">80% renewable: Industry-leading clean energy adoption",
    },
    improvementStrategies: [
      "Install on-site solar, wind or other renewable generation capacity",
      "Enter into power purchase agreements (PPAs) with renewable energy producers",
      "Purchase high-quality renewable energy credits to offset conventional energy use",
      "Gradually replace fossil fuel-powered equipment with electric alternatives",
    ],
    industryTrends:
      "Global companies are increasingly committing to 100% renewable energy targets, with average adoption rates increasing by 15-20% annually.",
    relatedMetrics: [
      "Energy Efficiency",
      "Carbon Intensity",
      "Greenhouse Gas Emissions",
    ],
  },
  sustainable_practices: {
    title: "Sustainable Practices Adoption",
    description:
      "Measures the implementation level of key sustainability practices across operations, from waste management to circular economy principles.",
    importance:
      "Adoption of sustainable practices reduces environmental impact while often improving operational efficiency. These practices are increasingly factored into supplier selection and evaluation criteria.",
    calculation:
      "Calculated as the percentage implementation level for each practice, based on documented evidence, third-party verification, and performance data.",
    benchmarks: {
      poor: "<40% adoption: Minimal sustainability integration",
      average: "40-60% adoption: Basic sustainability practices in place",
      good: "60-80% adoption: Well-developed sustainability program",
      excellent: ">80% adoption: Comprehensive sustainability integration",
    },
    improvementStrategies: [
      "Develop a formal sustainability roadmap with clear milestones and accountability",
      "Provide resources and training for implementation of priority practices",
      "Establish metrics and regular reporting on practice adoption",
      "Create incentives tied to sustainability practice implementation",
    ],
    industryTrends:
      "The focus has shifted from individual practices to integrated sustainability management systems, with increased emphasis on circularity and regenerative approaches.",
    relatedMetrics: [
      "Waste Diversion Rate",
      "Material Efficiency",
      "Product Lifecycle Impact",
    ],
  },
  sustainability_metrics: {
    title: "Sustainability Performance",
    description:
      "A multi-dimensional evaluation of sustainability performance across environmental, social, and governance dimensions compared to industry benchmarks.",
    importance:
      "Comparative sustainability performance highlights competitive advantages, risks, and opportunities relative to industry peers. It provides context for sustainability investments and target-setting.",
    calculation:
      "Each dimension is scored on a 0-100 scale based on quantitative indicators, then compared to industry average scores derived from benchmark databases and reporting frameworks.",
    benchmarks: {
      poor: "<10 points above industry average: Lagging behind peers",
      average: "10-20 points above average: Comparable to typical performers",
      good: "20-30 points above average: Outperforming most peers",
      excellent:
        ">30 points above average: Industry-leading sustainability performance",
    },
    improvementStrategies: [
      "Focus resources on metrics with the largest performance gaps",
      "Study and adapt best practices from industry leaders",
      "Set ambitious targets that exceed industry average performance",
      "Collaborate with suppliers and partners to address shared metrics",
    ],
    industryTrends:
      "The performance spread between sustainability leaders and laggards is widening, with top performers seeing financial benefits from their sustainability investments.",
    relatedMetrics: [
      "ESG Ratings",
      "Sustainability ROI",
      "Risk Exposure Indices",
    ],
  },
};

interface MetricsExplainerProps {
  metricKey: string;
}

const ChartMetricsExplainer: React.FC<MetricsExplainerProps> = ({
  metricKey,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const metricData =
    metricExplanations[metricKey] || metricExplanations.ethical_score;

  return (
    <div className="inline-block">
      <button
        onClick={() => setIsOpen(true)}
        className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200 ml-1"
        title="Learn more about this metric"
      >
        <QuestionMarkCircleIcon className="h-4 w-4" />
      </button>

      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-gray-200 px-6 py-4">
              <h3 className="text-lg font-medium text-gray-900 flex items-center">
                <ChartBarIcon className="h-5 w-5 text-emerald-500 mr-2" />
                Understanding {metricData.title}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-500 hover:text-gray-700 focus:outline-none transition-colors duration-200"
              >
                <XMarkIcon className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-6">
              {/* Definition section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <DocumentTextIcon className="h-4 w-4 text-gray-500 mr-1" />
                  Definition
                </h4>
                <p className="text-sm text-gray-600">
                  {metricData.description}
                </p>
              </div>

              {/* Importance section */}
              <div className="bg-emerald-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Why It Matters
                </h4>
                <p className="text-sm text-gray-600">{metricData.importance}</p>
              </div>

              {/* Calculation section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  How It's Calculated
                </h4>
                <p className="text-sm text-gray-600">
                  {metricData.calculation}
                </p>
              </div>

              {/* Benchmarks section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Performance Benchmarks
                </h4>
                <ul className="space-y-2">
                  <li className="flex items-start">
                    <span className="bg-red-100 text-red-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 flex-shrink-0 mt-0.5">
                      Poor
                    </span>
                    <span className="text-sm text-gray-600">
                      {metricData.benchmarks.poor}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-yellow-100 text-yellow-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 flex-shrink-0 mt-0.5">
                      Average
                    </span>
                    <span className="text-sm text-gray-600">
                      {metricData.benchmarks.average}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 flex-shrink-0 mt-0.5">
                      Good
                    </span>
                    <span className="text-sm text-gray-600">
                      {metricData.benchmarks.good}
                    </span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-green-100 text-green-800 text-xs font-medium px-2.5 py-0.5 rounded-full mr-2 flex-shrink-0 mt-0.5">
                      Excellent
                    </span>
                    <span className="text-sm text-gray-600">
                      {metricData.benchmarks.excellent}
                    </span>
                  </li>
                </ul>
              </div>

              {/* Improvement strategies section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <LightBulbIcon className="h-4 w-4 text-yellow-500 mr-1" />
                  Improvement Strategies
                </h4>
                <ul className="space-y-2">
                  {metricData.improvementStrategies.map((strategy, index) => (
                    <li key={index} className="flex items-start">
                      <ArrowRightIcon className="h-4 w-4 text-emerald-500 mr-1 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-gray-600">{strategy}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Industry trends section */}
              <div className="bg-gray-50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center">
                  <ArrowTrendingUpIcon className="h-4 w-4 text-blue-500 mr-1" />
                  Industry Trends
                </h4>
                <p className="text-sm text-gray-600">
                  {metricData.industryTrends}
                </p>
              </div>

              {/* Related metrics section */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">
                  Related Metrics
                </h4>
                <div className="flex flex-wrap gap-2">
                  {metricData.relatedMetrics.map((metric, index) => (
                    <span
                      key={index}
                      className="bg-gray-100 text-gray-800 text-xs font-medium px-2.5 py-1 rounded"
                    >
                      {metric}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="border-t border-gray-200 px-6 py-4">
              <button
                onClick={() => setIsOpen(false)}
                className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors duration-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChartMetricsExplainer;
