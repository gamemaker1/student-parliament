import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig, searchForWorkspaceRoot } from 'vite'

export default defineConfig({
	plugins: [sveltekit()],
	resolve: {
		alias: {
			$lib: '/source/lib',
			$components: '/source/components',
		},
	},
	server: {
		fs: {
			allow: [searchForWorkspaceRoot(process.cwd()), 'source/'],
		},
	},
})
