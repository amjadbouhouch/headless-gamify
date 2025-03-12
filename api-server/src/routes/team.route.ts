import { teamValidator } from '@headless-gamify/common';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { middlewares } from 'src/middlewares';
import { teamService } from 'src/services/team.service';
import { validateCommonQuery } from '../validators/common.validator';

const teamRoutes = new Hono();

teamRoutes.get('/', middlewares.verifyApiKey, validateCommonQuery, async (c) => {
  const company = c.get('company');
  const queries = await c.req.valid('query');
  const res = await teamService.list({
    company,
    ...queries,
  });
  return c.json(res);
});

teamRoutes.get('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  const res = await teamService.retrieve({ company, id });
  if (!res) {
    throw new HTTPException(404, { message: `Team not found with id=${id}` });
  }
  return c.json(res);
});

teamRoutes.post('/', middlewares.verifyApiKey, zValidator('json', teamValidator.create), async (c) => {
  const { members = [], ...rest } = await c.req.valid('json');
  const company = c.get('company');
  const createdItem = await teamService.create({
    ...rest,
    members: {
      connect: members.map((member: string) => ({ id: member })),
    },
    company: {
      connect: {
        id: company.id,
      },
    },
  });
  return c.json(createdItem);
});

teamRoutes.put('/:id', middlewares.verifyApiKey, zValidator('json', teamValidator.update), async (c) => {
  const { members, ...rest } = await c.req.valid('json');
  const id = c.req.param('id');
  const company = c.get('company');
  const createdItem = await teamService.update({
    company,
    id,
    payload: {
      ...rest,
      members: members
        ? {
            connect: members.map((member: string) => ({ id: member })),
          }
        : undefined,
    },
  });
  return c.json(createdItem);
});

teamRoutes.delete('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  await teamService.remove({
    company,
    id,
  });
  return c.json({}, 200);
});
export { teamRoutes };
