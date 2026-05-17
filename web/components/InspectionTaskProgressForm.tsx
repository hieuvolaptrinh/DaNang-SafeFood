import { cn } from '@/lib/utils';
import type { NhiemVuStatus } from '@/components/InspectionTaskList';

export type InspectionTaskUpdateState = 'idle' | 'loading' | 'error' | 'success';

export interface InspectionTaskProgressFormValue {
  status: '' | NhiemVuStatus;
  note: string;
}

interface InspectionTaskProgressFormProps {
  currentStatus: NhiemVuStatus;
  formValue: InspectionTaskProgressFormValue;
  updateState: InspectionTaskUpdateState;
  errorMessage: string;
  onStatusChange: (status: InspectionTaskProgressFormValue['status']) => void;
  onNoteChange: (note: string) => void;
  onSubmit: () => void;
}

const allStatuses: NhiemVuStatus[] = ['Chưa nhận', 'Đã nhận', 'Đang thực hiện', 'Hoàn thành'];

function getAvailableStatuses(currentStatus: NhiemVuStatus): NhiemVuStatus[] {
  const statusPriority: Record<NhiemVuStatus, number> = {
    'Chưa nhận': 0,
    'Đã nhận': 1,
    'Đang thực hiện': 2,
    'Hoàn thành': 3,
  };

  const currentPriority = statusPriority[currentStatus];
  // Cho phép chọn trạng thái từ hiện tại trở đi (chỉ tiến về phía trước)
  return allStatuses.filter((status) => statusPriority[status] >= currentPriority);
}

const statusLabels: Record<NhiemVuStatus, string> = {
  'Chưa nhận': 'Chưa nhận',
  'Đã nhận': 'Đã nhận',
  'Đang thực hiện': 'Đang thực hiện',
  'Hoàn thành': 'Hoàn thành',
};

export default function InspectionTaskProgressForm({
  currentStatus,
  formValue,
  updateState,
  errorMessage,
  onStatusChange,
  onNoteChange,
  onSubmit,
}: InspectionTaskProgressFormProps) {
  const isSubmitting = updateState === 'loading';
  const hasSelectedStatus = formValue.status !== '';
  const isSameStatus = formValue.status !== '' && formValue.status === currentStatus;
  const disableSubmit = !hasSelectedStatus || isSubmitting || isSameStatus;
  
  const availableStatuses = getAvailableStatuses(currentStatus);

  return (
    <div className="mt-3 rounded-xl border border-slate-200 bg-slate-50 p-4">
      <div className="grid gap-4">
        <div>
          <label className="mb-1.5 block text-[12px] font-bold text-slate-600">
            Trạng thái kiểm tra
          </label>
          <select
            value={formValue.status}
            onChange={(event) =>
              onStatusChange(event.target.value as InspectionTaskProgressFormValue['status'])
            }
            className="w-full rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
          >
            <option value="">Chọn trạng thái</option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {statusLabels[status]}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-bold text-slate-600">
            Ghi chú
          </label>
          <textarea
            value={formValue.note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={4}
            placeholder="Nhập ghi chú"
            className="w-full resize-none rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-blue-500"
          />
        </div>

        {errorMessage && (
          <p className="text-sm font-medium text-red-600">{errorMessage}</p>
        )}

        {currentStatus !== 'Chưa nhận' && (
          <p className="text-xs text-slate-500">
            Trạng thái hiện tại:{' '}
            <span className="font-semibold text-slate-700">{statusLabels[currentStatus]}</span>
          </p>
        )}

        <button
          type="button"
          onClick={onSubmit}
          disabled={disableSubmit}
          className={cn(
            'inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
            disableSubmit
              ? 'cursor-not-allowed bg-slate-200 text-slate-500'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          )}
        >
          {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
        </button>
      </div>
    </div>
  );
}
