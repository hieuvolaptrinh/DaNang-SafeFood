'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Eye, Check, X, FileSpreadsheet, RefreshCw } from 'lucide-react';
import { useRole } from '@/lib/RoleContext';
import DataTable, { Column } from '@/components/DataTable';
import { PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn, SectionCard, GovPagination, StatusBadge, MiniStat } from '@/components/GovUI';

interface Certificate {
  id: string;
  businessName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
}

const mockCertificates: Certificate[] = [
  { id: 'CN-2025001', businessName: 'Nhà hàng Hải Sản Biển Xanh', type: 'Chứng nhận ATTP', issueDate: '15/01/2025', expiryDate: '14/01/2026', status: 'approved', approver: 'Nguyễn Văn A' },
  { id: 'CN-2025002', businessName: 'Quán Ăn Gia Đình Việt',       type: 'Chứng nhận VSATTP', issueDate: '20/02/2025', expiryDate: '19/02/2026', status: 'pending', approver: '' },
  { id: 'CN-2025003', businessName: 'Cửa hàng Thực phẩm Sạch Organic', type: 'Chứng nhận ATTP', issueDate: '05/03/2025', expiryDate: '04/03/2026', status: 'rejected', approver: 'Trần Thị B' },
  { id: 'CN-2025004', businessName: 'Siêu thị Mini Mart Đà Nẵng',  type: 'Chứng nhận ATTP', issueDate: '10/01/2025', expiryDate: '09/01/2026', status: 'approved', approver: 'Lê Văn C' },
];

const certStatusMap: Record<string, string> = {
  approved: 'pass',
  pending:  'pending',
  rejected: 'fail',
};

