import React from 'react';
import StatCard from '../../StatCard';
import { Skeleton } from '../../ui/Skeleton';
import { useDashboardMetrics } from '../../../hooks/useDashboardMetrics';
import WidgetError from '../WidgetError';

const L2UsersWidget = ({ dateRange }) => {
  const { data: metrics, isLoading, isError, error } = useDashboardMetrics(dateRange, 'l2Users');

  if (isError) {
    return <WidgetError message={error.message} />;
  }

  if (isLoading || !metrics) {
    return <div className="card h-32"><Skeleton className="h-full w-full" /></div>;
  }

  return (
    <StatCard
      title="L2 Users"
      value={metrics?.value}
    />
  );
};

export default L2UsersWidget;
