<script lang="ts">
	import { page } from '$app/state';
	import ModeToggle from './mode-toggle.svelte';
</script>

<header class="container mx-auto flex items-center justify-between p-4">
	<div class="flex items-center gap-4">
		<h1 class="text-2xl font-bold">Natee Tracker</h1>
	</div>
	<div class="flex items-center gap-4">
		<a
			href="/"
			class="text-sm hover:underline hover:underline-offset-4 {page.url.pathname === '/'
				? 'underline underline-offset-4'
				: ''}"
		>
			Home
		</a>
		<a
			href="/about"
			class="text-sm hover:underline hover:underline-offset-4 {page.url.pathname === '/about'
				? 'underline underline-offset-4'
				: ''}"
		>
			About
		</a>
		<ModeToggle />
	</div>
</header>
