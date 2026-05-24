'use client';

import { createContext, useContext, useSyncExternalStore, useCallback, ReactNode } from 'react';
import {
  getAccessToken,
  setAccessToken,
  setRefreshToken,
  getUserInfo,
  setUserInfo,
  clearTokens,
  StoredUser,
} from '@/utils/storage';
import { Role } from '@/data/mockData';

// Map backend role strings → frontend Role enum
// Backend enum: QTH | LD_ATVSTP | CB_THANH_TRA | CB_KIEM_DINH
const ROLE_MAP: Record<string, Role> = {
  QTH:          'ADMIN',
  LD_ATVSTP:    'LD_ATVSTP',
  CB_THANH_TRA: 'INSPECTOR',
  CB_KIEM_DINH: 'TESTER',
  // Legacy / prefixed variants (JWT may include ROLE_ prefix)
  ROLE_QTH:          'ADMIN',
  ROLE_LD_ATVSTP:    'LD_ATVSTP',
  ROLE_CB_THANH_TRA: 'INSPECTOR',
  ROLE_CB_KIEM_DINH: 'TESTER',
};

export function mapBackendRole(roles: string[]): Role {
  for (const r of roles) {
    if (ROLE_MAP[r]) return ROLE_MAP[r];
  }
  // Fallback: infer from partial match
  for (const r of roles) {
    const upper = r.toUpperCase();
    if (upper.includes('QTH'))        return 'ADMIN';
    if (upper.includes('LD_ATVSTP'))  return 'LD_ATVSTP';
    if (upper.includes('THANH_TRA'))  return 'INSPECTOR';
    if (upper.includes('KIEM_DINH'))  return 'TESTER';
  }
  return 'INSPECTOR'; // safe default
}

export interface AuthUser extends StoredUser {
  mappedRole: Role;
}

interface AuthContextType {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (tokens: { accessToken: string; refreshToken: string }, user: StoredUser) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isAuthenticated: false,
  login: () => {},
  logout: () => {},
});

const authListeners = new Set<() => void>();

function readStoredAuthUserSnapshot(): string {
  const token = getAccessToken();
  const stored = getUserInfo();

  if (!token || !stored) {
    return '';
  }

  return JSON.stringify({ ...stored, mappedRole: mapBackendRole(stored.role) });
}

function emitAuthChange() {
  authListeners.forEach((listener) => listener());
}

function subscribeAuth(listener: () => void) {
  authListeners.add(listener);

  const handleStorage = (event: StorageEvent) => {
    if (
      event.key === null ||
      event.key === 'access_token' ||
      event.key === 'refresh_token' ||
      event.key === 'user_info'
    ) {
      listener();
    }
  };

  window.addEventListener('storage', handleStorage);

  return () => {
    authListeners.delete(listener);
    window.removeEventListener('storage', handleStorage);
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const authSnapshot = useSyncExternalStore(subscribeAuth, readStoredAuthUserSnapshot, () => '');
  const user = authSnapshot ? (JSON.parse(authSnapshot) as AuthUser) : null;

  const login = useCallback(
    (tokens: { accessToken: string; refreshToken: string }, userInfo: StoredUser) => {
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      setUserInfo(userInfo);
      emitAuthChange();
    },
    []
  );

  const logout = useCallback(() => {
    clearTokens();
    emitAuthChange();
  }, []);

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
