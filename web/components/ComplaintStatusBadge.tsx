import { cn } from '@/lib/utils';
import type { ComplaintStatus } from '@/data/mockData';

const statusConfig: Record<ComplaintStatus, { label: string; className: string }> = {
  pending: {
    label: 'Chưa xử lý',
    className: 'bg-slate-100 text-slate-700 ring-slate-200',
  },
  processing: {
    label: 'Đang xử lý',
    className: 'bg-amber-50 text-amber-800 ring-amber-200',
  },
  resolved: {
    label: 'Đã xử lý',
    className: 'bg-emerald-50 text-emerald-700 ring-emerald-200',
  },
};

interface ComplaintStatusBadgeProps {
  status: ComplaintStatus;
  className?: string;
}

export default function ComplaintStatusBadge({
  status,
  className,
}: ComplaintStatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-bold ring-1 ring-inset',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}
