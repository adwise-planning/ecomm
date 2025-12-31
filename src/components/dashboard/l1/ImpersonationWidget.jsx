import React from 'react';

const ImpersonationWidget = () => {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md dark:bg-slate-800">
      <h3 className="text-lg font-medium text-gray-900 dark:text-white">Impersonate User</h3>
      <p className="mt-2 text-gray-600 dark:text-gray-400">Select a user to view their dashboard.</p>
       <div className="mt-4">
        <select className="w-full px-3 py-2 mt-1 border rounded-md shadow-sm dark:bg-slate-700 dark:border-slate-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          <option>Select User...</option>
          <option>user-l2@example.com</option>
          <option>user-l3@example.com</option>
        </select>
      </div>
    </div>
  );
};

export default ImpersonationWidget;
