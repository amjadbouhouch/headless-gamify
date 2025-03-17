import { gamify } from '@/utils/gamify';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
export default function useFetchTeams() {
  const response = useInfiniteQuery({
    queryKey: ['data', 'teams'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return gamify.teams.list({ page: pageParam ?? 1, limit: 100 });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextPage ?? undefined;
    },
  });
  const teams = useMemo(() => {
    if (!response.data) {
      return [];
    }
    return response.data.pages.flatMap((elem) => elem.data.docs);
  }, [response.dataUpdatedAt]);
  return {
    ...response,
    teams,
  };
}
