'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Building2,
  ClipboardCheck,
  AlertTriangle,
  Megaphone,
  Settings,
  ChevronRight,
  PanelLeftClose,
  PanelLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useRole } from '@/lib/RoleContext';
import { useSidebar } from '@/lib/SidebarContext';
import { roleNavMap, NavItem } from '@/data/mockData';

const iconMap: Record<string, React.ReactNode> = {
  grid:       <LayoutDashboard className="w-4 h-4" strokeWidth={1.75} />,
  building:   <Building2       className="w-4 h-4" strokeWidth={1.75} />,
  clipboard:  <ClipboardCheck  className="w-4 h-4" strokeWidth={1.75} />,
  inspection: <ClipboardCheck  className="w-4 h-4" strokeWidth={1.75} />,
  alert:      <AlertTriangle   className="w-4 h-4" strokeWidth={1.75} />,
  chart:      <LayoutDashboard className="w-4 h-4" strokeWidth={1.75} />,
  user:       <LayoutDashboard className="w-4 h-4" strokeWidth={1.75} />,
  settings:   <Settings        className="w-4 h-4" strokeWidth={1.75} />,
  megaphone:  <Megaphone       className="w-4 h-4" strokeWidth={1.75} />,
};

function SubLink({
  label,
  href,
  active,
  collapsed,
}: {
  label: string;
  href: string;
  active: boolean;
  collapsed: boolean;
}) {
  if (collapsed) return null;
  return (
    <Link
      href={href}
      className={cn(
        'block py-1.5 pl-9 pr-2 text-[12px] border-l-2 ml-2',
        active
          ? 'border-[#90EE90] bg-[#EAF7EA] text-[#006400] font-medium'
          : 'border-transparent text-white/75 hover:bg-white/8 hover:text-white'
      )}
    >
      {label}
    </Link>
  );
}

function NavGroup({
  item,
  pathname,
  collapsed,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
}) {
  const hasActive = item.href
    ? pathname === item.href || pathname.startsWith(item.href + '/')
    : item.children?.some((c) => pathname.startsWith(c.href));
  const [open, setOpen] = useState(hasActive ?? false);

  if (item.href) {
    const active =
      pathname === item.href || pathname.startsWith(item.href + '/');
    return (
      <Link
        href={item.href}
        title={collapsed ? item.label : undefined}
        className={cn(
          'flex items-center gap-2.5 mx-1 px-2 py-2 text-[12.5px] font-medium border border-transparent',
          active
            ? 'bg-[#EAF7EA] text-[#006400] border-[#C8E6C9]'
            : 'text-white/90 hover:bg-white/10',
          collapsed && 'justify-center px-0'
        )}
      >
        <span className="shrink-0">{iconMap[item.icon]}</span>
        {!collapsed && <span className="truncate">{item.label}</span>}
      </Link>
    );
  }

  return (
    <div className="border-b border-white/10 last:border-0">
      <button
        type="button"
        onClick={() => !collapsed && setOpen(!open)}
        title={collapsed ? item.label : undefined}
        className={cn(
          'w-full flex items-center gap-2.5 mx-1 px-2 py-2 text-[12.5px] font-medium text-left',
          hasActive ? 'text-white' : 'text-white/90 hover:bg-white/10',
          collapsed && 'justify-center'
        )}
      >
        <span className="shrink-0">{iconMap[item.icon]}</span>
        {!collapsed && (
          <>
            <span className="flex-1 truncate text-left">{item.label}</span>
            <ChevronRight
              className={cn('w-3.5 h-3.5 opacity-70 shrink-0', open && 'rotate-90')}
            />
          </>
        )}
      </button>
      {open && !collapsed && item.children && (
        <div className="pb-1">
          {item.children.map((child) => (
            <SubLink
              key={child.href}
              {...child}
              active={pathname.startsWith(child.href)}
              collapsed={collapsed}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default function Sidebar() {
  const { role } = useRole();
  const pathname = usePathname();
  const { collapsed, toggle } = useSidebar();
  const navItems = roleNavMap[role] ?? [];

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 bottom-0 z-40 flex flex-col bg-[#006400] border-r border-[#004d00] transition-[width] duration-150',
        collapsed ? 'w-[52px]' : 'w-[220px]'
      )}
    >
      {/* Brand / System identity — PHẢI nằm trong sidebar */}
      <div
        className={cn(
          'shrink-0 border-b border-white/15 bg-[#004d00] py-3',
          collapsed ? 'px-2 flex flex-col items-center gap-1' : 'px-3'
        )}
      >
        {!collapsed ? (
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-sm border border-white/20 bg-white/10 flex items-center justify-center overflow-hidden flex-shrink-0">
              <Image
                src="/logo-attp.png"
                alt="Logo Chi cục ATTP"
                width={28}
                height={28}
                className="object-contain"
              />
            </div>
            <div className="min-w-0">
              <p className="text-[10px] text-white/65 uppercase tracking-wide leading-tight">
                Sở Y tế TP. Đà Nẵng
              </p>
              <p className="text-[11.5px] font-bold text-white leading-tight truncate">
                Chi cục ATTP TP. Đà Nẵng
              </p>
              <p className="text-[9.5px] text-white/55 leading-tight truncate">
                Hệ thống quản lý ATTP
              </p>
            </div>
          </div>
        ) : (
          <>
            <div className="w-8 h-8 rounded-sm border border-white/20 bg-white/10 flex items-center justify-center overflow-hidden">
              <Image
                src="/logo-attp.png"
                alt="Logo ATTP"
                width={24}
                height={24}
                className="object-contain"
              />
            </div>
            <p className="text-[9px] font-bold text-white/70 leading-tight text-center">ATTP</p>
          </>
        )}
      </div>

      <nav
        className="flex-1 overflow-y-auto py-1 scrollbar-thin"
        aria-label="Menu điều hướng"
      >
        {navItems.map((item) => (
          <NavGroup
            key={item.label}
            item={item}
            pathname={pathname}
            collapsed={collapsed}
          />
        ))}
      </nav>

      <div className="shrink-0 border-t border-white/15">
        <button
          type="button"
          onClick={toggle}
          className="w-full flex items-center justify-center gap-1.5 py-2 text-[11px] text-white/75 hover:text-white hover:bg-white/10"
          aria-label={collapsed ? 'Mở rộng menu' : 'Thu gọn menu'}
        >
          {collapsed ? (
            <PanelLeft className="w-4 h-4" />
          ) : (
            <>
              <PanelLeftClose className="w-4 h-4" />
              <span>Thu gọn</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
