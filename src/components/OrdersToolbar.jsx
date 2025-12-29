import React from 'react';
import { Search, Filter, Save, MoreVertical } from 'lucide-react';

const OrdersToolbar = ({ onFilterChange, onSearch, onSaveView, savedViews, onSelectView }) => {
  return (
    <div className="flex flex-col md:flex-row items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border dark:border-slate-700">
      <div className="flex items-center gap-4 w-full md:w-auto">
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by Order ID or Customer..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Filter size={18} className="text-slate-500 hidden md:block" />
        <select
          onChange={(e) => onFilterChange('status', e.target.value)}
          className="px-4 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
        >
          <option value="">All Statuses</option>
          <option value="Delivered">Delivered</option>
          <option value="Shipped">Shipped</option>
          <option value="Processing">Processing</option>
          <option value="Returned">Returned</option>
          <option value="Cancelled">Cancelled</option>
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
      <div className="flex items-center gap-2">
        <button
          onClick={onSaveView}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          <Save size={16} />
          <span>Save View</span>
        </button>
        <div className="relative">
          <select
            onChange={(e) => onSelectView(e.target.value)}
            className="pl-4 pr-8 py-2 border rounded-lg appearance-none dark:bg-slate-700 dark:border-slate-600 dark:text-white focus:ring-2 focus:ring-primary outline-none"
          >
            <option value="">Saved Views</option>
            {savedViews && savedViews.map(view => (
              <option key={view.id} value={view.id}>{view.name}</option>
            ))}
          </select>
          <MoreVertical className="absolute right-2 top-2.5 text-slate-400" size={18} />
        </div>
      </div>
    </div>
  );
};

export default OrdersToolbar;
