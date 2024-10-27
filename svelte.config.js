import { mdsvex } from 'mdsvex';
import adapter from '@sveltejs/adapter-auto';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: [vitePreprocess(), mdsvex()],
	kit: {
		adapter: adapter(),
		files: {
			lib: 'source/lib',
			routes: 'source/routes',
			params: 'source/params',
			appTemplate: 'source/app.html',
			errorTemplate: 'source/error.html',
			hooks: {
				client: 'source/hooks.client',
				server: 'source/hooks.server',
				universal: 'source/hooks'
			}
		}
	},
	extensions: ['.svelte', '.svx']
};

export default config;
