export type NhiemVuStatus = 'Chưa nhận' | 'Đã nhận' | 'Đang thực hiện' | 'Hoàn thành';

export type InspectionTaskStatusKey = 'pending' | 'received' | 'processing' | 'completed';

type InspectionTaskBadgeVariant = 'active' | 'pending' | 'open';

const STATUS_ORDER: InspectionTaskStatusKey[] = ['pending', 'received', 'processing', 'completed'];

const STATUS_BY_KEY: Record<InspectionTaskStatusKey, NhiemVuStatus> = {
  pending: 'Chưa nhận',
  received: 'Đã nhận',
  processing: 'Đang thực hiện',
  completed: 'Hoàn thành',
};

const STATUS_BADGE_BY_KEY: Record<
  InspectionTaskStatusKey,
  { variant: InspectionTaskBadgeVariant; label: string }
> = {
  pending: { variant: 'pending', label: 'Chưa nhận' },
  received: { variant: 'open', label: 'Đã nhận' },
  processing: { variant: 'pending', label: 'Đang thực hiện' },
  completed: { variant: 'active', label: 'Hoàn thành' },
};

function normalizeStatusText(status: string) {
  return status
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[^a-z\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export function getInspectionTaskStatusKey(status: string): InspectionTaskStatusKey {
  const normalized = normalizeStatusText(status);

  if (normalized.startsWith('hoan thanh') || status.startsWith('Ho')) {
    return 'completed';
  }

  if (normalized.startsWith('chua nhan') || status.startsWith('Ch')) {
    return 'pending';
  }

  if (
    normalized.includes('dang thuc hien') ||
    status.includes('thực hiện') ||
    status.includes('thá') ||
    status.includes('thÃ') ||
    status.includes('hiệ') ||
    status.includes('hiá')
  ) {
    return 'processing';
  }

  if (normalized.startsWith('da nhan') || status.startsWith('Đ') || status.startsWith('Ä')) {
    return 'received';
  }

  return 'received';
}

export function normalizeInspectionTaskStatus(status: string): NhiemVuStatus {
  return STATUS_BY_KEY[getInspectionTaskStatusKey(status)];
}

export function getInspectionTaskStatusBadge(status: string) {
  return STATUS_BADGE_BY_KEY[getInspectionTaskStatusKey(status)];
}

export function getInspectionTaskStatusLabel(status: string) {
  return STATUS_BY_KEY[getInspectionTaskStatusKey(status)];
}

export function getAvailableInspectionTaskStatuses(currentStatus: string): NhiemVuStatus[] {
  const currentKey = getInspectionTaskStatusKey(currentStatus);
  const currentIndex = STATUS_ORDER.indexOf(currentKey);

  return STATUS_ORDER.slice(currentIndex).map((statusKey) => STATUS_BY_KEY[statusKey]);
}

export function isInspectionTaskStatus(status: string, expected: InspectionTaskStatusKey) {
  return getInspectionTaskStatusKey(status) === expected;
}
