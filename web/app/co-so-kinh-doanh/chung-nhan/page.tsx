'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

interface Certificate {
  id: string;
  businessName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
}

const mockCertificates: Certificate[] = [
  {
    id: 'CN-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    type: 'Chứng nhận ATTP',
    issueDate: '15/01/2025',
    expiryDate: '14/01/2026',
    status: 'approved',
    approver: 'Nguyễn Văn A',
  },
  {
    id: 'CN-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    type: 'Chứng nhận VSATTP',
    issueDate: '20/02/2025',
    expiryDate: '19/02/2026',
    status: 'pending',
    approver: '',
  },
  {
    id: 'CN-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    type: 'Chứng nhận ATTP',
    issueDate: '05/03/2025',
    expiryDate: '04/03/2026',
    status: 'rejected',
    approver: 'Trần Thị B',
  },
  // Thêm dữ liệu mẫu khác nếu cần
  {
    id: 'CN-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    type: 'Chứng nhận ATTP',
    issueDate: '10/01/2025',
    expiryDate: '09/01/2026',
    status: 'approved',
    approver: 'Lê Văn C',
  },
];

export default function PheDuyetChungNhanPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockCertificates.filter((c) => {
    const matchSearch =
      !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<Certificate>[] = [
    {
      key: 'id',
      header: 'Mã chứng nhận',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: (r) => <strong className="text-slate-800">{r.businessName}</strong>,
    },
    { key: 'type', header: 'Loại chứng nhận' },
    { key: 'issueDate', header: 'Ngày cấp' },
    { key: 'expiryDate', header: 'Ngày hết hạn' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => <Badge variant={r.status} />,
    },
    { key: 'approver', header: 'Người duyệt' },
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
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Phê duyệt Chứng nhận</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Quản lý và phê duyệt các chứng nhận cho cơ sở kinh doanh</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            📥 Xuất CSV
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors">
            + Thêm chứng nhận
          </button>
        </div>
      </div>

      <TableCard
        title="Tất cả chứng nhận"
        controls={
          <>
            <SearchInput placeholder="Tìm mã chứng nhận, tên cơ sở..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'pending', label: 'Chờ duyệt' },
                { value: 'approved', label: 'Đã phê duyệt' },
                { value: 'rejected', label: 'Từ chối' },
              ]}
              onChange={setStatusFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockCertificates.length} chứng nhận`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy chứng nhận nào" />
      </TableCard>
    </div>
  );
}