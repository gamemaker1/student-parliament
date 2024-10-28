/**
 * source/routes/+page.server.ts
 * ---
 *
 * URL  - /
 * TYPE - SERVER
 *
 * Redirects the user to the dashboard.
 */

import { redirect } from '@sveltejs/kit'

export function load() {
	return redirect(302, '/dashboard')
}

export const prerender = true
