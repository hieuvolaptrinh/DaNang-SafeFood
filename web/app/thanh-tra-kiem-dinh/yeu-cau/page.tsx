'use client';

import { useEffect, useMemo, useState } from 'react';
import { Plus, Eye, RefreshCw, FileSpreadsheet, Printer, Upload } from 'lucide-react';
import { useRole } from '@/lib/RoleContext';
import AlertBanner from '@/components/AlertBanner';
import {
  PageHeader,
  FilterBar,
  FilterField,
  GovInput,
  GovSelect,
  GovBtn,
  SectionCard,
  GovPagination,
  StatusBadge,
  MiniStat,
  ActionButtons,
  FormLayout,
  FormSection,
  FormField,
} from '@/components/GovUI';
import DataTable, { type Column } from '@/components/DataTable';
import CreateInspectionRequestForm, {
  type CreateInspectionRequestPayload,
  type FoodInspectionRequestRecord,
  type InspectionSampleOption,
  type InspectionTesterOption,
} from '@/components/CreateInspectionRequestForm';
import {
  yeuCauKiemNghiemApi,
  type YeuCauKiemNghiemResponse,
  type YeuCauKiemNghiemStatsResponse,
} from '@/api/api';

type PageMode = 'list' | 'create';

export interface TestRequest extends FoodInspectionRequestRecord {
  result?: string;
  reason?: string;
  stampedFile?: string;
  sampleId?: string;
  criteria?: string[];
  requestContent?: string;
}

const STATUS_VARIANT: Record<string, string> = {
  pending: 'pending',
  processing: 'in-progress',
  completed: 'resolved',
};

const STATUS_LABEL: Record<string, string> = {
  pending: 'Chờ xử lý',
  processing: 'Đang thực hiện',
  completed: 'Hoàn thành',
};

const EMPTY_STATS: YeuCauKiemNghiemStatsResponse = {
  tongYeuCau: 0,
  choDuyet: 0,
  dangXuLy: 0,
  hoanThanh: 0,
};

