'use client';

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
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

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);

  // Rehydrate from localStorage on mount
  useEffect(() => {
    const token = getAccessToken();
    const stored = getUserInfo();
    if (token && stored) {
      setUser({ ...stored, mappedRole: mapBackendRole(stored.role) });
    }
  }, []);

  const login = useCallback(
    (tokens: { accessToken: string; refreshToken: string }, userInfo: StoredUser) => {
      setAccessToken(tokens.accessToken);
      setRefreshToken(tokens.refreshToken);
      setUserInfo(userInfo);
      setUser({ ...userInfo, mappedRole: mapBackendRole(userInfo.role) });
    },
    []
  );

  const logout = useCallback(() => {
    clearTokens();
    setUser(null);
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
