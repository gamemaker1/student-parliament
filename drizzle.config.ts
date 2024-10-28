/**
 * drizzle.config.ts
 * ---
 *
 * Configuration for Drizzle, which is used to connect to the database.
 */

import { defineConfig } from 'drizzle-kit'
if (!process.env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

export default defineConfig({
	// The database schema, defined using drizzle methods.
	schema: './source/lib/server/db/schema.ts',

	// The database to connect to. Since we are using a simple file database, we don't
	// need to provide a username or password.
	dbCredentials: {
		url: process.env.DATABASE_URL,
	},

	verbose: true,
	strict: true,
	dialect: 'sqlite',
})
