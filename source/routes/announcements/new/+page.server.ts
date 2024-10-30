/**
 * source/routes/announcements/new/+page.server.ts
 * ---
 *
 * URL  - /announcements/new
 * TYPE - SERVER
 *
 * Defines the API call one can make from the client to create a new announcement.
 */

import { fail, redirect } from '@sveltejs/kit'
import { sql, eq, asc, desc } from 'drizzle-orm'
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding'
import * as auth from '$lib/server/auth'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import type { Actions, PageServerLoad } from './$types'

const categories = ['general', 'meeting', 'event']

export const load: PageServerLoad = async (event) => {
	// Make sure the user is authenticated. If not, redirect them to the login page.
	if (!event.locals.user) {
		return redirect(302, '/login')
	}

	return {
		user: event.locals.user,
		categories,
	}
}

function generateId(): string {
	const bytes = crypto.getRandomValues(new Uint8Array(21))
	const id = encodeBase32LowerCaseNoPadding(bytes)
	return id
}

export const actions: Actions = {
	create: async (event) => {
		const formData = await event.request.formData()
		const announcement = {
			id: generateId(),
			title: formData.get('title'),
			content: formData.get('content'),
			category: formData.get('category'),
			author: event.locals.user.id,
		}

		if (
			typeof announcement.title != 'string' ||
			typeof announcement.content != 'string' ||
			typeof announcement.category != 'string' ||
			!categories.includes(announcement.category)
		) {
			return fail(400, 'Invalid title/content/category')
		}

		await db.insert(table.announcement).values(announcement)
		return redirect(302, '/')
	},
}
