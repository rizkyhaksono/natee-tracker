import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseClient } from '$lib/supabaseClient';

export const POST: RequestHandler = async ({ url }) => {
  try {
    const redirectUrl = `${url.origin}/auth/callback`;

    const { data, error } = await supabaseClient.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: redirectUrl,
      },
    });

    if (error) {
      console.error('Google OAuth error:', error);
      return json({ error: error.message }, { status: 400 });
    }

    return json({ url: data.url });
  } catch (error) {
    console.error('Google OAuth error:', error);
    return json({ error: 'Failed to initiate Google sign in' }, { status: 500 });
  }
};