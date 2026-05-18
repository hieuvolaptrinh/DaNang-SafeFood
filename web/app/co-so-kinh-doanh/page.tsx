'use client';

import { useState } from 'react';
import {
  mockBusinesses,
  mockInspections,
  mockViolations,
  type Business,
  type Inspection,
  type Violation,
} from '@/data/mockData';
import {
  AlertTriangle,
  ArrowLeft,
  Building2,
  CalendarDays,
  CheckCircle2,
  Eye,
  FileClock,
  FileSpreadsheet,
  Pencil,
  Plus,
  Printer,
  RefreshCw,
  Trash2,
} from 'lucide-react';
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

function DetailItem({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: '1px solid #D6D6D6',
        background: '#FAFAFA',
        padding: '12px 14px',
        borderRadius: '2px',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          marginBottom: '6px',
          fontSize: '11px',
          fontWeight: 700,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}
      >
        {icon}
        <span>{label}</span>
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#222' }}>{value}</div>
    </div>
  );
}

function EmptyPanel({ message }: { message: string }) {
  return (
    <div
      style={{
        padding: '20px',
        border: '1px dashed #CFCFCF',
        background: '#FAFAFA',
        color: '#666',
        fontSize: '13px',
      }}
    >
      {message}
    </div>
  );
}

function ApprovalBadge({ label = 'Đã duyệt' }: { label?: string }) {
  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        height: '22px',
        padding: '0 8px',
        borderRadius: '10px',
        border: '1px solid #94C994',
        background: '#E6F4E6',
        color: '#006400',
        fontSize: '11px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      {label}
    </span>
  );
}

