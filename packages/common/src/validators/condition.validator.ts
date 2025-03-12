import { z } from 'zod';

export namespace conditionValidator {
  export const create = z.object({
    id: z.string().optional(),
    metricId: z.string({
      required_error: 'MetricId is required',
      invalid_type_error: 'MetricId must be a string',
    }),
    badgeId: z.string({
      required_error: 'badgeId is required',
      invalid_type_error: 'badgeId must be a string',
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
  });
  const withoutId = create.omit({ id: true });

  const withOptionalBadgeId = withoutId.extend({
    badgeId: z.string().optional(),
  });
  // create
  export type Create = z.input<typeof withoutId>;
  export type CreateOutput = z.output<typeof create>;
  //  update
  export const update = withOptionalBadgeId.partial();
  export type Update = z.infer<typeof update>;
}
