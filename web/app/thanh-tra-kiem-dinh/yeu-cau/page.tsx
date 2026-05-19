'use client';

import { useState } from 'react';
import { Plus, Eye, RefreshCw, FileSpreadsheet, Printer, Upload } from 'lucide-react';
import { useRole } from '@/lib/RoleContext';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
  FormLayout, FormSection, FormField,
} from '@/components/GovUI';
import DataTable, { type Column } from '@/components/DataTable';

export interface TestRequest {
  id: string;
  business: string;
  sampleType: string;
  requestDate: string;
  deadline: string;
  status: 'pending' | 'processing' | 'completed';
  lab: string;
  result?: string;
  reason?: string;
  stampedFile?: string;
  sampleId?: string;
  collectedDate?: string;
  criteria?: string[];
  requestContent?: string;
}

const mockTestRequests: TestRequest[] = [
  {
    id: 'YC-2025001',
    business: 'Nhà hàng Hải Sản Biển Xanh',
    sampleType: 'Mẫu thực phẩm tươi',
    requestDate: '23/03/2025',
    deadline: '30/03/2025',
    status: 'processing',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
    result: 'Đạt tiêu chuẩn',
    sampleId: 'M-2025-001',
    collectedDate: '22/03/2025',
    criteria: ['Vi sinh', 'Hóa học'],
    requestContent: 'Kiểm nghiệm mẫu hải sản tươi sống, đảm bảo không nhiễm vi khuẩn E.coli và Salmonella theo QCVN 8-3:2012/BYT.',
  },
  {
    id: 'YC-2025002',
    business: 'Cửa hàng Thực phẩm Sạch Organic',
    sampleType: 'Mẫu rau hữu cơ',
    requestDate: '24/03/2025',
    deadline: '02/04/2025',
    status: 'pending',
    lab: 'Lab Việt Nam',
    sampleId: 'M-2025-002',
    collectedDate: '23/03/2025',
    criteria: ['Kim loại nặng', 'Hóa học', 'Cảm quan'],
    requestContent: 'Kiểm tra dư lượng thuốc bảo vệ thực vật và kim loại nặng trong rau hữu cơ.',
  },
  {
    id: 'YC-2025003',
    business: 'Siêu thị Mini Mart Đà Nẵng',
    sampleType: 'Mẫu nước đá',
    requestDate: '20/03/2025',
    deadline: '28/03/2025',
    status: 'completed',
    lab: 'Trung tâm Kiểm nghiệm Đà Nẵng',
    result: 'Không đạt',
    reason: 'Vi phạm giới hạn vi sinh vật',
    sampleId: 'M-2025-003',
    collectedDate: '19/03/2025',
    criteria: ['Vi sinh', 'Cảm quan'],
    requestContent: 'Kiểm tra chỉ tiêu vi sinh và cảm quan của mẫu nước đá tại siêu thị.',
  },
];

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

