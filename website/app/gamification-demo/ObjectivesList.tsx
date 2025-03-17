import { gamify } from '@/utils/gamify';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { ObjectiveItem } from './ObjectiveItem';
import AddObjectiveForm from './Forms/AddObjectiveForm';

export function ObjectivesList() {
  const objectivesResponse = useInfiniteQuery({
    queryKey: ['data', 'objectives'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return gamify.objectives.list({ page: pageParam ?? 1 });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextPage ?? undefined;
    },
  });

  const objectives = useMemo(() => {
    return objectivesResponse.data?.pages.flatMap((page) => page.data.docs) ?? [];
  }, [objectivesResponse.dataUpdatedAt]);

  if (objectivesResponse.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading objectives...</div>
      </div>
    );
  }

  if (objectivesResponse.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading objectives</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Objectives List</h2>
        <AddObjectiveForm />
      </div>
      <div className="grid gap-4 grid-cols-1 max-h-96 overflow-y-scroll">
        {objectives.map((objective) => (
          <ObjectiveItem key={objective.id} objective={objective} />
        ))}
      </div>
    </div>
  );
}
