'use client';

import { useState } from 'react';
import { mockBusinesses, Business } from '@/data/mockData';
import { Building2, CheckCircle2, AlertTriangle, FileClock, Plus, FileSpreadsheet, Printer, RefreshCw, Eye, Pencil, Trash2 } from 'lucide-react';
import DataTable, { Column } from '@/components/DataTable';
import { PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn, SectionCard, GovPagination, StatusBadge, MiniStat } from '@/components/GovUI';

export default function CoSoKinhDoanhPage() {
  const [search, setSearch]             = useState('');
  const [statusFilter, setStatusFilter]   = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const filtered = mockBusinesses.filter((b) => {
    const matchSearch   = !search         || b.name.toLowerCase().includes(search.toLowerCase()) || b.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus   = !statusFilter   || b.status   === statusFilter;
    const matchDistrict = !districtFilter || b.district === districtFilter;
    return matchSearch && matchStatus && matchDistrict;
  });

  const districts = [...new Set(mockBusinesses.map((b) => b.district))];

  const columns: Column<Business>[] = [
    {
      key: 'id',
      header: 'Mã cơ sở',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'name',
      header: 'Tên cơ sở',
      render: r => <span style={{ fontWeight: 600 }}>{r.name}</span>,
    },
    { key: 'category', header: 'Loại hình' },
    { key: 'district', header: 'Quận/Huyện' },
    {
      key: 'license',
      header: 'Số giấy phép',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.license}</span>,
    },
    {
      key: 'expiry',
      header: 'Ngày hết hạn',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.expiry}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={r.status} />,
    },
    {
      key: 'lastInspection',
      header: 'Thanh tra cuối',
      render: r => <span style={{ fontSize: '12px', color: '#555' }}>{r.lastInspection}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <GovBtn variant="secondary" size="sm" title="Xem chi tiết"><Eye style={{ width: 12, height: 12 }} /></GovBtn>
          <GovBtn variant="outline"   size="sm" title="Chỉnh sửa"><Pencil style={{ width: 12, height: 12 }} /></GovBtn>
          <GovBtn variant="danger"    size="sm" title="Xóa"><Trash2 style={{ width: 12, height: 12 }} /></GovBtn>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý cơ sở kinh doanh thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Danh sách cơ sở đã đăng ký"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><Printer style={{ width: 12, height: 12 }} /> In báo cáo</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            <GovBtn variant="primary"><Plus style={{ width: 12, height: 12 }} /> Thêm mới</GovBtn>
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng cơ sở ATTP" value="1.842" color="neutral" />
        <MiniStat label="Đang hoạt động"   value="1.673" color="green"   note="90,8% tỷ lệ" />
        <MiniStat label="Tạm đình chỉ"     value="89"    color="orange"  note="5 tuần này" />
        <MiniStat label="Hết hạn giấy phép" value="80"  color="red"     note="Cần gia hạn" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Tên cơ sở, mã cơ sở..." value={search} onChange={setSearch} width={220} />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect value={statusFilter} onChange={setStatusFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'active',    label: 'Đang hoạt động' },
            { value: 'suspended', label: 'Tạm đình chỉ' },
            { value: 'pending',   label: 'Chờ xử lý' },
            { value: 'expired',   label: 'Hết hạn' },
          ]} width={160} />
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
        title={`Danh sách cơ sở kinh doanh thực phẩm (${filtered.length} cơ sở)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / 1.842 cơ sở`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy cơ sở kinh doanh nào khớp với điều kiện tìm kiếm."
        />
      </SectionCard>
    </div>
  );
}
