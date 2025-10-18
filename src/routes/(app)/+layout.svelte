<script lang="ts">
	import { onMount } from 'svelte';
	import { requireAuth } from '$lib/auth/guard';

	let { children } = $props();

	// Protect all routes under (app) group
	onMount(() => {
		requireAuth();
	});
</script>

{@render children()}
