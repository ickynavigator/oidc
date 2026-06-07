import { config } from '../env';
import { drizzle } from 'drizzle-orm/postgres-js';

export const db = drizzle({
  connection: {
    url: config.DATABASE_URL,
  },
});
