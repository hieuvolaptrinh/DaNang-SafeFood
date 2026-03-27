'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

interface TestRequest {
  id: string;
  business: string;
  sampleType: string;
  requestDate: string;
  deadline: string;
  status: 'pending' | 'processing' | 'completed';
  lab: string;
}

const mockTestRequests: TestRequest[] = [
  {
    id: 'YC-2025001',
    business: 'Nhà hàng Hải Sản Biển Xanh',
    sampleType: 'Mẫu thực phẩm tươi',
    requestDate: '23/03/2025',
    deadline: '30/03/2025',
    status: 'processing',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
  },
  {
    id: 'YC-2025002',
    business: 'Cửa hàng Thực phẩm Sạch Organic',
    sampleType: 'Mẫu rau hữu cơ',
    requestDate: '24/03/2025',
    deadline: '02/04/2025',
    status: 'pending',
    lab: 'Lab Việt Nam',
  },
  {
    id: 'YC-2025003',
    business: 'Siêu thị Mini Mart Đà Nẵng',
    sampleType: 'Mẫu nước đá',
    requestDate: '20/03/2025',
    deadline: '28/03/2025',
    status: 'completed',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
  },
];

export default function YeuCauPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockTestRequests.filter((r) => {
    const matchSearch =
      !search ||
      r.business.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<TestRequest>[] = [
    {
      key: 'id',
      header: 'Mã yêu cầu',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: (r) => <strong className="text-slate-800">{r.business}</strong>,
    },
    { key: 'sampleType', header: 'Loại mẫu' },
    { key: 'requestDate', header: 'Ngày yêu cầu' },
    { key: 'deadline', header: 'Hạn hoàn thành' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => <Badge variant={r.status} />,
    },
    { key: 'lab', header: 'Phòng lab' },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <div className="flex gap-1.5">
          <button className="w-7 h-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm transition-colors">👁</button>
          <button className="w-7 h-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm transition-colors">✏️</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Yêu cầu Kiểm nghiệm</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Quản lý các yêu cầu kiểm nghiệm mẫu từ cơ sở kinh doanh</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            📥 Xuất danh sách
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700">
            + Tạo yêu cầu mới
          </button>
        </div>
      </div>

      <TableCard
        title="Danh sách yêu cầu kiểm nghiệm"
        controls={
          <>
            <SearchInput placeholder="Tìm cơ sở, mã yêu cầu..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'pending', label: 'Chờ xử lý' },
                { value: 'processing', label: 'Đang thực hiện' },
                { value: 'completed', label: 'Hoàn thành' },
              ]}
              onChange={setStatusFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockTestRequests.length} yêu cầu`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy yêu cầu nào" />
      </TableCard>
    </div>
  );
}