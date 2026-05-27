"use client";

import { useState } from 'react';
import { tieuChiDanhGiaApi } from '@/api/api';
import { Plus, Eye, Pencil, RefreshCw, FileSpreadsheet } from 'lucide-react';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import DataTable, { Column } from '@/components/DataTable';

interface TieuChi {
  id: string;
  name: string;
  category: string;
  maxScore: number;
  weight: string;
  status: 'active' | 'draft' | 'archived';
  issuedDate: string;
  issuedBy: string;
  description: string;
}

type ViewMode = 'list' | 'detail' | 'edit';

const mockTieuChi: TieuChi[] = [
  {
    id: 'TC-001',
    name: 'Vệ sinh cơ sở vật chất',
    category: 'Điều kiện vệ sinh',
    maxScore: 30,
    weight: '30%',
    status: 'active',
    issuedDate: '01/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Đánh giá điều kiện vệ sinh khu vực chế biến, bảo quản và phục vụ thực phẩm.',
  },
  {
    id: 'TC-002',
    name: 'An toàn thực phẩm trong chế biến',
    category: 'Quy trình chế biến',
    maxScore: 25,
    weight: '25%',
    status: 'active',
    issuedDate: '01/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Kiểm tra quy trình chế biến thực phẩm, nhiệt độ bảo quản và phân tách thực phẩm sống/chín.',
  },
  {
    id: 'TC-003',
    name: 'Hồ sơ pháp lý và chứng nhận',
    category: 'Pháp lý',
    maxScore: 20,
    weight: '20%',
    status: 'active',
    issuedDate: '01/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Xác minh giấy phép kinh doanh, chứng nhận ATTP và sổ sức khỏe nhân viên.',
  },
  {
    id: 'TC-004',
    name: 'Nguồn gốc nguyên liệu',
    category: 'Truy xuất nguồn gốc',
    maxScore: 15,
    weight: '15%',
    status: 'active',
    issuedDate: '01/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Kiểm tra hóa đơn, hợp đồng và nhật ký nhập hàng đảm bảo truy xuất nguồn gốc nguyên liệu.',
  },
  {
    id: 'TC-005',
    name: 'Đào tạo và tập huấn ATTP',
    category: 'Nhân sự',
    maxScore: 10,
    weight: '10%',
    status: 'active',
    issuedDate: '01/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Xác nhận nhân viên đã được đào tạo kiến thức ATTP và có chứng chỉ hợp lệ.',
  },
  {
    id: 'TC-006',
    name: 'Xử lý rác thải và nước thải',
    category: 'Môi trường',
    maxScore: 0,
    weight: 'Dự thảo',
    status: 'draft',
    issuedDate: '15/01/2025',
    issuedBy: 'Chi cục ATTP',
    description: 'Đánh giá hệ thống xử lý rác thải thực phẩm và nước thải đảm bảo tiêu chuẩn môi trường.',
  },
];

