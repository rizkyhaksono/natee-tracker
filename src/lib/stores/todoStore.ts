import { writable } from 'svelte/store';
import { getAuthHeaders } from '$lib/auth/helpers';

export interface Todo {
	id: string;
	user_id: string;
	title: string;
	is_done: boolean;
	created_at: string;
}

const createTodoStore = () => {
	const { subscribe, set, update } = writable<Todo[]>([]);

	return {
		subscribe,
		loadTodos: async () => {
			try {
				const response = await fetch('/api/todo', {
					headers: getAuthHeaders()
				});

				if (!response.ok) {
					console.error('Error loading todos');
					return;
				}

				const { data, error } = await response.json();

				if (error) {
					console.error('Error loading todos:', error);
					return;
				}

				set(data || []);
			} catch (error) {
				console.error('Error loading todos:', error);
			}
		},
		addTodo: async (title: string) => {
			try {
				const response = await fetch('/api/todo', {
					method: 'POST',
					headers: getAuthHeaders(),
					body: JSON.stringify({ title }),
				});

				const { data, error } = await response.json();

				if (error) {
					console.error('Error adding todo:', error);
					return;
				}

				update((todos) => [data, ...todos]);
			} catch (error) {
				console.error('Error adding todo:', error);
			}
		},
		toggleTodo: async (id: string, is_done: boolean) => {
			try {
				const response = await fetch(`/api/todo/${id}`, {
					method: 'PATCH',
					headers: getAuthHeaders(),
					body: JSON.stringify({ is_done: !is_done }),
				});

				const { data, error } = await response.json();

				if (error) {
					console.error('Error toggling todo:', error);
					return;
				}

				update((todos) => todos.map((t) => (t.id === id ? data : t)));
			} catch (error) {
				console.error('Error toggling todo:', error);
			}
		},
		updateTodo: async (id: string, updates: Partial<Todo>) => {
			try {
				const response = await fetch(`/api/todo/${id}`, {
					method: 'PATCH',
					headers: getAuthHeaders(),
					body: JSON.stringify(updates),
				});

				const { data, error } = await response.json();

				if (error) {
					console.error('Error updating todo:', error);
					return;
				}

				update((todos) => todos.map((todo) => (todo.id === id ? data : todo)));
			} catch (error) {
				console.error('Error updating todo:', error);
			}
		},
		deleteTodo: async (id: string) => {
			try {
				const response = await fetch(`/api/todo/${id}`, {
					method: 'DELETE',
				});

				const { error } = await response.json();

				if (error) {
					console.error('Error deleting todo:', error);
					return;
				}

				update((todos) => todos.filter((t) => t.id !== id));
			} catch (error) {
				console.error('Error deleting todo:', error);
			}
		},
	};
};

export const todoStore = createTodoStore();
