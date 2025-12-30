import React from 'react';
import { Lightbulb, Check, X, AlertTriangle } from 'lucide-react';
import { Skeleton } from '../components/ui/Skeleton';
import toast from 'react-hot-toast';
import { useQueryData } from '../hooks/useQueryData';
import { Link } from 'react-router-dom';
import WidgetError from '../components/dashboard/WidgetError';
import { api } from '../services/api';

const RecommendationCard = ({ rec, onDismiss }) => {
  const impactColorClasses = {
    high: 'text-red-600 dark:text-red-400',
    medium: 'text-orange-600 dark:text-orange-400',
    low: 'text-green-600 dark:text-green-400',
  };

  return (
    <div className="card border-l-4 border-l-primary flex flex-col md:flex-row justify-between items-start gap-4">
      <div className="flex gap-4 flex-1">
        <div className="p-3 rounded-full h-fit bg-orange-100 text-orange-600">
          <Lightbulb size={24} />
        </div>
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h3 className="font-bold text-lg text-slate-800 dark:text-white">{rec.title}</h3>
            <span className="text-xs px-2 py-0.5 rounded uppercase font-bold bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200">
              {rec.category}
            </span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 mb-2">{rec.description}</p>
          <p className={`text-sm font-medium capitalize ${impactColorClasses[rec.impact]}`}>
            Est. Impact: {rec.impact}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 self-end md:self-center">
        <button
          onClick={() => onDismiss(rec.id)}
          className="p-2 text-sm font-medium text-slate-500 hover:text-slate-800 dark:hover:text-slate-200"
          title="Dismiss"
        >
          <X size={18} />
        </button>
        <Link
          to={rec.action_link}
          className="px-4 py-2 text-sm font-medium text-white bg-primary rounded-lg hover:bg-blue-600"
        >
          Take Action
        </Link>
      </div>
    </div>
  );
};

const Recommendations = () => {
  const { data, isLoading, isError, error, refetch } = useQueryData(['recommendations'], api.getRecommendations);
  const [dismissedRecs, setDismissedRecs] = React.useState([]);

  const handleDismiss = (recId) => {
    setDismissedRecs(prev => [...prev, recId]);
    toast('Recommendation dismissed.', { icon: '🗑️' });
  };

  const recommendations = data?.recommendations || [];
  const visibleRecs = recommendations.filter(rec => !dismissedRecs.includes(rec.id));

  const renderContent = () => {
    if (isLoading) {
      return [...Array(3)].map((_, i) => <Skeleton key={i} className="h-32" />);
    }

    if (isError) {
      return <WidgetError message={error.message} onRetry={refetch} />;
    }

    if (visibleRecs.length === 0) {
      return (
        <div className="text-center py-12 card">
          <Check size={48} className="mx-auto text-green-500 mb-4" />
          <h3 className="text-lg font-bold text-slate-800 dark:text-white">All Clear!</h3>
          <p className="text-slate-500">No new recommendations at the moment.</p>
        </div>
      );
    }

    return visibleRecs.map((rec) => (
      <RecommendationCard key={rec.id} rec={rec} onDismiss={handleDismiss} />
    ));
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">AI Recommendations</h1>
        <p className="text-slate-500 dark:text-slate-400">Actionable insights to improve your business metrics</p>
      </div>
      <div className="grid gap-4">
        {renderContent()}
      </div>
    </div>
  );
};

export default Recommendations;
