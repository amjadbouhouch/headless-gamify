import { gamify } from '@/utils/gamify';
import { useInfiniteQuery } from '@tanstack/react-query';
import { useMemo } from 'react';
import { UserItem } from './UserItem';
import AddUserForm from '@/app/gamification-demo/Forms/AddUserForm';

export function UsersList() {
  const usersResponse = useInfiniteQuery({
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
    return usersResponse.data?.pages.flatMap((page) => page.data.docs) ?? [];
  }, [usersResponse.dataUpdatedAt]);
  if (usersResponse.isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-gray-600">Loading users...</div>
      </div>
    );
  }

  if (usersResponse.error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-red-600">Error loading users</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-semibold mb-6 text-gray-900">Users List</h2>
        <AddUserForm />
      </div>
      <div className="grid gap-4 grid-cols-1 max-h-96 overflow-y-scroll">
        {users.map((user) => (
          <UserItem key={user.id} user={user} />
        ))}
      </div>
    </div>
  );
}
