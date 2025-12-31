import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useQueryData } from '../../../hooks/useQueryData';
import { api } from '../../../services/api';
import { Skeleton } from '../../ui/Skeleton';
import WidgetError from '../WidgetError';

const RtoTrendChart = ({ dateRange }) => {
  const { data, isLoading, isError, error } = useQueryData(
    ['rtoTrend', dateRange],
    () => api.getRtoTrend(dateRange)
  );

  if (isLoading) {
    return <div className="card h-[300px]"><Skeleton className="h-full w-full" /></div>;
  }

  if (isError) {
    return <div className="card h-[300px]"><WidgetError message={error.message} /></div>;
  }

  if (!data || data.trend.length === 0) {
    return <div className="card h-[300px] flex items-center justify-center"><p>No RTO trend data available.</p></div>;
  }

  return (
    <div className="card h-[300px]">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4">RTO Trend</h3>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data.trend}>
          <CartesianGrid strokeDasharray="3 3" vertical={false} />
          <XAxis dataKey="name" tick={{ fill: '#94a3b8' }} />
          <YAxis tick={{ fill: '#94a3b8' }} />
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
          <Area type="monotone" dataKey="rtoRate" stroke="#EF4444" fill="#EF4444" fillOpacity={0.1} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RtoTrendChart;
