'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Eye, FileSpreadsheet, RefreshCw, Plus, Check } from 'lucide-react';
import { useRole } from '@/lib/RoleContext';
import DataTable, { Column } from '@/components/DataTable';
import { PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn, SectionCard, StatusBadge, MiniStat } from '@/components/GovUI';
import { giayChungNhanApi, coSoKinhDoanhApi, type GiayChungNhanItem, type CoSoKinhDoanhItem } from '@/api/api';

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

const mapStatusToVariant = (status: string) => {
  const s = String(status || '').trim().toLowerCase();
  if (s === 'còn hiệu lực' || s === 'cap moi' || s === 'gia han' || s === 'hoat_dong') return 'pass'; 
  if (s === 'hết hạn' || s === 'expired') return 'expired'; 
  if (s === 'thu hoi' || s === 'suspended' || s === 'dinh_chi') return 'fail'; 
  return 'pending'; 
};

const mapStatusToLabel = (status: string) => {
  const s = String(status || '').trim();
  if (s === 'Cap moi') return 'Cấp mới';
  if (s === 'Gia han') return 'Gia hạn';
  if (s === 'Thu hoi') return 'Thu hồi';
  return s;
};

export default function PheDuyetChungNhanPage() {
  const { role } = useRole();
  const [certs, setCerts] = useState<GiayChungNhanItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Search and Filter State
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // Pagination State
  const [totalElements, setTotalElements] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [currentPage, setCurrentPage] = useState(0);
  const pageSize = 10;

  // Stats State
  const [statTotal, setStatTotal] = useState(0);
  const [statActive, setStatActive] = useState(0);
  const [statExpired, setStatExpired] = useState(0);
  const [statRevoked, setStatRevoked] = useState(0);

  // Create Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [businesses, setBusinesses] = useState<CoSoKinhDoanhItem[]>([]);
  const [loadingBiz, setLoadingBiz] = useState(false);

  // Form Field State
  const [selectedCoSo, setSelectedCoSo] = useState('');
  const [tenChungNhan, setTenChungNhan] = useState('Chứng nhận đủ điều kiện an toàn thực phẩm');
  const [ngayBanHanh, setNgayBanHanh] = useState('');
  const [ngayHetHan, setNgayHetHan] = useState('');
  const [trangThai, setTrangThai] = useState('Cap moi');
  
  const [formError, setFormError] = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  const loadData = async () => {
    setLoading(true);
    try {
      // Load current page list
      const res = await giayChungNhanApi.getList({
        trangThai: statusFilter || undefined,
        page: currentPage,
        size: pageSize
      });
      setCerts(res.content || []);
      setTotalElements(res.totalElements || 0);
      setTotalPages(res.totalPages || 1);

      // Load stats in parallel
      const [resAll, resActive, resExpired, resRevoked] = await Promise.all([
        giayChungNhanApi.getList({ size: 1 }),
        giayChungNhanApi.getList({ trangThai: 'Còn hiệu lực', size: 1 }),
        giayChungNhanApi.getList({ trangThai: 'Hết hạn', size: 1 }),
        giayChungNhanApi.getList({ trangThai: 'Thu hoi', size: 1 }),
      ]);
      setStatTotal(resAll.totalElements || 0);
      setStatActive(resActive.totalElements || 0);
      setStatExpired(resExpired.totalElements || 0);
      setStatRevoked(resRevoked.totalElements || 0);
    } catch (err) {
      console.error('Lỗi tải danh sách chứng nhận:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [currentPage, statusFilter]);

  // Load business establishments dropdown list on modal open
  useEffect(() => {
    if (isCreateModalOpen) {
      setLoadingBiz(true);
      coSoKinhDoanhApi.getDropdown()
        .then(setBusinesses)
        .catch(err => console.error('Lỗi tải danh sách cơ sở:', err))
        .finally(() => setLoadingBiz(false));
      
      const today = new Date();
      const threeYearsLater = new Date();
      threeYearsLater.setFullYear(today.getFullYear() + 3);

      const formatDateInput = (d: Date) => {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
      };

      setNgayBanHanh(formatDateInput(today));
      setNgayHetHan(formatDateInput(threeYearsLater));
      setSelectedCoSo('');
      setFormError('');
      setFormSuccess('');
    }
  }, [isCreateModalOpen]);

  const handleCreateCertificate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');
    setFormSuccess('');

    if (!selectedCoSo) {
      setFormError('Vui lòng chọn cơ sở kinh doanh');
      return;
    }
    if (!tenChungNhan.trim()) {
      setFormError('Vui lòng nhập tên chứng nhận');
      return;
    }
    if (!ngayBanHanh || !ngayHetHan) {
      setFormError('Vui lòng nhập đầy đủ ngày ban hành và ngày hết hạn');
      return;
    }

    const start = new Date(ngayBanHanh);
    const end = new Date(ngayHetHan);
    if (start > end) {
      setFormError('Ngày ban hành phải trước ngày hết hạn');
      return;
    }

    try {
      await giayChungNhanApi.create({
        maCoSo: selectedCoSo,
        tenChungNhan,
        ngayBanHanh,
        ngayHetHan,
        trangThai,
      });

      setFormSuccess('Cấp chứng nhận thành công!');
      loadData();
      setTimeout(() => {
        setIsCreateModalOpen(false);
      }, 1500);
    } catch (err: any) {
      console.error(err);
      setFormError(err.message || 'Có lỗi xảy ra khi cấp chứng nhận. Vui lòng kiểm tra lại.');
    }
  };

  const filteredCerts = certs.filter((c) => {
    if (!search) return true;
    const kw = search.toLowerCase();
    return (
      c.maCN.toLowerCase().includes(kw) ||
      (c.tenCoSo && c.tenCoSo.toLowerCase().includes(kw)) ||
      (c.tenChungNhan && c.tenChungNhan.toLowerCase().includes(kw))
    );
  });

  const columns: Column<GiayChungNhanItem>[] = [
    {
      key: 'maCN',
      header: 'Mã chứng nhận',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.maCN}</span>,
    },
    {
      key: 'tenCoSo',
      header: 'Tên cơ sở',
      render: r => <span style={{ fontWeight: 600 }}>{r.tenCoSo || '—'}</span>,
    },
    { key: 'tenChungNhan', header: 'Loại chứng nhận' },
    {
      key: 'ngayBanHanh',
      header: 'Ngày cấp',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{formatDate(r.ngayBanHanh)}</span>,
    },
    {
      key: 'ngayHetHan',
      header: 'Ngày hết hạn',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{formatDate(r.ngayHetHan)}</span>,
    },
    {
      key: 'trangThai',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={mapStatusToVariant(r.trangThai)} label={mapStatusToLabel(r.trangThai)} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <Link href={`/co-so-kinh-doanh/chung-nhan/${r.maCN}`}>
            <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
              <Eye style={{ width: 12, height: 12 }} />
            </GovBtn>
          </Link>
        </div>
      ),
    },
  ];

  const canIssue = role === 'LD_ATVSTP' || role === 'ADMIN';

  const paginationFooter = (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
      <span style={{ fontSize: '12px', color: '#555' }}>
        Hiển thị {filteredCerts.length} / {totalElements} chứng nhận (Trang {currentPage + 1}/{totalPages})
      </span>
      <nav style={{ display: 'flex', gap: '3px' }}>
        <button
          type="button"
          disabled={currentPage === 0}
          onClick={() => setCurrentPage(prev => Math.max(0, prev - 1))}
          style={{
            minWidth: '26px',
            height: '24px',
            borderRadius: '2px',
            border: '1px solid #D6D6D6',
            background: '#fff',
            color: currentPage === 0 ? '#999' : '#333',
            fontSize: '12px',
            cursor: currentPage === 0 ? 'not-allowed' : 'pointer',
          }}
        >
          «
        </button>
        {Array.from({ length: totalPages }, (_, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => setCurrentPage(idx)}
            style={{
              minWidth: '26px',
              height: '24px',
              borderRadius: '2px',
              border: currentPage === idx ? '1px solid #008000' : '1px solid #D6D6D6',
              background: currentPage === idx ? '#008000' : '#fff',
              color: currentPage === idx ? '#fff' : '#333',
              fontSize: '12px',
              cursor: 'pointer',
              fontWeight: currentPage === idx ? 600 : 400,
            }}
          >
            {idx + 1}
          </button>
        ))}
        <button
          type="button"
          disabled={currentPage >= totalPages - 1}
          onClick={() => setCurrentPage(prev => Math.min(totalPages - 1, prev + 1))}
          style={{
            minWidth: '26px',
            height: '24px',
            borderRadius: '2px',
            border: '1px solid #D6D6D6',
            background: '#fff',
            color: currentPage >= totalPages - 1 ? '#999' : '#333',
            fontSize: '12px',
            cursor: currentPage >= totalPages - 1 ? 'not-allowed' : 'pointer',
          }}
        >
          »
        </button>
      </nav>
    </div>
  );

  return (
    <div>
      <PageHeader
        title="Phê duyệt chứng nhận an toàn thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Quản lý và phê duyệt chứng nhận ATTP"
        actions={
          <>
            {canIssue && (
              <GovBtn variant="primary" onClick={() => setIsCreateModalOpen(true)}>
                <Plus style={{ width: 12, height: 12 }} /> Cấp mới chứng nhận
              </GovBtn>
            )}
            <GovBtn variant="secondary" onClick={() => loadData()}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
            </GovBtn>
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng chứng nhận" value={statTotal} color="neutral" />
        <MiniStat label="Còn hiệu lực" value={statActive} color="green" />
        <MiniStat label="Đã hết hạn" value={statExpired} color="orange" />
        <MiniStat label="Đã thu hồi" value={statRevoked} color="red" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm nhanh">
          <GovInput placeholder="Mã, tên cơ sở..." value={search} onChange={setSearch} width={220} />
        </FilterField>
        <FilterField label="Trạng thái hiệu lực">
          <GovSelect value={statusFilter} onChange={(val) => { setStatusFilter(val); setCurrentPage(0); }} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'Còn hiệu lực',  label: 'Còn hiệu lực' },
            { value: 'Hết hạn', label: 'Đã hết hạn' },
            { value: 'Thu hoi', label: 'Đã thu hồi' },
          ]} width={160} />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); setCurrentPage(0); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách chứng nhận ATTP (${filteredCerts.length} bản ghi)`}
        footer={paginationFooter}
      >
        {loading ? (
          <div style={{ padding: '30px', textAlign: 'center', color: '#888' }}>
            <RefreshCw style={{ width: 20, height: 20, display: 'inline-block', animation: 'spin 1.5s linear infinite', marginRight: '6px' }} />
            Đang tải dữ liệu từ server...
          </div>
        ) : (
          <DataTable
            columns={columns}
            data={filteredCerts}
            emptyMessage="Không tìm thấy chứng nhận nào phù hợp."
          />
        )}
      </SectionCard>

      {/* Issuance Modal Form */}
      {isCreateModalOpen && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          }}
        >
          <div style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '2px', width: '500px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            {/* Modal header */}
            <div style={{ background: '#008000', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                Cấp mới & Phê duyệt chứng nhận ATTP
              </h3>
              <button onClick={() => setIsCreateModalOpen(false)} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
            </div>

            {/* Modal body */}
            <form onSubmit={handleCreateCertificate} style={{ padding: '16px' }}>
              {formError && (
                <div style={{ background: '#FFF4E5', border: '1px solid #FFCC80', borderLeft: '4px solid #CC6600', padding: '8px 10px', fontSize: '12px', color: '#7a3e00', marginBottom: '12px' }}>
                  {formError}
                </div>
              )}
              {formSuccess && (
                <div style={{ background: '#EAF7EA', border: '1px solid #94C994', borderLeft: '4px solid #008000', padding: '8px 10px', fontSize: '12px', color: '#006400', marginBottom: '12px' }}>
                  {formSuccess}
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '12.5px' }}>
                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Cơ sở kinh doanh <span style={{ color: '#CC0000' }}>*</span></label>
                  {loadingBiz ? (
                    <div style={{ color: '#888' }}>Đang tải danh sách cơ sở...</div>
                  ) : (
                    <select
                      value={selectedCoSo}
                      onChange={e => setSelectedCoSo(e.target.value)}
                      style={{ width: '100%', height: '30px', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '0 8px', outline: 'none' }}
                      required
                    >
                      <option value="">-- Chọn cơ sở kinh doanh --</option>
                      {businesses.map(b => (
                        <option key={b.maCoSo} value={b.maCoSo}>{b.tenCoSo} ({b.maCoSo})</option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Tên/Loại chứng nhận <span style={{ color: '#CC0000' }}>*</span></label>
                  <input
                    type="text"
                    value={tenChungNhan}
                    onChange={e => setTenChungNhan(e.target.value)}
                    style={{ width: '100%', height: '30px', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '0 8px', outline: 'none', boxSizing: 'border-box' }}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Ngày ban hành <span style={{ color: '#CC0000' }}>*</span></label>
                    <input
                      type="date"
                      value={ngayBanHanh}
                      onChange={e => setNgayBanHanh(e.target.value)}
                      style={{ width: '100%', height: '30px', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '0 8px', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Ngày hết hạn <span style={{ color: '#CC0000' }}>*</span></label>
                    <input
                      type="date"
                      value={ngayHetHan}
                      onChange={e => setNgayHetHan(e.target.value)}
                      style={{ width: '100%', height: '30px', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '0 8px', outline: 'none', boxSizing: 'border-box' }}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontWeight: 600, marginBottom: '4px' }}>Trạng thái cấp <span style={{ color: '#CC0000' }}>*</span></label>
                  <select
                    value={trangThai}
                    onChange={e => setTrangThai(e.target.value)}
                    style={{ width: '100%', height: '30px', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '0 8px', outline: 'none' }}
                    required
                  >
                    <option value="Cap moi">Cấp mới</option>
                    <option value="Gia han">Gia hạn</option>
                    <option value="Thu hoi">Thu hồi</option>
                  </select>
                </div>
              </div>

              {/* Modal footer */}
              <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
                <GovBtn variant="secondary" onClick={() => setIsCreateModalOpen(false)}>Hủy</GovBtn>
                <GovBtn variant="primary" type="submit">
                  Xác nhận cấp mới
                </GovBtn>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}