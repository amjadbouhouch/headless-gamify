import { gamify } from '@/utils/gamify';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { TeamItem } from './TeamItem';
import AddTeamForm from '@/app/gamification-demo/Forms/AddTeamForm';

export function TeamsList() {
  const teamsResponse = useInfiniteQuery({
    queryKey: ['data', 'teams'],
    initialPageParam: 1,
    queryFn: ({ pageParam }) => {
      return gamify.teams.list({ page: pageParam ?? 1 });
    },
    getNextPageParam: (lastPage) => {
      return lastPage.data.nextPage ?? undefined;
    },
  });

  const teams = useMemo(() => {
    return teamsResponse.data?.pages.flatMap((page) => page.data.docs) ?? [];
  }, [teamsResponse.dataUpdatedAt]);

  if (teamsResponse.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading teams...</div>
      </div>
    );
  }

  if (teamsResponse.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading teams</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Teams List</h2>
        <AddTeamForm />
      </div>
      <div className="grid gap-4 grid-cols-1 max-h-96 overflow-y-scroll">
        {teams.map((team) => (
          <TeamItem key={team.id} team={team} />
        ))}
      </div>
    </div>
  );
}
