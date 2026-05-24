'use client';

import { useEffect, useMemo, useState } from 'react';
import { Eye, Pencil, FileSpreadsheet, Plus, RefreshCw } from 'lucide-react';
import AlertBanner from '@/components/AlertBanner';
import CreateInspectionForm, {
  createInitialChecklist,
  type InspectionFacilityOption,
  type InspectionFormResult,
} from '@/components/CreateInspectionForm';
import DataTable, { type Column } from '@/components/DataTable';
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
} from '@/components/GovUI';
import {
  coSoKinhDoanhApi,
  hoSoThanhTraApi,
  type HoSoThanhTraRequest,
  type HoSoThanhTraResponse,
  type HoSoThanhTraStatsResponse,
} from '@/api/api';

type RecordMode = 'list' | 'create' | 'view' | 'edit';

const EMPTY_STATS: HoSoThanhTraStatsResponse = {
  total: 0,
  completed: 0,
  scheduled: 0,
  failed: 0,
};

function normalizeError(error: unknown, fallback: string) {
  return error instanceof Error ? error.message : fallback;
}

function getStatusVariant(status?: string | null) {
  switch ((status || '').toLowerCase()) {
    case 'pass':
      return 'success';
    case 'fail':
      return 'danger';
    case 'scheduled':
      return 'warning';
    default:
      return 'default';
  }
}

function getStatusLabel(status?: string | null) {
  switch ((status || '').toLowerCase()) {
    case 'pass':
      return 'Đạt';
    case 'fail':
      return 'Không đạt';
    case 'scheduled':
      return 'Đã lên lịch';
    default:
      return status || 'Chưa có';
  }
}

function mapBusinessOptions(
  pageData: Awaited<ReturnType<typeof coSoKinhDoanhApi.search>>
): InspectionFacilityOption[] {
  return pageData.content.map((item) => ({
    id: item.maCoSo,
    name: item.tenCoSo,
    address: item.tenPhuongXa || '',
    owner: '',
    phone: '',
    businessType: item.loaiHinhKinhDoanh?.join(', ') || '',
    businessLicense: item.soGiayPhep || '',
  }));
}

function mapRecordToFormData(record: HoSoThanhTraResponse): InspectionFormResult {
  const checklist = createInitialChecklist();
  if (record.checklist) {
    for (const [key, value] of Object.entries(record.checklist)) {
      if (key in checklist) {
        checklist[key] = value === 'pass' ? 'pass' : value === 'fail' ? 'fail' : '';
      }
    }
  }

  return {
    facilityId: record.facilityId || '',
    businessName: record.businessName || record.business || '',
    address: record.address || '',
    phone: record.phone || '',
    owner: record.owner || '',
    businessType: record.businessType || '',
    inspectionTime: record.inspectionTime || '',
    businessLicense: record.businessLicense || '',
    foodSafetyCertificate: record.foodSafetyCertificate || '',
    healthCertificate: record.healthCertificate || '',
    trainingCertificate: record.trainingCertificate || '',
    checklist,
    violationStatus: record.violationStatus === 'has' ? 'has' : 'none',
    violationDescription: record.violationDescription || '',
    conclusion: record.conclusion === 'fail' ? 'fail' : 'pass',
    generalComment: record.generalComment || '',
    actionMeasure: record.actionMeasure || '',
    recommendation: record.recommendation || '',
  };
}

function mapFormToRequest(form: InspectionFormResult): HoSoThanhTraRequest {
  return {
    facilityId: form.facilityId,
    inspectionTime: form.inspectionTime,
    businessLicense: form.businessLicense,
    foodSafetyCertificate: form.foodSafetyCertificate,
    healthCertificate: form.healthCertificate,
    trainingCertificate: form.trainingCertificate,
    checklist: form.checklist,
    violationStatus: form.violationStatus,
    violationDescription: form.violationDescription.trim(),
    conclusion: form.conclusion,
    generalComment: form.generalComment.trim(),
    actionMeasure: form.actionMeasure.trim(),
    recommendation: form.recommendation.trim(),
  };
}

