import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { formatCurrency } from '../lib/utils';
import { Download } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

const Billing = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getInvoices().then(data => {
      setInvoices(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Billing & Invoices</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage your subscription and payments</p>
      </div>

      <div className="card dark:bg-slate-800 dark:border-slate-700">
        <h3 className="font-bold text-slate-800 dark:text-white mb-4">Invoice History</h3>
        {loading ? <Skeleton className="h-32" /> : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 dark:bg-slate-900 text-slate-500 dark:text-slate-400 uppercase text-xs">
                <tr>
                  <th className="px-6 py-3">Invoice ID</th>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Plan</th>
                  <th className="px-6 py-3">Amount</th>
                  <th className="px-6 py-3">Status</th>
                  <th className="px-6 py-3 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="bg-white dark:bg-slate-800">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white">{inv.id}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{inv.date}</td>
                    <td className="px-6 py-4 text-slate-600 dark:text-slate-300">{inv.plan}</td>
                    <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">{formatCurrency(inv.amount)}</td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 rounded-full text-xs font-bold bg-green-100 text-green-700">
                        {inv.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="text-primary hover:text-blue-700 dark:hover:text-blue-400">
                        <Download size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Billing;