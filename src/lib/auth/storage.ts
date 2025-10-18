const STORAGE_KEY = import.meta?.env?.STORAGE_KEY
const ENCRYPTION_KEY = import.meta?.env?.ENCRYPTION_KEY

const isBrowser = globalThis?.window !== undefined;

if (!ENCRYPTION_KEY) console.warn('[auth/storage] ENCRYPTION_KEY is not set; falling back to base64 storage (not encrypted)');

function xorEncrypt(text: string, key?: string): string {
  if (!key) return btoa(text);

  let result = '';
  for (let i = 0; i < text.length; i++) {
    const t = text.codePointAt(i) ?? 0;
    const k = key.codePointAt(i % key.length) ?? 0;
    result += String.fromCodePoint(t ^ k);
  }
  return btoa(result);
}

function xorDecrypt(encrypted: string, key?: string): string {
  try {
    if (!key) return atob(encrypted);

    const decoded = atob(encrypted);
    let result = '';
    for (let i = 0; i < decoded.length; i++) {
      const d = decoded.codePointAt(i) ?? 0;
      const k = key.codePointAt(i % key.length) ?? 0;
      result += String.fromCodePoint(d ^ k);
    }
    return result;
  } catch {
    return '';
  }
}

export interface AuthSession {
  access_token: string;
  refresh_token?: string;
  user: {
    id: string;
    email: string;
  };
  expires_at?: number;
}

export const authStorage = {
  setSession(session: AuthSession): void {
    if (!isBrowser) return;

    try {
      const sessionString = JSON.stringify(session);
      const encrypted = xorEncrypt(sessionString, ENCRYPTION_KEY);
      localStorage.setItem(STORAGE_KEY, encrypted);
    } catch (error) {
      console.error('Error saving session:', error);
    }
  },

  getSession(): AuthSession | null {
    if (!isBrowser) return null;

    try {
      const encrypted = localStorage.getItem(STORAGE_KEY);
      if (!encrypted) return null;

      const decrypted = xorDecrypt(encrypted, ENCRYPTION_KEY);
      if (!decrypted) return null;

      const session = JSON.parse(decrypted) as AuthSession;

      if (session.expires_at && session.expires_at < Date.now() / 1000) {
        this.clearSession();
        return null;
      }

      return session;
    } catch (error) {
      console.error('Error reading session:', error);
      return null;
    }
  },

  clearSession(): void {
    if (!isBrowser) return;

    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing session:', error);
    }
  },

  getAccessToken(): string | null {
    const session = this.getSession();
    return session?.access_token || null;
  },

  isAuthenticated(): boolean {
    return this.getSession() !== null;
  }
};
