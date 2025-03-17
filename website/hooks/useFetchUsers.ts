import { gamify } from '@/utils/gamify';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';

export function useFetchUsers() {
  const response = useInfiniteQuery({
    queryKey: ['data', 'users'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return gamify.users.list({ page: pageParam ?? 1 });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextPage ?? undefined;
    },
  });
  const users = useMemo(() => {
    if (!response.data) {
      return [];
    }
    return response.data.pages.flatMap((elem) => elem.data.docs);
  }, [response.dataUpdatedAt]);
  return {
    ...response,
    users,
  };
}
