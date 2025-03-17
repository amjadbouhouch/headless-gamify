import { conditionValidator } from '@headless-gamify/common';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { middlewares } from 'src/middlewares';
import { conditionService } from 'src/services/condition.service';

const conditionRoutes = new Hono();

conditionRoutes.post('/', middlewares.verifyApiKey, zValidator('json', conditionValidator.create), async (c) => {
  const payload = await c.req.valid('json');
  const item = await conditionService.create({
    payload,
  });
  return c.json(item);
});

conditionRoutes.put('/:id', middlewares.verifyApiKey, zValidator('json', conditionValidator.update), async (c) => {
  const payload = await c.req.valid('json');
  const id = c.req.param('id');
  const item = await conditionService.update({
    id,
    payload,
  });
  return c.json(item);
});

conditionRoutes.delete('/:id', middlewares.verifyApiKey, async (c) => {
  const id = c.req.param('id');
  await conditionService.remove({
    id,
  });
  return c.json({}, 200);
});

export { conditionRoutes };
