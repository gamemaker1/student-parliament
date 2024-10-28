/**
 * svelte.config.js
 * ---
 *
 * The configuration for the Svelte framework.
 */

import { mdsvex } from 'mdsvex'
import adapter from '@sveltejs/adapter-node'
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte'

/** @type {import('@sveltejs/kit').Config} */
const config = {
	// Use vite to process svelte files, and mdsvex to parse svx files.
	preprocess: [vitePreprocess(), mdsvex()],

	kit: {
		// The node adapter tells sveltekit to build a node server from the code that we write.
		adapter: adapter(),

		// Since we renamed `src/` to `source/`, tell sveltekit where to find our code.
		files: {
			lib: 'source/lib',
			routes: 'source/routes',
			params: 'source/params',
			appTemplate: 'source/app.html',
			errorTemplate: 'source/error.html',
			hooks: {
				client: 'source/hooks.client',
				server: 'source/hooks.server',
				universal: 'source/hooks',
			},
		},
	},

	// Tell sveltekit to process `.svx` files as `.svelte` files too.
	extensions: ['.svelte', '.svx'],
}

export default config
