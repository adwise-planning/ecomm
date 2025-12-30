import { useQuery, useQueryClient } from '@tanstack/react-query';

/**
 * A generic hook for fetching data using TanStack Query.
 *
 * @param {string|Array} queryKey - The key for the query, used for caching.
 * @param {Function} queryFn - The async function that fetches the data (e.g., an api service call).
 * @param {object} [options={}] - Optional additional options for the useQuery hook.
 * @returns {object} The state and functions returned by the useQuery hook.
 */
export const useQueryData = (queryKey, queryFn, options = {}) => {
  const queryClient = useQueryClient();

  const queryResult = useQuery({
    queryKey,
    queryFn,
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });

  // Function to manually refresh the data
  const refresh = () => {
    queryClient.invalidateQueries(queryKey);
  };

  return {
    ...queryResult,
    refresh,
  };
};
