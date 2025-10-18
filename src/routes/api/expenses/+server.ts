import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseClient } from '$lib/supabaseClient';

interface Expense {
  id?: string;
  user_id?: string;
  name: string;
  category: string;
  amount: number;
  date: string;
  created_at?: string;
}

async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  const token = authHeader.replace('Bearer ', '');
  const { data: { user }, error } = await supabaseClient.auth.getUser(token);

  if (error || !user) {
    return null;
  }

  return user;
}

export const GET: RequestHandler = async ({ request }) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { data, error } = await supabaseClient
      .from('expenses')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) return json({ error: error.message }, { status: 400 });

    return json({ data });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};

export const POST: RequestHandler = async ({ request }) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const expense: Expense = await request.json();
    const { data, error } = await supabaseClient
      .from('expenses')
      .insert({
        user_id: user.id,
        name: expense.name,
        category: expense.category,
        amount: expense.amount,
        date: expense.date,
      })
      .select()
      .single();

    if (error) return json({ error: error.message }, { status: 400 });

    return json({ data }, { status: 201 });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
