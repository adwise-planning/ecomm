import React from 'react';
import StatCard from '../StatCard';
import { Skeleton } from '../ui/Skeleton';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import WidgetError from './WidgetError';

const OrdersWidget = ({ dateRange }) => {
  const { data: metrics, isLoading, isError, error } = useDashboardMetrics(dateRange, 'orders');

  if (isError) {
    return <WidgetError message={error.message} />;
  }

  if (isLoading || !metrics) {
    return <div className="card h-32"><Skeleton className="h-full w-full" /></div>;
  }

  return (
    <StatCard
      title="Total Orders"
      value={metrics?.value}
      growth={metrics?.growth}
    />
  );
};

export default OrdersWidget;
