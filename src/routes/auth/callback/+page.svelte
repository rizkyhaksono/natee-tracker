<script lang="ts">
	import { onMount } from 'svelte';
	import { goto, invalidateAll } from '$app/navigation';
	import { authStorage } from '$lib/auth/storage';
	import { userStore } from '$lib/stores/userStore';

	let error = $state('');
	let loading = $state(true);

	onMount(async () => {
		try {
			const hashParams = new URLSearchParams(window.location.hash.substring(1));
			const queryParams = new URLSearchParams(window.location.search);

			const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
			const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
			const authError = hashParams.get('error') || queryParams.get('error');
			const errorDescription =
				hashParams.get('error_description') || queryParams.get('error_description');

			if (authError) {
				error = errorDescription || authError;
				loading = false;
				setTimeout(() => {
					goto('/auth/login');
				}, 3000);
				return;
			}

			if (accessToken) {
				const response = await fetch('/api/auth/oauth/callback', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						access_token: accessToken,
						refresh_token: refreshToken
					})
				});

				const result = await response.json();

				if (result.error) {
					error = result.error;
					loading = false;
					setTimeout(() => {
						goto('/auth/login');
					}, 3000);
					return;
				}

				if (result.user && result.access_token) {
					// Save to encrypted localStorage
					authStorage.setSession({
						access_token: result.access_token,
						refresh_token: result.refresh_token,
						user: {
							id: result.user.id,
							email: result.user.email || ''
						},
						expires_at: result.expires_at
					});

					// Update user store
					userStore.setUser({
						id: result.user.id,
						email: result.user.email || ''
					});

					// Invalidate all data to refresh user session across the app
					await invalidateAll();

					// Redirect to home
					await goto('/', { replaceState: true });
				}
			} else {
				error = 'No access token found';
				loading = false;
				setTimeout(() => {
					goto('/auth/login');
				}, 3000);
			}
		} catch (err) {
			console.error('Callback error:', err);
			error = 'Authentication failed';
			loading = false;
			setTimeout(() => {
				goto('/auth/login');
			}, 3000);
		}
	});
</script>

<div class="container flex min-h-screen items-center justify-center px-4">
	<div class="max-w-md space-y-4 text-center">
		{#if loading}
			<div class="flex flex-col items-center gap-4">
				<div
					class="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent"
				></div>
				<h2 class="text-xl font-semibold">Completing sign in...</h2>
				<p class="text-sm text-muted-foreground">Please wait while we authenticate your account</p>
			</div>
		{:else if error}
			<div class="space-y-3 rounded-lg border border-destructive bg-destructive/10 p-6">
				<div class="flex justify-center">
					<svg
						class="h-12 w-12 text-destructive"
						fill="none"
						stroke="currentColor"
						viewBox="0 0 24 24"
					>
						<path
							stroke-linecap="round"
							stroke-linejoin="round"
							stroke-width="2"
							d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
						/>
					</svg>
				</div>
				<h2 class="text-xl font-semibold text-destructive">Authentication Error</h2>
				<p class="text-sm text-muted-foreground">{error}</p>
				<p class="text-xs text-muted-foreground">Redirecting to login page...</p>
			</div>
		{/if}
	</div>
</div>
