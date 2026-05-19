'use client';

import { useState } from 'react';
import { useRole } from '@/lib/RoleContext';
import { Eye, FileSpreadsheet, Printer, RefreshCw, Plus } from 'lucide-react';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';
import DataTable, { Column } from '@/components/DataTable';

interface ViolationApproval {
  id: string;
  businessName: string;
  violation: string;
  inspectionReport: string;
  proposedPenalty: string;
  date: string;
  status: 'pending' | 'approved';
}

const initialMockData: ViolationApproval[] = [
  {
    id: 'VP-2025004',
    businessName: 'Quán Bún Chả Hà Nội',
    violation: 'Bán thực phẩm không đảm bảo an toàn, sử dụng nguyên liệu không rõ nguồn gốc',
    inspectionReport: 'BB-KD-280325',
    proposedPenalty: '32.000.000 ₫',
    date: '28/03/2025',
    status: 'pending',
  },
  {
    id: 'VP-2025005',
    businessName: 'Siêu thị Mini Mart ABC',
    violation: 'Hàng hóa hết hạn vẫn bày bán trên kệ',
    inspectionReport: 'BB-KD-290325',
    proposedPenalty: '18.000.000 ₫',
    date: '29/03/2025',
    status: 'pending',
  },
  {
    id: 'VP-2025007',
    businessName: 'Nhà hàng Hải Sản Đại Dương',
    violation: 'Vi phạm vệ sinh an toàn thực phẩm mức nghiêm trọng',
    inspectionReport: 'BB-KD-300325',
    proposedPenalty: '50.000.000 ₫',
    date: '30/03/2025',
    status: 'pending',
  },
];

