import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";

interface CO2Emission {
  name: string;
  value: number;
}

interface CO2EmissionsChartProps {
  data: CO2Emission[];
}

const COLORS = [
  "#059669",
  "#10b981",
  "#14b8a6",
  "#0ea5e9",
  "#6366f1",
  "#8b5cf6",
  "#ec4899",
];

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-sm font-medium">{`${payload[0].name}`}</p>
        <p className="text-sm text-gray-700">{`CO₂ Emissions: ${payload[0].value.toFixed(
          1
        )} tons`}</p>
      </div>
    );
  }
  return null;
};

const CO2EmissionsChart: React.FC<CO2EmissionsChartProps> = ({ data }) => {
  // Ensure we have data to display
  const chartData =
    data && data.length > 0 ? data : [{ name: "No Data", value: 1 }];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={chartData}
          cx="50%"
          cy="50%"
          labelLine={false}
          outerRadius={80}
          fill="#8884d8"
          dataKey="value"
          label={({ name, percent }) =>
            `${name} ${(percent * 100).toFixed(0)}%`
          }
        >
          {chartData.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip content={<CustomTooltip />} />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
};

export default CO2EmissionsChart;
