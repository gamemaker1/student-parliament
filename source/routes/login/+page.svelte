<!--
- source/routes/login/+page.svelte
- ---
-
- URL  - /login
- TYPE - CLIENT
-
- The client-side of the login page.
-->

<script lang="ts">
	import { enhance } from '$app/forms'
	import type { ActionData } from './$types'

	let { form }: { form: ActionData } = $props()
</script>

<h1>Login/Register</h1>
<form method="post" action="?/login" use:enhance>
	<label>
		Name
		<input name="name" />
	</label>
	<label>
		Email
		<input type="email" name="email" />
	</label>
	<button>Login</button>
	<button formaction="?/register">Register</button>
</form>
<p style="color: red">{form?.message ?? ''}</p>
