import { gamify } from '@/utils/gamify';
import { useQueryClient } from '@tanstack/react-query';

interface MetricItemProps {
  metric: Awaited<ReturnType<typeof gamify.metrics.list>>['data']['docs'][number];
}

export function MetricItem({ metric }: MetricItemProps) {
  const client = useQueryClient();
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this metric?')) {
      gamify.metrics.delete(metric.id).then(() => client.refetchQueries());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">ID: {metric.id}</span>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
        >
          Delete
        </button>
      </div>
      <h3 className="text-lg font-medium text-gray-900">{metric.name}</h3>
      <p className="text-gray-600 mt-1">{metric.description}</p>
      {metric.metadata && typeof metric.metadata === 'object' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata</h4>
          <div className="space-y-1">
            {Object.entries(metric.metadata).map(([key, value]) => (
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
