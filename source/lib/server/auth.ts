/**
 * source/lib/server/auth.ts
 * ---
 *
 * Exports functions used to handle user sessions.
 */

import { eq } from 'drizzle-orm'
import { sha256 } from '@oslojs/crypto/sha2'
import { encodeBase32LowerCaseNoPadding, encodeHexLowerCase } from '@oslojs/encoding'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'

const DAY_IN_MS = 1000 * 60 * 60 * 24
export const SESSION_COOKIE = 'auth-session'

/**
 * Generates a new session token randomly, and securely.
 *
 * @private
 */
function generateSessionToken(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(21))
	const token = encodeBase32LowerCaseNoPadding(bytes)
	return token
}

/**
 * Creates a session for the given user in the database, and returns the created session.
 */
export async function createSession(userId: string): Promise {
	const token = generateSessionToken()
	const sessionId = encodeHexLowerCase(sha256(new TextEncoder().encode(token)))
	const session: table.Session = {
		id: sessionId,
		userId,
		expiresAt: new Date(Date.now() + DAY_IN_MS * 30),
	}
	await db.insert(table.session).values(session)
	return session
}

/**
 * Invalidates the given session by deleting it from the database.
 */
export async function invalidateSession(sessionId: string): Promise {
	await db.delete(table.session).where(eq(table.session.id, sessionId))
}

/**
 * Validates the given session, and returns both the session and the corresponding user
 * from the database.
 */
export async function validateSession(sessionId: string): Promise {
	// Fetch the session from the database using its ID, along with the corresponding user.
	const [result] = await db
		.select({
			user: table.user,
			session: table.session,
		})
		.from(table.session)
		.innerJoin(table.user, eq(table.session.userId, table.user.id))
		.where(eq(table.session.id, sessionId))

	// If no such session exists, return null.
	if (!result) return { session: null, user: null }
	const { session, user } = result

	// If the session has expired, invalidate it and return null.
	const sessionExpired = Date.now() >= session.expiresAt.getTime()
	if (sessionExpired) {
		await invalidateSession(sessionId)
		return { session: null, user: null }
	}

	// If the session is due to expire in less than 15 days, renew it and set its expiry to
	// 30 days from now onwards. This essentially limits the validity of a sign in to 30 days
	// from the day it was last used.
	const renewSession = Date.now() >= session.expiresAt.getTime() - DAY_IN_MS * 15
	if (renewSession) {
		session.expiresAt = new Date(Date.now() + DAY_IN_MS * 30)
		await db
			.update(table.session)
			.set({ expiresAt: session.expiresAt })
			.where(eq(table.session.id, session.id))
	}

	return { session, user }
}

export type SessionValidationResult = Awaited
