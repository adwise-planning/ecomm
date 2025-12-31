import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useQueryData } from '../../../hooks/useQueryData';
import { api } from '../../../services/api';
import { Skeleton } from '../../ui/Skeleton';
import WidgetError from '../WidgetError';

const MetaAdsChart = ({ dateRange }) => {
  const { data, isLoading, isError, error } = useQueryData(
    ['metaAdsAnalytics', dateRange],
    () => api.getMetaAdsAnalytics(dateRange)
  );

  if (isLoading) {
    return <div className="card h-[300px]"><Skeleton className="h-full w-full" /></div>;
  }

  if (isError) {
    return <div className="card h-[300px]"><WidgetError message={error.message} /></div>;
  }

  if (!data || !data.spendVsRevenue) {
    return <div className="card h-[300px] flex items-center justify-center"><p>No Meta Ads analytics available.</p></div>;
  }

  const chartData = [
    { name: 'Spend', value: data.spendVsRevenue.spend, fill: '#8884d8' },
    { name: 'Revenue', value: data.spendVsRevenue.revenue, fill: '#82ca9d' },
  ];

  return (
    <div className="card h-[300px]">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4">Meta Ads Spend vs. Revenue</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
          <YAxis tick={{ fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
          <Bar dataKey="value" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetaAdsChart;
