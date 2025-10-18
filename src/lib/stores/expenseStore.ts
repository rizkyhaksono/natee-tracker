import { writable, derived } from 'svelte/store';
import { getAuthHeaders } from '$lib/auth/helpers';

interface Expense {
  id: string;
  user_id: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  created_at: string;
}

const createExpenseStore = () => {
  const { subscribe, set, update } = writable<Expense[]>([]);

  return {
    subscribe,
    loadExpenses: async () => {
      try {
        const response = await fetch('/api/expenses', {
          headers: getAuthHeaders()
        });

        if (!response.ok) {
          console.error('Error loading expenses');
          return;
        }

        const { data, error } = await response.json();

        if (error) {
          console.error('Error loading expenses:', error);
          return;
        }

        set(data || []);
      } catch (error) {
        console.error('Error loading expenses:', error);
      }
    },
    addExpense: async (expense: Omit<Expense, 'id' | 'user_id' | 'created_at'>) => {
      try {
        const response = await fetch('/api/expenses', {
          method: 'POST',
          headers: getAuthHeaders(),
          body: JSON.stringify(expense),
        });

        const { data, error } = await response.json();

        if (error) {
          console.error('Error adding expense:', error);
          return;
        }

        update((expenses) => [data, ...expenses]);
      } catch (error) {
        console.error('Error adding expense:', error);
      }
    },
    updateExpense: async (id: string, updates: Partial<Expense>) => {
      try {
        const response = await fetch(`/api/expenses/${id}`, {
          method: 'PATCH',
          headers: getAuthHeaders(),
          body: JSON.stringify(updates),
        });

        const { data, error } = await response.json();

        if (error) {
          console.error('Error updating expense:', error);
          return;
        }

        update((expenses) => expenses.map((e) => (e.id === id ? data : e)));
      } catch (error) {
        console.error('Error updating expense:', error);
      }
    },
    deleteExpense: async (id: string) => {
      try {
        const response = await fetch(`/api/expenses/${id}`, {
          method: 'DELETE',
          headers: getAuthHeaders()
        });

        const { error } = await response.json();

        if (error) {
          console.error('Error deleting expense:', error);
          return;
        }

        update((expenses) => expenses.filter((e) => e.id !== id));
      } catch (error) {
        console.error('Error deleting expense:', error);
      }
    },
  };
};

export const expenseStore = createExpenseStore();

export const monthlyTotal = derived(expenseStore, ($expenses) => {
  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  return $expenses
    .filter((expense) => {
      const expenseDate = new Date(expense.date);
      return expenseDate.getMonth() === currentMonth && expenseDate.getFullYear() === currentYear;
    })
    .reduce((total, expense) => total + expense.amount, 0);
});
