import forms from '@tailwindcss/forms'
import type { Config } from 'tailwindcss'
import flowbite from 'flowbite/plugin'

export default {
	content: [
		'./source/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
	],
	darkMode: 'selector',
	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				primary: {
					// 50: '#FFF5F2',
					100: '#ffd666',
					// 200: '#FFE4DE',
					// 300: '#FFD5CC',
					400: '#ffb800',
					500: '#cd7f32',
					// 600: '#EF562F',
					// 700: '#EB4F27',
					// 800: '#CC4522',
					900: '#cc9200',
				},
			},
		},
	},
	plugins: [flowbite, forms],
} as Config
