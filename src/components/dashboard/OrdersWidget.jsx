import React from 'react';
import StatCard from '../ui/StatCard';
import { Skeleton } from '../ui/Skeleton';

const OrdersWidget = ({ metrics, loading }) => {
  if (loading) {
    return <Skeleton className="h-32" />;
  }

  return (
    <StatCard
      title="Total Orders"
      value={metrics.orders.value}
      growth={metrics.orders.growth}
    />
  );
};

export default OrdersWidget;
