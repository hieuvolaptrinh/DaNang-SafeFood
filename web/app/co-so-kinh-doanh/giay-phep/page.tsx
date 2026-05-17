'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Pencil, FileSpreadsheet, Plus, RefreshCw, Printer } from 'lucide-react';
import DataTable, { Column } from '@/components/DataTable';
import { PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn, SectionCard, GovPagination, StatusBadge, MiniStat } from '@/components/GovUI';

interface License {
  id: string;
  businessName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'revoked';
  district: string;
}

const mockLicenses: License[] = [
  { id: 'GP-2025001', businessName: 'Nhà hàng Hải Sản Biển Xanh', type: 'Giấy phép kinh doanh thực phẩm', issueDate: '10/01/2025', expiryDate: '09/01/2026', status: 'valid',   district: 'Hải Châu' },
  { id: 'GP-2025002', businessName: 'Quán Ăn Gia Đình Việt',       type: 'Giấy phép VSATTP',               issueDate: '15/02/2025', expiryDate: '14/02/2025', status: 'expired', district: 'Thanh Khê' },
  { id: 'GP-2025003', businessName: 'Cửa hàng Thực phẩm Organic',  type: 'Giấy phép kinh doanh thực phẩm', issueDate: '20/03/2025', expiryDate: '19/03/2026', status: 'valid',   district: 'Ngũ Hành Sơn' },
  { id: 'GP-2025004', businessName: 'Siêu thị Mini Mart Đà Nẵng',  type: 'Giấy phép kinh doanh thực phẩm', issueDate: '05/01/2025', expiryDate: '04/01/2026', status: 'revoked', district: 'Sơn Trà' },
  { id: 'GP-2025005', businessName: 'Công ty Hải Sản Đà Nẵng',     type: 'Giấy phép chế biến thực phẩm',   issueDate: '01/06/2024', expiryDate: '01/06/2025', status: 'expired', district: 'Thanh Khê' },
];

const licenseStatusMap: Record<string, string> = {
  valid:   'active',
  expired: 'expired',
  revoked: 'suspended',
};

const districts = [...new Set(mockLicenses.map(l => l.district))];

export default function GiayPhepPage() {
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const filtered = mockLicenses.filter(l => {
    const matchSearch   = !search       || l.id.toLowerCase().includes(search.toLowerCase()) || l.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = !statusFilter   || l.status   === statusFilter;
    const matchDistrict = !districtFilter || l.district === districtFilter;
    return matchSearch && matchStatus && matchDistrict;
  });

  const columns: Column<License>[] = [
    {
      key: 'id',
      header: 'Mã giấy phép',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: r => <span style={{ fontWeight: 600 }}>{r.businessName}</span>,
    },
    { key: 'type', header: 'Loại giấy phép' },
    {
      key: 'issueDate',
      header: 'Ngày cấp',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.issueDate}</span>,
    },
    {
      key: 'expiryDate',
      header: 'Ngày hết hạn',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: r.status === 'expired' ? '#CC0000' : '#222', fontWeight: r.status === 'expired' ? 600 : 400 }}>{r.expiryDate}</span>,
    },
    { key: 'district', header: 'Quận/Huyện' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={licenseStatusMap[r.status] ?? r.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <Link href={`/co-so-kinh-doanh/giay-phep/${r.id}`}>
            <GovBtn variant="secondary" size="sm" title="Xem chi tiết"><Eye style={{ width: 12, height: 12 }} /></GovBtn>
          </Link>
          <GovBtn variant="outline" size="sm" title="Chỉnh sửa"><Pencil style={{ width: 12, height: 12 }} /></GovBtn>
        </div>
      ),
    },
  ];

  const validCount   = mockLicenses.filter(l => l.status === 'valid').length;
  const expiredCount = mockLicenses.filter(l => l.status === 'expired').length;
  const revokedCount = mockLicenses.filter(l => l.status === 'revoked').length;

  return (
    <div>
      <PageHeader
        title="Quản lý giấy phép kinh doanh thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Danh sách giấy phép đã cấp"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><Printer style={{ width: 12, height: 12 }} /> In báo cáo</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            <GovBtn variant="primary"><Plus style={{ width: 12, height: 12 }} /> Cấp mới</GovBtn>
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng giấy phép" value="1.245" color="neutral" />
        <MiniStat label="Còn hiệu lực" value={validCount} color="green" />
        <MiniStat label="Hết hạn" value={expiredCount} color="orange" note="Cần gia hạn" />
        <MiniStat label="Đã thu hồi" value={revokedCount} color="red" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Mã giấy phép, tên cơ sở..." value={search} onChange={setSearch} width={220} />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect value={statusFilter} onChange={setStatusFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'valid',   label: 'Còn hiệu lực' },
            { value: 'expired', label: 'Hết hạn' },
            { value: 'revoked', label: 'Đã thu hồi' },
          ]} width={150} />
        </FilterField>
        <FilterField label="Quận/Huyện">
          <GovSelect value={districtFilter} onChange={setDistrictFilter} options={[
            { value: '', label: '-- Tất cả --' },
            ...districts.map(d => ({ value: d, label: d })),
          ]} width={160} />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); setDistrictFilter(''); }}>Xóa bộ lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách giấy phép (${filtered.length} bản ghi)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / 1.245 giấy phép`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy giấy phép nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}