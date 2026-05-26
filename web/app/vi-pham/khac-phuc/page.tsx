'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { Eye, RefreshCw, FileSpreadsheet } from 'lucide-react';
import { khacPhucApi, KhacPhucItem, TinhTrangKhacPhuc } from '@/api/khacphuc';
import DataTable, { type Column } from '@/components/DataTable';
import {
  PageHeader, SectionCard, GovBtn, GovInput, GovSelect,
  FilterBar, FilterField, MiniStat, StatusBadge, ActionButtons, GovPagination,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

// ─── helpers ────────────────────────────────────────────────────
const TINH_TRANG_OPTIONS = [
  { value: '',               label: '-- Tất cả --' },
  { value: 'CHUA_KHAC_PHUC', label: 'Chưa khắc phục' },
  { value: 'DANG_KHAC_PHUC', label: 'Đang khắc phục' },
  { value: 'DA_KHAC_PHUC',   label: 'Đã khắc phục' },
];

const TINH_TRANG_VARIANT: Record<string, string> = {
  CHUA_KHAC_PHUC: 'expired',
  DANG_KHAC_PHUC: 'in-progress',
  DA_KHAC_PHUC:   'active',
};
const TINH_TRANG_LABEL: Record<string, string> = {
  CHUA_KHAC_PHUC: 'Chưa khắc phục',
  DANG_KHAC_PHUC: 'Đang khắc phục',
  DA_KHAC_PHUC:   'Đã khắc phục',
};

function formatCurrency(amount: number) {
  if (!amount) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

const PAGE_SIZE = 20;

// ─── component ──────────────────────────────────────────────────
export default function KhacPhucListPage() {
  const [tinhTrang, setTinhTrang] = useState('');
  const [maViPham, setMaViPham]   = useState('');
  const [page, setPage]           = useState(0);

  const [items, setItems]               = useState<KhacPhucItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]     = useState(0);
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState<string | null>(null);

  // Stats (từ page hiện tại)
  const chuaKhacPhuc = items.filter(i => i.tinhTrangKhacPhuc === 'CHUA_KHAC_PHUC').length;
  const dangKhacPhuc = items.filter(i => i.tinhTrangKhacPhuc === 'DANG_KHAC_PHUC').length;
  const daKhacPhuc   = items.filter(i => i.tinhTrangKhacPhuc === 'DA_KHAC_PHUC').length;

  const fetchData = useCallback(async (currentPage = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await khacPhucApi.search({
        tinhTrang: tinhTrang as TinhTrangKhacPhuc || undefined,
        maViPham:  maViPham.trim() || undefined,
        page:      currentPage,
        size:      PAGE_SIZE,
      });
      setItems(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách khắc phục.');
    } finally {
      setLoading(false);
    }
  }, [tinhTrang, maViPham]);

  useEffect(() => { fetchData(0); setPage(0); }, [fetchData]);

  const handleSearch = () => { setPage(0); fetchData(0); };
  const handleReset  = () => { setTinhTrang(''); setMaViPham(''); };
  const handlePageChange = (p: number) => { setPage(p); fetchData(p); };

  const columns: Column<KhacPhucItem>[] = [
    {
      key: 'maHinhThucKhacPhuc',
      header: 'Mã khắc phục',
      render: r => (
        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', color: '#005A9E' }}>
          {r.maHinhThucKhacPhuc}
        </span>
      ),
    },
    {
      key: 'maViPham',
      header: 'Mã vi phạm',
      render: r => (
        <Link
          href={`/vi-pham/${r.maViPham}`}
          style={{ fontFamily: 'monospace', fontWeight: 600, fontSize: '12px', color: '#CC0000', textDecoration: 'none' }}
        >
          {r.maViPham}
        </Link>
      ),
    },
    {
      key: 'soTienKhacPhuc',
      header: 'Số tiền khắc phục',
      render: r => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600 }}>
          {formatCurrency(r.soTienKhacPhuc)}
        </span>
      ),
    },
    {
      key: 'noiDungKhacPhuc',
      header: 'Nội dung',
      render: r => (
        <span style={{ fontSize: '12px', color: r.noiDungKhacPhuc ? '#222' : '#999', fontStyle: r.noiDungKhacPhuc ? 'normal' : 'italic' }}>
          {r.noiDungKhacPhuc ?? '(Chưa có nội dung)'}
        </span>
      ),
    },
    {
      key: 'tinhTrangKhacPhuc',
      header: 'Tình trạng',
      render: r => (
        <StatusBadge
          variant={TINH_TRANG_VARIANT[r.tinhTrangKhacPhuc] ?? 'pending'}
          label={TINH_TRANG_LABEL[r.tinhTrangKhacPhuc] ?? r.tinhTrangKhacPhuc}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <Link href={`/vi-pham/khac-phuc/${r.maHinhThucKhacPhuc}`}>
          <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Theo dõi khắc phục vi phạm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Giám sát tiến độ thực hiện khắc phục của các cơ sở vi phạm"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => fetchData(page)} disabled={loading}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
            </GovBtn>
          </ActionButtons>
        }
      />

      {error && <AlertBanner type="error" title={error} />}

      {chuaKhacPhuc > 0 && (
        <AlertBanner
          type="warning"
          title={`Có ${chuaKhacPhuc} hình thức khắc phục chưa được thực hiện. Cần theo dõi và đôn đốc các cơ sở.`}
        />
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng hình thức KP"  value={totalElements}  color="neutral" />
        <MiniStat label="Chưa khắc phục"     value={chuaKhacPhuc}   color="red"    note="Cần đôn đốc" />
        <MiniStat label="Đang khắc phục"     value={dangKhacPhuc}   color="blue"   />
        <MiniStat label="Đã khắc phục"       value={daKhacPhuc}     color="green"  />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Mã vi phạm">
          <GovInput
            placeholder="VD: VP001"
            value={maViPham}
            onChange={setMaViPham}
            width={160}
          />
        </FilterField>
        <FilterField label="Tình trạng">
          <GovSelect
            value={tinhTrang}
            onChange={setTinhTrang}
            options={TINH_TRANG_OPTIONS}
            width={190}
          />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Đang tải...' : 'Tìm kiếm'}
          </GovBtn>
          <GovBtn variant="secondary" onClick={handleReset} disabled={loading}>
            Xóa bộ lọc
          </GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách hình thức khắc phục (${totalElements} bản ghi)`}
        footer={
          <GovPagination
            info={`Trang ${page + 1} / ${totalPages || 1} — ${totalElements} bản ghi`}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        }
      >
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          emptyMessage="Không tìm thấy hình thức khắc phục nào."
        />
      </SectionCard>
    </div>
  );
}