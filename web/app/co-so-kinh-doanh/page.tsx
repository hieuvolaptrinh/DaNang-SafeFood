'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Building2, Eye, FileSpreadsheet, Printer, RefreshCw,
  Search, X, ChevronLeft, ChevronRight,
} from 'lucide-react';
import DataTable, { type Column } from '@/components/DataTable';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect,
  GovBtn, SectionCard, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import {
  coSoKinhDoanhApi,
  type CoSoKinhDoanhItem,
  type CoSoKinhDoanhPageResponse,
} from '@/api/api';

// ─── Fallback data khi API offline ───────────────────────────────
const FALLBACK_ITEMS: CoSoKinhDoanhItem[] = [
  { maCoSo: 'CS-001', tenCoSo: 'Nhà hàng Hải Sản Biển Xanh', soGiayPhep: 'FSL-2024-0234', ngayHetHanGiayPhep: '2026-01-09', trangThai: 'HOAT_DONG', maPX: 'HC01', tenPhuongXa: 'Hải Châu 1', maChuSoHuu: 'U001', tenChuSoHuu: 'Nguyễn Văn An' },
  { maCoSo: 'CS-002', tenCoSo: 'Quán Ăn Gia Đình Việt',       soGiayPhep: 'FSL-2024-0099', ngayHetHanGiayPhep: '2025-02-14', trangThai: 'HET_HAN',   maPX: 'TK02', tenPhuongXa: 'Thanh Khê Đông', maChuSoHuu: 'U002', tenChuSoHuu: 'Trần Thị Bình' },
  { maCoSo: 'CS-003', tenCoSo: 'Cửa hàng Thực phẩm Organic',  soGiayPhep: 'FSL-2024-0087', ngayHetHanGiayPhep: '2026-03-19', trangThai: 'HOAT_DONG', maPX: 'NHS03', tenPhuongXa: 'Mỹ An', maChuSoHuu: 'U003', tenChuSoHuu: 'Phạm Văn Cường' },
  { maCoSo: 'CS-004', tenCoSo: 'Siêu thị Mini Mart Đà Nẵng',  soGiayPhep: 'FSL-2024-0198', ngayHetHanGiayPhep: '2026-01-04', trangThai: 'DINH_CHI',  maPX: 'ST04', tenPhuongXa: 'An Hải Bắc', maChuSoHuu: 'U004', tenChuSoHuu: 'Lê Thị Dung' },
  { maCoSo: 'CS-005', tenCoSo: 'Công ty Hải Sản Đà Nẵng',     soGiayPhep: 'FSL-2023-0011', ngayHetHanGiayPhep: '2025-06-01', trangThai: 'HET_HAN',   maPX: 'TK05', tenPhuongXa: 'Thanh Khê Tây', maChuSoHuu: 'U005', tenChuSoHuu: 'Hoàng Văn Em' },
  { maCoSo: 'CS-006', tenCoSo: 'Bánh Mì Hội An',               soGiayPhep: 'FSL-2025-0045', ngayHetHanGiayPhep: '2027-05-15', trangThai: 'HOAT_DONG', maPX: 'ST06', tenPhuongXa: 'Sơn Trà', maChuSoHuu: 'U006', tenChuSoHuu: 'Ngô Thị Phương' },
  { maCoSo: 'CS-007', tenCoSo: 'Cơm gà Bà Buội Đà Nẵng',      soGiayPhep: '',             ngayHetHanGiayPhep: '',           trangThai: 'CHO_DUYET', maPX: 'HC02', tenPhuongXa: 'Hải Châu 2', maChuSoHuu: 'U007', tenChuSoHuu: 'Lê Hoàng Nam' },
  { maCoSo: 'CS-008', tenCoSo: 'Trà sữa Gong Cha Nguyễn Văn Linh', soGiayPhep: '',        ngayHetHanGiayPhep: '',           trangThai: 'CHO_DUYET', maPX: 'TK01', tenPhuongXa: 'Vĩnh Trung', maChuSoHuu: 'U008', tenChuSoHuu: 'Nguyễn Bích Thủy' },
];

const FALLBACK_PAGE: CoSoKinhDoanhPageResponse = {
  totalPages: 1, totalElements: FALLBACK_ITEMS.length, size: 20,
  content: FALLBACK_ITEMS, number: 0, first: true, last: true,
  numberOfElements: FALLBACK_ITEMS.length, empty: false,
};

