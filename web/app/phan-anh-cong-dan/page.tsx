'use client';

import { useState, useEffect, useCallback } from 'react';
import { Eye, FileSpreadsheet, RefreshCw, Printer } from 'lucide-react';
import Link from 'next/link';
import { phanAnhApi, PhanAnhItem, TrangThaiPhanAnh } from '@/api/phananh';
import DataTable, { Column } from '@/components/DataTable';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

// ─── helpers ────────────────────────────────────────────────────
const TRANG_THAI_OPTIONS = [
  { value: '',          label: '-- Tất cả --' },
  { value: 'CHO_XU_LY',  label: 'Chờ xử lý' },
  { value: 'DANG_XU_LY', label: 'Đang xử lý' },
  { value: 'DA_XU_LY',   label: 'Đã xử lý' },
  { value: 'TU_CHOI',    label: 'Từ chối' },
];

const trangThaiVariant: Record<string, string> = {
  CHO_XU_LY:  'open',
  DANG_XU_LY: 'in-progress',
  DA_XU_LY:   'resolved',
  TU_CHOI:    'rejected',
};
const trangThaiLabel: Record<string, string> = {
  CHO_XU_LY:  'Chờ xử lý',
  DANG_XU_LY: 'Đang xử lý',
  DA_XU_LY:   'Đã xử lý',
  TU_CHOI:    'Từ chối',
};

function formatDate(iso: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  } catch {
    return iso;
  }
}

const PAGE_SIZE = 20;

// ─── component ──────────────────────────────────────────────────
export default function PhanAnhCongDanPage() {
  const [trangThai, setTrangThai]   = useState('');
  const [fromDate, setFromDate]     = useState('');
  const [toDate, setToDate]         = useState('');
  const [page, setPage]             = useState(0);

  const [items, setItems]           = useState<PhanAnhItem[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [loading, setLoading]       = useState(false);
  const [error, setError]           = useState<string | null>(null);

  // Tổng hợp đếm theo trạng thái (từ danh sách trang hiện tại — backend nên cung cấp endpoint riêng nếu cần chính xác)
  const choXuLy   = items.filter(i => i.trangThaiPhanAnh === 'CHO_XU_LY').length;
  const dangXuLy  = items.filter(i => i.trangThaiPhanAnh === 'DANG_XU_LY').length;
  const daXuLy    = items.filter(i => i.trangThaiPhanAnh === 'DA_XU_LY').length;

  const fetchData = useCallback(async (currentPage = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await phanAnhApi.search({
        trangThai: trangThai || undefined,
        from: fromDate ? new Date(fromDate).toISOString() : undefined,
        to:   toDate   ? new Date(toDate).toISOString()   : undefined,
        page: currentPage,
        size: PAGE_SIZE,
        sort: ['ngayGui,desc'],
      });
      setItems(res.content);
      setTotalElements(res.totalElements);
      setTotalPages(res.totalPages);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách phản ánh.');
    } finally {
      setLoading(false);
    }
  }, [trangThai, fromDate, toDate]);

  // Tải lần đầu
  useEffect(() => { fetchData(0); setPage(0); }, [fetchData]);

  const handleSearch = () => { setPage(0); fetchData(0); };
  const handleReset  = () => { setTrangThai(''); setFromDate(''); setToDate(''); };
  const handlePageChange = (newPage: number) => { setPage(newPage); fetchData(newPage); };

  const columns: Column<PhanAnhItem>[] = [
    {
      key: 'maPhanAnh',
      header: 'Mã phản ánh',
      render: r => (
        <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>
          {r.maPhanAnh}
        </span>
      ),
    },
    {
      key: 'tieuDe',
      header: 'Tiêu đề',
      render: r => (
        <span style={{ fontWeight: 500 }} title={r.lyDo}>
          {r.tieuDe || '(Không có tiêu đề)'}
        </span>
      ),
    },
    {
      key: 'tenNguoiPhanAnh',
      header: 'Người gửi',
      render: r => <span style={{ fontWeight: 500 }}>{r.tenNguoiPhanAnh}</span>,
    },
    {
      key: 'tenCoSo',
      header: 'Cơ sở bị phản ánh',
      render: r => <span style={{ fontWeight: 600, color: '#333' }}>{r.tenCoSo || '—'}</span>,
    },
    {
      key: 'diaDiem',
      header: 'Địa điểm',
      render: r => <span style={{ fontSize: '12px', color: '#555' }}>{r.diaDiem || '—'}</span>,
    },
    {
      key: 'ngayGui',
      header: 'Ngày gửi',
      render: r => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{formatDate(r.ngayGui)}</span>
      ),
    },
    {
      key: 'trangThaiPhanAnh',
      header: 'Trạng thái',
      render: r => (
        <StatusBadge
          variant={trangThaiVariant[r.trangThaiPhanAnh] ?? 'default'}
          label={trangThaiLabel[r.trangThaiPhanAnh] ?? r.trangThaiPhanAnh}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <Link href={`/phan-anh-cong-dan/${r.maPhanAnh}`}>
          <GovBtn variant="secondary" size="sm" title="Xem chi tiết & xử lý">
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
        </Link>
      ),
    },
  ];

  return (
    <div>
      <PageHeader
        title="Tiếp nhận và xử lý phản ánh công dân"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Quản lý khiếu nại và phản ánh từ người dân"
        actions={
          <>
            <GovBtn variant="secondary" onClick={() => fetchData(page)} disabled={loading}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer style={{ width: 12, height: 12 }} /> In báo cáo
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
            </GovBtn>
          </>
        }
      />

      {error && <AlertBanner type="error" title={error} />}

      {choXuLy > 0 && (
        <AlertBanner
          type="info"
          title={`${choXuLy} phản ánh đang chờ xử lý cần được xem xét và phản hồi trong vòng 5 ngày làm việc.`}
        />
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng phản ánh"  value={totalElements}  color="neutral" />
        <MiniStat label="Chờ xử lý"      value={choXuLy}        color="orange"  note="Cần xử lý" />
        <MiniStat label="Đang xử lý"     value={dangXuLy}       color="blue"    />
        <MiniStat label="Đã giải quyết"  value={daXuLy}         color="green"   />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Trạng thái">
          <GovSelect
            value={trangThai}
            onChange={setTrangThai}
            options={TRANG_THAI_OPTIONS}
            width={180}
          />
        </FilterField>
        <FilterField label="Từ ngày">
          <GovInput
            type="date"
            value={fromDate}
            onChange={setFromDate}
            width={150}
          />
        </FilterField>
        <FilterField label="Đến ngày">
          <GovInput
            type="date"
            value={toDate}
            onChange={setToDate}
            width={150}
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
        title={`Danh sách phản ánh (${totalElements} bản ghi)`}
        footer={
          <GovPagination
            info={`Trang ${page + 1} / ${totalPages || 1} — ${totalElements} phản ánh`}
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
          emptyMessage="Không tìm thấy phản ánh nào phù hợp."
        />
      </SectionCard>
    </div>
  );
}
