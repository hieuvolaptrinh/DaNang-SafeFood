'use client';

import { useState } from 'react';
import { mockInspections, type Inspection } from '@/data/mockData';
import AlertBanner from '@/components/AlertBanner';
import Badge from '@/components/Badge';
import CreateInspectionForm from '@/components/CreateInspectionForm';
import DataTable, { type Column } from '@/components/DataTable';
import StatCard from '@/components/StatCard';
import TableCard, { FilterSelect, Pagination, SearchInput } from '@/components/TableCard';

export default function ThanhTraKiemDinhPage() {
  const [mode, setMode] = useState<'list' | 'create'>('list');
  const [inspections, setInspections] = useState<Inspection[]>(mockInspections);
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const filtered = inspections.filter((inspection) => {
    const matchSearch =
      !search ||
      inspection.business.toLowerCase().includes(search.toLowerCase()) ||
      inspection.id.toLowerCase().includes(search.toLowerCase());
    const matchResult = !resultFilter || inspection.result === resultFilter;
    return matchSearch && matchResult;
  });

  const columns: Column<Inspection>[] = [
    {
      key: 'id',
      header: 'Mã hồ sơ',
      render: (inspection) => (
        <span className="font-mono text-[12px] text-slate-500">{inspection.id}</span>
      ),
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: (inspection) => <strong className="text-slate-800">{inspection.business}</strong>,
    },
    { key: 'type', header: 'Loại thanh tra' },
    { key: 'inspector', header: 'Thanh tra viên' },
    { key: 'date', header: 'Ngày' },
    {
      key: 'result',
      header: 'Kết quả',
      render: (inspection) => <Badge variant={inspection.result} />,
    },
    {
      key: 'score',
      header: 'Điểm',
      render: (inspection) => (
        <span
          className={`font-bold ${
            inspection.score >= 80
              ? 'text-emerald-600'
              : inspection.score >= 60
                ? 'text-amber-600'
                : 'text-red-600'
          }`}
        >
          {inspection.score}/100
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <div className="flex gap-1.5">
          <button className="h-7 w-7 rounded-md border border-slate-200 bg-white text-sm transition-colors hover:bg-slate-50">
            👁
          </button>
          <button className="h-7 w-7 rounded-md border border-slate-200 bg-white text-sm transition-colors hover:bg-slate-50">
            ✏️
          </button>
        </div>
      ),
    },
  ];

  const total = inspections.length;
  const completed = inspections.filter((inspection) => inspection.result === 'pass' || inspection.result === 'fail').length;
  const failed = inspections.filter((inspection) => inspection.result === 'fail').length;

  const handleCreateClick = () => {
    setFeedbackMessage('');
    setMode('create');
  };

  const handleCancelCreate = () => {
    setMode('list');
  };

  const handleCreateSuccess = (record: Inspection) => {
    setInspections((current) => [record, ...current]);
    setMode('list');
    setFeedbackMessage('Lưu biên bản thành công. Hồ sơ kiểm tra mới đã được thêm vào danh sách.');
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">
            Thanh tra & Kiểm định
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Theo dõi tất cả lịch và kết quả thanh tra an toàn thực phẩm
          </p>
        </div>

        {mode === 'list' && (
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
              📥 Xuất
            </button>
            <button
              type="button"
              onClick={handleCreateClick}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-blue-700"
            >
              + Tạo hồ sơ thanh tra
            </button>
          </div>
        )}
      </div>

      {mode === 'create' ? (
        <CreateInspectionForm onCancel={handleCancelCreate} onSuccess={handleCreateSuccess} />
      ) : (
        <>
          {feedbackMessage && <AlertBanner type="success" title={feedbackMessage} />}

          <AlertBanner
            type="warning"
            title="8 cuộc thanh tra đến hạn tuần này"
            message="Vui lòng xem xét và hoàn thành tất cả các cuộc thanh tra quá hạn trước thứ Sáu, ngày 17/01."
          />

          <div className="mb-6 grid grid-cols-4 gap-4">
            <StatCard label="Tổng số" value={total} color="blue" />
            <StatCard label="Hoàn thành" value={completed} color="green" />
            <StatCard label="Đã lên lịch" value={56} color="orange" />
            <StatCard label="Không đạt" value={failed} color="red" />
          </div>

          <TableCard
            title="Hồ sơ thanh tra"
            controls={
              <>
                <SearchInput placeholder="Tìm cơ sở..." onChange={setSearch} />
                <FilterSelect
                  options={[
                    { value: '', label: 'Tất cả kết quả' },
                    { value: 'pass', label: 'Đạt' },
                    { value: 'fail', label: 'Không đạt' },
                    { value: 'scheduled', label: 'Đã lên lịch' },
                  ]}
                  onChange={setResultFilter}
                />
                <FilterSelect
                  options={[
                    { value: '', label: 'Tất cả thanh tra viên' },
                    { value: 'Nguyễn Văn Trần', label: 'Nguyễn Văn Trần' },
                    { value: 'Lê Thị Mai', label: 'Lê Thị Mai' },
                    { value: 'Phạm Văn Đức', label: 'Phạm Văn Đức' },
                  ]}
                />
              </>
            }
            footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${total} hồ sơ`} />}
          >
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage="Không tìm thấy hồ sơ nào"
            />
          </TableCard>
        </>
      )}
    </div>
  );
}
