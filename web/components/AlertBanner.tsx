import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type AlertType = 'warning' | 'danger' | 'info' | 'success';

const alertStyles: Record<AlertType, { wrapper: string; icon: string }> = {
  warning: { wrapper: 'bg-amber-50 border-amber-200', icon: 'text-amber-500' },
  danger:  { wrapper: 'bg-red-50 border-red-200',     icon: 'text-red-500' },
  info:    { wrapper: 'bg-blue-50 border-blue-200',   icon: 'text-blue-500' },
  success: { wrapper: 'bg-emerald-50 border-emerald-200', icon: 'text-emerald-500' },
};

const alertIcons: Record<AlertType, ReactNode> = {
  warning: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
    </svg>
  ),
  danger: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
    </svg>
  ),
  info: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  success: (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-5 h-5 flex-shrink-0 mt-0.5">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
};

interface AlertBannerProps {
  type?: AlertType;
  title: string;
  message?: string;
  className?: string;
}

export default function AlertBanner({ type = 'info', title, message, className }: AlertBannerProps) {
  const s = alertStyles[type];
  return (
    <div className={cn('flex items-start gap-3 p-4 rounded-xl border mb-5', s.wrapper, className)}>
      <span className={s.icon}>{alertIcons[type]}</span>
      <div>
        <p className="text-sm font-bold text-slate-800">{title}</p>
        {message && <p className="text-sm text-slate-500 mt-0.5">{message}</p>}
      </div>
    </div>
  );
}
