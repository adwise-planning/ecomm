import React, { useState } from 'react';
import { useQueryData } from '../hooks/useQueryData';
import { Skeleton } from '../components/ui/Skeleton';
import WidgetError from '../components/dashboard/WidgetError';
import ChangePlanModal from '../components/billing/ChangePlanModal';
import { useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';

const Billing = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQueryData(['subscription'], api.getSubscription);
  const { data: invoicesData } = useQueryData(['invoices'], api.getInvoices);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handlePlanChangeSuccess = (newSubscriptionData) => {
    queryClient.setQueryData(['subscription'], { subscription: newSubscriptionData });
    queryClient.invalidateQueries(['subscription']);
  };

  const renderSubscription = () => {
    if (isLoading) return <Skeleton className="h-48" />;
    if (isError) return <WidgetError message={error.message} onRetry={refetch} />;

    const { plan, price, next_invoice } = data?.subscription || {};

    return (
      <div className="card">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">Current Plan</h3>
        <div className="flex justify-between items-center">
          <div>
            <p className="text-2xl font-bold text-slate-900 dark:text-white">{plan} Plan</p>
            <p className="text-primary font-bold text-xl">${price}/month</p>
          </div>
          <button onClick={() => setIsModalOpen(true)} className="bg-primary text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium transition-colors">
            Change Plan
          </button>
        </div>
        <p className="text-sm text-slate-500 mt-4">Your next invoice is on {next_invoice}.</p>
      </div>
    );
  };

  const invoices = invoicesData?.invoices || [];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your subscription and view invoices.</p>
      </div>

      {renderSubscription()}

      <div className="card dark:bg-slate-800 dark:border-slate-700 overflow-hidden p-0">
        <h3 className="font-bold text-slate-800 dark:text-white p-6">Invoice History</h3>
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase text-xs">
            <tr>
              <th className="px-6 py-3">Invoice ID</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Amount</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
            {invoices.map(invoice => (
              <tr key={invoice.id} className="bg-white dark:bg-slate-800">
                <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{invoice.id}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{invoice.date}</td>
                <td className="px-6 py-4 text-slate-600 dark:text-slate-300">${invoice.amount}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                    invoice.status === 'paid' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                  }`}>
                    {invoice.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <ChangePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        currentPlan={data?.subscription?.plan}
        onSuccess={handlePlanChangeSuccess}
      />
    </div>
  );
};

export default Billing;
