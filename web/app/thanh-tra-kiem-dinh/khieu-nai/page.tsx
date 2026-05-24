'use client';

import { useEffect, useMemo, useState } from 'react';
import AlertBanner from '@/components/AlertBanner';
import ComplaintDetail from '@/components/ComplaintDetail';
import ComplaintForm from '@/components/ComplaintForm';
import ComplaintList from '@/components/ComplaintList';
import { khieuNaiApi, type KhieuNaiDetailResponse, type KhieuNaiSummaryResponse } from '@/api/api';
import type { ComplaintRecord, ComplaintStatus } from '@/data/mockData';

type ScreenState = 'loading' | 'empty' | 'error' | 'data';

interface ComplaintFormState {
  handlingResult: string;
  status: ComplaintStatus;
}

const DEFAULT_FORM_STATE: ComplaintFormState = {
  handlingResult: '',
  status: 'processing',
};

function formatSubmittedAt(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('vi-VN').format(date);
}

function mapSummaryToComplaint(summary: KhieuNaiSummaryResponse): ComplaintRecord {
  return {
    id: summary.id,
    title: summary.title,
    submitter: summary.submitter,
    submittedAt: formatSubmittedAt(summary.submittedAt),
    status: summary.status,
    content: '',
    submitterInfo: {
      fullName: summary.submitter,
      phone: summary.submitterPhone || '',
      email: '',
      address: '',
    },
    evidence: [],
    handlingResult: '',
    inspectionSummary: '',
  };
}

function mapDetailToComplaint(detail: KhieuNaiDetailResponse): ComplaintRecord {
  return {
    id: detail.id,
    title: detail.title,
    submitter: detail.submitterInfo.fullName,
    submittedAt: formatSubmittedAt(detail.submittedAt),
    status: detail.status,
    content: detail.content,
    submitterInfo: {
      fullName: detail.submitterInfo.fullName || '',
      phone: detail.submitterInfo.phone || '',
      email: detail.submitterInfo.email || '',
      address: detail.submitterInfo.address || '',
    },
    evidence: detail.evidence.map((item) => ({
      id: item.id,
      label: item.label,
      kind: item.kind,
      note: item.note,
    })),
    handlingResult: detail.handlingResult || '',
    inspectionSummary: detail.inspectionSummary || '',
  };
}

function normalizeError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

export default function KhieuNaiPage() {
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [complaints, setComplaints] = useState<ComplaintRecord[]>([]);
  const [selectedComplaintId, setSelectedComplaintId] = useState('');
  const [inspectionCompleted, setInspectionCompleted] = useState(false);
  const [formState, setFormState] = useState<ComplaintFormState>(DEFAULT_FORM_STATE);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const selectedComplaint = useMemo(
    () => complaints.find((complaint) => complaint.id === selectedComplaintId) ?? null,
    [complaints, selectedComplaintId]
  );

  const applyComplaintDetail = (detail: KhieuNaiDetailResponse) => {
    const mapped = mapDetailToComplaint(detail);

    setComplaints((current) =>
      current.map((item) => (item.id === detail.id ? mapped : item))
    );
    setInspectionCompleted(detail.inspectionCompleted);
    setFormState({
      handlingResult: detail.handlingResult ?? '',
      status: detail.status === 'pending' ? 'processing' : detail.status,
    });
  };

  const loadComplaintDetail = async (id: string) => {
    const detail = await khieuNaiApi.getById(id);
    applyComplaintDetail(detail);
  };

  useEffect(() => {
    let isMounted = true;

    const loadData = async () => {
      setScreenState('loading');
      setErrorMessage('');

      try {
        const pageData = await khieuNaiApi.search('', '', 0, 100);
        if (!isMounted) {
          return;
        }

        if (pageData.content.length === 0) {
          setComplaints([]);
          setSelectedComplaintId('');
          setScreenState('empty');
          return;
        }

        const mapped = pageData.content.map(mapSummaryToComplaint);
        setComplaints(mapped);
        setSelectedComplaintId(mapped[0].id);
        setScreenState('data');
      } catch (error) {
        if (isMounted) {
          setErrorMessage(normalizeError(error, 'Không thể tải danh sách khiếu nại'));
          setScreenState('error');
        }
      }
    };

    void loadData();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (!selectedComplaintId || screenState !== 'data') {
      return;
    }

    let isMounted = true;

    const fetchDetail = async () => {
      try {
        const detail = await khieuNaiApi.getById(selectedComplaintId);
        if (isMounted) {
          applyComplaintDetail(detail);
        }
      } catch (error) {
        if (isMounted) {
          setErrorMessage(normalizeError(error, 'Không thể tải chi tiết khiếu nại'));
        }
      }
    };

    void fetchDetail();

    return () => {
      isMounted = false;
    };
  }, [screenState, selectedComplaintId]);

  const validationMessage =
    selectedComplaint && formState.handlingResult.trim() === ''
      ? 'Vui lòng nhập đầy đủ nội dung xử lý'
      : '';

  const isNotFound =
    screenState === 'data' && Boolean(selectedComplaintId) && selectedComplaint === null;

  const handleSelectComplaint = (complaint: ComplaintRecord) => {
    setSelectedComplaintId(complaint.id);
    setSuccessMessage('');
  };

  const handleResetSelection = () => {
    if (complaints.length > 0) {
      handleSelectComplaint(complaints[0]);
    }
  };

  const handleRunInspection = async () => {
    if (!selectedComplaint) {
      return;
    }

    try {
      await khieuNaiApi.updateInspection(selectedComplaint.id, {
        tomTatKiemTra:
          selectedComplaint.inspectionSummary?.trim() ||
          'Đã kiểm tra hiện trường, đối chiếu minh chứng và ghi nhận cơ sở cần khắc phục theo nội dung phản ánh.',
      });
      await loadComplaintDetail(selectedComplaint.id);
      setSuccessMessage('Cập nhật kiểm tra thực địa thành công');
    } catch (error) {
      setErrorMessage(normalizeError(error, 'Không thể cập nhật kiểm tra thực địa'));
    }
  };

  const handleSubmit = async () => {
    if (!selectedComplaint || validationMessage) {
      return;
    }

    try {
      await khieuNaiApi.updateHandling(selectedComplaint.id, {
        ketQuaXuLy: formState.handlingResult.trim(),
        trangThai: formState.status,
      });
      await loadComplaintDetail(selectedComplaint.id);
      setSuccessMessage('Cập nhật kết quả xử lý thành công');
    } catch (error) {
      setErrorMessage(normalizeError(error, 'Không thể cập nhật kết quả xử lý'));
    }
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
      </div>

      {successMessage && <AlertBanner type="success" title={successMessage} />}
      {errorMessage && screenState !== 'error' && <AlertBanner type="danger" title={errorMessage} />}

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
          title={errorMessage || 'Không thể tải danh sách khiếu nại'}
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
              onRunInspection={() => void handleRunInspection()}
              onResetSelection={handleResetSelection}
            />
            <ComplaintForm
              formState={formState}
              onChange={setFormState}
              onSubmit={() => void handleSubmit()}
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
