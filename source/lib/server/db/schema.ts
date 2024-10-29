/**
 * source/lib/server/db/schema.ts
 * ---
 *
 * Defines and exports the database schema as a Drizzle Table, and a Typescript type.
 */

import { sql } from 'drizzle-orm'
import { sqliteTable, uniqueIndex, text, integer } from 'drizzle-orm/sqlite-core'

export const committee = sqliteTable('committee', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
})

export const user = sqliteTable('user', {
	id: text('id').primaryKey(),
	name: text('name').notNull(),
	email: text('email').notNull().unique(),
	role: text('role', {
		enum: ['root', 'gensec', 'speaker', 'member', 'student'],
	})
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

export const announcement = sqliteTable('announcement', {
	id: text('id').primaryKey(),
	author: text('author')
		.notNull()
		.references(() => user.id),
	date: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	title: text('title').notNull(),
	content: text('content').notNull(),
	category: text('category', { enum: ['general', 'meeting', 'event'] })
		.notNull()
		.default('general'),
})

export const issue = sqliteTable('issue', {
	id: text('id').primaryKey(),
	author: text('author')
		.notNull()
		.references(() => user.id),
	created: integer('created_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	modified: integer('modified_at', { mode: 'timestamp' })
		.notNull()
		.default(sql`(unixepoch())`),
	title: text('title').notNull(),
	body: text('body').notNull(),
	status: text('status', { enum: ['pending', 'acknowledged', 'in progress', 'resolved'] })
		.notNull()
		.default('pending'),
	votes: integer('votes').notNull().default(0),
	committeeId: text('committee_id')
		.notNull()
		.references(() => committee.id),
})

export const userCommittee = sqliteTable(
	'user_committee',
	{
		userId: text('user_id')
			.notNull()
			.references(() => user.id),
		committeeId: text('committee_id')
			.notNull()
			.references(() => committee.id),
		role: text('role', { enum: ['secretary', 'member'] })
			.notNull()
			.default('member'),
	},
	(table) => ({
		uniqueUserCommittee: uniqueIndex('unique_user_committee').on(
			table.userId,
			table.committeeId,
		),
	}),
)

export type Session = typeof session.$inferSelect
export type User = typeof user.$inferSelect
export type Announcement = typeof announcement.$inferSelect
export type Issue = typeof issue.$inferSelect
export type Committee = typeof committee.$inferSelect
