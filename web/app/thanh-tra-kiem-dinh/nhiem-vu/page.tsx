'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import AlertBanner from '@/components/AlertBanner';
import InspectionTaskDetails from '@/components/InspectionTaskDetails';
import InspectionTaskList, { type InspectionTaskRecord } from '@/components/InspectionTaskList';
import type {
  InspectionTaskProgressFormValue,
  InspectionTaskUpdateState,
} from '@/components/InspectionTaskProgressForm';
import StatCard from '@/components/StatCard';

type LoadState = 'loading' | 'error' | 'empty' | 'data';
type MockFetchMode = Exclude<LoadState, 'loading'>;

const mockAssignedTasks: InspectionTaskRecord[] = [
  {
    id: 'NV-2026-001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    address: '12 Võ Nguyên Giáp, Phước Mỹ, Sơn Trà, Đà Nẵng',
    inspectionTime: '08:30, 28/03/2026',
    inspectionContent:
      'Kiểm tra điều kiện vệ sinh khu bếp, hồ sơ nguồn gốc nguyên liệu và việc lưu mẫu thức ăn.',
    assignmentStatus: 'accepted',
    progressStatus: 'idle',
    progressNote: '',
  },
  {
    id: 'NV-2026-002',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    address: '45 Nguyễn Văn Linh, Hải Châu 1, Hải Châu, Đà Nẵng',
    inspectionTime: '14:00, 29/03/2026',
    inspectionContent:
      'Đánh giá việc bảo quản thực phẩm tươi sống, nhãn mác sản phẩm và chứng từ pháp lý liên quan.',
    assignmentStatus: 'accepted',
    progressStatus: 'in-progress',
    progressNote: 'Đã kiểm tra khu vực bảo quản lạnh, đang đối chiếu chứng từ nhập hàng.',
  },
  {
    id: 'NV-2026-003',
    businessName: 'Quán Ăn Gia Đình Việt',
    address: '88 Điện Biên Phủ, Chính Gián, Thanh Khê, Đà Nẵng',
    inspectionTime: '09:00, 30/03/2026',
    inspectionContent:
      'Kiểm tra khu vực chế biến, điều kiện nhân sự trực tiếp chế biến và quy trình lưu trữ thực phẩm.',
    assignmentStatus: 'pending',
    progressStatus: 'completed',
    progressNote: 'Đã hoàn thành kiểm tra hồ sơ và khu vực chế biến, chờ tổng hợp biên bản.',
  },
];

function mockFetchAssignedTasks(mode: MockFetchMode) {
  return new Promise<InspectionTaskRecord[]>((resolve, reject) => {
    window.setTimeout(() => {
      if (mode === 'error') {
        reject(new Error('Không thể tải dữ liệu, vui lòng thử lại'));
        return;
      }

      if (mode === 'empty') {
        resolve([]);
        return;
      }

      resolve(mockAssignedTasks);
    }, 900);
  });
}

function mockConfirmAssignment() {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), 700);
  });
}

function mockUpdateTaskProgress(mode: 'success' | 'error') {
  return new Promise<void>((resolve, reject) => {
    window.setTimeout(() => {
      if (mode === 'error') {
        reject(new Error('Không thể cập nhật dữ liệu, vui lòng thử lại'));
        return;
      }

      resolve();
    }, 800);
  });
}

function LoadingPanel() {
  return (
    <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
      <div className="space-y-3">
        {[0, 1, 2].map((item) => (
          <div key={item} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm">
            <div className="h-3 w-20 animate-pulse rounded bg-slate-200" />
            <div className="mt-3 h-4 w-2/3 animate-pulse rounded bg-slate-200" />
            <div className="mt-5 h-3 w-full animate-pulse rounded bg-slate-100" />
            <div className="mt-2 h-3 w-4/5 animate-pulse rounded bg-slate-100" />
          </div>
        ))}
      </div>

      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="h-4 w-24 animate-pulse rounded bg-slate-200" />
        <div className="mt-3 h-6 w-2/3 animate-pulse rounded bg-slate-200" />
        <div className="mt-6 h-20 animate-pulse rounded-xl bg-slate-100" />
        <div className="mt-4 h-20 animate-pulse rounded-xl bg-slate-100" />
        <div className="mt-6 h-11 animate-pulse rounded-lg bg-slate-200" />
      </div>
    </div>
  );
}

