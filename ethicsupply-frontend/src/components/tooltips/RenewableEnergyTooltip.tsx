import React from "react";

interface RenewableEnergyTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

const RenewableEnergyTooltip: React.FC<RenewableEnergyTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const data = payload[0];
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-sm font-medium">{`${data.name}`}</p>
        <p className="text-sm text-gray-700">{`${data.value}% of total energy use`}</p>
        <p className="text-xs text-gray-500 mt-1">
          {data.name === "Traditional"
            ? "Goal: Reduce to below 10% by 2025"
            : `Renewable source`}
        </p>
      </div>
    );
  }
  return null;
};

export default RenewableEnergyTooltip;
