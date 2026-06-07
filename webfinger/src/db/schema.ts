import { pgTable } from 'drizzle-orm/pg-core';

export const users = pgTable('users', (col) => ({
  email: col.text('email').notNull(),
  id: col.text('id').primaryKey(),
  username: col.text('username').notNull(),
}));
