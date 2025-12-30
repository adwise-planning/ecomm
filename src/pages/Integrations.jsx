import React from 'react';
import { useQueryData } from '../hooks/useQueryData';
import { CheckCircle, XCircle, Power } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import WidgetError from '../components/dashboard/WidgetError';
import { api } from '../services/api';
import toast from 'react-hot-toast';
import { useQueryClient } from '@tanstack/react-query';

const IntegrationCard = ({ item, onToggle }) => {
  return (
    <div className="card flex flex-col justify-between h-48">
      <div className="flex justify-between items-start">
        <div className="font-bold text-lg text-slate-800 dark:text-white">{item.name}</div>
        {item.connected ? (
          <CheckCircle className="text-green-500" size={20} />
        ) : (
          <XCircle className="text-slate-300 dark:text-slate-600" size={20} />
        )}
      </div>

      <div className="mt-4">
        <p className="text-sm text-slate-500 dark:text-slate-400">
          {item.connected
            ? 'Connected'
            : 'Not connected'}
        </p>
      </div>

      <button
        onClick={() => onToggle(item.id, !item.connected)}
        className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 ${
          item.connected
            ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-red-100 hover:text-red-600 dark:hover:bg-red-900/20 dark:hover:text-red-500'
            : 'bg-primary text-white hover:bg-blue-600'
        }`}
      >
        <Power size={14} />
        {item.connected ? 'Disconnect' : 'Connect'}
      </button>
    </div>
  );
};

const Integrations = () => {
  const queryClient = useQueryClient();
  const { data, isLoading, isError, error, refetch } = useQueryData(['integrations'], api.getIntegrations);

  const handleToggleConnect = async (id, newConnectedState) => {
    // We don't have the full data object to perform an optimistic update here,
    // so we'll just invalidate the query and let it refetch.
    try {
      await api.updateIntegration(id, { connected: newConnectedState });
      toast.success(`Successfully ${newConnectedState ? 'connected' : 'disconnected'} integration.`);
      queryClient.invalidateQueries(['integrations']);
    } catch (err) {
      toast.error(`Failed to update integration: ${err.message}`);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return [...Array(4)].map((_, i) => <Skeleton key={i} className="h-48" />);
    }

    if (isError) {
      return (
        <div className="md:col-span-2 lg:col-span-3">
          <WidgetError message={error.message} onRetry={refetch} />
        </div>
      );
    }

    const integrations = data?.integrations || [];

    return integrations.map((item) => (
      <IntegrationCard key={item.id} item={item} onToggle={handleToggleConnect} />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Data Integrations</h1>
        <p className="text-slate-500 dark:text-slate-400">Connect your e-commerce platforms and other tools</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {renderContent()}
      </div>
    </div>
  );
};

export default Integrations;
