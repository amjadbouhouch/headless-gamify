import { z } from 'zod';
export const ZCommonQueries = z.object({
  page: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().int().min(1))
    .optional()
    .default('1'),
  limit: z
    .string()
    .transform((val) => Number(val))
    .pipe(z.number().int().min(1).max(100))
    .optional()
    .default('20'),
  search: z.string().optional(),
  sorter: z.string().optional().default('createdAt'),
  direction: z.enum(['desc', 'asc']).optional().default('desc'),
});

export type CommonQueryParams = z.infer<typeof ZCommonQueries>;