export default function NhiemVuKiemTraPage() {
  const searchParams = useSearchParams();
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [tasks, setTasks] = useState<InspectionTaskRecord[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [isConfirming, setIsConfirming] = useState(false);
  const [progressForm, setProgressForm] = useState<InspectionTaskProgressFormValue>({
    status: '',
    note: '',
  });
  const [updateState, setUpdateState] = useState<InspectionTaskUpdateState>('idle');
  const [updateErrorMessage, setUpdateErrorMessage] = useState('');
  const stateParam = searchParams.get('state');
  const updateParam = searchParams.get('update');
  const fetchMode: MockFetchMode =
    stateParam === 'error' || stateParam === 'empty' || stateParam === 'data'
      ? stateParam
      : 'data';
  const updateMode = updateParam === 'error' ? 'error' : 'success';

  useEffect(() => {
    let isMounted = true;

    setLoadState('loading');
    setErrorMessage('');
    setSuccessMessage('');

    mockFetchAssignedTasks(fetchMode)
      .then((nextTasks) => {
        if (!isMounted) {
          return;
        }

        setTasks(nextTasks);
        setUpdateState('idle');
        setUpdateErrorMessage('');

        if (nextTasks.length === 0) {
          setSelectedTaskId(null);
          setLoadState('empty');
          return;
        }

        setSelectedTaskId((current) => {
          if (current && nextTasks.some((task) => task.id === current)) {
            return current;
          }

          return nextTasks[0].id;
        });
        setLoadState('data');
      })
      .catch((error: Error) => {
        if (!isMounted) {
          return;
        }

        setTasks([]);
        setSelectedTaskId(null);
        setErrorMessage(error.message);
        setLoadState('error');
      });

    return () => {
      isMounted = false;
    };
  }, [fetchMode, reloadKey]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;
  const totalTasks = tasks.length;
  const pendingTasks = tasks.filter((task) => task.assignmentStatus === 'pending').length;
  const acceptedTasks = tasks.filter((task) => task.assignmentStatus === 'accepted').length;

  useEffect(() => {
    if (!selectedTask) {
      setProgressForm({ status: '', note: '' });
      setUpdateState('idle');
      setUpdateErrorMessage('');
      return;
    }

    setProgressForm({
      status: selectedTask.progressStatus === 'idle' ? '' : selectedTask.progressStatus,
      note: selectedTask.progressNote,
    });
    setUpdateState('idle');
    setUpdateErrorMessage('');
  }, [selectedTask]);

  const handleRetry = () => {
    setReloadKey((current) => current + 1);
  };

  const handleConfirmTask = async () => {
    if (!selectedTask || selectedTask.assignmentStatus === 'accepted' || isConfirming) {
      return;
    }

    setIsConfirming(true);
    setSuccessMessage('');

    try {
      await mockConfirmAssignment();

      setTasks((current) =>
        current.map((task) =>
          task.id === selectedTask.id ? { ...task, assignmentStatus: 'accepted' } : task
        )
      );
      setSuccessMessage('Đã nhận nhiệm vụ thành công');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleProgressSubmit = async () => {
    if (!selectedTask) {
      return;
    }

    if (!progressForm.status) {
      setUpdateState('error');
      setUpdateErrorMessage('Vui lòng chọn trạng thái');
      return;
    }

    setUpdateState('loading');
    setUpdateErrorMessage('');
    setSuccessMessage('');

    try {
      await mockUpdateTaskProgress(updateMode);

      setTasks((current) =>
        current.map((task) =>
          task.id === selectedTask.id
            ? {
                ...task,
                assignmentStatus:
                  task.assignmentStatus === 'pending' ? 'accepted' : task.assignmentStatus,
                progressStatus: progressForm.status,
                progressNote: progressForm.note.trim(),
              }
            : task
        )
      );
      setUpdateState('success');
      setSuccessMessage('Cập nhật trạng thái thành công');
    } catch (error) {
      setUpdateState('error');
      setUpdateErrorMessage(
        error instanceof Error
          ? error.message
          : 'Không thể cập nhật dữ liệu, vui lòng thử lại'
      );
    }
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">
            Nhiệm vụ kiểm tra
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Theo dõi nhiệm vụ được phân công và xác nhận nhận nhiệm vụ kiểm tra.
          </p>
        </div>

        <button
          type="button"
          onClick={handleRetry}
          className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          Tải lại danh sách
        </button>
      </div>

      {successMessage && <AlertBanner type="success" title={successMessage} />}

      {loadState !== 'loading' && (
        <div className="mb-6 grid gap-4 md:grid-cols-3">
          <StatCard label="Tổng nhiệm vụ" value={totalTasks} color="blue" />
          <StatCard label="Chưa nhận" value={pendingTasks} color="orange" />
          <StatCard label="Đã nhận" value={acceptedTasks} color="green" />
        </div>
      )}

      {loadState === 'loading' && <LoadingPanel />}

      {loadState === 'error' && (
        <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
          <AlertBanner type="danger" title={errorMessage} className="mb-0" />
          <div className="mt-5">
            <button
              type="button"
              onClick={handleRetry}
              className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700"
            >
              Thử lại
            </button>
          </div>
        </div>
      )}

      {loadState === 'empty' && (
        <div className="rounded-xl border border-dashed border-slate-300 bg-white p-10 text-center shadow-sm">
          <p className="text-base font-semibold text-slate-800">
            Không có nhiệm vụ nào được giao
          </p>
          <p className="mt-2 text-sm text-slate-500">
            Danh sách sẽ hiển thị tại đây khi có nhiệm vụ mới được phân công.
          </p>
        </div>
      )}

      {loadState === 'data' && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <section className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-3 border-b border-slate-200 pb-4">
              <div>
                <h2 className="text-sm font-bold text-slate-800">
                  Danh sách nhiệm vụ được giao
                </h2>
                <p className="mt-1 text-xs text-slate-500">
                  Chọn một nhiệm vụ để xem chi tiết và xác nhận nhận việc.
                </p>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
                {totalTasks} nhiệm vụ
              </span>
            </div>

            <InspectionTaskList
              tasks={tasks}
              selectedTaskId={selectedTaskId}
              onSelect={setSelectedTaskId}
            />
          </section>

          <InspectionTaskDetails
            task={selectedTask}
            isConfirming={isConfirming}
            onConfirm={handleConfirmTask}
            progressForm={progressForm}
            updateState={updateState}
            updateErrorMessage={updateErrorMessage}
            onProgressStatusChange={(status) => {
              setProgressForm((current) => ({ ...current, status }));
              if (updateState === 'error') {
                setUpdateErrorMessage('');
                setUpdateState('idle');
              }
            }}
            onProgressNoteChange={(note) => {
              setProgressForm((current) => ({ ...current, note }));
            }}
            onProgressSubmit={handleProgressSubmit}
          />
        </div>
      )}
    </div>
  );
}