export default function CoSoKinhDoanhPage() {
  const [data, setData] = useState<Business[]>(mockBusinesses);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');
  const [viewMode, setViewMode] = useState<'list' | 'detail' | 'edit'>('list');
  const [selectedBusinessId, setSelectedBusinessId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Business | null>(null);

  const filtered = data.filter((business) => {
    const matchSearch =
      !search ||
      business.name.toLowerCase().includes(search.toLowerCase()) ||
      business.id.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || business.status === statusFilter;
    const matchDistrict = !districtFilter || business.district === districtFilter;
    return matchSearch && matchStatus && matchDistrict;
  });

  const districts = [...new Set(data.map((business) => business.district))];
  const selectedBusiness =
    selectedBusinessId ? data.find((business) => business.id === selectedBusinessId) ?? null : null;

  const relatedInspections: Inspection[] = selectedBusiness
    ? mockInspections.filter((inspection) => inspection.business === selectedBusiness.name)
    : [];
  const latestInspection = relatedInspections[0] ?? null;

  const relatedViolations: Violation[] = selectedBusiness
    ? mockViolations.filter((violation) => violation.business === selectedBusiness.name)
    : [];

  const openDetail = (business: Business) => {
    setSelectedBusinessId(business.id);
    setEditForm(null);
    setViewMode('detail');
  };

  const openEdit = (business: Business) => {
    setSelectedBusinessId(business.id);
    setEditForm({ ...business });
    setViewMode('edit');
  };

  const closePanel = () => {
    setSelectedBusinessId(null);
    setEditForm(null);
    setViewMode('list');
  };

  const cancelEdit = () => {
    if (!selectedBusiness) {
      closePanel();
      return;
    }

    setEditForm({ ...selectedBusiness });
    setViewMode('detail');
  };

  const saveEdit = () => {
    if (!editForm) {
      return;
    }

    setData((current) =>
      current.map((business) =>
        business.id === editForm.id ? { ...editForm } : business
      )
    );
    setSelectedBusinessId(editForm.id);
    setViewMode('detail');
  };

  const columns: Column<Business>[] = [
    {
      key: 'id',
      header: 'Mã cơ sở',
      render: (business) => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>
          {business.id}
        </span>
      ),
    },
    {
      key: 'name',
      header: 'Tên cơ sở',
      render: (business) => <span style={{ fontWeight: 600 }}>{business.name}</span>,
    },
    { key: 'category', header: 'Loại hình' },
    { key: 'district', header: 'Quận/Huyện' },
    {
      key: 'license',
      header: 'Số giấy phép',
      render: (business) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{business.license}</span>
      ),
    },
    {
      key: 'expiry',
      header: 'Ngày hết hạn',
      render: (business) => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{business.expiry}</span>
      ),
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (business) => <StatusBadge variant={business.status} />,
    },
    {
      key: 'lastInspection',
      header: 'Thanh tra cuối',
      render: (business) => (
        <span style={{ fontSize: '12px', color: '#555' }}>{business.lastInspection}</span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (business) => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <GovBtn
            variant="secondary"
            size="sm"
            title="Xem chi tiết"
            onClick={() => openDetail(business)}
          >
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
          <GovBtn
            variant="outline"
            size="sm"
            title="Chỉnh sửa"
            onClick={() => openEdit(business)}
          >
            <Pencil style={{ width: 12, height: 12 }} />
          </GovBtn>
          <GovBtn variant="danger" size="sm" title="Xóa">
            <Trash2 style={{ width: 12, height: 12 }} />
          </GovBtn>
        </div>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý cơ sở kinh doanh thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Danh sách cơ sở đã đăng ký"
        actions={
          <>
            <GovBtn variant="secondary">
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer style={{ width: 12, height: 12 }} /> In báo cáo
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
            </GovBtn>
            <GovBtn variant="primary">
              <Plus style={{ width: 12, height: 12 }} /> Thêm mới
            </GovBtn>
          </>
        }
      />

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4,1fr)',
          gap: '10px',
          marginBottom: '12px',
        }}
      >
        <MiniStat label="Tổng cơ sở ATTP" value="1.842" color="neutral" />
        <MiniStat label="Đang hoạt động" value="1.673" color="green" note="90,8% tỷ lệ" />
        <MiniStat label="Tạm đình chỉ" value="89" color="orange" note="5 tuần này" />
        <MiniStat label="Hết hạn giấy phép" value="80" color="red" note="Cần gia hạn" />
      </div>

      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput
            placeholder="Tên cơ sở, mã cơ sở..."
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
              { value: 'active', label: 'Đang hoạt động' },
              { value: 'suspended', label: 'Tạm đình chỉ' },
              { value: 'pending', label: 'Chờ xử lý' },
              { value: 'expired', label: 'Hết hạn' },
            ]}
            width={160}
          />
        </FilterField>
        <FilterField label="Quận/Huyện">
          <GovSelect
            value={districtFilter}
            onChange={setDistrictFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              ...districts.map((district) => ({ value: district, label: district })),
            ]}
            width={160}
          />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn
            variant="secondary"
            onClick={() => {
              setSearch('');
              setStatusFilter('');
              setDistrictFilter('');
            }}
          >
            Xóa bộ lọc
          </GovBtn>
        </div>
      </FilterBar>

      {viewMode === 'list' || !selectedBusiness ? (
        <SectionCard
          title={`Danh sách cơ sở kinh doanh thực phẩm (${filtered.length} cơ sở)`}
          footer={<GovPagination info={`Hiển thị ${filtered.length} / 1.842 cơ sở`} />}
        >
          <DataTable
            columns={columns}
            data={filtered}
            emptyMessage="Không tìm thấy cơ sở kinh doanh nào khớp với điều kiện tìm kiếm."
          />
        </SectionCard>
      ) : viewMode === 'detail' ? (
        <SectionCard
          title={`Chi tiết cơ sở kinh doanh: ${selectedBusiness.name}`}
          actions={
            <>
              <GovBtn variant="outline" onClick={() => openEdit(selectedBusiness)}>
                <Pencil style={{ width: 12, height: 12 }} /> Chỉnh sửa
              </GovBtn>
              <GovBtn variant="secondary" onClick={closePanel}>
                <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại danh sách
              </GovBtn>
            </>
          }
        >
          <div style={{ padding: '14px' }}>
            <div
              style={{
                border: '1px solid #CFE6CF',
                background: 'linear-gradient(135deg, #F4FBF4 0%, #FFFFFF 100%)',
                padding: '18px',
                marginBottom: '14px',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '16px',
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span
                      style={{
                        fontFamily: 'monospace',
                        fontWeight: 700,
                        fontSize: '12px',
                        color: '#005A9E',
                        background: '#EAF3FB',
                        border: '1px solid #C7DDF0',
                        padding: '4px 8px',
                      }}
                    >
                      {selectedBusiness.id}
                    </span>
                    <StatusBadge variant={selectedBusiness.status} />
                  </div>
                  <h2 style={{ margin: '0 0 6px', fontSize: '22px', fontWeight: 800, color: '#1F2937' }}>
                    {selectedBusiness.name}
                  </h2>
                  <p style={{ margin: 0, fontSize: '13px', color: '#555' }}>
                    Hồ sơ tổng quan của cơ sở kinh doanh, tình trạng pháp lý và lịch sử thanh tra liên quan.
                  </p>
                </div>

                <div
                  style={{
                    minWidth: '260px',
                    border: '1px solid #D6E8D6',
                    background: '#fff',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <CheckCircle2 style={{ width: 16, height: 16, color: '#008000' }} />
                    <span style={{ fontSize: '12px', fontWeight: 700, color: '#006400', textTransform: 'uppercase' }}>
                      Đánh giá nhanh
                    </span>
                  </div>
                  <div style={{ fontSize: '13px', color: '#222', lineHeight: 1.6 }}>
                    <div>Giấy phép: <strong>{selectedBusiness.license}</strong></div>
                    <div>Hạn hiệu lực: <strong>{selectedBusiness.expiry}</strong></div>
                    <div>
                      Vi phạm đang theo dõi: <strong>{relatedViolations.filter((item) => item.status !== 'resolved').length}</strong>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '14px',
                marginBottom: '14px',
              }}
            >
              <SectionCard title="Thông tin nhận diện">
                <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
                  <DetailItem
                    label="Tên cơ sở"
                    value={selectedBusiness.name}
                    icon={<Building2 style={{ width: 12, height: 12 }} />}
                  />
                  <DetailItem
                    label="Mã cơ sở"
                    value={<span style={{ fontFamily: 'monospace' }}>{selectedBusiness.id}</span>}
                    icon={<Building2 style={{ width: 12, height: 12 }} />}
                  />
                  <DetailItem label="Loại hình" value={selectedBusiness.category} />
                  <DetailItem label="Quận/Huyện" value={selectedBusiness.district} />
                </div>
              </SectionCard>

              <SectionCard title="Tình trạng pháp lý">
                <div style={{ padding: '14px', display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '10px' }}>
                  <DetailItem
                    label="Số giấy phép"
                    value={<span style={{ fontFamily: 'monospace' }}>{selectedBusiness.license}</span>}
                    icon={<FileClock style={{ width: 12, height: 12 }} />}
                  />
                  <DetailItem
                    label="Ngày hết hạn"
                    value={<span style={{ fontFamily: 'monospace' }}>{selectedBusiness.expiry}</span>}
                    icon={<CalendarDays style={{ width: 12, height: 12 }} />}
                  />
                  <DetailItem label="Trạng thái hồ sơ" value={<StatusBadge variant={selectedBusiness.status} />} />
                  <DetailItem
                    label="Thanh tra cuối"
                    value={<span style={{ fontFamily: 'monospace' }}>{selectedBusiness.lastInspection}</span>}
                    icon={<CalendarDays style={{ width: 12, height: 12 }} />}
                  />
                </div>
              </SectionCard>
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1.15fr 0.85fr',
                gap: '14px',
              }}
            >
              <SectionCard title="Lịch sử thanh tra liên quan">
                <div style={{ padding: '14px' }}>
                  {relatedInspections.length > 0 ? (
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {relatedInspections.slice(0, 3).map((inspection) => (
                        <div
                          key={inspection.id}
                          style={{
                            border: '1px solid #D6D6D6',
                            background: '#FAFAFA',
                            padding: '12px 14px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: '12px',
                              alignItems: 'center',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#005A9E', fontSize: '12px' }}>
                                {inspection.id}
                              </span>
                              <StatusBadge variant={inspection.result} />
                            </div>
                            <span style={{ fontSize: '12px', color: '#555' }}>{inspection.date}</span>
                          </div>
                          <div style={{ fontSize: '13px', color: '#222', lineHeight: 1.6 }}>
                            <div>Loại kiểm tra: <strong>{inspection.type}</strong></div>
                            <div>Thanh tra viên: <strong>{inspection.inspector}</strong></div>
                            <div>Điểm đánh giá: <strong>{inspection.score}/100</strong></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyPanel message="Chưa có lịch sử thanh tra nào được liên kết với cơ sở này." />
                  )}
                </div>
              </SectionCard>

              <SectionCard title="Vi phạm liên quan">
                <div style={{ padding: '14px' }}>
                  {relatedViolations.length > 0 ? (
                    <div style={{ display: 'grid', gap: '10px' }}>
                      {relatedViolations.slice(0, 3).map((violation) => (
                        <div
                          key={violation.id}
                          style={{
                            border: '1px solid #D6D6D6',
                            background: violation.status === 'resolved' ? '#FAFAFA' : '#FFF8F0',
                            padding: '12px 14px',
                          }}
                        >
                          <div
                            style={{
                              display: 'flex',
                              justifyContent: 'space-between',
                              gap: '10px',
                              alignItems: 'center',
                              marginBottom: '8px',
                              flexWrap: 'wrap',
                            }}
                          >
                            <span style={{ fontFamily: 'monospace', fontWeight: 700, color: '#B45309', fontSize: '12px' }}>
                              {violation.id}
                            </span>
                            <ApprovalBadge />
                          </div>
                          <div style={{ fontSize: '13px', color: '#222', lineHeight: 1.6 }}>
                            <div>
                              <AlertTriangle style={{ width: 13, height: 13, display: 'inline-block', marginRight: '6px', color: '#CC6600', verticalAlign: 'text-bottom' }} />
                              <strong>{violation.type}</strong>
                            </div>
                            <div>Mức độ: <strong>{violation.severity}</strong></div>
                            <div>Ngày lập biên bản: <strong>{violation.date}</strong></div>
                            <div>Mức phạt: <strong>{violation.penalty}</strong></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <EmptyPanel message="Không có vi phạm nào đang được ghi nhận cho cơ sở này." />
                  )}
                </div>
              </SectionCard>
            </div>

            {latestInspection && (
              <div style={{ marginTop: '14px' }}>
                <SectionCard title="Gợi ý thông tin nên xem nhanh">
                  <div style={{ padding: '14px', fontSize: '13px', color: '#333', lineHeight: 1.7 }}>
                    <div>
                      Cơ sở này được kiểm tra gần nhất vào <strong>{latestInspection.date}</strong>, kết quả{' '}
                      <strong>{latestInspection.result === 'pass' ? 'đạt' : latestInspection.result === 'fail' ? 'không đạt' : 'đã lên lịch'}</strong>.
                    </div>
                    <div>
                      Khi tra cứu từ màn danh sách, nhóm thông tin nên ưu tiên là: trạng thái hoạt động, giấy phép còn hạn hay không, lần thanh tra gần nhất và vi phạm chưa xử lý.
                    </div>
                  </div>
                </SectionCard>
              </div>
            )}
          </div>
        </SectionCard>
      ) : editForm ? (
        <SectionCard
          title={`Chỉnh sửa cơ sở kinh doanh: ${editForm.name}`}
          actions={
            <>
              <GovBtn variant="secondary" onClick={cancelEdit}>
                <ArrowLeft style={{ width: 12, height: 12 }} /> Hủy chỉnh sửa
              </GovBtn>
              <GovBtn variant="primary" onClick={saveEdit}>
                <CheckCircle2 style={{ width: 12, height: 12 }} /> Lưu cập nhật
              </GovBtn>
            </>
          }
        >
          <div style={{ padding: '14px' }}>
            <div
              style={{
                border: '1px solid #D6D6D6',
                background: '#F8FBF8',
                padding: '14px',
                marginBottom: '14px',
                fontSize: '13px',
                color: '#444',
                lineHeight: 1.6,
              }}
            >
              Chỉnh sửa nhanh các thông tin đang hiển thị trên danh sách: tên cơ sở, loại hình, khu vực,
              giấy phép, trạng thái và ngày thanh tra gần nhất.
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                gap: '14px',
              }}
            >
              <SectionCard title="Thông tin cơ sở">
                <div style={{ padding: '14px', display: 'grid', gap: '12px' }}>
                  <FilterField label="Mã cơ sở">
                    <GovInput value={editForm.id} onChange={() => {}} width="100%" />
                  </FilterField>
                  <FilterField label="Tên cơ sở">
                    <GovInput
                      value={editForm.name}
                      onChange={(value) =>
                        setEditForm((current) => (current ? { ...current, name: value } : current))
                      }
                      width="100%"
                    />
                  </FilterField>
                  <FilterField label="Loại hình">
                    <GovInput
                      value={editForm.category}
                      onChange={(value) =>
                        setEditForm((current) => (current ? { ...current, category: value } : current))
                      }
                      width="100%"
                    />
                  </FilterField>
                  <FilterField label="Quận/Huyện">
                    <GovSelect
                      value={editForm.district}
                      onChange={(value) =>
                        setEditForm((current) => (current ? { ...current, district: value } : current))
                      }
                      options={districts.map((district) => ({ value: district, label: district }))}
                      width="100%"
                    />
                  </FilterField>
                </div>
              </SectionCard>

              <SectionCard title="Pháp lý và vận hành">
                <div style={{ padding: '14px', display: 'grid', gap: '12px' }}>
                  <FilterField label="Số giấy phép">
                    <GovInput
                      value={editForm.license}
                      onChange={(value) =>
                        setEditForm((current) => (current ? { ...current, license: value } : current))
                      }
                      width="100%"
                    />
                  </FilterField>
                  <FilterField label="Ngày hết hạn">
                    <GovInput
                      value={editForm.expiry}
                      onChange={(value) =>
                        setEditForm((current) => (current ? { ...current, expiry: value } : current))
                      }
                      width="100%"
                    />
                  </FilterField>
                  <FilterField label="Trạng thái">
                    <GovSelect
                      value={editForm.status}
                      onChange={(value) =>
                        setEditForm((current) =>
                          current ? { ...current, status: value as Business['status'] } : current
                        )
                      }
                      options={[
                        { value: 'active', label: 'Đang hoạt động' },
                        { value: 'suspended', label: 'Tạm đình chỉ' },
                        { value: 'pending', label: 'Chờ xử lý' },
                        { value: 'expired', label: 'Hết hạn' },
                      ]}
                      width="100%"
                    />
                  </FilterField>
                  <FilterField label="Thanh tra cuối">
                    <GovInput
                      value={editForm.lastInspection}
                      onChange={(value) =>
                        setEditForm((current) =>
                          current ? { ...current, lastInspection: value } : current
                        )
                      }
                      width="100%"
                    />
                  </FilterField>
                </div>
              </SectionCard>
            </div>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
