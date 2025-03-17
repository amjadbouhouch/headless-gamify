import { gamify } from '@/utils/gamify';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { BadgeItem } from './BadgeItem';
import AddBadgeForm from '@/app/gamification-demo/Forms/AddBadgeForm';

export function BadgesList() {
  const badgesResponse = useInfiniteQuery({
    queryKey: ['data', 'badges'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return gamify.badges.list({ page: pageParam ?? 1 });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextPage ?? undefined;
    },
  });

  const badges = useMemo(() => {
    return badgesResponse.data?.pages.flatMap((page) => page.data.docs) ?? [];
  }, [badgesResponse.dataUpdatedAt]);

  if (badgesResponse.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading badges...</div>
      </div>
    );
  }

  if (badgesResponse.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading badges</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Badges List</h2>
        <AddBadgeForm />
      </div>
      <div className="grid gap-4 grid-cols-1 max-h-96 overflow-y-scroll">
        {badges.map((badge) => (
          <BadgeItem key={badge.id} badge={badge} />
        ))}
      </div>
    </div>
  );
}
