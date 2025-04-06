import React from "react";

interface SustainablePracticesTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const SustainablePracticesTooltip: React.FC<
  SustainablePracticesTooltipProps
> = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    const adoptionData = payload.find((p: any) => p.dataKey === "adoption");
    const targetData = payload.find((p: any) => p.dataKey === "target");

    if (adoptionData && targetData) {
      const gap = targetData.value - adoptionData.value;
      return (
        <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
          <p className="text-sm font-medium">{`${label}`}</p>
          <p className="text-sm text-gray-700">{`Current: ${adoptionData.value}%`}</p>
          <p className="text-sm text-gray-700">{`Target: ${targetData.value}%`}</p>
          <p className="text-xs text-gray-500 mt-1">
            {gap > 0 ? `Gap to close: ${gap}%` : "Target achieved"}
          </p>
        </div>
      );
    }
  }
  return null;
};

export default SustainablePracticesTooltip;
