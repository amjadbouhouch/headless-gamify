import { z } from 'zod';

export namespace rewardValidator {
  export const create = z.object({
    id: z.string().optional(),
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    description: z
      .string({
        invalid_type_error: 'Description must be a string',
      })
      .nullable()
      .default(null)
      .optional(),
    xpThreshold: z
      .number({
        required_error: 'XP threshold is required',
        invalid_type_error: 'XP threshold must be a number',
      })
      .positive(),
    value: z
      .number({
        invalid_type_error: 'Value must be a number',
      })
      .default(0)
      .optional(),
    quantity: z
      .number({
        invalid_type_error: 'Quantity must be a number',
      })
      .default(1)
      .optional(),
    expiresAt: z
      .string({
        invalid_type_error: 'Expires at must be a valid date',
      })
      .datetime()
      .nullable()
      .default(null)
      .optional(),
    metadata: z
      .record(z.string(), {
        invalid_type_error: 'Metadata must be an object with string key-value pairs',
      })
      .default({})
      .optional(),
  });

  const withoutId = create.omit({ id: true });

  export const update = withoutId.partial();

  export type Create = z.input<typeof create>;
  export type CreateOutput = z.output<typeof create>;
  export type Update = z.infer<typeof update>;
}
