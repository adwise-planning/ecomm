import { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';

export const cache = new Map();

const useWidgetData = (dateRange, metricKey) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    const cacheKey = dateRange;

    try {
      let promise = cache.get(cacheKey);
      if (!promise) {
        promise = api.getDashboardMetrics(dateRange).catch(err => {
            cache.delete(cacheKey);
            throw err;
        });
        cache.set(cacheKey, promise);
      }

      const allMetrics = await promise;
      setData(allMetrics[metricKey]);

    } catch (err) {
      setError(err);
    } finally {
      setLoading(false);
    }
  }, [dateRange, metricKey]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { data, loading, error, refetch: fetchData };
};

export default useWidgetData;
