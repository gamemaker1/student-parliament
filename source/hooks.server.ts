/**
 * source/hooks.server.ts
 * ---
 *
 * Each handler defined in this file runs everytime a request is received.
 */

import type { Handle } from '@sveltejs/kit'
import { dev } from '$app/environment'
import * as auth from '$lib/server/auth.js'

/**
 * Handles authentication for every request.
 */
const handleAuth: Handle = async ({ event, resolve }) => {
	// First, check if the request includes a session cookie.
	const sessionId = event.cookies.get(auth.SESSION_COOKIE)
	// If not, let the request continue as unauthenticated.
	if (!sessionId) {
		event.locals.user = null
		event.locals.session = null
		return resolve(event)
	}

	// If there is a session cookie, validate and renew it.
	const { session, user } = await auth.validateSession(sessionId)
	if (session) {
		event.cookies.set(auth.SESSION_COOKIE, session.id, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			expires: session.expiresAt,
			secure: !dev,
		})
	} else {
		// If it has expired, or is invalid, delete the cookie so it is not used again.
		event.cookies.delete(auth.SESSION_COOKIE, { path: '/' })
	}

	// Authenticate the request, and proceed.
	event.locals.user = user
	event.locals.session = session
	return resolve(event)
}

export const handle: Handle = handleAuth
