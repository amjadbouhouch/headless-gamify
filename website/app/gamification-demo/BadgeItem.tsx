import { gamify } from '@/utils/gamify';
import { useQueryClient } from '@tanstack/react-query';

interface BadgeItemProps {
  badge: Awaited<ReturnType<typeof gamify.badges.list>>['data']['docs'][number];
}

export function BadgeItem({ badge }: BadgeItemProps) {
  const client = useQueryClient();
  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this badge?')) {
      gamify.badges.delete(badge.id).then(() => client.refetchQueries());
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4 hover:shadow-lg transition-shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">ID: {badge.id}</span>
        <button
          onClick={handleDelete}
          className="px-2 py-1 text-sm text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
        >
          Delete
        </button>
      </div>
      <h3 className="text-lg font-medium text-gray-900">{badge.name}</h3>
      <p className="text-gray-600 mt-1">{badge.description}</p>
      {badge.icon && (
        <div className="mt-2">
          <img 
            src={badge.icon} 
            alt={badge.name} 
            className="w-16 h-16 object-contain"
          />
        </div>
      )}
      
      {badge.conditions && badge.conditions.length > 0 && (
        <div className="mt-3 pt-3 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Conditions</h4>
          <div className="space-y-1">
            {badge.conditions.map((condition) => (
              <div key={condition.id} className="text-sm bg-gray-50 p-2 rounded">
                <div className="flex justify-between">
                  <span className="text-gray-600">Metric ID:</span>
                  <span className="text-gray-900">{condition.metricId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Operator:</span>
                  <span className="text-gray-900">{condition.operator}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Value:</span>
                  <span className="text-gray-900">{condition.value}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Priority:</span>
                  <span className="text-gray-900">{condition.priority}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
      
      {badge.metadata && typeof badge.metadata === 'object' && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Metadata</h4>
          <div className="space-y-1">
            {Object.entries(badge.metadata).map(([key, value]) => (
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