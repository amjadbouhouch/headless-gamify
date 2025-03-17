import { gamify } from '@/utils/gamify';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { MetricItem } from './MetricItem';
import AddMetricForm from '@/app/gamification-demo/Forms/AddMetricForm';

export function MetricsList() {
  const metricsResponse = useInfiniteQuery({
    queryKey: ['data', 'metrics'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return gamify.metrics.list({ page: pageParam ?? 1 });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextPage ?? undefined;
    },
  });

  const metrics = useMemo(() => {
    return metricsResponse.data?.pages.flatMap((page) => page.data.docs) ?? [];
  }, [metricsResponse.dataUpdatedAt]);

  if (metricsResponse.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading metrics...</div>
      </div>
    );
  }

  if (metricsResponse.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading metrics</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Metrics List</h2>
        <AddMetricForm />
      </div>
      <div className="grid gap-4 grid-cols-1 max-h-96 overflow-y-scroll">
        {metrics.map((metric) => (
          <MetricItem key={metric.id} metric={metric} />
        ))}
      </div>
    </div>
  );
}
