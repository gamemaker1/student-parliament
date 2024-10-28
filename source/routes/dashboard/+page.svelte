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
	import { AngleUpOutline, AngleDownOutline } from 'flowbite-svelte-icons'
	import { slide } from 'svelte/transition'

	import { enhance } from '$app/forms'
	import type { PageServerData } from './$types'

	let { data } = $props()
	let pages = ['announcements', 'issues', 'committees']
	let fragment = $state('announcements')
</script>

{#snippet announcements()}
	<div transition:slide class="mx-12 pt-12">
		<div class="grid gap-6">
			{#each data.announcements as announcement}
				<div class="rounded-lg bg-white p-6 shadow">
					<div class="mb-4 flex items-start justify-between">
						<h2 class="text-xl font-semibold">{announcement.title}</h2>
						<span class="rounded-full bg-blue-100 px-3 py-1 text-sm text-blue-800">
							{announcement.category}
						</span>
					</div>
					<p class="mb-2 text-gray-600">{announcement.content}</p>
					<p class="text-sm text-gray-500">Posted on {announcement.date}</p>
				</div>
			{/each}
		</div>
	</div>
{/snippet}

{#snippet issues()}
	<div transition:slide class="mx-12 pt-12">
		<div class="grid gap-6">
			{#each data.issues as issue}
				<div class="rounded-lg bg-white p-6 shadow">
					<div class="mb-4 flex items-start justify-between">
						<div>
							<h2 class="text-xl font-semibold">
								{issue.title} &nbsp;
								<span
									class="rounded-full px-3 py-1 text-sm {issue.status === 'Resolved'
										? 'bg-green-100 text-green-800'
										: 'bg-purple-100 text-purple-800'}"
									style="font-family: 'Rubik'; font-weight: normal"
								>
									{issue.status}
								</span>
							</h2>
						</div>

						<div>
							<span class="text-gray-700">{issue.votes} upvotes</span>
						</div>
					</div>
					<p class="mb-2 text-gray-600">{issue.description}</p>
					<p class="text-sm text-gray-500">Last updated on {issue.modified}</p>
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
										<p class="text-sm text-gray-600">{member.role}</p>
									</div>
									<div class="text-sm text-gray-500">
										{#if member.contact}
											<a href="mailto:{member.contact}" class="text-purple-600 hover:underline">
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
					class="text-md rounded-md px-3 py-2 font-medium text-gray-700 transition-colors {fragment ===
					page
						? 'bg-primary-100'
						: 'hover:bg-gray-50'}"
				>
					{page[0].toUpperCase() + page.slice(1)}
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
