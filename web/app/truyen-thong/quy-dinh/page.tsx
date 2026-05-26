'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, FileSpreadsheet, RefreshCw, Plus } from 'lucide-react';
import { quyDinhApi, QuyDinhItem, TrangThaiQuyDinh } from '@/api/quidinh';
import DataTable, { type Column } from '@/components/DataTable';
import {
  PageHeader, FilterBar, FilterField, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

// ─── helpers ────────────────────────────────────────────────────
const TRANG_THAI_OPTIONS = [
  { value: '',             label: '-- Tất cả --' },
  { value: 'NHAP',        label: 'Bản nháp' },
  { value: 'HIEU_LUC',    label: 'Đang hiệu lực' },
  { value: 'HET_HIEU_LUC', label: 'Hết hiệu lực' },
];

const TRANG_THAI_VARIANT: Record<string, string> = {
  NHAP:         'pending',
  HIEU_LUC:     'active',
  HET_HIEU_LUC: 'expired',
};
const TRANG_THAI_LABEL: Record<string, string> = {
  NHAP:         'Bản nháp',
  HIEU_LUC:     'Đang hiệu lực',
  HET_HIEU_LUC: 'Hết hiệu lực',
};

const LOAI_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  QUY_DINH:   { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
  HUONG_DAN:  { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
  THONG_TU:   { bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  NGHI_DINH:  { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
};
const LOAI_LABEL: Record<string, string> = {
  QUY_DINH:  'Quy định',
  HUONG_DAN: 'Hướng dẫn',
  THONG_TU:  'Thông tư',
  NGHI_DINH: 'Nghị định',
};

function formatDate(d: string) {
  if (!d) return '—';
  try {
    return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return d; }
}

function LoaiChip({ loai }: { loai: string }) {
  const s = LOAI_STYLE[loai] ?? { bg: '#F0F0F0', color: '#555', border: '#CCC' };
  return (
    <span style={{
      display: 'inline-block', padding: '1px 7px', borderRadius: '2px',
      border: `1px solid ${s.border}`, background: s.bg, color: s.color,
      fontSize: '11px', fontWeight: 500, whiteSpace: 'nowrap',
    }}>
      {LOAI_LABEL[loai] ?? loai}
    </span>
  );
}

const PAGE_SIZE = 20;

// ─── component ──────────────────────────────────────────────────
export default function QuyDinhPage() {
  const [trangThai, setTrangThai]     = useState('');
  const [page, setPage]               = useState(0);

  const [items, setItems]             = useState<QuyDinhItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const hieuLucCount    = items.filter(i => i.trangThai === 'HIEU_LUC').length;
  const nhapCount       = items.filter(i => i.trangThai === 'NHAP').length;
  const hetHieuLucCount = items.filter(i => i.trangThai === 'HET_HIEU_LUC').length;

  const fetchData = useCallback(async (p = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await quyDinhApi.search({
        trangThai: trangThai as TrangThaiQuyDinh || undefined,
        page: p,
        size: PAGE_SIZE,
        sort: ['ngayBanHanh,desc'],
      });
      setItems(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách quy định.');
    } finally {
      setLoading(false);
    }
  }, [trangThai]);

  useEffect(() => { fetchData(0); setPage(0); }, [fetchData]);

  const handleSearch = () => { setPage(0); fetchData(0); };
  const handleReset  = () => setTrangThai('');
  const handlePageChange = (p: number) => { setPage(p); fetchData(p); };

  const columns: Column<QuyDinhItem>[] = [
    {
      key: 'maQuyDinh',
      header: 'Mã quy định',
      render: r => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E', fontSize: '12px' }}>
          {r.maQuyDinh}
        </span>
      ),
    },
    {
      key: 'tieuDe',
      header: 'Tiêu đề văn bản',
      render: r => <span style={{ fontWeight: 600, fontSize: '12px' }}>{r.tieuDe}</span>,
    },
    {
      key: 'loai',
      header: 'Loại văn bản',
      render: r => <LoaiChip loai={r.loai} />,
    },
    {
      key: 'ngayBanHanh',
      header: 'Ngày ban hành',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{formatDate(r.ngayBanHanh)}</span>,
    },
    {
      key: 'createdBy',
      header: 'Người tạo',
      render: r => <span style={{ fontSize: '12px', color: '#555' }}>{r.createdBy || '—'}</span>,
    },
    {
      key: 'trangThai',
      header: 'Trạng thái',
      render: r => (
        <StatusBadge
          variant={TRANG_THAI_VARIANT[r.trangThai] ?? 'pending'}
          label={TRANG_THAI_LABEL[r.trangThai] ?? r.trangThai}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <ActionButtons>
          <Link href={`/truyen-thong/quy-dinh/${r.maQuyDinh}`}>
            <GovBtn variant="secondary" size="sm" title="Xem & chỉnh sửa">
              <Eye style={{ width: 12, height: 12 }} />
            </GovBtn>
          </Link>
        </ActionButtons>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quy định pháp luật về ATTP"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Thư viện văn bản quy phạm pháp luật về an toàn thực phẩm"
        actions={
          <>
            <GovBtn variant="secondary" onClick={() => fetchData(page)} disabled={loading}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
            </GovBtn>
            <Link href="/truyen-thong/quy-dinh/new">
              <GovBtn variant="primary">
                <Plus style={{ width: 12, height: 12 }} /> Tạo quy định mới
              </GovBtn>
            </Link>
          </>
        }
      />

      {error && <AlertBanner type="error" title={error} />}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng văn bản"    value={totalElements}  color="neutral" />
        <MiniStat label="Đang hiệu lực"   value={hieuLucCount}   color="green"   />
        <MiniStat label="Bản nháp"        value={nhapCount}      color="orange"  />
        <MiniStat label="Hết hiệu lực"    value={hetHieuLucCount} color="neutral" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Trạng thái">
          <GovSelect value={trangThai} onChange={setTrangThai} options={TRANG_THAI_OPTIONS} width={200} />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary" onClick={handleSearch} disabled={loading}>
            {loading ? 'Đang tải...' : 'Tìm kiếm'}
          </GovBtn>
          <GovBtn variant="secondary" onClick={handleReset} disabled={loading}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách văn bản quy định (${totalElements} văn bản)`}
        footer={
          <GovPagination
            info={`Trang ${page + 1} / ${totalPages || 1} — ${totalElements} văn bản`}
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
          emptyMessage="Không tìm thấy văn bản quy định nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}
