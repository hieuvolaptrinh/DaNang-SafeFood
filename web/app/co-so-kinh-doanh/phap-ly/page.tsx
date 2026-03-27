'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

interface LegalStatus {
  id: string;
  businessName: string;
  violationType: string;
  severity: 'nhẹ' | 'trung bình' | 'nghiêm trọng';
  processingStatus: string;
  updatedDate: string;
}

const mockLegalStatuses: LegalStatus[] = [
  {
    id: 'CS-001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh an toàn thực phẩm',
    severity: 'nghiêm trọng',
    processingStatus: 'Đang xử lý',
    updatedDate: '20/03/2025',
  },
  {
    id: 'CS-002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá',
    severity: 'nhẹ',
    processingStatus: 'Đã hoàn tất',
    updatedDate: '15/03/2025',
  },
  {
    id: 'CS-003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng nguyên liệu không rõ nguồn gốc',
    severity: 'trung bình',
    processingStatus: 'Đang xử lý',
    updatedDate: '25/03/2025',
  },
  {
    id: 'CS-004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    violationType: 'Hạn sử dụng sản phẩm',
    severity: 'nhẹ',
    processingStatus: 'Đã hoàn tất',
    updatedDate: '10/03/2025',
  },
];

export default function PhapLyPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockLegalStatuses.filter((l) => {
    const matchSearch =
      !search ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.businessName.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = !severityFilter || l.severity === severityFilter;
    const matchStatus = !statusFilter || l.processingStatus === statusFilter;
    return matchSearch && matchSeverity && matchStatus;
  });

  const columns: Column<LegalStatus>[] = [
    {
      key: 'id',
      header: 'Mã cơ sở',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: (r) => <strong className="text-slate-800">{r.businessName}</strong>,
    },
    { key: 'violationType', header: 'Loại vi phạm' },
    {
      key: 'severity',
      header: 'Mức độ',
      render: (r) => (
        <Badge 
          variant={r.severity === 'nghiêm trọng' ? 'rejected' : r.severity === 'trung bình' ? 'suspended' : 'active'} 
        />
      ),
    },
    { key: 'processingStatus', header: 'Trạng thái xử lý' },
    { key: 'updatedDate', header: 'Ngày cập nhật' },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <div className="flex gap-1.5">
          <button className="w-7 h-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm transition-colors" title="Xem">👁</button>
          <button className="w-7 h-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm transition-colors" title="Chỉnh sửa">✏️</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Tình trạng Pháp lý</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Theo dõi tình trạng pháp lý và xử lý vi phạm của các cơ sở kinh doanh</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            📥 Xuất CSV
          </button>
        </div>
      </div>

      <TableCard
        title="Tất cả tình trạng pháp lý"
        controls={
          <>
            <SearchInput placeholder="Tìm mã cơ sở, tên cơ sở..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả mức độ' },
                { value: 'nhẹ', label: 'Nhẹ' },
                { value: 'trung bình', label: 'Trung bình' },
                { value: 'nghiêm trọng', label: 'Nghiêm trọng' },
              ]}
              onChange={setSeverityFilter}
            />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'Đang xử lý', label: 'Đang xử lý' },
                { value: 'Đã hoàn tất', label: 'Đã hoàn tất' },
              ]}
              onChange={setStatusFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockLegalStatuses.length} hồ sơ`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy hồ sơ pháp lý nào" />
      </TableCard>
    </div>
  );
}