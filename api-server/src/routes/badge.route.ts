import { badgeValidator } from '@headless-gamify/common';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { middlewares } from 'src/middlewares';
import { badgeService } from 'src/services/badge.service';
import { validateCommonQuery } from '../validators/common.validator';

const badgeRoutes = new Hono();

badgeRoutes.get('/', middlewares.verifyApiKey, validateCommonQuery, async (c) => {
  const company = c.get('company');
  const queries = await c.req.valid('query');
  const res = await badgeService.list({
    company,
    ...queries,
  });
  return c.json(res);
});

badgeRoutes.get('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  const res = await badgeService.retrieve({ company, id });
  if (!res) {
    throw new HTTPException(404, { message: `Metric not found with id=${id}` });
  }
  return c.json(res);
});

badgeRoutes.post('/', middlewares.verifyApiKey, zValidator('json', badgeValidator.create), async (c) => {
  const payload = await c.req.valid('json');

  const company = c.get('company');

  const createdItem = await badgeService.create({
    ...payload,
    icon: null,
    conditions: {
      createMany: {
        data: payload.conditions ?? [],
        skipDuplicates: true,
      },
    },
    company: {
      connect: {
        id: company.id,
      },
    },
  });
  return c.json(createdItem);
});

//  TODO here
badgeRoutes.put('/:id', middlewares.verifyApiKey, zValidator('json', badgeValidator.update), async (c) => {
  const payload = await c.req.valid('json');
  const id = c.req.param('id');
  const company = c.get('company');
  const createdItem = await badgeService.update({ company, id, payload });
  return c.json(createdItem);
});

badgeRoutes.delete('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  await badgeService.remove({
    company,
    id,
  });
  return c.json({}, 200);
});

export { badgeRoutes };
