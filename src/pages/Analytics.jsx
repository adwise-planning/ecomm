import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Skeleton } from '../components/ui/Skeleton';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const Analytics = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRtoAnalytics().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  const COLORS = ['#3B82F6', '#EF4444', '#10B981', '#F59E0B'];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">RTO Analytics</h1>
        <p className="text-slate-500 dark:text-slate-400">Deep dive into return reasons and regions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Region Heatmap Visualization (Grid based) */}
        <div className="card h-[400px]">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Regional Risk Heatmap</h3>
          <div className="card-body flex-1 min-h-0">
            {loading ? <Skeleton className="h-full" /> : (
              <div className="grid grid-cols-2 gap-4 h-full pb-4">
                {data.byRegion.map((region) => (
                  <div 
                    key={region.name} 
                    className={`rounded-lg p-4 flex flex-col justify-between border-l-4 ${
                      region.risk === 'Critical' ? 'bg-red-50 border-red-500 dark:bg-red-900/20' :
                      region.risk === 'High' ? 'bg-orange-50 border-orange-500 dark:bg-orange-900/20' :
                      region.risk === 'Moderate' ? 'bg-yellow-50 border-yellow-500 dark:bg-yellow-900/20' :
                      'bg-green-50 border-green-500 dark:bg-green-900/20'
                    }`}
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white">{region.name}</h4>
                      <span className="text-xs uppercase font-bold opacity-70">{region.risk} Risk</span>
                    </div>
                    <div className="text-2xl font-bold">{region.value}% <span className="text-sm font-normal">RTO</span></div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Reasons Pie Chart */}
        <div className="card h-[400px]">
          <h3 className="font-bold text-slate-800 dark:text-white mb-4">Top RTO Reasons</h3>
          <div className="card-body flex-1 min-h-0">
            {loading ? <Skeleton className="h-full" /> : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                <Pie
                  data={data.reasons}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  fill="#8884d8"
                  paddingAngle={5}
                  dataKey="value"
                >
                  {data.reasons.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;