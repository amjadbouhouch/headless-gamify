import { z } from 'zod';

export const create = z.object({
  id: z.string().optional(),
  xp: z
    .number({
      invalid_type_error: 'XP must be a number',
    })
    .default(0)
    .optional(),
  level: z
    .number({
      invalid_type_error: 'Level must be a number',
    })
    .default(1)
    .optional(),
  lastActivity: z
    .string({
      invalid_type_error: 'Last activity must be a valid date',
    })
    .datetime()
    .nullable()
    .default(null)
    .optional(), // Default is null, optional
  penalties: z
    .number({
      invalid_type_error: 'Penalties must be a number',
    })
    .default(0) // Default is 0, optional
    .optional(),

  // rewards: z.array(z.string()).optional().default([]), // Array of reward IDs, default is empty array
  metadata: z
    .record(z.string(), {
      invalid_type_error: 'Metadata must be an object with string key-value pairs',
    })
    .default({})
    .optional(),
});

const withoutId = create.omit({ id: true });

export const update = withoutId.partial();

export type Create = z.infer<typeof create>;

export type Update = z.infer<typeof update>;

export const incrementMetric = z.object({
  value: z.number().positive(),
});
export type IncrementMetric = z.infer<typeof incrementMetric>;
