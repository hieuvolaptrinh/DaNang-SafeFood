'use client';

import type { LichThanhTra } from '@/data/mockData';

const STATUS_CONFIG: Record<string, { label: string; className: string; dotClass: string }> = {
  'Dang xu ly': {
    label: 'Đang xử lý',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
    dotClass: 'bg-amber-400',
  },
  'Hoan thanh': {
    label: 'Hoàn thành',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
    dotClass: 'bg-emerald-500',
  },
  Huy: {
    label: 'Huỷ',
    className: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
    dotClass: 'bg-slate-400',
  },
};

interface ThanhTraDetailProps {
  item: LichThanhTra | null;
  notFound: boolean;
  onResetSelection: () => void;
}

export default function ThanhTraDetail({ item, notFound, onResetSelection }: ThanhTraDetailProps) {
  if (notFound) {
    return (
      <div className="rounded-xl border border-red-100 bg-red-50 px-5 py-8 text-center shadow-sm">
        <p className="text-sm font-semibold text-red-700">Không tìm thấy lịch thanh tra</p>
        <p className="mt-1 text-xs text-red-500">Mã thanh tra không tồn tại trong hệ thống.</p>
        <button
          type="button"
          onClick={onResetSelection}
          className="mt-4 rounded-lg bg-red-600 px-4 py-2 text-xs font-semibold text-white hover:bg-red-700 transition-colors"
        >
          Quay lại danh sách
        </button>
      </div>
    );
  }

  if (!item) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-8 text-center shadow-sm text-sm text-slate-400">
        Chọn một lịch thanh tra để xem chi tiết
      </div>
    );
  }

  const status = STATUS_CONFIG[item.trangThai] ?? {
    label: item.trangThai,
    className: 'bg-slate-100 text-slate-500',
    dotClass: 'bg-slate-400',
  };

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between gap-3">
        <div>
          <p className="text-[11px] font-bold font-mono text-slate-400">{item.maThanhTra}</p>
          <h2 className="text-sm font-bold text-slate-800 mt-0.5">{item.tenCoSo}</h2>
        </div>
        <span className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold ${status.className}`}>
          <span className={`h-1.5 w-1.5 rounded-full ${status.dotClass}`} />
          {status.label}
        </span>
      </div>

      <div className="px-5 py-4 space-y-4">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Nội dung thanh tra</p>
          <p className="mt-1 text-[13px] text-slate-700">{item.noiDung}</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Mã cơ sở</p>
            <p className="mt-1 text-[13px] font-mono font-semibold text-slate-700">{item.maCoSo}</p>
          </div>
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Ngày tạo</p>
            <p className="mt-1 text-[13px] text-slate-700">{item.ngayTao}</p>
          </div>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Địa chỉ</p>
          <p className="mt-1 text-[13px] text-slate-700">{item.diaChi}</p>
        </div>

        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide text-slate-400">Người phụ trách</p>
          {item.tenNguoiPhuTrach ? (
            <div className="mt-1 flex items-center gap-2">
              <div className="h-7 w-7 rounded-full bg-blue-100 flex items-center justify-center text-xs font-bold text-blue-700">
                {item.tenNguoiPhuTrach.split(' ').pop()?.charAt(0)}
              </div>
              <div>
                <p className="text-[13px] font-semibold text-slate-800">{item.tenNguoiPhuTrach}</p>
                <p className="text-[11px] text-slate-400">{item.maNguoiPhuTrach}</p>
              </div>
            </div>
          ) : (
            <p className="mt-1 text-[13px] italic text-slate-400">Chưa phân công</p>
          )}
        </div>

        {item.ketQuaKiemTra && (
          <div className="rounded-lg bg-emerald-50 border border-emerald-100 px-4 py-3">
            <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-600">Kết quả kiểm tra</p>
            <p className="mt-1 text-[13px] text-emerald-800">{item.ketQuaKiemTra}</p>
          </div>
        )}
      </div>
    </div>
  );
}