import React, { useEffect, useState, useCallback } from 'react';
import { api } from '../services/api';
import StatCard from '../components/StatCard';
import { Skeleton } from '../components/ui/Skeleton';
import { formatCurrency } from '../lib/utils';
import { RefreshCw, Calendar } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const Dashboard = () => {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('30d');

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getDashboardMetrics(dateRange);
      setMetrics(data);
    } finally {
      setLoading(false);
    }
  }, [dateRange]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Overview of your logistics performance</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <Calendar className="absolute left-3 top-2.5 text-slate-400" size={16} />
            <select 
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="pl-9 pr-4 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:ring-2 focus:ring-primary dark:text-white outline-none"
            >
              <option value="7d">Last 7 Days</option>
              <option value="30d">Last 30 Days</option>
              <option value="90d">Last Quarter</option>
            </select>
          </div>
          <button onClick={fetchData} className="p-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {loading ? (
          [...Array(4)].map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          <>
            <StatCard title="Total Revenue" value={metrics.revenue.value} growth={metrics.revenue.growth} prefix="₹" />
            <StatCard title="Total Orders" value={metrics.orders.value} growth={metrics.orders.growth} />
            <StatCard title="RTO Rate" value={metrics.rtoRate.value} growth={metrics.rtoRate.growth} suffix="%" inverse />
            
            <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-blue-100 dark:border-slate-700">
              <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Est. ROI Generated</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(metrics.roi.value)}</div>
              <div className="text-xs text-slate-500 mt-2">Money saved via RTO reduction</div>
            </div>
          </>
        )}
      </div>

      <div className="card h-[400px] dark:bg-slate-800 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-6">Revenue vs RTO Trend</h3>
        <div className="card-body flex-1 min-h-0">
          {loading ? <Skeleton className="h-full w-full" /> : (
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={metrics.chartData}>
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
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;