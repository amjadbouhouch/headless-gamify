import { objectiveValidator } from '@headless-gamify/common';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validateCommonQuery } from '../validators/common.validator';
import { objectiveService } from 'src/services/objective.service';
import { middlewares } from 'src/middlewares';

const objectiveRoutes = new Hono();

objectiveRoutes.get('/', middlewares.verifyApiKey, validateCommonQuery, async (c) => {
  const company = c.get('company');
  const queries = await c.req.valid('query');
  const res = await objectiveService.list({
    company,
    ...queries,
  });
  return c.json(res);
});

objectiveRoutes.get('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  const res = await objectiveService.retrieve({ company, id });
  if (!res) {
    throw new HTTPException(404, { message: `User not found with id=${id}` });
  }
  return c.json(res);
});

objectiveRoutes.post('/', middlewares.verifyApiKey, zValidator('json', objectiveValidator.create), async (c) => {
  const payload = await c.req.valid('json');
  console.log(payload);
  const company = c.get('company');

  const createdItem = await objectiveService.create(payload, company);
  return c.json(createdItem);
});

objectiveRoutes.put('/:id', middlewares.verifyApiKey, zValidator('json', objectiveValidator.update), async (c) => {
  const payload = await c.req.valid('json');
  const id = c.req.param('id');
  const company = c.get('company');
  const createdItem = await objectiveService.update({ company, id, payload });
  return c.json(createdItem);
});

objectiveRoutes.delete('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  await objectiveService.remove({
    company,
    id,
  });
  return c.json({}, 200);
});
export { objectiveRoutes };
