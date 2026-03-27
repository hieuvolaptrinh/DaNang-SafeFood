'use client';

import { useState } from 'react';
import DataTable, { Column } from '@/components/DataTable';
import Badge from '@/components/Badge';
import TableCard, { SearchInput, FilterSelect, Pagination } from '@/components/TableCard';

interface Regulation {
  id: string;
  title: string;
  category: string;
  issueDate: string;
  effectiveDate: string;
  status: 'active' | 'draft' | 'expired';
  authority: string;
}

const mockRegulations: Regulation[] = [
  {
    id: 'QD-2025-001',
    title: 'Quy định về kiểm tra an toàn thực phẩm năm 2025',
    category: 'An toàn thực phẩm',
    issueDate: '01/01/2025',
    effectiveDate: '01/02/2025',
    status: 'active',
    authority: 'Sở Y tế Đà Nẵng',
  },
  {
    id: 'QD-2025-002',
    title: 'Hướng dẫn cấp giấy phép kinh doanh thực phẩm',
    category: 'Giấy phép',
    issueDate: '15/02/2025',
    effectiveDate: '01/03/2025',
    status: 'active',
    authority: 'UBND TP. Đà Nẵng',
  },
  {
    id: 'QD-2024-015',
    title: 'Quy định xử phạt vi phạm hành chính lĩnh vực ATTP',
    category: 'Xử phạt',
    issueDate: '10/12/2024',
    effectiveDate: '01/01/2025',
    status: 'active',
    authority: 'Chính phủ',
  },
];

export default function QuyDinhPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');

  const filtered = mockRegulations.filter((r) => {
    const matchSearch =
      !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchCategory = !categoryFilter || r.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
  });

  const categories = [...new Set(mockRegulations.map((r) => r.category))];

  const columns: Column<Regulation>[] = [
    {
      key: 'id',
      header: 'Mã quy định',
      render: (r) => <span className="font-mono text-[12px] text-slate-500">{r.id}</span>,
    },
    {
      key: 'title',
      header: 'Tiêu đề',
      render: (r) => <strong className="text-slate-800 line-clamp-2">{r.title}</strong>,
    },
    { key: 'category', header: 'Danh mục' },
    { key: 'issueDate', header: 'Ngày ban hành' },
    { key: 'effectiveDate', header: 'Ngày hiệu lực' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (r) => <Badge variant={r.status} />,
    },
    { key: 'authority', header: 'Cơ quan ban hành' },
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
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">Quy định Pháp luật</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">Danh sách các quy định, văn bản pháp luật liên quan đến an toàn thực phẩm</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
            📥 Xuất CSV
          </button>
          <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-[13px] font-semibold hover:bg-blue-700 transition-colors">
            + Thêm quy định mới
          </button>
        </div>
      </div>

      <TableCard
        title="Tất cả quy định"
        controls={
          <>
            <SearchInput placeholder="Tìm mã, tiêu đề quy định..." onChange={setSearch} />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả danh mục' },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
              onChange={setCategoryFilter}
            />
            <FilterSelect
              options={[
                { value: '', label: 'Tất cả trạng thái' },
                { value: 'active', label: 'Đang hiệu lực' },
                { value: 'draft', label: 'Bản nháp' },
                { value: 'expired', label: 'Hết hiệu lực' },
              ]}
              onChange={setStatusFilter}
            />
          </>
        }
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${mockRegulations.length} quy định`} />}
      >
        <DataTable columns={columns} data={filtered as unknown as Record<string, unknown>[]} emptyMessage="Không tìm thấy quy định nào" />
      </TableCard>
    </div>
  );
}