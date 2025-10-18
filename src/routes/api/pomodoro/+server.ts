import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseClient } from '$lib/supabaseClient';

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

export const POST: RequestHandler = async ({ request }) => {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const session = await request.json();
    const { data, error } = await supabaseClient
      .from('pomodoro_sessions')
      .insert({
        user_id: user.id,
        focus_minutes: session.focus_minutes,
        break_minutes: session.break_minutes,
        completed_sessions: session.completed_sessions,
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
