import { LucideIcon } from 'lucide-react';
import { MiniStat } from '@/components/GovUI';

type CardColor = 'green' | 'blue' | 'orange' | 'red' | 'neutral' | 'purple';

const colorMap: Record<CardColor, 'green' | 'blue' | 'orange' | 'red' | 'neutral'> = {
  green: 'green',
  blue: 'blue',
  orange: 'orange',
  red: 'red',
  neutral: 'neutral',
  purple: 'blue',
};

interface StatCardProps {
  label: string;
  value: string | number;
  color?: CardColor;
  icon?: LucideIcon;
  progress?: number;
  trend?: string;
  trendUp?: boolean;
  trendNote?: string;
}

/** KPI card — API giữ nguyên, style GovUI */
export default function StatCard({
  label,
  value,
  color = 'green',
  trend,
  trendNote,
}: StatCardProps) {
  const note = [trend, trendNote].filter(Boolean).join(' · ') || undefined;
  return (
    <MiniStat
      label={label}
      value={value}
      color={colorMap[color] ?? 'green'}
      note={note}
    />
  );
}

export { MiniStat as StatsCard } from '@/components/GovUI';
