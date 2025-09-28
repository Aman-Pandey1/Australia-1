export type SessionUser = {
  id: string;
  email: string;
  name?: string;
  role: 'user' | 'admin';
  accountType?: 'user' | 'agent';
  avatarUrl?: string;
};

export type Session = {
  token: string;
  user: SessionUser;
};

const STORAGE_KEY = 'session';

export function getSession(): Session | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : null;
  } catch {
    return null;
  }
}

export function setSession(session: Session | null) {
  if (typeof window === 'undefined') return;
  if (session) localStorage.setItem(STORAGE_KEY, JSON.stringify(session));
  else localStorage.removeItem(STORAGE_KEY);
}