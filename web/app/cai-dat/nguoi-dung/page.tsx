'use client';

import { useState } from 'react';
import { FiEdit } from 'react-icons/fi';
import { mockUsers, SystemUser, roleLabels, roleColors, Role } from '@/data/mockData';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';
import StatCard from '@/components/StatCard';

export default function NguoiDungPage() {
  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const filtered = mockUsers.filter((u) => {
    const matchSearch =
      !search ||
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = !roleFilter || u.role === roleFilter;
    return matchSearch && matchRole;
  });

  const columns: Column<SystemUser>[] = [
    {
      key: 'name',
      header: 'Người dùng',
      render: (r) => (
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-[11px] font-bold text-white flex-shrink-0">
            {r.name[0]}
          </div>
          <strong className="text-slate-800">{r.name}</strong>
        </div>
      ),
    },
    {
      key: 'email',
      header: 'Email',
      render: (r) => <span className="text-slate-500 text-[12px]">{r.email}</span>,
    },
    {
      key: 'role',
      header: 'Vai trò',
      render: (r) => (
        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wide ${roleColors[r.role as Role]}`}>
          {roleLabels[r.role as Role]}
        </span>
      ),
    },
    { key: 'department', header: 'Phòng ban' },
    {
      key: 'lastLogin',
      header: 'Đăng nhập gần nhất',
      render: (r) => <span className="text-slate-500 text-[12px]">{r.lastLogin}</span>,
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
          <button className="w-7 h-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm transition-colors"><FiEdit size={16} className="mx-auto" /></button>
          <button className="w-7 h-7 rounded-md border border-red-200 bg-red-50 hover:bg-red-100 text-sm transition-colors">🔒</button>
        </div>
      ),
    },
  ];

  const totalActive    = mockUsers.filter((u) => u.status === 'active').length;
  const totalSuspended = mockUsers.filter((u) => u.status === 'suspended').length;
  const totalInspector = mockUsers.filter((u) => u.role === 'INSPECTOR').length;
  const totalBusiness  = mockUsers.filter((u) => u.role === 'BUSINESS').length;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Quản lý Người dùng</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Quản lý tài khoản và quyền truy cập hệ thống</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors">
          + Thêm người dùng
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <StatCard label="Tổng người dùng"  value={mockUsers.length} color="blue"   />
        <StatCard label="Đang hoạt động"   value={totalActive}      color="green"  />
        <StatCard label="Tạm đình chỉ"     value={totalSuspended}   color="red"    />
        <StatCard label="Thanh tra viên"   value={totalInspector}   color="orange" />
        <StatCard label="Tài khoản cơ sở" value={totalBusiness}    color="purple" />
      </div>

      {/* Table */}
      <TableCard
        title="Người dùng hệ thống"
        controls={
          <>
            <SearchInput placeholder="Tìm người dùng..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '',          label: 'Tất cả vai trò' },
                { value: 'ADMIN',     label: 'Quản trị viên' },
                { value: 'AUTHORITY', label: 'Cơ quan thẩm quyền' },
                { value: 'INSPECTOR', label: 'Thanh tra viên' },
                { value: 'TESTER',    label: 'Kiểm nghiệm viên' },
                { value: 'BUSINESS',  label: 'Chủ cơ sở' },
              ]}
              onChange={setRoleFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockUsers.length} người dùng`} />}
      >
        <DataTable
          columns={columns}
          data={filtered }
          emptyMessage="Không tìm thấy người dùng nào"
        />
      </TableCard>
    </div>
  );
}

