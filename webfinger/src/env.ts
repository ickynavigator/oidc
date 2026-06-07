import z from 'zod';

const configSchema = z.object({
  DATABASE_URL: z.string(),
  ISSUER_DOMAIN: z.url(),
  PORT: z.coerce.number().default(3000),
});

export const config = configSchema.parse({
  DATABASE_URL: process.env.DATABASE_URL,
  ISSUER_DOMAIN: process.env.ISSUER_DOMAIN,
  PORT: process.env.PORT,
});
