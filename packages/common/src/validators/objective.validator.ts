import { z } from 'zod';

export const create = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullable().optional().default(null),
  //
  startDate: z
    .string({
      invalid_type_error: 'Last activity must be a valid date',
    })
    .datetime(),
  endDate: z
    .string({
      invalid_type_error: 'Last activity must be a valid date',
    })
    .datetime(),
  metricId: z.string(),
  targetValue: z.number().positive(),
  rewardXp: z.number().positive(),
  type: z.enum(['solo', 'team']),
  teamId: z.string().optional().nullable().default(null),
  users: z.array(z.string()).optional().default([]), // Default is an empty array
  metadata: z
    .record(z.string(), {
      invalid_type_error: 'Metadata must be an object with string key-value pairs',
    })
    .default({}),
});
const withoutId = create.omit({ id: true });

export const update = withoutId.partial();

export type Create = z.input<typeof create>;
export type CreateOutput = z.output<typeof create>;
export type Update = z.infer<typeof update>;
