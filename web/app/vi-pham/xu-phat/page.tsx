'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

interface Penalty {
  id: string;
  businessName: string;
  violationType: string;
  penaltyAmount: string;
  decisionDate: string;
  status: 'pending' | 'paid' | 'overdue';
  district: string;
}

const mockPenalties: Penalty[] = [
  {
    id: 'XP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh ATTP mức nghiêm trọng',
    penaltyAmount: '45.000.000 ₫',
    decisionDate: '18/03/2025',
    status: 'paid',
    district: 'Hải Châu',
  },
  {
    id: 'XP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá',
    penaltyAmount: '8.000.000 ₫',
    decisionDate: '12/03/2025',
    status: 'pending',
    district: 'Thanh Khê',
  },
  {
    id: 'XP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng nguyên liệu không rõ nguồn gốc',
    penaltyAmount: '25.000.000 ₫',
    decisionDate: '25/03/2025',
    status: 'overdue',
    district: 'Ngũ Hành Sơn',
  },
];

export default function XuPhatPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const filtered = mockPenalties.filter((p) => {
    const matchSearch =
      !search ||
      p.id.toLowerCase().includes(search.toLowerCase()) ||
      p.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchDistrict = !districtFilter || p.district === districtFilter;
    return matchSearch && matchStatus && matchDistrict;
  });

  const districts = [...new Set(mockPenalties.map((p) => p.district))];

  const columns: Column<Penalty>[] = [
    {
      key: 'id',
      header: 'Mã quyết định',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: (r) => <strong className="text-slate-800">{r.businessName}</strong>,
    },
    { key: 'violationType', header: 'Loại vi phạm' },
    { key: 'penaltyAmount', header: 'Mức phạt' },
    { key: 'decisionDate', header: 'Ngày quyết định' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => <Badge variant={r.status} />,
    },
    { key: 'district', header: 'Quận/Huyện' },
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
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Quản lý Xử phạt</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Quản lý các quyết định xử phạt vi phạm hành chính</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            📥 Xuất CSV
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors">
            + Thêm quyết định xử phạt
          </button>
        </div>
      </div>

      <TableCard
        title="Tất cả quyết định xử phạt"
        controls={
          <>
            <SearchInput placeholder="Tìm mã quyết định, tên cơ sở..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'pending', label: 'Chưa nộp' },
                { value: 'paid', label: 'Đã nộp' },
                { value: 'overdue', label: 'Quá hạn' },
              ]}
              onChange={setStatusFilter}
            />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả quận/huyện' },
                ...districts.map((d) => ({ value: d, label: d })),
              ]}
              onChange={setDistrictFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockPenalties.length} quyết định`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy quyết định xử phạt nào" />
      </TableCard>
    </div>
  );
}