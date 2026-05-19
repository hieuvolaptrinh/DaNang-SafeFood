'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/lib/RoleContext';
import { Eye, Pencil, FileSpreadsheet, Printer, RefreshCw, Plus } from 'lucide-react';
import {
  PageHeader,
  SectionCard,
  GovBtn,
  GovInput,
  GovSelect,
  FilterBar,
  FilterField,
  MiniStat,
  StatusBadge,
} from '@/components/GovUI';
import DataTable, { Column } from '@/components/DataTable';
import AlertBanner from '@/components/AlertBanner';

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
];

export default function DanhSachViPhamPage() {
  const { role } = useRole();
  const isTester = role === 'TESTER';

  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const districts = [...new Set(mockViolations.map((v) => v.district))];

  const filtered = mockViolations.filter((v) => {
    const matchSearch = !search ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.businessName.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = !severityFilter || v.severity === severityFilter;
    const matchStatus = !statusFilter || v.status === statusFilter;
    const matchDistrict = !districtFilter || v.district === districtFilter;
    return matchSearch && matchSeverity && matchStatus && matchDistrict;
  });

  const total = mockViolations.length;
  const nghiemTrong = mockViolations.filter(v => v.severity === 'nghiêm trọng').length;
  const dangXuLy = mockViolations.filter(v => v.status === 'processing' || v.status === 'in-progress').length;
  const daXuLy = mockViolations.filter(v => v.status === 'resolved').length;

  const columns: Column<Violation>[] = [
    {
      key: 'id',
      header: 'Mã vi phạm',
      render: r => <span className="font-mono font-semibold text-blue-700">{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: r => <span className="font-semibold">{r.businessName}</span>,
    },
    {
      key: 'violationType',
      header: 'Loại vi phạm',
      render: r => <span className="text-sm">{r.violationType}</span>,
    },
    {
      key: 'severity',
      header: 'Mức độ',
      render: r => <StatusBadge variant={r.severity} />,
    },
    {
      key: 'detectedDate',
      header: 'Ngày phát hiện',
      render: r => <span className="font-mono text-sm">{r.detectedDate}</span>,
    },
    { key: 'district', header: 'Quận/Huyện' },
    { 
      key: 'penalty', 
      header: 'Mức phạt',
      render: r => <span className="font-medium text-red-600">{r.penalty}</span>
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
        <div className="flex gap-2">
          <Link href={`/vi-pham/${r.id}`}>
            <GovBtn variant="secondary" size="sm">
              <Eye size={16} />
            </GovBtn>
          </Link>
          <GovBtn variant="secondary" size="sm">
            <Pencil size={16} />
          </GovBtn>
        </div>
      ),
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-16">
      <PageHeader
        title="Quản lý vi phạm an toàn thực phẩm"
        subtitle="Danh sách vi phạm đã ghi nhận trên địa bàn TP. Đà Nẵng"
        actions={
          <>
            <GovBtn variant="secondary">
              <RefreshCw size={16} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer size={16} /> In báo cáo
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet size={16} /> Xuất Excel
            </GovBtn>

            {/* Chỉ Tester mới thấy nút Tạo mới */}
            {isTester && (
              <Link href="/vi-pham/add">
                <GovBtn variant="primary">
                  <Plus size={16} /> Tạo mới vi phạm
                </GovBtn>
              </Link>
            )}
          </>
        }
      />

      <div className="max-w-[1400px] mx-auto px-6 pt-6">
        <AlertBanner
          type="warning"
          title={`Có ${nghiemTrong} vi phạm mức nghiêm trọng đang chờ xử lý. Vui lòng ưu tiên xử lý.`}
        />

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MiniStat label="Tổng vi phạm" value={total} color="neutral" />
          <MiniStat label="Nghiêm trọng" value={nghiemTrong} color="red" note="Cần xử lý khẩn" />
          <MiniStat label="Đang xử lý" value={dangXuLy} color="orange" />
          <MiniStat label="Đã xử lý" value={daXuLy} color="green" />
        </div>

        {/* Filter Bar */}
        <SectionCard className="shadow-sm mb-6">
          <FilterBar>
            <FilterField label="Tìm kiếm">
              <GovInput
                placeholder="Mã vi phạm, tên cơ sở..."
                value={search}
                onChange={setSearch}
              />
            </FilterField>
            <FilterField label="Mức độ">
              <GovSelect
                value={severityFilter}
                onChange={setSeverityFilter}
                options={[
                  { value: '', label: '-- Tất cả --' },
                  { value: 'nhẹ', label: 'Nhẹ' },
                  { value: 'trung bình', label: 'Trung bình' },
                  { value: 'nghiêm trọng', label: 'Nghiêm trọng' },
                ]}
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
              />
            </FilterField>
          </FilterBar>
        </SectionCard>

        {/* Data Table */}
        <SectionCard 
          title={`Danh sách vi phạm (${filtered.length} bản ghi)`}
          className="shadow-sm"
        >
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="Không tìm thấy vi phạm nào phù hợp."
          />
        </SectionCard>
      </div>
    </div>
  );
}