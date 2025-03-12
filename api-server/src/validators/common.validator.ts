import { zValidator } from '@hono/zod-validator';
import { z } from 'zod';
import { createMiddleware } from 'hono/factory';
import { commonValidator } from '@headless-gamify/common';

//
export const validateCommonQuery = createMiddleware(zValidator('query', commonValidator.ZCommonQueries));
export type CommonQueryParams = z.infer<typeof commonValidator.ZCommonQueries>;
export type CommonQueryParamsOutput = z.output<typeof commonValidator.ZCommonQueries>;
