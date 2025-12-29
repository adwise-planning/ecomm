import React from 'react';
import { Search, Filter } from 'lucide-react';

const OrdersToolbar = ({ onFilterChange, onSearch }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700">
      <div className="relative w-full md:w-1/3">
        <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
        <input
          type="text"
          placeholder="Search by Order ID or Customer..."
          className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
          onChange={(e) => onSearch(e.target.value)}
        />
      </div>
      <div className="flex items-center gap-4 w-full md:w-auto">
        <Filter size={18} className="text-slate-500" />
        <select
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Delivered">Delivered</option>
          <option value="In Transit">In Transit</option>
          <option value="RTO">RTO</option>
          <option value="Pending">Pending</option>
        </select>
        <select
          onChange={(e) => onFilterChange('paymentMode', e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="">All Payment Modes</option>
          <option value="Prepaid">Prepaid</option>
          <option value="COD">COD</option>
        </select>
      </div>
    </div>
  );
};

export default OrdersToolbar;
