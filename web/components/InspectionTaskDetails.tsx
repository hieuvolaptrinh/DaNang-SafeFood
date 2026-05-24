import Badge from '@/components/Badge';
import { GovBtn } from '@/components/GovUI';
import type { InspectionTaskRecord } from '@/components/InspectionTaskList';
import {
  getInspectionTaskStatusBadge,
  getInspectionTaskStatusKey,
} from '@/components/inspectionTaskStatus';
import InspectionTaskProgressForm, {
  type InspectionTaskProgressFormValue,
  type InspectionTaskUpdateState,
} from '@/components/InspectionTaskProgressForm';
import { cn } from '@/lib/utils';
import { FiClock, FiClipboard, FiMapPin } from 'react-icons/fi';

interface InspectionTaskDetailsProps {
  task: InspectionTaskRecord | null;
  isConfirming: boolean;
  isRejecting: boolean;
  onConfirm: () => void;
  onReject: () => void;
  progressForm: InspectionTaskProgressFormValue;
  updateState: InspectionTaskUpdateState;
  updateErrorMessage: string;
  onProgressStatusChange: (status: InspectionTaskProgressFormValue['status']) => void;
  onProgressNoteChange: (note: string) => void;
  onProgressSubmit: () => void;
}

function DetailSection({
  icon: Icon,
  title,
  children,
}: {
  icon: typeof FiMapPin;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3 border border-slate-300 bg-white p-4 shadow-sm">
      <div className="flex items-start gap-3">
        <div className="flex h-8 w-8 items-center justify-center border border-emerald-200 bg-emerald-50 text-emerald-700">
          <Icon className="text-[16px]" />
        </div>
        <h3 className="text-[13px] font-bold uppercase tracking-[0.04em] text-emerald-800">
          {title}
        </h3>
      </div>
      {children}
    </section>
  );
}

export default function InspectionTaskDetails({
  task,
  isConfirming,
  isRejecting,
  onConfirm,
  onReject,
  progressForm,
  updateState,
  updateErrorMessage,
  onProgressStatusChange,
  onProgressNoteChange,
  onProgressSubmit,
}: InspectionTaskDetailsProps) {
  if (!task) {
    return (
      <div className="border border-dashed border-slate-300 bg-white p-6 text-center text-sm text-slate-500 shadow-sm">
        Chọn một nhiệm vụ từ danh sách để xem chi tiết.
      </div>
    );
  }

  const statusKey = getInspectionTaskStatusKey(task.trangThai);
  const badge = getInspectionTaskStatusBadge(task.trangThai);
  const canAcceptTask = statusKey === 'pending';
  const canRejectTask = statusKey === 'pending';
  const canUpdateProgress = statusKey !== 'pending';

  return (
    <div className="border border-slate-300 bg-white shadow-sm">
      <div className="border-b border-slate-300 p-5">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[11px] font-mono text-slate-400">{task.id}</p>
            <h2 className="mt-1 text-lg font-extrabold text-slate-900">{task.businessName}</h2>
          </div>
          <Badge variant={badge.variant} label={badge.label} />
        </div>
      </div>

      <div className="space-y-5 p-5">
        <DetailSection icon={FiMapPin} title="Thông tin cơ sở">
          <div className="border border-slate-300 bg-slate-50 px-4 py-4">
            <p className="text-sm font-semibold text-slate-900">{task.businessName}</p>
            <p className="mt-1 text-sm leading-6 text-slate-700">{task.address}</p>
          </div>
        </DetailSection>

        <DetailSection icon={FiClipboard} title="Nội dung kiểm tra">
          <div className="border border-slate-300 bg-slate-50 px-4 py-4 text-sm leading-6 text-slate-700">
            {task.inspectionContent}
          </div>
        </DetailSection>

        <DetailSection icon={FiClock} title="Thời gian">
          <div className="border border-slate-300 bg-slate-50 px-4 py-4 text-sm text-slate-700">
            {task.inspectionTime}
          </div>
        </DetailSection>

        {canUpdateProgress && (
          <DetailSection icon={FiClipboard} title="Cập nhật tiến độ kiểm tra">
            <InspectionTaskProgressForm
              currentStatus={task.trangThai}
              formValue={progressForm}
              updateState={updateState}
              errorMessage={updateErrorMessage}
              onStatusChange={onProgressStatusChange}
              onNoteChange={onProgressNoteChange}
              onSubmit={onProgressSubmit}
            />
          </DetailSection>
        )}

        <div className="space-y-3 border-t border-slate-300 pt-5">
          {canAcceptTask && (
            <>
              <GovBtn variant="primary" onClick={onConfirm} disabled={isConfirming || isRejecting}>
                {isConfirming ? 'Đang xác nhận...' : 'Nhận nhiệm vụ'}
              </GovBtn>

              {canRejectTask && (
                <button
                  type="button"
                  onClick={onReject}
                  disabled={isRejecting || isConfirming}
                  className={cn(
                    'inline-flex w-full items-center justify-center border px-4 py-2 text-sm font-semibold transition-colors',
                    isRejecting || isConfirming
                      ? 'cursor-not-allowed border-slate-300 bg-slate-200 text-slate-500'
                      : 'border-red-300 bg-white text-red-600 hover:bg-red-50'
                  )}
                >
                  {isRejecting ? 'Đang từ chối...' : 'Từ chối nhiệm vụ'}
                </button>
              )}
            </>
          )}

          {!canAcceptTask && (
            <p className="text-center text-xs text-slate-500">
              Nhiệm vụ này đã được xác nhận. Cập nhật tiến độ ở trên.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
