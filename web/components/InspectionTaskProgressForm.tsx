import { cn } from '@/lib/utils';
import type { InspectionTaskProgressStatus } from '@/components/InspectionTaskList';

export type InspectionTaskUpdateState = 'idle' | 'loading' | 'error' | 'success';

export interface InspectionTaskProgressFormValue {
  status: '' | Exclude<InspectionTaskProgressStatus, 'idle'>;
  note: string;
}

interface InspectionTaskProgressFormProps {
  currentStatus: InspectionTaskProgressStatus;
  formValue: InspectionTaskProgressFormValue;
  updateState: InspectionTaskUpdateState;
  errorMessage: string;
  onStatusChange: (status: InspectionTaskProgressFormValue['status']) => void;
  onNoteChange: (note: string) => void;
  onSubmit: () => void;
}

const statusOptions = [
  { value: '', label: 'Chọn trạng thái' },
  { value: 'in-progress', label: 'Đang kiểm tra' },
  { value: 'completed', label: 'Hoàn thành' },
] satisfies Array<{ value: InspectionTaskProgressFormValue['status']; label: string }>;

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
  const isSameStatus =
    formValue.status !== '' &&
    (currentStatus === formValue.status ||
      (currentStatus === 'idle' ? false : currentStatus === formValue.status));
  const disableSubmit = !hasSelectedStatus || isSubmitting || isSameStatus;

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
            {statusOptions.map((option) => (
              <option key={option.value || 'placeholder'} value={option.value}>
                {option.label}
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

        {currentStatus !== 'idle' && (
          <p className="text-xs text-slate-500">
            Trạng thái hiện tại:{' '}
            <span className="font-semibold text-slate-700">
              {currentStatus === 'in-progress' ? 'Đang kiểm tra' : 'Hoàn thành'}
            </span>
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
