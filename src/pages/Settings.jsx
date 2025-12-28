import React from 'react';
import { useForm } from 'react-hook-form';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { Save } from 'lucide-react';

const Settings = () => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();

  const onSubmit = async (data) => {
    try {
      await api.saveSettings(data);
      toast.success('Settings saved successfully');
    } catch (err) {
      toast.error(err?.message || 'Failed to save settings');
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Settings</h1>
        <p className="text-slate-500 dark:text-slate-400">Manage API keys and configurations</p>
      </div>

      <div className="card dark:bg-slate-800 dark:border-slate-700">
        <h3 className="font-bold text-lg mb-4 text-slate-800 dark:text-white">API Integrations</h3>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shopify Access Token</label>
            <input 
              type="password"
              {...register("shopifyToken", { required: "Token is required" })}
              className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
            />
            {errors.shopifyToken && <span className="text-red-500 text-xs">{errors.shopifyToken.message}</span>}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shiprocket Email</label>
            <input 
              type="email"
              {...register("shiprocketEmail", { required: "Email is required" })}
              className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Shiprocket Password</label>
            <input 
              type="password"
              {...register("shiprocketPassword", { required: "Password is required" })}
              className="w-full p-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="flex items-center gap-2 bg-primary text-white px-4 py-2 rounded-lg hover:bg-blue-600 disabled:opacity-50 transition-colors"
            >
              <Save size={18} />
              {isSubmitting ? 'Saving...' : 'Save Configuration'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Settings;