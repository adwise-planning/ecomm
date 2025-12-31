import { useQueryData } from './useQueryData';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';

/**
 * A hook specifically for fetching and processing dashboard metrics.
 * It uses the generic useQueryData hook under the hood.
 *
 * @param {string} dateRange - The date range for the metrics (e.g., '7d', '30d').
 * @param {string} [selector] - An optional key to select a specific part of the data.
 * @returns The query result from useQueryData, with data potentially transformed by the selector.
 */
export const useDashboardMetrics = (dateRange, selector) => {
  const { user } = useAuth();
  const role = user?.role;

  const queryKey = ['dashboardMetrics', dateRange, role];

  const queryFn = () => api.getDashboardMetrics(dateRange, role);

  const options = {
    enabled: !!role, // Only run the query if the role is available
    // A selector function to pick a specific part of the data object
    select: (data) => {
      if (selector) {
        return data ? data[selector] : undefined;
      }
      return data;
    },
  };

  return useQueryData(queryKey, queryFn, options);
};
