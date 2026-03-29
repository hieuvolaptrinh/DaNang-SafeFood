'use client';

import { useEffect, useMemo, useState } from 'react';
import AlertBanner from '@/components/AlertBanner';
import ComplaintDetail from '@/components/ComplaintDetail';
import ComplaintForm from '@/components/ComplaintForm';
import ComplaintList from '@/components/ComplaintList';
import {
  mockComplaints,
  type ComplaintRecord,
  type ComplaintStatus,
} from '@/data/mockData';

type ScreenState = 'loading' | 'empty' | 'error' | 'data';

interface ComplaintFormState {
  handlingResult: string;
  status: ComplaintStatus;
}

const DEFAULT_FORM_STATE: ComplaintFormState = {
  handlingResult: '',
  status: 'processing',
};

export default function KhieuNaiPage() {
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [inspectionCompleted, setInspectionCompleted] = useState(false);
  const [formState, setFormState] = useState<ComplaintFormState>(DEFAULT_FORM_STATE);
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const timer = window.setTimeout(() => {
      if (mockComplaints.length === 0) {
        setComplaints([]);
        setScreenState('empty');
        return;
      }

      setComplaints(mockComplaints);
      setSelectedComplaintId(mockComplaints[0].id);
      setFormState({
        handlingResult: mockComplaints[0].handlingResult ?? '',
        status: mockComplaints[0].status === 'pending' ? 'processing' : mockComplaints[0].status,
      });
      setInspectionCompleted(Boolean(mockComplaints[0].inspectionSummary));
      setScreenState('data');
    }, 700);

    return () => window.clearTimeout(timer);
  }, []);

  const selectedComplaint = useMemo(
    () => complaints.find((complaint) => complaint.id === selectedComplaintId) ?? null,
    [complaints, selectedComplaintId]
  );

  const validationMessage =
    selectedComplaint && formState.handlingResult.trim() === ''
      ? 'Vui lòng nhập đầy đủ nội dung xử lý'
      : '';

  const isNotFound =
    screenState === 'data' && Boolean(selectedComplaintId) && selectedComplaint === null;

  const handleSelectComplaint = (complaint: ComplaintRecord) => {
    setSelectedComplaintId(complaint.id);
    setSuccessMessage('');
    setInspectionCompleted(Boolean(complaint.inspectionSummary));
    setFormState({
      handlingResult: complaint.handlingResult ?? '',
      status: complaint.status === 'pending' ? 'processing' : complaint.status,
    });
  };

  const handleSimulateNotFound = () => {
    setSelectedComplaintId('KN-404');
    setSuccessMessage('');
    setInspectionCompleted(false);
    setFormState(DEFAULT_FORM_STATE);
  };

  const handleResetSelection = () => {
    if (complaints.length > 0) {
      handleSelectComplaint(complaints[0]);
    }
  };

  const handleRunInspection = () => {
    if (!selectedComplaint) {
      return;
    }

    setInspectionCompleted(true);
    setComplaints((current) =>
      current.map((complaint) =>
        complaint.id === selectedComplaint.id
          ? {
              ...complaint,
              inspectionSummary:
                complaint.inspectionSummary ??
                'Đã kiểm tra hiện trường, đối chiếu minh chứng và ghi nhận cơ sở cần khắc phục theo nội dung phản ánh.',
            }
          : complaint
      )
    );
  };

  const handleSubmit = () => {
    if (!selectedComplaint || validationMessage) {
      return;
    }

    const nextInspectionSummary =
      selectedComplaint.inspectionSummary ??
      'Đã kiểm tra hiện trường, đối chiếu minh chứng và ghi nhận cơ sở cần khắc phục theo nội dung phản ánh.';

    setComplaints((current) =>
      current.map((complaint) =>
        complaint.id === selectedComplaint.id
          ? {
              ...complaint,
              status: formState.status,
              handlingResult: formState.handlingResult.trim(),
              inspectionSummary: inspectionCompleted ? nextInspectionSummary : complaint.inspectionSummary,
            }
          : complaint
      )
    );
    setInspectionCompleted(true);
    setSuccessMessage('Cập nhật kết quả xử lý thành công');
  };

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">Khiếu nại</h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Theo dõi danh sách khiếu nại, xem chi tiết và cập nhật kết quả xử lý.
          </p>
        </div>

        <button
          type="button"
          onClick={handleSimulateNotFound}
          className="rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600 transition-colors hover:bg-slate-50"
        >
          Mô phỏng lỗi không tìm thấy
        </button>
      </div>

      {successMessage && <AlertBanner type="success" title={successMessage} />}

      {screenState === 'loading' && (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center text-sm text-slate-500 shadow-sm">
          Đang tải danh sách khiếu nại...
        </div>
      )}

      {screenState === 'empty' && (
        <div className="rounded-xl border border-slate-200 bg-white px-5 py-10 text-center shadow-sm">
          <p className="text-sm font-semibold text-slate-700">Chưa có khiếu nại nào</p>
          <p className="mt-1 text-sm text-slate-500">
            Danh sách khiếu nại sẽ hiển thị tại đây khi có dữ liệu mới.
          </p>
        </div>
      )}

      {screenState === 'error' && (
        <AlertBanner
          type="danger"
          title="Không thể tải danh sách khiếu nại"
          message="Vui lòng thử lại sau."
        />
      )}

      {screenState === 'data' && (
        <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)]">
          <ComplaintList
            complaints={complaints}
            selectedComplaintId={selectedComplaintId}
            onSelect={handleSelectComplaint}
          />

          <div className="space-y-6">
            <ComplaintDetail
              complaint={selectedComplaint}
              notFound={isNotFound}
              inspectionCompleted={inspectionCompleted}
              onRunInspection={handleRunInspection}
              onResetSelection={handleResetSelection}
            />
            <ComplaintForm
              formState={formState}
              onChange={setFormState}
              onSubmit={handleSubmit}
              isDisabled={!selectedComplaint || validationMessage !== ''}
              validationMessage={validationMessage}
              hasComplaintSelected={Boolean(selectedComplaint)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
