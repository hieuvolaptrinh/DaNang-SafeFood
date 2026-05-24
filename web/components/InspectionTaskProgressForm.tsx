import { GovBtn } from '@/components/GovUI';
import {
  getAvailableInspectionTaskStatuses,
  getInspectionTaskStatusKey,
  getInspectionTaskStatusLabel,
  type NhiemVuStatus,
} from '@/components/inspectionTaskStatus';
import { cn } from '@/lib/utils';

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
  const availableStatuses = getAvailableInspectionTaskStatuses(currentStatus);
  const currentStatusKey = getInspectionTaskStatusKey(currentStatus);

  return (
    <div className="border border-slate-300 bg-slate-50 p-4">
      <div className="grid gap-4">
        <div>
          <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.04em] text-slate-600">
            Trạng thái kiểm tra
          </label>
          <select
            value={formValue.status}
            onChange={(event) =>
              onStatusChange(event.target.value as InspectionTaskProgressFormValue['status'])
            }
            className="h-10 w-full border border-slate-300 bg-white px-3 text-sm text-slate-700 outline-none transition-colors focus:border-sky-600"
          >
            <option value="">Chọn trạng thái</option>
            {availableStatuses.map((status) => (
              <option key={status} value={status}>
                {getInspectionTaskStatusLabel(status)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-bold uppercase tracking-[0.04em] text-slate-600">
            Ghi chú
          </label>
          <textarea
            value={formValue.note}
            onChange={(event) => onNoteChange(event.target.value)}
            rows={4}
            placeholder="Nhập ghi chú"
            className="w-full resize-none border border-slate-300 bg-white px-3 py-2 text-sm text-slate-700 outline-none transition-colors focus:border-sky-600"
          />
        </div>

        {errorMessage && <p className="text-sm font-medium text-red-600">{errorMessage}</p>}

        {currentStatusKey !== 'pending' && (
          <p className="text-xs text-slate-500">
            Trạng thái hiện tại:{' '}
            <span className="font-semibold text-slate-700">
              {getInspectionTaskStatusLabel(currentStatus)}
            </span>
          </p>
        )}

        {disableSubmit ? (
          <button
            type="button"
            disabled
            className={cn(
              'inline-flex w-full items-center justify-center border border-slate-300 bg-slate-200 px-4 py-2 text-sm font-semibold text-slate-500'
            )}
          >
            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
          </button>
        ) : (
          <GovBtn variant="primary" onClick={onSubmit}>
            {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật'}
          </GovBtn>
        )}
      </div>
    </div>
  );
}
