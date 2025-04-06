import React from "react";

interface EthicalScoreTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: string;
}

// Helper function to get score assessment based on value
const getScoreAssessment = (score: number) => {
  if (score >= 80) return "Excellent: Industry leader";
  if (score >= 70) return "Very Good: Above industry average";
  if (score >= 60) return "Good: Meeting established standards";
  if (score >= 50) return "Fair: Room for improvement";
  if (score >= 40) return "Concerning: Below industry standards";
  return "Critical: Immediate attention required";
};

const EthicalScoreTooltip: React.FC<EthicalScoreTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const score = payload[0].value;
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-sm font-medium">{`${payload[0].name}`}</p>
        <p className="text-sm text-gray-700">
          <span
            className={`font-semibold ${
              score >= 60
                ? "text-emerald-600"
                : score >= 40
                ? "text-amber-600"
                : "text-red-600"
            }`}
          >
            {score}%
          </span>
        </p>
        <p className="text-xs text-gray-500 mt-1">
          {getScoreAssessment(score)}
        </p>
      </div>
    );
  }
  return null;
};

export default EthicalScoreTooltip;
