import Button from '@/components/Button';
import useFetchMetrics from '@/hooks/useFetchMetrics';
import useFetchTeams from '@/hooks/useFetchTeams';
import { useFetchUsers } from '@/hooks/useFetchUsers';
import useOpen from '@/hooks/useOpen';
import { gamify } from '@/utils/gamify';
import { useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef, useState } from 'react';

type MetadataEntry = { key: string; value: string };

export default function AddObjectiveForm() {
  const query = useQueryClient();
  const { isOpen, toggle } = useOpen();
  const formRef = useRef<HTMLFormElement>(null);

  const [metadataEntries, setMetadataEntries] = useState<MetadataEntry[]>([{ key: '', value: '' }]);
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);

  // Fetch required data
  const { metrics } = useFetchMetrics();

  const { teams } = useFetchTeams();

  const { users } = useFetchUsers();

  //   const metrics = metricsQuery.data?.data.docs || [];
  //   const teams = teamsQuery.data?.data.docs || [];

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const formData = new FormData(formRef.current!);
    const metadata = metadataEntries.reduce(
      (acc, { key, value }) => {
        if (key && value) {
          acc[key] = value;
        }
        return acc;
      },
      {} as Record<string, string>
    );

    const data = {
      id: (formData.get('id') as string) || undefined,
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      metricId: formData.get('metricId') as string,
      targetValue: Number(formData.get('targetValue')),
      rewardXp: Number(formData.get('rewardXp')),
      type: formData.get('type') as 'solo' | 'team',
      startDate: new Date(formData.get('startDate') as string).toISOString(),
      endDate: new Date(formData.get('endDate') as string).toISOString(),
      teamId: (formData.get('teamId') as string) || null,
      users: selectedUsers,
      metadata: Object.keys(metadata).length > 0 ? metadata : {},
    };

    try {
      await gamify.objectives.create(data);
      setMetadataEntries([{ key: '', value: '' }]);
      setSelectedUsers([]);
      toggle();
      query.refetchQueries();
    } catch (error: unknown) {
      // @ts-expect-error
      alert(error?.message);
      throw error;
    }
  }

  const addMetadataField = () => {
    setMetadataEntries([...metadataEntries, { key: '', value: '' }]);
  };

  const removeMetadataField = (index: number) => {
    setMetadataEntries(metadataEntries.filter((_, i) => i !== index));
  };

  const updateMetadataField = (index: number, field: 'key' | 'value', value: string) => {
    const newEntries = [...metadataEntries];
    newEntries[index][field] = value;
    setMetadataEntries(newEntries);
  };

  const handleUserSelection = (userId: string) => {
    setSelectedUsers((prev) =>
      prev.includes(userId) ? prev.filter((id) => id !== userId) : [...prev, userId]
    );
  };

  return (
    <div>
      <Button onClick={toggle}>Add</Button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 space-y-4 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add New Objective</h3>
              <p className="text-gray-500">* indicates required field</p>
            </div>
            <form ref={formRef} onSubmit={onSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">ID</label>
                <input
                  type="text"
                  name="id"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Description</label>
                <textarea
                  name="description"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Metric <span className="text-red-500">*</span>
                </label>
                <select
                  name="metricId"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a metric</option>
                  {metrics.map((metric) => (
                    <option key={metric.id} value={metric.id}>
                      {metric.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Target Value <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="targetValue"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Reward XP <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="rewardXp"
                  required
                  defaultValue={100}
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type <span className="text-red-500">*</span>
                </label>
                <select
                  name="type"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="solo">Solo</option>
                  <option value="team">Team</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Users</label>
                <div className="mt-2 max-h-40 overflow-y-auto border border-gray-300 rounded-md p-2">
                  {users.map((user) => (
                    <label key={user.id} className="flex items-center space-x-2 p-1">
                      <input
                        type="checkbox"
                        checked={selectedUsers.includes(user.id)}
                        onChange={() => handleUserSelection(user.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-sm text-gray-700">{user.id}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">Team (Optional)</label>
                <select
                  name="teamId"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                >
                  <option value="">Select a team</option>
                  {teams.map((team) => (
                    <option key={team.id} value={team.id}>
                      {team.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="startDate"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Date <span className="text-red-500">*</span>
                </label>
                <input
                  type="datetime-local"
                  name="endDate"
                  required
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Metadata</label>
                  <Button type="button" onClick={addMetadataField} size="sm">
                    Add Field
                  </Button>
                </div>
                {metadataEntries.map((entry, index) => (
                  <div key={index} className="mt-2 flex space-x-2">
                    <input
                      type="text"
                      value={entry.key}
                      onChange={(e) => updateMetadataField(index, 'key', e.target.value)}
                      placeholder="Key"
                      className="block w-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <input
                      type="text"
                      value={entry.value}
                      onChange={(e) => updateMetadataField(index, 'value', e.target.value)}
                      placeholder="Value"
                      className="block w-1/2 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    {index > 0 && (
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => removeMetadataField(index)}
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-end space-x-2 pt-4">
                <Button variant="outline" onClick={toggle} type="button">
                  Close
                </Button>
                <Button type="submit">Submit</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
