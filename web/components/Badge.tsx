/** Tương thích API cũ — dùng StatusBadge */
import { StatusBadge } from '@/components/GovUI';

interface BadgeProps {
  variant: string;
  label?: string;
  className?: string;
}

export default function Badge({ variant, label }: BadgeProps) {
  return <StatusBadge variant={variant} label={label} />;
}

export { StatusBadge };
