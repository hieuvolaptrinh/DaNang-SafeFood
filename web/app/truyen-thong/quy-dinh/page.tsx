'use client';

import { useState } from 'react';
import { Eye, Pencil, FileSpreadsheet, RefreshCw, Plus } from 'lucide-react';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import DataTable, { Column } from '@/components/DataTable';

interface Regulation {
  id: string;
  title: string;
  category: string;
  issueDate: string;
  effectiveDate: string;
  status: 'active' | 'draft' | 'expired';
  authority: string;
}

const mockRegulations: Regulation[] = [
  {
    id: 'QD-2025-001',
    title: 'Quy định về kiểm tra an toàn thực phẩm năm 2025',
    category: 'An toàn thực phẩm',
    issueDate: '01/01/2025',
    effectiveDate: '01/02/2025',
    status: 'active',
    authority: 'Sở Y tế Đà Nẵng',
  },
  {
    id: 'QD-2025-002',
    title: 'Hướng dẫn cấp giấy phép kinh doanh thực phẩm',
    category: 'Giấy phép',
    issueDate: '15/02/2025',
    effectiveDate: '01/03/2025',
    status: 'active',
    authority: 'UBND TP. Đà Nẵng',
  },
  {
    id: 'QD-2024-015',
    title: 'Quy định xử phạt vi phạm hành chính lĩnh vực ATTP',
    category: 'Xử phạt',
    issueDate: '10/12/2024',
    effectiveDate: '01/01/2025',
    status: 'active',
    authority: 'Chính phủ',
  },
];

const statusVariantMap: Record<string, string> = {
  active: 'active',
  draft: 'pending',
  expired: 'expired',
};

const statusLabelMap: Record<string, string> = {
  active: 'Đang hiệu lực',
  draft: 'Bản nháp',
  expired: 'Hết hiệu lực',
};

const categoryColors: Record<string, { bg: string; color: string; border: string }> = {
  'An toàn thực phẩm': { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
  'Giấy phép': { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
  'Xử phạt': { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
};

export default function QuyDinhPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const categories = [...new Set(mockRegulations.map((r) => r.category))];

  const filtered = mockRegulations.filter((r) => {
    const matchSearch =
      !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchCategory = !categoryFilter || r.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const columns: Column<Regulation>[] = [
    {
      key: 'id',
      header: 'Mã quy định',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'title',
      header: 'Tiêu đề văn bản',
      render: r => <span style={{ fontWeight: 600, fontSize: '12px' }}>{r.title}</span>,
    },
    {
      key: 'category',
      header: 'Danh mục',
      render: r => {
        const c = categoryColors[r.category] ?? { bg: '#F0F0F0', color: '#555', border: '#CCC' };
        return (
          <span style={{
            display: 'inline-block', padding: '1px 7px', borderRadius: '2px',
            border: `1px solid ${c.border}`, background: c.bg, color: c.color,
            fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap',
          }}>
            {r.category}
          </span>
        );
      },
    },
    {
      key: 'issueDate',
      header: 'Ngày ban hành',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.issueDate}</span>,
    },
    {
      key: 'effectiveDate',
      header: 'Ngày hiệu lực',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.effectiveDate}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={statusVariantMap[r.status]} label={statusLabelMap[r.status]} />,
    },
    {
      key: 'authority',
      header: 'Cơ quan ban hành',
      render: r => <span style={{ fontSize: '12px', color: '#333' }}>{r.authority}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <ActionButtons>
          <GovBtn variant="secondary" size="sm" title="Xem">
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
          <GovBtn variant="outline" size="sm" title="Chỉnh sửa">
            <Pencil style={{ width: 12, height: 12 }} />
          </GovBtn>
        </ActionButtons>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quy định pháp luật về ATTP"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Danh sách văn bản quy phạm pháp luật về an toàn thực phẩm"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            <GovBtn variant="primary"><Plus style={{ width: 12, height: 12 }} /> Thêm quy định</GovBtn>
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng quy định" value={mockRegulations.length} color="neutral" />
        <MiniStat label="Đang hiệu lực" value={mockRegulations.filter(r => r.status === 'active').length} color="green" />
        <MiniStat label="Bản nháp" value={mockRegulations.filter(r => r.status === 'draft').length} color="orange" />
        <MiniStat label="Hết hiệu lực" value={mockRegulations.filter(r => r.status === 'expired').length} color="neutral" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput
            placeholder="Mã quy định, tiêu đề..."
            value={search}
            onChange={setSearch}
            width={240}
          />
        </FilterField>
        <FilterField label="Danh mục">
          <GovSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              ...categories.map(c => ({ value: c, label: c })),
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
              { value: 'active', label: 'Đang hiệu lực' },
              { value: 'draft', label: 'Bản nháp' },
              { value: 'expired', label: 'Hết hiệu lực' },
            ]}
            width={160}
          />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); setCategoryFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách quy định pháp luật (${filtered.length} văn bản)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${mockRegulations.length} quy định`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy quy định nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}
