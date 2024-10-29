<!--
- source/routes/+layout.svelte
- ---
-
- URL  - /
- TYPE - LAYOUT
-
- This layout file contains a UI skeleton that is applied to all pages.
-->

<script lang="ts">
	import '../app.css'
	import { DarkMode } from 'flowbite-svelte'

	let { children } = $props()
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
	<link
		href="https://fonts.googleapis.com/css2?family=Rubik:ital,wght@0,300..900;1,300..900&family=Zilla+Slab:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600;1,700&display=swap"
		rel="stylesheet"
	/>
</svelte:head>

<div class="mx-auto flex h-screen flex-col justify-between bg-gray-50">
	<header class="bg-primary-400 p-4">
		<div class="mx-auto">
			<div class="flex items-center justify-between">
				<div class="flex items-center space-x-2">
					<img alt="Student Parliament Logo" src="/favicon.ico" />
					<h1 class="text-2xl font-bold">IIITH Student Parliament</h1>
				</div>
				<DarkMode class="text-primary-900 dark:text-primary-900" />
			</div>
		</div>
	</header>

	<main class="mb-auto">
		{@render children()}
	</main>

	<footer class="mt-12 bg-gray-800 text-white">
		<div class="mx-auto max-w-7xl px-4 py-8">
			<div class="mt-8 border-t border-gray-700 pt-8">
				<p class="text-center text-gray-400">
					&copy; {new Date().getFullYear()} IIITH Student Parliament. All rights reserved.
				</p>
				<h3 class="mb-4 text-center text-lg font-semibold">
					parliament@students.iiit.ac.in
				</h3>
			</div>
		</div>
	</footer>
</div>
