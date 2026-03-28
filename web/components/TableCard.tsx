import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface TableCardProps {
  title: string;
  children: ReactNode;
  actions?: ReactNode;
  controls?: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export default function TableCard({
  title,
  children,
  actions,
  controls,
  footer,
  className,
}: TableCardProps) {
  return (
    <div className={cn('bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden', className)}>
      {/* Header */}
      <div className="px-5 py-4 border-b border-slate-200 flex items-center justify-between gap-3 flex-wrap">
        <span className="text-sm font-bold text-slate-800">{title}</span>
        <div className="flex items-center gap-2 flex-wrap">
          {controls}
          {actions}
        </div>
      </div>

      {/* Content */}
      {children}

      {/* Footer / Pagination */}
      {footer && (
        <div className="px-5 py-3 border-t border-slate-200 flex items-center justify-between text-sm text-slate-500">
          {footer}
        </div>
      )}
    </div>
  );
}

// ── Search Input ──
interface SearchInputProps {
  placeholder?: string;
  onChange?: (value: string) => void;
}
export function SearchInput({ placeholder = 'Tìm kiếm...', onChange }: SearchInputProps) {
  return (
    <div className="relative">
      <svg
        className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400 pointer-events-none"
        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
      >
        <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
      </svg>
      <input
        type="text"
        placeholder={placeholder}
        onChange={(e) => onChange?.(e.target.value)}
        className="bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-[13px] text-slate-800
                   outline-none focus:border-blue-500 w-48 transition-colors"
      />
    </div>
  );
}

// ── Filter Select ──
interface FilterSelectProps {
  options: { value: string; label: string }[];
  onChange?: (value: string) => void;
  className?: string;
}
export function FilterSelect({ options, onChange, className }: FilterSelectProps) {
  return (
    <select
      onChange={(e) => onChange?.(e.target.value)}
      className={cn(
        'bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[13px] text-slate-700',
        'outline-none focus:border-blue-500 cursor-pointer appearance-none pr-7',
        'bg-[url("data:image/svg+xml,%3Csvg xmlns=\'http://www.w3.org/2000/svg\' width=\'12\' height=\'12\' viewBox=\'0 0 24 24\' fill=\'none\' stroke=\'%2364748b\' stroke-width=\'2\'%3E%3Cpath d=\'M6 9l6 6 6-6\'/%3E%3C/svg%3E")]',
        'bg-no-repeat bg-[right_8px_center]',
        className
      )}
    >
      {options.map((o) => (
        <option key={o.value} value={o.value}>{o.label}</option>
      ))}
    </select>
  );
}

// ── Pagination ──
interface PaginationProps {
  info: string;
  total?: number;
  page?: number;
}
export function Pagination({ info }: PaginationProps) {
  return (
    <>
      <span>{info}</span>
      <div className="flex gap-1">
        {['‹', '1', '2', '3', '›'].map((p, i) => (
          <button
            key={i}
            className={cn(
              'w-8 h-8 rounded-md border border-slate-200 text-[13px] cursor-pointer transition-colors',
              p === '1' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-slate-700 hover:border-blue-400 hover:text-blue-600'
            )}
          >
            {p}
          </button>
        ))}
      </div>
    </>
  );
}
