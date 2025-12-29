import React from 'react';
import StatCard from '../StatCard';
import { Skeleton } from '../ui/Skeleton';
import useWidgetData from '../../hooks/useWidgetData';
import WidgetError from './WidgetError';

const OrdersWidget = ({ dateRange }) => {
  const { data: metrics, loading, error } = useWidgetData(dateRange, 'orders');

  if (error) {
    return <WidgetError message={error.message} />;
  }

  if (loading || !metrics) {
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
