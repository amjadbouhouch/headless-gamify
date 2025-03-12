import { serve } from '@hono/node-server';
import 'dotenv/config';
import { config } from './config';
import { createServer } from './server';
async function bootstrap() {
  if (!config.ENV.DATABASE_URL) {
    throw new Error('Missing DATABASE_URL');
  }
  const app = createServer();

  const runningServer = serve({ ...app, port: config.ENV.port, hostname: '0.0.0.0' }, async (info) => {
    console.log(`Listening on http://localhost:${info.port}`);
  });

  process.on('SIGTERM', async () => {
    runningServer.close();
  });
}

bootstrap();
