import { gamify } from '@/utils/gamify';
import { useQueryClient } from '@tanstack/react-query';

interface ObjectiveItemProps {
  objective: Awaited<ReturnType<typeof gamify.objectives.list>>['data']['docs'][number];
}

export function ObjectiveItem({ objective }: ObjectiveItemProps) {
  const client = useQueryClient();
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this objective?')) {
      gamify.objectives.delete(objective.id).then(() => client.refetchQueries());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">ID: {objective.id}</span>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
        >
          Delete
        </button>
      </div>
      <h3 className="text-lg font-medium text-gray-900">{objective.name}</h3>
      <p className="text-gray-600 mt-1">{objective.description}</p>
      <div className="mt-3 space-y-2 text-sm text-gray-500">
        <div className="flex justify-between">
          <span>Metric:</span>
          <span className="font-medium">{objective.metric.name}</span>
        </div>
        <div className="flex justify-between">
          <span>Target Value:</span>
          <span className="font-medium">{objective.targetValue}</span>
        </div>
        <div className="flex justify-between">
          <span>Reward XP:</span>
          <span className="font-medium">{objective.rewardXp}</span>
        </div>
        <div className="flex justify-between">
          <span>Type:</span>
          <span className="font-medium">{objective.type}</span>
        </div>
        <div className="flex justify-between">
          <span>Period:</span>
          <span className="font-medium">
            {new Date(objective.startDate).toLocaleDateString()} - {new Date(objective.endDate).toLocaleDateString()}
          </span>
        </div>
      </div>

      {objective.metadata && typeof objective.metadata === 'object' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata</h4>
          <div className="space-y-1">
            {Object.entries(objective.metadata).map(([key, value]) => (
              <div key={key} className="flex justify-between text-sm">
                <span className="text-gray-600">{key}:</span>
                <span className="text-gray-900">{String(value)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}