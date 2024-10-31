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
	import { Alert, Accordion, AccordionItem, Button, Helper, Input } from 'flowbite-svelte'
	import { SearchOutline } from 'flowbite-svelte-icons'
	import { slide } from 'svelte/transition'

	import { enhance } from '$app/forms'
	import type { PageServerData } from './$types'

	let { data } = $props()
	let pages = ['announcements', 'issues', 'committees']
	let initialState = {
		fragment:
			typeof localStorage != 'undefined'
				? localStorage.getItem('fragment') ?? 'announcements'
				: 'announcements',
	}

	let fragment = $state(initialState.fragment)
	let announcementFilter = $state('')
	let filteredAnnouncements = $derived(
		data.announcements.filter(
			({ title, category }) =>
				title.toLowerCase().includes(announcementFilter.toLowerCase()) ||
				category.toLowerCase().includes(announcementFilter.toLowerCase()),
		),
	)
	let issueFilter = $state('')
	let filteredIssues = $derived(
		data.issues.filter(
			({ title, committee, status }) =>
				title.toLowerCase().includes(issueFilter.toLowerCase()) ||
				committee.name.toLowerCase().includes(issueFilter.toLowerCase()) ||
				status.toLowerCase().includes(issueFilter.toLowerCase()),
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
	<div transition:slide class="mx-6 pt-12 md:mx-12">
		<div class="flex justify-between">
			<div class="flex w-full flex-col">
				<Input
					id="search"
					bind:value={announcementFilter}
					placeholder="Search announcements..."
				>
					<SearchOutline slot="left" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
				</Input>
				<Helper class="mt-2 text-gray-700">
					<span>
						{filteredAnnouncements.length} announcement{filteredAnnouncements.length == 1
							? ''
							: 's'}
					</span>
				</Helper>
			</div>

			<div>
				<Button
					color="yellow"
					class="ms-4"
					onclick={() => (window.location.href = '/announcements/new')}>Create</Button
				>
			</div>
		</div>

		<div class="mt-6 grid gap-6 px-2">
			{#each filteredAnnouncements as announcement}
				<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-700">
					<div class="mb-2 flex items-start justify-between">
						<h2 class="text-xl font-semibold text-gray-800 dark:text-gray-50">
							{announcement.title}
						</h2>
						<span
							class="rounded-full bg-blue-100 px-3 py-1 text-sm capitalize text-blue-800"
						>
							{announcement.category}
						</span>
					</div>
					<p class="text-sm text-gray-500 dark:text-gray-400">
						Posted on {announcement.date.toLocaleString('en-IN')}
					</p>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet issues()}
	<div transition:slide class="mx-6 pt-12 md:mx-12">
		<div class="flex justify-between">
			<div class="flex w-full flex-col">
				<Input id="search" bind:value={issueFilter} placeholder="Search issues...">
					<SearchOutline slot="left" class="h-5 w-5 text-gray-500 dark:text-gray-400" />
				</Input>
				<Helper class="mt-2 text-gray-700">
					<span>
						{filteredIssues.length} issue{filteredIssues.length == 1 ? '' : 's'}
					</span>
				</Helper>
			</div>

			<div>
				<Button
					color="yellow"
					class="ms-4"
					onclick={() => (window.location.href = '/issues/new')}>Create</Button
				>
			</div>
		</div>

		<div class="mt-6 grid gap-6 px-2">
			{#each filteredIssues as issue}
				<div class="rounded-lg bg-white p-6 shadow dark:bg-gray-700">
					<div class="flex items-start justify-between justify-items-end">
						<h2 class="mb-2 text-xl font-semibold text-gray-800 dark:text-gray-50">
							{issue.title}
						</h2>

						<div>
							<span
								class="truncate rounded-full px-3 py-1 text-sm capitalize {issueColors[
									issue.status
								]}"
							>
								{issue.status}
							</span>
							<span
								class="truncate rounded-full border border-gray-300 px-3 py-1 text-sm capitalize dark:text-white"
							>
								{issue.committee.name}
							</span>
							<span
								class="hidden truncate rounded-full border border-primary-100 px-3 py-1 text-sm dark:text-white md:inline"
							>
								{issue.votes} votes
							</span>
						</div>
					</div>
					<p class="py-1 text-sm text-gray-500 dark:text-gray-400">
						Last updated on {issue.modified.toLocaleString('en-IN')}
					</p>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet committees()}
	<div transition:slide class="pt-12">
		<Accordion multiple class="mx-6  md:mx-12">
			{#each data.committees as committee}
				<AccordionItem>
					<span class="text-xl font-medium text-gray-900 dark:text-gray-50" slot="header">
						{committee.name}
					</span>
					<div class="p-4">
						<div class="space-y-2">
							{#each committee.members as member}
								<div
									class="flex items-center justify-between rounded bg-gray-100 p-3 transition-colors hover:bg-gray-200 dark:bg-gray-700 dark:text-gray-50 dark:hover:bg-gray-600"
								>
									<div>
										<p class="font-medium text-gray-900 dark:text-gray-50">
											{member.name}
										</p>
										<p class="text-sm capitalize text-gray-600 dark:text-gray-200">
											{member.role}
										</p>
									</div>
									<div class="text-sm text-gray-500 dark:text-gray-400">
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

<nav class="sticky top-0 z-10 bg-white shadow dark:bg-gray-700">
	<div class="mx-auto">
		<div class="flex space-x-8 p-4">
			{#each pages as page}
				<button
					onclick={() => {
						fragment = page
						localStorage.setItem('fragment', page)
					}}
					class="text-md truncate rounded-md px-3 py-2 font-medium capitalize text-gray-700 transition-colors dark:text-white {fragment ===
					page
						? 'bg-primary-100 dark:bg-yellow-400'
						: 'hover:bg-gray-50 dark:hover:bg-gray-500'}"
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
