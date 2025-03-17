import { gamify } from '@/utils/gamify';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
export default function useFetchMetrics() {
  const response = useInfiniteQuery({
    queryKey: ['data', 'metrics'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return gamify.metrics.list({ page: pageParam ?? 1, limit: 100 });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextPage ?? undefined;
    },
  });
  const metrics = useMemo(() => {
    if (!response.data) {
      return [];
    }
    return response.data.pages.flatMap((elem) => elem.data.docs);
  }, [response.dataUpdatedAt]);
  return {
    ...response,
    metrics,
  };
}
