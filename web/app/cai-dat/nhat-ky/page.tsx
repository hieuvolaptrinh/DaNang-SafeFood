'use client';

import { useState } from 'react';
import { mockLogs, SystemLog, LogLevel } from '@/data/mockData';
import DataTable, { Column } from '@/components/DataTable';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat,
} from '@/components/GovUI';
import { RefreshCw, FileSpreadsheet } from 'lucide-react';

const levelLabelMap: Record<LogLevel, string> = {
  INFO: 'INFO',
  WARN: 'CẢNH BÁO',
  ERROR: 'LỖI',
};

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

  const infoCount  = mockLogs.filter(l => l.level === 'INFO').length;
  const warnCount  = mockLogs.filter(l => l.level === 'WARN').length;
  const errorCount = mockLogs.filter(l => l.level === 'ERROR').length;

  const columns: Column<SystemLog>[] = [
    {
      key: 'timestamp',
      header: 'Thời gian',
      render: (r) => <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#555' }}>{r.timestamp}</span>,
    },
    {
      key: 'level',
      header: 'Mức độ',
      render: (r) => <StatusBadge variant={r.level} label={levelLabelMap[r.level as LogLevel]} />,
    },
    { key: 'service', header: 'Dịch vụ' },
    {
      key: 'user',
      header: 'Người dùng',
      render: (r) => <span style={{ fontSize: '12px', color: '#555', fontFamily: 'monospace' }}>{r.user}</span>,
    },
    { key: 'message', header: 'Nội dung sự kiện' },
    {
      key: 'ip',
      header: 'Địa chỉ IP',
      render: (r) => <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888' }}>{r.ip}</span>,
    },
  ];

  return (
    <div>
      <PageHeader
        title="Nhật ký hệ thống"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Đầy đủ lịch sử kiểm toán và sự kiện hệ thống"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất nhật ký</GovBtn>
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Sự kiện INFO" value={infoCount} color="blue" />
        <MiniStat label="Cảnh báo WARN" value={warnCount} color="orange" />
        <MiniStat label="Lỗi ERROR" value={errorCount} color="red" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Nội dung, người dùng..." value={search} onChange={setSearch} width={220} />
        </FilterField>
        <FilterField label="Mức độ">
          <GovSelect
            value={levelFilter}
            onChange={setLevelFilter}
            options={[
              { value: '',      label: '-- Tất cả --' },
              { value: 'INFO',  label: 'INFO' },
              { value: 'WARN',  label: 'CẢNH BÁO' },
              { value: 'ERROR', label: 'LỖI' },
            ]}
            width={140}
          />
        </FilterField>
        <FilterField label="Dịch vụ">
          <GovSelect
            value={serviceFilter}
            onChange={setServiceFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              ...services.map(s => ({ value: s, label: s })),
            ]}
            width={160}
          />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setLevelFilter(''); setServiceFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Sự kiện nhật ký (${filtered.length} mục)`}
        footer={<GovPagination info={`Hiển thị 1–${filtered.length} trong tổng số 12.480 sự kiện`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không có nhật ký nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}
