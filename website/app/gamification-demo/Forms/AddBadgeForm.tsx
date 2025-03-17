import Button from '@/components/Button';
import useOpen from '@/hooks/useOpen';
import { gamify } from '@/utils/gamify';
import { useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef, useState } from 'react';
import useFetchMetrics from '@/hooks/useFetchMetrics';

type MetadataEntry = { key: string; value: string };
type ConditionEntry = NonNullable<Parameters<typeof gamify.badges.create>[0]['conditions']>[number];

export default function AddBadgeForm() {
  const query = useQueryClient();
  const { isOpen, toggle } = useOpen();
  const formRef = useRef<HTMLFormElement>(null);

  const [metadataEntries, setMetadataEntries] = useState<MetadataEntry[]>([{ key: '', value: '' }]);
  const [conditionEntries, setConditionEntries] = useState<ConditionEntry[]>([]);

  // Fetch metrics for condition dropdown
  const { metrics } = useFetchMetrics();

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

    // Filter out incomplete conditions
    const validConditions = conditionEntries.filter((c) => c.metricId && c.operator);

    const data = {
      id: (formData.get('id') as string) || undefined,
      name: formData.get('name') as string,
      description: (formData.get('description') as string) || null,
      icon: (formData.get('icon') as string) || null,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };

    try {
      const response = await gamify.badges.create(data);

      // Create conditions for the badge
      if (validConditions.length > 0) {
        for (const condition of validConditions) {
          await gamify.conditions.create({
            badgeId: response.data.id,
            metricId: condition.metricId,
            operator: condition.operator,
            value: condition.value,
            priority: condition.priority,
            type: condition.type,
          });
        }
      }
    } catch (error: any) {
      alert(error?.message);
      throw error;
    }

    setMetadataEntries([{ key: '', value: '' }]);
    setConditionEntries([]);

    toggle();
    query.refetchQueries();
  }

  // Metadata field handlers
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

  // Condition field handlers
  const addConditionField = () => {
    setConditionEntries([
      ...conditionEntries,
      {
        metricId: '',
        operator: 'gt',
        value: 0,
        priority: conditionEntries.length + 1,
        type: 'firstEvent',
      },
    ]);
  };

  const removeConditionField = (index: number) => {
    setConditionEntries(conditionEntries.filter((_, i) => i !== index));
  };

  const updateConditionField = (
    index: number,
    field: keyof ConditionEntry,
    value: string | number
  ) => {
    const newEntries = [...conditionEntries];
    // @ts-expect-error
    newEntries[index][field] = value;
    setConditionEntries(newEntries);
  };

  return (
    <div>
      <Button onClick={toggle}>Add</Button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 space-y-4 rounded-lg shadow-lg w-full max-w-md max-h-[90vh] overflow-y-auto">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add New Badge</h3>
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
                <label className="block text-sm font-medium text-gray-700">Icon URL</label>
                <input
                  type="text"
                  name="icon"
                  className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              {/* Conditions Section */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="block text-sm font-medium text-gray-700">Conditions</label>
                  <Button type="button" onClick={addConditionField} size="sm">
                    Add Condition
                  </Button>
                </div>
                {conditionEntries.map((condition, index) => (
                  <div key={index} className="mt-3 p-3 border border-gray-200 rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Metric</label>
                        <select
                          value={condition.metricId}
                          onChange={(e) => updateConditionField(index, 'metricId', e.target.value)}
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
                        <label className="block text-xs font-medium text-gray-700">Operator</label>
                        <select
                          value={condition.operator}
                          onChange={(e) => updateConditionField(index, 'operator', e.target.value)}
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        >
                          <option value="gt">Greater than (&gt;)</option>
                          <option value="gte">Greater than or equal (&gt;=)</option>
                          <option value="lt">Less than (&lt;)</option>
                          <option value="lte">Less than or equal (&lt;=)</option>
                          <option value="eq">Equal (=)</option>
                        </select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-2 mt-2">
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Value</label>
                        <input
                          type="number"
                          value={condition.value ?? 1}
                          onChange={(e) =>
                            updateConditionField(index, 'value', Number(e.target.value))
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700">Priority</label>
                        <input
                          type="number"
                          value={condition.priority}
                          onChange={(e) =>
                            updateConditionField(index, 'priority', Number(e.target.value))
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                    <div className="mt-2">
                      <label className="block text-xs font-medium text-gray-700">Type</label>
                      <select
                        value={condition.type}
                        onChange={(e) => updateConditionField(index, 'type', e.target.value)}
                        className="mt-1 block w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      >
                        <option value="firstEvent">firstEvent</option>
                        <option value="conditional">conditional</option>
                      </select>
                    </div>
                    {index > 0 && (
                      <div className="mt-2 flex justify-end">
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => removeConditionField(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Metadata Section */}
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
