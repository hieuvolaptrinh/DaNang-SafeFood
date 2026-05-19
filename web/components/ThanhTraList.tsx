'use client';

import type { LichThanhTra } from '@/data/mockData';

const STATUS_CONFIG: Record<string, { label: string; className: string }> = {
  'Dang xu ly': {
    label: 'Đang xử lý',
    className: 'bg-amber-50 text-amber-700 ring-1 ring-amber-200',
  },
  'Hoan thanh': {
    label: 'Hoàn thành',
    className: 'bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200',
  },
  Huy: {
    label: 'Huỷ',
    className: 'bg-slate-100 text-slate-500 ring-1 ring-slate-200',
  },
};

interface ThanhTraListProps {
  items: LichThanhTra[];
  selectedId: string;
  onSelect: (item: LichThanhTra) => void;
}

export default function ThanhTraList({ items, selectedId, onSelect }: ThanhTraListProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm overflow-hidden">
      <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
        <h2 className="text-sm font-bold text-slate-800">Danh sách lịch thanh tra</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-semibold text-slate-600">
          {items.length} lịch
        </span>
      </div>

      <ul className="divide-y divide-slate-100">
        {items.map((item) => {
          const isSelected = item.maThanhTra === selectedId;
          const status = STATUS_CONFIG[item.trangThai] ?? {
            label: item.trangThai,
            className: 'bg-slate-100 text-slate-500',
          };

          return (
            <li key={item.maThanhTra}>
              <button
                type="button"
                onClick={() => onSelect(item)}
                className={`w-full text-left px-5 py-4 transition-colors ${
                  isSelected ? 'bg-blue-50' : 'hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-[11px] font-bold font-mono ${
                          isSelected ? 'text-blue-700' : 'text-slate-400'
                        }`}
                      >
                        {item.maThanhTra}
                      </span>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-semibold ${status.className}`}>
                        {status.label}
                      </span>
                    </div>
                    <p className="mt-1 text-[13px] font-semibold text-slate-800 truncate">{item.tenCoSo}</p>
                    <p className="mt-0.5 text-[12px] text-slate-500 line-clamp-2">{item.noiDung}</p>
                  </div>
                </div>
                <div className="mt-2 flex items-center gap-3 text-[11px] text-slate-400">
                  <span>
                    👤{' '}
                    {item.tenNguoiPhuTrach ? (
                      <span className="text-slate-600 font-medium">{item.tenNguoiPhuTrach}</span>
                    ) : (
                      <span className="italic">Chưa phân công</span>
                    )}
                  </span>
                  <span>· {item.ngayTao}</span>
                </div>
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}