import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Skeleton } from '../ui/Skeleton';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import WidgetError from './WidgetError';

const RevenueChartWidget = ({ dateRange }) => {
  const { data: chartData, isLoading, isError, error } = useDashboardMetrics(dateRange, 'chartData');

  if (isError) {
    return (
        <div className="card h-[400px]">
            <WidgetError message={error.message} />
        </div>
    );
  }

  if (isLoading || !chartData) {
    return (
        <div className="card h-[400px]">
            <Skeleton className="h-full w-full" />
        </div>
    );
  }

  return (
    <div className="card h-[400px] dark:bg-slate-800 dark:border-slate-700">
      <h3 className="font-bold text-slate-800 dark:text-white mb-6">Revenue vs RTO Trend</h3>
      <div className="card-body flex-1 min-h-0">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={chartData}>
            <defs>
              <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.1}/>
                <stop offset="95%" stopColor="#3B82F6" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8'}} />
            <Tooltip
              contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
            />
            <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fillOpacity={1} fill="url(#colorRev)" />
            <Area type="monotone" dataKey="rtoRate" stroke="#EF4444" fill="none" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default RevenueChartWidget;
