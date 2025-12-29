import React from 'react';

const mockPaymentHistory = [
  { id: '1', date: '2023-10-01', amount: '₹5,000', status: 'Paid', invoice: 'INV-1001' },
  { id: '2', date: '2023-09-01', amount: '₹5,000', status: 'Paid', invoice: 'INV-0901' },
  { id: '3', date: '2023-08-01', amount: '₹5,000', status: 'Paid', invoice: 'INV-0801' },
];

const L3BillingView = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Billing</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1 bg-white shadow rounded-lg p-6">
          <h2 className="text-lg font-semibold mb-4">Current Plan</h2>
          <p className="text-3xl font-bold text-primary mb-2">Pro Tier</p>
          <p className="text-gray-600 mb-4">₹5,000 / month</p>
          <button className="w-full bg-gray-200 text-gray-800 py-2 rounded-lg">Change Plan</button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="p-4 border-b">
          <h2 className="text-lg font-semibold">Payment History</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {mockPaymentHistory.map((payment) => (
                <tr key={payment.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.date}</td>
                  <td className="px-6 py-4 whitespace-nowrap">{payment.amount}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                      {payment.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <a href="#" className="text-primary hover:underline">{payment.invoice}</a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default L3BillingView;
