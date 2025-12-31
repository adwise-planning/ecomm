import React from 'react';
import StatCard from '../../StatCard';
import { Skeleton } from '../../ui/Skeleton';
import { useDashboardMetrics } from '../../../hooks/useDashboardMetrics';
import WidgetError from '../WidgetError';

const ActiveUsersWidget = ({ dateRange }) => {
  const { data: metrics, isLoading, isError, error } = useDashboardMetrics(dateRange, 'activeUsers');

  if (isError) {
    return <WidgetError message={error.message} />;
  }

  if (isLoading || !metrics) {
    return <div className="card h-32"><Skeleton className="h-full w-full" /></div>;
  }

  return (
    <StatCard
      title="Active Users"
      value={metrics?.value}
      growth={metrics?.growth}
    />
  );
};

export default ActiveUsersWidget;
