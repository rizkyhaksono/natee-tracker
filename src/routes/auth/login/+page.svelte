<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { userStore } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';
	import { Github } from '@lucide/svelte';

	let email = $state('');
	let password = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleLogin() {
		if (!email || !password) {
			error = 'Please fill in all fields';
			return;
		}

		loading = true;
		error = '';

		const result = await userStore.signIn(email, password);

		loading = false;

		if (result.error) {
			error = (result?.error as any).message || 'Failed to sign in';
		} else {
			goto('/');
		}
	}

	async function handleGoogleLogin() {
		loading = true;
		error = '';

		const result = await userStore.signInWithGoogle();

		if (result.error) {
			error = (result?.error as any).message || 'Failed to sign in with Google';
			loading = false;
		}
	}

	async function handleGithubLogin() {
		loading = true;
		error = '';

		const result = await userStore.signInWithGithub();

		if (result.error) {
			error = (result?.error as any).message || 'Failed to sign in with GitHub';
			loading = false;
		}
	}
</script>

<div class="container flex min-h-screen items-center justify-center px-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="space-y-1">
			<Card.Title class="text-2xl">Sign In</Card.Title>
			<Card.Description>Enter your email and password to access your account</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			{#if error}
				<div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
					{error}
				</div>
			{/if}

			<!-- OAuth Buttons -->
			<div class="grid gap-2">
				<Button variant="outline" class="w-full" onclick={handleGoogleLogin} disabled={loading}>
					<svg class="mr-2 h-4 w-4" viewBox="0 0 24 24">
						<path
							fill="currentColor"
							d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
						/>
						<path
							fill="currentColor"
							d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
						/>
						<path
							fill="currentColor"
							d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
						/>
						<path
							fill="currentColor"
							d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
						/>
					</svg>
					Continue with Google
				</Button>

				<Button variant="outline" class="w-full" onclick={handleGithubLogin} disabled={loading}>
					<Github class="mr-2 h-4 w-4" />
					Continue with GitHub
				</Button>
			</div>

			<!-- Divider -->
			<div class="relative">
				<div class="absolute inset-0 flex items-center">
					<span class="w-full border-t"></span>
				</div>
				<div class="relative flex justify-center text-xs uppercase">
					<span class="bg-background px-2 text-muted-foreground">Or continue with</span>
				</div>
			</div>

			<!-- Email/Password Form -->
			<div class="space-y-2">
				<Label for="email">Email</Label>
				<Input
					id="email"
					type="email"
					placeholder="you@example.com"
					bind:value={email}
					disabled={loading}
				/>
			</div>

			<div class="space-y-2">
				<Label for="password">Password</Label>
				<Input
					id="password"
					type="password"
					placeholder="Your password"
					bind:value={password}
					disabled={loading}
				/>
			</div>

			<Button class="w-full" onclick={handleLogin} disabled={loading}>
				{loading ? 'Signing in...' : 'Sign In'}
			</Button>

			<p class="text-center text-sm text-muted-foreground">
				Don't have an account?
				<a href="/auth/register" class="text-primary hover:underline">Sign up</a>
			</p>
		</Card.Content>
	</Card.Root>
</div>
