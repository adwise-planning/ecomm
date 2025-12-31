import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useQueryData } from '../../../hooks/useQueryData';
import { api } from '../../../services/api';
import { Skeleton } from '../../ui/Skeleton';
import WidgetError from '../WidgetError';

const ShippingCostChart = ({ dateRange }) => {
  const { data, isLoading, isError, error } = useQueryData(
    ['shippingAnalytics', dateRange],
    () => api.getShippingAnalytics(dateRange)
  );

  if (isLoading) {
    return <div className="card h-[300px]"><Skeleton className="h-full w-full" /></div>;
  }

  if (isError) {
    return <div className="card h-[300px]"><WidgetError message={error.message} /></div>;
  }

  if (!data || !data.revenueVsShipping) {
    return <div className="card h-[300px] flex items-center justify-center"><p>No shipping analytics available.</p></div>;
  }

  const chartData = [
    { name: 'Revenue', value: data.revenueVsShipping.revenue, fill: '#8884d8' },
    { name: 'Shipping Cost', value: data.revenueVsShipping.shippingCost, fill: '#82ca9d' },
  ];

  return (
    <div className="card h-[300px]">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4">Revenue vs. Shipping Cost</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} layout="vertical">
          <CartesianGrid strokeDasharray="3 3" horizontal={false} />
          <XAxis type="number" tick={{ fill: '#94a3b8' }} />
          <YAxis type="category" dataKey="name" tick={{ fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default ShippingCostChart;