export default function PheDuyetDonViPhamPage() {
  const { role } = useRole();

  const [violations, setViolations] = useState<ViolationApproval[]>(initialMockData);
  const [search, setSearch] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState('');
  const [feedbackMessage, setFeedbackMessage] = useState('');

  const pendingViolations = violations.filter(v => v.status === 'pending');

  const filteredViolations = pendingViolations.filter(v =>
    !search ||
    v.id.toLowerCase().includes(search.toLowerCase()) ||
    v.businessName.toLowerCase().includes(search.toLowerCase()) ||
    v.violation.toLowerCase().includes(search.toLowerCase())
  );

  const isAuthority = role === 'AUTHORITY';

  // === TEXT THEO ROLE ===
  const pageTitle = isAuthority ? 'Phê duyệt đơn vi phạm & Xử phạt' : 'Gửi kết quả kiểm tra vi phạm';
  const pageSubtitle = isAuthority
    ? 'Xem xét và ban hành quyết định xử phạt hành chính'
    : 'Xử lý và gửi kết quả vi phạm đến cơ quan thẩm quyền';

  const actionText = isAuthority ? 'ban hành quyết định' : 'gửi kết quả';
  const successMessage = isAuthority
    ? 'Đã phê duyệt và ban hành quyết định xử phạt thành công!'
    : 'Đã gửi kết quả thành công!';

  const totalPenalty = pendingViolations.reduce((sum, v) => {
    const num = parseInt(v.proposedPenalty.replace(/\D/g, ''), 10);
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const handleAction = async (id: string) => {
    const violation = violations.find(v => v.id === id);
    if (!violation) return;

    if (!confirm(`Bạn có chắc muốn ${actionText} cho "${violation.businessName}"?`)) {
      return;
    }

    setApprovingId(id);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      console.log(`[${role.toUpperCase()}] ${isAuthority ? 'Phê duyệt & Ban hành' : 'Gửi kết quả'}:`, {
        id: violation.id,
        businessName: violation.businessName,
        penalty: violation.proposedPenalty,
        actionBy: role,
        timestamp: new Date().toLocaleString('vi-VN'),
      });

      setViolations(prev => prev.filter(v => v.id !== id));
      setFeedbackMessage(successMessage);
    } catch {
      alert('Có lỗi xảy ra khi thực hiện');
    } finally {
      setApprovingId(null);
    }
  };

  const columns: Column<ViolationApproval>[] = [
    {
      key: 'id',
      header: 'Mã đơn',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: r => <span style={{ fontWeight: 600 }}>{r.businessName}</span>,
    },
    {
      key: 'violation',
      header: 'Nội dung vi phạm',
      render: r => <span style={{ fontSize: '12px' }}>{r.violation}</span>,
    },
    {
      key: 'inspectionReport',
      header: 'Biên bản',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.inspectionReport}</span>,
    },
    {
      key: 'proposedPenalty',
      header: 'Mức phạt đề xuất',
      render: r => <strong style={{ color: '#CC0000' }}>{r.proposedPenalty}</strong>,
    },
    {
      key: 'date',
      header: 'Ngày lập',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.date}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => <StatusBadge variant={r.status} label={r.status === 'pending' ? 'Chờ xử lý' : 'Đã xử lý'} />,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => {
        const isApproving = approvingId === r.id;
        return (
          <ActionButtons>
            <GovBtn variant="secondary" size="sm" onClick={() => {
              alert(`Chi tiết đơn vi phạm:\n\nMã đơn: ${r.id}\nCơ sở: ${r.businessName}\nVi phạm: ${r.violation}\nBiên bản: ${r.inspectionReport}\nMức phạt đề xuất: ${r.proposedPenalty}\nNgày lập: ${r.date}`);
            }}>
              <Eye style={{ width: 12, height: 12 }} />
            </GovBtn>
            <GovBtn
              variant={isAuthority ? 'primary' : 'outline'}
              size="sm"
              onClick={() => handleAction(r.id)}
              disabled={isApproving}
            >
              {isApproving ? 'Đang xử lý...' : isAuthority ? 'Phê duyệt' : 'Gửi'}
            </GovBtn>
          </ActionButtons>
        );
      },
    },
  ];

  return (
    <div>
      <PageHeader
        title={pageTitle}
        subtitle={`Chi cục An toàn Thực phẩm TP. Đà Nẵng — ${pageSubtitle}`}
        actions={
          <>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><Printer style={{ width: 12, height: 12 }} /> In báo cáo</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            {/* {isAuthority && <GovBtn variant="primary"><Plus style={{ width: 12, height: 12 }} /> Tạo quyết định</GovBtn>} */}
          </>
        }
      />

      {feedbackMessage && <AlertBanner type="success" title={feedbackMessage} />}

      {pendingViolations.length > 0 && (
        <AlertBanner
          type="warning"
          title={`Có ${pendingViolations.length} đơn vi phạm đang chờ xử lý. Vui lòng xem xét và ban hành quyết định kịp thời.`}
        />
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Đơn chờ xử lý" value={pendingViolations.length} color="orange" />
        <MiniStat
          label="Tổng mức phạt đề xuất"
          value={`${(totalPenalty / 1_000_000).toFixed(0)}M ₫`}
          color="red"
        />
        <MiniStat label="Đã xử lý" value={violations.filter(v => v.status === 'approved').length} color="green" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput
            placeholder="Mã đơn, tên cơ sở, nội dung..."
            value={search}
            onChange={setSearch}
            width={240}
          />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect
            value={statusFilter}
            onChange={setStatusFilter}
            options={[
              { value: '', label: '-- Tất cả --' },
              { value: 'pending', label: 'Chờ xử lý' },
              { value: 'approved', label: 'Đã xử lý' },
            ]}
            width={160}
          />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Đơn xử phạt chờ xử lý (${filteredViolations.length} đơn)`}
        footer={<GovPagination info={`Hiển thị ${filteredViolations.length} / ${pendingViolations.length} đơn vi phạm`} />}
      >
        <DataTable
          columns={columns}
          data={filteredViolations}
          emptyMessage="Không có đơn vi phạm nào chờ xử lý."
        />
      </SectionCard>

      <p style={{ fontSize: '12px', color: '#888', textAlign: 'center', marginTop: '8px' }}>
        Chỉ hiển thị các đơn đang chờ xử lý — Hệ thống sẽ tự động lưu lịch sử khi thực hiện
      </p>
    </div>
  );
}
