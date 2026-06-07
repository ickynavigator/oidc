import { Hono } from 'hono';
import { sValidator } from '@hono/standard-validator';
import { LOOKUP_CONSTANTS, WebFinger } from '../webfinger';
import { UnreachableCaseError } from '../lib';
import z from 'zod';
import { rateLimiter } from 'hono-rate-limiter';

const webfinger = new WebFinger();

const app = new Hono()
  .use(rateLimiter({  keyGenerator: ({ req }) => req.header('x-forwarded-for') ?? '',limit: 1000 }))
  .get('/webfinger', sValidator('query', z.object({ resource: z.string().optional() })), async (ctx) => {
    const { resource } = ctx.req.valid('query');

    if (!resource) {
      return ctx.json({ error: "Missing required 'resource' query parameter" }, 400);
    }

    const result = await webfinger.lookup(resource);

    if (typeof result === 'string') {
      switch (result) {
        case LOOKUP_CONSTANTS.NOT_FOUND: {
          return ctx.json({ error: 'not_found' }, 404);
        }
        case LOOKUP_CONSTANTS.UNSUPPORTED_RESOURCE_TYPE: {
          return ctx.json({ error: 'unsupported_resource_type' }, 400);
        }
        case LOOKUP_CONSTANTS.NO_SUBJECT: {
          return ctx.json({ error: 'no_subject' }, 400);
        }
        default: {
          throw new UnreachableCaseError(result);
        }
      }
    }

    ctx.header('Cache-Control', 'public, max-age=60');
    return ctx.body(JSON.stringify(result), 200, {
      'Content-Type': 'application/jrd+json',
    });
  });

export default app;
