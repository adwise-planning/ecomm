import React, { useState, useMemo } from 'react';
import { useQueryData } from '../../hooks/useQueryData';
import { api } from '../../services/api';
import { Skeleton } from '../../components/ui/Skeleton';
import WidgetError from '../../components/dashboard/WidgetError';
import { useDebounce } from '../../hooks/useDebounce';

const L1TeamView = () => {
  const { data, isLoading, isError, error, refetch } = useQueryData(['allUsers'], api.getAllUsers);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const filteredUsers = useMemo(() => {
    if (!data?.users) return [];
    return data.users.filter(user =>
      user.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      user.company.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [data, debouncedSearchTerm]);

  const renderTable = () => {
    if (isLoading) return <Skeleton className="h-96" />;
    if (isError) return <WidgetError message={error.message} onRetry={refetch} />;

    const users = filteredUsers || [];

    if (users.length === 0) {
      return <div className="text-center py-10">No users found.</div>;
    }

    return (
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase text-xs">
          <tr>
            <th className="px-6 py-3">User</th>
            <th className="px-6 py-3">Company</th>
            <th className="px-6 py-3">Role</th>
            <th className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
          {users.map((user) => (
            <tr key={user.id} className="bg-white dark:bg-slate-800">
              <td className="px-6 py-4">
                <div className="font-medium text-slate-900 dark:text-white">{user.name}</div>
                <div className="text-slate-500 text-xs">{user.email}</div>
              </td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{user.company}</td>
              <td className="px-6 py-4 text-slate-600 dark:text-slate-300">
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.role === 'L1' ? 'bg-red-100 text-red-800' :
                  user.role === 'L2' ? 'bg-orange-100 text-orange-800' :
                  user.role === 'L3' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-green-100 text-green-800'
                }`}>
                  {user.role}
                </span>
              </td>
              <td className="px-6 py-4 text-right">
                {/* Actions like edit, delete, or impersonate could go here */}
                <button className="text-primary hover:underline">View</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Global User Management</h1>
        <p className="text-slate-500 dark:text-slate-400">View and manage all users across all companies.</p>
      </div>

      <div className="card dark:bg-slate-800 dark:border-slate-700">
        <input
          type="text"
          placeholder="Search by name, email, or company..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 rounded border bg-white dark:bg-slate-700"
        />
      </div>

      <div className="card dark:bg-slate-800 dark:border-slate-700 overflow-hidden p-0">
        {renderTable()}
      </div>
    </div>
  );
};

export default L1TeamView;
