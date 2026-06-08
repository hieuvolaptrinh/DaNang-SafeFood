'use client';

import AlertBanner from '@/components/AlertBanner';
import ComplaintStatusBadge from '@/components/ComplaintStatusBadge';
import { GovBtn } from '@/components/GovUI';
import type { ComplaintRecord } from '@/data/mockData';
import { FiFileText, FiImage, FiMapPin, FiPhone, FiSearch, FiUser } from 'react-icons/fi';

interface ComplaintDetailProps {
  complaint: ComplaintRecord | null;
  notFound: boolean;
  inspectionCompleted: boolean;
  onRunInspection: () => void;
  onResetSelection: () => void;
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-[12px] font-bold uppercase tracking-[0.04em] text-emerald-800">
      {children}
    </p>
  );
}

function InfoField({
  icon,
  label,
  value,
}: {
  icon?: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="border border-slate-300 bg-white px-3 py-3">
      <p className="mb-1 flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.04em] text-slate-500">
        {icon}
        {label}
      </p>
      <p className="text-sm font-semibold text-slate-800">{value}</p>
    </div>
  );
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
      <div className="border border-red-200 bg-white p-5 shadow-sm">
        <AlertBanner
          type="danger"
          title="Không tìm thấy khiếu nại"
          message="Vui lòng chọn lại một bản ghi hợp lệ từ danh sách để tiếp tục xử lý."
          className="mb-0"
        />
        <div className="mt-4">
          <GovBtn variant="secondary" onClick={onResetSelection}>
            Chọn lại khiếu nại
          </GovBtn>
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="border border-slate-300 bg-white p-5 shadow-sm">
        <p className="text-sm font-semibold text-slate-700">Chọn một khiếu nại để xem chi tiết</p>
        <p className="mt-1 text-sm text-slate-500">
          Thông tin người gửi, minh chứng và khu vực xử lý sẽ hiển thị ở đây.
        </p>
      </div>
    );
  }

  return (
    <div className="border border-slate-300 bg-white p-5 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-300 pb-4">
        <div>
          <p className="font-mono text-[12px] text-slate-400">{complaint.id}</p>
          <h2 className="mt-1 text-lg font-bold text-slate-900">{complaint.title}</h2>
        </div>
        <ComplaintStatusBadge status={complaint.status} />
      </div>

      <div className="mt-5 space-y-5">
        <section>
          <SectionTitle>Nội dung khiếu nại</SectionTitle>
          <div className="mt-3 border border-slate-300 bg-slate-50 px-4 py-4">
            <p className="text-sm leading-6 text-slate-700">{complaint.content}</p>
          </div>
        </section>

        <section>
          <div className="flex items-center justify-between gap-3">
            <SectionTitle>Kiểm tra thực địa</SectionTitle>
            <GovBtn variant="outline" onClick={onRunInspection}>
              <FiSearch size={14} />
              {inspectionCompleted ? 'Đã kiểm tra mô phỏng' : 'Thực hiện kiểm tra'}
            </GovBtn>
          </div>

          <div className="mt-3 border border-slate-300 bg-slate-50 p-4">
            <p className="text-sm text-slate-700">
              {inspectionCompleted
                ? complaint.inspectionSummary ??
                  'Đã ghi nhận biên bản kiểm tra sơ bộ, đối chiếu minh chứng và chuyển sang bước nhập kết quả xử lý.'
                : 'Chưa thực hiện kiểm tra mô phỏng. Nhấn nút ở trên để xác nhận đã kiểm tra hiện trường.'}
            </p>
          </div>
        </section>

        <section>
          <SectionTitle>Minh chứng</SectionTitle>
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {complaint.evidence.map((item) => (
              <div key={item.id} className="border border-slate-300 bg-white p-4 shadow-sm">
                <div className="mb-3 flex h-24 items-center justify-center border border-dashed border-slate-300 bg-slate-50 text-slate-500">
                  {item.kind === 'image' ? <FiImage size={28} /> : <FiFileText size={28} />}
                </div>
                <p className="text-sm font-semibold text-slate-800">{item.label}</p>
                <p className="mt-1 text-[13px] text-slate-500">{item.note}</p>
                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noreferrer"
                    className="mt-3 inline-flex text-[12px] font-semibold text-sky-700 hover:underline"
                  >
                    Mở minh chứng
                  </a>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <SectionTitle>Thông tin người gửi</SectionTitle>
          <div className="mt-3 grid gap-3 border border-slate-300 bg-slate-50 p-4 sm:grid-cols-2">
            <InfoField
              icon={<FiUser size={13} />}
              label="Họ tên"
              value={complaint.submitterInfo.fullName}
            />
            <InfoField
              icon={<FiPhone size={13} />}
              label="Số điện thoại"
              value={complaint.submitterInfo.phone}
            />
            <InfoField label="Email" value={complaint.submitterInfo.email} />
            <InfoField
              icon={<FiMapPin size={13} />}
              label="Địa chỉ"
              value={complaint.submitterInfo.address}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
