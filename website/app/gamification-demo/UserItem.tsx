// import { User } from '@/utils/gamify';

import { gamify } from '@/utils/gamify';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';
import Button from '@/components/Button';
import useFetchMetrics from '@/hooks/useFetchMetrics';

interface UserItemProps {
  user: Awaited<ReturnType<typeof gamify.users.list>>['data']['docs'][number];
}

export function UserItem({ user }: UserItemProps) {
  const client = useQueryClient();
  const [isMetricModalOpen, setIsMetricModalOpen] = useState(false);
  const [selectedMetric, setSelectedMetric] = useState('');
  const [incrementValue, setIncrementValue] = useState(1);

  // Fetch metrics for the dropdown
  const { metrics } = useFetchMetrics();

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      gamify.users.delete(user.id).then(() => client.refetchQueries());
    }
  };

  const handleIncrementMetric = async () => {
    if (!selectedMetric) return;

    try {
      // await gamify.users.updateMetric(user.id, {
      //   metricId: selectedMetric,
      //   value: incrementValue,
      // });
      await gamify.users.updateMetric(user.id, selectedMetric, { value: incrementValue });
      client.refetchQueries();
      setIsMetricModalOpen(false);
      setSelectedMetric('');
      setIncrementValue(1);
    } catch (error: unknown) {
      // @ts-expect-error
      alert(error?.message);
    }
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-600">ID: {user.id}</span>
        <div className="flex items-center gap-2">
          <Button size="sm" onClick={() => setIsMetricModalOpen(true)}>
            Increment Metric
          </Button>
          <span className="text-sm font-medium text-blue-600">Level {user.level}</span>
        </div>
      </div>

      {/* Existing user info */}
      <div className="space-y-2">
        <div className="flex justify-between">
          <span className="text-gray-600">XP:</span>
          <span className="font-medium text-gray-900">{user.xp}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Used XP:</span>
          <span className="font-medium text-gray-900">{user.usedXp}</span>
        </div>

        {/* Metadata section */}
        {user.metadata && typeof user.metadata === 'object' && (
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
              {Object.entries(user.metadata).map(([key, value]) => (
                <div key={key} className="flex justify-between text-sm">
                  <span className="text-gray-600">{key}:</span>
                  <span className="text-gray-900">{String(value)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Metric Increment Modal */}
      {isMetricModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Increment Metric</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Metric
                </label>
                <select
                  value={selectedMetric}
                  onChange={(e) => setSelectedMetric(e.target.value)}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                >
                  <option value="">Choose a metric</option>
                  {metrics.map((metric) => (
                    <option key={metric.id} value={metric.id}>
                      {metric.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Increment Value
                </label>
                <input
                  type="number"
                  value={incrementValue}
                  onChange={(e) => setIncrementValue(Number(e.target.value))}
                  className="w-full rounded-md border border-gray-300 px-3 py-2"
                />
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={() => setIsMetricModalOpen(false)}>
                  Cancel
                </Button>
                <Button onClick={handleIncrementMetric} disabled={!selectedMetric}>
                  Increment
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
