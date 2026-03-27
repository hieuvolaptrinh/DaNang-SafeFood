import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface Column<T extends object> {
  key: string;
  header: string;
  className?: string;
  render?: (row: T) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
  rowKey?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  rowClassName?: (row: T, index: number) => string;
}

export default function DataTable<T extends object>({
  columns,
  data,
  emptyMessage = 'Không có dữ liệu',
  className,
  rowKey,
  onRowClick,
  rowClassName,
}: DataTableProps<T>) {
  return (
    <div className={cn('overflow-x-auto', className)}>
      <table className="w-full border-collapse">
        <thead>
          <tr>
            {columns.map((col) => (
              <th
                key={col.key}
                className={cn(
                  'bg-slate-50 px-4 py-2.5 text-left text-[11px] font-bold text-slate-500',
                  'uppercase tracking-wide border-b border-slate-200 whitespace-nowrap',
                  col.className
                )}
              >
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-4 py-12 text-center text-sm text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => (
              <tr
                key={rowKey ? rowKey(row, i) : i}
                onClick={() => onRowClick?.(row)}
                className={cn(
                  'border-b border-slate-100 transition-colors last:border-0',
                  onRowClick ? 'cursor-pointer hover:bg-slate-50/60' : 'hover:bg-slate-50/60',
                  rowClassName?.(row, i)
                )}
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn('px-4 py-3 text-sm text-slate-800 align-middle', col.className)}
                  >
                    {col.render
                      ? col.render(row)
                      : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
