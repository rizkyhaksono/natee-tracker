import { writable } from 'svelte/store';
import { goto, invalidateAll } from '$app/navigation';
import { authStorage } from '$lib/auth/storage';

interface User {
  id: string;
  email: string;
}

const createUserStore = () => {
  const { subscribe, set } = writable<User | null>(null);

  return {
    subscribe,
    signUp: async (email: string, password: string) => {
      try {
        const response = await fetch('/api/auth/signup', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (result.error) return { data: null, error: new Error(result.error) };

        if (result.user && result.access_token) {
          // Save to encrypted localStorage
          authStorage.setSession({
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            user: {
              id: result.user.id,
              email: result.user.email || '',
            },
            expires_at: result.expires_at,
          });

          set({
            id: result.user.id,
            email: result.user.email || '',
          });

          // Invalidate all data to refresh user session
          await invalidateAll();
        }

        return { data: result, error: null };
      } catch (error) {
        console.error('Sign up error:', error);
        return { data: null, error };
      }
    },
    signIn: async (email: string, password: string) => {
      try {
        const response = await fetch('/api/auth/signin', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (result.error) return { data: null, error: new Error(result.error) };

        if (result.user && result.access_token) {
          // Save to encrypted localStorage
          authStorage.setSession({
            access_token: result.access_token,
            refresh_token: result.refresh_token,
            user: {
              id: result.user.id,
              email: result.user.email || '',
            },
            expires_at: result.expires_at,
          });

          set({
            id: result.user.id,
            email: result.user.email || '',
          });

          // Invalidate all data to refresh user session
          await invalidateAll();
        }

        return { data: result, error: null };
      } catch (error) {
        console.error('Sign in error:', error);
        return { data: null, error };
      }
    },
    signOut: async () => {
      try {
        await fetch('/api/auth/signout', { method: 'POST' });

        // Clear encrypted localStorage
        authStorage.clearSession();
        set(null);

        // Invalidate all data to refresh user session
        await invalidateAll();
        goto('/auth/login');
      } catch (error) {
        console.error('Sign out error:', error);
      }
    },
    setUser: (user: User | null) => {
      set(user);
    },
    // Initialize user from localStorage on app load
    initUser: () => {
      const session = authStorage.getSession();
      if (session?.user) {
        set({
          id: session.user.id,
          email: session.user.email,
        });
      }
    },
    signInWithGoogle: async () => {
      try {
        const response = await fetch('/api/auth/oauth/google', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (result.error) {
          return { data: null, error: new Error(result.error) };
        }

        if (result.url) {
          globalThis.location.href = result.url;
          return { data: result, error: null };
        }

        return { data: null, error: new Error('No OAuth URL returned') };
      } catch (error) {
        console.error('Google sign in error:', error);
        return { data: null, error };
      }
    },
    signInWithGithub: async () => {
      try {
        const response = await fetch('/api/auth/oauth/github', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
        });

        const result = await response.json();

        if (result.error) {
          return { data: null, error: new Error(result.error) };
        }

        if (result.url) {
          globalThis.location.href = result.url;
          return { data: result, error: null };
        }

        return { data: null, error: new Error('No OAuth URL returned') };
      } catch (error) {
        console.error('GitHub sign in error:', error);
        return { data: null, error };
      }
    },
  };
};

export const userStore = createUserStore();
