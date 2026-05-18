'use client';

import { useState } from 'react';
import { Eye, Pencil, FileSpreadsheet, Printer, Plus, RefreshCw } from 'lucide-react';
import DataTable, { Column } from '@/components/DataTable';
import { PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn, SectionCard, GovPagination, StatusBadge, MiniStat } from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';
import Link from 'next/link';

interface Violation {
  id: string;
  businessName: string;
  violationType: string;
  severity: 'nhẹ' | 'trung bình' | 'nghiêm trọng';
  detectedDate: string;
  status: 'pending' | 'processing' | 'resolved';
  district: string;
  penalty: string;
}

const mockViolations: Violation[] = [
  { id: 'VP-2025001', businessName: 'Nhà hàng Hải Sản Biển Xanh', violationType: 'Vi phạm vệ sinh ATTP', severity: 'nghiêm trọng', detectedDate: '18/03/2025', status: 'processing', district: 'Hải Châu', penalty: '25.000.000 đ' },
  { id: 'VP-2025002', businessName: 'Quán Ăn Gia Đình Việt', violationType: 'Không niêm yết giá bán', severity: 'nhẹ', detectedDate: '15/03/2025', status: 'resolved', district: 'Thanh Khê', penalty: '1.500.000 đ' },
  { id: 'VP-2025003', businessName: 'Cửa hàng Thực phẩm Organic', violationType: 'Sử dụng chất cấm', severity: 'nghiêm trọng', detectedDate: '22/03/2025', status: 'pending', district: 'Ngũ Hành Sơn', penalty: 'Đang xác định' },
  { id: 'VP-2025004', businessName: 'Siêu thị Mini Mart Đà Nẵng', violationType: 'Bán hàng hết hạn sử dụng', severity: 'trung bình', detectedDate: '20/03/2025', status: 'processing', district: 'Sơn Trà', penalty: '8.000.000 đ' },
  { id: 'VP-2025005', businessName: 'Bánh Mì Hội An', violationType: 'Giấy phép hết hạn', severity: 'trung bình', detectedDate: '10/03/2025', status: 'pending', district: 'Sơn Trà', penalty: '5.000.000 đ' },
  { id: 'VP-2025006', businessName: 'Lò Bánh Mì Thanh Khê', violationType: 'Kiểm soát dịch hại', severity: 'trung bình', detectedDate: '05/03/2025', status: 'in-progress', district: 'Thanh Khê', penalty: '3.000.000 đ' },
];

export default function DanhSachViPhamPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const districts = [...new Set(mockViolations.map((v) => v.district))];

  const filtered = mockViolations.filter((v) => {
    const matchSearch =
      !search ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.businessName.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = !severityFilter || v.severity === severityFilter;
    const matchStatus = !statusFilter || v.status === statusFilter;
    const matchDistrict = !districtFilter || v.district === districtFilter;
    return matchSearch && matchSeverity && matchStatus && matchDistrict;
  });

  const columns: Column<Violation>[] = [
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
    { key: 'violationType', header: 'Loại vi phạm' },
    {
      key: 'severity',
      header: 'Mức độ',
      render: r => <StatusBadge variant={r.severity} />,
    },
    {
      key: 'detectedDate',
      header: 'Ngày phát hiện',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.detectedDate}</span>,
    },
    { key: 'district', header: 'Quận/Huyện' },
    { key: 'penalty', header: 'Mức phạt' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={r.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <GovBtn variant="secondary" size="sm" title="Xem chi tiết"><Eye style={{ width: 12, height: 12 }} /></GovBtn>
          <GovBtn variant="outline" size="sm" title="Chỉnh sửa"><Pencil style={{ width: 12, height: 12 }} /></GovBtn>
        </div>
      ),
    },
  ];

  const total = mockViolations.length;
  const nghiemTrong = mockViolations.filter(v => v.severity === 'nghiêm trọng').length;
  const dangXuLy = mockViolations.filter(v => v.status === 'processing' || v.status === 'in-progress').length;
  const daXuLy = mockViolations.filter(v => v.status === 'resolved').length;

  return (
    <div>
      <PageHeader
        title="Quản lý vi phạm an toàn thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Danh sách vi phạm ghi nhận"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><Printer style={{ width: 12, height: 12 }} /> In báo cáo</GovBtn>
            <Link href="/vi-pham/add">
              <GovBtn variant="primary">
                <Plus style={{ width: 12, height: 12 }} />
                Thêm mới
              </GovBtn>
            </Link>

          </>
        }
      />

      <AlertBanner
        type="warning"
        title={`Có ${nghiemTrong} vi phạm mức nghiêm trọng đang chờ xử lý. Vui lòng ưu tiên xem xét và ban hành quyết định xử phạt.`}
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng vi phạm" value={total} color="neutral" />
        <MiniStat label="Nghiêm trọng" value={nghiemTrong} color="red" note="Cần xử lý ngay" />
        <MiniStat label="Đang xử lý" value={dangXuLy} color="orange" />
        <MiniStat label="Đã xử lý" value={daXuLy} color="green" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput
            placeholder="Mã vi phạm, tên cơ sở..."
            value={search}
            onChange={setSearch}
            width={220}
          />
        </FilterField>
        <FilterField label="Mức độ vi phạm">
          <GovSelect
            value={severityFilter}
            onChange={setSeverityFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              { value: 'nhẹ', label: 'Nhẹ' },
              { value: 'trung bình', label: 'Trung bình' },
              { value: 'nghiêm trọng', label: 'Nghiêm trọng' },
            ]}
            width={160}
          />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              { value: 'pending', label: 'Chưa xử lý' },
              { value: 'processing', label: 'Đang xử lý' },
              { value: 'resolved', label: 'Đã xử lý' },
            ]}
            width={160}
          />
        </FilterField>
        <FilterField label="Quận/Huyện">
          <GovSelect
            value={districtFilter}
            onChange={setDistrictFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              ...districts.map(d => ({ value: d, label: d })),
            ]}
            width={160}
          />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setSeverityFilter(''); setStatusFilter(''); setDistrictFilter(''); }}>
            Xóa bộ lọc
          </GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách vi phạm (${filtered.length} bản ghi)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${total} vi phạm`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy vi phạm nào phù hợp điều kiện tìm kiếm."
        />
      </SectionCard>
    </div>
  );
}
