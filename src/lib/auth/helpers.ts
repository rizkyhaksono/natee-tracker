import { authStorage } from '$lib/auth/storage';

// Helper to add auth header to fetch requests
export function getAuthHeaders(): HeadersInit {
  const token = authStorage.getAccessToken();

  if (token) {
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    };
  }

  return {
    'Content-Type': 'application/json'
  };
}

// Helper to check if user is authenticated
export function isAuthenticated(): boolean {
  return authStorage.isAuthenticated();
}

// Helper to get current user
export function getCurrentUser() {
  const session = authStorage.getSession();
  return session?.user || null;
}
