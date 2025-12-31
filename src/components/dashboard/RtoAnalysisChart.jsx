import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useQueryData } from '../../hooks/useQueryData';
import { api } from '../../services/api';
import { Skeleton } from '../../components/ui/Skeleton';
import WidgetError from '../../components/dashboard/WidgetError';

const RtoAnalysisChart = () => {
  const { data, isLoading, isError, error, refetch } = useQueryData(
    ['rtoAnalysis'],
    api.getRtoAnalysis
  );

  if (isLoading) {
    return <Skeleton className="h-64" />;
  }

  if (isError) {
    return <WidgetError message={error.message} onRetry={refetch} />;
  }

  const chartData = data?.analysis || [];

  if (chartData.length === 0) {
    return <div className="text-center py-10">No RTO data available.</div>;
  }

  return (
    <div className="card h-full">
      <h3 className="font-bold mb-4">RTO Analysis by Region</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="region" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="rto_percentage" fill="#8884d8" name="RTO %" />
          <Bar dataKey="total_orders" fill="#82ca9d" name="Total Orders" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RtoAnalysisChart;