function formatDate(value?: string | null) {
  if (!value) {
    return 'Chưa có';
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat('vi-VN').format(date);
}

function toIsoDate(date: Date) {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000).toISOString().slice(0, 10);
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function mapRequest(item: YeuCauKiemNghiemResponse): TestRequest {
  return {
    id: item.maYeuCau,
    business: item.tenCoSo || 'Chưa rõ',
    sampleType: item.loaiMau || 'Chưa rõ',
    requestDate: formatDate(item.ngayYeuCau),
    deadline: formatDate(item.hanHoanThanh),
    status: item.trangThai,
    lab: item.phongLab || 'Chưa rõ',
    result: item.ketQuaKiemNghiem || undefined,
    reason: item.lyDoKhongDat || undefined,
    sampleId: item.maMauLienQuan || undefined,
    criteria: item.chiTieuKiemDinh ? item.chiTieuKiemDinh.split(',').map((value) => value.trim()).filter(Boolean) : [],
    requestContent: item.noidungYeuCau || undefined,
  };
}

function normalizeError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function mapSampleOptions(
  items: Awaited<ReturnType<typeof yeuCauKiemNghiemApi.getMauOptions>>
): InspectionSampleOption[] {
  return items.map((item) => ({
    id: item.maMau,
    facilityId: item.maCoSo,
    sampleCode: item.maMau,
    sampleName: item.tenMau,
    sampleType: item.loaiMau,
    collectedDate: formatDate(item.ngayThu),
    business: item.tenCoSo || 'Chưa rõ',
  }));
}

function mapTesterOptions(
  items: Awaited<ReturnType<typeof yeuCauKiemNghiemApi.getKiemNghiemVienOptions>>
): InspectionTesterOption[] {
  return items.map((item) => ({
    id: item.maNguoiDung,
    name: item.hoTen,
  }));
}

export default function YeuCauPage() {
  const { role } = useRole();
  const [mode, setMode] = useState<PageMode>('list');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [data, setData] = useState<TestRequest[]>([]);
  const [stats, setStats] = useState<YeuCauKiemNghiemStatsResponse>(EMPTY_STATS);
  const [sampleOptions, setSampleOptions] = useState<InspectionSampleOption[]>([]);
  const [testerOptions, setTesterOptions] = useState<InspectionTesterOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null);
  const [modalStatus, setModalStatus] = useState<TestRequest['status']>('pending');
  const [resultStatus, setResultStatus] = useState<'Đạt' | 'Không đạt'>('Đạt');
  const [reason, setReason] = useState('');
  const [stampedFileName, setStampedFileName] = useState('');

  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState<TestRequest | null>(null);

  const canCreateRequest = role === 'INSPECTOR';
  const canManageResult = role === 'TESTER';

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [statsData, pageData, mauOptions, kiemNghiemVienOptions] = await Promise.all([
        yeuCauKiemNghiemApi.getStats(),
        yeuCauKiemNghiemApi.searchYeuCau('', '', 0, 100),
        yeuCauKiemNghiemApi.getMauOptions(),
        yeuCauKiemNghiemApi.getKiemNghiemVienOptions(),
      ]);
      setStats(statsData);
      setData(pageData.content.map(mapRequest));
      setSampleOptions(mapSampleOptions(mauOptions));
      setTesterOptions(mapTesterOptions(kiemNghiemVienOptions));
    } catch (error) {
      setErrorMessage(normalizeError(error, 'Không thể tải danh sách yêu cầu kiểm nghiệm'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const openDetail = async (request: TestRequest) => {
    try {
      const detail = await yeuCauKiemNghiemApi.getById(request.id);
      setDetailRequest(mapRequest(detail));
      setIsDetailOpen(true);
    } catch (error) {
      setErrorMessage(normalizeError(error, 'Không thể tải chi tiết yêu cầu kiểm nghiệm'));
    }
  };

  const closeDetail = () => {
    setIsDetailOpen(false);
    setDetailRequest(null);
  };

  const openResultModal = (request: TestRequest) => {
    setSelectedRequest(request);
    setModalStatus(request.status);
    setResultStatus(request.result?.includes('Không đạt') ? 'Không đạt' : 'Đạt');
    setReason(request.reason || '');
    setStampedFileName('');
    setIsModalOpen(true);
  };

  const saveResult = async () => {
    if (!selectedRequest) return;

    try {
      const updated = await yeuCauKiemNghiemApi.updateKetQua(selectedRequest.id, {
        ketQuaKiemNghiem: resultStatus === 'Đạt' ? 'Đạt tiêu chuẩn' : 'Không đạt',
        trangThai: modalStatus,
        lyDoKhongDat: resultStatus === 'Không đạt' ? reason.trim() : undefined,
        fileCoDauMoc: stampedFileName || undefined,
      });

      const mapped = mapRequest(updated);
      setData((prev) => prev.map((item) => (item.id === mapped.id ? mapped : item)));
      if (detailRequest?.id === mapped.id) {
        setDetailRequest(mapped);
      }
      setIsModalOpen(false);
      setSelectedRequest(null);
      setReason('');
      setStampedFileName('');
      setSuccessMessage(`Đã cập nhật kết quả cho ${mapped.id}`);
      void loadData();
    } catch (error) {
      setErrorMessage(normalizeError(error, 'Không thể cập nhật kết quả kiểm nghiệm'));
    }
  };

  const createRequest = async (payload: CreateInspectionRequestPayload): Promise<FoodInspectionRequestRecord> => {
    const today = new Date();
    const created = await yeuCauKiemNghiemApi.create({
      maCoSo: payload.facilityId,
      loaiMau: payload.sampleType,
      ngayYeuCau: toIsoDate(today),
      hanHoanThanh: toIsoDate(addDays(today, 7)),
      phongLab: payload.inspectionAgency,
      noidungYeuCau: payload.requestDescription,
      chiTieuKiemDinh: payload.criteria.join(', '),
      maMauLienQuan: payload.sampleId,
      maNguoiKiemNghiem: payload.testerId,
    });

    const mapped = mapRequest(created);
    return {
      id: mapped.id,
      business: mapped.business,
      sampleType: mapped.sampleType,
      requestDate: mapped.requestDate,
      deadline: mapped.deadline,
      status: mapped.status,
      lab: mapped.lab,
    };
  };

  const handleCreateSuccess = (record: FoodInspectionRequestRecord) => {
    setSuccessMessage(`Đã tạo yêu cầu ${record.id}`);
    setMode('list');
    void loadData();
  };

  const isSaveDisabled = !stampedFileName || (resultStatus === 'Không đạt' && !reason.trim());

  const filtered = useMemo(
    () =>
      data.filter((request) => {
        const matchSearch =
          !search ||
          request.business.toLowerCase().includes(search.toLowerCase()) ||
          request.id.toLowerCase().includes(search.toLowerCase());
        const matchStatus = !statusFilter || request.status === statusFilter;
        return matchSearch && matchStatus;
      }),
    [data, search, statusFilter]
  );

  const columns: Column<TestRequest>[] = [
    {
      key: 'id',
      header: 'Mã yêu cầu',
      render: (request) => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{request.id}</span>,
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: (request) => (
        <div>
          <p style={{ fontWeight: 600, fontSize: '13px', color: '#222' }}>{request.business}</p>
          {request.sampleId && <p style={{ fontSize: '11px', color: '#888' }}>Mẫu: {request.sampleId}</p>}
        </div>
      ),
    },
    {
      key: 'sampleType',
      header: 'Loại mẫu',
      render: (request) => <span style={{ fontSize: '12px', color: '#333' }}>{request.sampleType}</span>,
    },
    {
      key: 'requestDate',
      header: 'Ngày yêu cầu',
      render: (request) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{request.requestDate}</span>,
    },
    {
      key: 'deadline',
      header: 'Hạn hoàn thành',
      render: (request) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{request.deadline}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (request) => <StatusBadge variant={STATUS_VARIANT[request.status]} label={STATUS_LABEL[request.status]} />,
    },
    {
      key: 'result',
      header: 'Kết quả',
      render: (request) => request.result ? (
        <span style={{ fontSize: '12px', fontWeight: 600, color: request.result.includes('Không đạt') ? '#CC0000' : '#006400' }}>
          {request.result}
        </span>
      ) : <span style={{ fontSize: '11px', color: '#888' }}>—</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (request) => (
        <ActionButtons>
          <GovBtn variant="secondary" size="sm" title="Xem chi tiết" onClick={() => void openDetail(request)}>
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
          {canManageResult && (
            <GovBtn variant="outline" size="sm" title="Nhập kết quả" onClick={() => openResultModal(request)}>
              <Upload style={{ width: 12, height: 12 }} />
            </GovBtn>
          )}
        </ActionButtons>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Yêu cầu kiểm nghiệm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Quản lý các yêu cầu kiểm nghiệm mẫu thực phẩm"
        actions={
          mode === 'list' ? (
            <ActionButtons>
              <GovBtn variant="secondary" onClick={() => void loadData()}><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
              <GovBtn variant="secondary"><Printer style={{ width: 12, height: 12 }} /> In danh sách</GovBtn>
              <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
              {canCreateRequest && (
                <GovBtn
                  variant="primary"
                  onClick={() => {
                    setErrorMessage('');
                    setSuccessMessage('');
                    setMode('create');
                  }}
                >
                  <Plus style={{ width: 12, height: 12 }} /> Tạo yêu cầu mới
                </GovBtn>
              )}
            </ActionButtons>
          ) : undefined
        }
      />

      {successMessage && <AlertBanner type="success" title={successMessage} />}
      {errorMessage && (
        <div style={{ marginBottom: '12px', border: '1px solid #F5C2C7', background: '#FDEBEC', color: '#842029', padding: '10px 12px', borderRadius: '2px', fontSize: '13px' }}>
          {errorMessage}
        </div>
      )}

      {mode === 'create' ? (
        <CreateInspectionRequestForm
          sampleOptions={sampleOptions}
          testerOptions={testerOptions}
          onCancel={() => setMode('list')}
          onCreate={createRequest}
          onSuccess={handleCreateSuccess}
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
            <MiniStat label="Tổng yêu cầu" value={stats.tongYeuCau} color="neutral" />
            <MiniStat label="Chờ xử lý" value={stats.choDuyet} color="orange" />
            <MiniStat label="Đang thực hiện" value={stats.dangXuLy} color="blue" />
            <MiniStat label="Hoàn thành" value={stats.hoanThanh} color="green" />
          </div>

          <FilterBar>
            <FilterField label="Tìm kiếm">
              <GovInput placeholder="Mã yêu cầu, tên cơ sở..." value={search} onChange={setSearch} width={240} />
            </FilterField>
            <FilterField label="Trạng thái">
              <GovSelect value={statusFilter} onChange={setStatusFilter} options={[
                { value: '', label: '-- Tất cả --' },
                { value: 'pending', label: 'Chờ xử lý' },
                { value: 'processing', label: 'Đang thực hiện' },
                { value: 'completed', label: 'Hoàn thành' },
              ]} width={180} />
            </FilterField>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
              <GovBtn variant="primary">Tìm kiếm</GovBtn>
              <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); }}>Xóa lọc</GovBtn>
            </div>
          </FilterBar>

          <SectionCard
            title={`Danh sách yêu cầu kiểm nghiệm (${filtered.length} yêu cầu)`}
            footer={<GovPagination info={`Hiển thị ${filtered.length} / ${data.length} yêu cầu kiểm nghiệm`} />}
          >
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage={isLoading ? 'Đang tải dữ liệu yêu cầu kiểm nghiệm...' : 'Không tìm thấy yêu cầu kiểm nghiệm nào phù hợp.'}
            />
          </SectionCard>
        </>
      )}

      {isDetailOpen && detailRequest && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}
          onClick={e => { if (e.target === e.currentTarget) closeDetail(); }}
        >
          <div style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '2px', width: '100%', maxWidth: '640px', maxHeight: '85vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <div style={{ background: '#006400', padding: '10px 16px', borderBottom: '2px solid #004d00', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Chi tiết yêu cầu — {detailRequest.id}
              </h2>
              <button onClick={closeDetail} style={{ color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ overflowY: 'auto', flex: 1, padding: '14px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '12px' }}>
                <tbody>
                  {[
                    { label: 'Mã yêu cầu', value: detailRequest.id, mono: true },
                    { label: 'Cơ sở', value: detailRequest.business },
                    { label: 'Loại mẫu', value: detailRequest.sampleType },
                    { label: 'Mã mẫu', value: detailRequest.sampleId || '—', mono: true },
                    { label: 'Ngày yêu cầu', value: detailRequest.requestDate, mono: true },
                    { label: 'Hạn hoàn thành', value: detailRequest.deadline, mono: true },
                    { label: 'Đơn vị kiểm nghiệm', value: detailRequest.lab },
                  ].map((row, index) => (
                    <tr key={index} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '7px 10px', fontSize: '12px', fontWeight: 600, color: '#555', width: '160px', background: '#FAFAFA', whiteSpace: 'nowrap' }}>{row.label}</td>
                      <td style={{ padding: '7px 10px', fontSize: '13px', color: '#222', fontFamily: row.mono ? 'monospace' : 'inherit' }}>{row.value}</td>
                    </tr>
                  ))}
                  {detailRequest.criteria && detailRequest.criteria.length > 0 && (
                    <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '7px 10px', fontSize: '12px', fontWeight: 600, color: '#555', background: '#FAFAFA' }}>Chỉ tiêu KN</td>
                      <td style={{ padding: '7px 10px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {detailRequest.criteria.map((criterion) => (
                            <span key={criterion} style={{ padding: '1px 7px', borderRadius: '2px', border: '1px solid #94C994', background: '#EAF7EA', color: '#006400', fontSize: '11px', fontWeight: 500 }}>
                              {criterion}
                            </span>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                  <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                    <td style={{ padding: '7px 10px', fontSize: '12px', fontWeight: 600, color: '#555', background: '#FAFAFA' }}>Trạng thái</td>
                    <td style={{ padding: '7px 10px' }}>
                      <StatusBadge variant={STATUS_VARIANT[detailRequest.status]} label={STATUS_LABEL[detailRequest.status]} />
                    </td>
                  </tr>
                  {detailRequest.result && (
                    <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '7px 10px', fontSize: '12px', fontWeight: 600, color: '#555', background: '#FAFAFA' }}>Kết quả</td>
                      <td style={{ padding: '7px 10px', fontSize: '13px', fontWeight: 600, color: detailRequest.result.includes('Không đạt') ? '#CC0000' : '#006400' }}>
                        {detailRequest.result}
                        {detailRequest.reason && <p style={{ fontSize: '12px', color: '#CC0000', fontWeight: 400, marginTop: '2px' }}>{detailRequest.reason}</p>}
                      </td>
                    </tr>
                  )}
                  {detailRequest.requestContent && (
                    <tr>
                      <td style={{ padding: '7px 10px', fontSize: '12px', fontWeight: 600, color: '#555', background: '#FAFAFA', verticalAlign: 'top' }}>Nội dung</td>
                      <td style={{ padding: '7px 10px', fontSize: '13px', color: '#333', lineHeight: 1.6 }}>{detailRequest.requestContent}</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            <div style={{ padding: '10px 14px', borderTop: '1px solid #D6D6D6', display: 'flex', justifyContent: 'flex-end', background: '#FAFAFA' }}>
              <GovBtn variant="secondary" onClick={closeDetail}>Đóng</GovBtn>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && selectedRequest && canManageResult && (
        <div
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50, padding: '16px' }}
        >
          <div style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '2px', width: '100%', maxWidth: '520px', overflow: 'hidden' }}>
            <div style={{ background: '#006400', padding: '10px 16px', borderBottom: '2px solid #004d00', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>
                Nhập kết quả kiểm nghiệm — {selectedRequest.id}
              </h2>
              <button onClick={() => setIsModalOpen(false)} style={{ color: 'rgba(255,255,255,0.8)', background: 'none', border: 'none', fontSize: '18px', cursor: 'pointer', lineHeight: 1 }}>×</button>
            </div>

            <div style={{ padding: '14px' }}>
              <FormLayout>
                <FormSection title="Cập nhật kết quả">
                  <FormField label="Trạng thái">
                    <select
                      value={modalStatus}
                      onChange={e => setModalStatus(e.target.value as TestRequest['status'])}
                      style={{ height: '30px', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '0 8px', fontSize: '13px', fontFamily: 'inherit', width: '100%' }}
                    >
                      <option value="pending">Chờ xử lý</option>
                      <option value="processing">Đang thực hiện</option>
                      <option value="completed">Hoàn thành</option>
                    </select>
                  </FormField>
                  <FormField label="Kết luận">
                    <select
                      value={resultStatus}
                      onChange={e => setResultStatus(e.target.value as 'Đạt' | 'Không đạt')}
                      style={{ height: '30px', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '0 8px', fontSize: '13px', fontFamily: 'inherit', width: '100%' }}
                    >
                      <option value="Đạt">Đạt tiêu chuẩn</option>
                      <option value="Không đạt">Không đạt</option>
                    </select>
                  </FormField>
                  <FormField label="Tệp kết quả có dấu mộc *" fullWidth>
                    <div style={{ border: '1px dashed #D6D6D6', borderRadius: '2px', padding: '12px', textAlign: 'center', background: '#FAFAFA' }}>
                      <input type="file" id="stamped-file" accept=".pdf,.jpg,.png" style={{ display: 'none' }} onChange={e => { const file = e.target.files?.[0]; if (file) setStampedFileName(file.name); }} />
                      <label htmlFor="stamped-file" style={{ cursor: 'pointer', fontSize: '13px', color: '#005A9E' }}>
                        {stampedFileName || 'Chọn tệp PDF/ảnh có dấu mộc'}
                      </label>
                    </div>
                  </FormField>
                  {resultStatus === 'Không đạt' && (
                    <FormField label="Lý do không đạt *" fullWidth>
                      <textarea
                        value={reason}
                        onChange={e => setReason(e.target.value)}
                        placeholder="Nhập lý do chi tiết..."
                        rows={4}
                        style={{ width: '100%', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '8px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                      />
                    </FormField>
                  )}
                </FormSection>
              </FormLayout>
            </div>

            <div style={{ padding: '10px 14px', borderTop: '1px solid #D6D6D6', display: 'flex', justifyContent: 'flex-end', gap: '6px', background: '#FAFAFA' }}>
              <GovBtn variant="secondary" onClick={() => setIsModalOpen(false)}>Hủy</GovBtn>
              <GovBtn variant="primary" onClick={() => void saveResult()} disabled={isSaveDisabled}>Lưu kết quả</GovBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
