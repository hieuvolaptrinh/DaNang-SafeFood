import { ReactNode } from 'react';

export interface Column<T extends object> {
  key: string;
  header: string;
  className?: string;
  align?: 'left' | 'center' | 'right';
  render?: (row: T, index: number) => ReactNode;
}

interface DataTableProps<T extends object> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  className?: string;
  rowKey?: (row: T, index: number) => string;
  onRowClick?: (row: T) => void;
  sttStart?: number;
}

const TH_STYLE: React.CSSProperties = {
  background: '#E8E8E8',
  border: '1px solid #D6D6D6',
  padding: '5px 10px',
  fontSize: '12px',
  fontWeight: 600,
  color: '#333',
  textAlign: 'left',
  whiteSpace: 'nowrap',
};

const TD_STYLE: React.CSSProperties = {
  border: '1px solid #D6D6D6',
  padding: '4px 10px',
  fontSize: '12.5px',
  color: '#222',
  verticalAlign: 'middle',
};

export default function DataTable<T extends object>({
  columns,
  data,
  emptyMessage = 'Không có dữ liệu',
  className,
  rowKey,
  onRowClick,
  sttStart = 1,
}: DataTableProps<T>) {
  return (
    <div style={{ overflowX: 'auto' }} className={className}>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px' }}>
        <thead>
          <tr>
            <th style={{ ...TH_STYLE, textAlign: 'center', width: '36px' }}>STT</th>
            {columns.map((col) => (
              <th
                key={col.key}
                style={{
                  ...TH_STYLE,
                  textAlign: col.align ?? 'left',
                }}
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
                colSpan={columns.length + 1}
                style={{
                  ...TD_STYLE,
                  textAlign: 'center',
                  padding: '20px',
                  color: '#888',
                }}
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, i) => {
              const key = rowKey ? rowKey(row, i) : String(i);
              const isEven = i % 2 === 1;
              return (
                <tr
                  key={key}
                  onClick={() => onRowClick?.(row)}
                  style={{
                    backgroundColor: isEven ? '#FAFAFA' : '#FFF',
                    cursor: onRowClick ? 'pointer' : undefined,
                  }}
                  onMouseEnter={e => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = '#F0F8F0'; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLTableRowElement).style.backgroundColor = isEven ? '#FAFAFA' : '#FFF'; }}
                >
                  <td style={{ ...TD_STYLE, textAlign: 'center', color: '#666' }}>
                    {sttStart + i}
                  </td>
                  {columns.map((col) => (
                    <td
                      key={col.key}
                      style={{
                        ...TD_STYLE,
                        textAlign: col.align ?? 'left',
                      }}
                    >
                      {col.render
                        ? col.render(row, i)
                        : ((row as Record<string, unknown>)[col.key] as ReactNode)}
                    </td>
                  ))}
                </tr>
              );
            })
          )}
        </tbody>
      </table>
    </div>
  );
}
