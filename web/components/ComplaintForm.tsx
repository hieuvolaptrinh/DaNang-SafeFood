'use client';

import type { ComplaintStatus } from '@/data/mockData';

interface ComplaintFormState {
  handlingResult: string;
  status: ComplaintStatus;
}

interface ComplaintFormProps {
  formState: ComplaintFormState;
  onChange: (nextState: ComplaintFormState) => void;
  onSubmit: () => void;
  isDisabled: boolean;
  validationMessage: string;
  hasComplaintSelected: boolean;
}

export default function ComplaintForm({
  formState,
  onChange,
  onSubmit,
  isDisabled,
  validationMessage,
  hasComplaintSelected,
}: ComplaintFormProps) {
  return (
    <div className="border border-slate-300 bg-white p-5 shadow-sm">
      <div className="border-b border-slate-300 pb-4">
        <h2 className="text-base font-bold text-slate-900">Xử lý khiếu nại</h2>
        <p className="mt-1 text-sm text-slate-500">
          Nhập kết quả xử lý và cập nhật trạng thái để lưu thay đổi.
        </p>
      </div>

      <div className="mt-5 space-y-4">
        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">
            Kết quả xử lý
          </span>
          <textarea
            value={formState.handlingResult}
            onChange={(event) =>
              onChange({
                ...formState,
                handlingResult: event.target.value,
              })
            }
            rows={5}
            placeholder="Nhập kết quả xử lý"
            disabled={!hasComplaintSelected}
            className="w-full border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors placeholder:text-slate-400 focus:border-sky-600 disabled:cursor-not-allowed disabled:bg-slate-100"
          />
        </label>

        {validationMessage && (
          <p className="text-sm font-medium text-red-600">{validationMessage}</p>
        )}

        <label className="block">
          <span className="mb-2 block text-sm font-semibold text-slate-700">Trạng thái</span>
          <select
            value={formState.status}
            onChange={(event) =>
              onChange({
                ...formState,
                status: event.target.value as ComplaintStatus,
              })
            }
            disabled={!hasComplaintSelected}
            className="w-full border border-slate-300 bg-slate-50 px-3 py-2.5 text-sm text-slate-800 outline-none transition-colors focus:border-sky-600 disabled:cursor-not-allowed disabled:bg-slate-100"
          >
            <option value="processing">Đang xử lý</option>
            <option value="resolved">Đã xử lý</option>
          </select>
        </label>

        <button
          type="button"
          onClick={onSubmit}
          disabled={isDisabled}
          className="inline-flex items-center border border-sky-700 bg-sky-700 px-4 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:border-slate-300 disabled:bg-slate-300"
        >
          Cập nhật kết quả
        </button>
      </div>
    </div>
  );
}
