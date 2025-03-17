import Button from '@/components/Button';
import useOpen from '@/hooks/useOpen';
import { gamify } from '@/utils/gamify';
import { useQueryClient } from '@tanstack/react-query';
import { FormEvent, useRef, useState } from 'react';

type MetadataEntry = { key: string; value: string };

export default function AddMetricForm() {
  const query = useQueryClient();
  const { isOpen, toggle } = useOpen();
  const formRef = useRef<HTMLFormElement>(null);

  const [metadataEntries, setMetadataEntries] = useState<MetadataEntry[]>([{ key: '', value: '' }]);

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
      description: formData.get('description') as string || null,
      defaultGainXP: Number(formData.get('defaultGainXP')) || undefined,
      metadata: Object.keys(metadata).length > 0 ? metadata : undefined,
    };

    try {
      await gamify.metrics.create(data);
    } catch (error: any) {
      alert(error?.message);
      throw error;
    }
    setMetadataEntries([{ key: '', value: '' }]);

    toggle();
    query.refetchQueries();
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

  return (
    <div>
      <Button onClick={toggle}>Add</Button>
      {isOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center">
          <div className="bg-white p-6 space-y-4 rounded-lg shadow-lg w-full max-w-md">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Add New Metric</h3>
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
                <label className="block text-sm font-medium text-gray-700">Default Gain XP</label>
                <input
                  type="number"
                  name="defaultGainXP"
                  defaultValue={1}
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