'use client';

import { useState } from 'react';
import { mockLogs, SystemLog, LogLevel } from '@/data/mockData';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

export default function NhatKyPage() {
  const [search, setSearch] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [serviceFilter, setServiceFilter] = useState('');

  const filtered = mockLogs.filter((l) => {
    const matchSearch =
      !search ||
      l.message.toLowerCase().includes(search.toLowerCase()) ||
      l.user.toLowerCase().includes(search.toLowerCase());
    const matchLevel   = !levelFilter   || l.level   === levelFilter;
    const matchService = !serviceFilter || l.service === serviceFilter;
    return matchSearch && matchLevel && matchService;
  });

  const services = [...new Set(mockLogs.map((l) => l.service))];

  const levelLabel: Record<LogLevel, string> = {
    INFO:  'INFO',
    WARN:  'CẢNH BÁO',
    ERROR: 'LỖI',
  };

  const columns: Column<SystemLog>[] = [
    {
      key: 'timestamp',
      header: 'Thời gian',
      render: (r) => <span className="font-mono text-[11px] text-slate-500">{r.timestamp}</span>,
    },
    {
      key: 'level',
      header: 'Mức độ',
      render: (r) => <Badge variant={r.level} label={levelLabel[r.level as LogLevel]} />,
    },
    { key: 'service', header: 'Dịch vụ' },
    {
      key: 'user',
      header: 'Người dùng',
      render: (r) => <span className="text-slate-500 text-[12px]">{r.user}</span>,
    },
    { key: 'message', header: 'Nội dung sự kiện' },
    {
      key: 'ip',
      header: 'IP',
      render: (r) => <span className="font-mono text-[11px] text-slate-400">{r.ip}</span>,
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Nhật ký Hệ thống</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Đầy đủ lịch sử kiểm toán và sự kiện hệ thống</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            🔃 Làm mới
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            📥 Xuất nhật ký
          </button>
        </div>
      </div>

      {/* Quick counters */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {(['INFO', 'WARN', 'ERROR'] as LogLevel[]).map((lvl) => {
          const count = mockLogs.filter((l) => l.level === lvl).length;
          const color = lvl === 'INFO' ? 'bg-emerald-500' : lvl === 'WARN' ? 'bg-amber-500' : 'bg-red-500';
          const textColor = lvl === 'INFO' ? 'text-emerald-700' : lvl === 'WARN' ? 'text-amber-700' : 'text-red-700';
          const bg = lvl === 'INFO' ? 'bg-emerald-50 border-emerald-200' : lvl === 'WARN' ? 'bg-amber-50 border-amber-200' : 'bg-red-50 border-red-200';
          return (
            <div key={lvl} className={`flex items-center gap-3 p-4 rounded-xl border ${bg}`}>
              <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${color}`} />
              <span className={`text-[13px] font-semibold ${textColor}`}>{levelLabel[lvl]}</span>
              <span className={`ml-auto text-xl font-extrabold font-display ${textColor}`}>{count}</span>
            </div>
          );
        })}
      </div>

      {/* Table */}
      <TableCard
        title="Sự kiện nhật ký"
        controls={
          <>
            <SearchInput placeholder="Tìm nhật ký..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '',      label: 'Tất cả mức độ' },
                { value: 'INFO',  label: 'INFO' },
                { value: 'WARN',  label: 'CẢNH BÁO' },
                { value: 'ERROR', label: 'LỖI' },
              ]}
              onChange={setLevelFilter}
            />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả dịch vụ' },
                ...services.map((s) => ({ value: s, label: s })),
              ]}
              onChange={setServiceFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số 12.480 sự kiện`} />}
      >
        <DataTable
          columns={columns}
          data={filtered as unknown as Record<string, unknown>[]}
          emptyMessage="Không có nhật ký nào"
        />
      </TableCard>
    </div>
  );
}
