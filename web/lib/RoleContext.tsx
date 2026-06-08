'use client';

import { createContext, useContext, ReactNode } from 'react';
import { Role } from '@/data/mockData';
import { useAuth } from '@/lib/AuthContext';

interface RoleContextType {
  role: Role;
  setRole: (role: Role) => void;
}

const RoleContext = createContext<RoleContextType>({
  role: 'INSPECTOR',
  setRole: () => {},
});

export function RoleProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const role: Role = user?.mappedRole ?? 'INSPECTOR';

  return (
    <RoleContext.Provider value={{ role, setRole: () => {} }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  return useContext(RoleContext);
}

