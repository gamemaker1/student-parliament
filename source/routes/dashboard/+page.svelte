<!--
- source/routes/dashboard/+page.svelte
- ---
-
- URL  - /dashboard
- TYPE - CLIENT
-
- The frontend for the dashboard, which renders the data fetched from the server.
-->

<script lang="ts">
	import { Button, Alert, Accordion, AccordionItem } from 'flowbite-svelte'
	import { SearchOutline } from 'flowbite-svelte-icons'
	import { slide } from 'svelte/transition'

	import { enhance } from '$app/forms'
	import type { PageServerData } from './$types'

	let { data } = $props()
	let pages = ['announcements', 'issues', 'committees']
	let fragment = $state('announcements')
	let announcementFilter = $state('')
	let filteredAnnouncements = $derived(
		data.announcements.filter(({ title }) => title.includes(announcementFilter)),
	)
	let issueFilter = $state('')
	let filteredIssues = $derived(
		data.issues.filter(
			({ title, description, committee }) =>
				title.includes(issueFilter) ||
				description.includes(issueFilter) ||
				committee.name.includes(issueFilter),
		),
	)

	let issueColors = {
		pending: 'bg-red-100 text-red-800',
		acknowledged: 'bg-blue-100 text-blue-800',
		'in progress': 'bg-purple-100 text-purple-800',
		resolved: 'bg-green-100 text-green-800',
	}
</script>

{#snippet announcements()}
	<div transition:slide class="mx-12 pt-12">
		<div class="flex justify-between">
			<label for="search-box" class="sr-only">Search</label>
			<div class="relative min-w-[40%]">
				<div
					class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
				>
					<SearchOutline class="text-primary" />
				</div>
				<input
					type="text"
					id="search-box"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pb-2 ps-10 pt-3 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
					placeholder="Search announcements..."
					bind:value={announcementFilter}
					required
				/>
			</div>

			<Button color="yellow" onclick={() => (window.location.href = '/announcements/new')}
				>Create</Button
			>
		</div>

		<div class="mt-6 grid gap-6">
			{#each filteredAnnouncements as announcement}
				<div class="rounded-lg bg-white p-6 shadow">
					<div class="mb-2 flex items-start justify-between">
						<h2 class="text-xl font-semibold">{announcement.title}</h2>
						<span
							class="rounded-full bg-blue-100 px-3 py-1 text-sm capitalize text-blue-800"
						>
							{announcement.category}
						</span>
					</div>
					<p class="mb-4 text-gray-600">{announcement.content}</p>
					<p class="text-sm text-gray-500">
						Posted on {announcement.date.toLocaleString('en-IN')}
					</p>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet issues()}
	<div transition:slide class="mx-12 pt-12">
		<div class="flex justify-between">
			<label for="search-box" class="sr-only">Search</label>
			<div class="relative min-w-[40%]">
				<div
					class="pointer-events-none absolute inset-y-0 start-0 flex items-center ps-3"
				>
					<SearchOutline class="text-primary" />
				</div>
				<input
					type="text"
					id="search-box"
					class="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pb-2 ps-10 pt-3 text-sm text-gray-900 focus:border-primary-500 focus:ring-primary-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-primary-500 dark:focus:ring-primary-500"
					placeholder="Search issues..."
					bind:value={issueFilter}
					required
				/>
			</div>

			<Button color="yellow" onclick={() => (window.location.href = '/issues/new')}
				>Create</Button
			>
		</div>

		<div class="mt-6 grid gap-6">
			{#each filteredIssues as issue}
				<div class="rounded-lg bg-white p-6 shadow">
					<div class="mb-2 flex items-start justify-between">
						<div>
							<h2 class="text-xl font-semibold">
								{issue.title} &nbsp;
								<span
									class="rounded-full px-3 py-1 text-sm capitalize {issueColors[
										issue.status
									]}"
									style="font-family: 'Rubik'; font-weight: normal"
								>
									{issue.status}
								</span>
								<span
									class="rounded-full border border-gray-300 px-3 py-1 text-sm capitalize"
									style="font-family: 'Rubik'; font-weight: normal"
								>
									{issue.committee.name}
								</span>
							</h2>
						</div>

						<div>
							<span class="text-gray-700">{issue.votes} upvotes</span>
						</div>
					</div>
					<p class="mb-4 text-gray-600">{issue.description}</p>
					<p class="text-sm text-gray-500">
						Last updated on {issue.modified.toLocaleString('en-IN')}
					</p>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet committees()}
	<div transition:slide class="mx-12 pt-12">
		<Accordion multiple class="bg-white">
			{#each data.committees as committee}
				<AccordionItem>
					<span class="text-xl font-medium text-gray-900" slot="header">
						{committee.name}
					</span>
					<div class="border-t p-4">
						<div class="space-y-2">
							{#each committee.members as member}
								<div
									class="flex items-center justify-between rounded bg-gray-50 p-3 transition-colors hover:bg-gray-100"
								>
									<div>
										<p class="font-medium text-gray-900">{member.name}</p>
										<p class="text-sm capitalize text-gray-600">
											{member.role}
										</p>
									</div>
									<div class="text-sm text-gray-500">
										{#if member.email}
											<a
												href="mailto:{member.email}"
												class="text-purple-600 hover:underline"
											>
												Contact
											</a>
										{/if}
									</div>
								</div>
							{/each}
						</div>
					</div>
				</AccordionItem>
			{/each}
		</Accordion>
	</div>
{/snippet}

<nav class="sticky top-0 z-10 bg-white shadow">
	<div class="mx-auto">
		<div class="flex space-x-8 p-4">
			{#each pages as page}
				<button
					onclick={() => (fragment = page)}
					class="text-md rounded-md px-3 py-2 font-medium capitalize text-gray-700 transition-colors {fragment ===
					page
						? 'bg-primary-100'
						: 'hover:bg-gray-50'}"
				>
					{page}
				</button>
			{/each}
		</div>
	</div>
</nav>

{#if fragment == 'issues'}
	{@render issues()}
{:else if fragment == 'committees'}
	{@render committees()}
{:else}
	{@render announcements()}
{/if}
