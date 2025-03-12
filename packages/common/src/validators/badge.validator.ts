import { z } from 'zod';
export namespace badgeValidator {
  export const create = z.object({
    id: z.string().optional(),
    name: z.string({
      required_error: 'Name is required',
      invalid_type_error: 'Name must be a string',
    }),
    description: z
      .string({
        invalid_type_error: 'Name must be a string',
      })
      .nullable()
      .default(null)
      .optional(),
    conditions: z
      .array(
        z.object({
          metricId: z.string({
            required_error: 'MetricId is required',
            invalid_type_error: 'MetricId must be a string',
          }),
          operator: z.enum(['gte', 'lte', 'eq', 'gt', 'lt']),
          value: z
            .number({
              required_error: 'Value is required',
              invalid_type_error: 'Value must be a number',
            })
            .positive()
            .nullable()
            .default(null)
            .optional(),
          type: z.enum(['firstEvent', 'conditional']),
          priority: z.number({
            required_error: `Priority is required`,
            invalid_type_error: 'Priority must be a number',
          }),
        })
      )
      .default([])
      .optional(),
    metadata: z
      .record(z.string(), {
        invalid_type_error: 'Metadata must be an object with string key-value pairs',
      })
      .default({})
      .optional(),
  });
  //
  const withoutId = create.omit({ id: true });

  const withoutIdAndCOnditions = create.omit({
    id: true,
    conditions: true,
  });

  export const update = withoutIdAndCOnditions.partial();

  export type Create = z.input<typeof create>;
  export type CreateOutput = z.output<typeof create>;
  export type Update = z.infer<typeof update>;
}
