import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseClient } from '$lib/supabaseClient';

interface Todo {
  id?: string;
  user_id?: string;
  title: string;
  is_done?: boolean;
  created_at?: string;
}

async function getAuthenticatedUser(request: Request) {
  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) {
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
      .from('todos')
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
    const todo: Todo = await request.json();
    const { data, error } = await supabaseClient
      .from('todos')
      .insert({
        user_id: user.id,
        title: todo.title,
        is_done: false,
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
