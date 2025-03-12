import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { metricValidator } from '@headless-gamify/common';
import { validateCommonQuery } from '../validators/common.validator';
import { HTTPException } from 'hono/http-exception';
import { metricService } from 'src/services/metric.service';
import { middlewares } from 'src/middlewares';

const metricRoutes = new Hono();

metricRoutes.get('/', middlewares.verifyApiKey, validateCommonQuery, async (c) => {
  const company = c.get('company');
  const queries = await c.req.valid('query');
  const res = await metricService.list({
    company,
    ...queries,
  });
  return c.json(res);
});

metricRoutes.get('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  const res = await metricService.retrieve({ company, id });
  if (!res) {
    throw new HTTPException(404, { message: `Metric not found with id=${id}` });
  }
  return c.json(res);
});

metricRoutes.post('/', middlewares.verifyApiKey, zValidator('json', metricValidator.create), async (c) => {
  const payload = await c.req.valid('json');
  const company = c.get('company');
  const createdItem = await metricService.create({
    ...payload,
    company: {
      connect: {
        id: company.id,
      },
    },
  });
  return c.json(createdItem);
});

metricRoutes.put('/:id', middlewares.verifyApiKey, zValidator('json', metricValidator.update), async (c) => {
  const payload = await c.req.valid('json');
  const id = c.req.param('id');
  const company = c.get('company');
  const createdItem = await metricService.update({ company, id, payload });
  return c.json(createdItem);
});

metricRoutes.delete('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  await metricService.remove({
    company,
    id,
  });
  return c.json({}, 200);
});

export { metricRoutes };
