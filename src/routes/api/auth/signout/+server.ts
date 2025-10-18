import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseClient } from '$lib/supabaseClient';

export const POST: RequestHandler = async () => {
  try {
    const { error } = await supabaseClient.auth.signOut();

    if (error) {
      return json({ error: error.message }, { status: 400 });
    }

    // Client will clear localStorage
    return json({ success: true });
  } catch (error) {
    return json(
      { error: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    );
  }
};
