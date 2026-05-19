'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRole } from '@/lib/RoleContext';
import { Eye, Pencil, FileSpreadsheet, RefreshCw, Plus } from 'lucide-react';
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
  const { role } = useRole();
  const isTester = role === 'TESTER';

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
      key: 'fixStatus',
      header: 'Trạng thái khắc phục',
      render: r => <StatusBadge variant={fixStatusVariant[r.fixStatus]} label={fixStatusLabel[r.fixStatus]} />,
    },
    {
      key: 'deadline',
      header: 'Hạn khắc phục',
      render: r => <span className="font-mono text-sm">{r.deadline}</span>,
    },
    {
      key: 'updatedDate',
      header: 'Ngày cập nhật',
      render: r => <span className="font-mono text-sm text-slate-500">{r.updatedDate}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <div className="flex gap-2">
          <Link href={`/vi-pham/khac-phuc/${r.id}`}>
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
        title="Theo dõi khắc phục vi phạm"
        subtitle="Tiến độ khắc phục vi phạm của các cơ sở kinh doanh"
        actions={
          <>
            <GovBtn variant="secondary">
              <RefreshCw size={16} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet size={16} /> Xuất Excel
            </GovBtn>

            {/* Chỉ TESTER mới được tạo mới vi phạm */}
            {isTester && (
              <Link href="/vi-pham/them-moi">
                <GovBtn variant="primary">
                  <Plus size={16} /> Tạo mới vi phạm
                </GovBtn>
              </Link>
            )}
          </>
        }
      />

      <div className="max-w-[1400px] mx-auto px-6 pt-6">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <MiniStat label="Tổng hồ sơ" value={totalFixes} color="neutral" />
          <MiniStat label="Chờ khắc phục" value={pendingCount} color="orange" />
          <MiniStat label="Đang khắc phục" value={inProgressCount} color="blue" />
          <MiniStat label="Đã hoàn thành" value={completedCount} color="green" />
        </div>

        {/* Filter */}
        <SectionCard className="shadow-sm mb-6">
          <FilterBar>
            <FilterField label="Tìm kiếm">
              <GovInput 
                placeholder="Mã vi phạm, tên cơ sở..." 
                value={search} 
                onChange={setSearch} 
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
              />
            </FilterField>
            <FilterField label="Trạng thái khắc phục">
              <GovSelect 
                value={statusFilter} 
                onChange={setStatusFilter} 
                options={[
                  { value: '', label: '-- Tất cả --' },
                  { value: 'pending', label: 'Chờ khắc phục' },
                  { value: 'in_progress', label: 'Đang khắc phục' },
                  { value: 'completed', label: 'Đã hoàn thành' },
                ]} 
              />
            </FilterField>
          </FilterBar>
        </SectionCard>

        {/* Table */}
        <SectionCard 
          title={`Tất cả yêu cầu khắc phục (${filtered.length} hồ sơ)`}
          className="shadow-sm"
        >
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="Không tìm thấy hồ sơ khắc phục nào phù hợp."
          />
        </SectionCard>
      </div>
    </div>
  );
}