<script lang="ts">
	import { onMount } from 'svelte';
	import { userStore } from '$lib/stores/userStore';
	import { Button } from '$lib/components/ui/button';
	import { Menu, X, LogOut } from '@lucide/svelte';
	import ModeToggle from './mode-toggle.svelte';

	let user: any = null;
	let mobileMenuOpen = false;

	const navItems = [
		{ path: '/', name: 'Home' },
		{ path: '/expense', name: 'Expense' },
		{ path: '/todo', name: 'To-Do' },
		{ path: '/pomodoro', name: 'Pomodoro' },
	];

	const unsubscribe = userStore.subscribe((value) => {
		user = value;
	});

	onMount(() => {
		userStore.initUser?.();
		return () => unsubscribe();
	});

	async function handleLogout() {
		await userStore.signOut();
	}
</script>

<nav class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
	<div class="container mx-auto px-4">
		<div class="flex h-14 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="text-lg font-bold">Natee Tracker</a>

			{#if user}
				<!-- Desktop nav -->
				<div class="hidden items-center gap-1 md:flex">
					{#each navItems as item}
						<a href={item.path} class="rounded-md px-3 py-1.5 text-sm hover:bg-accent">
							{item.name}
						</a>
					{/each}
				</div>

				<!-- Right side -->
				<div class="hidden items-center gap-2 md:flex">
					<span class="text-xs text-muted-foreground">{user.email}</span>
					<ModeToggle />
					<Button variant="ghost" size="sm" onclick={handleLogout}>
						<LogOut class="h-4 w-4" />
					</Button>
				</div>

				<!-- Mobile menu button -->
				<div class="flex items-center gap-2 md:hidden">
					<ModeToggle />
					<Button variant="ghost" size="sm" onclick={() => (mobileMenuOpen = !mobileMenuOpen)}>
						{#if mobileMenuOpen}
							<X class="h-5 w-5" />
						{:else}
							<Menu class="h-5 w-5" />
						{/if}
					</Button>
				</div>
			{:else}
				<div class="flex items-center gap-2">
					<ModeToggle />
					<Button href="/auth/login" variant="ghost" size="sm">Login</Button>
				</div>
			{/if}
		</div>

		<!-- Mobile menu -->
		{#if mobileMenuOpen && user}
			<div class="border-t py-2 md:hidden">
				{#each navItems as item}
					<a
						href={item.path}
						class="block rounded-md px-3 py-2 text-sm hover:bg-accent"
						onclick={() => (mobileMenuOpen = false)}
					>
						{item.name}
					</a>
				{/each}
				<div class="mt-2 border-t pt-2">
					<div class="px-3 py-1 text-xs text-muted-foreground">{user.email}</div>
					<Button variant="ghost" size="sm" class="w-full justify-start" onclick={handleLogout}>
						<LogOut class="mr-2 h-4 w-4" />
						Sign Out
					</Button>
				</div>
			</div>
		{/if}
	</div>
</nav>
