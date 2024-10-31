<!--
- source/routes/issues/new/+page.svelte
- ---
-
- URL  - /issues/new
- TYPE - CLIENT
-
- This page lets the user create a new issue.
-->

<script lang="ts">
	import { Button, Label, Input, Select, Helper } from 'flowbite-svelte'
	import { AngleLeftOutline } from 'flowbite-svelte-icons'
	import InkMde from 'ink-mde/svelte'
	import * as dom from 'isomorphic-dompurify'

	import { enhance } from '$app/forms'
	import type { PageServerData, ActionData } from './$types'

	let title = $state('')
	let body = $state('')
	let committee = $state('')

	let { data, form } = $props()
	let committees = data.committees.map(({ id, name }) => {
		return { value: id, name }
	})

	let editorConfig = {
		interface: {
			appearance: 'light',
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

<nav class="sticky top-0 z-10 bg-white shadow">
	<div class="mx-auto">
		<div class="flex space-x-4 p-4">
			<div class="py-2">
				<AngleLeftOutline
					onclick={() => (window.location.href = '/dashboard')}
					class="text-primary-500"
				/>
			</div>
			<div class="text-md py-2 font-medium capitalize text-gray-700">
				<span>Create Issue</span>
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
				Committee
				<Select
					id="committee"
					name="committeeId"
					class="mt-2 font-normal"
					items={committees}
					bind:value={committee}
				/>
			</Label>
			{#if form?.error?.invalid?.committeeId}
				<Helper class="mt-2" color="red">
					<span>Please select a valid committee.</span>
				</Helper>
			{/if}
		</div>
	</div>

	<div class="mb-6 grid grid-cols-1 gap-6 md:grid-cols-2">
		<InkMde bind:value={body} options={editorConfig} />
		{#if form?.error?.invalid?.body}
			<Helper class="mt-2" color="red">
				<span>Please enter valid content.</span>
			</Helper>
		{/if}
	</div>

	<div class="mb-6">
		<Button color="yellow" class="right-0" type="submit">Create</Button>
	</div>

	<input class="hidden" name="body" value={body} />
</form>
