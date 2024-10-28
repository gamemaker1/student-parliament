/**
 * source/routes/dashboard/+page.server.ts
 * ---
 *
 * URL  - /dashboard
 * TYPE - SERVER
 *
 * Loads the data to display on the dashboard, and defines the API calls one can make from
 * the client.
 */

import { fail, redirect } from '@sveltejs/kit'
import { sql, eq, asc, desc } from 'drizzle-orm'
import * as auth from '$lib/server/auth'
import { db } from '$lib/server/db'
import * as table from '$lib/server/db/schema'
import type { Actions, PageServerLoad } from './$types'

const issueQuery = {
	...table.issue,
	committee: table.committee,
}

const committeeQuery = {
	id: table.committee.id,
	name: table.committee.name,
	members: sql`
	  json_group_array(
	    json_object(
	      'id', ${table.user.id},
	      'name', ${table.user.name},
	      'email', ${table.user.email},
	      'role', ${table.userCommittee.role}
	    )
	  )
	  FILTER (WHERE ${table.user.id} IS NOT NULL)
  `.mapWith(JSON.parse),
}

export const load: PageServerLoad = async (event) => {
	// Make sure the user is authenticated. If not, redirect them to the login page.
	if (!event.locals.user) {
		return redirect(302, '/login')
	}

	// Load the announcements, issues and committees stored in the database.
	const [announcements, issues, committees] = await Promise.all([
		db.select().from(table.announcement).orderBy(desc(table.announcement.date)).limit(20),
		db
			.select(issueQuery)
			.from(table.issue)
			.innerJoin(table.committee, eq(table.issue.committeeId, table.committee.id))
			.orderBy(desc(table.issue.modified))
			.limit(20),
		db
			.select(committeeQuery)
			.from(table.committee)
			.leftJoin(
				table.userCommittee,
				sql`${table.userCommittee.committeeId} = ${table.committee.id}`,
			)
			.leftJoin(table.user, sql`${table.userCommittee.userId} = ${table.user.id}`)
			.groupBy(table.committee.id)
			.orderBy(asc(table.committee.name)),
	])

	return {
		user: event.locals.user,
		announcements,
		issues,
		committees,
	}
}

export const actions: Actions = {
	logout: async (event) => {
		if (!event.locals.session) {
			return fail(401)
		}
		await auth.invalidateSession(event.locals.session.id)
		event.cookies.delete(auth.SESSION_COOKIE, { path: '/' })
		return redirect(302, '/login')
	},
}
