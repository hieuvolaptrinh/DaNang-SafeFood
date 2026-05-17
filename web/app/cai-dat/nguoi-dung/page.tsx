'use client';

import { useState } from 'react';
import { Pencil, Lock, UserPlus, RefreshCw } from 'lucide-react';
import { mockUsers, SystemUser, roleLabels, Role } from '@/data/mockData';
import DataTable, { Column } from '@/components/DataTable';
import { PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn, SectionCard, GovPagination, StatusBadge, MiniStat } from '@/components/GovUI';

const roleBadgeStyle: Record<string, { bg: string; color: string; border: string }> = {
  ADMIN:     { bg: '#F0E8FA', color: '#6200CC', border: '#D4A8F5' },
  AUTHORITY: { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
  INSPECTOR: { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
  TESTER:    { bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  BUSINESS:  { bg: '#F0F0F0', color: '#555',    border: '#CCC'    },
};

export default function NguoiDungPage() {
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockUsers.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole   = !roleFilter   || u.role   === roleFilter;
    const matchStatus = !statusFilter || u.status === statusFilter;
    return matchSearch && matchRole && matchStatus;
  });

  const columns: Column<SystemUser>[] = [
    {
      key: 'name',
      header: 'Họ và tên',
      render: r => <span style={{ fontWeight: 600 }}>{r.name}</span>,
    },
    {
      key: 'email',
      header: 'Email đăng nhập',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#005A9E' }}>{r.email}</span>,
    },
    {
      key: 'role',
      header: 'Vai trò',
      render: r => {
        const s = roleBadgeStyle[r.role as Role] ?? { bg: '#F0F0F0', color: '#555', border: '#CCC' };
        return (
          <span style={{ display: 'inline-block', padding: '1px 7px', borderRadius: '2px', border: `1px solid ${s.border}`, background: s.bg, color: s.color, fontSize: '11px', fontWeight: 600, whiteSpace: 'nowrap' }}>
            {roleLabels[r.role as Role] ?? r.role}
          </span>
        );
      },
    },
    { key: 'department', header: 'Phòng ban / Đơn vị' },
    {
      key: 'lastLogin',
      header: 'Đăng nhập lần cuối',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#555' }}>{r.lastLogin}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={r.status} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <GovBtn variant="outline" size="sm" title="Chỉnh sửa"><Pencil style={{ width: 12, height: 12 }} /></GovBtn>
          <GovBtn variant="danger" size="sm" title="Khóa tài khoản"><Lock style={{ width: 12, height: 12 }} /></GovBtn>
        </div>
      ),
    },
  ];

  const totalUsers     = mockUsers.length;
  const totalActive    = mockUsers.filter(u => u.status === 'active').length;
  const totalSuspended = mockUsers.filter(u => u.status === 'suspended').length;
  const totalInspector = mockUsers.filter(u => u.role === 'INSPECTOR').length;
  const totalBusiness  = mockUsers.filter(u => u.role === 'BUSINESS').length;

  return (
    <div>
      <PageHeader
        title="Quản lý tài khoản người dùng hệ thống"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Phân quyền và quản lý tài khoản"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="primary"><UserPlus style={{ width: 12, height: 12 }} /> Thêm người dùng</GovBtn>
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng người dùng" value={totalUsers} color="neutral" />
        <MiniStat label="Đang hoạt động" value={totalActive} color="green" />
        <MiniStat label="Tạm đình chỉ" value={totalSuspended} color="red" />
        <MiniStat label="Thanh tra viên" value={totalInspector} color="blue" />
        <MiniStat label="Tài khoản cơ sở" value={totalBusiness} color="orange" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Họ tên, email..." value={search} onChange={setSearch} width={200} />
        </FilterField>
        <FilterField label="Vai trò">
          <GovSelect value={roleFilter} onChange={setRoleFilter} options={[
            { value: '',          label: '-- Tất cả --' },
            { value: 'ADMIN',     label: 'Quản trị viên' },
            { value: 'AUTHORITY', label: 'Cơ quan thẩm quyền' },
            { value: 'INSPECTOR', label: 'Thanh tra viên' },
            { value: 'TESTER',    label: 'Kiểm nghiệm viên' },
            { value: 'BUSINESS',  label: 'Chủ cơ sở' },
          ]} width={180} />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect value={statusFilter} onChange={setStatusFilter} options={[
            { value: '',          label: '-- Tất cả --' },
            { value: 'active',    label: 'Đang hoạt động' },
            { value: 'suspended', label: 'Tạm đình chỉ' },
          ]} width={160} />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setRoleFilter(''); setStatusFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách người dùng hệ thống (${filtered.length} tài khoản)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${totalUsers} người dùng`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy người dùng nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}
