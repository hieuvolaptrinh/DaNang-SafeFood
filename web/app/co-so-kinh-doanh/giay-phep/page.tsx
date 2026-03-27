'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

interface License {
  id: string;
  businessName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'revoked';
  district: string;
}

const mockLicenses: License[] = [
  {
    id: 'GP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '10/01/2025',
    expiryDate: '09/01/2026',
    status: 'valid',
    district: 'Hải Châu',
  },
  {
    id: 'GP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    type: 'Giấy phép VSATTP',
    issueDate: '15/02/2025',
    expiryDate: '14/02/2025',
    status: 'expired',
    district: 'Thanh Khê',
  },
  {
    id: 'GP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '20/03/2025',
    expiryDate: '19/03/2026',
    status: 'valid',
    district: 'Ngũ Hành Sơn',
  },
  {
    id: 'GP-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '05/01/2025',
    expiryDate: '04/01/2026',
    status: 'revoked',
    district: 'Sơn Trà',
  },
];

export default function GiayPhepPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const filtered = mockLicenses.filter((l) => {
    const matchSearch =
      !search ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || l.status === statusFilter;
    const matchDistrict = !districtFilter || l.district === districtFilter;
    return matchSearch && matchStatus && matchDistrict;
  });

  const districts = [...new Set(mockLicenses.map((l) => l.district))];

  const columns: Column<License>[] = [
    {
      key: 'id',
      header: 'Mã giấy phép',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: (r) => <strong className="text-slate-800">{r.businessName}</strong>,
    },
    { key: 'type', header: 'Loại giấy phép' },
    { key: 'issueDate', header: 'Ngày cấp' },
    { key: 'expiryDate', header: 'Ngày hết hạn' },
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
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Quản lý Giấy phép</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">1.245 giấy phép đã cấp cho các cơ sở kinh doanh tại Đà Nẵng</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            📥 Xuất CSV
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors">
            + Cấp giấy phép mới
          </button>
        </div>
      </div>

      <TableCard
        title="Tất cả giấy phép"
        controls={
          <>
            <SearchInput placeholder="Tìm mã giấy phép, tên cơ sở..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'valid', label: 'Còn hiệu lực' },
                { value: 'expired', label: 'Hết hạn' },
                { value: 'revoked', label: 'Đã thu hồi' },
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
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockLicenses.length} giấy phép`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy giấy phép nào" />
      </TableCard>
    </div>
  );
}