import React, { useEffect, useState, useCallback } from 'react';
import DataTable from '../components/ui/DataTable';
import OrdersToolbar from '../components/OrdersToolbar'; // Import the new toolbar
import { api } from '../services/api';
import { formatCurrency } from '../lib/utils';
import { useDebounce } from '../hooks/useDebounce'; // A custom hook for debouncing search input

const OrdersTable = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [sort, setSort] = useState({ key: 'date', dir: 'desc' });
  const [filters, setFilters] = useState({ status: '', paymentMode: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const debouncedSearchTerm = useDebounce(searchTerm, 300); // Debounce search term

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.getOrders(page, 10, sort, filters, debouncedSearchTerm);
      setData(res.data);
      setTotalPages(res.totalPages);
    } catch (error) {
      // In a real app, show a toast notification for the error
      console.error("Failed to fetch orders:", error);
    } finally {
      setLoading(false);
    }
  }, [page, sort, filters, debouncedSearchTerm]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleSort = (key) => {
    setSort(prev => ({ key, dir: prev.key === key && prev.dir === 'asc' ? 'desc' : 'asc' }));
  };

  const handleFilterChange = (filterName, value) => {
    setFilters(prev => ({ ...prev, [filterName]: value }));
    setPage(1); // Reset to first page on filter change
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setPage(1); // Reset to first page on search
  };


  const columns = [
    { key: 'id', label: 'Order ID' },
    { key: 'date', label: 'Date' },
    { key: 'customer', label: 'Customer' },
    { key: 'amount', label: 'Amount', render: (row) => formatCurrency(row.amount) },
    { key: 'paymentMode', label: 'Payment', render: (row) => (
      <span className={`px-2 py-1 rounded text-xs font-bold ${row.paymentMode === 'Prepaid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
        {row.paymentMode}
      </span>
    )},
    { key: 'status', label: 'Status', render: (row) => {
      const colors = {
        'Delivered': 'bg-green-100 text-green-700',
        'RTO': 'bg-red-100 text-red-700',
        'In Transit': 'bg-blue-100 text-blue-700',
        'Pending': 'bg-gray-100 text-gray-700',
        'Lost': 'bg-orange-100 text-orange-700'
      };
      return (
        <span className={`px-2 py-1 rounded text-xs font-bold ${colors[row.status] || 'bg-gray-100'}`}>
          {row.status}
        </span>
      );
    }},
    { key: 'region', label: 'Region' },
    { key: 'rtoRisk', label: 'Risk Score', render: (row) => (
      <span className={`px-2 py-1 rounded text-xs font-bold ${row.rtoRisk === 'High' ? 'text-red-600 border border-red-200' : 'text-green-600 border border-green-200'}`}>
        {row.rtoRisk}
      </span>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Order Management</h1>
        <p className="text-slate-500 dark:text-slate-400">Merged view of all your shipments</p>
      </div>

      <OrdersToolbar onFilterChange={handleFilterChange} onSearch={handleSearch} />

      <DataTable 
        title="All Orders"
        columns={columns}
        data={data}
        isLoading={loading}
        pagination={{ current: page, total: totalPages }}
        onPageChange={setPage}
        onSort={handleSort}
      />
    </div>
  );
};

export default OrdersTable;
