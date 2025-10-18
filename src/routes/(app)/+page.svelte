<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { DollarSign, CheckSquare, Clock } from '@lucide/svelte';
</script>

<div class="container mx-auto max-w-6xl space-y-8 px-4 py-8">
	<div class="text-center">
		<h1 class="text-3xl font-bold sm:text-4xl">Welcome to Natee Tracker</h1>
		<p class="mt-2 text-sm text-muted-foreground sm:text-base">
			Your all-in-one productivity and expense tracking solution
		</p>
	</div>

	<div class="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-2">
					<DollarSign class="h-5 w-5 text-primary" />
					<Card.Title class="text-lg">Expense Tracker</Card.Title>
				</div>
				<Card.Description class="text-sm">
					Track your expenses with detailed categorization
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Button href="/expense" variant="outline" class="w-full">Go to Expenses</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-2">
					<CheckSquare class="h-5 w-5 text-primary" />
					<Card.Title class="text-lg">To-Do List</Card.Title>
				</div>
				<Card.Description class="text-sm">
					Manage your daily tasks and stay organized
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Button href="/todo" variant="outline" class="w-full">Go to To-Do</Button>
			</Card.Content>
		</Card.Root>

		<Card.Root>
			<Card.Header>
				<div class="flex items-center gap-2">
					<Clock class="h-5 w-5 text-primary" />
					<Card.Title class="text-lg">Pomodoro Timer</Card.Title>
				</div>
				<Card.Description class="text-sm">
					Boost productivity with the Pomodoro technique
				</Card.Description>
			</Card.Header>
			<Card.Content>
				<Button href="/pomodoro" variant="outline" class="w-full">Start Pomodoro</Button>
			</Card.Content>
		</Card.Root>
	</div>
</div>
