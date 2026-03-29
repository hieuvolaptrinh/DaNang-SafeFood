'use client';

import { useState } from 'react';
import { FiEdit, FiEye } from 'react-icons/fi';
import { mockBusinesses, Business } from '@/data/mockData';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

export default function CoSoKinhDoanhPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const filtered = mockBusinesses.filter((b) => {
    const matchSearch =
      !search ||
      b.name.toLowerCase().includes(search.toLowerCase()) ||
      b.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || b.status === statusFilter;
    const matchDistrict = !districtFilter || b.district === districtFilter;
    return matchSearch && matchStatus && matchDistrict;
  });

  const columns: Column<Business>[] = [
    {
      key: 'id',
      header: 'Mã cơ sở',
      render: (r) => (
        <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
          {r.id}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Tên cơ sở',
      render: (r) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-sm font-black text-violet-600 flex-shrink-0">
            {r.name.charAt(0)}
          </div>
          <span className="font-semibold text-[13px] text-slate-800">{r.name}</span>
        </div>
      ),
    },
    { 
      key: 'category', 
      header: 'Loại hình',
      render: (r) => <span className="text-slate-600">{r.category}</span>
    },
    { 
      key: 'district',  
      header: 'Quận/Huyện',
      render: (r) => <span className="text-slate-600 font-medium">{r.district}</span>
    },
    {
      key: 'license',
      header: 'Số giấy phép',
      render: (r) => (
        <span className="font-mono text-[12px] text-slate-500">{r.license}</span>
      ),
    },
    { 
      key: 'expiry', 
      header: 'Ngày hết hạn',
      render: (r) => <span className="text-slate-500 font-medium">{r.expiry}</span>
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => <Badge variant={r.status} />,
    },
    { 
      key: 'lastInspection', 
      header: 'Thanh tra gần nhất',
      render: (r) => <span className="text-slate-500 font-medium">{r.lastInspection}</span>
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-300 text-sm transition-all shadow-sm" 
            title="Xem chi tiết"
          >
            <FiEye size={16} className="mx-auto" />
          </button>
          <button 
            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-sm transition-all shadow-sm" 
            title="Chỉnh sửa"
          >
            <FiEdit size={16} className="mx-auto" />
          </button>
        </div>
      ),
    },
  ];

  const districts = [...new Set(mockBusinesses.map((b) => b.district))];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-violet-500">
                SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
              </span>
            </div>
            <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">
              Cơ sở Kinh doanh
            </h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">
              Quản lý 1.842 cơ sở thực phẩm đã đăng ký tại Đà Nẵng
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Xuất CSV
            </button>
            {/* <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold transition-all shadow-sm">
              + Thêm cơ sở mới
            </button> */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tổng cơ sở', value: '1,842', icon: '🏪', color: 'from-violet-600 to-purple-600' },
            { label: 'Đang hoạt động', value: '1,673', icon: '✅', color: 'from-emerald-500 to-teal-500' },
            { label: 'Tạm đình chỉ', value: '89', icon: '⚠️', color: 'from-amber-500 to-orange-500' },
            { label: 'Hết hạn giấy phép', value: '124', icon: '⏰', color: 'from-red-500 to-rose-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{s.label}</p>
                  <p className="text-[30px] font-black text-slate-900 leading-none">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-sm`}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Main Table */}
        <TableCard
          title="Tất cả cơ sở kinh doanh"
          controls={
            <>
              <SearchInput 
                placeholder="Tìm mã cơ sở, tên cơ sở..." 
                onChange={setSearch} 
              />
              <FilterSelect
                options={[
                  { value: '', label: 'Tất cả trạng thái' },
                  { value: 'active', label: 'Hoạt động' },
                  { value: 'suspended', label: 'Tạm đình chỉ' },
                  { value: 'pending', label: 'Chờ duyệt' },
                  { value: 'expired', label: 'Hết hạn' },
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
          footer={
            <Pagination 
              info={`Hiển thị ${filtered.length} trong tổng số 1.842 cơ sở`} 
            />
          }
        >
          <DataTable 
            columns={columns} 
            data={filtered} 
            emptyMessage="Không tìm thấy cơ sở kinh doanh nào khớp với điều kiện tìm kiếm."
          />
        </TableCard>
      </div>
    </div>
  );
}

