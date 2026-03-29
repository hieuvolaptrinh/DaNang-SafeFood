'use client';

import { ChangeEvent, FormEvent, useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FiEdit, FiEye } from 'react-icons/fi';
import AlertBanner from '@/components/AlertBanner';
import Badge from '@/components/Badge';
import DataTable, { Column } from '@/components/DataTable';
import StatCard from '@/components/StatCard';
import TableCard, { FilterSelect, Pagination, SearchInput } from '@/components/TableCard';
import { mockInspectionReports, type InspectionReport } from '@/data/mockData';
import { cn } from '@/lib/utils';

type PageMode = 'list' | 'create';

interface ReportFormState {
  content: string;
  comment: string;
  attachment: File | null;
  hasInspectionRecord: boolean;
}

interface CreateReportFormProps {
  onCancel: () => void;
  onSubmit?: (values: {
    content: string;
    comment: string;
    attachment: File | null;
    fileName?: string;
    hasInspectionRecord: boolean;
  }) => Promise<void> | void;
}

const MAX_ATTACHMENT_SIZE = 5 * 1024 * 1024;

const initialFormState: ReportFormState = {
  content: '',
  comment: '',
  attachment: null,
  hasInspectionRecord: true,
};

function mockSaveInspectionReport() {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), 1200);
  });
}

function formatFileSize(bytes: number) {
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function CreateReportForm({ onCancel, onSubmit }: CreateReportFormProps) {
  const [form, setForm] = useState<ReportFormState>(initialFormState);
  const [fileError, setFileError] = useState('');
  const [submitError, setSubmitError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const hasCurrentAttachment = Boolean(form.attachment);
  const hasMissingInspectionRecord = !form.hasInspectionRecord;
  const isFormValid =
    form.content.trim().length > 0 &&
    form.comment.trim().length > 0 &&
    hasCurrentAttachment &&
    !fileError &&
    !hasMissingInspectionRecord;

  const currentFileName = form.attachment?.name;

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextFile = event.target.files?.[0] ?? null;

    setSubmitError('');

    if (!nextFile) {
      setForm((current) => ({ ...current, attachment: null }));
      setFileError('');
      return;
    }

    if (nextFile.size > MAX_ATTACHMENT_SIZE) {
      event.target.value = '';
      setForm((current) => ({ ...current, attachment: null }));
      setFileError('Tệp đính kèm vượt quá dung lượng tối đa cho phép');
      return;
    }

    setForm((current) => ({ ...current, attachment: nextFile }));
    setFileError('');
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (hasMissingInspectionRecord) {
      setSubmitError('Vui lòng lập và lưu biên bản kiểm tra trước khi báo cáo');
      return;
    }

    if (!isFormValid) {
      return;
    }

    setIsSubmitting(true);
    setSubmitError('');

    try {
      await mockSaveInspectionReport();
      await onSubmit?.({
        content: form.content,
        comment: form.comment,
        attachment: form.attachment,
        fileName: currentFileName,
        hasInspectionRecord: form.hasInspectionRecord,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">Tạo báo cáo thanh tra</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Nhập nội dung báo cáo, nhận xét tổng quan và tải lên tệp đính kèm trước khi gửi.
          </p>
        </div>
        <button
          type="button"
          onClick={onCancel}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
      </div>

      {hasMissingInspectionRecord && (
        <AlertBanner
          type="danger"
          title="Vui lòng lập và lưu biên bản kiểm tra trước khi báo cáo"
          className="mb-4"
        />
      )}

      {submitError && <AlertBanner type="danger" title={submitError} className="mb-4" />}

      <TableCard title="Báo cáo kết quả thanh tra">
        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="space-y-2">
            <label htmlFor="report-content" className="text-sm font-semibold text-slate-800">
              Nội dung báo cáo
            </label>
            <textarea
              id="report-content"
              rows={6}
              value={form.content}
              onChange={(event) => setForm((current) => ({ ...current, content: event.target.value }))}
              placeholder="Nhập nội dung báo cáo kết quả thanh tra..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="general-comments" className="text-sm font-semibold text-slate-800">
              Nhận xét tổng quan
            </label>
            <textarea
              id="general-comments"
              rows={4}
              value={form.comment}
              onChange={(event) => setForm((current) => ({ ...current, comment: event.target.value }))}
              placeholder="Nhập nhận xét tổng quan về đợt thanh tra..."
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="attachment" className="text-sm font-semibold text-slate-800">
              Tệp đính kèm
            </label>
            <input
              id="attachment"
              type="file"
              onChange={handleFileChange}
              accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 file:mr-3 file:rounded-lg file:border-0 file:bg-slate-100 file:px-3 file:py-2 file:text-sm file:font-semibold file:text-slate-700 focus:border-blue-500 focus:outline-none"
            />
            <p className="text-xs text-slate-500">Dung lượng tối đa: {formatFileSize(MAX_ATTACHMENT_SIZE)}</p>
            {currentFileName && !fileError && <p className="text-sm text-slate-600">Đã chọn: {currentFileName}</p>}
            {fileError && <p className="text-sm font-medium text-red-600">{fileError}</p>}
          </div>

          <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50 p-4">
            <label className="flex items-start gap-3 text-sm text-slate-700">
              <input
                type="checkbox"
                checked={form.hasInspectionRecord}
                onChange={(event) => {
                  const nextHasRecord = event.target.checked;
                  setForm((current) => ({ ...current, hasInspectionRecord: nextHasRecord }));
                  if (!nextHasRecord) {
                    setSubmitError('Vui lòng lập và lưu biên bản kiểm tra trước khi báo cáo');
                  } else {
                    setSubmitError('');
                  }
                }}
                className="mt-0.5 h-4 w-4 rounded border-slate-300 text-blue-600"
              />
              <span>
                Biên bản kiểm tra đã được lập và lưu.
                <span className="mt-1 block text-xs text-slate-500">
                  Bỏ chọn để mô phỏng trường hợp thiếu biên bản kiểm tra và khóa gửi báo cáo.
                </span>
              </span>
            </label>
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
              className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={!isFormValid || isSubmitting}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {isSubmitting ? 'Đang gửi...' : 'Gửi báo cáo'}
            </button>
          </div>
        </form>
      </TableCard>
    </div>
  );
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

  const handleCreateReport = async (values: {
    content: string;
    comment: string;
    attachment: File | null;
    fileName?: string;
    hasInspectionRecord: boolean;
  }) => {
    const nextReport: InspectionReport = {
      id: `BC-${String(reports.length + 1).padStart(3, '0')}`,
      tenCoSo: 'Cơ sở đang cập nhật',
      loaiThanhTra: 'Báo cáo kết quả thanh tra',
      thanhTraVien: 'Người dùng hiện tại',
      ngay: new Date().toISOString().slice(0, 10),
      ketQua: 'scheduled',
      diem: 0,
      quanHuyen: 'Đang cập nhật',
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
      render: (report) => (
        <span
          className={cn(
            'font-bold',
            report.diem >= 80 ? 'text-emerald-600' : report.diem >= 60 ? 'text-amber-600' : 'text-red-600'
          )}
        >
          {report.diem}/100
        </span>
      ),
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
    return <CreateReportForm onCancel={handleCancel} onSubmit={handleCreateReport} />;
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
