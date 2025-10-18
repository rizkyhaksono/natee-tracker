import { goto } from '$app/navigation';
import { authStorage } from '$lib/auth/storage';

// Client-side route guard
export function requireAuth() {
  if (globalThis.window === undefined) return;

  if (!authStorage.isAuthenticated()) {
    goto('/auth/login');
    return false;
  }

  return true;
}

// Check if user can access route
export function canAccessRoute(requiresAuth: boolean = true): boolean {
  if (globalThis.window === undefined) return true;

  const isAuth = authStorage.isAuthenticated();

  if (requiresAuth && !isAuth) {
    return false;
  }

  return true;
}
