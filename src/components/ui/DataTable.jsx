import React from 'react';
import { ChevronLeft, ChevronRight, ArrowUpDown, Download } from 'lucide-react';
import { exportToCSV } from '../../lib/utils';

const DataTable = ({ columns, data, pagination, onPageChange, onSort, isLoading, title }) => {
  
  const handleExport = () => {
    exportToCSV(data, `${title.replace(/\s+/g, '_')}_Export`);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center">
        <h3 className="font-bold text-slate-800 dark:text-white">{title}</h3>
        <button 
          onClick={handleExport}
          disabled={isLoading || data.length === 0}
          className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-600 transition-colors disabled:opacity-50"
        >
          <Download size={16} /> Export CSV
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-900">
            <tr>
              {columns.map((col) => (
                <th 
                  key={col.key} 
                  className="px-6 py-3 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800"
                  onClick={() => onSort && onSort(col.key)}
                >
                  <div className="flex items-center gap-1">
                    {col.label}
                    {onSort && <ArrowUpDown size={12} />}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {isLoading ? (
              [...Array(5)].map((_, i) => (
                <tr key={i}>
                  {columns.map((col, j) => (
                    <td key={j} className="px-6 py-4"><div className="h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div></td>
                  ))}
                </tr>
              ))
            ) : data.length === 0 ? (
              <tr>
                <td colSpan={columns.length} className="px-6 py-8 text-center text-slate-500">No data found</td>
              </tr>
            ) : (
              data.map((row, i) => (
                <tr key={i} className="bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors">
                  {columns.map((col) => (
                    <td key={col.key} className="px-6 py-4 text-slate-700 dark:text-slate-300">
                      {col.render ? col.render(row) : row[col.key]}
                    </td>
                  ))}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {pagination && (
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900 border-t border-slate-200 dark:border-slate-700">
          <span className="text-sm text-slate-500 dark:text-slate-400">
            Page {pagination.current} of {pagination.total}
          </span>
          <div className="flex gap-2">
            <button
              disabled={pagination.current === 1}
              onClick={() => onPageChange(pagination.current - 1)}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 dark:text-white"
            >
              <ChevronLeft size={20} />
            </button>
            <button
              disabled={pagination.current === pagination.total}
              onClick={() => onPageChange(pagination.current + 1)}
              className="p-1 rounded hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-50 dark:text-white"
            >
              <ChevronRight size={20} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DataTable;