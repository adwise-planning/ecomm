import React from 'react';
import { useQueryData } from '../../../hooks/useQueryData';
import { api } from '../../../services/api';
import { useAuth } from '../../../context/AuthContext';
import { Skeleton } from '../../ui/Skeleton';
import WidgetError from '../WidgetError';

const ImpersonationWidget = () => {
  const { startImpersonation } = useAuth();
  const { data: usersData, isLoading, isError, error } = useQueryData(
    ['usersForImpersonation'],
    api.getUsers
  );

  const handleImpersonation = (event) => {
    const selectedUserId = event.target.value;
    if (selectedUserId && usersData?.users) {
      const userToImpersonate = usersData.users.find(u => u.id.toString() === selectedUserId);
      if (userToImpersonate) {
        startImpersonation(userToImpersonate);
      }
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Skeleton className="h-10 w-full" />;
    }

    if (isError) {
      return <WidgetError message={error.message} small />;
    }

    if (!usersData || usersData.users.length === 0) {
      return <p className="text-sm text-slate-500 dark:text-slate-400">No users available to impersonate.</p>;
    }

    return (
      <select
        onChange={handleImpersonation}
        className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
        defaultValue=""
      >
        <option value="" disabled>Select User...</option>
        {usersData.users.map(user => (
          <option key={user.id} value={user.id}>
            {user.name} ({user.role})
          </option>
        ))}
      </select>
    );
  };

  return (
    <div className="card h-full">
      <h3 className="font-bold text-slate-800 dark:text-white">Impersonate User</h3>
      <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 mb-4">Select a user to view their dashboard.</p>
      {renderContent()}
    </div>
  );
};

export default ImpersonationWidget;
