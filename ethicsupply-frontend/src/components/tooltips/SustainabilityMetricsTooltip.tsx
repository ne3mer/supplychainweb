import React from "react";

interface SustainabilityMetricsTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const SustainabilityMetricsTooltip: React.FC<
  SustainabilityMetricsTooltipProps
> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const currentData = payload.find((p: any) => p.dataKey === "current");
    const industryData = payload.find((p: any) => p.dataKey === "industry");

    if (currentData && industryData) {
      const difference = currentData.value - industryData.value;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-medium">{`${payload[0].payload.metric}`}</p>
          <p className="text-sm text-gray-700">{`Your performance: ${currentData.value}/100`}</p>
          <p className="text-sm text-gray-700">{`Industry average: ${industryData.value}/100`}</p>
          <p className="text-xs text-green-600 mt-1 font-semibold">
            {difference > 0
              ? `${difference} points above average`
              : difference === 0
              ? "At industry average"
              : `${Math.abs(difference)} points below average`}
          </p>
        </div>
      );
    }
  }
  return null;
};

export default SustainabilityMetricsTooltip;
