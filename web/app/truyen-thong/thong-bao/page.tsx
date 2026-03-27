'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

interface Notification {
  id: string;
  title: string;
  type: string;
  target: string;
  sendDate: string;
  status: 'sent' | 'draft' | 'scheduled';
  recipientCount: number;
}

const mockNotifications: Notification[] = [
  {
    id: 'TB-2025001',
    title: 'Cảnh báo khẩn cấp về lô thực phẩm nhiễm khuẩn',
    type: 'Khẩn cấp',
    target: 'Tất cả cơ sở kinh doanh',
    sendDate: '25/03/2025',
    status: 'sent',
    recipientCount: 1842,
  },
  {
    id: 'TB-2025002',
    title: 'Hướng dẫn kiểm tra định kỳ quý II/2025',
    type: 'Thông báo',
    target: 'Cơ sở kinh doanh thực phẩm',
    sendDate: '20/03/2025',
    status: 'sent',
    recipientCount: 1245,
  },
  {
    id: 'TB-2025003',
    title: 'Mời tham gia hội thảo an toàn thực phẩm',
    type: 'Mời tham gia',
    target: 'Quản lý cơ sở',
    sendDate: '22/03/2025',
    status: 'scheduled',
    recipientCount: 350,
  },
];

export default function ThongBaoPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');

  const filtered = mockNotifications.filter((n) => {
    const matchSearch =
      !search ||
      n.id.toLowerCase().includes(search.toLowerCase()) ||
      n.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || n.status === statusFilter;
    const matchType = !typeFilter || n.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const columns: Column<Notification>[] = [
    {
      key: 'id',
      header: 'Mã thông báo',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'title',
      header: 'Tiêu đề',
      render: (r) => <strong className="text-slate-800 line-clamp-2">{r.title}</strong>,
    },
    { key: 'type', header: 'Loại' },
    { key: 'target', header: 'Đối tượng' },
    { key: 'sendDate', header: 'Ngày gửi' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => <Badge variant={r.status} />,
    },
    {
      key: 'recipientCount',
      header: 'Số người nhận',
      render: (r) => <span className="font-medium">{r.recipientCount.toLocaleString()}</span>,
    },
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
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Thông báo</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Quản lý và gửi thông báo đến các cơ sở kinh doanh</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            📥 Xuất CSV
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors">
            + Tạo thông báo mới
          </button>
        </div>
      </div>

      <TableCard
        title="Tất cả thông báo"
        controls={
          <>
            <SearchInput placeholder="Tìm mã, tiêu đề thông báo..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả loại' },
                { value: 'Khẩn cấp', label: 'Khẩn cấp' },
                { value: 'Thông báo', label: 'Thông báo' },
                { value: 'Mời tham gia', label: 'Mời tham gia' },
              ]}
              onChange={setTypeFilter}
            />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'sent', label: 'Đã gửi' },
                { value: 'draft', label: 'Bản nháp' },
                { value: 'scheduled', label: 'Đã lên lịch' },
              ]}
              onChange={setStatusFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockNotifications.length} thông báo`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy thông báo nào" />
      </TableCard>
    </div>
  );
}