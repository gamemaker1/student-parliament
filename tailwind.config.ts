/**
 * tailwind.config.ts
 * ---
 *
 * The configuration for Tailwind CSS.
 */

import forms from '@tailwindcss/forms'
import type { Config } from 'tailwindcss'
import flowbite from 'flowbite/plugin'

export default {
	content: [
		// Parse classes in the code we write.
		'./source/**/*.{html,js,svelte,ts}',
		// Also parse the flowbite component classes.
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}',
	],

	// Let the dark theme be controlled by the classes given to each element, so that
	// we can control it manually via the DarkMode component from `flowbite-svelte`.
	darkMode: 'class',

	// Override the primary colors, i.e., all the `bg-primary-*` classes.
	theme: {
		extend: {
			colors: {
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

	// Use the form and flowbite plugins.
	plugins: [flowbite, forms],
} as Config
