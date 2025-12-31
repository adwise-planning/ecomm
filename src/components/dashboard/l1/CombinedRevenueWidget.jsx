import React from 'react';
import StatCard from '../../StatCard';
import { Skeleton } from '../../ui/Skeleton';
import { useDashboardMetrics } from '../../../hooks/useDashboardMetrics';
import WidgetError from '../WidgetError';

const CombinedRevenueWidget = ({ dateRange }) => {
  const { data: metrics, isLoading, isError, error } = useDashboardMetrics(dateRange, 'combinedRevenue');

  if (isError) {
    return <WidgetError message={error.message} />;
  }

  if (isLoading || !metrics) {
    return <div className="card h-32"><Skeleton className="h-full w-full" /></div>;
  }

  return (
    <StatCard
      title="Combined Revenue"
      value={metrics?.value}
      growth={metrics?.growth}
      prefix="₹"
    />
  );
};

export default CombinedRevenueWidget;
