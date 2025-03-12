import { z } from 'zod';

export const create = z.object({
  id: z.string().optional(),
  name: z.string({
    required_error: 'Name is required',
    invalid_type_error: 'Name must be a string',
  }),
  xp: z
    .number({
      invalid_type_error: 'xp must be a number',
    })
    .default(1)
    .optional(),
  //  array of string
  members: z.array(z.string()).default([]).optional(), // Default is an empty array
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
