import React from 'react';
import StatCard from '../StatCard';
import { Skeleton } from '../ui/Skeleton';
import useWidgetData from '../../hooks/useWidgetData';
import WidgetError from './WidgetError';

const RevenueWidget = ({ dateRange }) => {
  const { data: metrics, loading, error } = useWidgetData(dateRange, 'revenue');

  if (error) {
    return <WidgetError message={error.message} />;
  }

  if (loading || !metrics) {
    return <div className="card h-32"><Skeleton className="h-full w-full" /></div>;
  }

  return (
    <StatCard
      title="Total Revenue"
      value={metrics?.value}
      growth={metrics?.growth}
      prefix="₹"
    />
  );
};

export default RevenueWidget;
