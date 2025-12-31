import React, { useState } from 'react';
import { RefreshCw, Calendar } from 'lucide-react';
import { useQueryClient } from '@tanstack/react-query';
import ActiveUsersWidget from '../../components/dashboard/l1/ActiveUsersWidget';
import CombinedRevenueWidget from '../../components/dashboard/l1/CombinedRevenueWidget';
import ImpersonationWidget from '../../components/dashboard/l1/ImpersonationWidget';
import L2UsersWidget from '../../components/dashboard/l1/L2UsersWidget';
import L3UsersWidget from '../../components/dashboard/l1/L3UsersWidget';
import L4UsersWidget from '../../components/dashboard/l1/L4UsersWidget';

const L1DashboardView = () => {
  const queryClient = useQueryClient();
  const [dateRange, setDateRange] = useState('30d');

  const handleRefresh = () => {
    queryClient.invalidateQueries(['dashboardMetrics', dateRange, 'L1']);
  };

  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Super Admin Dashboard</h1>
          <p className="text-slate-500 dark:text-slate-400">Global overview and system controls</p>
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

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-5">
        <CombinedRevenueWidget dateRange={dateRange} />
        <ActiveUsersWidget dateRange={dateRange} />
        <L2UsersWidget dateRange={dateRange} />
        <L3UsersWidget dateRange={dateRange} />
        <L4UsersWidget dateRange={dateRange} />
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {/* Main chart will go here */}
        </div>
        <div>
          <ImpersonationWidget />
        </div>
      </div>
    </div>
  );
};

export default L1DashboardView;
