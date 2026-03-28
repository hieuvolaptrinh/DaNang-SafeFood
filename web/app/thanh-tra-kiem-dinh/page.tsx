'use client';

import { useState } from 'react';
import { mockInspections, Inspection } from '@/data/mockData';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';
import StatCard from '@/components/StatCard';
import AlertBanner from '@/components/AlertBanner';

export default function ThanhTraKiemDinhPage() {
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');

  const filtered = mockInspections.filter((r) => {
    const matchSearch =
      !search ||
      r.business.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchResult = !resultFilter || r.result === resultFilter;
    return matchSearch && matchResult;
  });

  const columns: Column<Inspection>[] = [
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
    { key: 'type',       header: 'Loại thanh tra' },
    { key: 'inspector',  header: 'Thanh tra viên' },
    { key: 'date',       header: 'Ngày' },
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

  const total     = mockInspections.length;
  const completed = mockInspections.filter((r) => r.result === 'pass' || r.result === 'fail').length;
  const failed    = mockInspections.filter((r) => r.result === 'fail').length;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Thanh tra & Kiểm định</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Theo dõi tất cả lịch và kết quả thanh tra an toàn thực phẩm</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            📥 Xuất
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700">
            + Tạo hồ sơ thanh tra
          </button>
        </div>
      </div>

      {/* Alert */}
      <AlertBanner
        type="warning"
        title="8 cuộc thanh tra đến hạn tuần này"
        message="Vui lòng xem xét và hoàn thành tất cả các cuộc thanh tra quá hạn trước thứ Sáu, ngày 17/01."
      />

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Tổng số"     value={total}     color="blue"   />
        <StatCard label="Hoàn thành"  value={completed} color="green"  />
        <StatCard label="Đã lên lịch" value={56}        color="orange" />
        <StatCard label="Không đạt"   value={failed}    color="red"    />
      </div>

      {/* Table */}
      <TableCard
        title="Hồ sơ thanh tra"
        controls={
          <>
            <SearchInput placeholder="Tìm cơ sở..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '',          label: 'Tất cả kết quả' },
                { value: 'pass',      label: 'Đạt' },
                { value: 'fail',      label: 'Không đạt' },
                { value: 'scheduled', label: 'Đã lên lịch' },
              ]}
              onChange={setResultFilter}
            />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả thanh tra viên' },
                { value: 'Nguyễn Văn Trần', label: 'Nguyễn Văn Trần' },
                { value: 'Lê Thị Mai',      label: 'Lê Thị Mai' },
                { value: 'Phạm Văn Đức',    label: 'Phạm Văn Đức' },
              ]}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số 312 hồ sơ`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy hồ sơ nào" />
      </TableCard>
    </div>
  );
}
