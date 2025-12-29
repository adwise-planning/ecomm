import React from 'react';
import StatCard from '../ui/StatCard';
import { Skeleton } from '../ui/Skeleton';

const RevenueWidget = ({ metrics, loading }) => {
  if (loading) {
    return <Skeleton className="h-32" />;
  }

  return (
    <StatCard
      title="Total Revenue"
      value={metrics.revenue.value}
      growth={metrics.revenue.growth}
      prefix="₹"
    />
  );
};

export default RevenueWidget;
