'use client';

import AlertBanner from '@/components/AlertBanner';
import ComplaintStatusBadge from '@/components/ComplaintStatusBadge';
import type { ComplaintRecord } from '@/data/mockData';

interface ComplaintDetailProps {
  complaint: ComplaintRecord | null;
  notFound: boolean;
  inspectionCompleted: boolean;
  onRunInspection: () => void;
  onResetSelection: () => void;
}

export default function ComplaintDetail({
  complaint,
  notFound,
  inspectionCompleted,
  onRunInspection,
  onResetSelection,
}: ComplaintDetailProps) {
  if (notFound) {
    return (
      <div className="rounded-xl border border-red-200 bg-white p-5 shadow-sm">
        <AlertBanner
          type="danger"
          title="Không tìm thấy khiếu nại"
          message="Vui lòng chọn lại một bản ghi hợp lệ từ danh sách để tiếp tục xử lý."
          className="mb-0"
        />
        <button
          type="button"
          onClick={onResetSelection}
          className="mt-4 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          Chọn lại khiếu nại
        </button>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">Chọn một khiếu nại để xem chi tiết</p>
        <p className="mt-1 text-sm text-slate-500">
          Thông tin người gửi, minh chứng và khu vực xử lý sẽ hiển thị ở đây.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <p className="font-mono text-[12px] text-slate-400">{complaint.id}</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">{complaint.title}</h2>
        </div>
        <ComplaintStatusBadge status={complaint.status} />
      </div>

      <div className="mt-5 space-y-5">
        <section>
          <p className="text-[12px] font-bold uppercase tracking-wide text-slate-400">
            Nội dung khiếu nại
          </p>
          <p className="mt-2 text-sm leading-6 text-slate-700">{complaint.content}</p>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] font-bold uppercase tracking-wide text-slate-400">
              Kiểm tra thực địa
            </p>
            <button
              type="button"
              onClick={onRunInspection}
              className="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1.5 text-[12px] font-semibold text-blue-700 transition-colors hover:bg-blue-100"
            >
              {inspectionCompleted ? 'Đã kiểm tra mô phỏng' : 'Thực hiện kiểm tra'}
            </button>
          </div>

          <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              {inspectionCompleted
                ? complaint.inspectionSummary ??
                  'Đã ghi nhận biên bản kiểm tra sơ bộ, đối chiếu minh chứng và chuyển sang bước nhập kết quả xử lý.'
                : 'Chưa thực hiện kiểm tra mô phỏng. Nhấn nút ở trên để xác nhận đã kiểm tra hiện trường.'}
            </p>
          </div>
        </section>

        <section>
          <p className="text-[12px] font-bold uppercase tracking-wide text-slate-400">
            Minh chứng
          </p>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {complaint.evidence.map((item) => (
              <div
                key={item.id}
                className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm"
              >
                <div className="mb-3 flex h-24 items-center justify-center rounded-lg border border-dashed border-slate-200 bg-slate-50 text-2xl">
                  {item.kind === 'image' ? '🖼️' : '📄'}
                </div>
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="mt-1 text-[13px] text-slate-500">{item.note}</p>
              </div>
            ))}
          </div>
        </section>

        <section>
          <p className="text-[12px] font-bold uppercase tracking-wide text-slate-400">
            Thông tin người gửi
          </p>
          <div className="mt-3 grid gap-3 rounded-xl border border-slate-200 bg-slate-50 p-4 sm:grid-cols-2">
            <div>
              <p className="text-[12px] text-slate-400">Họ tên</p>
              <p className="text-sm font-semibold text-slate-800">
                {complaint.submitterInfo.fullName}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-slate-400">Số điện thoại</p>
              <p className="text-sm font-semibold text-slate-800">
                {complaint.submitterInfo.phone}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-slate-400">Email</p>
              <p className="text-sm font-semibold text-slate-800">
                {complaint.submitterInfo.email}
              </p>
            </div>
            <div>
              <p className="text-[12px] text-slate-400">Địa chỉ</p>
              <p className="text-sm font-semibold text-slate-800">
                {complaint.submitterInfo.address}
              </p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
