<script lang="ts">
	import {
		Card,
		CardContent,
		CardDescription,
		CardHeader,
		CardTitle
	} from '$lib/components/ui/card';
	import { Button } from '$lib/components/ui/button';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { fade } from 'svelte/transition';
	import { page } from '$app/stores';

	const features = [
		{
			title: 'Expense Tracker',
			description: 'Track your daily and monthly expenses with detailed categorization.',
			href: '/expenses',
			buttonText: 'Go to Expenses'
		},
		{
			title: 'To-Do List',
			description: 'Manage your daily tasks and stay organized.',
			href: '/todo',
			buttonText: 'Go to To-Do'
		},
		{
			title: 'Pomodoro Timer',
			description: 'Boost your productivity with the Pomodoro technique.',
			href: '/pomodoro',
			buttonText: 'Start Pomodoro'
		}
	];
</script>

<div class="container mx-auto px-4 py-8" in:fade={{ duration: 200 }}>
	<div class="mb-12 text-center">
		<h1 class="text-4xl font-extrabold tracking-tight lg:text-5xl">Welcome to FocusTrack</h1>
		<p class="mx-auto mt-4 max-w-2xl text-lg text-muted-foreground">
			Your all-in-one productivity and expense tracking solution
		</p>
	</div>

	<div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
		{#each features as feature}
			<Card class="group transition-all hover:shadow-lg">
				<CardHeader>
					<CardTitle class="text-xl">{feature.title}</CardTitle>
					<CardDescription class="min-h-[60px]">
						{feature.description}
					</CardDescription>
				</CardHeader>
				<CardContent>
					<a href={feature.href}>
						<Button variant="outline" class="w-full group-hover:bg-primary/10">
							{feature.buttonText}
							<ArrowRight class="ml-2 h-4 w-4" />
						</Button>
					</a>
				</CardContent>
			</Card>
		{/each}
	</div>
</div>
