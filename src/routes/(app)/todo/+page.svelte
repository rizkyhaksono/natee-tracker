<script lang="ts">
	import { todoStore } from '$lib/stores/todoStore';
	import { Button } from '$lib/components/ui/button';
	import * as Card from '$lib/components/ui/card';
	import { Input } from '$lib/components/ui/input';
	import { Checkbox } from '$lib/components/ui/checkbox';
	import { Plus, Trash2 } from '@lucide/svelte';
	import { fade, slide } from 'svelte/transition';
	import { onMount } from 'svelte';

	let newTodoTitle = $state('');
	let showAddForm = $state(false);

	onMount(() => {
		todoStore.loadTodos();
	});

	async function addTodo() {
		if (!newTodoTitle.trim()) return;
		await todoStore.addTodo(newTodoTitle);
		newTodoTitle = '';
		showAddForm = false;
	}

	async function toggleTodo(id: string, isDone: boolean) {
		await todoStore.toggleTodo(id, isDone);
	}

	async function deleteTodo(id: string) {
		if (confirm('Delete this task?')) {
			await todoStore.deleteTodo(id);
		}
	}
</script>

<div class="container mx-auto max-w-4xl space-y-6 px-4 py-6">
	<div class="flex items-center justify-between">
		<h1 class="text-2xl font-bold">To-Do List</h1>
		<Button onclick={() => (showAddForm = !showAddForm)} size="sm">
			<Plus class="mr-2 h-4 w-4" />
			Add Task
		</Button>
	</div>

	{#if showAddForm}
		<div transition:slide={{ duration: 300 }}>
			<Card.Root>
				<Card.Content class="p-3 sm:p-4">
					<div class="flex gap-2">
						<Input
							bind:value={newTodoTitle}
							placeholder="Task name..."
							onkeydown={(e) => e.key === 'Enter' && addTodo()}
							class="text-sm"
						/>
						<Button onclick={addTodo} size="sm">Add</Button>
						<Button variant="outline" onclick={() => (showAddForm = false)} size="sm">Cancel</Button
						>
					</div>
				</Card.Content>
			</Card.Root>
		</div>
	{/if}

	<div class="space-y-3">
		{#each $todoStore as todo (todo.id)}
			<div transition:fade={{ duration: 200 }}>
				<Card.Root>
					<Card.Content class="flex items-center  justify-between gap-3 p-3 sm:p-4">
						<div class="flex min-w-0 flex-1 items-center gap-3">
							<Checkbox
								checked={todo.is_done}
								onCheckedChange={() => toggleTodo(todo.id, todo.is_done)}
							/>
							<span class="text-sm {todo.is_done ? 'text-muted-foreground line-through' : ''}">
								{todo.title}
							</span>
						</div>
						<Button size="sm" variant="ghost" onclick={() => deleteTodo(todo.id)}>
							<Trash2 class="h-3 w-3" />
						</Button>
					</Card.Content>
				</Card.Root>
			</div>
		{/each}
	</div>

	{#if $todoStore.length === 0}
		<Card.Root>
			<Card.Content class="py-8 text-center">
				<p class="text-sm text-muted-foreground">No tasks yet. Add your first task!</p>
			</Card.Content>
		</Card.Root>
	{/if}
</div>