// ─── Map trangThai backend → StatusBadge variant ─────────────────
const TRANG_THAI_VARIANT: Record<string, string> = {
  HOAT_DONG: 'active',
  HET_HAN:   'expired',
  DINH_CHI:  'suspended',
  CHO_DUYET: 'pending',
};

const TRANG_THAI_LABEL: Record<string, string> = {
  HOAT_DONG: 'Hoạt động',
  HET_HAN:   'Hết hạn',
  DINH_CHI:  'Tạm đình chỉ',
  CHO_DUYET: 'Chờ duyệt',
};

const TRANG_THAI_OPTIONS = [
  { value: '',           label: '-- Tất cả --' },
  { value: 'HOAT_DONG', label: 'Đang hoạt động' },
  { value: 'HET_HAN',   label: 'Hết hạn' },
  { value: 'DINH_CHI',  label: 'Tạm đình chỉ' },
  { value: 'CHO_DUYET', label: 'Chờ duyệt' },
];

function formatDate(iso: string) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

const PAGE_SIZE = 20;

// ─── Real pagination component ────────────────────────────────────
function Pagination({
  page, totalPages, totalElements, size, onPage,
}: { page: number; totalPages: number; totalElements: number; size: number; onPage: (p: number) => void }) {
  const from = totalElements === 0 ? 0 : page * size + 1;
  const to   = Math.min((page + 1) * size, totalElements);

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%' }}>
      <span style={{ fontSize: '12px', color: '#555' }}>
        Hiển thị {from}–{to} / {totalElements.toLocaleString('vi-VN')} cơ sở
      </span>
      <nav style={{ display: 'flex', gap: '3px', alignItems: 'center' }}>
        <button
          type="button"
          disabled={page === 0}
          onClick={() => onPage(page - 1)}
          style={{ width: 28, height: 24, borderRadius: 2, border: '1px solid #D6D6D6', background: '#fff', cursor: page === 0 ? 'not-allowed' : 'pointer', opacity: page === 0 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft style={{ width: 13, height: 13 }} />
        </button>
        {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
          let p = i;
          if (totalPages > 7) {
            if (page <= 3) p = i;
            else if (page >= totalPages - 4) p = totalPages - 7 + i;
            else p = page - 3 + i;
          }
          return (
            <button
              key={p}
              type="button"
              onClick={() => onPage(p)}
              style={{
                minWidth: 28, height: 24, borderRadius: 2, fontSize: 12,
                border: p === page ? '1px solid #006400' : '1px solid #D6D6D6',
                background: p === page ? '#008000' : '#fff',
                color: p === page ? '#fff' : '#333',
                fontWeight: p === page ? 700 : 400,
                cursor: 'pointer',
              }}
            >
              {p + 1}
            </button>
          );
        })}
        <button
          type="button"
          disabled={page >= totalPages - 1}
          onClick={() => onPage(page + 1)}
          style={{ width: 28, height: 24, borderRadius: 2, border: '1px solid #D6D6D6', background: '#fff', cursor: page >= totalPages - 1 ? 'not-allowed' : 'pointer', opacity: page >= totalPages - 1 ? 0.4 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronRight style={{ width: 13, height: 13 }} />
        </button>
      </nav>
    </div>
  );
}

export default function CoSoKinhDoanhPage() {
  const [pageData, setPageData] = useState<CoSoKinhDoanhPageResponse>(FALLBACK_PAGE);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);

  // Filter state
  const [maCoSo, setMaCoSo]           = useState('');
  const [tenCoSo, setTenCoSo]         = useState('');
  const [soGiayPhep, setSoGiayPhep]   = useState('');
  const [trangThai, setTrangThai]     = useState('');
  const [page, setPage]               = useState(0);

  // Pending filter (chỉ apply khi bấm Tìm kiếm)
  const [pendingMaCoSo, setPendingMaCoSo] = useState('');
  const [pendingTenCoSo, setPendingTenCoSo] = useState('');
  const [pendingSoGiayPhep, setPendingSoGiayPhep] = useState('');
  const [pendingTrangThai, setPendingTrangThai] = useState('');

  const fetchData = useCallback(async (p = 0, tt = trangThai, ma = maCoSo, ten = tenCoSo, gp = soGiayPhep) => {
    setLoading(true);
    setError(null);
    try {
      const res = await coSoKinhDoanhApi.getList({ trangThai: tt || undefined, page: p, size: PAGE_SIZE });
      // Client-side granular filters
      let filtered = res.content;
      const lowerMa = ma.toLowerCase().trim();
      const lowerTen = ten.toLowerCase().trim();
      const lowerGp = gp.toLowerCase().trim();

      if (lowerMa) {
        filtered = filtered.filter(c => c.maCoSo.toLowerCase().includes(lowerMa));
      }
      if (lowerTen) {
        filtered = filtered.filter(c => c.tenCoSo.toLowerCase().includes(lowerTen));
      }
      if (lowerGp) {
        filtered = filtered.filter(c => c.soGiayPhep.toLowerCase().includes(lowerGp));
      }

      setPageData({
        ...res,
        content: filtered,
        numberOfElements: filtered.length,
        totalElements: (lowerMa || lowerTen || lowerGp) ? filtered.length : res.totalElements
      });
    } catch {
      // Fallback
      let filtered = FALLBACK_ITEMS;
      const lowerMa = ma.toLowerCase().trim();
      const lowerTen = ten.toLowerCase().trim();
      const lowerGp = gp.toLowerCase().trim();

      if (tt) {
        filtered = filtered.filter(c => c.trangThai === tt);
      }
      if (lowerMa) {
        filtered = filtered.filter(c => c.maCoSo.toLowerCase().includes(lowerMa));
      }
      if (lowerTen) {
        filtered = filtered.filter(c => c.tenCoSo.toLowerCase().includes(lowerTen));
      }
      if (lowerGp) {
        filtered = filtered.filter(c => c.soGiayPhep.toLowerCase().includes(lowerGp));
      }
      setPageData({
        totalPages: 1,
        totalElements: filtered.length,
        size: PAGE_SIZE,
        content: filtered,
        number: 0,
        first: true,
        last: true,
        numberOfElements: filtered.length,
        empty: filtered.length === 0
      });
      if (tt || lowerMa || lowerTen || lowerGp) {
        setError('Không thể kết nối API — lọc dữ liệu mẫu');
      } else {
        setError('Không thể kết nối API — hiển thị dữ liệu mẫu');
      }
    } finally {
      setLoading(false);
    }
  }, [trangThai, maCoSo, tenCoSo, soGiayPhep]);

  useEffect(() => { fetchData(0); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const handleSearch = () => {
    setMaCoSo(pendingMaCoSo);
    setTenCoSo(pendingTenCoSo);
    setSoGiayPhep(pendingSoGiayPhep);
    setTrangThai(pendingTrangThai);
    setPage(0);
    fetchData(0, pendingTrangThai, pendingMaCoSo, pendingTenCoSo, pendingSoGiayPhep);
  };

  const handleClear = () => {
    setPendingMaCoSo('');
    setPendingTenCoSo('');
    setPendingSoGiayPhep('');
    setPendingTrangThai('');
    setMaCoSo('');
    setTenCoSo('');
    setSoGiayPhep('');
    setTrangThai('');
    setPage(0);
    fetchData(0, '', '', '', '');
  };

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchData(p);
  };

  const handleRefresh = () => fetchData(page);

  // Stats từ fallback nếu API chưa trả về tổng hợp
  const total     = pageData.totalElements;
  const hoatDong  = pageData.content.filter(c => c.trangThai === 'HOAT_DONG').length;
  const choDuyet  = pageData.content.filter(c => c.trangThai === 'CHO_DUYET').length;
  const hetHan    = pageData.content.filter(c => c.trangThai === 'HET_HAN').length;
  const dinhChi   = pageData.content.filter(c => c.trangThai === 'DINH_CHI').length;

  const columns: Column<CoSoKinhDoanhItem>[] = [
    {
      key: 'maCoSo',
      header: 'Mã cơ sở',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.maCoSo}</span>,
    },
    {
      key: 'tenCoSo',
      header: 'Tên cơ sở',
      render: r => (
        <div>
          <p style={{ fontWeight: 600, color: '#222', margin: 0 }}>{r.tenCoSo}</p>
          <p style={{ fontSize: '11px', color: '#888', margin: 0 }}>{r.tenPhuongXa}</p>
        </div>
      ),
    },
    {
      key: 'soGiayPhep',
      header: 'Số giấy phép',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#444' }}>{r.soGiayPhep || '—'}</span>,
    },
    {
      key: 'ngayHetHanGiayPhep',
      header: 'Hết hạn GP',
      render: r => {
        const expired = r.ngayHetHanGiayPhep && new Date(r.ngayHetHanGiayPhep) < new Date();
        return (
          <span style={{ fontFamily: 'monospace', fontSize: '12px', color: expired ? '#CC0000' : '#222', fontWeight: expired ? 600 : 400 }}>
            {formatDate(r.ngayHetHanGiayPhep)}
          </span>
        );
      },
    },
    {
      key: 'tenChuSoHuu',
      header: 'Chủ sở hữu',
      render: r => <span style={{ fontSize: '12.5px' }}>{r.tenChuSoHuu || '—'}</span>,
    },
    {
      key: 'trangThai',
      header: 'Trạng thái',
      render: r => (
        <StatusBadge 
          variant={TRANG_THAI_VARIANT[r.trangThai] ?? r.trangThai} 
          label={TRANG_THAI_LABEL[r.trangThai] ?? r.trangThai} 
        />
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <Link href={`/co-so-kinh-doanh/${r.maCoSo}`}>
          <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
            <Eye style={{ width: 12, height: 12 }} /> Chi tiết
          </GovBtn>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Quản lý cơ sở kinh doanh thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Danh sách cơ sở đã đăng ký"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={handleRefresh}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer style={{ width: 12, height: 12 }} /> In báo cáo
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
            </GovBtn>
          </ActionButtons>
        }
      />

      {/* Thông báo lỗi API */}
      {error && (
        <div style={{ background: '#FFF4E5', border: '1px solid #FFCC80', borderLeft: '4px solid #CC6600', borderRadius: 2, padding: '8px 12px', marginBottom: 10, fontSize: 12.5, color: '#7a3e00' }}>
          ⚠ {error}
        </div>
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng cơ sở ATTP"    value={total.toLocaleString('vi-VN')} color="neutral" icon={Building2} />
        <MiniStat label="Đang hoạt động"      value={hoatDong}  color="green"   note={total > 0 ? `${Math.round(hoatDong / Math.max(pageData.content.length, 1) * 100)}% trang này` : ''} />
        <MiniStat label="Chờ duyệt"          value={choDuyet}  color="orange"  note="Cần phê duyệt" />
        <MiniStat label="Tạm đình chỉ"        value={dinhChi}   color="red" />
        <MiniStat label="Hết hạn giấy phép"   value={hetHan}    color="neutral" note="Cần gia hạn" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Mã cơ sở">
          <GovInput
            placeholder="Ví dụ: CS-001"
            value={pendingMaCoSo}
            onChange={setPendingMaCoSo}
            width={120}
          />
        </FilterField>
        <FilterField label="Tên cơ sở">
          <GovInput
            placeholder="Ví dụ: Biển Xanh"
            value={pendingTenCoSo}
            onChange={setPendingTenCoSo}
            width={180}
          />
        </FilterField>
        <FilterField label="Số giấy phép">
          <GovInput
            placeholder="Ví dụ: FSL-2024"
            value={pendingSoGiayPhep}
            onChange={setPendingSoGiayPhep}
            width={160}
          />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect
            value={pendingTrangThai}
            onChange={setPendingTrangThai}
            options={TRANG_THAI_OPTIONS}
            width={150}
          />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary" onClick={handleSearch}>
            Tìm kiếm
          </GovBtn>
          <GovBtn variant="secondary" onClick={handleClear}>
            Xóa lọc
          </GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách cơ sở kinh doanh (${pageData.totalElements.toLocaleString('vi-VN')} cơ sở)`}
        footer={
          <Pagination
            page={page}
            totalPages={pageData.totalPages}
            totalElements={pageData.totalElements}
            size={PAGE_SIZE}
            onPage={handlePageChange}
          />
        }
      >
        {loading ? (
          <div style={{ padding: '32px', textAlign: 'center', color: '#888', fontSize: 13 }}>
            <RefreshCw style={{ width: 18, height: 18, display: 'inline-block', marginRight: 8, animation: 'spin 1s linear infinite' }} />
            Đang tải dữ liệu...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={pageData.content}
            sttStart={page * PAGE_SIZE + 1}
            rowKey={r => r.maCoSo}
            emptyMessage="Không tìm thấy cơ sở kinh doanh nào phù hợp với bộ lọc."
          />
        )}
      </SectionCard>
    </div>
  );
}
