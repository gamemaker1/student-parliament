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

import * as auth from '$lib/server/auth'
import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	if (!event.locals.user) {
		return redirect(302, '/login')
	}

	return {
		user: event.locals.user,
		announcements: [
			{
				id: 1,
				date: '2024-10-25',
				title: 'General Body Meeting',
				content:
					'Next GBM scheduled for November 1st at 5 PM in Vindhya Hall. Agenda includes discussion of new campus initiatives and committee updates.',
				category: 'Meeting',
			},
		],
		issues: [
			{
				id: 1,
				status: 'In Progress',
				title: 'Library Hours Extension',
				description: 'Working with administration to extend library hours during exams',
				votes: 45,
				modified: '2024-10-25',
			},
			{
				id: 2,
				status: 'Resolved',
				title: 'Cafeteria Menu',
				description: 'Successfully implemented new diverse menu options',
				votes: 32,
				modified: '2024-10-23',
			},
		],
		committees: [
			{
				name: 'Academics',
				members: [
					{ name: 'Priya Kumar', role: 'Secretary', contact: 'priya.k@students.iiit.ac.in' },
					{ name: 'Akash Singh', role: 'Member', contact: 'akash.s@students.iiit.ac.in' },
					{ name: 'Vaishnavi Shinde', role: 'Member', contact: 'vaishnavi.s@students.iiit.ac.in' },
				],
			},
			{
				name: 'Hostel',
				members: [
					{ name: 'Meera Patel', role: 'Secretary', contact: 'meera.p@students.iiit.ac.in' },
					{ name: 'Rahul Sharma', role: 'Member', contact: 'rahul.s@students.iiit.ac.in' },
				],
			},
		],
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
