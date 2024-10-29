/**
 * source/routes/issues/new/+page.server.ts
 * ---
 *
 * URL  - /issues/new
 * TYPE - SERVER
 *
 * Defines the API call one can make from the client to create a new issue.
 */

import { fail, redirect } from '@sveltejs/kit'
import { sql, eq, asc, desc } from 'drizzle-orm'
import { encodeBase32LowerCaseNoPadding } from '@oslojs/encoding'
import * as auth from '$lib/server/auth'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	// Make sure the user is authenticated. If not, redirect them to the login page.
	if (!event.locals.user) {
		return redirect(302, '/login')
	}

	const committees = await db
		.select()
		.from(table.committee)
		.orderBy(asc(table.committee.name))

	return {
		user: event.locals.user,
		committees,
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
		const issue = {
			id: generateId(),
			title: formData.get('title'),
			body: formData.get('body'),
			committeeId: formData.get('committeeId'),
			author: event.locals.user.id,
		}
		console.log(issue)

		if (
			typeof issue.title != 'string' ||
			typeof issue.body != 'string' ||
			typeof issue.committeeId != 'string'
		) {
			return fail(400, 'Invalid title/body/committee')
		}

		// TODO: add check for committee ID validity, but try not to use another database call.

		console.log(await db.insert(table.issue).values(issue))
		return redirect(302, '/')
	},
}
