'use client';

import { useState } from 'react';
import { Eye, Pencil, FileSpreadsheet, Plus, RefreshCw } from 'lucide-react';
import AlertBanner from '@/components/AlertBanner';
import CreateInspectionForm, { type InspectionFormResult } from '@/components/CreateInspectionForm';
import DataTable, { type Column } from '@/components/DataTable';
import { PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn, SectionCard, GovPagination, StatusBadge, MiniStat } from '@/components/GovUI';

// ==================== TYPES ====================
type RecordMode = 'list' | 'create' | 'view' | 'edit';

type MauKiemNghiem = {
  maMau: string;
  tenMau: string;
  ngayThu: string;           // YYYY-MM-DD
  ngayKiemNghiem?: string;
  trangThai: 'CHUA_XU_LY' | 'DANG_XU_LY' | 'HOAN_THANH' | 'QUA_HAN';
  loaiMau: string;
  noiDung: string;
  ngayYeuCau: string;
  hanHoanThanh: string;
};

// ==================== MOCK DATA ====================
const mockMauKiemNghiem: MauKiemNghiem[] = [
  {
    maMau: "MKN202605001",
    tenMau: "Thịt heo tươi",
    ngayThu: "2025-05-10",
    ngayKiemNghiem: "2025-05-12",
    trangThai: "HOAN_THANH",
    loaiMau: "Thực phẩm tươi",
    noiDung: "Kiểm nghiệm chỉ tiêu vi sinh và kim loại nặng",
    ngayYeuCau: "2025-05-08",
    hanHoanThanh: "2025-05-15",
  },
  {
    maMau: "MKN202605002",
    tenMau: "Nước mắm",
    ngayThu: "2025-05-11",
    ngayKiemNghiem: "",
    trangThai: "DANG_XU_LY",
    loaiMau: "Gia vị",
    noiDung: "Kiểm tra histamine và độ mặn",
    ngayYeuCau: "2025-05-09",
    hanHoanThanh: "2025-05-20",
  },
  {
    maMau: "MKN202605003",
    tenMau: "Rau bina hữu cơ",
    ngayThu: "2025-05-12",
    ngayKiemNghiem: "",
    trangThai: "CHUA_XU_LY",
    loaiMau: "Rau củ",
    noiDung: "Kiểm tra dư lượng thuốc bảo vệ thực vật",
    ngayYeuCau: "2025-05-10",
    hanHoanThanh: "2025-05-18",
  },
  {
    maMau: "MKN202605004",
    tenMau: "Sữa tươi",
    ngayThu: "2025-05-08",
    ngayKiemNghiem: "2025-05-13",
    trangThai: "QUA_HAN",
    loaiMau: "Sản phẩm sữa",
    noiDung: "Kiểm nghiệm vi sinh và dinh dưỡng",
    ngayYeuCau: "2025-05-05",
    hanHoanThanh: "2025-05-12",
  },
];

