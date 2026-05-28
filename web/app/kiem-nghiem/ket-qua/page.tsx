'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, RefreshCw, FileSpreadsheet, Printer, FlaskConical, Search } from 'lucide-react';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import DataTable, { Column } from '@/components/DataTable';
import AlertBanner from '@/components/AlertBanner';
import { ketQuaKiemNghiemApi, KetQuaKiemNghiemItemResponse } from '@/api/ketquakiemnghiem';

function normalizeResult(value?: string | null): 'pass' | 'fail' | 'pending' {
  const normalized = (value || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/đ/g, 'd')
    .trim();

  if (normalized.includes('khong dat') || normalized.includes('fail')) return 'fail';
  if (normalized.includes('dat') || normalized.includes('pass')) return 'pass';
  return 'pending';
}

export default function KetQuaKiemNghiemPage() {
  // Separate search inputs for code, business/sample name
  const [searchMa, setSearchMa] = useState('');
  const [searchTen, setSearchTen] = useState('');
  const [resultFilter, setResultFilter] = useState('');
  
  const [items, setItems] = useState<KetQuaKiemNghiemItemResponse[]>([]);
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [page, setPage] = useState(0);
  const [size] = useState(10);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchResults = async (currentPage: number = 0) => {
    setLoading(true);
    setError('');
    try {
      // Primary keyword to search on backend
      const queryKeyword = (searchMa.trim() || searchTen.trim());
      const res = await ketQuaKiemNghiemApi.search(
        queryKeyword,
        resultFilter || undefined,
        currentPage,
        size
      );
      
      // Perform further client-side filter if both inputs are typed to ensure they are narrow-matched
      let filteredContent = res.content || [];
      if (searchMa.trim() && searchTen.trim()) {
        const maLower = searchMa.toLowerCase().trim();
        const tenLower = searchTen.toLowerCase().trim();
        filteredContent = filteredContent.filter(r => 
          ((r.maKetQua && r.maKetQua.toLowerCase().includes(maLower)) || (r.maMau && r.maMau.toLowerCase().includes(maLower))) &&
          ((r.tenCoSo && r.tenCoSo.toLowerCase().includes(tenLower)) || (r.tenMau && r.tenMau.toLowerCase().includes(tenLower)))
        );
      }

      setItems(filteredContent);
      setTotalElements(res.totalElements || 0);
      setTotalPages(res.totalPages || 0);
      setPage(res.number || 0);
    } catch (err: any) {
      setError(err.message || 'Không thể tải danh sách kết quả kiểm nghiệm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchResults(0);
  }, [resultFilter]);

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    fetchResults(0);
  };

  const handleReset = () => {
    setSearchMa('');
    setSearchTen('');
    setResultFilter('');
    setLoading(true);
    ketQuaKiemNghiemApi.search('', undefined, 0, size)
      .then(res => {
        setItems(res.content || []);
        setTotalElements(res.totalElements || 0);
        setTotalPages(res.totalPages || 0);
        setPage(res.number || 0);
      })
      .catch(err => setError(err.message || 'Không thể tải danh sách kết quả kiểm nghiệm.'))
      .finally(() => setLoading(false));
  };

  const passCount = items.filter(kq => kq.ketQua === 'pass' || kq.ketQua === 'Đạt' || kq.ketQua === 'DAT').length;
  const failCount = items.filter(kq => kq.ketQua === 'fail' || kq.ketQua === 'Không đạt' || kq.ketQua === 'KHONG_DAT').length;
  const passCountNormalized = items.filter(kq => normalizeResult(kq.ketQua) === 'pass').length;
  const failCountNormalized = items.filter(kq => normalizeResult(kq.ketQua) === 'fail').length;

  const columns: Column<KetQuaKiemNghiemItemResponse>[] = [
    {
      key: 'maKetQua',
      header: 'Mã kết quả',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.maKetQua}</span>,
    },
    {
      key: 'maMau',
      header: 'Mã mẫu',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#333' }}>{r.maMau}</span>,
    },
    {
      key: 'tenCoSo',
      header: 'Cơ sở / Sản phẩm',
      render: r => (
        <div>
          <p style={{ fontWeight: 600, fontSize: '13px', color: '#222' }}>{r.tenCoSo}</p>
          <p style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <FlaskConical style={{ width: 10, height: 10 }} /> {r.tenMau} — {r.loaiMau}
          </p>
        </div>
      ),
    },
    {
      key: 'chiTieu',
      header: 'Tiêu chuẩn áp dụng',
      render: r => <span style={{ fontSize: '11.5px', color: '#333', fontStyle: 'italic' }}>{r.chiTieu || '—'}</span>,
    },
    {
      key: 'ngayKiemNghiem',
      header: 'Ngày kiểm nghiệm',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.ngayKiemNghiem || '—'}</span>,
    },
    {
      key: 'phongLab',
      header: 'Phòng thí nghiệm',
      render: r => <span style={{ fontSize: '12px' }}>{r.phongLab || 'Phòng LAB'}</span>,
    },
    {
      key: 'ketQua',
      header: 'Kết quả',
      render: r => {
        const res = normalizeResult(r.ketQua);
        if (res === 'pass') return <StatusBadge variant="pass" label="Đạt" />;
        if (res === 'fail') return <StatusBadge variant="fail" label="Không đạt" />;
        return <StatusBadge variant="pending" label="Chờ kết quả" />;

        const isDat = r.ketQua === 'pass' || r.ketQua === 'Đạt' || r.ketQua === 'DAT';
        return <StatusBadge variant={isDat ? 'active' : 'expired'} label={isDat ? 'Đạt' : 'Không đạt'} />;
      },
    },
    {
      key: 'diem',
      header: 'Điểm số',
      render: r => r.diem !== null && r.diem !== undefined ? <span style={{ fontWeight: 600 }}>{r.diem}/100</span> : <span>—</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <ActionButtons>
          <Link href={`/kiem-nghiem/ket-qua/${r.maKetQua}`}>
            <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
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
        title="Kết quả kiểm nghiệm thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Tổng hợp kết quả kiểm nghiệm và chứng nhận"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => fetchResults(page)}><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><Printer style={{ width: 12, height: 12 }} /> In báo cáo</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
          </ActionButtons>
        }
      />

      {error && (
        <AlertBanner
          type="danger"
          title={error}
        />
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng kết quả (Trang hiện tại)" value={items.length} color="neutral" />
        <MiniStat label="Tổng số bản ghi" value={totalElements} color="blue" />
        <MiniStat label="Đạt yêu cầu (Trang hiện tại)" value={passCountNormalized} color="green" />
        <MiniStat label="Không đạt (Trang hiện tại)" value={failCountNormalized} color="red" />
      </div>

      {/* Segmented Filters */}
      <form onSubmit={handleSearchSubmit}>
        <FilterBar>
          <FilterField label="Mã kết quả / Mã mẫu">
            <GovInput placeholder="Ví dụ: KQ-01..." value={searchMa} onChange={setSearchMa} width={180} />
          </FilterField>
          <FilterField label="Tên cơ sở / Sản phẩm">
            <GovInput placeholder="Ví dụ: Phở Ba Miền..." value={searchTen} onChange={setSearchTen} width={220} />
          </FilterField>
          <FilterField label="Kết quả đánh giá">
            <GovSelect value={resultFilter} onChange={setResultFilter} options={[
              { value: '', label: '-- Tất cả --' },
              { value: 'pass', label: 'Đạt (pass)' },
              { value: 'fail', label: 'Không đạt (fail)' },
            ]} width={140} />
          </FilterField>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
            <GovBtn type="submit" variant="primary">
              <Search style={{ width: 12, height: 12, marginRight: 2 }} />
              Tìm kiếm
            </GovBtn>
            <GovBtn type="button" variant="secondary" onClick={handleReset}>Xóa lọc</GovBtn>
          </div>
        </FilterBar>
      </form>

      {/* Bảng kết quả */}
      <SectionCard
        title={`Tổng hợp kết quả kiểm nghiệm (${totalElements} bản ghi)`}
        footer={
          <GovPagination
            info={`Trang ${page + 1} / ${totalPages || 1}`}
            page={page}
            totalPages={totalPages}
            onPageChange={(p) => fetchResults(p)}
          />
        }
      >
        <DataTable
          columns={columns}
          data={items}
          loading={loading}
          emptyMessage="Không tìm thấy kết quả kiểm nghiệm nào."
        />
      </SectionCard>

      {/* Mẫu không đạt */}
      {failCountNormalized > 0 && (
        <SectionCard title="Chi tiết mẫu không đạt yêu cầu (Trong trang hiện tại)">
          <div style={{ padding: '0' }}>
            {items.filter(kq => normalizeResult(kq.ketQua) === 'fail').map((kq, i) => (
              <div key={i} style={{ padding: '10px 12px', borderBottom: '1px solid #F0F0F0', borderLeft: '3px solid #CC0000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#CC0000' }}>{kq.tenCoSo} — {kq.tenMau} ({kq.loaiMau})</p>
                    <p style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>Mã kết quả: {kq.maKetQua} — Phòng LAB: {kq.phongLab || 'Chưa xác định'}</p>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888', flexShrink: 0 }}>{kq.ngayKiemNghiem || '—'}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
