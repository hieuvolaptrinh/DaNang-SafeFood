'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Pencil, FileSpreadsheet, RefreshCw } from 'lucide-react';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat,
} from '@/components/GovUI';
import DataTable, { Column } from '@/components/DataTable';

interface ViolationFix {
  id: string;
  businessName: string;
  violationType: string;
  severity: 'nhẹ' | 'trung bình' | 'nghiêm trọng';
  fixStatus: 'pending' | 'in_progress' | 'completed';
  deadline: string;
  updatedDate: string;
}

const mockViolationFixes: ViolationFix[] = [
  {
    id: 'VP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh an toàn thực phẩm',
    severity: 'nghiêm trọng',
    fixStatus: 'in_progress',
    deadline: '15/04/2025',
    updatedDate: '22/03/2025',
  },
  {
    id: 'VP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá',
    severity: 'nhẹ',
    fixStatus: 'completed',
    deadline: '10/03/2025',
    updatedDate: '08/03/2025',
  },
  {
    id: 'VP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng nguyên liệu hết hạn',
    severity: 'trung bình',
    fixStatus: 'pending',
    deadline: '30/03/2025',
    updatedDate: '25/03/2025',
  },
  {
    id: 'VP-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    violationType: 'Thiếu giấy phép kinh doanh',
    severity: 'nghiêm trọng',
    fixStatus: 'in_progress',
    deadline: '20/04/2025',
    updatedDate: '18/03/2025',
  },
];

const fixStatusVariant: Record<string, string> = {
  pending: 'pending',
  in_progress: 'in-progress',
  completed: 'resolved',
};

const fixStatusLabel: Record<string, string> = {
  pending: 'Chờ khắc phục',
  in_progress: 'Đang khắc phục',
  completed: 'Đã hoàn thành',
};

export default function KhacPhucPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const filtered = mockViolationFixes.filter((v) => {
    const matchSearch = !search ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || v.fixStatus === statusFilter;
    const matchSeverity = !severityFilter || v.severity === severityFilter;
    return matchSearch && matchStatus && matchSeverity;
  });

  const totalFixes = mockViolationFixes.length;
  const pendingCount = mockViolationFixes.filter(v => v.fixStatus === 'pending').length;
  const inProgressCount = mockViolationFixes.filter(v => v.fixStatus === 'in_progress').length;
  const completedCount = mockViolationFixes.filter(v => v.fixStatus === 'completed').length;

  const columns: Column<ViolationFix>[] = [
    {
      key: 'id',
      header: 'Mã vi phạm',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: r => <span style={{ fontWeight: 600 }}>{r.businessName}</span>,
    },
    {
      key: 'violationType',
      header: 'Loại vi phạm',
    },
    {
      key: 'severity',
      header: 'Mức độ',
      render: r => <StatusBadge variant={r.severity} />,
    },
    {
      key: 'fixStatus',
      header: 'Trạng thái khắc phục',
      render: r => <StatusBadge variant={fixStatusVariant[r.fixStatus]} label={fixStatusLabel[r.fixStatus]} />,
    },
    {
      key: 'deadline',
      header: 'Hạn khắc phục',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.deadline}</span>,
    },
    {
      key: 'updatedDate',
      header: 'Ngày cập nhật',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#555' }}>{r.updatedDate}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <Link href={`/vi-pham/khac-phuc/${r.id}`}>
            <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
              <Eye style={{ width: 12, height: 12 }} />
            </GovBtn>
          </Link>
          <GovBtn variant="outline" size="sm" title="Chỉnh sửa">
            <Pencil style={{ width: 12, height: 12 }} />
          </GovBtn>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Theo dõi khắc phục vi phạm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Tiến độ khắc phục vi phạm của các cơ sở kinh doanh"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng hồ sơ" value={totalFixes} color="neutral" />
        <MiniStat label="Chờ khắc phục" value={pendingCount} color="orange" />
        <MiniStat label="Đang khắc phục" value={inProgressCount} color="blue" />
        <MiniStat label="Đã hoàn thành" value={completedCount} color="green" />
      </div>

      {/* Tỷ lệ phân bổ */}
      <div style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '10px 12px', marginBottom: '10px' }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '8px' }}>
          Tỷ lệ khắc phục theo mức độ vi phạm
        </p>
        <div style={{ display: 'flex', height: '8px', borderRadius: '2px', overflow: 'hidden', gap: '2px', marginBottom: '8px' }}>
          {[
            { color: '#CC0000', flex: mockViolationFixes.filter(v => v.severity === 'nghiêm trọng').length },
            { color: '#CC6600', flex: mockViolationFixes.filter(v => v.severity === 'trung bình').length },
            { color: '#888', flex: mockViolationFixes.filter(v => v.severity === 'nhẹ').length },
          ].map((seg, i) => (
            <div key={i} style={{ flex: seg.flex, background: seg.color, height: '100%' }} />
          ))}
        </div>
        <div style={{ display: 'flex', gap: '16px' }}>
          {[
            { color: '#CC0000', label: 'Nghiêm trọng', val: mockViolationFixes.filter(v => v.severity === 'nghiêm trọng').length },
            { color: '#CC6600', label: 'Trung bình', val: mockViolationFixes.filter(v => v.severity === 'trung bình').length },
            { color: '#888', label: 'Nhẹ', val: mockViolationFixes.filter(v => v.severity === 'nhẹ').length },
          ].map(item => (
            <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span style={{ width: 10, height: 10, borderRadius: '1px', background: item.color, flexShrink: 0 }} />
              <span style={{ fontSize: '12px', color: '#555' }}>{item.label}</span>
              <span style={{ fontSize: '12px', fontWeight: 600, color: '#222' }}>{item.val} hồ sơ</span>
            </div>
          ))}
        </div>
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Mã vi phạm, tên cơ sở..." value={search} onChange={setSearch} width={220} />
        </FilterField>
        <FilterField label="Mức độ vi phạm">
          <GovSelect value={severityFilter} onChange={setSeverityFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'nhẹ', label: 'Nhẹ' },
            { value: 'trung bình', label: 'Trung bình' },
            { value: 'nghiêm trọng', label: 'Nghiêm trọng' },
          ]} width={160} />
        </FilterField>
        <FilterField label="Trạng thái khắc phục">
          <GovSelect value={statusFilter} onChange={setStatusFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'pending', label: 'Chờ khắc phục' },
            { value: 'in_progress', label: 'Đang khắc phục' },
            { value: 'completed', label: 'Đã hoàn thành' },
          ]} width={180} />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); setSeverityFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Tất cả yêu cầu khắc phục (${filtered.length} hồ sơ)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${totalFixes} hồ sơ`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy hồ sơ khắc phục nào phù hợp điều kiện."
        />
      </SectionCard>
    </div>
  );
}