import { Hono } from 'hono';
import { cors } from 'hono/cors';
import { logger as honoLogger } from 'hono/logger';
import { requestId } from 'hono/request-id';
import wellKnownController from './controller/well-known';

const app = new Hono()
  .use('*', honoLogger())
  .use('*', cors({ allowMethods: ['GET'] }))
  .use('*', requestId())
  .get('/', (ctx) => ctx.json({ message: 'Hello, World!' }, 200))
  .route('/.well-known', wellKnownController);

export default app;
