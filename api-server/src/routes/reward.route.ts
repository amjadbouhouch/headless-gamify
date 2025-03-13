import { rewardValidator } from '@headless-gamify/common';
import { zValidator } from '@hono/zod-validator';
import { Hono } from 'hono';
import { HTTPException } from 'hono/http-exception';
import { middlewares } from 'src/middlewares';
import { rewardService } from 'src/services/reward.service';
import { validateCommonQuery } from '../validators/common.validator';
import { assertHelper } from 'src/utils/assert.helper';

const rewardRoutes = new Hono();

rewardRoutes.get('/', middlewares.verifyApiKey, validateCommonQuery, async (c) => {
  const company = c.get('company');
  const queries = await c.req.valid('query');
  const res = await rewardService.list({
    company,
    ...queries,
  });
  return c.json(res);
});

rewardRoutes.get('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  const res = await rewardService.retrieve({ company, id });
  assertHelper.assertNotFound(res, `Reward not found with id=${id}`);

  return c.json(res);
});

rewardRoutes.post('/', middlewares.verifyApiKey, zValidator('json', rewardValidator.create), async (c) => {
  const payload = await c.req.valid('json');
  const company = c.get('company');
  const createdItem = await rewardService.create({
    ...payload,
    company: {
      connect: {
        id: company.id,
      },
    },
  });
  return c.json(createdItem);
});

rewardRoutes.put('/:id', middlewares.verifyApiKey, zValidator('json', rewardValidator.update), async (c) => {
  const payload = await c.req.valid('json');
  const id = c.req.param('id');
  const company = c.get('company');
  const updatedItem = await rewardService.update({ company, id, payload });
  return c.json(updatedItem);
});

rewardRoutes.delete('/:id', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const id = c.req.param('id');
  await rewardService.remove({
    company,
    id,
  });
  return c.json({}, 200);
});

// Endpoint for users to claim rewards
rewardRoutes.post('/:rewardId/users/:userId/claim', middlewares.verifyApiKey, async (c) => {
  const company = c.get('company');
  const userId = c.req.param('userId');
  const rewardId = c.req.param('rewardId');

  const claimedReward = await rewardService.claimReward({
    company,
    userId,
    rewardId,
  });

  return c.json(claimedReward);
});

export { rewardRoutes };
