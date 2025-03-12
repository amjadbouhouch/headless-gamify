import { z } from 'zod';

export const create = z.object({
  id: z.string().optional(),
  name: z.string(),
  description: z.string().nullable().default(null).optional(),
  defaultGainXP: z.number().positive().default(1).optional(),
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
