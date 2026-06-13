import { pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', (col) => ({
  email: col.varchar('email').notNull(),
  lowercase_email: col.varchar('lowercase_email').notNull(),
  user_id: col.text('user_id').notNull(),
  uuid: col.varchar('uuid').primaryKey(),
}));
