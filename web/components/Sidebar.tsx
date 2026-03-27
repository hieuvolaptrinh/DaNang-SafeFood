'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useRole } from '@/lib/RoleContext';
import { roleNavMap, NavItem } from '@/data/mockData';

// ── Icons ──
const NavIcons: Record<string, React.ReactNode> = {
  grid: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <rect x="3" y="3" width="7" height="7" rx="1.5" /><rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" /><rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  ),
  building: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1" />
    </svg>
  ),
  clipboard: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
    </svg>
  ),
  alert: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  megaphone: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z" />
    </svg>
  ),
  settings: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.8} className="w-4 h-4">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  ),
};

// ── Sub-menu item ──
function SubLink({ label, href, active }: { label: string; href: string; active: boolean }) {
  return (
    <Link
      href={href}
      className={cn(
        'flex items-center gap-2 pl-11 pr-4 py-2 text-[13px] transition-all relative',
        'before:content-[""] before:w-1.5 before:h-1.5 before:rounded-full before:flex-shrink-0 before:ml-[-6px]',
        active
          ? 'text-white before:bg-blue-400 bg-white/10'
          : 'text-slate-400 before:bg-slate-600 hover:text-slate-200 hover:before:bg-blue-400'
      )}
    >
      {label}
    </Link>
  );
}

// ── Parent nav item ──
function NavGroup({ item, pathname }: { item: NavItem; pathname: string }) {
  const hasActive = item.children?.some((c) => pathname.startsWith(c.href));
  const [open, setOpen] = useState(hasActive ?? false);

  if (item.href) {
    // Direct leaf link
    const active = pathname === item.href || pathname.startsWith(item.href + '/');
    return (
      <Link
        href={item.href}
        className={cn(
          'flex items-center gap-2.5 px-4 py-2.5 transition-all',
          active ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        )}
      >
        <span className={cn('flex-shrink-0', active ? 'text-blue-400' : '')}>
          {NavIcons[item.icon]}
        </span>
        <span className="text-[13.5px] font-medium">{item.label}</span>
      </Link>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          'w-full flex items-center gap-2.5 px-4 py-2.5 transition-all text-left',
          hasActive ? 'text-white' : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        )}
      >
        <span className={cn('flex-shrink-0', hasActive ? 'text-blue-400' : '')}>
          {NavIcons[item.icon]}
        </span>
        <span className="text-[13.5px] font-medium flex-1">{item.label}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
          className={cn('w-3.5 h-3.5 opacity-50 transition-transform', open && 'rotate-90')}
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {open && item.children && (
        <div className="bg-black/20">
          {item.children.map((child) => (
            <SubLink key={child.href} {...child} active={pathname.startsWith(child.href)} />
          ))}
        </div>
      )}
    </div>
  );
}

// ── Main Sidebar ──
export default function Sidebar() {
  const { role } = useRole();
  const pathname = usePathname();
  const navItems = roleNavMap[role] ?? [];

  const roleInfo = {
    ADMIN:      { name: 'Nguyễn Văn Admin',       label: 'Quản trị viên',          avatar: 'A' },
    AUTHORITY:  { name: 'Trần Thị Thẩm Quyền',   label: 'Cơ quan thẩm quyền',     avatar: 'T' },
    INSPECTOR:  { name: 'Nguyễn Văn Trần',        label: 'Thanh tra viên',          avatar: 'T' },
    TESTER:     { name: 'Hoàng Kiểm Nghiệm',      label: 'Kiểm nghiệm viên',        avatar: 'H' },
    BUSINESS:   { name: 'Phở Ba Miền (Chủ)',      label: 'Chủ cơ sở',              avatar: 'P' },
  }[role];

  return (
    <aside className="w-[260px] bg-[#0f172a] fixed top-0 left-0 bottom-0 flex flex-col z-50 overflow-y-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-slate-700">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-lg flex-shrink-0">
            🛡️
          </div>
          <div>
            <p className="text-white text-[13px] font-bold leading-tight">FSMS Đà Nẵng</p>
            <p className="text-slate-400 text-[11px]">Quản lý ATTP</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 py-3">
        {navItems.map((item) => (
          <NavGroup key={item.label} item={item} pathname={pathname} />
        ))}
      </nav>

      {/* User footer */}
      <div className="px-4 py-4 border-t border-slate-800 flex-shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-[13px] font-bold text-white flex-shrink-0">
            {roleInfo.avatar}
          </div>
          <div className="overflow-hidden">
            <p className="text-[13px] font-semibold text-slate-200 truncate">{roleInfo.name}</p>
            <p className="text-[11px] text-slate-400">{roleInfo.label}</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
