import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Lightbulb, ArrowRight } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';

const Recommendations = () => {
  const [recs, setRecs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.getRecommendations().then(data => {
      setRecs(data);
      setLoading(false);
    });
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Recommendations</h1>
        <p className="text-slate-500 dark:text-slate-400">Actionable insights to improve your business metrics</p>
      </div>

      <div className="grid gap-4">
        {loading ? (
          [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />)
        ) : (
          recs.map((rec) => (
            <div key={rec.id} className="card border-l-4 border-l-primary flex flex-col md:flex-row justify-between gap-4">
              <div className="flex gap-4">
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
              <div className="flex items-center">
                <button className="flex items-center gap-2 text-sm font-medium text-primary hover:text-blue-700 dark:hover:text-blue-400 transition-colors">
                  View Details <ArrowRight size={16} />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Recommendations;