'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Pencil, FileSpreadsheet, RefreshCw, Plus } from 'lucide-react';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import DataTable, { Column } from '@/components/DataTable';

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
    target: 'Người tiêu dùng',
    sendDate: '22/03/2025',
    status: 'scheduled',
    recipientCount: 350,
  },
];

const statusVariantMap: Record<string, string> = {
  sent: 'resolved',
  draft: 'pending',
  scheduled: 'scheduled',
};

const statusLabelMap: Record<string, string> = {
  sent: 'Đã gửi',
  draft: 'Bản nháp',
  scheduled: 'Đã lên lịch',
};

const typeColors: Record<string, { bg: string; color: string; border: string }> = {
  'Khẩn cấp':   { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  'Thông báo':  { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
  'Mời tham gia': { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
};

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

  const totalRecipients = mockNotifications.reduce((s, n) => s + n.recipientCount, 0);

  const columns: Column<Notification>[] = [
    {
      key: 'id',
      header: 'Mã thông báo',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'title',
      header: 'Tiêu đề',
      render: r => <span style={{ fontWeight: 600, fontSize: '12px' }}>{r.title}</span>,
    },
    {
      key: 'type',
      header: 'Loại',
      render: r => {
        const c = typeColors[r.type] ?? { bg: '#F0F0F0', color: '#555', border: '#CCC' };
        return (
          <span style={{
            display: 'inline-block', padding: '1px 7px', borderRadius: '2px',
            border: `1px solid ${c.border}`, background: c.bg, color: c.color,
            fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap',
          }}>
            {r.type}
          </span>
        );
      },
    },
    {
      key: 'target',
      header: 'Đối tượng',
      render: r => <span style={{ fontSize: '12px', color: '#555' }}>{r.target}</span>,
    },
    {
      key: 'sendDate',
      header: 'Ngày gửi',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.sendDate}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={statusVariantMap[r.status]} label={statusLabelMap[r.status]} />,
    },
    {
      key: 'recipientCount',
      header: 'Số người nhận',
      render: r => <strong style={{ color: '#006400' }}>{r.recipientCount.toLocaleString()}</strong>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (r : any) => (
        <ActionButtons>
          <Link href={`/truyen-thong/thong-bao/${r.id}`}>
            <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
              <Eye size={16} />
            </GovBtn>
          </Link>
          <GovBtn variant="outline" size="sm" title="Chỉnh sửa">
            <Pencil style={{ width: 12, height: 12 }} />
          </GovBtn>
        </ActionButtons>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý thông báo công khai"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Gửi thông báo đến các cơ sở kinh doanh thực phẩm"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            <Link href="/truyen-thong/thong-bao/new">
              <GovBtn variant="primary">
                <Plus size={16} /> Tạo mới thông báo
              </GovBtn>
            </Link>
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng thông báo" value={mockNotifications.length} color="neutral" />
        <MiniStat label="Đã gửi" value={mockNotifications.filter(n => n.status === 'sent').length} color="green" />
        <MiniStat label="Đã lên lịch" value={mockNotifications.filter(n => n.status === 'scheduled').length} color="blue" />
        <MiniStat label="Tổng người nhận" value={totalRecipients.toLocaleString()} color="orange" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Mã thông báo, tiêu đề..." value={search} onChange={setSearch} width={240} />
        </FilterField>
        <FilterField label="Loại thông báo">
          <GovSelect value={typeFilter} onChange={setTypeFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'Khẩn cấp', label: 'Khẩn cấp' },
            { value: 'Thông báo', label: 'Thông báo' },
            { value: 'Mời tham gia', label: 'Mời tham gia' },
          ]} width={160} />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect value={statusFilter} onChange={setStatusFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'sent', label: 'Đã gửi' },
            { value: 'draft', label: 'Bản nháp' },
            { value: 'scheduled', label: 'Đã lên lịch' },
          ]} width={160} />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); setTypeFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách thông báo (${filtered.length} thông báo)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${mockNotifications.length} thông báo`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy thông báo nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}
