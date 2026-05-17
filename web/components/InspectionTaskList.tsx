import Badge from '@/components/Badge';
import { cn } from '@/lib/utils';

export type NhiemVuStatus = 'Chưa nhận' | 'Đã nhận' | 'Đang thực hiện' | 'Hoàn thành';

export interface InspectionTaskRecord {
  id: string;
  businessName: string;
  address: string;
  inspectionTime: string;
  inspectionContent: string;
  trangThai: NhiemVuStatus;
  ghiChu: string;
  lyDoTuChoi?: string;
}

interface InspectionTaskListProps {
  tasks: InspectionTaskRecord[];
  selectedTaskId: string | null;
  onSelect: (taskId: string) => void;
}

function getStatusBadge(task: InspectionTaskRecord) {
  const statusMap: Record<NhiemVuStatus, { variant: 'active' | 'pending' | 'open'; label: string }> = {
    'Hoàn thành': { variant: 'active', label: 'Hoàn thành' },
    'Đang thực hiện': { variant: 'pending', label: 'Đang thực hiện' },
    'Đã nhận': { variant: 'open', label: 'Đã nhận' },
    'Chưa nhận': { variant: 'pending', label: 'Chưa nhận' },
  };

  return statusMap[task.trangThai];
}

export default function InspectionTaskList({
  tasks,
  selectedTaskId,
  onSelect,
}: InspectionTaskListProps) {
  return (
    <div className="space-y-3">
      {tasks.map((task) => {
        const isSelected = task.id === selectedTaskId;
        const badge = getStatusBadge(task);

        return (
          <button
            key={task.id}
            type="button"
            onClick={() => onSelect(task.id)}
            aria-pressed={isSelected}
            className={cn(
              'w-full rounded-xl border bg-white p-4 text-left shadow-sm transition-all',
              'hover:border-blue-300 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500/30',
              isSelected ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200'
            )}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-[11px] font-mono text-slate-400">{task.id}</p>
                <h3 className="mt-1 text-sm font-bold text-slate-900">{task.businessName}</h3>
              </div>
              <Badge variant={badge.variant} label={badge.label} />
            </div>

            <dl className="mt-4 space-y-2 text-sm text-slate-600">
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Địa chỉ
                </dt>
                <dd className="mt-0.5">{task.address}</dd>
              </div>
              <div>
                <dt className="text-[11px] font-bold uppercase tracking-wide text-slate-400">
                  Thời gian kiểm tra
                </dt>
                <dd className="mt-0.5">{task.inspectionTime}</dd>
              </div>
            </dl>
          </button>
        );
      })}
    </div>
  );
}
