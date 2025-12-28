import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { CheckCircle, XCircle } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

const Integrations = () => {
  const [integrations, setIntegrations] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getIntegrations().then(data => {
      setIntegrations(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Data Integrations</h1>
        <p className="text-slate-500 dark:text-slate-400">Connect your e-commerce platforms</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-48" />)
        ) : (
          integrations.map((item) => (
            <div key={item.id} className="card flex flex-col justify-between h-48">
              <div className="flex justify-between items-start">
                <div className="font-bold text-lg text-slate-800 dark:text-white">{item.name}</div>
                {item.status === 'connected' ? (
                  <CheckCircle className="text-green-500" size={20} />
                ) : (
                  <XCircle className="text-slate-300" size={20} />
                )}
              </div>
              
              <div className="mt-4">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {item.status === 'connected' 
                    ? `Last synced: ${item.lastSync}` 
                    : 'Not connected'}
                </p>
              </div>

              <button className={`w-full mt-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                item.status === 'connected'
                  ? 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                  : 'bg-primary text-white hover:bg-blue-600'
              }`}>
                {item.status === 'connected' ? 'Configure' : 'Connect'}
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Integrations;