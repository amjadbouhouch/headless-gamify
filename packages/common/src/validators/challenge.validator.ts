import { z } from 'zod';
export namespace challengeValidator {
  export const create = z.object({
    id: z.string().optional(),
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    description: z.string().nullable().optional().default(null),
    startDate: z
      .string({
        invalid_type_error: 'Start date must be a valid date',
      })
      .datetime(),
    endDate: z
      .string({
        invalid_type_error: 'End date must be a valid date',
      })
      .datetime(),
    rewardXp: z.number().positive(),
    status: z.enum(['active', 'completed', 'draft']).default('active').optional(),
    objectives: z.array(z.string()).optional().default([]), // Array of objective IDs
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
  export type CreateOutput = z.output<typeof create>;
  export type Update = z.infer<typeof update>;
}
