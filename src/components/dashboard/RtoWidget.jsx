import React from 'react';
import StatCard from '../StatCard';
import { Skeleton } from '../ui/Skeleton';

const RtoWidget = ({ metrics, loading }) => {
  if (loading) {
    return <Skeleton className="h-32" />;
  }

  return (
    <StatCard
      title="RTO Rate"
      value={metrics.rtoRate.value}
      growth={metrics.rtoRate.growth}
      suffix="%"
      inverse
    />
  );
};

export default RtoWidget;
