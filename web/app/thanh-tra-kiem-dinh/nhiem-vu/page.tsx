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
import { PageHeader, GovBtn, MiniStat } from '@/components/GovUI';
import { RefreshCw } from 'lucide-react';

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
    trangThai: 'Đã nhận',
    ghiChu: 'Đã kiểm tra phần bếp, cần tiếp tục kiểm tra kho lạnh.',
  },
  {
    id: 'NV-2026-002',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    address: '45 Nguyễn Văn Linh, Hải Châu 1, Hải Châu, Đà Nẵng',
    inspectionTime: '14:00, 29/03/2026',
    inspectionContent:
      'Đánh giá việc bảo quản thực phẩm tươi sống, nhãn mác sản phẩm và chứng từ pháp lý liên quan.',
    trangThai: 'Đang thực hiện',
    ghiChu: 'Đã kiểm tra khu vực bảo quản lạnh, đang đối chiếu chứng từ nhập hàng.',
  },
  {
    id: 'NV-2026-003',
    businessName: 'Quán Ăn Gia Đình Việt',
    address: '88 Điện Biên Phủ, Chính Gián, Thanh Khê, Đà Nẵng',
    inspectionTime: '09:00, 30/03/2026',
    inspectionContent:
      'Kiểm tra khu vực chế biến, điều kiện nhân sự trực tiếp chế biến và quy trình lưu trữ thực phẩm.',
    trangThai: 'Chưa nhận',
    ghiChu: '',
    lyDoTuChoi: '',
  },
  {
    id: 'NV-2026-004',
    businessName: 'Café Sáng Ngời',
    address: '56 Lê Lợi, Hải Châu 2, Hải Châu, Đà Nẵng',
    inspectionTime: '15:30, 31/03/2026',
    inspectionContent:
      'Kiểm tra điều kiện cơ sở vật chất, vệ sinh nhân viên và quy trình pha chế.',
    trangThai: 'Hoàn thành',
    ghiChu: 'Hoàn thành kiểm tra, cơ sở đạt chuẩn.',
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

function mockAcceptTask() {
  return new Promise<void>((resolve) => {
    window.setTimeout(() => resolve(), 700);
  });
}

function mockRejectTask() {
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
  const [isRejecting, setIsRejecting] = useState(false);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
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

          return nextTasks.find((task) => task.trangThai === 'ChÆ°a nháº­n')?.id ?? nextTasks[0].id;
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
  const pendingTasks = tasks.filter((task) => task.trangThai === 'Chưa nhận').length;
  const acceptedTasks = tasks.filter((task) => task.trangThai !== 'Chưa nhận').length;

  useEffect(() => {
    if (!selectedTask) {
      setProgressForm({ status: '', note: '' });
      setUpdateState('idle');
      setUpdateErrorMessage('');
      return;
    }

    setProgressForm({
      status: selectedTask.trangThai === 'Chưa nhận' ? '' : selectedTask.trangThai,
      note: selectedTask.ghiChu,
    });
    setUpdateState('idle');
    setUpdateErrorMessage('');
  }, [selectedTask]);

  const handleRetry = () => {
    setReloadKey((current) => current + 1);
  };

  const handleConfirmTask = async () => {
    if (!selectedTask || selectedTask.trangThai !== 'Chưa nhận' || isConfirming || isRejecting) {
      return;
    }

    setIsConfirming(true);
    setSuccessMessage('');

    try {
      await mockAcceptTask();

      setTasks((current) =>
        current.map((task) =>
          task.id === selectedTask.id ? { ...task, trangThai: 'Đã nhận' } : task
        )
      );
      setSuccessMessage('Đã nhận nhiệm vụ thành công');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRejectTask = async () => {
    if (!selectedTask || selectedTask.trangThai !== 'Chưa nhận' || isRejecting || isConfirming) {
      return;
    }
    // Open modal to collect rejection reason
    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedTask) return;
    if (!rejectReason.trim()) return;

    setIsRejecting(true);
    setSuccessMessage('');

    try {
      await mockRejectTask();

      // For now remove from list (mock). In real flow we'll persist lyDoTuChoi to API.
      setTasks((current) => current.filter((task) => task.id !== selectedTask.id));
      setSelectedTaskId(null);
      setSuccessMessage('Đã từ chối nhiệm vụ thành công');
    } finally {
      setIsRejecting(false);
      setIsRejectModalOpen(false);
      setRejectReason('');
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
                trangThai: progressForm.status,
                ghiChu: progressForm.note.trim(),
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
      <PageHeader
        title="Nhiệm vụ kiểm tra"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Theo dõi và xác nhận nhiệm vụ kiểm tra được phân công"
        actions={
          <GovBtn variant="secondary" onClick={handleRetry}>
            <RefreshCw style={{ width: 12, height: 12 }} /> Tải lại
          </GovBtn>
        }
      />

      {successMessage && <AlertBanner type="success" title={successMessage} />}

      {loadState !== 'loading' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '12px' }}>
          <MiniStat label="Tổng nhiệm vụ" value={totalTasks} color="blue" />
          <MiniStat label="Chưa nhận" value={pendingTasks} color="orange" />
          <MiniStat label="Đã nhận" value={acceptedTasks} color="green" />
        </div>
      )}

      {loadState === 'loading' && <LoadingPanel />}

      {loadState === 'error' && (
        <div style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '16px' }}>
          <AlertBanner type="danger" title={errorMessage} className="mb-0" />
          <div style={{ marginTop: '12px' }}>
            <GovBtn variant="primary" onClick={handleRetry}>Thử lại</GovBtn>
          </div>
        </div>
      )}

      {loadState === 'empty' && (
        <div style={{ background: '#fff', border: '1px dashed #D6D6D6', borderRadius: '2px', padding: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>Không có nhiệm vụ nào được giao</p>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>Danh sách sẽ hiển thị tại đây khi có nhiệm vụ mới được phân công.</p>
        </div>
      )}

      {loadState === 'data' && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <section style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '2px', overflow: 'hidden' }}>
            <div style={{ background: '#EAF7EA', borderBottom: '2px solid #008000', padding: '7px 12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '8px' }}>
              <div>
                <h2 style={{ fontSize: '12.5px', fontWeight: 700, color: '#006400', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>
                  Danh sách nhiệm vụ được giao
                </h2>
                <p style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                  Chọn một nhiệm vụ để xem chi tiết và xác nhận nhận việc.
                </p>
              </div>
              <span style={{ background: '#fff', border: '1px solid #C8E6C9', borderRadius: '2px', padding: '1px 8px', fontSize: '11px', fontWeight: 600, color: '#006400' }}>
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
            isRejecting={isRejecting}
            onConfirm={handleConfirmTask}
            onReject={handleRejectTask}
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

      {/* Reject modal */}
      {isRejectModalOpen && selectedTask && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">Từ chối nhiệm vụ</h3>
              <button onClick={() => setIsRejectModalOpen(false)} className="text-3xl text-slate-400 hover:text-slate-600">×</button>
            </div>

            <div className="p-6 space-y-4">
              <p className="text-sm text-slate-500">Cơ sở: <span className="font-semibold text-slate-800">{selectedTask.businessName}</span></p>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Lý do từ chối <span className="text-red-500">*</span></label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối..."
                  className="w-full h-28 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t bg-slate-50 flex gap-3 justify-end">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim() || isRejecting}
                className="px-6 py-2.5 font-semibold rounded-xl bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
              >
                {isRejecting ? 'Đang từ chối...' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
