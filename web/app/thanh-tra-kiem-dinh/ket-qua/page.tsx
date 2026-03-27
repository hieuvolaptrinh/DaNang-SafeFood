'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';
import StatCard from '@/components/StatCard';

interface TestResult {
  id: string;
  business: string;
  sampleType: string;
  testDate: string;
  lab: string;
  result: 'pass' | 'fail' | 'pending';
  parameters: string;
  score: number;
}

const mockTestResults: TestResult[] = [
  {
    id: 'KN-2025001',
    business: 'Nhà hàng Hải Sản Biển Xanh',
    sampleType: 'Mẫu nước rửa',
    testDate: '21/03/2025',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
    result: 'pass',
    parameters: 'Coliform, E.coli',
    score: 95,
  },
  {
    id: 'KN-2025002',
    business: 'Quán Ăn Gia Đình Việt',
    sampleType: 'Mẫu thực phẩm',
    testDate: '19/03/2025',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
    result: 'fail',
    parameters: 'Salmonella',
    score: 30,
  },
  {
    id: 'KN-2025003',
    business: 'Cửa hàng Thực phẩm Sạch Organic',
    sampleType: 'Mẫu rau củ',
    testDate: '24/03/2025',
    lab: 'Lab Việt Nam',
    result: 'pass',
    parameters: 'Kim loại nặng',
    score: 98,
  },
];

export default function KetQuaPage() {
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');

  const filtered = mockTestResults.filter((r) => {
    const matchSearch =
      !search ||
      r.business.toLowerCase().includes(search.toLowerCase()) ||
      r.id.toLowerCase().includes(search.toLowerCase());
    const matchResult = !resultFilter || r.result === resultFilter;
    return matchSearch && matchResult;
  });

  const columns: Column<TestResult>[] = [
    {
      key: 'id',
      header: 'Mã kết quả',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: (r) => <strong className="text-slate-800">{r.business}</strong>,
    },
    { key: 'sampleType', header: 'Loại mẫu' },
    { key: 'testDate', header: 'Ngày kiểm nghiệm' },
    { key: 'lab', header: 'Phòng lab' },
    {
      key: 'result',
      header: 'Kết quả',
      render: (r) => <Badge variant={r.result} />,
    },
    {
      key: 'parameters',
      header: 'Chỉ tiêu',
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

  const total = mockTestResults.length;
  const passed = mockTestResults.filter((r) => r.result === 'pass').length;
  const failed = mockTestResults.filter((r) => r.result === 'fail').length;

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Kết quả Kiểm nghiệm</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Kết quả kiểm nghiệm mẫu thực phẩm và môi trường</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            📥 Xuất Excel
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Tổng mẫu" value={total} color="blue" />
        <StatCard label="Đạt chuẩn" value={passed} color="green" />
        <StatCard label="Không đạt" value={failed} color="red" />
        <StatCard label="Chờ kết quả" value={8} color="orange" />
      </div>

      {/* Table */}
      <TableCard
        title="Kết quả kiểm nghiệm"
        controls={
          <>
            <SearchInput placeholder="Tìm cơ sở, mã kết quả..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả kết quả' },
                { value: 'pass', label: 'Đạt chuẩn' },
                { value: 'fail', label: 'Không đạt' },
                { value: 'pending', label: 'Chờ kết quả' },
              ]}
              onChange={setResultFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockTestResults.length} kết quả`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy kết quả nào" />
      </TableCard>
    </div>
  );
}