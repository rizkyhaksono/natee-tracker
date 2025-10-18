import { json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';
import { supabaseClient } from '$lib/supabaseClient';

export const POST: RequestHandler = async ({ request }) => {
  try {
    const { access_token, refresh_token } = await request.json();

    if (!access_token) {
      return json({ error: 'No access token provided' }, { status: 400 });
    }

    // Verify the session with Supabase
    const { data, error } = await supabaseClient.auth.setSession({
      access_token,
      refresh_token: refresh_token || '',
    });

    if (error) {
      console.error('Session error:', error);
      return json({ error: error.message }, { status: 400 });
    }

    if (data.user) {
      // Return session data to be stored in localStorage on client
      return json({
        success: true,
        user: {
          id: data.user.id,
          email: data.user.email,
        },
        access_token,
        refresh_token,
        expires_at: data.session?.expires_at,
      });
    }

    return json({ error: 'Failed to authenticate' }, { status: 400 });
  } catch (error) {
    console.error('OAuth callback error:', error);
    return json({ error: 'Failed to process OAuth callback' }, { status: 500 });
  }
};