import { createClient } from '@supabase/supabase-js';
import { authStorage } from '$lib/auth/storage';

// Browser-side Supabase client with encrypted localStorage
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in browser
const isBrowser = globalThis.window !== undefined;

export const supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage: isBrowser ? {
      getItem: (key: string) => {
        // Use our encrypted storage for auth tokens
        if (key.includes('auth-token')) {
          const session = authStorage.getSession();
          if (session) {
            return JSON.stringify(session);
          }
          return null;
        }
        return null;
      },
      setItem: (_key: string, _value: string) => {
        // Handled by our authStorage
        // This prevents Supabase from creating its own storage
      },
      removeItem: (key: string) => {
        // Handled by our authStorage
        if (key.includes('auth-token')) {
          authStorage.clearSession();
        }
      },
    } : undefined,
    autoRefreshToken: isBrowser,
    persistSession: isBrowser,
  },
});
