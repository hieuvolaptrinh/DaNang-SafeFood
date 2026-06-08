// Token storage utilities
const ACCESS_TOKEN_KEY = 'access_token';
const REFRESH_TOKEN_KEY = 'refresh_token';
const USER_INFO_KEY = 'user_info';

export function getAccessToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function getRefreshToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(REFRESH_TOKEN_KEY);
}

export function setRefreshToken(token: string): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REFRESH_TOKEN_KEY, token);
}

export interface StoredUser {
  id: number;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  role: string[];
  enabled: boolean;
}

export function getUserInfo(): StoredUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(USER_INFO_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setUserInfo(user: StoredUser): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));
}

export function clearTokens(): void {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(REFRESH_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
}

