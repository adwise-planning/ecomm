import React from 'react';
import { formatCurrency } from '../../lib/utils';
import { Skeleton } from '../ui/Skeleton';
import { useDashboardMetrics } from '../../hooks/useDashboardMetrics';
import WidgetError from './WidgetError';

const RoiWidget = ({ dateRange }) => {
  const { data: metrics, isLoading, isError, error } = useDashboardMetrics(dateRange, 'roi');

  if (isError) {
    return <WidgetError message={error.message} />;
  }

  if (isLoading || !metrics) {
    return <div className="card h-32"><Skeleton className="h-full w-full" /></div>;
  }

  // Per requirements, only show the widget if ROI is positive
  if (metrics.value <= 0) {
    return null;
  }

  return (
    <div className="card bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-slate-800 dark:to-slate-900 border-blue-100 dark:border-slate-700">
      <div className="text-sm font-medium text-blue-600 dark:text-blue-400 mb-1">Est. ROI Generated</div>
      <div className="text-2xl font-bold text-slate-900 dark:text-white">{formatCurrency(metrics?.value)}</div>
      <div className="text-xs text-slate-500 mt-2">Money saved via RTO reduction</div>
    </div>
  );
};

export default RoiWidget;
