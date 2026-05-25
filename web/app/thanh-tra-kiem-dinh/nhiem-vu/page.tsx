'use client';

import { useEffect, useState } from 'react';
import AlertBanner from '@/components/AlertBanner';
import InspectionTaskDetails from '@/components/InspectionTaskDetails';
import InspectionTaskList, { type InspectionTaskRecord } from '@/components/InspectionTaskList';
import type {
  InspectionTaskProgressFormValue,
  InspectionTaskUpdateState,
} from '@/components/InspectionTaskProgressForm';
import {
  isInspectionTaskStatus,
  normalizeInspectionTaskStatus,
} from '@/components/inspectionTaskStatus';
import { PageHeader, GovBtn, MiniStat } from '@/components/GovUI';
import { nhiemVuApi, type NhiemVuDetailResponse, type NhiemVuListItemResponse, type NhiemVuStatsResponse } from '@/api/api';
import { RefreshCw } from 'lucide-react';

type LoadState = 'loading' | 'error' | 'empty' | 'data';

function formatInspectionTime(value?: string) {
  if (!value) {
    return 'Chưa có lịch kiểm tra';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('vi-VN', {
    hour: '2-digit',
    minute: '2-digit',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(date).replace(',', '');
}

function toTaskRecord(detail: NhiemVuDetailResponse): InspectionTaskRecord {
  return {
    id: detail.maThanhTra,
    businessName: detail.tenCoSo,
    address: detail.diaChiCoSo || 'Chưa có địa chỉ',
    inspectionTime: formatInspectionTime(detail.thoiGianTT),
    inspectionContent: detail.noiDung || 'Chưa có nội dung kiểm tra',
    trangThai: normalizeInspectionTaskStatus(detail.trangThai),
    ghiChu: detail.ghiChu || '',
  };
}

function normalizeError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
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
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [tasks, setTasks] = useState<InspectionTaskRecord[]>([]);
  const [stats, setStats] = useState<NhiemVuStatsResponse>({ tongSo: 0, chuaNhan: 0, daNhan: 0 });
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

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setLoadState('loading');
      setErrorMessage('');
      setSuccessMessage('');

      try {
        const [statsData, pageData] = await Promise.all([
          nhiemVuApi.getStats(),
          nhiemVuApi.search('', '', 0, 100),
        ]);

        const detailTasks = await Promise.all(
          pageData.content.map(async (item: NhiemVuListItemResponse) => {
            try {
              const detail = await nhiemVuApi.getById(item.maThanhTra);
              return toTaskRecord(detail);
            } catch {
              return {
                id: item.maThanhTra,
                businessName: item.tenCoSo,
                address: 'Chưa có địa chỉ',
                inspectionTime: formatInspectionTime(item.thoiGianTT),
                inspectionContent: 'Chưa có nội dung kiểm tra',
                trangThai: normalizeInspectionTaskStatus(item.trangThai),
                ghiChu: item.ghiChu || '',
              } satisfies InspectionTaskRecord;
            }
          })
        );

        if (!isMounted) {
          return;
        }

        setStats(statsData);
        setTasks(detailTasks);
        setUpdateState('idle');
        setUpdateErrorMessage('');

        if (detailTasks.length === 0) {
          setSelectedTaskId(null);
          setLoadState('empty');
          return;
        }

        setSelectedTaskId((current) => {
          if (current && detailTasks.some((task) => task.id === current)) {
            return current;
          }

          return (
            detailTasks.find((task) => isInspectionTaskStatus(task.trangThai, 'pending'))?.id ??
            detailTasks[0].id
          );
        });
        setLoadState('data');
      } catch (error) {
        if (!isMounted) {
          return;
        }

        setTasks([]);
        setSelectedTaskId(null);
        setErrorMessage(normalizeError(error, 'Không thể tải dữ liệu, vui lòng thử lại'));
        setLoadState('error');
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, [reloadKey]);

  const selectedTask = tasks.find((task) => task.id === selectedTaskId) ?? null;

  useEffect(() => {
    if (!selectedTask) {
      setProgressForm({ status: '', note: '' });
      setUpdateState('idle');
      setUpdateErrorMessage('');
      return;
    }

    setProgressForm({
      status: isInspectionTaskStatus(selectedTask.trangThai, 'pending') ? '' : selectedTask.trangThai,
      note: selectedTask.ghiChu,
    });
    setUpdateState('idle');
    setUpdateErrorMessage('');
  }, [selectedTask]);

  const handleRetry = () => {
    setReloadKey((current) => current + 1);
  };

  const handleConfirmTask = async () => {
    if (!selectedTask || !isInspectionTaskStatus(selectedTask.trangThai, 'pending') || isConfirming || isRejecting) {
      return;
    }

    setIsConfirming(true);
    setSuccessMessage('');

    try {
      await nhiemVuApi.accept(selectedTask.id);
      setSuccessMessage('Đã nhận nhiệm vụ thành công');
      handleRetry();
    } catch (error) {
      setErrorMessage(normalizeError(error, 'Không thể nhận nhiệm vụ'));
    } finally {
      setIsConfirming(false);
    }
  };

  const handleRejectTask = async () => {
    if (!selectedTask || !isInspectionTaskStatus(selectedTask.trangThai, 'pending') || isRejecting || isConfirming) {
      return;
    }

    setRejectReason('');
    setIsRejectModalOpen(true);
  };

  const confirmReject = async () => {
    if (!selectedTask || !rejectReason.trim()) {
      return;
    }

    setIsRejecting(true);
    setSuccessMessage('');

    try {
      await nhiemVuApi.reject(selectedTask.id, { lyDoTuChoi: rejectReason.trim() });
      setSuccessMessage('Đã từ chối nhiệm vụ thành công');
      setIsRejectModalOpen(false);
      setRejectReason('');
      handleRetry();
    } catch (error) {
      setErrorMessage(normalizeError(error, 'Không thể từ chối nhiệm vụ'));
    } finally {
      setIsRejecting(false);
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
      await nhiemVuApi.updateProgress(selectedTask.id, {
        trangThai: progressForm.status,
        ghiChu: progressForm.note.trim(),
      });
      setUpdateState('success');
      setSuccessMessage('Cập nhật trạng thái thành công');
      handleRetry();
    } catch (error) {
      setUpdateState('error');
      setUpdateErrorMessage(
        normalizeError(error, 'Không thể cập nhật dữ liệu, vui lòng thử lại')
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
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3,1fr)',
            gap: '10px',
            marginBottom: '12px',
          }}
        >
          <MiniStat label="Tổng nhiệm vụ" value={stats.tongSo} color="blue" />
          <MiniStat label="Chưa nhận" value={stats.chuaNhan} color="orange" />
          <MiniStat label="Đã nhận" value={stats.daNhan} color="green" />
        </div>
      )}

      {loadState === 'loading' && <LoadingPanel />}

      {loadState === 'error' && (
        <div
          style={{
            background: '#fff',
            border: '1px solid #D6D6D6',
            borderRadius: '2px',
            padding: '16px',
          }}
        >
          <AlertBanner type="danger" title={errorMessage} className="mb-0" />
          <div style={{ marginTop: '12px' }}>
            <GovBtn variant="primary" onClick={handleRetry}>
              Thử lại
            </GovBtn>
          </div>
        </div>
      )}

      {loadState === 'empty' && (
        <div
          style={{
            background: '#fff',
            border: '1px dashed #D6D6D6',
            borderRadius: '2px',
            padding: '40px',
            textAlign: 'center',
          }}
        >
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>
            Không có nhiệm vụ nào được giao
          </p>
          <p style={{ fontSize: '12px', color: '#888', marginTop: '6px' }}>
            Danh sách sẽ hiển thị tại đây khi có nhiệm vụ mới được phân công.
          </p>
        </div>
      )}

      {loadState === 'data' && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
          <section
            style={{
              background: '#fff',
              border: '1px solid #D6D6D6',
              borderRadius: '2px',
              overflow: 'hidden',
            }}
          >
            <div
              style={{
                background: '#EAF7EA',
                borderBottom: '2px solid #008000',
                padding: '7px 12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '8px',
              }}
            >
              <div>
                <h2
                  style={{
                    fontSize: '12.5px',
                    fontWeight: 700,
                    color: '#006400',
                    textTransform: 'uppercase',
                    letterSpacing: '0.04em',
                    margin: 0,
                  }}
                >
                  Danh sách nhiệm vụ được giao
                </h2>
                <p style={{ fontSize: '11px', color: '#555', marginTop: '2px' }}>
                  Chọn một nhiệm vụ để xem chi tiết và xác nhận nhận việc.
                </p>
              </div>
              <span
                style={{
                  background: '#fff',
                  border: '1px solid #C8E6C9',
                  borderRadius: '2px',
                  padding: '1px 8px',
                  fontSize: '11px',
                  fontWeight: 600,
                  color: '#006400',
                }}
              >
                {tasks.length} nhiệm vụ
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

      {isRejectModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="mx-4 w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-xl">
            <div className="flex items-center justify-between border-b px-6 py-5">
              <h3 className="text-lg font-semibold">Từ chối nhiệm vụ</h3>
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="text-3xl text-slate-400 hover:text-slate-600"
              >
                ×
              </button>
            </div>

            <div className="space-y-4 p-6">
              <p className="text-sm text-slate-500">
                Cơ sở:{' '}
                <span className="font-semibold text-slate-800">{selectedTask.businessName}</span>
              </p>
              <div>
                <label className="mb-2 block text-sm font-medium text-slate-700">
                  Lý do từ chối <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Nhập lý do từ chối..."
                  className="h-28 w-full rounded-xl border border-slate-200 px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 border-t bg-slate-50 px-6 py-4">
              <button
                onClick={() => setIsRejectModalOpen(false)}
                className="rounded-xl px-5 py-2.5 font-medium text-slate-600 hover:bg-slate-100"
              >
                Hủy
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim() || isRejecting}
                className="rounded-xl bg-red-600 px-6 py-2.5 font-semibold text-white hover:bg-red-700 disabled:opacity-50"
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
