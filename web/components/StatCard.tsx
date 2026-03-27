import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

type CardColor = 'blue' | 'green' | 'orange' | 'red' | 'purple';

const colorMap: Record<CardColor, { bar: string; icon: string; iconBg: string }> = {
  blue:   { bar: 'bg-blue-600',   icon: 'text-blue-600',   iconBg: 'bg-blue-50' },
  green:  { bar: 'bg-emerald-500',icon: 'text-emerald-600',iconBg: 'bg-emerald-50' },
  orange: { bar: 'bg-amber-500',  icon: 'text-amber-600',  iconBg: 'bg-amber-50' },
  red:    { bar: 'bg-red-500',    icon: 'text-red-600',    iconBg: 'bg-red-50' },
  purple: { bar: 'bg-violet-600', icon: 'text-violet-600', iconBg: 'bg-violet-50' },
};

interface StatCardProps {
  label: string;
  value: string | number;
  color?: CardColor;
  icon?: ReactNode;
  trend?: string;
  trendUp?: boolean;
  trendNote?: string;
}

export default function StatCard({
  label,
  value,
  color = 'blue',
  icon,
  trend,
  trendUp,
  trendNote,
}: StatCardProps) {
  const c = colorMap[color];
  return (
    <div className="relative bg-white border border-slate-200 rounded-xl overflow-hidden shadow-sm">
      <div className={cn('h-[3px]', c.bar)} />
      <div className="p-5">
        <div className="flex items-center justify-between mb-3">
          <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
            {label}
          </span>
          {icon && (
            <div className={cn('w-9 h-9 rounded-lg flex items-center justify-center', c.iconBg, c.icon)}>
              {icon}
            </div>
          )}
        </div>
        <div className="text-3xl font-extrabold text-slate-900 font-mono">{value}</div>
        {trend && (
          <div
            className={cn(
              'inline-flex items-center gap-1 text-xs font-semibold mt-1',
              trendUp ? 'text-emerald-600' : 'text-red-500'
            )}
          >
            {trend}
            {trendNote && <span className="text-slate-400 font-normal ml-1">{trendNote}</span>}
          </div>
        )}
      </div>
    </div>
  );
}
