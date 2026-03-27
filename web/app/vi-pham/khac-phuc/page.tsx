'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

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

export default function KhacPhucPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');

  const filtered = mockViolationFixes.filter((v) => {
    const matchSearch =
      !search ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || v.fixStatus === statusFilter;
    const matchSeverity = !severityFilter || v.severity === severityFilter;
    return matchSearch && matchStatus && matchSeverity;
  });

  const columns: Column<ViolationFix>[] = [
    {
      key: 'id',
      header: 'Mã vi phạm',
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
      render: (r) => <Badge variant={r.severity} />,
    },
    {
      key: 'fixStatus',
      header: 'Trạng thái khắc phục',
      render: (r) => <Badge variant={r.fixStatus} />,
    },
    { key: 'deadline', header: 'Hạn khắc phục' },
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
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Theo dõi Khắc phục Vi phạm</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Theo dõi tiến độ khắc phục vi phạm của các cơ sở kinh doanh tại Đà Nẵng</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            📥 Xuất CSV
          </button>
        </div>
      </div>

      <TableCard
        title="Tất cả yêu cầu khắc phục"
        controls={
          <>
            <SearchInput placeholder="Tìm mã vi phạm, tên cơ sở..." onChange={setSearch} />
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
                { value: 'pending', label: 'Chờ xử lý' },
                { value: 'in_progress', label: 'Đang khắc phục' },
                { value: 'completed', label: 'Đã hoàn thành' },
              ]}
              onChange={setStatusFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockViolationFixes.length} hồ sơ`} />}
      >
        <DataTable columns={columns} data={filtered } emptyMessage="Không tìm thấy hồ sơ khắc phục nào" />
      </TableCard>
    </div>
  );
}