export default function HoSoThanhTraPage() {
  const [mode, setMode] = useState<RecordMode>('list');
  const [records, setRecords] = useState<HoSoThanhTraResponse[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<HoSoThanhTraResponse | null>(null);
  const [businessOptions, setBusinessOptions] = useState<InspectionFacilityOption[]>([]);
  const [stats, setStats] = useState<HoSoThanhTraStatsResponse>(EMPTY_STATS);
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const loadData = async () => {
    setIsLoading(true);
    setErrorMessage('');

    try {
      const [recordPage, statsData, businessPage] = await Promise.all([
        hoSoThanhTraApi.search('', '', '', 0, 100),
        hoSoThanhTraApi.getStats(),
        coSoKinhDoanhApi.search('', 0, 100),
      ]);

      setRecords(recordPage.content);
      setStats(statsData);
      setBusinessOptions(mapBusinessOptions(businessPage));
    } catch (error) {
      setErrorMessage(normalizeError(error, 'Không thể tải dữ liệu hồ sơ thanh tra'));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadData();
  }, []);

  const filtered = useMemo(() => {
    return records.filter((record) => {
      const matchSearch =
        !search ||
        record.id.toLowerCase().includes(search.toLowerCase()) ||
        record.business.toLowerCase().includes(search.toLowerCase()) ||
        record.inspector.toLowerCase().includes(search.toLowerCase());

      const matchResult = !resultFilter || (record.result || '').toLowerCase() === resultFilter.toLowerCase();
      return matchSearch && matchResult;
    });
  }, [records, resultFilter, search]);

  const columns: Column<HoSoThanhTraResponse>[] = [
    { key: 'id', header: 'Mã hồ sơ' },
    { key: 'business', header: 'Cơ sở' },
    { key: 'inspector', header: 'Thanh tra viên' },
    {
      key: 'date',
      header: 'Ngày kiểm tra',
      render: (record) => record.date || 'Chưa có',
    },
    {
      key: 'result',
      header: 'Kết luận',
      render: (record) => (
        <StatusBadge variant={getStatusVariant(record.result)} label={getStatusLabel(record.result)} />
      ),
    },
    {
      key: 'score',
      header: 'Điểm',
      render: (record) => (record.score ?? 0).toFixed(0),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (record) => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <GovBtn variant="secondary" size="sm" onClick={() => void handleView(record.id)} title="Xem">
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
          <GovBtn variant="outline" size="sm" onClick={() => void handleEdit(record.id)} title="Sửa">
            <Pencil style={{ width: 12, height: 12 }} />
          </GovBtn>
        </div>
      ),
    },
  ];

  const handleCreateClick = () => {
    setSelectedRecord(null);
    setSuccessMessage('');
    setMode('create');
  };

  const handleCancelForm = () => {
    setSelectedRecord(null);
    setMode('list');
  };

  const handleCreateSuccess = async (form: InspectionFormResult) => {
    const created = await hoSoThanhTraApi.create(mapFormToRequest(form));
    setRecords((current) => [created, ...current]);
    setSelectedRecord(created);
    setSuccessMessage(`Đã tạo hồ sơ ${created.id}`);
    setMode('list');
    void loadData();
  };

  const handleUpdateSuccess = async (form: InspectionFormResult) => {
    if (!selectedRecord) {
      return;
    }

    const updated = await hoSoThanhTraApi.update(selectedRecord.id, mapFormToRequest(form));
    setRecords((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    setSelectedRecord(updated);
    setSuccessMessage(`Đã cập nhật hồ sơ ${updated.id}`);
    setMode('list');
    void loadData();
  };

  const handleView = async (id: string) => {
    setErrorMessage('');
    try {
      const detail = await hoSoThanhTraApi.getById(id);
      console.log('[DEBUG] API response:', JSON.stringify(detail, null, 2));
      console.log('[DEBUG] API checklist:', detail.checklist);
      const mapped = mapRecordToFormData(detail);
      console.log('[DEBUG] Mapped checklist:', mapped.checklist);
      setSelectedRecord(detail);
      setMode('view');
    } catch (error) {
      setErrorMessage(normalizeError(error, `Không thể tải hồ sơ ${id}`));
    }
  };

  const handleEdit = async (id: string) => {
    setErrorMessage('');
    try {
      const detail = await hoSoThanhTraApi.getById(id);
      setSelectedRecord(detail);
      setMode('edit');
    } catch (error) {
      setErrorMessage(normalizeError(error, `Không thể tải hồ sơ ${id}`));
    }
  };

  return (
    <div>
      <PageHeader
        title="Hồ sơ thanh tra"
        subtitle="Quản lý hồ sơ thanh tra an toàn thực phẩm"
        actions={
          mode === 'list' ? (
            <>
              <GovBtn variant="secondary" onClick={() => void loadData()}>
                <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
              </GovBtn>
              <GovBtn variant="secondary">
                <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
              </GovBtn>
              <GovBtn variant="primary" onClick={handleCreateClick}>
                <Plus style={{ width: 12, height: 12 }} /> Tạo hồ sơ
              </GovBtn>
            </>
          ) : undefined
        }
      />

      {successMessage && mode === 'list' && <AlertBanner type="success" title={successMessage} />}
      {errorMessage && <AlertBanner type="danger" title={errorMessage} />}

      {mode === 'create' ? (
        <CreateInspectionForm
          businessOptions={businessOptions}
          onCancel={handleCancelForm}
          onSuccess={handleCreateSuccess}
        />
      ) : mode === 'edit' ? (
        <CreateInspectionForm
          mode="edit"
          data={selectedRecord ? mapRecordToFormData(selectedRecord) : undefined}
          businessOptions={businessOptions}
          onCancel={handleCancelForm}
          onSuccess={handleUpdateSuccess}
        />
      ) : mode === 'view' ? (
        <CreateInspectionForm
          mode="view"
          data={selectedRecord ? mapRecordToFormData(selectedRecord) : undefined}
          businessOptions={businessOptions}
          onCancel={handleCancelForm}
          onSuccess={async () => {}}
        />
      ) : (
        <>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
            <MiniStat label="Tổng hồ sơ" value={stats.total} color="blue" />
            <MiniStat label="Hoàn thành" value={stats.completed} color="green" />
            <MiniStat label="Đã lên lịch" value={stats.scheduled} color="orange" />
            <MiniStat label="Không đạt" value={stats.failed} color="red" />
          </div>

          <FilterBar>
            <FilterField label="Tìm kiếm">
              <GovInput
                placeholder="Mã hồ sơ, cơ sở, thanh tra viên..."
                value={search}
                onChange={setSearch}
                width={260}
              />
            </FilterField>
            <FilterField label="Kết luận">
              <GovSelect
                value={resultFilter}
                onChange={setResultFilter}
                options={[
                  { value: '', label: '-- Tất cả --' },
                  { value: 'pass', label: 'Đạt' },
                  { value: 'fail', label: 'Không đạt' },
                  { value: 'scheduled', label: 'Đã lên lịch' },
                ]}
                width={180}
              />
            </FilterField>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
              <GovBtn variant="primary">Tìm kiếm</GovBtn>
              <GovBtn
                variant="secondary"
                onClick={() => {
                  setSearch('');
                  setResultFilter('');
                }}
              >
                Xóa lọc
              </GovBtn>
            </div>
          </FilterBar>

          <SectionCard
            title={`Danh sách hồ sơ thanh tra (${filtered.length} hồ sơ)`}
            footer={<GovPagination info={`Hiển thị ${filtered.length} / ${records.length} hồ sơ`} />}
          >
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage={isLoading ? 'Đang tải hồ sơ thanh tra...' : 'Không tìm thấy hồ sơ thanh tra nào.'}
            />
          </SectionCard>
        </>
      )}
    </div>
  );
}
