import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Lightbulb, Check, X } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';

const Recommendations = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dismissedRecs, setDismissedRecs] = useState([]);

  useEffect(() => {
    api.getRecommendations().then(data => {
      setRecs(data);
      setLoading(false);
    });
  }, []);

  const handleTakeAction = (recId) => {
    // In a real app, this would trigger a modal or a specific API call
    console.log(`Taking action on recommendation ${recId}`);
    toast.success(`Action taken for recommendation #${recId}!`);
  };

  const handleDismiss = (recId) => {
    setDismissedRecs(prev => [...prev, recId]);
    toast('Recommendation dismissed.', { icon: '🗑️' });
  };

  const visibleRecs = recs.filter(rec => !dismissedRecs.includes(rec.id));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Recommendations</h1>
        <p className="text-slate-500 dark:text-slate-400">Actionable insights to improve your business metrics</p>
      </div>

      <div className="grid gap-4">
        {loading && [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)}

        {!loading && visibleRecs.length === 0 && (
          <div className="text-center py-12 card">
            <Check size={48} className="mx-auto text-green-500 mb-4" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-white">All Clear!</h3>
            <p className="text-slate-500">No new recommendations at the moment.</p>
          </div>
        )}

        {!loading && visibleRecs.map((rec) => (
            <div key={rec.id} className="card border-l-4 border-l-primary flex flex-col md:flex-row justify-between items-start gap-4">
              <div className="flex gap-4 flex-1">
                <div className={`p-3 rounded-full h-fit ${rec.severity === 'critical' ? 'bg-red-100 text-red-600' : 'bg-orange-100 text-orange-600'}`}>
                  <Lightbulb size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-bold text-lg text-slate-800 dark:text-white">{rec.title}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded uppercase font-bold ${
                      rec.severity === 'critical' ? 'bg-red-100 text-red-700' : 'bg-orange-100 text-orange-700'
                    }`}>
                      {rec.severity}
                    </span>
                  </div>
                  <p className="text-slate-600 dark:text-slate-300 mb-2">{rec.desc}</p>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">Est. Impact: {rec.impact}</p>
                </div>
              </div>
              <div className="flex items-center gap-2 self-end md:self-center">
                <button
                  onClick={() => handleDismiss(rec.id)}
                  className="p-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
                  title="Dismiss"
                >
                  <X size={18} />
                </button>
                <button
                  onClick={() => handleTakeAction(rec.id)}
                  className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600"
                >
                  Take Action
                </button>
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default Recommendations;
