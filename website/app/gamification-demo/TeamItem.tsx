import { gamify } from '@/utils/gamify';
import { useQueryClient } from '@tanstack/react-query';

interface TeamItemProps {
  team: Awaited<ReturnType<typeof gamify.teams.list>>['data']['docs'][number];
}

export function TeamItem({ team }: TeamItemProps) {
  const client = useQueryClient();
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this team?')) {
      gamify.teams.delete(team.id).then(() => client.refetchQueries());
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">ID: {team.id}</span>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-blue-600">XP: {team.xp}</span>
        </div>
      </div>
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">Name:</span>
          <span className="font-medium text-gray-900">{team.name}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Members:</span>
          <span className="font-medium text-gray-900">{team.members.length}</span>
        </div>
        {team.metadata && typeof team.metadata === 'object' && (
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata</h4>
              <button
                onClick={handleDelete}
                className="px-2 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
              >
                Delete
              </button>
            </div>
            <div className="space-y-1">
              {Object.entries(team.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <span className="text-gray-900">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
