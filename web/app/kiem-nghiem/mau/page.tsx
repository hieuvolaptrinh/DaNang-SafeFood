'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Eye, RefreshCw, FileSpreadsheet, Printer, FlaskConical } from 'lucide-react';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import DataTable, { Column } from '@/components/DataTable';
import AlertBanner from '@/components/AlertBanner';

interface MauKiemNghiem {
  id: string;
  businessName: string;
  sampleType: string;
  collectedDate: string;
  collectedBy: string;
  lab: string;
  status: 'received' | 'testing' | 'completed' | 'cancelled';
  result?: 'pass' | 'fail';
  inspectionId: string;
}


const mockMau: MauKiemNghiem[] = [
  {
    id: 'MKN-2025001',
    businessName: 'Nhà hàng Phở Ba Miền',
    sampleType: 'Nước uống',
    collectedDate: '10/01/2025',
    collectedBy: 'Nguyễn Văn Trần',
    lab: 'Phòng xét nghiệm Sở Y tế',
    status: 'completed',
    result: 'pass',
    inspectionId: 'INS-2847',
  },
  {
    id: 'MKN-2025002',
    businessName: 'Công ty Hải Sản Đà Nẵng',
    sampleType: 'Hải sản tươi sống',
    collectedDate: '09/01/2025',
    collectedBy: 'Lê Thị Mai',
    lab: 'Trung tâm Kiểm nghiệm thực phẩm',
    status: 'completed',
    result: 'fail',
    inspectionId: 'INS-2846',
  },
  {
    id: 'MKN-2025003',
    businessName: 'Chợ Tươi Đà Nẵng',
    sampleType: 'Rau củ quả',
    collectedDate: '08/01/2025',
    collectedBy: 'Phạm Văn Đức',
    lab: 'Trung tâm Kiểm nghiệm thực phẩm',
    status: 'completed',
    result: 'pass',
    inspectionId: 'INS-2845',
  },
  {
    id: 'MKN-2025004',
    businessName: 'Bánh Mì Hội An',
    sampleType: 'Bột mì & phụ gia',
    collectedDate: '20/12/2024',
    collectedBy: 'Phạm Văn Đức',
    lab: 'Phòng xét nghiệm Sở Y tế',
    status: 'testing',
    inspectionId: 'INS-2842',
  },
  {
    id: 'MKN-2025005',
    businessName: 'Cà Phê Thu Hiền',
    sampleType: 'Cà phê & đồ uống',
    collectedDate: '28/12/2024',
    collectedBy: 'Nguyễn Văn Trần',
    lab: 'Trung tâm Kiểm nghiệm thực phẩm',
    status: 'received',
    inspectionId: 'INS-2841',
  },
];



const statusVariant: Record<string, string> = {
  received: 'pending',
  testing: 'in-progress',
  completed: 'resolved',
  cancelled: 'expired',
};
const statusLabel: Record<string, string> = {
  received: 'Đã tiếp nhận',
  testing: 'Đang kiểm nghiệm',
  completed: 'Hoàn thành',
  cancelled: 'Hủy bỏ',
};