const categoryColors: Record<string, { bg: string; color: string; border: string }> = {
  'Điều kiện vệ sinh': { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
  'Quy trình chế biến': { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
  'Pháp lý': { bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  'Truy xuất nguồn gốc': { bg: '#F0E8FA', color: '#6200CC', border: '#D4A8F5' },
  'Nhân sự': { bg: '#F0F0F0', color: '#555', border: '#CCC' },
  'Môi trường': { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
};

const statusVariant: Record<TieuChi['status'], string> = {
  active: 'active',
  draft: 'pending',
  archived: 'expired',
};

const statusLabel: Record<TieuChi['status'], string> = {
  active: 'Đang áp dụng',
  draft: 'Bản nháp',
  archived: 'Lưu trữ',
};

function DetailField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div style={{ border: '1px solid #CBD5E1', background: '#F8FAFC', padding: '12px' }}>
      <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>
        {label}
      </p>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#0F172A', lineHeight: 1.7 }}>
        {value}
      </div>
    </div>
  );
}

export default function TieuChiDanhGiaPage() {
  const [data, setData] = useState<TieuChi[]>(mockTieuChi);
  const [maTieuChi, setMaTieuChi] = useState('');
  const [tenTieuChi, setTenTieuChi] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<TieuChi | null>(null);

  const filtered = data.filter((tc) => {
    const matchMa =
      !maTieuChi || tc.id.toLowerCase().includes(maTieuChi.toLowerCase());
    const matchTen =
      !tenTieuChi || tc.name.toLowerCase().includes(tenTieuChi.toLowerCase());
    const matchStatus = !statusFilter || tc.status === statusFilter;
    const matchCategory = !categoryFilter || tc.category === categoryFilter;
    return matchMa && matchTen && matchStatus && matchCategory;
  });

  const selectedTieuChi = selectedId ? data.find((item) => item.id === selectedId) ?? null : null;
  const activeCount = data.filter((tc) => tc.status === 'active').length;
  const totalScore = data.filter((tc) => tc.status === 'active').reduce((sum, tc) => sum + tc.maxScore, 0);

  const openDetail = (item: TieuChi) => {
    setSelectedId(item.id);
    setEditForm(null);
    setViewMode('detail');
  };

  const openEdit = (item: TieuChi) => {
    setSelectedId(item.id);
    setEditForm({ ...item });
    setViewMode('edit');
  };

  const openCreate = () => {
    setEditForm({
      id: '',
      name: '',
      category: '',
      maxScore: 0,
      weight: '',
      status: 'draft',
      issuedDate: '',
      issuedBy: '',
      description: '',
    });
    setViewMode('create');
  };

  const closeView = () => {
    setSelectedId(null);
    setEditForm(null);
    setViewMode('list');
  };

  const saveEdit = () => {
    if (!editForm) {
      return;
    }

    setData((current) => current.map((item) => (item.id === editForm.id ? editForm : item)));
    setSelectedId(editForm.id);
    setViewMode('detail');
  };

  const saveCreate = async () => {
    if (!editForm) return;

    try {
      const req = {
        maTieuChi: editForm.id,
        tenTieuChi: editForm.name,
        nhom: editForm.category,
        thuTu: editForm.maxScore ?? 0,
      };

      const created = await tieuChiDanhGiaApi.create(req);

      // Append to local data for immediate feedback
      setData((current) => [
        {
          id: created.maTieuChi,
          name: created.tenTieuChi,
          category: created.nhom ?? '',
          maxScore: created.thuTu ?? 0,
          weight: '',
          status: 'active',
          issuedDate: '',
          issuedBy: '',
          description: '',
        },
        ...current,
      ]);

      setViewMode('list');
    } catch (err) {
      // Basic error handling — show console for now
      // In production, surface to user via toast
      // eslint-disable-next-line no-console
      console.error('Failed to create tiêu chí', err);
      alert((err as Error)?.message || 'Tạo tiêu chí thất bại');
    }
  };

  const columns: Column<TieuChi>[] = [
    {
      key: 'id',
      header: 'Mã TC',
      render: (row) => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{row.id}</span>,
    },
    {
      key: 'name',
      header: 'Tên tiêu chí',
      render: (row) => (
        <div>
          <p style={{ fontWeight: 600, fontSize: '13px', color: '#222' }}>{row.name}</p>
          <p style={{ fontSize: '11px', color: '#888', marginTop: '2px' }}>{row.description}</p>
        </div>
      ),
    },
    {
      key: 'category',
      header: 'Nhóm',
      render: (row) => {
        const cfg = categoryColors[row.category] ?? { bg: '#F0F0F0', color: '#555', border: '#CCC' };
        return (
          <span
            style={{
              display: 'inline-block',
              padding: '1px 7px',
              borderRadius: '2px',
              border: `1px solid ${cfg.border}`,
              background: cfg.bg,
              color: cfg.color,
              fontSize: '11px',
              fontWeight: 500,
            }}
          >
            {row.category}
          </span>
        );
      },
    },
    {
      key: 'maxScore',
      header: 'Điểm tối đa',
      render: (row) => (
        <div style={{ textAlign: 'center' }}>
          <span style={{ fontSize: '16px', fontWeight: 700, color: row.status === 'active' ? '#006400' : '#888' }}>
            {row.status === 'active' ? row.maxScore : '—'}
          </span>
          <p style={{ fontSize: '10px', color: '#888' }}>{row.weight}</p>
        </div>
      ),
    },
    {
      key: 'issuedDate',
      header: 'Ngày ban hành',
      render: (row) => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{row.issuedDate}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (row) => <StatusBadge variant={statusVariant[row.status]} label={statusLabel[row.status]} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (row) => (
        <ActionButtons>
          <GovBtn variant="secondary" size="sm" title="Xem chi tiết" onClick={() => openDetail(row)}>
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
          <GovBtn variant="outline" size="sm" title="Chỉnh sửa" onClick={() => openEdit(row)}>
            <Pencil style={{ width: 12, height: 12 }} />
          </GovBtn>
        </ActionButtons>
      ),
    },
  ];

  if (viewMode === 'detail' && selectedTieuChi) {
    return (
      <div>
        <PageHeader
          title="Chi tiết tiêu chí đánh giá"
          subtitle="Xem thông tin chi tiết ngay trong cùng màn hình, không mở popup."
          actions={
            <ActionButtons>
              <GovBtn variant="secondary" onClick={closeView}>Quay lại danh sách</GovBtn>
              <GovBtn variant="outline" onClick={() => openEdit(selectedTieuChi)}>
                <Pencil style={{ width: 12, height: 12 }} /> Chỉnh sửa
              </GovBtn>
            </ActionButtons>
          }
        />

        <SectionCard title={`Tiêu chí ${selectedTieuChi.id}`}>
          <div style={{ padding: '12px', display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <DetailField label="Mã tiêu chí" value={<span style={{ fontFamily: 'monospace' }}>{selectedTieuChi.id}</span>} />
              <DetailField label="Trạng thái" value={<StatusBadge variant={statusVariant[selectedTieuChi.status]} label={statusLabel[selectedTieuChi.status]} />} />
              <DetailField label="Tên tiêu chí" value={selectedTieuChi.name} />
              <DetailField label="Nhóm tiêu chí" value={selectedTieuChi.category} />
              <DetailField label="Điểm tối đa" value={selectedTieuChi.maxScore} />
              <DetailField label="Trọng số" value={selectedTieuChi.weight} />
              <DetailField label="Ngày ban hành" value={selectedTieuChi.issuedDate} />
              <DetailField label="Ban hành bởi" value={selectedTieuChi.issuedBy} />
            </div>

            <DetailField label="Mô tả tiêu chí" value={selectedTieuChi.description} />
          </div>
        </SectionCard>
      </div>
    );
  }

  if ((viewMode === 'edit' || viewMode === 'create') && editForm) {
    const isCreate = viewMode === 'create';
    return (
      <div>
        <PageHeader
          title={isCreate ? 'Ban hành tiêu chí mới' : 'Chỉnh sửa tiêu chí đánh giá'}
          subtitle={isCreate ? 'Tạo tiêu chí mới và lưu vào hệ thống.' : 'Cập nhật thông tin ngay trong cùng màn hình, không mở popup.'}
          actions={
            <ActionButtons>
              <GovBtn variant="secondary" onClick={() => (isCreate ? closeView() : (selectedTieuChi ? setViewMode('detail') : closeView()))}>
                Hủy
              </GovBtn>
              <GovBtn variant="primary" onClick={isCreate ? saveCreate : saveEdit}>{isCreate ? 'Ban hành tiêu chí' : 'Lưu cập nhật'}</GovBtn>
            </ActionButtons>
          }
        />

        <SectionCard title={`Biểu mẫu chỉnh sửa ${editForm.id}`}>
          <div style={{ padding: '12px', display: 'grid', gap: '12px' }}>
            <div style={{ display: 'grid', gap: '12px', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))' }}>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>Mã tiêu chí</p>
                <GovInput value={editForm.id} onChange={(value) => setEditForm((current) => (current ? { ...current, id: value } : current))} width="100%" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>Tên tiêu chí</p>
                <GovInput value={editForm.name} onChange={(value) => setEditForm((current) => (current ? { ...current, name: value } : current))} width="100%" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>Nhóm tiêu chí</p>
                <GovInput value={editForm.category} onChange={(value) => setEditForm((current) => (current ? { ...current, category: value } : current))} width="100%" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>Điểm tối đa</p>
                <GovInput value={String(editForm.maxScore)} onChange={(value) => setEditForm((current) => (current ? { ...current, maxScore: Number(value) || 0 } : current))} width="100%" type="number" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>Trọng số</p>
                <GovInput value={editForm.weight} onChange={(value) => setEditForm((current) => (current ? { ...current, weight: value } : current))} width="100%" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>Trạng thái</p>
                <GovSelect
                  value={editForm.status}
                  onChange={(value) => setEditForm((current) => (current ? { ...current, status: value as TieuChi['status'] } : current))}
                  options={[
                    { value: 'active', label: 'Đang áp dụng' },
                    { value: 'draft', label: 'Bản nháp' },
                    { value: 'archived', label: 'Lưu trữ' },
                  ]}
                  width="100%"
                />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>Ngày ban hành</p>
                <GovInput value={editForm.issuedDate} onChange={(value) => setEditForm((current) => (current ? { ...current, issuedDate: value } : current))} width="100%" />
              </div>
              <div>
                <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>Ban hành bởi</p>
                <GovInput value={editForm.issuedBy} onChange={(value) => setEditForm((current) => (current ? { ...current, issuedBy: value } : current))} width="100%" />
              </div>
            </div>

            <div>
              <p style={{ fontSize: '11px', fontWeight: 700, textTransform: 'uppercase', color: '#64748B', marginBottom: '6px' }}>Mô tả tiêu chí</p>
              <textarea
                value={editForm.description}
                onChange={(event) => setEditForm((current) => (current ? { ...current, description: event.target.value } : current))}
                rows={5}
                style={{
                  width: '100%',
                  border: '1px solid #D6D6D6',
                  borderRadius: '2px',
                  padding: '10px 12px',
                  background: '#fff',
                  fontSize: '13px',
                  color: '#222',
                  resize: 'vertical',
                  outline: 'none',
                }}
              />
            </div>
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Tiêu chí đánh giá ATVSTP"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Ban hành và quản lý tiêu chí đánh giá an toàn vệ sinh thực phẩm"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            <GovBtn variant="primary" onClick={openCreate}><Plus style={{ width: 12, height: 12 }} /> Ban hành tiêu chí mới</GovBtn>
          </ActionButtons>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng tiêu chí" value={data.length} color="neutral" />
        <MiniStat label="Đang áp dụng" value={activeCount} color="green" />
        <MiniStat label="Tổng điểm tối đa" value={`${totalScore}/100`} color="blue" />
        <MiniStat label="Bản nháp" value={data.filter((tc) => tc.status === 'draft').length} color="orange" />
      </div>

      <FilterBar>
        <FilterField label="Mã tiêu chí">
          <GovInput placeholder="VD: TC001" value={maTieuChi} onChange={setMaTieuChi} width={160} />
        </FilterField>
        <FilterField label="Tên tiêu chí">
          <GovInput placeholder="Tên tiêu chí" value={tenTieuChi} onChange={setTenTieuChi} width={240} />
        </FilterField>
        <FilterField label="Nhóm tiêu chí">
          <GovSelect
            value={categoryFilter}
            onChange={setCategoryFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              ...Object.keys(categoryColors).map((category) => ({ value: category, label: category })),
            ]}
            width={180}
          />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              { value: 'active', label: 'Đang áp dụng' },
              { value: 'draft', label: 'Bản nháp' },
              { value: 'archived', label: 'Lưu trữ' },
            ]}
            width={160}
          />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn
            variant="secondary"
            onClick={() => {
              setMaTieuChi('');
              setTenTieuChi('');
              setStatusFilter('');
              setCategoryFilter('');
            }}
          >
            Xóa lọc
          </GovBtn>
        </div>
      </FilterBar>

      <SectionCard title="Cơ cấu phân bổ điểm đánh giá hiện hành">
        <div style={{ padding: '10px 12px' }}>
          <div style={{ display: 'flex', height: '16px', borderRadius: '2px', overflow: 'hidden', gap: '2px', marginBottom: '10px' }}>
            {data.filter((tc) => tc.status === 'active').map((tc, index) => {
              const colors = ['#008000', '#005A9E', '#CC6600', '#6200CC', '#555'];
              return (
                <div
                  key={tc.id}
                  style={{ flex: tc.maxScore, background: colors[index % colors.length], height: '100%' }}
                  title={`${tc.name}: ${tc.maxScore} điểm`}
                />
              );
            })}
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px' }}>
            {data.filter((tc) => tc.status === 'active').map((tc, index) => {
              const colors = ['#008000', '#005A9E', '#CC6600', '#6200CC', '#555'];
              return (
                <div key={tc.id} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: 10, height: 10, borderRadius: '1px', background: colors[index % colors.length], flexShrink: 0 }} />
                  <span style={{ fontSize: '12px', color: '#555' }}>{tc.name}</span>
                  <span style={{ fontSize: '12px', fontWeight: 600, color: '#222' }}>{tc.maxScore} điểm</span>
                </div>
              );
            })}
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title={`Danh sách tiêu chí đánh giá (${filtered.length} tiêu chí)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${data.length} tiêu chí`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy tiêu chí nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}
