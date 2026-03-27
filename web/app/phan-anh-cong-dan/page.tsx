'use client';

import { useState } from 'react';
import { mockFeedback, CitizenFeedback } from '@/data/mockData';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';
import AlertBanner from '@/components/AlertBanner';

export default function PhanAnhCongDanPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockFeedback.filter((f) => {
    const matchSearch =
      !search ||
      f.businessReported.toLowerCase().includes(search.toLowerCase()) ||
      f.submitter.toLowerCase().includes(search.toLowerCase());
    const matchType   = !typeFilter   || f.type   === typeFilter;
    const matchStatus = !statusFilter || f.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const columns: Column<CitizenFeedback>[] = [
    {
      key: 'id',
      header: 'Mã phản ánh',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    { key: 'submitter', header: 'Người gửi' },
    {
      key: 'businessReported',
      header: 'Cơ sở bị phản ánh',
      render: (r) => <strong className="text-slate-800">{r.businessReported}</strong>,
    },
    { key: 'type', header: 'Loại phản ánh' },
    { key: 'date', header: 'Ngày gửi' },
    {
      key: 'priority',
      header: 'Ưu tiên',
      render: (r) => <Badge variant={r.priority} />,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => <Badge variant={r.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <div className="flex gap-1.5">
          <button className="w-7 h-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm transition-colors">👁</button>
          <button className="w-7 h-7 rounded-md border border-slate-200 bg-blue-600 text-white hover:bg-blue-700 text-sm transition-colors">💬</button>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Phản ánh Công dân</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Báo cáo và khiếu nại từ người dân</p>
        </div>
      </div>

      <AlertBanner
        type="info"
        title="23 phản ánh chờ xem xét"
        message="Phản ánh mới cần được xem xét và phản hồi trong vòng 5 ngày làm việc."
      />

      <TableCard
        title="Tất cả phản ánh"
        controls={
          <>
            <SearchInput placeholder="Tìm phản ánh..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '',                   label: 'Tất cả loại' },
                { value: 'Khiếu nại vệ sinh',  label: 'Khiếu nại vệ sinh' },
                { value: 'Hàng giả',           label: 'Hàng giả' },
                { value: 'Ngộ độc thực phẩm',  label: 'Ngộ độc thực phẩm' },
                { value: 'Câu hỏi chung',      label: 'Câu hỏi chung' },
              ]}
              onChange={setTypeFilter}
            />
            <FilterSelect
              options={[
                { value: '',            label: 'Tất cả trạng thái' },
                { value: 'open',        label: 'Đang mở' },
                { value: 'in-progress', label: 'Đang xử lý' },
                { value: 'resolved',    label: 'Đã giải quyết' },
              ]}
              onChange={setStatusFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số 86 phản ánh`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không có phản ánh nào" />
      </TableCard>
    </div>
  );
}
