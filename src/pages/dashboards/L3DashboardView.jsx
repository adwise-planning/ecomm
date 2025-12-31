import React, { useState } from 'react';
import RevenueWidget from '../../components/dashboard/RevenueWidget';
import OrdersWidget from '../../components/dashboard/OrdersWidget';
import RtoWidget from '../../components/dashboard/RtoWidget';
import RoiWidget from '../../components/dashboard/RoiWidget';
import RtoTrendChart from '../../components/dashboard/charts/RtoTrendChart';
import ShippingCostChart from '../../components/dashboard/charts/ShippingCostChart';
import MetaAdsChart from '../../components/dashboard/charts/MetaAdsChart';
import RtoAnalysisChart from '../../components/dashboard/RtoAnalysisChart';
import ShippingCostPerOrderChart from '../../components/dashboard/ShippingCostPerOrderChart';
import { RefreshCw, Calendar } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';

const L3DashboardView = () => {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState('30d');

  const handleRefresh = () => {
    queryClient.invalidateQueries(); // Invalidate all queries to refresh all data
  };

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
          <button onClick={handleRefresh} className="p-2 bg-primary text-white rounded-lg hover:bg-blue-600 transition-colors">
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <RevenueWidget dateRange={dateRange} />
        <OrdersWidget dateRange={dateRange} />
        <RtoWidget dateRange={dateRange} />
        <RoiWidget dateRange={dateRange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <RtoTrendChart dateRange={dateRange} />
        <ShippingCostChart dateRange={dateRange} />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <MetaAdsChart dateRange={dateRange} />
        <RtoAnalysisChart />
      </div>
      <div className="grid grid-cols-1">
        <ShippingCostPerOrderChart dateRange={dateRange} />
      </div>
    </div>
  );
};

export default L3DashboardView;
