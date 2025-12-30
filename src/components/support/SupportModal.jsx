import React from 'react';
import { useForm } from 'react-hook-form';
import { X } from 'lucide-react';
import { api } from '/src/services/api';
import toast from 'react-hot-toast';

const SupportModal = ({ isOpen, onClose }) => {
  const { register, handleSubmit, reset, formState: { isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await api.submitSupportRequest(data);
      toast.success(response.message);
      reset();
      onClose();
    } catch (error) {
      toast.error(`Failed to send request: ${error.message}`);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl max-w-lg w-full">
        <div className="p-6 border-b dark:border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Contact Support</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-700">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="p-6 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Subject</label>
              <input
                {...register('subject', { required: true })}
                className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                placeholder="e.g., Issue with billing"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Message</label>
              <textarea
                {...register('message', { required: true })}
                rows="5"
                className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
                placeholder="Please describe your issue in detail..."
              ></textarea>
            </div>
          </div>

          <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-t dark:border-slate-700 flex justify-end gap-4 rounded-b-lg">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 font-medium">
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-4 py-2 rounded-lg bg-primary text-white font-medium hover:bg-blue-600 disabled:opacity-50"
            >
              {isSubmitting ? 'Sending...' : 'Send Request'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SupportModal;
