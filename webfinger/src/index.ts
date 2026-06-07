import { serve } from '@hono/node-server';
import app from './app';
import { config } from './env';

const server = serve({
  fetch: app.fetch,
  port: config.PORT,
});

// oxlint-disable-next-line no-console
console.log(`
Server ready
`);

process
  .on('SIGINT', () => {
    server.close();
    process.exit(0);
  })
  .on('SIGTERM', () => {
    server.close((err) => {
      if (err) {
        // oxlint-disable-next-line no-console
        console.error(err);
        process.exit(1);
      }
      process.exit(0);
    });
  });
