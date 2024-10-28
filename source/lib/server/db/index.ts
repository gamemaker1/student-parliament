/**
 * source/lib/server/db/index.ts
 * ---
 *
 * Define and export the database client used by the server.
 */

import { drizzle } from 'drizzle-orm/libsql'
import { createClient } from '@libsql/client'
import { env } from '$env/dynamic/private'

// Make sure we have a database to connect to.
if (!env.DATABASE_URL) throw new Error('DATABASE_URL is not set')

// If we do, create and export a drizzle client.
const client = createClient({ url: env.DATABASE_URL })
export const db = drizzle(client)