export default function PheDuyetChungNhanPage() {
  const { role } = useRole();
  const [search, setSearch]           = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [data, setData]               = useState(mockCertificates);

  // Modal state
  const [isModalOpen, setIsModalOpen]   = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [actionType, setActionType]     = useState<'approved' | 'rejected' | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = data.filter((c) => {
    const matchSearch = !search || c.id.toLowerCase().includes(search.toLowerCase()) || c.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openActionModal = (cert: Certificate, type: 'approved' | 'rejected') => {
    setSelectedCert(cert);
    setActionType(type);
    setRejectReason('');
    setIsModalOpen(true);
  };

  const handleApproveReject = () => {
    if (!selectedCert || !actionType) return;
    const currentUser = role === 'LD_ATVSTP' ? 'Trần Thị Thẩm Quyền' : 'Nguyễn Văn Trần';
    setData(prev => prev.map(item =>
      item.id === selectedCert.id ? { ...item, status: actionType, approver: currentUser } : item
    ));
    setIsModalOpen(false);
    setSelectedCert(null);
    setActionType(null);
    setRejectReason('');
  };

  const columns: Column<Certificate>[] = [
    {
      key: 'id',
      header: 'Mã chứng nhận',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: r => <span style={{ fontWeight: 600 }}>{r.businessName}</span>,
    },
    { key: 'type', header: 'Loại chứng nhận' },
    {
      key: 'issueDate',
      header: 'Ngày cấp',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.issueDate}</span>,
    },
    {
      key: 'expiryDate',
      header: 'Ngày hết hạn',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.expiryDate}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={certStatusMap[r.status] ?? r.status} />,
    },
    {
      key: 'approver',
      header: 'Người duyệt',
      render: r => <span style={{ color: r.approver ? '#222' : '#AAA', fontStyle: r.approver ? 'normal' : 'italic' }}>{r.approver || '—'}</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <div style={{ display: 'flex', gap: '3px' }}>
          <Link href={`/co-so-kinh-doanh/chung-nhan/${r.id}`}>
            <GovBtn variant="secondary" size="sm" title="Xem chi tiết"><Eye style={{ width: 12, height: 12 }} /></GovBtn>
          </Link>
          {r.status === 'pending' && (
            <>
              <GovBtn variant="primary" size="sm" title="Phê duyệt" onClick={() => openActionModal(r, 'approved')}>
                <Check style={{ width: 12, height: 12 }} />
              </GovBtn>
              <GovBtn variant="danger" size="sm" title="Từ chối" onClick={() => openActionModal(r, 'rejected')}>
                <X style={{ width: 12, height: 12 }} />
              </GovBtn>
            </>
          )}
        </div>
      ),
    },
  ];

  const approvedCount = data.filter(c => c.status === 'approved').length;
  const pendingCount  = data.filter(c => c.status === 'pending').length;
  const rejectedCount = data.filter(c => c.status === 'rejected').length;

  return (
    <div>
      <PageHeader
        title="Phê duyệt chứng nhận an toàn thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Quản lý và phê duyệt chứng nhận ATTP"
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
          </>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng chứng nhận" value="1.284" color="neutral" />
        <MiniStat label="Đã phê duyệt" value={approvedCount} color="green" />
        <MiniStat label="Chờ duyệt" value={pendingCount} color="orange" note="Cần xử lý" />
        <MiniStat label="Từ chối" value={rejectedCount} color="red" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Mã, tên cơ sở..." value={search} onChange={setSearch} width={220} />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect value={statusFilter} onChange={setStatusFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'pending',  label: 'Chờ duyệt' },
            { value: 'approved', label: 'Đã phê duyệt' },
            { value: 'rejected', label: 'Từ chối' },
          ]} width={160} />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách chứng nhận ATTP (${filtered.length} bản ghi)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${data.length} chứng nhận`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy chứng nhận nào phù hợp."
        />
      </SectionCard>

      {/* Government-style approval modal */}
      {isModalOpen && selectedCert && actionType && (
        <div
          style={{
            position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999,
          }}
        >
          <div style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '2px', width: '480px', overflow: 'hidden', boxShadow: '0 4px 16px rgba(0,0,0,0.2)' }}>
            {/* Modal header */}
            <div style={{ background: actionType === 'approved' ? '#006400' : '#CC0000', padding: '10px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ color: '#fff', fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', margin: 0 }}>
                {actionType === 'approved' ? 'Xác nhận phê duyệt chứng nhận' : 'Xác nhận từ chối chứng nhận'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} style={{ color: '#fff', background: 'none', border: 'none', cursor: 'pointer', fontSize: '18px', lineHeight: 1 }}>×</button>
            </div>

            {/* Modal body */}
            <div style={{ padding: '16px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12.5px', marginBottom: '12px' }}>
                <tbody>
                  {[['Mã chứng nhận', selectedCert.id], ['Cơ sở', selectedCert.businessName], ['Loại', selectedCert.type]].map(([label, value]) => (
                    <tr key={label}>
                      <td style={{ border: '1px solid #D6D6D6', padding: '5px 10px', background: '#F5F5F5', fontWeight: 600, width: '140px', color: '#555' }}>{label}</td>
                      <td style={{ border: '1px solid #D6D6D6', padding: '5px 10px' }}>{value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {actionType === 'rejected' && (
                <div>
                  <label style={{ display: 'block', fontSize: '12.5px', fontWeight: 600, marginBottom: '4px', color: '#333' }}>
                    Lý do từ chối <span style={{ color: '#CC0000' }}>*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={e => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    style={{ width: '100%', height: '80px', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '6px 8px', fontSize: '12.5px', fontFamily: 'inherit', resize: 'vertical', boxSizing: 'border-box' }}
                  />
                </div>
              )}
            </div>

            {/* Modal footer */}
            <div style={{ padding: '8px 16px', background: '#F5F5F5', borderTop: '1px solid #D6D6D6', display: 'flex', justifyContent: 'flex-end', gap: '8px' }}>
              <GovBtn variant="secondary" onClick={() => setIsModalOpen(false)}>Hủy</GovBtn>
              <GovBtn
                variant={actionType === 'approved' ? 'primary' : 'danger'}
                onClick={handleApproveReject}
                disabled={actionType === 'rejected' && !rejectReason.trim()}
              >
                {actionType === 'approved' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}
              </GovBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}