// ==================== COMPONENT ====================
export default function YeuCauKiemNghiemPage() {
  const [mode, setMode] = useState<RecordMode>('list');
  const [samples, setSamples] = useState<MauKiemNghiem[]>(mockMauKiemNghiem);
  const [selectedRecord, setSelectedRecord] = useState<MauKiemNghiem | null>(null);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = samples.filter((sample) => {
    const matchSearch = !search ||
      sample.maMau.toLowerCase().includes(search.toLowerCase()) ||
      sample.tenMau.toLowerCase().includes(search.toLowerCase());

    const matchStatus = !statusFilter || sample.trangThai === statusFilter;
    return matchSearch && matchStatus;
  });

  const columns: Column<MauKiemNghiem>[] = [
    { key: 'maMau', header: 'Mã mẫu' },
    { key: 'tenMau', header: 'Tên mẫu' },
    { key: 'loaiMau', header: 'Loại mẫu' },
    {
      key: 'ngayThu',
      header: 'Ngày thu',
      render: (r) => new Date(r.ngayThu).toLocaleDateString('vi-VN')
    },
    {
      key: 'hanHoanThanh',
      header: 'Hạn hoàn thành',
      render: (r) => new Date(r.hanHoanThanh).toLocaleDateString('vi-VN')
    },
    {
      key: 'trangThai',
      header: 'Trạng thái',
      render: (r) => <StatusBadge variant={getStatusVariant(r.trangThai)} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (r) => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <GovBtn variant="secondary" size="sm" onClick={() => handleView(r)} title="Xem">
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
          <GovBtn variant="outline" size="sm" onClick={() => handleEdit(r)} title="Sửa">
            <Pencil style={{ width: 12, height: 12 }} />
          </GovBtn>
        </div>
      ),
    },
  ];

  // Stats
  const total = samples.length;
  const completed = samples.filter(s => s.trangThai === 'HOAN_THANH').length;
  const overdue = samples.filter(s => s.trangThai === 'QUA_HAN').length;

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'HOAN_THANH': return 'success';
      case 'DANG_XU_LY': return 'warning';
      case 'QUA_HAN': return 'danger';
      default: return 'default';
    }
  };

  const handleCreateClick = () => {
    setSelectedRecord(null);
    setMode('create');
  };

  const handleCancelForm = () => {
    setSelectedRecord(null);
    setMode('list');
  };

  const handleCreateSuccess = (record: MauKiemNghiem) => {
    setSamples(prev => [record, ...prev]);
    setMode('list');
    // setFeedbackMessage...
  };

  const handleUpdateSuccess = (record: MauKiemNghiem) => {
    setSamples(prev => prev.map(item => item.maMau === record.maMau ? record : item));
    setMode('list');
  };

  const handleView = (record: MauKiemNghiem) => {
    setSelectedRecord(record);
    setMode('view');
  };

  const handleEdit = (record: MauKiemNghiem) => {
    setSelectedRecord(record);
    setMode('edit');
  };

  return (
    <div>
      <PageHeader
        title="Yêu cầu kiểm nghiệm mẫu"
        subtitle="Quản lý mẫu kiểm nghiệm — Chi cục An toàn Thực phẩm TP. Đà Nẵng"
        actions={mode === 'list' ? (
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            <GovBtn variant="primary" onClick={handleCreateClick}>
              <Plus style={{ width: 12, height: 12 }} /> Tạo yêu cầu
            </GovBtn>
          </>
        ) : undefined}
      />

      {mode === 'create' ? (
        <CreateInspectionForm onCancel={handleCancelForm} onSuccess={handleCreateSuccess} />
      ) : mode === 'edit' ? (
        <CreateInspectionForm
          mode="edit"
          data={selectedRecord ? {
            tenMau: selectedRecord.tenMau,
            loaiMau: selectedRecord.loaiMau,
            noiDung: selectedRecord.noiDung,
            ngayThu: selectedRecord.ngayThu,
            hanHoanThanh: selectedRecord.hanHoanThanh,
          } : undefined}
          recordId={selectedRecord?.maMau}
          onCancel={handleCancelForm}
          onSuccess={handleUpdateSuccess}
        />
      ) : mode === 'view' ? (
        <CreateInspectionForm
          mode="view"
          data={selectedRecord ? {
            tenMau: selectedRecord.tenMau,
            loaiMau: selectedRecord.loaiMau,
            noiDung: selectedRecord.noiDung,
            ngayThu: selectedRecord.ngayThu,
            hanHoanThanh: selectedRecord.hanHoanThanh,
          } : undefined}
          onCancel={handleCancelForm}
          onSuccess={() => {}}
        />
      ) : (
        <>
          <AlertBanner
            type="warning"
            title="Có 3 mẫu kiểm nghiệm sắp đến hạn — Vui lòng theo dõi tiến độ."
          />

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
            <MiniStat label="Tổng số mẫu" value={total} color="blue" />
            <MiniStat label="Hoàn thành" value={completed} color="green" />
            <MiniStat label="Đang xử lý" value={samples.filter(s => s.trangThai === 'DANG_XU_LY').length} color="orange" />
            <MiniStat label="Quá hạn" value={overdue} color="red" />
          </div>

          <FilterBar>
            <FilterField label="Tìm kiếm">
              <GovInput
                placeholder="Mã mẫu, tên mẫu..."
                value={search}
                onChange={setSearch}
                width={220}
              />
            </FilterField>
            <FilterField label="Trạng thái">
              <GovSelect
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: '', label: '-- Tất cả --' },
                  { value: 'CHUA_XU_LY', label: 'Chưa xử lý' },
                  { value: 'DANG_XU_LY', label: 'Đang xử lý' },
                  { value: 'HOAN_THANH', label: 'Hoàn thành' },
                  { value: 'QUA_HAN', label: 'Quá hạn' },
                ]}
                width={160}
              />
            </FilterField>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
              <GovBtn variant="primary">Tìm kiếm</GovBtn>
              <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); }}>
                Xóa lọc
              </GovBtn>
            </div>
          </FilterBar>

          <SectionCard
            title={`Danh sách mẫu kiểm nghiệm (${filtered.length} mẫu)`}
            footer={<GovPagination info={`Hiển thị ${filtered.length} / ${total} mẫu`} />}
          >
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage="Không tìm thấy mẫu kiểm nghiệm nào."
            />
          </SectionCard>
        </>
      )}
    </div>
  );
}