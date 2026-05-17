'use client';

import { useState } from 'react';
import { Eye, Pencil, FileSpreadsheet, Plus, RefreshCw } from 'lucide-react';
import { mockInspections } from '@/data/mockData';
import AlertBanner from '@/components/AlertBanner';
import CreateInspectionForm, { type InspectionFormResult } from '@/components/CreateInspectionForm';
import DataTable, { type Column } from '@/components/DataTable';
import { PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn, SectionCard, GovPagination, StatusBadge, MiniStat } from '@/components/GovUI';

type RecordMode = 'list' | 'create' | 'view' | 'edit';

type ChecklistResult = 'pass' | 'fail' | '';

type DetailedInspection = InspectionFormResult;

const standardChecklist: Record<string, 'pass' | 'fail'> = {
  cleanProcessingArea: 'pass',
  separateRawCookedArea: 'pass',
  drainageSystem: 'pass',
  noInsects: 'pass',
  cleanUtensils: 'pass',
  storageCabinet: 'pass',
  coveredFood: 'pass',
  separateUtensils: 'pass',
  clearOrigin: 'pass',
  hasInvoice: 'pass',
  notExpired: 'pass',
  hasSampleStorage: 'pass',
  healthCheck: 'pass',
  foodSafetyTraining: 'pass',
  wearProtection: 'pass',
  noInfectiousDisease: 'pass',
  properProcessing: 'pass',
  properStorage: 'pass',
  noCrossContamination: 'pass',
  postProcessingCleanup: 'pass',
};

function createChecklistData(isFail: boolean): Record<string, 'pass' | 'fail'> {
  const allPass: Record<string, 'pass' | 'fail'> = { ...standardChecklist };

  if (!isFail) {
    return allPass;
  }

  return {
    ...allPass,
    noInsects: 'fail',
    notExpired: 'fail',
    noCrossContamination: 'fail',
  };
}

const defaultDetailedInspections: DetailedInspection[] = mockInspections.map((inspection) => {
  const [day, month, year] = inspection.date.split('/');
  const isFail = inspection.result === 'fail';
  return {
    ...inspection,
    result: inspection.result === 'pass' ? 'pass' : 'fail',
    businessName: inspection.business,
    address: '123 Nguyễn Văn Linh, Hải Châu, Đà Nẵng',
    phone: '0903 123 456',
    owner: 'Nguyễn Thị Ánh',
    businessType: 'Nhà hàng',
    inspectionTime: `${year}-${month}-${day}T09:30`,
    businessLicense: 'Hợp lệ',
    foodSafetyCertificate: 'Hợp lệ',
    healthCertificate: 'Hợp lệ',
    trainingCertificate: 'Hợp lệ',
    checklist: createChecklistData(isFail),
    violationStatus: isFail ? 'has' : 'none',
    violationDescription: isFail
      ? 'Phát hiện một số lỗi trong bảo quản nguyên liệu và hồ sơ không đầy đủ.'
      : 'Không phát hiện vi phạm.',
    conclusion: inspection.result === 'pass' ? 'pass' : 'fail',
    generalComment: inspection.result === 'pass'
      ? 'Cơ sở đáp ứng yêu cầu an toàn thực phẩm.'
      : 'Cần khắc phục ngay các lỗi đã xác định.',
    actionMeasure: inspection.result === 'pass'
      ? 'Duy trì quy trình hiện tại và kiểm tra định kỳ.'
      : 'Xử lý khắc phục tại chỗ và cập nhật hồ sơ pháp lý.',
    recommendation: inspection.result === 'pass'
      ? 'Tiếp tục giám sát định kỳ.'
      : 'Đào tạo lại nhân viên và hoàn thiện hồ sơ pháp lý.',
  };
});

