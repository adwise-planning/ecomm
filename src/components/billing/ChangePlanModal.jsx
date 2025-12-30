import React, { useState } from 'react';
import { X } from 'lucide-react';
import { api } from '../../services/api.js';
import toast from 'react-hot-toast';

const plans = [
  { name: 'Basic', price: '$49/mo', features: ['Basic analytics', 'Up to 1000 orders', 'Email support'] },
  { name: 'Pro', price: '$99/mo', features: ['Advanced analytics', 'Up to 5000 orders', 'Priority support', 'AI insights'] },
  { name: 'Enterprise', price: '$249/mo', features: ['Full feature set', 'Unlimited orders', 'Dedicated support', 'Custom integrations'] },
];

const ChangePlanModal = ({ isOpen, onClose, currentPlan, onSuccess }) => {
  const [selectedPlan, setSelectedPlan] = useState(currentPlan);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const data = await api.updateSubscription({ plan: selectedPlan });
      onSuccess(data.subscription);
      toast.success(`Plan successfully changed to ${selectedPlan}!`);
      onClose();
    } catch (err) {
      toast.error(`Failed to change plan: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-2xl w-full">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Change Subscription Plan</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {plans.map(plan => (
              <div
                key={plan.name}
                onClick={() => setSelectedPlan(plan.name)}
                className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                  selectedPlan === plan.name ? 'border-primary bg-blue-50 dark:bg-blue-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500'
                }`}
              >
                <h3 className="font-bold text-lg text-slate-800 dark:text-white">{plan.name}</h3>
                <p className="font-bold text-xl text-primary my-2">{plan.price}</p>
                <ul className="text-xs text-slate-500 dark:text-slate-400 space-y-1">
                  {plan.features.map(f => <li key={f}>- {f}</li>)}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-700 flex justify-end gap-4 rounded-b-lg">
          <button onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-medium">
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || selectedPlan === currentPlan}
            className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Confirm Change'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChangePlanModal;
