import React from 'react';
import ActiveUsersWidget from '../../components/dashboard/l1/ActiveUsersWidget';
import CombinedRevenueWidget from '../../components/dashboard/l1/CombinedRevenueWidget';
import ImpersonationWidget from '../../components/dashboard/l1/ImpersonationWidget';

const L1DashboardView = () => {
  return (
    <div className="p-4 sm:p-6 lg:p-8 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Super Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Global overview and system controls</p>
      </div>

      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <ActiveUsersWidget />
        <CombinedRevenueWidget />
        <ImpersonationWidget />
      </div>
    </div>
  );
};

export default L1DashboardView;
