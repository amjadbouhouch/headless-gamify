import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger } from 'hono/logger';
import { requestId } from 'hono/request-id';
import { userRoutes } from './routes/user.route';
import { HTTPException } from 'hono/http-exception';
import { commonHelper } from './utils';
import { metricRoutes } from './routes/metric.route';
import { teamRoutes } from './routes/team.route';
import { objectiveRoutes } from './routes/objective.route';
import { badgeRoutes } from './routes/badge.route';
import { conditionRoutes } from './routes/condition.route';

export function createServer() {
  const app = new Hono();

  // MIDDLEWARE
  app.use('*', logger());
  app.use('*', cors());
  app.use('*', requestId());
  // END MIDDLEWARE

  // START ROUTES
  app.route('/users', userRoutes);
  app.route('/metrics', metricRoutes);
  app.route('/teams', teamRoutes);
  app.route('/objectives', objectiveRoutes);
  app.route('/badges', badgeRoutes);
  app.route('/conditions', conditionRoutes);
  // END ROUTES

  // Not found handler
  app.notFound((c) =>
    c.json(
      {
        message: 'Not Found',
      },
      404
    )
  );

  // Error handling middleware
  app.onError((err: any, c) => {
    if (err instanceof HTTPException) {
      return c.json(
        {
          message: err.message,
        },
        err.status
      );
    }
    if (commonHelper.isPrismaValidationError(err)) {
      console.log(err);
      return c.json(
        {
          message: err.message,
        },
        400
      );
    }
    if (commonHelper.isPrismaConstraintError(err)) {
      // console.log(err);
      const payload = {
        message: `something is duplicated, please see the reason property`,
        reason: err?.meta,
      };
      console.error(payload);
      return c.json(payload, 409);
    }
    if (commonHelper.isPrismaKnownRequestError(err)) {
      const payload = {
        message: `Some data not validate please review you're data`,
        reason: err?.meta,
        code: err.code,
      };
      console.error(payload);
      return c.json(payload, 400);
    }
    console.error('Uncaught error:', err);
    if (err?.code === 11000) {
      // duplicated mongo key
      const payload = {
        message: `Duplicated key`,
        keyValue: err.keyValue,
      };
      console.error(payload);
      return c.json(payload, 400);
    }
    return c.json(
      {
        message: 'Internal Server Error',
        error: err?.message,
      },
      500
    );
  });

  return app;
}
