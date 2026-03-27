'use client';

import { useState } from 'react';
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
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'name',
      header: 'Tên cơ sở',
      render: (r) => <strong className="text-slate-800">{r.name}</strong>,
    },
    { key: 'category', header: 'Loại hình' },
    { key: 'district',  header: 'Quận/Huyện' },
    {
      key: 'license',
      header: 'Số giấy phép',
      render: (r) => <span className="font-mono text-[12px]">{r.license}</span>,
    },
    { key: 'expiry', header: 'Hết hạn' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => <Badge variant={r.status} />,
    },
    { key: 'lastInspection', header: 'Thanh tra gần nhất' },
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

  const districts = [...new Set(mockBusinesses.map((b) => b.district))];

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Cơ sở Kinh doanh</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">1.842 cơ sở thực phẩm đã đăng ký tại Đà Nẵng</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            📥 Xuất CSV
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors">
            + Thêm cơ sở
          </button>
        </div>
      </div>

      <TableCard
        title="Tất cả cơ sở"
        controls={
          <>
            <SearchInput placeholder="Tìm tên, địa chỉ..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '',            label: 'Tất cả trạng thái' },
                { value: 'active',      label: 'Hoạt động' },
                { value: 'suspended',   label: 'Tạm đình chỉ' },
                { value: 'pending',     label: 'Chờ duyệt' },
                { value: 'expired',     label: 'Hết hạn' },
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
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số 1.842 cơ sở`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy cơ sở nào" />
      </TableCard>
    </div>
  );
}
