import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import L1DashboardView from './dashboards/L1DashboardView';
import L2DashboardView from './dashboards/L2DashboardView';
import L4DashboardView from './dashboards/L4DashboardView';
import RevenueWidget from '../components/dashboard/RevenueWidget';
import OrdersWidget from '../components/dashboard/OrdersWidget';
import RtoWidget from '../components/dashboard/RtoWidget';
import RoiWidget from '../components/dashboard/RoiWidget';
import RevenueChartWidget from '../components/dashboard/RevenueChartWidget';
import { RefreshCw, Calendar, Layout } from 'lucide-react';
import { cache } from '../hooks/useWidgetData';

const L3DashboardView = () => {
  const [dateRange, setDateRange] = useState('30d');
  const [refreshKey, setRefreshKey] = useState(0);

  // This state will eventually be user-configurable
  const [widgets, setWidgets] = useState([
    { id: 'revenue', component: RevenueWidget, gridSpan: 1 },
    { id: 'orders', component: OrdersWidget, gridSpan: 1 },
    { id: 'rto', component: RtoWidget, gridSpan: 1 },
    { id: 'roi', component: RoiWidget, gridSpan: 1 },
    { id: 'revenueChart', component: RevenueChartWidget, gridSpan: 4 },
  ]);

  const handleRefresh = () => {
    cache.delete(dateRange);
    setRefreshKey(prevKey => prevKey + 1);
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
          <button className="p-2 bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300 rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors">
            <Layout size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgets.map(widget => {
          const WidgetComponent = widget.component;
          const style = { gridColumn: `span ${widget.gridSpan}` };
          return (
            <div key={`${widget.id}-${refreshKey}`} style={style}>
              <WidgetComponent dateRange={dateRange} />
            </div>
          );
        })}
      </div>
    </div>
  );
};


const Dashboard = () => {
  const { user } = useAuth();

  switch (user.role) {
    case 'L1':
      return <L1DashboardView />;
    case 'L2':
      return <L2DashboardView />;
    case 'L3':
      return <L3DashboardView />;
    case 'L4':
      return <L4DashboardView />;
    default:
      return <div>No dashboard available for your role.</div>;
  }
};

export default Dashboard;
