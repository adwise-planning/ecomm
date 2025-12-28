import React from 'react';
import StatCard from '../../components/StatCard';

const L1DashboardView = () => {
  const stats = {
    activeUsers: { value: '1,250', growth: '+15%' },
    combinedRevenue: { value: '₹1.2Cr', growth: '+8.2%' },
    l2Users: { value: '15' },
    l3Users: { value: '250' },
    l4Users: { value: '1,000' },
  };

  return (
    <div className="space-y-6">
       <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Super Admin Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Full access to all system data and user accounts.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard title="Active Users" value={stats.activeUsers.value} growth={stats.activeUsers.growth} />
        <StatCard title="Combined Revenue" value={stats.combinedRevenue.value} growth={stats.combinedRevenue.growth} prefix="₹" />
        <StatCard title="L2 Users" value={stats.l2Users.value} />
        <StatCard title="L3 Users" value={stats.l3Users.value} />
      </div>
    </div>
  );
};

export default L1DashboardView;
