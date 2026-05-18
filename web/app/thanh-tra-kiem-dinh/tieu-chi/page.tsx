'use client';

import { useState } from 'react';
import { Plus, Eye, Pencil, RefreshCw, FileSpreadsheet } from 'lucide-react';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import DataTable, { Column } from '@/components/DataTable';

interface TieuChi {
  id: string;
  name: string;
  category: string;
  maxScore: number;
  weight: string;
  status: 'active' | 'draft' | 'archived';
  issuedDate: string;
  issuedBy: string;
  description: string;
}

const mockTieuChi: TieuChi[] = [
  {
    id: 'TC-001',
    name: 'Vệ sinh cơ sở vật chất',
    category: 'Điều kiện vệ sinh',
    maxScore: 30,
    weight: '30%',
    status: 'active',
    issuedDate: '01/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Đánh giá điều kiện vệ sinh khu vực chế biến, bảo quản và phục vụ thực phẩm.',
  },
  {
    id: 'TC-002',
    name: 'An toàn thực phẩm trong chế biến',
    category: 'Quy trình chế biến',
    maxScore: 25,
    weight: '25%',
    status: 'active',
    issuedDate: '01/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Kiểm tra quy trình chế biến thực phẩm, nhiệt độ bảo quản và phân tách thực phẩm sống/chín.',
  },
  {
    id: 'TC-003',
    name: 'Hồ sơ pháp lý và chứng nhận',
    category: 'Pháp lý',
    maxScore: 20,
    weight: '20%',
    status: 'active',
    issuedDate: '01/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Xác minh giấy phép kinh doanh, chứng nhận ATTP và sổ sức khỏe nhân viên.',
  },
  {
    id: 'TC-004',
    name: 'Nguồn gốc nguyên liệu',
    category: 'Truy xuất nguồn gốc',
    maxScore: 15,
    weight: '15%',
    status: 'active',
    issuedDate: '01/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Kiểm tra hóa đơn, hợp đồng và nhật ký nhập hàng đảm bảo truy xuất nguồn gốc nguyên liệu.',
  },
  {
    id: 'TC-005',
    name: 'Đào tạo và tập huấn ATTP',
    category: 'Nhân sự',
    maxScore: 10,
    weight: '10%',
    status: 'active',
    issuedDate: '01/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Xác nhận nhân viên đã được đào tạo kiến thức ATTP và có chứng chỉ hợp lệ.',
  },
  {
    id: 'TC-006',
    name: 'Xử lý rác thải và nước thải',
    category: 'Môi trường',
    maxScore: 0,
    weight: 'Dự thảo',
    status: 'draft',
    issuedDate: '15/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Đánh giá hệ thống xử lý rác thải thực phẩm và nước thải đảm bảo tiêu chuẩn môi trường.',
  },
];

