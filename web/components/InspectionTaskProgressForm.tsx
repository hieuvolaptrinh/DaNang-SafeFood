import { GovBtn } from '@/components/GovUI';
import type { NhiemVuStatus } from '@/components/InspectionTaskList';
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

type StatusKey = 'pending' | 'received' | 'processing' | 'completed';

const STATUS_FAMILY_SINGLE: Record<StatusKey, NhiemVuStatus> = {
  pending: 'ChÆ°a nháº­n' as NhiemVuStatus,
  received: 'ÄÃ£ nháº­n' as NhiemVuStatus,
  processing: 'Äang thá»±c hiá»‡n' as NhiemVuStatus,
  completed: 'HoÃ n thÃ nh' as NhiemVuStatus,
};

const STATUS_FAMILY_DOUBLE: Record<StatusKey, NhiemVuStatus> = {
  pending: 'ChÃ†Â°a nhÃ¡ÂºÂ­n' as NhiemVuStatus,
  received: 'Ã„ÂÃƒÂ£ nhÃ¡ÂºÂ­n' as NhiemVuStatus,
  processing: 'Ã„Âang thÃ¡Â»Â±c hiÃ¡Â»â€¡n' as NhiemVuStatus,
  completed: 'HoÃƒÂ n thÃƒÂ nh' as NhiemVuStatus,
};

const STATUS_LABELS: Record<StatusKey, string> = {
  pending: 'Chưa nhận',
  received: 'Đã nhận',
  processing: 'Đang thực hiện',
  completed: 'Hoàn thành',
};

const STATUS_ORDER: StatusKey[] = ['pending', 'received', 'processing', 'completed'];

function getStatusKey(status: string): StatusKey {
  if (status.startsWith('Ho')) {
    return 'completed';
  }

  if (status.startsWith('Ch')) {
    return 'pending';
  }

  if (status.includes('thÃ¡') || status.includes('thá') || status.includes('hiÃ¡') || status.includes('hiá')) {
    return 'processing';
  }

  return 'received';
}

function getStatusFamily(status: string) {
  return status.includes('Â') ? STATUS_FAMILY_DOUBLE : STATUS_FAMILY_SINGLE;
}

function getAvailableStatuses(currentStatus: NhiemVuStatus): NhiemVuStatus[] {
  const family = getStatusFamily(currentStatus);
  const currentKey = getStatusKey(currentStatus);
  const currentIndex = STATUS_ORDER.indexOf(currentKey);

  return STATUS_ORDER.slice(currentIndex).map((key) => family[key]);
}

function getStatusLabel(status: NhiemVuStatus) {
  return STATUS_LABELS[getStatusKey(status)];
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
  const availableStatuses = getAvailableStatuses(currentStatus);
  const currentStatusKey = getStatusKey(currentStatus);

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
                {getStatusLabel(status)}
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
            Trạng thái hiện tại: <span className="font-semibold text-slate-700">{getStatusLabel(currentStatus)}</span>
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
