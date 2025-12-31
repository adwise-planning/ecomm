import React from 'react';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useQueryData } from '../../../hooks/useQueryData';
import { api } from '../../../services/api';
import { Skeleton } from '../../ui/Skeleton';
import WidgetError from '../WidgetError';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const RtoByRegionChart = () => {
  const { data, isLoading, isError, error } = useQueryData(
    ['rtoByRegion'],
    api.getRtoByRegion
  );

  if (isLoading) {
    return <div className="card h-[300px]"><Skeleton className="h-full w-full" /></div>;
  }

  if (isError) {
    return <div className="card h-[300px]"><WidgetError message={error.message} /></div>;
  }

  if (!data || data.byRegion.length === 0) {
    return <div className="card h-[300px] flex items-center justify-center"><p>No regional RTO data available.</p></div>;
  }

  return (
    <div className="card h-[300px]">
      <h3 className="font-bold text-slate-800 dark:text-white mb-4">RTO by Region</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data.byRegion}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.byRegion.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip contentStyle={{ borderRadius: '8px', border: 'none' }} />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default RtoByRegionChart;
