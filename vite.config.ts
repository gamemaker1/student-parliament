/**
 * vite.config.ts
 * ---
 *
 * The configuration for the Vite build tool.
 */

import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
	// Enables the use of sveltekit.
	plugins: [sveltekit()],

	// Since our code lives in the `source/` folder, not `src/`, we need to update
	// the resolution rules. We do this here instead of `tsconfig.json` since Svelte
	// works that way.
	resolve: {
		alias: {
			$lib: '/source/lib',
			$components: '/source/components',
		},
	},

	// Allow `vite` to serve all files in the `source/` folder.
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), 'source/'],
		},
	},
})