export default function MauKiemNghiemPage() {
  const [mauList, setMauList] = useState<MauKiemNghiem[]>(mockMau);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [resultFilter, setResultFilter] = useState('');

  const filtered = mauList.filter(m => {
    const matchSearch = !search ||
      m.id.toLowerCase().includes(search.toLowerCase()) ||
      m.businessName.toLowerCase().includes(search.toLowerCase()) ||
      m.sampleType.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || m.status === statusFilter;
    const matchResult = !resultFilter || m.result === resultFilter;
    return matchSearch && matchStatus && matchResult;
  });

  const completedCount = mauList.filter(m => m.status === 'completed').length;
  const testingCount = mauList.filter(m => m.status === 'testing').length;
  const receivedCount = mauList.filter(m => m.status === 'received').length;
  const failCount = mauList.filter(m => m.result === 'fail').length;

  const columns: Column<MauKiemNghiem>[] = [
    {
      key: 'id',
      header: 'Mã mẫu',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'businessName',
      header: 'Cơ sở lấy mẫu',
      render: r => (
        <div>
          <p style={{ fontWeight: 600, fontSize: '13px', color: '#222' }}>{r.businessName}</p>
          <p style={{ fontSize: '11px', color: '#888' }}>Mã TT: {r.inspectionId}</p>
        </div>
      ),
    },
    {
      key: 'sampleType',
      header: 'Loại mẫu',
      render: r => (
        <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', fontSize: '12px', fontWeight: 500, color: '#333' }}>
          <FlaskConical style={{ width: 12, height: 12, color: '#005A9E' }} />
          {r.sampleType}
        </span>
      ),
    },
    {
      key: 'collectedDate',
      header: 'Ngày lấy mẫu',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.collectedDate}</span>,
    },
    {
      key: 'collectedBy',
      header: 'Người lấy mẫu',
      render: r => <span style={{ fontSize: '12px' }}>{r.collectedBy}</span>,
    },
    {
      key: 'lab',
      header: 'Đơn vị kiểm nghiệm',
      render: r => <span style={{ fontSize: '12px', color: '#555' }}>{r.lab}</span>,
    },
    {
      key: 'status',
      header: 'Trạng thái',
      render: r => (
        <select
          value={r.status}
          onChange={(e) => handleStatusChange(r.id, e.target.value as MauKiemNghiem['status'])}
          style={{
            padding: '6px 10px',
            borderRadius: '8px',
            border: '1px solid #d0d7de',
            fontSize: '12px',
            fontWeight: 600,
            background: '#fff',
            cursor: 'pointer',
            color:
              r.status === 'completed'
                ? '#15803d'
                : r.status === 'testing'
                  ? '#c2410c'
                  : '#005A9E',
          }}
        >
          <option value="received">Đã tiếp nhận</option>
          <option value="testing">Đang kiểm nghiệm</option>
          <option value="completed">Hoàn thành</option>
        </select>
      ),
    },
    // {
    //   key: 'result',
    //   header: 'Kết quả',
    //   render: r => r.result
    //     ? <StatusBadge variant={r.result} />
    //     : <span style={{ fontSize: '11px', color: '#888' }}>Chưa có</span>,
    // },
    {
      key: 'actions',
      header: 'Thao tác',
      render: r => (
        <ActionButtons>
          <Link href={`/kiem-nghiem/mau/${r.id}`}>
            <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
              <Eye style={{ width: 12, height: 12 }} />
            </GovBtn>
          </Link>
        </ActionButtons>
      ),
    },
  ];
  const handleStatusChange = (
  id: string,
  newStatus: MauKiemNghiem['status']
) => {
  setMauList(prev =>
    prev.map(item =>
      item.id === id
        ? { ...item, status: newStatus }
        : item
    )
  );
};

  return (
    <div>
      <PageHeader
        title="Quản lý mẫu kiểm nghiệm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Tiếp nhận và theo dõi mẫu kiểm nghiệm thực phẩm"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><Printer style={{ width: 12, height: 12 }} /> In báo cáo</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
          </ActionButtons>
        }
      />

      {failCount > 0 && (
        <AlertBanner
          type="warning"
          title={`${failCount} mẫu kiểm nghiệm không đạt yêu cầu ATTP. Cần xem xét và lập biên bản xử lý.`}
        />
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng mẫu" value={mauList.length} color="neutral" />
        <MiniStat label="Đã tiếp nhận" value={receivedCount} color="blue" />
        <MiniStat label="Đang kiểm nghiệm" value={testingCount} color="orange" />
        <MiniStat label="Hoàn thành" value={completedCount} color="green" />
        <MiniStat label="Không đạt" value={failCount} color="red" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Mã mẫu, cơ sở, loại mẫu..." value={search} onChange={setSearch} width={240} />
        </FilterField>
        <FilterField label="Trạng thái">
          <GovSelect value={statusFilter} onChange={setStatusFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'received', label: 'Đã tiếp nhận' },
            { value: 'testing', label: 'Đang kiểm nghiệm' },
            { value: 'completed', label: 'Hoàn thành' },
            { value: 'cancelled', label: 'Hủy bỏ' },
          ]} width={180} />
        </FilterField>
        <FilterField label="Kết quả">
          <GovSelect value={resultFilter} onChange={setResultFilter} options={[
            { value: '', label: '-- Tất cả --' },
            { value: 'pass', label: 'Đạt' },
            { value: 'fail', label: 'Không đạt' },
          ]} width={140} />
        </FilterField>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px' }}>
          <GovBtn variant="primary">Tìm kiếm</GovBtn>
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setStatusFilter(''); setResultFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Table */}
      <SectionCard
        title={`Danh sách mẫu kiểm nghiệm (${filtered.length} mẫu)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${mauList.length} mẫu kiểm nghiệm`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy mẫu kiểm nghiệm nào phù hợp điều kiện."
        />
      </SectionCard>
    </div>
  );
}