export default function YeuCauPage() {
  const { role } = useRole();
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [data, setData] = useState<TestRequest[]>(mockTestRequests);

  // Result modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<TestRequest | null>(null);
  const [modalStatus, setModalStatus] = useState<TestRequest['status']>('pending');
  const [resultStatus, setResultStatus] = useState<'Đạt' | 'Không đạt'>('Đạt');
  const [reason, setReason] = useState('');
  const [stampedFileName, setStampedFileName] = useState('');

  // Detail modal state
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [detailRequest, setDetailRequest] = useState<TestRequest | null>(null);

  const canCreateRequest = role === 'INSPECTOR';
  const canManageResult = role === 'TESTER';

  const openDetail = (request: TestRequest) => {
    setDetailRequest(request);
    setIsDetailOpen(true);
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

  const saveResult = () => {
    if (!selectedRequest) return;
    const finalResult = resultStatus === 'Đạt' ? 'Đạt tiêu chuẩn' : 'Không đạt';
    setData(prev => prev.map(item =>
      item.id === selectedRequest.id
        ? { ...item, status: modalStatus, result: finalResult, reason: resultStatus === 'Không đạt' ? reason.trim() : undefined, stampedFile: stampedFileName || item.stampedFile }
        : item
    ));
    setIsModalOpen(false);
    setSelectedRequest(null);
    setReason('');
    setStampedFileName('');
  };

  const isSaveDisabled = !stampedFileName || (resultStatus === 'Không đạt' && !reason.trim());

  const filtered = data.filter(r => {
    const matchSearch = !search || r.business.toLowerCase().includes(search.toLowerCase()) || r.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<TestRequest>[] = [
    {
      key: 'id',
      header: 'Mã yêu cầu',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: r => (
        <div>
          <p style={{ fontWeight: 600, fontSize: '13px', color: '#222' }}>{r.business}</p>
          {r.sampleId && <p style={{ fontSize: '11px', color: '#888' }}>Mẫu: {r.sampleId}</p>}
        </div>
      ),
    },
    {
      key: 'sampleType',
      header: 'Loại mẫu',
      render: r => <span style={{ fontSize: '12px', color: '#333' }}>{r.sampleType}</span>,
    },
    {
      key: 'requestDate',
      header: 'Ngày yêu cầu',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.requestDate}</span>,
    },
    {
      key: 'deadline',
      header: 'Hạn hoàn thành',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.deadline}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={STATUS_VARIANT[r.status]} label={STATUS_LABEL[r.status]} />,
    },
    {
      key: 'result',
      header: 'Kết quả',
      render: r => r.result ? (
        <span style={{ fontSize: '12px', fontWeight: 600, color: r.result.includes('Không đạt') ? '#CC0000' : '#006400' }}>
          {r.result}
        </span>
      ) : <span style={{ fontSize: '11px', color: '#888' }}>—</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <ActionButtons>
          <GovBtn variant="secondary" size="sm" title="Xem chi tiết" onClick={() => openDetail(r)}>
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
          {canManageResult && (
            <GovBtn variant="outline" size="sm" title="Nhập kết quả" onClick={() => openResultModal(r)}>
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
          <ActionButtons>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><Printer style={{ width: 12, height: 12 }} /> In danh sách</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            {canCreateRequest && <GovBtn variant="primary"><Plus style={{ width: 12, height: 12 }} /> Tạo yêu cầu mới</GovBtn>}
          </ActionButtons>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng yêu cầu" value={data.length} color="neutral" />
        <MiniStat label="Chờ xử lý" value={data.filter(r => r.status === 'pending').length} color="orange" />
        <MiniStat label="Đang thực hiện" value={data.filter(r => r.status === 'processing').length} color="blue" />
        <MiniStat label="Hoàn thành" value={data.filter(r => r.status === 'completed').length} color="green" />
      </div>

      {/* Filter */}
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

      {/* Table */}
      <SectionCard
        title={`Danh sách yêu cầu kiểm nghiệm (${filtered.length} yêu cầu)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${data.length} yêu cầu kiểm nghiệm`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy yêu cầu kiểm nghiệm nào phù hợp."
        />
      </SectionCard>

      {/* Modal Chi tiết */}
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
                    { label: 'Ngày lấy mẫu', value: detailRequest.collectedDate || '—', mono: true },
                    { label: 'Ngày yêu cầu', value: detailRequest.requestDate, mono: true },
                    { label: 'Hạn hoàn thành', value: detailRequest.deadline, mono: true },
                    { label: 'Đơn vị kiểm nghiệm', value: detailRequest.lab },
                  ].map((row, i) => (
                    <tr key={i} style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '7px 10px', fontSize: '12px', fontWeight: 600, color: '#555', width: '160px', background: '#FAFAFA', whiteSpace: 'nowrap' }}>{row.label}</td>
                      <td style={{ padding: '7px 10px', fontSize: '13px', color: '#222', fontFamily: row.mono ? 'monospace' : 'inherit' }}>{row.value}</td>
                    </tr>
                  ))}
                  {detailRequest.criteria && (
                    <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
                      <td style={{ padding: '7px 10px', fontSize: '12px', fontWeight: 600, color: '#555', background: '#FAFAFA' }}>Chỉ tiêu KN</td>
                      <td style={{ padding: '7px 10px' }}>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px' }}>
                          {detailRequest.criteria.map(c => (
                            <span key={c} style={{ padding: '1px 7px', borderRadius: '2px', border: '1px solid #94C994', background: '#EAF7EA', color: '#006400', fontSize: '11px', fontWeight: 500 }}>
                              {c}
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

      {/* Modal Nhập Kết Quả (TESTER only) */}
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
                      <input type="file" id="stamped-file" accept=".pdf,.jpg,.png" style={{ display: 'none' }} onChange={e => { const f = e.target.files?.[0]; if (f) setStampedFileName(f.name); }} />
                      <label htmlFor="stamped-file" style={{ cursor: 'pointer', fontSize: '13px', color: '#005A9E' }}>
                        {stampedFileName || '📎 Chọn tệp PDF/ảnh có dấu mộc'}
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
              <GovBtn variant="primary" onClick={saveResult} disabled={isSaveDisabled}>Lưu kết quả</GovBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}