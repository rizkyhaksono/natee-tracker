<script lang="ts">
	import { onMount } from 'svelte';
	import { userStore } from '$lib/stores/userStore';
	import { Button } from '$lib/components/ui/button';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { Menu, X, LogOut, User } from '@lucide/svelte';
	import ModeToggle from './mode-toggle.svelte';

	let user: any = null;
	let mobileMenuOpen = false;

	const navItems = [
		{ path: '/', name: 'Home' },
		{ path: '/expense', name: 'Expense' },
		{ path: '/todo', name: 'To-Do' },
		{ path: '/pomodoro', name: 'Pomodoro' }
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

<nav
	class="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
>
	<div class="container mx-auto px-4">
		<div class="flex h-14 items-center justify-between">
			<!-- Logo -->
			<a href="/" class="text-base font-bold">Natee Tracker</a>

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
					<ModeToggle />
					<DropdownMenu.Root>
						<DropdownMenu.Trigger>
							<Button variant="ghost" size="sm">
								<User class="h-5 w-5" />
							</Button>
						</DropdownMenu.Trigger>
						<DropdownMenu.Content>
							<DropdownMenu.Group>
								<DropdownMenu.Label>
									<p>My Profile</p>
									<span class="text-xs text-muted-foreground">{user.email}</span>
								</DropdownMenu.Label>
								<DropdownMenu.Separator />
								<DropdownMenu.Item>
									<Button
										variant="ghost"
										class="flex w-full items-center justify-between gap-2 rounded-md px-2 py-1 text-sm hover:bg-accent focus:outline-none"
										onclick={handleLogout}
										aria-label="Sign out"
									>
										<span>Sign out</span>
										<LogOut class="h-4 w-4" />
									</Button>
								</DropdownMenu.Item>
							</DropdownMenu.Group>
						</DropdownMenu.Content>
					</DropdownMenu.Root>
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
					<Button href="/auth/login" variant="default" size="sm">Login</Button>
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
				<div class="mt-2 flex items-center justify-between border-t pt-2">
					<div class="px-3 py-1">
						<p class="text-sm">My Profile</p>
						<p class="text-xs text-muted-foreground">{user.email}</p>
					</div>
					<Button variant="ghost" size="sm" onclick={handleLogout}>
						<LogOut class="mr-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		{/if}
	</div>
</nav>
