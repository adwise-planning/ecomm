import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useQueryData } from '../../hooks/useQueryData';
import { api } from '../../services/api';
import { Skeleton } from '../../components/ui/Skeleton';
import WidgetError from '../../components/dashboard/WidgetError';

const ShippingCostPerOrderChart = () => {
  const { data, isLoading, isError, error, refetch } = useQueryData(
    ['shippingCostPerOrder'],
    api.getShippingCostPerOrder
  );

  if (isLoading) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return <WidgetError message={error.message} onRetry={refetch} />;
  }

  const chartData = data?.analysis || [];

  if (chartData.length === 0) {
    return <div className="text-center py-10">No shipping cost data available.</div>;
  }

  // Example threshold for flagging, this could be dynamic
  const costThreshold = 100;

  return (
    <div className="card h-full">
      <h3 className="font-bold mb-4">Shipping Cost Per Order</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="order_date" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Line type="monotone" dataKey="shipping_cost" stroke="#8884d8" name="Shipping Cost (INR)" />
          <ReferenceLine y={costThreshold} label="High Cost Threshold" stroke="red" strokeDasharray="3 3" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShippingCostPerOrderChart;
