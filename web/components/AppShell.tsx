'use client';

import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useSyncExternalStore } from 'react';
import { SidebarProvider, useSidebar } from '@/lib/SidebarContext';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import { cn } from '@/lib/utils';
import { useAuth } from '@/lib/AuthContext';
import { getAccessToken, getUserInfo } from '@/utils/storage';

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

function ShellContent({ children }: { children: React.ReactNode }) {
  const { collapsed } = useSidebar();

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      <Sidebar />
      <div
        className={cn(
          'flex min-h-screen flex-col transition-[margin-left] duration-150',
          collapsed ? 'ml-[52px]' : 'ml-[220px]'
        )}
      >
        <Header />
        <main className="flex-1 p-4">{children}</main>
        <footer className="shrink-0 border-t border-[#D6D6D6] bg-[#006400] px-4 py-2.5">
          <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] text-white/80">
            <span>© 2026 Chi cục An toàn Thực phẩm TP. Đà Nẵng — Sở Y tế TP. Đà Nẵng</span>
            <span>Phần mềm Quản lý ATTP v2.1.0 | Hỗ trợ: (0236) 3.819.879</span>
          </div>
        </footer>
      </div>
    </div>
  );
}

function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const isClient = useIsClient();
  const hasStoredSession = isClient && !!getAccessToken() && !!getUserInfo();

  useEffect(() => {
    if (isClient && !isAuthenticated && !hasStoredSession) {
      router.replace('/login');
    }
  }, [hasStoredSession, isAuthenticated, isClient, router]);

  if (!isClient || (!isAuthenticated && !hasStoredSession)) {
    // Show nothing while redirecting
    return null;
  }

  return <>{children}</>;
}

export default function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  if (pathname === '/login') {
    return <>{children}</>;
  }

  return (
    <AuthGuard>
      <SidebarProvider>
        <ShellContent>{children}</ShellContent>
      </SidebarProvider>
    </AuthGuard>
  );
}
