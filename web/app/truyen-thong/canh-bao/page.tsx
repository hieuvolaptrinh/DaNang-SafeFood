'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

interface FoodSafetyWarning {
  id: string;
  businessName: string;
  warningType: string;
  level: 'thấp' | 'trung bình' | 'cao';
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'resolved' | 'expired';
  district: string;
}

const mockWarnings: FoodSafetyWarning[] = [
  {
    id: 'CB-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    warningType: 'Cảnh báo ô nhiễm vi sinh',
    level: 'cao',
    issueDate: '20/03/2025',
    expiryDate: '19/04/2025',
    status: 'active',
    district: 'Hải Châu',
  },
  {
    id: 'CB-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    warningType: 'Cảnh báo hạn sử dụng',
    level: 'trung bình',
    issueDate: '15/03/2025',
    expiryDate: '14/04/2025',
    status: 'resolved',
    district: 'Thanh Khê',
  },
  {
    id: 'CB-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    warningType: 'Cảnh báo nguồn gốc xuất xứ',
    level: 'thấp',
    issueDate: '25/03/2025',
    expiryDate: '24/04/2025',
    status: 'active',
    district: 'Ngũ Hành Sơn',
  },
  {
    id: 'CB-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    warningType: 'Cảnh báo hóa chất bảo quản',
    level: 'cao',
    issueDate: '18/03/2025',
    expiryDate: '17/04/2025',
    status: 'active',
    district: 'Sơn Trà',
  },
];

export default function CanhBaoPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [levelFilter, setLevelFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const filtered = mockWarnings.filter((w) => {
    const matchSearch =
      !search ||
      w.id.toLowerCase().includes(search.toLowerCase()) ||
      w.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || w.status === statusFilter;
    const matchLevel = !levelFilter || w.level === levelFilter;
    const matchDistrict = !districtFilter || w.district === districtFilter;
    return matchSearch && matchStatus && matchLevel && matchDistrict;
  });

  const districts = [...new Set(mockWarnings.map((w) => w.district))];

  const columns: Column<FoodSafetyWarning>[] = [
    {
      key: 'id',
      header: 'Mã cảnh báo',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: (r) => <strong className="text-slate-800">{r.businessName}</strong>,
    },
    { key: 'warningType', header: 'Loại cảnh báo' },
    {
      key: 'level',
      header: 'Mức độ',
      render: (r) => <Badge variant={r.level} />,
    },
    { key: 'issueDate', header: 'Ngày ban hành' },
    { key: 'expiryDate', header: 'Hiệu lực đến' },
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
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Cảnh báo An toàn Thực phẩm</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Theo dõi và quản lý các cảnh báo an toàn thực phẩm tại Đà Nẵng</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            📥 Xuất CSV
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors">
            + Tạo cảnh báo mới
          </button>
        </div>
      </div>

      <TableCard
        title="Tất cả cảnh báo"
        controls={
          <>
            <SearchInput placeholder="Tìm mã cảnh báo, tên cơ sở..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả mức độ' },
                { value: 'thấp', label: 'Thấp' },
                { value: 'trung bình', label: 'Trung bình' },
                { value: 'cao', label: 'Cao' },
              ]}
              onChange={setLevelFilter}
            />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'active', label: 'Đang hiệu lực' },
                { value: 'resolved', label: 'Đã xử lý' },
                { value: 'expired', label: 'Hết hiệu lực' },
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
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockWarnings.length} cảnh báo`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy cảnh báo nào" />
      </TableCard>
    </div>
  );
}