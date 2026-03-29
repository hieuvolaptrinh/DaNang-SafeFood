'use client';

import { FormEvent, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import AlertBanner from '@/components/AlertBanner';
import Badge from '@/components/Badge';
import TableCard from '@/components/TableCard';
import { mockInspectionReports } from '@/data/mockData';

function mockUpdateInspectionReport() {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), 1200);
  });
}

export default function BaoCaoChinhSuaPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id = params.id;
  const report = mockInspectionReports.find((item) => item.id === id);
  const [content, setContent] = useState(report?.noiDung ?? '');
  const [comment, setComment] = useState(report?.nhanXet ?? '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = content.trim().length > 0 && comment.trim().length > 0;

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!report || !isFormValid || isSubmitting) {
      return;
    }

    setIsSubmitting(true);

    try {
      await mockUpdateInspectionReport();
      console.log('Updating report:', id);
      router.push(`/thanh-tra-kiem-dinh/bao-cao?updated=${encodeURIComponent(id)}`);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!report) {
    return (
      <div>
        <AlertBanner type="danger" title={`Không tìm thấy báo cáo ${id}`} />
        <button
          type="button"
          onClick={() => router.push('/thanh-tra-kiem-dinh/bao-cao')}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50"
        >
          Quay lại
        </button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-6 flex items-start justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">Chỉnh sửa báo cáo thanh tra</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Cập nhật nội dung báo cáo bằng dữ liệu mock hiện tại.
          </p>
        </div>
        <button
          type="button"
          onClick={() => router.push(`/thanh-tra-kiem-dinh/bao-cao/${report.id}`)}
          disabled={isSubmitting}
          className="rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
        >
          Hủy
        </button>
      </div>

      <TableCard title="Thông tin báo cáo">
        <div className="grid gap-5 border-b border-slate-100 p-5 md:grid-cols-2">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mã báo cáo</p>
            <p className="font-mono text-sm text-slate-800">{report.id}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Tên cơ sở</p>
            <p className="text-sm text-slate-800">{report.tenCoSo}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Ngày kiểm tra</p>
            <p className="text-sm text-slate-800">{report.ngay}</p>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Kết quả</p>
            <div>
              <Badge variant={report.ketQua} />
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5 p-5">
          <div className="space-y-2">
            <label htmlFor="edit-content" className="text-sm font-semibold text-slate-800">
              Nội dung báo cáo
            </label>
            <textarea
              id="edit-content"
              rows={6}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="edit-comment" className="text-sm font-semibold text-slate-800">
              Nhận xét
            </label>
            <textarea
              id="edit-comment"
              rows={4}
              value={comment}
              onChange={(event) => setComment(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm text-slate-800 outline-none transition focus:border-blue-500"
            />
          </div>

          <div className="flex items-center justify-end gap-3 border-t border-slate-100 pt-4">
            <button
              type="button"
              onClick={() => router.push(`/thanh-tra-kiem-dinh/bao-cao/${report.id}`)}
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
              {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
            </button>
          </div>
        </form>
      </TableCard>
    </div>
  );
}
