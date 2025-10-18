import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseClient } from '$lib/supabaseClient';

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

export const PATCH: RequestHandler = async ({ request, params }) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;
  if (!id) return json({ error: 'Expense ID is required' }, { status: 400 });

  try {
    const updatedExpense = await request.json();

    const { data, error } = await supabaseClient
      .from('expenses')
      .update(updatedExpense)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) return json({ error: error.message }, { status: 400 });

    return json({ data });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};

export const DELETE: RequestHandler = async ({ request, params }) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  const id = params.id;
  if (!id) return json({ error: 'Expense ID is required' }, { status: 400 });

  try {
    const { error } = await supabaseClient
      .from('expenses')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) return json({ error: error.message }, { status: 400 });

    return json({ success: true });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
