'use client';

import { useMemo, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import AlertBanner from '@/components/AlertBanner';
import CreateInspectionReportForm, {
  type CreateInspectionReportPayload,
} from '@/components/CreateInspectionReportForm';
import DataTable, { type Column } from '@/components/DataTable';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat,
} from '@/components/GovUI';
import { mockInspectionReports, type InspectionReport } from '@/data/mockData';
import { Eye, Pencil, FileSpreadsheet, RefreshCw, Plus } from 'lucide-react';

type PageMode = 'list' | 'create';

const inspectionTypeLabels: Record<CreateInspectionReportPayload['inspectionType'], string> = {
  'Định kỳ': 'Thanh tra định kỳ',
  'Đột xuất': 'Thanh tra đột xuất',
  'Theo phản ánh': 'Thanh tra theo phản ánh',
};

function getScoreColor(score: number) {
  if (score >= 80) return '#006400';
  if (score >= 50) return '#CC6600';
  return '#CC0000';
}

export default function BaoCaoPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<PageMode>('list');
  const [reports, setReports] = useState<InspectionReport[]>(mockInspectionReports);
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const updatedId = searchParams.get('updated');
  const bannerMessage = updatedId ? `Cập nhật báo cáo ${updatedId} thành công` : successMessage;
  const nextReportId = useMemo(() => `BC-${String(reports.length + 1).padStart(3, '0')}`, [reports.length]);

  const filtered = useMemo(
    () =>
      reports.filter((report) => {
        const matchSearch =
          !search ||
          report.tenCoSo.toLowerCase().includes(search.toLowerCase()) ||
          report.id.toLowerCase().includes(search.toLowerCase());
        const matchResult = !resultFilter || report.ketQua === resultFilter;
        return matchSearch && matchResult;
      }),
    [reports, resultFilter, search]
  );

  const total = reports.length;
  const completed = reports.filter((report) => report.ketQua === 'pass' || report.ketQua === 'fail').length;
  const failed = reports.filter((report) => report.ketQua === 'fail').length;

  const handleCreateClick = () => {
    setSuccessMessage('');
    setMode('create');
  };

  const handleCancel = () => {
    setMode('list');
  };

  const handleCreateReport = async (values: CreateInspectionReportPayload) => {
    const nextReport: InspectionReport = {
      id: nextReportId,
      tenCoSo: values.facilityName,
      loaiThanhTra: inspectionTypeLabels[values.inspectionType],
      thanhTraVien: 'Người dùng hiện tại',
      ngay: values.inspectionDate,
      ketQua: values.result,
      diem: values.score,
      quanHuyen: values.district,
      noiDung: values.content,
      nhanXet: values.comment,
      tepDinhKem: values.fileName,
    };

    setReports((current) => [nextReport, ...current]);
    setMode('list');
    setSuccessMessage('Gửi báo cáo thành công. Báo cáo mới đã được lưu vào danh sách.');
  };

  const columns: Column<InspectionReport>[] = [
    {
      key: 'id',
      header: 'Mã báo cáo',
      render: (report) => <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: '#005A9E' }}>{report.id}</span>,
    },
    {
      key: 'tenCoSo',
      header: 'Cơ sở',
      render: (report) => <span style={{ fontWeight: 600 }}>{report.tenCoSo}</span>,
    },
    { key: 'loaiThanhTra', header: 'Loại thanh tra' },
    { key: 'thanhTraVien', header: 'Thanh tra viên' },
    {
      key: 'ngay',
      header: 'Ngày kiểm tra',
      render: (report) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{report.ngay}</span>,
    },
    {
      key: 'ketQua',
      header: 'Kết quả',
      render: (report) => <StatusBadge variant={report.ketQua} />,
    },
    {
      key: 'diem',
      header: 'Điểm',
      render: (report) => <strong style={{ color: getScoreColor(report.diem) }}>{report.diem}/100</strong>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (report) => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <GovBtn
            variant="secondary" size="sm"
            onClick={() => router.push(`/thanh-tra-kiem-dinh/bao-cao/${report.id}`)}
            title="Xem báo cáo"
          >
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
          <GovBtn
            variant="outline" size="sm"
            onClick={() => router.push(`/thanh-tra-kiem-dinh/bao-cao/${report.id}/edit`)}
            title="Chỉnh sửa báo cáo"
          >
            <Pencil style={{ width: 12, height: 12 }} />
          </GovBtn>
        </div>
      ),
    },
  ];

  if (mode === 'create') {
    return <CreateInspectionReportForm reportId={nextReportId} onCancel={handleCancel} onSubmit={handleCreateReport} />;
  }

  return (
    <div>
      <PageHeader
        title="Báo cáo thanh tra an toàn thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Tổng hợp báo cáo và kết quả thanh tra"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            <GovBtn variant="primary" onClick={handleCreateClick}><Plus style={{ width: 12, height: 12 }} /> Tạo báo cáo</GovBtn>
          </>
        }
      />

      {bannerMessage && <AlertBanner type="success" title={bannerMessage} />}
      <AlertBanner type="warning" title="3 báo cáo chưa hoàn tất — Vui lòng kiểm tra và hoàn thiện báo cáo thanh tra trong tuần này." />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng số báo cáo" value={total} color="blue" />
        <MiniStat label="Hoàn thành" value={completed} color="green" />
        <MiniStat label="Đang xử lý" value={12} color="orange" />
        <MiniStat label="Không đạt" value={failed} color="red" />
      </div>

      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Tên cơ sở, mã báo cáo..." value={search} onChange={setSearch} width={220} />
        </FilterField>
        <FilterField label="Kết quả">
          <GovSelect
            value={resultFilter}
            onChange={setResultFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              { value: 'pass', label: 'Đạt' },
              { value: 'fail', label: 'Không đạt' },
              { value: 'scheduled', label: 'Đã lên lịch' },
            ]}
            width={150}
          />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setResultFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      <SectionCard
        title={`Danh sách báo cáo thanh tra (${filtered.length} báo cáo)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${reports.length} báo cáo`} />}
      >
        <DataTable columns={columns} data={filtered} emptyMessage="Không tìm thấy báo cáo nào" />
      </SectionCard>
    </div>
  );
}
