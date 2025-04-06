import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface SupplierGeoChartProps {
  data: Record<string, number>;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="text-sm font-medium">{`${label}`}</p>
        <p className="text-sm text-gray-700">{`Suppliers: ${payload[0].value}`}</p>
      </div>
    );
  }
  return null;
};

const SupplierGeoChart: React.FC<SupplierGeoChartProps> = ({ data }) => {
  // Convert the data object to an array format for ReCharts
  const chartData = Object.keys(data).map((country) => ({
    country,
    count: data[country],
  }));

  // Sort the data by count in descending order
  chartData.sort((a, b) => b.count - a.count);

  // If no data is available, show placeholder
  const displayData = chartData.length
    ? chartData
    : [{ country: "No Data", count: 0 }];

  return (
    <ResponsiveContainer width="100%" height="100%">
      <BarChart
        data={displayData}
        layout="vertical"
        margin={{ top: 20, right: 30, left: 70, bottom: 5 }}
      >
        <CartesianGrid
          strokeDasharray="3 3"
          horizontal={true}
          vertical={false}
        />
        <XAxis type="number" />
        <YAxis
          type="category"
          dataKey="country"
          tick={{ fontSize: 12 }}
          width={60}
        />
        <Tooltip content={<CustomTooltip />} />
        <Bar dataKey="count" fill="#0ea5e9" radius={[0, 4, 4, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

export default SupplierGeoChart;
