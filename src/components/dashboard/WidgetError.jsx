import React from 'react';
import { AlertTriangle } from 'lucide-react';

const WidgetError = ({ message }) => {
  return (
    <div className="card h-32 flex flex-col items-center justify-center text-center bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800">
      <AlertTriangle className="text-red-500 mb-2" size={24} />
      <p className="text-sm font-medium text-red-700 dark:text-red-400">Could not load data</p>
      <p className="text-xs text-red-500 dark:text-red-500">{message}</p>
    </div>
  );
};

export default WidgetError;
