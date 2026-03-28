'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';
import StatCard from '@/components/StatCard';
import AlertBanner from '@/components/AlertBanner';

interface InspectionReport {
  id: string;
  business: string;
  type: string;
  inspector: string;
  date: string;
  result: 'pass' | 'fail' | 'scheduled';
  score: number;
  district: string;
}

const mockInspectionReports: InspectionReport[] = [
  {
    id: 'TT-2025001',
    business: 'Nhà hàng Hải Sản Biển Xanh',
    type: 'Thanh tra định kỳ',
    inspector: 'Nguyễn Văn Trần',
    date: '22/03/2025',
    result: 'pass',
    score: 92,
    district: 'Hải Châu',
  },
  {
    id: 'TT-2025002',
    business: 'Quán Ăn Gia Đình Việt',
    type: 'Thanh tra đột xuất',
    inspector: 'Lê Thị Mai',
    date: '20/03/2025',
    result: 'fail',
    score: 45,
    district: 'Thanh Khê',
  },
  {
    id: 'TT-2025003',
    business: 'Cửa hàng Thực phẩm Sạch Organic',
    type: 'Thanh tra định kỳ',
    inspector: 'Phạm Văn Đức',
    date: '25/03/2025',
    result: 'pass',
    score: 88,
    district: 'Ngũ Hành Sơn',
  },
  {
    id: 'TT-2025004',
    business: 'Siêu thị Mini Mart Đà Nẵng',
    type: 'Thanh tra đột xuất',
    inspector: 'Nguyễn Văn Trần',
    date: '18/03/2025',
    result: 'scheduled',
    score: 0,
    district: 'Sơn Trà',
  },
];

export default function BaoCaoPage() {
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');

  const filtered = mockInspectionReports.filter((r) => {
    const matchSearch =
      !search ||
      r.business.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchResult = !resultFilter || r.result === resultFilter;
    return matchSearch && matchResult;
  });

  const columns: Column<InspectionReport>[] = [
    {
      key: 'id',
      header: 'Mã hồ sơ',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: (r) => <strong className="text-slate-800">{r.business}</strong>,
    },
    { key: 'type', header: 'Loại thanh tra' },
    { key: 'inspector', header: 'Thanh tra viên' },
    { key: 'date', header: 'Ngày thanh tra' },
    {
      key: 'result',
      header: 'Kết quả',
      render: (r) => <Badge variant={r.result} />,
    },
    {
      key: 'score',
      header: 'Điểm',
      render: (r) => (
        <span className={`font-bold ${r.score >= 80 ? 'text-emerald-600' : r.score >= 60 ? 'text-amber-600' : 'text-red-600'}`}>
          {r.score}/100
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <div className="flex gap-1.5">
          <button className="w-7 h-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm transition-colors">👁</button>
          <button className="w-7 h-7 rounded-md border border-slate-200 bg-white hover:bg-slate-50 text-sm transition-colors">✏️</button>
        </div>
      ),
    },
  ];

  const total = mockInspectionReports.length;
  const completed = mockInspectionReports.filter((r) => r.result === 'pass' || r.result === 'fail').length;
  const failed = mockInspectionReports.filter((r) => r.result === 'fail').length;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Báo cáo Thanh tra</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Tổng hợp báo cáo và kết quả thanh tra an toàn thực phẩm</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            📥 Xuất PDF
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700">
            + Tạo báo cáo mới
          </button>
        </div>
      </div>

      {/* Alert */}
      <AlertBanner
        type="warning"
        title="3 báo cáo chưa hoàn tất"
        message="Vui lòng kiểm tra và hoàn thiện báo cáo thanh tra trong tuần này."
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Tổng số" value={total} color="blue" />
        <StatCard label="Hoàn thành" value={completed} color="green" />
        <StatCard label="Đang xử lý" value={12} color="orange" />
        <StatCard label="Không đạt" value={failed} color="red" />
      </div>

      {/* Table */}
      <TableCard
        title="Báo cáo thanh tra"
        controls={
          <>
            <SearchInput placeholder="Tìm cơ sở, mã hồ sơ..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả kết quả' },
                { value: 'pass', label: 'Đạt' },
                { value: 'fail', label: 'Không đạt' },
                { value: 'scheduled', label: 'Đã lên lịch' },
              ]}
              onChange={setResultFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockInspectionReports.length} báo cáo`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy báo cáo nào" />
      </TableCard>
    </div>
  );
}