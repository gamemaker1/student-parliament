import { generateRandomString } from '@oslojs/crypto/random';
import { fail, redirect } from '@sveltejs/kit';
import { eq } from 'drizzle-orm';
import { dev } from '$app/environment';
import * as auth from '$lib/server/auth';
import { db } from '$lib/server/db';
import * as table from '$lib/server/db/schema';
import type { Actions, PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	if (event.locals.user) {
		return redirect(302, '/');
	}
	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const formData = await event.request.formData();
		const email = formData.get('email');

		if (!validateEmail(email)) {
			return fail(400, { message: 'Invalid email' });
		}

		const results = await db.select().from(table.user).where(eq(table.user.email, email));

		const existingUser = results.at(0);
		if (!existingUser) {
			return fail(400, { message: 'Incorrect username or password' });
		}

		const session = await auth.createSession(existingUser.id);
		event.cookies.set(auth.sessionCookieName, session.id, {
			path: '/',
			sameSite: 'lax',
			httpOnly: true,
			expires: session.expiresAt,
			secure: !dev
		});

		return redirect(302, '/');
	},
	register: async (event) => {
		const formData = await event.request.formData();
		const name = formData.get('name');
		const email = formData.get('email');

		if (!validateName(name)) {
			return fail(400, { message: 'Invalid username' });
		}
		if (!validateEmail(email)) {
			return fail(400, { message: 'Invalid password' });
		}

		const userId = generateUserId();

		try {
			await db.insert(table.user).values({ id: userId, name, email });

			const session = await auth.createSession(userId);
			event.cookies.set(auth.sessionCookieName, session.id, {
				path: '/',
				sameSite: 'lax',
				httpOnly: true,
				expires: session.expiresAt,
				secure: !dev
			});
		} catch (e) {
			return fail(500, { message: 'An error has occurred' });
		}
		return redirect(302, '/');
	}
};

const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
function generateUserId(length = 21): string {
	return generateRandomString({ read: (bytes) => crypto.getRandomValues(bytes) }, alphabet, length);
}

function validateName(name: unknown): name is string {
	return (
		typeof name === 'string' && name.length >= 3 && name.length <= 31 && /^[a-z0-9_-]+$/.test(name)
	);
}

function validateEmail(email: unknown): email is string {
	return typeof email === 'string' && /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email);
}
