'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

interface Violation {
  id: string;
  businessName: string;
  violationType: string;
  severity: 'nhẹ' | 'trung bình' | 'nghiêm trọng';
  detectedDate: string;
  status: 'pending' | 'processing' | 'resolved';
  district: string;
}

const mockViolations: Violation[] = [
  {
    id: 'VP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh an toàn thực phẩm',
    severity: 'nghiêm trọng',
    detectedDate: '18/03/2025',
    status: 'processing',
    district: 'Hải Châu',
  },
  {
    id: 'VP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá bán',
    severity: 'nhẹ',
    detectedDate: '15/03/2025',
    status: 'resolved',
    district: 'Thanh Khê',
  },
  {
    id: 'VP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng chất cấm trong thực phẩm',
    severity: 'nghiêm trọng',
    detectedDate: '22/03/2025',
    status: 'pending',
    district: 'Ngũ Hành Sơn',
  },
  {
    id: 'VP-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    violationType: 'Bán hàng hết hạn sử dụng',
    severity: 'trung bình',
    detectedDate: '20/03/2025',
    status: 'processing',
    district: 'Sơn Trà',
  },
];

export default function DanhSachViPhamPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const filtered = mockViolations.filter((v) => {
    const matchSearch =
      !search ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.businessName.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = !severityFilter || v.severity === severityFilter;
    const matchStatus = !statusFilter || v.status === statusFilter;
    const matchDistrict = !districtFilter || v.district === districtFilter;
    return matchSearch && matchSeverity && matchStatus && matchDistrict;
  });

  const districts = [...new Set(mockViolations.map((v) => v.district))];

  const columns: Column<Violation>[] = [
    {
      key: 'id',
      header: 'Mã vi phạm',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: (r) => <strong className="text-slate-800">{r.businessName}</strong>,
    },
    { key: 'violationType', header: 'Loại vi phạm' },
    {
      key: 'severity',
      header: 'Mức độ',
      render: (r) => <Badge variant={r.severity} />,
    },
    { key: 'detectedDate', header: 'Ngày phát hiện' },
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
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Danh sách vi phạm</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Danh sách các vi phạm được ghi nhận tại các cơ sở kinh doanh trên địa bàn Đà Nẵng</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            📥 Xuất CSV
          </button>
        </div>
      </div>

      <TableCard
        title="Tất cả vi phạm"
        controls={
          <>
            <SearchInput placeholder="Tìm mã vi phạm, tên cơ sở..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả mức độ' },
                { value: 'nhẹ', label: 'Nhẹ' },
                { value: 'trung bình', label: 'Trung bình' },
                { value: 'nghiêm trọng', label: 'Nghiêm trọng' },
              ]}
              onChange={setSeverityFilter}
            />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'pending', label: 'Chưa xử lý' },
                { value: 'processing', label: 'Đang xử lý' },
                { value: 'resolved', label: 'Đã xử lý' },
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
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockViolations.length} vi phạm`} />}
      >
        <DataTable columns={columns} data={filtered } emptyMessage="Không tìm thấy vi phạm nào" />
      </TableCard>
    </div>
  );
}
