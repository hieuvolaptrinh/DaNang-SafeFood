import { cn } from '@/lib/utils';

type BadgeVariant =
  | 'active' | 'suspended' | 'pending' | 'expired'
  | 'pass' | 'fail' | 'scheduled'
  | 'high' | 'medium' | 'low'
  | 'open' | 'in-progress' | 'resolved'
  | 'INFO' | 'WARN' | 'ERROR'
  | 'default';

const variantStyles: Record<BadgeVariant, string> = {
  active:      'bg-emerald-50 text-emerald-800 before:bg-emerald-500',
  pass:        'bg-emerald-50 text-emerald-800 before:bg-emerald-500',
  resolved:    'bg-emerald-50 text-emerald-800 before:bg-emerald-500',
  low:         'bg-emerald-50 text-emerald-800 before:bg-emerald-500',
  INFO:        'bg-emerald-50 text-emerald-800 before:bg-emerald-500',

  suspended:   'bg-red-50 text-red-800 before:bg-red-500',
  fail:        'bg-red-50 text-red-800 before:bg-red-500',
  high:        'bg-red-50 text-red-800 before:bg-red-500',
  ERROR:       'bg-red-50 text-red-800 before:bg-red-500',

  pending:     'bg-amber-50 text-amber-800 before:bg-amber-500',
  medium:      'bg-amber-50 text-amber-800 before:bg-amber-500',
  WARN:        'bg-amber-50 text-amber-800 before:bg-amber-500',
  scheduled:   'bg-amber-50 text-amber-800 before:bg-amber-500',

  expired:     'bg-gray-100 text-gray-600 before:bg-gray-400',

  open:        'bg-blue-50 text-blue-800 before:bg-blue-500',
  'in-progress':'bg-violet-50 text-violet-800 before:bg-violet-500',

  default:     'bg-gray-100 text-gray-600 before:bg-gray-400',
};

const variantLabels: Partial<Record<BadgeVariant, string>> = {
  active:       'Hoạt động',
  suspended:    'Tạm đình chỉ',
  pending:      'Chờ duyệt',
  expired:      'Hết hạn',
  pass:         'Đạt',
  fail:         'Không đạt',
  scheduled:    'Đã lên lịch',
  high:         'Cao',
  medium:       'Trung bình',
  low:          'Thấp',
  open:         'Đang mở',
  'in-progress':'Đang xử lý',
  resolved:     'Đã giải quyết',
};

interface BadgeProps {
  variant: string;
  label?: string;
  className?: string;
}

export default function Badge({ variant, label, className }: BadgeProps) {
  const v = (variant as BadgeVariant) in variantStyles ? (variant as BadgeVariant) : 'default';
  const displayLabel = label ?? variantLabels[v] ?? variant;

  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold',
        'before:content-[""] before:w-[5px] before:h-[5px] before:rounded-full before:flex-shrink-0',
        variantStyles[v],
        className
      )}
    >
      {displayLabel}
    </span>
  );
}
