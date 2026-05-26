'use client';

import { useCallback, useEffect, useState } from 'react';
import Link from 'next/link';
import { Eye, Pencil, FileSpreadsheet, RefreshCw, Plus, Globe, Lock } from 'lucide-react';
import { thongBaoApi, ThongBaoItem } from '@/api/thongbao';
import DataTable, { type Column } from '@/components/DataTable';
import {
  PageHeader, FilterBar, FilterField, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

// ─── helpers ────────────────────────────────────────────────────
const LOAI_OPTIONS = [
  { value: '',         label: '-- Tất cả loại --' },
  { value: 'KHAN_CAP', label: 'Khẩn cấp' },
  { value: 'THONG_BAO', label: 'Thông báo' },
  { value: 'HUONG_DAN', label: 'Hướng dẫn' },
];

const CONG_DONG_OPTIONS = [
  { value: '',      label: '-- Tất cả --' },
  { value: 'true',  label: 'Cộng đồng' },
  { value: 'false', label: 'Nội bộ' },
];

const LOAI_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  KHAN_CAP:   { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  THONG_BAO:  { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
  HUONG_DAN:  { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
};
const LOAI_LABEL: Record<string, string> = {
  KHAN_CAP:  'Khẩn cấp',
  THONG_BAO: 'Thông báo',
  HUONG_DAN: 'Hướng dẫn',
};

function formatDate(iso: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
  } catch { return iso; }
}

function TypeChip({ loai }: { loai: string }) {
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
export default function ThongBaoPage() {
  const [loai, setLoai]               = useState('');
  const [congDong, setCongDong]       = useState('');
  const [page, setPage]               = useState(0);

  const [items, setItems]             = useState<ThongBaoItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages]   = useState(0);
  const [loading, setLoading]         = useState(false);
  const [error, setError]             = useState<string | null>(null);

  const congDongCount = items.filter(i => i.isCongDong).length;
  const noiBoCount    = items.filter(i => !i.isCongDong).length;

  const fetchData = useCallback(async (p = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await thongBaoApi.search({
        loai:      loai || undefined,
        isCongDong: congDong === '' ? undefined : congDong === 'true',
        page: p,
        size: PAGE_SIZE,
        sort: ['ngayGui,desc'],
      });
      setItems(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách thông báo.');
    } finally {
      setLoading(false);
    }
  }, [loai, congDong]);

  useEffect(() => { fetchData(0); setPage(0); }, [fetchData]);

  const handleSearch = () => { setPage(0); fetchData(0); };
  const handleReset  = () => { setLoai(''); setCongDong(''); };
  const handlePageChange = (p: number) => { setPage(p); fetchData(p); };

  const columns: Column<ThongBaoItem>[] = [
    {
      key: 'maThongBao',
      header: 'Mã thông báo',
      render: r => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E', fontSize: '12px' }}>
          {r.maThongBao}
        </span>
      ),
    },
    {
      key: 'tieuDe',
      header: 'Tiêu đề',
      render: r => <span style={{ fontWeight: 600, fontSize: '12px' }}>{r.tieuDe}</span>,
    },
    {
      key: 'loaiThongBao',
      header: 'Loại',
      render: r => <TypeChip loai={r.loaiThongBao} />,
    },
    {
      key: 'isCongDong',
      header: 'Phạm vi',
      render: r => r.isCongDong
        ? <StatusBadge variant="active" label="Cộng đồng" />
        : <StatusBadge variant="pending" label="Nội bộ" />,
    },
    {
      key: 'ngayGui',
      header: 'Ngày gửi',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{formatDate(r.ngayGui)}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <ActionButtons>
          <Link href={`/truyen-thong/thong-bao/${r.maThongBao}`}>
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
        title="Quản lý thông báo công khai"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Gửi thông báo đến các cơ sở kinh doanh và cộng đồng"
        actions={
          <>
            <GovBtn variant="secondary" onClick={() => fetchData(page)} disabled={loading}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
            </GovBtn>
            <Link href="/truyen-thong/thong-bao/new">
              <GovBtn variant="primary">
                <Plus style={{ width: 12, height: 12 }} /> Tạo thông báo mới
              </GovBtn>
            </Link>
          </>
        }
      />

      {error && <AlertBanner type="error" title={error} />}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng thông báo" value={totalElements} color="neutral" />
        <MiniStat label="Cộng đồng"      value={congDongCount} color="green"   note="Hiển thị công khai" />
        <MiniStat label="Nội bộ"         value={noiBoCount}    color="blue"    />
        <MiniStat label="Trang hiện tại" value={items.length}  color="neutral" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Loại thông báo">
          <GovSelect value={loai} onChange={setLoai} options={LOAI_OPTIONS} width={180} />
        </FilterField>
        <FilterField label="Phạm vi">
          <GovSelect value={congDong} onChange={setCongDong} options={CONG_DONG_OPTIONS} width={160} />
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
        title={`Danh sách thông báo (${totalElements} bản ghi)`}
        footer={
          <GovPagination
            info={`Trang ${page + 1} / ${totalPages || 1} — ${totalElements} thông báo`}
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
          emptyMessage="Không tìm thấy thông báo nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}
