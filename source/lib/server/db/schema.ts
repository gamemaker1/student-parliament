/**
 * source/lib/server/db/schema.ts
 * ---
 *
 * Defines and exports the database schema as a Drizzle Table, and a Typescript type.
 */

import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	role: text('role', { enum: ['root', 'gensec', 'speaker', 'secretary', 'member', 'student'] })
		.notNull()
		.default('student'),
})

export const session = sqliteTable('session', {
	id: text('id').primaryKey(),
	userId: text('user_id')
		.notNull()
		.references(() => user.id),
	expiresAt: integer('expires_at', { mode: 'timestamp' }).notNull(),
})

export type Session = typeof session.$inferSelect
export type User = typeof user.$inferSelect