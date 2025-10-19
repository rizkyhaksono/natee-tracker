<script lang="ts">
	import { expenseStore, monthlyTotal } from '$lib/stores/expenseStore';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Label } from '$lib/components/ui/label';
	import * as Select from '$lib/components/ui/select';
	import { Plus, Edit, Trash2, DollarSign } from '@lucide/svelte';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';
	import { formatCurrency } from '$lib/format';

	let { initialExpenses = [] } = $props<{ initialExpenses?: any[] }>();

	let showAddForm = $state(false);
	let editingExpense: any = $state(null);
	let newExpense = $state({
		name: '',
		category: '',
		amount: 0,
		date: new Date().toISOString().split('T')[0]
	});

	const categories = [
		'Food & Dining',
		'Transportation',
		'Shopping',
		'Entertainment',
		'Bills & Utilities',
		'Healthcare',
		'Education',
		'Travel',
		'Other'
	];

	onMount(() => {
		expenseStore.loadExpenses();
	});

	async function addExpense() {
		if (!newExpense.name || !newExpense.category || newExpense.amount <= 0) return;

		await expenseStore.addExpense(newExpense);
		newExpense = {
			name: '',
			category: '',
			amount: 0,
			date: new Date().toISOString().split('T')[0]
		};
		showAddForm = false;
	}

	async function updateExpense() {
		if (!editingExpense) return;
		await expenseStore.updateExpense(editingExpense.id, editingExpense);
		editingExpense = null;
	}

	async function deleteExpense(id: string) {
		if (confirm('Are you sure you want to delete this expense?')) {
			await expenseStore.deleteExpense(id);
		}
	}

	function startEdit(expense: any) {
		editingExpense = { ...expense };
	}

	function cancelEdit() {
		editingExpense = null;
	}
</script>

<div class="container mx-auto max-w-4xl space-y-6 px-4 py-6">
	<!-- Monthly Total -->
	<Card.Root>
		<Card.Header>
			<Card.Title class="flex items-center text-base">
				<DollarSign class="mr-2 h-5 w-5" />
				Monthly Total
			</Card.Title>
		</Card.Header>
		<Card.Content>
			<div class="text-2xl font-bold text-primary">
				{formatCurrency($monthlyTotal)}
			</div>
		</Card.Content>
	</Card.Root>

	<!-- Add Button -->
	<Button onclick={() => (showAddForm = !showAddForm)} class="w-full sm:w-auto">
		<Plus class="mr-2 h-4 w-4" />
		Add Expense
	</Button>

	<!-- Add Form -->
	{#if showAddForm}
		<div transition:slide={{ duration: 300 }}>
			<Card.Root>
				<Card.Header>
					<Card.Title class="text-base">Add New Expense</Card.Title>
				</Card.Header>
				<Card.Content class="space-y-3">
					<div class="space-y-1.5">
						<Label for="name" class="text-sm">Name</Label>
						<Input id="name" bind:value={newExpense.name} placeholder="Expense name" />
					</div>

					<div class="space-y-1.5">
						<Label for="category" class="text-sm">Category</Label>
						<Select.Root type="single">
							<Select.Trigger id="category">
								{newExpense.category || 'Select category'}
							</Select.Trigger>
							<Select.Content>
								{#each categories as category}
									<Select.Item value={category} onclick={() => (newExpense.category = category)}>
										{category}
									</Select.Item>
								{/each}
							</Select.Content>
						</Select.Root>
					</div>

					<div class="grid gap-3 sm:grid-cols-2">
						<div class="space-y-1.5">
							<Label for="amount" class="text-sm">Amount</Label>
							<Input id="amount" type="number" bind:value={newExpense.amount} step="0.01" min="0" />
						</div>

						<div class="space-y-1.5">
							<Label for="date" class="text-sm">Date</Label>
							<Input id="date" type="date" bind:value={newExpense.date} />
						</div>
					</div>

					<div class="flex gap-2">
						<Button onclick={addExpense} size="sm">Add</Button>
						<Button variant="outline" onclick={() => (showAddForm = false)} size="sm">Cancel</Button
						>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}

	<!-- Expenses List -->
	<div class="space-y-3">
		{#each $expenseStore as expense (expense.id)}
			<div transition:fade={{ duration: 200 }}>
				<Card.Root>
					<Card.Content class="p-3 sm:p-4">
						{#if editingExpense && editingExpense.id === expense.id}
							<div class="space-y-3">
								<Input bind:value={editingExpense.name} placeholder="Name" class="text-sm" />
								<Select.Root type="single">
									<Select.Trigger class="text-sm">
										{editingExpense.category || 'Select category'}
									</Select.Trigger>
									<Select.Content>
										{#each categories as category}
											<Select.Item
												value={category}
												onclick={() => (editingExpense.category = category)}
											>
												{category}
											</Select.Item>
										{/each}
									</Select.Content>
								</Select.Root>
								<div class="grid gap-2 sm:grid-cols-2">
									<Input
										type="number"
										bind:value={editingExpense.amount}
										step="0.01"
										class="text-sm"
									/>
									<Input type="date" bind:value={editingExpense.date} class="text-sm" />
								</div>
								<div class="flex gap-2">
									<Button onclick={updateExpense} size="sm">Save</Button>
									<Button variant="outline" onclick={cancelEdit} size="sm">Cancel</Button>
								</div>
							</div>
						{:else}
							<div class="flex items-start justify-between gap-3">
								<div class="min-w-0 flex-1">
									<h3 class="truncate text-sm font-semibold">{expense.name}</h3>
									<p class="text-xs text-muted-foreground">{expense.category}</p>
									<p class="text-xs text-muted-foreground">
										{new Date(expense.date).toLocaleDateString()}
									</p>
								</div>
								<div class="text-right">
									<div class="text-base font-bold text-primary sm:text-base">
										{formatCurrency(Number(expense.amount))}
									</div>
									<div class="mt-1 flex gap-1">
										<Button size="sm" variant="ghost" onclick={() => startEdit(expense)}>
											<Edit class="h-3 w-3" />
										</Button>
										<Button size="sm" variant="ghost" onclick={() => deleteExpense(expense.id)}>
											<Trash2 class="h-3 w-3" />
										</Button>
									</div>
								</div>
							</div>
						{/if}
					</Card.Content>
				</Card.Root>
			</div>
		{/each}
	</div>

	<!-- Empty State -->
	{#if $expenseStore.length === 0}
		<Card.Root>
			<Card.Content class="py-8 text-center">
				<p class="text-sm text-muted-foreground">No expenses yet. Add your first expense!</p>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
