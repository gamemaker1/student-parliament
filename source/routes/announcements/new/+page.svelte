<!--
- source/routes/announcements/new/+page.svelte
- ---
-
- URL  - /announcements/new
- TYPE - CLIENT
-
- This page lets the user create a new announcement.
-->

<script lang="ts">
	import { Button, Label, Input, Select, Helper } from 'flowbite-svelte'
	import { AngleLeftOutline } from 'flowbite-svelte-icons'
	import InkMde from 'ink-mde/svelte'
	import * as dom from 'isomorphic-dompurify'

	import { enhance } from '$app/forms'
	import type { PageServerData, ActionData } from './$types'

	let title = $state('')
	let content = $state('')
	let category = $state('')

	let { data, form } = $props()
	let categories = data.categories.map((name) => {
		return { value: name, name: name[0].toUpperCase() + name.slice(1) }
	})
	let darkMode = false
	$effect(() => {
		darkMode = document.documentElement.className.includes('dark')
	})

	let editorConfig = {
		interface: {
			appearance: darkMode ? 'dark' : 'light',
			attribution: false,
			autocomplete: false,
			images: true,
			lists: true,
			readonly: false,
			spellcheck: true,
			toolbar: true,
		},
		toolbar: {
			bold: true,
			code: true,
			codeBlock: true,
			heading: true,
			image: true,
			italic: true,
			link: true,
			list: true,
			orderedList: true,
			quote: true,
			taskList: true,
			upload: false,
		},
	}
</script>

<nav class="sticky top-0 z-10 bg-white shadow dark:bg-gray-700">
	<div class="mx-auto">
		<div class="flex space-x-4 p-4">
			<div class="py-2">
				<AngleLeftOutline
					onclick={() => (window.location.href = '/dashboard')}
					class="text-primary-500"
				/>
			</div>
			<div class="text-md py-2 font-medium capitalize text-gray-700 dark:text-gray-50">
				<span>Create Announcement</span>
			</div>
		</div>
	</div>
</nav>

<form class="mx-12 pt-12" method="post" action="?/create" use:enhance>
	<div class="grid grid-cols-2 gap-6 md:grid-cols-4">
		<div class="mb-6">
			<Label for="title" class="mb-2 block">Title</Label>
			<Input id="title" name="title" class="w-full" placeholder="Title" />
			{#if form?.error?.invalid?.title}
				<Helper class="mt-2" color="red">
					<span>Please enter a valid title.</span>
				</Helper>
			{/if}
		</div>
		<div class="mb-6">
			<Label>
				Category
				<Select
					id="category"
					name="category"
					class="mt-2 font-normal"
					items={categories}
					bind:value={category}
				/>
			</Label>
			{#if form?.error?.invalid?.category}
				<Helper class="mt-2" color="red">
					<span>Please select a valid category.</span>
				</Helper>
			{/if}
		</div>
	</div>

	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
		<InkMde bind:value={content} options={editorConfig} />
		{#if form?.error?.invalid?.content}
			<Helper class="mt-2" color="red">
				<span>Please enter valid content.</span>
			</Helper>
		{/if}
	</div>

	<div class="mb-6">
		<Button color="yellow" class="right-0" type="submit">Create</Button>
	</div>

	<input class="hidden" name="content" value={content} />
</form>
