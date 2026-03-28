'use client';

import { useState } from 'react';
import { mockInspections, type Inspection } from '@/data/mockData';
import AlertBanner from '@/components/AlertBanner';
import Badge from '@/components/Badge';
import CreateInspectionForm, { type InspectionFormResult } from '@/components/CreateInspectionForm';
import DataTable, { type Column } from '@/components/DataTable';
import StatCard from '@/components/StatCard';
import TableCard, { FilterSelect, Pagination, SearchInput } from '@/components/TableCard';

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
      render: (inspection) => (
        <span className="font-mono text-[12px] text-slate-500">{inspection.id}</span>
      ),
    },
    {
      key: 'business',
      header: 'Cơ sở',
      render: (inspection) => <strong className="text-slate-800">{inspection.business}</strong>,
    },
    { key: 'type', header: 'Loại thanh tra' },
    { key: 'inspector', header: 'Thanh tra viên' },
    { key: 'date', header: 'Ngày' },
    {
      key: 'result',
      header: 'Kết quả',
      render: (inspection) => <Badge variant={inspection.result} />,
    },
    {
      key: 'score',
      header: 'Điểm',
      render: (inspection) => (
        <span
          className={`font-bold ${
            inspection.score >= 80
              ? 'text-emerald-600'
              : inspection.score >= 60
                ? 'text-amber-600'
                : 'text-red-600'
          }`}
        >
          {inspection.score}/100
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (inspection) => (
        <div className="flex gap-1.5">
          <button
            type="button"
            onClick={() => handleViewInspection(inspection)}
            className="h-7 w-7 rounded-md border border-slate-200 bg-white text-sm transition-colors hover:bg-slate-50"
          >
            👁
          </button>
          <button
            type="button"
            onClick={() => handleEditInspection(inspection)}
            className="h-7 w-7 rounded-md border border-slate-200 bg-white text-sm transition-colors hover:bg-slate-50"
          >
            ✏️
          </button>
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
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="font-display text-[22px] font-extrabold text-slate-900">
            Thanh tra & Kiểm định
          </h1>
          <p className="mt-0.5 text-[13px] text-slate-500">
            Theo dõi tất cả lịch và kết quả thanh tra an toàn thực phẩm
          </p>
        </div>

        {mode === 'list' && (
          <div className="flex gap-2">
            <button className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3.5 py-2 text-[13px] font-semibold text-slate-600 hover:bg-slate-50">
              📥 Xuất
            </button>
            <button
              type="button"
              onClick={handleCreateClick}
              className="flex items-center gap-1.5 rounded-lg bg-blue-600 px-3.5 py-2 text-[13px] font-semibold text-white hover:bg-blue-700"
            >
              + Tạo hồ sơ thanh tra
            </button>
          </div>
        )}
      </div>

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
            title="8 cuộc thanh tra đến hạn tuần này"
            message="Vui lòng xem xét và hoàn thành tất cả các cuộc thanh tra quá hạn trước thứ Sáu, ngày 17/01."
          />

          <div className="mb-6 grid grid-cols-4 gap-4">
            <StatCard label="Tổng số" value={total} color="blue" />
            <StatCard label="Hoàn thành" value={completed} color="green" />
            <StatCard label="Đã lên lịch" value={56} color="orange" />
            <StatCard label="Không đạt" value={failed} color="red" />
          </div>

          <TableCard
            title="Hồ sơ thanh tra"
            controls={
              <>
                <SearchInput placeholder="Tìm cơ sở..." onChange={setSearch} />
                <FilterSelect
                  options={[
                    { value: '', label: 'Tất cả kết quả' },
                    { value: 'pass', label: 'Đạt' },
                    { value: 'fail', label: 'Không đạt' },
                    { value: 'scheduled', label: 'Đã lên lịch' },
                  ]}
                  onChange={setResultFilter}
                />
                <FilterSelect
                  options={[
                    { value: '', label: 'Tất cả thanh tra viên' },
                    { value: 'Nguyễn Văn Trần', label: 'Nguyễn Văn Trần' },
                    { value: 'Lê Thị Mai', label: 'Lê Thị Mai' },
                    { value: 'Phạm Văn Đức', label: 'Phạm Văn Đức' },
                  ]}
                />
              </>
            }
            footer={<Pagination info={`Hiển thị 1–${filtered.length} trong tổng số ${total} hồ sơ`} />}
          >
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage="Không tìm thấy hồ sơ nào"
            />
          </TableCard>
        </>
      )}
    </div>
  );
}
