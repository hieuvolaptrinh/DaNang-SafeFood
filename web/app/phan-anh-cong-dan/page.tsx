'use client';

import { useState } from 'react';
import { Eye, MessageSquare, FileSpreadsheet, Plus, RefreshCw, Printer } from 'lucide-react';
import Link from 'next/link';
import { mockFeedback, CitizenFeedback } from '@/data/mockData';
import DataTable, { Column } from '@/components/DataTable';
import { PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn, SectionCard, GovPagination, StatusBadge, MiniStat } from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

const typeLabel: Record<string, string> = {
  'Khiếu nại vệ sinh': 'Khiếu nại vệ sinh',
  'Hàng giả': 'Hàng giả / Nhái',
  'Ngộ độc thực phẩm': 'Ngộ độc thực phẩm',
  'Câu hỏi chung': 'Câu hỏi chung',
};

const typeStyle: Record<string, { bg: string; color: string; border: string }> = {
  'Khiếu nại vệ sinh':  { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  'Hàng giả':           { bg: '#F0E8FA', color: '#6200CC', border: '#D4A8F5' },
  'Ngộ độc thực phẩm':  { bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  'Câu hỏi chung':      { bg: '#F0F0F0', color: '#555',    border: '#CCC'    },
};

export default function PhanAnhCongDanPage() {
  const [search, setSearch]       = useState('');
  const [typeFilter, setTypeFilter]   = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockFeedback.filter((f: CitizenFeedback) => {
    const matchSearch = !search
      || f.businessReported.toLowerCase().includes(search.toLowerCase())
      || f.submitter.toLowerCase().includes(search.toLowerCase());
    const matchType   = !typeFilter   || f.type   === typeFilter;
    const matchStatus = !statusFilter || f.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const openCount       = mockFeedback.filter((f: CitizenFeedback) => f.status === 'open').length;
  const inProgressCount = mockFeedback.filter((f: CitizenFeedback) => f.status === 'in-progress').length;
  const resolvedCount   = mockFeedback.filter((f: CitizenFeedback) => f.status === 'resolved').length;

  const columns: Column<CitizenFeedback>[] = [
    {
      key: 'id',
      header: 'Mã phản ánh',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'submitter',
      header: 'Người gửi',
      render: r => <span style={{ fontWeight: 500 }}>{r.submitter}</span>,
    },
    {
      key: 'businessReported',
      header: 'Cơ sở bị phản ánh',
      render: r => <span style={{ fontWeight: 600 }}>{r.businessReported}</span>,
    },
    {
      key: 'type',
      header: 'Loại phản ánh',
      render: r => {
        const s = typeStyle[r.type] ?? { bg: '#F0F0F0', color: '#555', border: '#CCC' };
        return (
          <span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: '2px', border: `1px solid ${s.border}`, background: s.bg, color: s.color, fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap' }}>
            {typeLabel[r.type] ?? r.type}
          </span>
        );
      },
    },
    {
      key: 'date',
      header: 'Ngày gửi',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.date}</span>,
    },
    {
      key: 'priority',
      header: 'Ưu tiên',
      render: r => <StatusBadge variant={r.priority} />,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={r.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <Link href={`/phan-anh-cong-dan/${r.id}`}>
            <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
              <Eye style={{ width: 12, height: 12 }} />
            </GovBtn>
          </Link>
          <GovBtn variant="outline" size="sm" title="Phản hồi">
            <MessageSquare style={{ width: 12, height: 12 }} />
          </GovBtn>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tiếp nhận và xử lý phản ánh công dân"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Quản lý khiếu nại và phản ánh từ người dân"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><Printer style={{ width: 12, height: 12 }} /> In báo cáo</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            {/* <GovBtn variant="primary"><Plus style={{ width: 12, height: 12 }} /> Tiếp nhận mới</GovBtn> */}
          </>
        }
      />

      <AlertBanner
        type="info"
        title={`${openCount} phản ánh đang mở cần được xem xét và phản hồi trong vòng 5 ngày làm việc.`}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng phản ánh" value={mockFeedback.length} color="neutral" />
        <MiniStat label="Đang mở" value={openCount} color="orange" note="Cần xử lý" />
        <MiniStat label="Đang xử lý" value={inProgressCount} color="blue" />
        <MiniStat label="Đã giải quyết" value={resolvedCount} color="green" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput
            placeholder="Người gửi, cơ sở bị phản ánh..."
            value={search}
            onChange={setSearch}
            width={220}
          />
        </FilterField>
        <FilterField label="Loại phản ánh">
          <GovSelect
            value={typeFilter}
            onChange={setTypeFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              { value: 'Khiếu nại vệ sinh', label: 'Khiếu nại vệ sinh' },
              { value: 'Hàng giả', label: 'Hàng giả / Nhái' },
              { value: 'Ngộ độc thực phẩm', label: 'Ngộ độc thực phẩm' },
              { value: 'Câu hỏi chung', label: 'Câu hỏi chung' },
            ]}
            width={180}
          />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              { value: 'open', label: 'Đang mở' },
              { value: 'in-progress', label: 'Đang xử lý' },
              { value: 'resolved', label: 'Đã giải quyết' },
            ]}
            width={160}
          />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setTypeFilter(''); setStatusFilter(''); }}>
            Xóa bộ lọc
          </GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách phản ánh (${filtered.length} bản ghi)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / 86 phản ánh`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy phản ánh nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}
