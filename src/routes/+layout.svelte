<script lang="ts">
	import { ModeWatcher } from 'mode-watcher';
	import BaseLayout from '$lib/components/layouts/base-layout.svelte';
	import { userStore } from '$lib/stores/userStore';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { authStorage } from '$lib/auth/storage';
	import '../app.css';

	let { children, data } = $props();

	let user = $state<{ id: string; email: string } | null>(data.user);

	// Initialize user from encrypted localStorage on app load (client-side only)
	onMount(() => {
		userStore.initUser();
		const session = authStorage.getSession();
		if (session?.user) {
			user = session.user;
		}
	});
</script>

<ModeWatcher />
<BaseLayout {user}>
	{@render children()}
</BaseLayout>
