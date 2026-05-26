'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { Eye, RefreshCw, FileSpreadsheet, FlaskConical, Search } from 'lucide-react';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import DataTable, { Column } from '@/components/DataTable';
import AlertBanner from '@/components/AlertBanner';
import { mauKiemNghiemApi, MauKiemNghiemItem } from '@/api/maukiemnghiem';

const statusVariant: Record<string, string> = {
  'Chưa kiểm nghiệm': 'pending',
  'Đang kiểm nghiệm': 'in-progress',
  'Hoàn thành': 'resolved',
  'Đã tiếp nhận': 'pending',
  'received': 'pending',
  'testing': 'in-progress',
  'completed': 'resolved',
  'cancelled': 'expired',
};

const PAGE_SIZE = 10;

export default function MauKiemNghiemPage() {
  const [mauList, setMauList] = useState<MauKiemNghiemItem[]>([]);
  
  // Separate search inputs for code, name, and type
  const [searchMa, setSearchMa] = useState('');
  const [searchTen, setSearchTen] = useState('');
  const [searchLoai, setSearchLoai] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  // Fetch list from API
  const fetchMauList = useCallback(async (p: number = 0) => {
    setLoading(true);
    setError(null);
    try {
      const res = await mauKiemNghiemApi.getList({
        trangThai: statusFilter || undefined,
        page: p,
        size: PAGE_SIZE,
        sort: ['ngayYeuCau,desc'],
      });
      setMauList(res.content || []);
      setTotalElements(res.totalElements || 0);
      setTotalPages(res.totalPages || 0);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách mẫu kiểm nghiệm.');
    } finally {
      setLoading(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchMauList(0);
    setPage(0);
  }, [fetchMauList]);

  const handlePageChange = (p: number) => {
    setPage(p);
    fetchMauList(p);
  };

  const handleStatusChange = async (maMau: string, newStatus: string) => {
    setUpdatingId(maMau);
    try {
      await mauKiemNghiemApi.updateTrangThai(maMau, {
        trangThai: newStatus,
        ghiChu: 'Cập nhật trạng thái từ danh sách',
      });
      fetchMauList(page);
    } catch (err: any) {
      setError(err.message || 'Cập nhật trạng thái thất bại.');
    } finally {
      setUpdatingId(null);
    }
  };

  // Client side split keyword searches
  const filtered = mauList.filter(m => {
    const termMa = searchMa.toLowerCase().trim();
    const termTen = searchTen.toLowerCase().trim();
    const termLoai = searchLoai.toLowerCase().trim();
    
    if (termMa && (!m.maMau || !m.maMau.toLowerCase().includes(termMa))) return false;
    if (termTen && (!m.tenMau || !m.tenMau.toLowerCase().includes(termTen))) return false;
    if (termLoai && (!m.loaiMau || !m.loaiMau.toLowerCase().includes(termLoai))) return false;
    
    return true;
  });

  const stats = {
    total: totalElements,
    received: mauList.filter(m => m.trangThai === 'Đã tiếp nhận' || m.trangThai === 'Chưa kiểm nghiệm' || m.trangThai === 'received').length,
    testing: mauList.filter(m => m.trangThai === 'Đang kiểm nghiệm' || m.trangThai === 'testing').length,
    completed: mauList.filter(m => m.trangThai === 'Hoàn thành' || m.trangThai === 'completed').length,
  };

  const columns: Column<MauKiemNghiemItem>[] = [
    {
      key: 'maMau',
      header: 'Mã mẫu',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.maMau}</span>,
    },
    {
      key: 'tenMau',
      header: 'Tên mẫu kiểm nghiệm',
      render: r => (
        <div>
          <p style={{ fontWeight: 600, fontSize: '13px', color: '#222' }}>{r.tenMau}</p>
          <p style={{ fontSize: '11px', color: '#888' }}>{r.noiDung || 'Không có mô tả'}</p>
        </div>
      ),
    },
    {
      key: 'loaiMau',
      header: 'Loại mẫu',
      render: r => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 500, color: '#333' }}>
          <FlaskConical style={{ width: 12, height: 12, color: '#005A9E' }} />
          {r.loaiMau}
        </span>
      ),
    },
    {
      key: 'ngayThu',
      header: 'Ngày lấy mẫu',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.ngayThu || '—'}</span>,
    },
    {
      key: 'hanHoanThanh',
      header: 'Hạn hoàn thành',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#c2410c' }}>{r.hanHoanThanh || '—'}</span>,
    },
    {
      key: 'trangThai',
      header: 'Trạng thái',
      render: r => (
        <select
          value={r.trangThai}
          disabled={updatingId === r.maMau}
          onChange={(e) => handleStatusChange(r.maMau, e.target.value)}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #d0d7de',
            fontSize: '12px',
            fontWeight: 600,
            background: '#fff',
            cursor: 'pointer',
            color:
              r.trangThai === 'Hoàn thành' || r.trangThai === 'completed'
                ? '#15803d'
                : r.trangThai === 'Đang kiểm nghiệm' || r.trangThai === 'testing'
                  ? '#c2410c'
                  : '#005A9E',
          }}
        >
          <option value="Chưa kiểm nghiệm">Chưa kiểm nghiệm</option>
          <option value="Đang kiểm nghiệm">Đang kiểm nghiệm</option>
          <option value="Hoàn thành">Hoàn thành</option>
        </select>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <ActionButtons>
          <Link href={`/kiem-nghiem/mau/${r.maMau}`}>
            <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
              <Eye style={{ width: 12, height: 12 }} />
            </GovBtn>
          </Link>
        </ActionButtons>
      ),
    },
  ];

  const handleResetFilters = () => {
    setSearchMa('');
    setSearchTen('');
    setSearchLoai('');
    setStatusFilter('');
  };

  return (
    <div>
      <PageHeader
        title="Quản lý mẫu kiểm nghiệm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Tiếp nhận và theo dõi mẫu kiểm nghiệm thực phẩm"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => fetchMauList(page)} disabled={loading}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
          </ActionButtons>
        }
      />

      {error && (
        <AlertBanner
          type="error"
          title={error}
        />
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng mẫu" value={stats.total} color="neutral" />
        <MiniStat label="Chưa kiểm nghiệm / Đã tiếp nhận" value={stats.received} color="blue" />
        <MiniStat label="Đang kiểm nghiệm" value={stats.testing} color="orange" />
        <MiniStat label="Hoàn thành" value={stats.completed} color="green" />
      </div>

      {/* Segmented filter fields */}
      <FilterBar>
        <FilterField label="Mã mẫu">
          <GovInput placeholder="Ví dụ: MAU-01" value={searchMa} onChange={setSearchMa} width={150} />
        </FilterField>
        <FilterField label="Tên mẫu">
          <GovInput placeholder="Ví dụ: Thịt heo, Phở..." value={searchTen} onChange={setSearchTen} width={180} />
        </FilterField>
        <FilterField label="Loại mẫu">
          <GovInput placeholder="Ví dụ: Thực phẩm chín..." value={searchLoai} onChange={setSearchLoai} width={160} />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect value={statusFilter} onChange={setStatusFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'Chưa kiểm nghiệm', label: 'Chưa kiểm nghiệm' },
            { value: 'Đang kiểm nghiệm', label: 'Đang kiểm nghiệm' },
            { value: 'Hoàn thành', label: 'Hoàn thành' },
          ]} width={160} />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="secondary" onClick={handleResetFilters}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách mẫu kiểm nghiệm (${filtered.length} mẫu trong trang)`}
        footer={
          <GovPagination
            info={`Trang ${page + 1} / ${totalPages || 1} — Tổng cộng ${totalElements} mẫu`}
            page={page}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        }
      >
        <DataTable
          columns={columns}
          data={filtered}
          loading={loading}
          emptyMessage="Không tìm thấy mẫu kiểm nghiệm nào phù hợp điều kiện."
        />
      </SectionCard>
    </div>
  );
}
