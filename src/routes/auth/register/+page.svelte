<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import { userStore } from '$lib/stores/userStore';
	import { goto } from '$app/navigation';

	let email = $state('');
	let password = $state('');
	let confirmPassword = $state('');
	let error = $state('');
	let loading = $state(false);

	async function handleRegister() {
		if (!email || !password || !confirmPassword) {
			error = 'Please fill in all fields';
			return;
		}

		if (password !== confirmPassword) {
			error = 'Passwords do not match';
			return;
		}

		if (password.length < 6) {
			error = 'Password must be at least 6 characters';
			return;
		}

		loading = true;
		error = '';

		const result = await userStore.signUp(email, password);

		loading = false;

		if (result.error) {
			error = (result?.error as any).message || 'Failed to create account';
		} else {
			goto('/');
		}
	}
</script>

<div class="container flex min-h-[calc(100vh-3.5rem)] items-center justify-center px-4">
	<Card.Root class="w-full max-w-md">
		<Card.Header class="space-y-1">
			<Card.Title class="text-2xl">Create Account</Card.Title>
			<Card.Description>Enter your information to create a new account</Card.Description>
		</Card.Header>
		<Card.Content class="space-y-4">
			{#if error}
				<div class="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
					{error}
				</div>
			{/if}

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
					placeholder="At least 6 characters"
					bind:value={password}
					disabled={loading}
				/>
			</div>

			<div class="space-y-2">
				<Label for="confirm-password">Confirm Password</Label>
				<Input
					id="confirm-password"
					type="password"
					placeholder="Re-enter your password"
					bind:value={confirmPassword}
					disabled={loading}
				/>
			</div>

			<Button class="w-full" onclick={handleRegister} disabled={loading}>
				{loading ? 'Creating account...' : 'Create Account'}
			</Button>

			<p class="text-center text-sm text-muted-foreground">
				Already have an account?
				<a href="/auth/login" class="text-primary hover:underline">Sign in</a>
			</p>
		</Card.Content>
	</Card.Root>
</div>
