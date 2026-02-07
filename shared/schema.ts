
import { pgTable, text, varchar, timestamp, uuid, real, primaryKey } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
    id: text('id').primaryKey(),
    username: varchar('username', { length: 255 }).notNull(),
    email: varchar('email', { length: 255 }).unique().notNull(),
    passwordHash: text('password_hash').notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const sessions = pgTable("session", {
	id: text("id").primaryKey(),
	userId: text("user_id")
		.notNull()
		.references(() => users.id),
	expiresAt: timestamp("expires_at", {
		withTimezone: true,
		mode: "date"
	}).notNull()
});

export const ads = pgTable('ads', {
    id: uuid('id').primaryKey().defaultRandom(),
    title: varchar('title', { length: 255 }).notNull(),
    description: text('description').notNull(),
    price: real('price').notNull(),
    category: varchar('category', { length: 255 }).notNull(),
    userId: text('user_id').references(() => users.id).notNull(),
    createdAt: timestamp('created_at').defaultNow().notNull(),
});

export const images = pgTable('images', {
    id: uuid('id').primaryKey().defaultRandom(),
    url: text('url').notNull(),
    adId: uuid('ad_id').references(() => ads.id).notNull(),
});
