'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiEdit, FiEye } from 'react-icons/fi';
import AlertBanner from '@/components/AlertBanner';
import Badge from '@/components/Badge';
import CreateInspectionReportForm, {
  type CreateInspectionReportPayload,
} from '@/components/CreateInspectionReportForm';
import DataTable, { type Column } from '@/components/DataTable';
import StatCard from '@/components/StatCard';
import TableCard, { FilterSelect, Pagination, SearchInput } from '@/components/TableCard';
import { mockInspectionReports, type InspectionReport } from '@/data/mockData';
import { cn } from '@/lib/utils';

type PageMode = 'list' | 'create';

const inspectionTypeLabels: Record<CreateInspectionReportPayload['inspectionType'], string> = {
  'Định kỳ': 'Thanh tra định kỳ',
  'Đột xuất': 'Thanh tra đột xuất',
  'Theo phản ánh': 'Thanh tra theo phản ánh',
};

function getScoreClassName(score: number) {
  if (score >= 80) {
    return 'text-emerald-600';
  }

  if (score >= 50) {
    return 'text-amber-600';
  }

  return 'text-red-600';
}

export default function BaoCaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<PageMode>('list');
  const [reports, setReports] = useState<InspectionReport[]>(mockInspectionReports);
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const updatedId = searchParams.get('updated');
  const bannerMessage = updatedId ? `Cập nhật báo cáo ${updatedId} thành công` : successMessage;
  const nextReportId = useMemo(() => `BC-${String(reports.length + 1).padStart(3, '0')}`, [reports.length]);

  const filtered = useMemo(
    () =>
      reports.filter((report) => {
        const matchSearch =
          !search ||
          report.tenCoSo.toLowerCase().includes(search.toLowerCase()) ||
          report.id.toLowerCase().includes(search.toLowerCase());
        const matchResult = !resultFilter || report.ketQua === resultFilter;
        return matchSearch && matchResult;
      }),
    [reports, resultFilter, search]
  );

  const total = reports.length;
  const completed = reports.filter((report) => report.ketQua === 'pass' || report.ketQua === 'fail').length;
  const failed = reports.filter((report) => report.ketQua === 'fail').length;

  const handleCreateClick = () => {
    setSuccessMessage('');
    setMode('create');
  };

  const handleCancel = () => {
    setMode('list');
  };

  const handleCreateReport = async (values: CreateInspectionReportPayload) => {
    const nextReport: InspectionReport = {
      id: nextReportId,
      tenCoSo: values.facilityName,
      loaiThanhTra: inspectionTypeLabels[values.inspectionType],
      thanhTraVien: 'Người dùng hiện tại',
      ngay: values.inspectionDate,
      ketQua: values.result,
      diem: values.score,
      quanHuyen: values.district,
      noiDung: values.content,
      nhanXet: values.comment,
      tepDinhKem: values.fileName,
    };

    setReports((current) => [nextReport, ...current]);
    setMode('list');
    setSuccessMessage('Gửi báo cáo thành công. Báo cáo mới đã được lưu vào danh sách.');
  };

  const columns: Column<InspectionReport>[] = [
    {
      key: 'id',
      header: 'Mã báo cáo',
      render: (report) => <span className="font-mono text-[12px] text-slate-500">{report.id}</span>,
    },
    {
      key: 'tenCoSo',
      header: 'Cơ sở',
      render: (report) => <strong className="text-slate-800">{report.tenCoSo}</strong>,
    },
    { key: 'loaiThanhTra', header: 'Loại thanh tra' },
    { key: 'thanhTraVien', header: 'Thanh tra viên' },
    { key: 'ngay', header: 'Ngày kiểm tra' },
    {
      key: 'ketQua',
      header: 'Kết quả',
      render: (report) => <Badge variant={report.ketQua} />,
    },
    {
      key: 'diem',
      header: 'Điểm',
      render: (report) => <span className={cn('font-bold', getScoreClassName(report.diem))}>{report.diem}/100</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (report) => (
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/thanh-tra-kiem-dinh/bao-cao/${report.id}`);
            }}
            className="rounded-md border border-slate-200 bg-white p-2 text-blue-500 transition hover:bg-gray-100"
            aria-label={`Xem báo cáo ${report.id}`}
            title="Xem báo cáo"
          >
            <FiEye size={18} />
          </button>
          <button
            type="button"
            onClick={(event) => {
              event.stopPropagation();
              router.push(`/thanh-tra-kiem-dinh/bao-cao/${report.id}/edit`);
            }}
            className="rounded-md border border-slate-200 bg-white p-2 text-amber-500 transition hover:bg-gray-100"
            aria-label={`Chỉnh sửa báo cáo ${report.id}`}
            title="Chỉnh sửa báo cáo"
          >
            <FiEdit size={18} />
          </button>
        </div>
      ),
    },
  ];

  if (mode === 'create') {
    return <CreateInspectionReportForm reportId={nextReportId} onCancel={handleCancel} onSubmit={handleCreateReport} />;
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">Báo cáo Thanh tra</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Tổng hợp báo cáo và kết quả thanh tra an toàn thực phẩm
          </p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
            📥 Xuất PDF
          </button>
          <button
            onClick={handleCreateClick}
            className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-blue-700"
          >
            + Tạo báo cáo mới
          </button>
        </div>
      </div>

      {bannerMessage && <AlertBanner type="success" title={bannerMessage} className="mb-5" />}

      <AlertBanner
        type="warning"
        title="3 báo cáo chưa hoàn tất"
        message="Vui lòng kiểm tra và hoàn thiện báo cáo thanh tra trong tuần này."
      />

      <div className="mb-6 grid grid-cols-4 gap-4">
        <StatCard label="Tổng số" value={total} color="blue" />
        <StatCard label="Hoàn thành" value={completed} color="green" />
        <StatCard label="Đang xử lý" value={12} color="orange" />
        <StatCard label="Không đạt" value={failed} color="red" />
      </div>

      <TableCard
        title="Báo cáo thanh tra"
        controls={
          <>
            <SearchInput placeholder="Tìm cơ sở, mã báo cáo..." onChange={setSearch} />
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
        footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${reports.length} báo cáo`} />}
      >
        <DataTable columns={columns} data={filtered} emptyMessage="Không tìm thấy báo cáo nào" />
      </TableCard>
    </div>
  );
}