export default function ThanhTraKiemDinhPage() {
  const [mode, setMode] = useState<RecordMode>('list');
  const [inspections, setInspections] = useState<DetailedInspection[]>(defaultDetailedInspections);
  const [selectedRecord, setSelectedRecord] = useState<DetailedInspection | null>(null);
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const filtered = inspections.filter((inspection) => {
    const matchSearch =
      !search ||
      inspection.business.toLowerCase().includes(search.toLowerCase()) ||
      inspection.id.toLowerCase().includes(search.toLowerCase());
    const matchResult = !resultFilter || inspection.result === resultFilter;
    return matchSearch && matchResult;
  });

  const columns: Column<DetailedInspection>[] = [
    {
      key: 'id',
      header: 'Mã hồ sơ',
      render: (r) => <span style={{ fontFamily:'monospace', fontWeight:600, color:'#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: (r) => <span style={{ fontWeight:600 }}>{r.business}</span>,
    },
    { key: 'type', header: 'Loại thanh tra' },
    { key: 'inspector', header: 'Thanh tra viên' },
    { key: 'date', header: 'Ngày' },
    {
      key: 'result',
      header: 'Kết quả',
      render: (r) => <StatusBadge variant={r.result} />,
    },
    {
      key: 'score',
      header: 'Điểm',
      render: (r) => (
        <strong style={{ color: r.score >= 80 ? '#006400' : r.score >= 60 ? '#CC6600' : '#CC0000' }}>
          {r.score}/100
        </strong>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (r) => (
        <div style={{ display:'flex', gap:'3px' }}>
          <GovBtn variant="secondary" size="sm" onClick={() => handleViewInspection(r)} title="Xem">
            <Eye style={{ width:12, height:12 }} />
          </GovBtn>
          <GovBtn variant="outline" size="sm" onClick={() => handleEditInspection(r)} title="Sửa">
            <Pencil style={{ width:12, height:12 }} />
          </GovBtn>
        </div>
      ),
    },
  ];

  const total = inspections.length;
  const completed = inspections.filter((inspection) => inspection.result === 'pass' || inspection.result === 'fail').length;
  const failed = inspections.filter((inspection) => inspection.result === 'fail').length;

  const handleCreateClick = () => {
    setFeedbackMessage('');
    setSelectedRecord(null);
    setMode('create');
  };

  const handleCancelForm = () => {
    setSelectedRecord(null);
    setMode('list');
  };

  const handleCreateSuccess = (record: DetailedInspection) => {
    setInspections((current) => [record, ...current]);
    setSelectedRecord(null);
    setMode('list');
    setFeedbackMessage('Lưu biên bản thành công. Hồ sơ kiểm tra mới đã được thêm vào danh sách.');
  };

  const handleUpdateSuccess = (record: DetailedInspection) => {
    setInspections((current) => current.map((item) => (item.id === record.id ? record : item)));
    setSelectedRecord(null);
    setMode('list');
    setFeedbackMessage('Cập nhật thành công');
  };

  const handleViewInspection = (inspection: DetailedInspection) => {
    setFeedbackMessage('');
    setSelectedRecord(inspection);
    setMode('view');
  };

  const handleEditInspection = (inspection: DetailedInspection) => {
    setFeedbackMessage('');
    setSelectedRecord(inspection);
    setMode('edit');
  };

  return (
    <div>
      <PageHeader
        title="Hồ sơ thanh tra & kiểm định"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Quản lý lịch và kết quả thanh tra"
        actions={mode === 'list' ? (
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width:12, height:12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width:12, height:12 }} /> Xuất Excel</GovBtn>
            <GovBtn variant="primary" onClick={handleCreateClick}><Plus style={{ width:12, height:12 }} /> Tạo hồ sơ</GovBtn>
          </>
        ) : undefined}
      />

      {mode === 'create' ? (
        <CreateInspectionForm onCancel={handleCancelForm} onSuccess={handleCreateSuccess} />
      ) : mode === 'edit' ? (
        <CreateInspectionForm
          mode="edit"
          data={selectedRecord ?? undefined}
          recordId={selectedRecord?.id}
          onCancel={handleCancelForm}
          onSuccess={handleUpdateSuccess}
        />
      ) : mode === 'view' ? (
        <CreateInspectionForm
          mode="view"
          data={selectedRecord ?? undefined}
          onCancel={handleCancelForm}
          onSuccess={() => {}}
        />
      ) : (
        <>
          {feedbackMessage && <AlertBanner type="success" title={feedbackMessage} />}

          <AlertBanner
            type="warning"
            title="8 cuộc thanh tra đến hạn tuần này — Vui lòng hoàn thành trước thứ Sáu 17/01."
          />

          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'10px', marginBottom:'12px' }}>
            <MiniStat label="Tổng số hồ sơ" value={total} color="blue" />
            <MiniStat label="Hoàn thành" value={completed} color="green" />
            <MiniStat label="Đã lên lịch" value={56} color="orange" />
            <MiniStat label="Không đạt" value={failed} color="red" />
          </div>

          <FilterBar>
            <FilterField label="Tìm kiếm">
              <GovInput placeholder="Tên cơ sở, mã hồ sơ..." value={search} onChange={setSearch} width={200} />
            </FilterField>
            <FilterField label="Kết quả">
              <GovSelect value={resultFilter} onChange={setResultFilter} options={[
                { value:'', label:'-- Tất cả --' },
                { value:'pass', label:'Đạt' },
                { value:'fail', label:'Không đạt' },
                { value:'scheduled', label:'Đã lên lịch' },
              ]} width={150} />
            </FilterField>
            <div style={{ display:'flex', alignItems:'flex-end', gap:'6px' }}>
              <GovBtn variant="primary">Tìm kiếm</GovBtn>
              <GovBtn variant="secondary" onClick={() => { setSearch(''); setResultFilter(''); }}>Xóa lọc</GovBtn>
            </div>
          </FilterBar>

          <SectionCard
            title={`Danh sách hồ sơ thanh tra (${filtered.length} bản ghi)`}
            footer={<GovPagination info={`Hiển thị ${filtered.length} / ${total} hồ sơ`} />}
          >
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage="Không tìm thấy hồ sơ nào phù hợp."
            />
          </SectionCard>
        </>
      )}
    </div>
  );
}
