import React from 'react';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

const StatCard = ({ title, value, growth, prefix = '', suffix = '', inverse = false }) => {
  const isPositive = growth >= 0;
  // If inverse is true (like RTO), negative growth is actually good (Green)
  const isGood = inverse ? !isPositive : isPositive;
  
  return (
    <div className="card hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start mb-2">
        <span className="text-slate-500 dark:text-slate-400 text-sm font-medium">{title}</span>
        <Info size={16} className="text-slate-300 dark:text-slate-600 cursor-help" />
      </div>
      <div className="flex items-baseline gap-2">
        <h3 className="text-2xl font-bold text-slate-800 dark:text-white">
          {prefix}{typeof value === 'number' ? value.toLocaleString() : value}{suffix}
        </h3>
        {growth !== undefined && (
          <span className={`flex items-center text-xs font-medium px-2 py-0.5 rounded-full ${
            isGood 
              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
              : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
          }`}>
            {isPositive ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
            {Math.abs(growth)}%
          </span>
        )}
      </div>
    </div>
  );
};

export default StatCard;