'use client';

import { useCallback, useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { RefreshCw, FileSpreadsheet, Eye } from 'lucide-react';
import {
  PageHeader, SectionCard, GovBtn, GovInput, GovSelect,
  FilterBar, FilterField, MiniStat, StatusBadge, ActionButtons,
} from '@/components/GovUI';
import DataTable, { type Column } from '@/components/DataTable';
import AlertBanner from '@/components/AlertBanner';
import { viPhamApi, type ViPhamItem } from '@/api/vipham';

type ScreenState = 'loading' | 'error' | 'empty' | 'data';

const MUC_DO_VARIANT: Record<string, string> = {
  'Nghiêm trọng': 'expired',
  'Trung bình': 'pending',
  'Nhẹ': 'processing',
};

const TRANG_THAI_VARIANT: Record<string, string> = {
  'Đã Duyệt': 'active',
  'Chờ Duyệt': 'pending',
  'Từ Chối': 'expired',
};

function formatCurrency(amount: number) {
  if (!amount) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

export default function DanhSachViPhamPage() {
  const [screenState, setScreenState] = useState<ScreenState>('loading');
  const [items, setItems] = useState<ViPhamItem[]>([]);
  const [search, setSearch] = useState('');
  const [mucDoFilter, setMucDoFilter] = useState('');
  const [trangThaiFilter, setTrangThaiFilter] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const load = useCallback(async () => {
    setScreenState('loading');
    setErrorMessage('');
    try {
      const res = await viPhamApi.getList({ page: 0, size: 100 });
      const content = res.content ?? [];
      setItems(content);
      setScreenState(content.length === 0 ? 'empty' : 'data');
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể tải danh sách vi phạm');
      setScreenState('error');
    }
  }, []);

  useEffect(() => { void load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const filtered = useMemo(() => items.filter(v => {
    const matchSearch = !search ||
      v.maViPham.toLowerCase().includes(search.toLowerCase()) ||
      v.tenCoSo.toLowerCase().includes(search.toLowerCase()) ||
      v.tenLoaiViPham.toLowerCase().includes(search.toLowerCase());
    const matchMucDo = !mucDoFilter || v.mucDo === mucDoFilter;
    const matchTrangThai = !trangThaiFilter || v.trangThaiPheDuyet === trangThaiFilter;
    return matchSearch && matchMucDo && matchTrangThai;
  }), [items, search, mucDoFilter, trangThaiFilter]);

  // Stats
  const choDuyet = items.filter(v => v.trangThaiPheDuyet === 'Chờ Duyệt').length;
  const daDuyet = items.filter(v => v.trangThaiPheDuyet === 'Đã Duyệt').length;
  const tuChoi = items.filter(v => v.trangThaiPheDuyet === 'Từ Chối').length;

  const columns: Column<ViPhamItem>[] = [
    {
      key: 'maViPham',
      header: 'Mã VP',
      render: r => (
        <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: '12px', color: '#005A9E' }}>{r.maViPham}</span>
      ),
    },
    {
      key: 'tenCoSo',
      header: 'Cơ sở',
      render: r => <span style={{ fontWeight: 600 }}>{r.tenCoSo}</span>,
    },
    {
      key: 'tenLoaiViPham',
      header: 'Loại vi phạm',
      render: r => <span style={{ fontSize: '12px' }}>{r.tenLoaiViPham}</span>,
    },
    {
      key: 'mucDo',
      header: 'Mức độ',
      render: r => <StatusBadge variant={MUC_DO_VARIANT[r.mucDo] ?? 'pending'} label={r.mucDo} />,
    },
    {
      key: 'tongTienPhat',
      header: 'Tiền phạt',
      render: r => (
        <span style={{ fontFamily: 'monospace', fontSize: '12px', fontWeight: 600, color: '#CC0000' }}>
          {formatCurrency(r.tongTienPhat)}
        </span>
      ),
    },
    {
      key: 'trangThaiPheDuyet',
      header: 'Trạng thái',
      render: r => (
        <StatusBadge
          variant={TRANG_THAI_VARIANT[r.trangThaiPheDuyet] ?? 'pending'}
          label={r.trangThaiPheDuyet}
        />
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <Link href={`/vi-pham/${r.maViPham}`}>
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
        title="Quản lý vi phạm an toàn thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Danh sách vi phạm chờ duyệt và đã xử lý"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => void load()} disabled={screenState === 'loading'}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
            </GovBtn>
          </ActionButtons>
        }
      />

      {errorMessage && <AlertBanner type="danger" title={errorMessage} />}

      {/* Stats */}
      {screenState !== 'loading' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
          <MiniStat label="Tổng vi phạm" value={items.length} color="neutral" />
          <MiniStat label="Chờ duyệt" value={choDuyet} color="orange" />
          <MiniStat label="Đã duyệt" value={daDuyet} color="green" />
          <MiniStat label="Từ chối" value={tuChoi} color="red" />
        </div>
      )}

      {choDuyet > 0 && (
        <AlertBanner
          type="warning"
          title={`Có ${choDuyet} vi phạm đang chờ phê duyệt. Vui lòng xem xét và xử lý.`}
        />
      )}

      {screenState === 'loading' && (
        <div style={{ background: '#fff', border: '1px solid #D6D6D6', padding: '40px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
          Đang tải danh sách vi phạm...
        </div>
      )}

      {screenState === 'empty' && (
        <div style={{ background: '#fff', border: '1px dashed #D6D6D6', padding: '40px', textAlign: 'center' }}>
          <p style={{ fontSize: '14px', fontWeight: 600, color: '#333' }}>Chưa có vi phạm nào</p>
        </div>
      )}

      {screenState === 'data' && (
        <>
          <FilterBar>
            <FilterField label="Tìm kiếm">
              <GovInput
                placeholder="Mã vi phạm, tên cơ sở, loại vi phạm..."
                value={search}
                onChange={setSearch}
                width={260}
              />
            </FilterField>
            <FilterField label="Mức độ">
              <GovSelect
                value={mucDoFilter}
                onChange={setMucDoFilter}
                options={[
                  { value: '', label: '-- Tất cả --' },
                  { value: 'Nghiêm trọng', label: 'Nghiêm trọng' },
                  { value: 'Trung bình', label: 'Trung bình' },
                  { value: 'Nhẹ', label: 'Nhẹ' },
                ]}
                width={150}
              />
            </FilterField>
            <FilterField label="Trạng thái">
              <GovSelect
                value={trangThaiFilter}
                onChange={setTrangThaiFilter}
                options={[
                  { value: '', label: '-- Tất cả --' },
                  { value: 'Chờ Duyệt', label: 'Chờ duyệt' },
                  { value: 'Đã Duyệt', label: 'Đã duyệt' },
                  { value: 'Từ Chối', label: 'Từ chối' },
                ]}
                width={140}
              />
            </FilterField>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
              <GovBtn variant="secondary" onClick={() => { setSearch(''); setMucDoFilter(''); setTrangThaiFilter(''); }}>Xóa lọc</GovBtn>
            </div>
          </FilterBar>

          <SectionCard title={`Danh sách vi phạm (${filtered.length} bản ghi)`}>
            <DataTable
              columns={columns}
              data={filtered}
              emptyMessage="Không tìm thấy vi phạm nào phù hợp."
            />
          </SectionCard>
        </>
      )}
    </div>
  );
}