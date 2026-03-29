import Badge from '@/components/Badge';
import type { InspectionTaskRecord } from '@/components/InspectionTaskList';
import InspectionTaskProgressForm, {
  type InspectionTaskProgressFormValue,
  type InspectionTaskUpdateState,
} from '@/components/InspectionTaskProgressForm';
import { cn } from '@/lib/utils';

interface InspectionTaskDetailsProps {
  task: InspectionTaskRecord | null;
  isConfirming: boolean;
  onConfirm: () => void;
  progressForm: InspectionTaskProgressFormValue;
  updateState: InspectionTaskUpdateState;
  updateErrorMessage: string;
  onProgressStatusChange: (status: InspectionTaskProgressFormValue['status']) => void;
  onProgressNoteChange: (note: string) => void;
  onProgressSubmit: () => void;
}

function getStatusBadge(task: InspectionTaskRecord) {
  if (task.progressStatus === 'completed') {
    return { variant: 'active', label: 'Hoàn thành' };
  }

  if (task.progressStatus === 'in-progress') {
    return { variant: 'pending', label: 'Đang kiểm tra' };
  }

  if (task.assignmentStatus === 'accepted') {
    return { variant: 'open', label: 'Đã nhận' };
  }

  return { variant: 'pending', label: 'Chưa nhận' };
}

export default function InspectionTaskDetails({
  task,
  isConfirming,
  onConfirm,
  progressForm,
  updateState,
  updateErrorMessage,
  onProgressStatusChange,
  onProgressNoteChange,
  onProgressSubmit,
}: InspectionTaskDetailsProps) {
  if (!task) {
    return (
      <div className="rounded-xl border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
        Chọn một nhiệm vụ từ danh sách để xem chi tiết.
      </div>
    );
  }

  const badge = getStatusBadge(task);
  const canConfirmAssignment =
    task.assignmentStatus === 'pending' && task.progressStatus === 'idle';

  return (
    <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-mono text-slate-400">{task.id}</p>
            <h2 className="mt-1 text-lg font-extrabold text-slate-900">{task.businessName}</h2>
          </div>
          <Badge variant={badge.variant} label={badge.label} />
        </div>
      </div>

      <div className="space-y-5 p-5">
        <section>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Thông tin cơ sở
          </p>
          <div className="mt-3 rounded-xl bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-900">{task.businessName}</p>
            <p className="mt-1 text-sm text-slate-600">{task.address}</p>
          </div>
        </section>

        <section>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Nội dung kiểm tra
          </p>
          <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-700">
            {task.inspectionContent}
          </div>
        </section>

        <section>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Thời gian
          </p>
          <div className="mt-3 rounded-xl bg-slate-50 p-4 text-sm text-slate-700">
            {task.inspectionTime}
          </div>
        </section>

        <section>
          <p className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
            Cập nhật tiến độ kiểm tra
          </p>
          <InspectionTaskProgressForm
            currentStatus={task.progressStatus}
            formValue={progressForm}
            updateState={updateState}
            errorMessage={updateErrorMessage}
            onStatusChange={onProgressStatusChange}
            onNoteChange={onProgressNoteChange}
            onSubmit={onProgressSubmit}
          />
        </section>

        <div className="border-t border-slate-200 pt-5">
          <button
            type="button"
            onClick={onConfirm}
            disabled={!canConfirmAssignment || isConfirming}
            className={cn(
              'inline-flex w-full items-center justify-center rounded-lg px-4 py-2.5 text-sm font-semibold transition-colors',
              !canConfirmAssignment || isConfirming
                ? 'cursor-not-allowed bg-slate-200 text-slate-500'
                : 'bg-blue-600 text-white hover:bg-blue-700'
            )}
          >
            {!canConfirmAssignment
              ? 'Đã nhận nhiệm vụ'
              : isConfirming
                ? 'Đang xác nhận...'
                : 'Xác nhận nhận nhiệm vụ'}
          </button>

          {!canConfirmAssignment && (
            <p className="mt-3 text-center text-xs text-slate-500">
              Nhiệm vụ này đã được xác nhận trước đó.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
