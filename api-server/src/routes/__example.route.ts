import { userValidator } from '@headless-gamify/common';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { validateCommonQuery } from '../validators/common.validator';
import { userService } from 'src/services/user.service';
import { middlewares } from 'src/middlewares';

const userRoutes = new Hono();

userRoutes.get('/', middlewares.verifyApiKey, validateCommonQuery, async (c) => {
  const company = c.get('company');
  const queries = await c.req.valid('query');
  const res = await userService.list({
    company,
    ...queries,
  });
  return c.json(res);
});

userRoutes.get('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  const res = await userService.retrieve({ company, id });
  if (!res) {
    throw new HTTPException(404, { message: `User not found with id=${id}` });
  }
  return c.json(res);
});

userRoutes.post('/', middlewares.verifyApiKey, zValidator('json', userValidator.create), async (c) => {
  const payload = await c.req.valid('json');
  const company = c.get('company');
  const createdItem = await userService.create({
    ...payload,
    company: {
      connect: {
        id: company.id,
      },
    },
  });
  return c.json(createdItem);
});

userRoutes.put('/:id', middlewares.verifyApiKey, zValidator('json', userValidator.update), async (c) => {
  const payload = await c.req.valid('json');
  const id = c.req.param('id');
  const company = c.get('company');
  const createdItem = await userService.update({ company, id, payload });
  return c.json(createdItem);
});

userRoutes.delete('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  await userService.remove({
    company,
    id,
  });
  return c.json({}, 200);
});
export { userRoutes };