const categoryColors: Record<string, { bg: string; color: string; border: string }> = {
  'Điều kiện vệ sinh': { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
  'Quy trình chế biến': { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
  'Pháp lý': { bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  'Truy xuất nguồn gốc': { bg: '#F0E8FA', color: '#6200CC', border: '#D4A8F5' },
  'Nhân sự': { bg: '#F0F0F0', color: '#555', border: '#CCC' },
  'Môi trường': { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
};

const statusVariant: Record<string, string> = {
  active: 'active',
  draft: 'pending',
  archived: 'expired',
};
const statusLabel: Record<string, string> = {
  active: 'Đang áp dụng',
  draft: 'Bản nháp',
  archived: 'Lưu trữ',
};

export default function TieuChiDanhGiaPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = mockTieuChi.filter(tc => {
    const matchSearch = !search ||
      tc.id.toLowerCase().includes(search.toLowerCase()) ||
      tc.name.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || tc.status === statusFilter;
    const matchCategory = !categoryFilter || tc.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const activeCount = mockTieuChi.filter(tc => tc.status === 'active').length;
  const totalScore = mockTieuChi.filter(tc => tc.status === 'active').reduce((s, tc) => s + tc.maxScore, 0);

  const columns: Column<TieuChi>[] = [
    {
      key: 'id',
      header: 'Mã TC',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'name',
      header: 'Tên tiêu chí',
      render: r => (
        <div>
          <p style={{ fontWeight: 600, fontSize: '13px', color: '#222' }}>{r.name}</p>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{r.description}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Nhóm',
      render: r => {
        const cfg = categoryColors[r.category] ?? { bg: '#F0F0F0', color: '#555', border: '#CCC' };
        return (
          <span style={{
            display: 'inline-block', padding: '1px 7px', borderRadius: '2px',
            border: `1px solid ${cfg.border}`, background: cfg.bg, color: cfg.color,
            fontSize: '11px', fontWeight: 500,
          }}>
            {r.category}
          </span>
        );
      },
    },
    {
      key: 'maxScore',
      header: 'Điểm tối đa',
      render: r => (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: r.status === 'active' ? '#006400' : '#888' }}>
            {r.status === 'active' ? r.maxScore : '—'}
          </span>
          <p style={{ fontSize: '10px', color: '#888' }}>{r.weight}</p>
        </div>
      ),
    },
    {
      key: 'issuedDate',
      header: 'Ngày ban hành',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.issuedDate}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={statusVariant[r.status]} label={statusLabel[r.status]} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <ActionButtons>
          <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
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
        title="Tiêu chí đánh giá ATVSTP"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Ban hành và quản lý tiêu chí đánh giá an toàn vệ sinh thực phẩm"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            <GovBtn variant="primary"><Plus style={{ width: 12, height: 12 }} /> Ban hành tiêu chí mới</GovBtn>
          </ActionButtons>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng tiêu chí" value={mockTieuChi.length} color="neutral" />
        <MiniStat label="Đang áp dụng" value={activeCount} color="green" />
        <MiniStat label="Tổng điểm tối đa" value={`${totalScore}/100`} color="blue" />
        <MiniStat label="Bản nháp" value={mockTieuChi.filter(tc => tc.status === 'draft').length} color="orange" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Mã tiêu chí, tên tiêu chí..." value={search} onChange={setSearch} width={240} />
        </FilterField>
        <FilterField label="Nhóm tiêu chí">
          <GovSelect value={categoryFilter} onChange={setCategoryFilter} options={[
            { value: '', label: '-- Tất cả --' },
            ...Object.keys(categoryColors).map(c => ({ value: c, label: c })),
          ]} width={180} />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect value={statusFilter} onChange={setStatusFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'active', label: 'Đang áp dụng' },
            { value: 'draft', label: 'Bản nháp' },
            { value: 'archived', label: 'Lưu trữ' },
          ]} width={160} />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); setCategoryFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Phân bổ điểm */}
      <SectionCard title="Cơ cấu phân bổ điểm đánh giá hiện hành">
        <div style={{ padding: '10px 12px' }}>
          <div style={{ display: 'flex', height: '16px', borderRadius: '2px', overflow: 'hidden', gap: '2px', marginBottom: '10px' }}>
            {mockTieuChi.filter(tc => tc.status === 'active').map((tc, i) => {
              const colors = ['#008000', '#005A9E', '#CC6600', '#6200CC', '#555'];
              return (
                <div key={i} style={{ flex: tc.maxScore, background: colors[i % colors.length], height: '100%' }} title={`${tc.name}: ${tc.maxScore} điểm`} />
              );
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {mockTieuChi.filter(tc => tc.status === 'active').map((tc, i) => {
              const colors = ['#008000', '#005A9E', '#CC6600', '#6200CC', '#555'];
              return (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '1px', background: colors[i % colors.length], flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#555' }}>{tc.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#222' }}>{tc.maxScore} điểm</span>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      {/* Bảng tiêu chí */}
      <SectionCard
        title={`Danh sách tiêu chí đánh giá (${filtered.length} tiêu chí)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${mockTieuChi.length} tiêu chí`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy tiêu chí nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}
