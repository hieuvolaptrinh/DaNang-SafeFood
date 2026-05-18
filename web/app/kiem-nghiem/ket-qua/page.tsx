'use client';

import { useState } from 'react';
import { Plus, Eye, RefreshCw, FileSpreadsheet, Printer, FlaskConical } from 'lucide-react';
import {
  PageHeader, FilterBar, FilterField, GovInput, GovSelect, GovBtn,
  SectionCard, GovPagination, StatusBadge, MiniStat, ActionButtons,
} from '@/components/GovUI';
import DataTable, { Column } from '@/components/DataTable';
import AlertBanner from '@/components/AlertBanner';

interface KetQuaKiemNghiem {
  id: string;
  mauId: string;
  businessName: string;
  sampleType: string;
  testDate: string;
  testedBy: string;
  criteria: string;
  result: 'pass' | 'fail';
  deviation?: string;
  certNo?: string;
}

const mockKetQua: KetQuaKiemNghiem[] = [
  {
    id: 'KQ-2025001',
    mauId: 'MKN-2025001',
    businessName: 'Nhà hàng Phở Ba Miền',
    sampleType: 'Nước uống',
    testDate: '14/01/2025',
    testedBy: 'Hoàng Kiểm Nghiệm',
    criteria: 'TCVN 6096:2004 — Nước uống đóng chai',
    result: 'pass',
    certNo: 'CN-KN-2025/001',
  },
  {
    id: 'KQ-2025002',
    mauId: 'MKN-2025002',
    businessName: 'Công ty Hải Sản Đà Nẵng',
    sampleType: 'Hải sản tươi sống',
    testDate: '13/01/2025',
    testedBy: 'Hoàng Kiểm Nghiệm',
    criteria: 'QCVN 8-3:2012/BYT — Giới hạn ô nhiễm vi sinh vật',
    result: 'fail',
    deviation: 'Phát hiện Salmonella vượt ngưỡng cho phép (MPN/g). Mẫu không đạt QCVN.',
  },
  {
    id: 'KQ-2025003',
    mauId: 'MKN-2025003',
    businessName: 'Chợ Tươi Đà Nẵng',
    sampleType: 'Rau củ quả',
    testDate: '11/01/2025',
    testedBy: 'Hoàng Kiểm Nghiệm',
    criteria: 'QCVN 8-2:2011/BYT — Giới hạn ô nhiễm kim loại nặng',
    result: 'pass',
    certNo: 'CN-KN-2025/002',
  },
];

export default function KetQuaKiemNghiemPage() {
  const [search, setSearch] = useState('');
  const [resultFilter, setResultFilter] = useState('');

  const filtered = mockKetQua.filter(kq => {
    const matchSearch = !search ||
      kq.id.toLowerCase().includes(search.toLowerCase()) ||
      kq.businessName.toLowerCase().includes(search.toLowerCase()) ||
      kq.mauId.toLowerCase().includes(search.toLowerCase());
    const matchResult = !resultFilter || kq.result === resultFilter;
    return matchSearch && matchResult;
  });

  const passCount = mockKetQua.filter(kq => kq.result === 'pass').length;
  const failCount = mockKetQua.filter(kq => kq.result === 'fail').length;

  const columns: Column<KetQuaKiemNghiem>[] = [
    {
      key: 'id',
      header: 'Mã kết quả',
      render: r => <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>{r.id}</span>,
    },
    {
      key: 'mauId',
      header: 'Mã mẫu',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#333' }}>{r.mauId}</span>,
    },
    {
      key: 'businessName',
      header: 'Cơ sở',
      render: r => (
        <div>
          <p style={{ fontWeight: 600, fontSize: '13px', color: '#222' }}>{r.businessName}</p>
          <p style={{ fontSize: '11px', color: '#888', display: 'flex', alignItems: 'center', gap: '3px' }}>
            <FlaskConical style={{ width: 10, height: 10 }} /> {r.sampleType}
          </p>
        </div>
      ),
    },
    {
      key: 'criteria',
      header: 'Tiêu chuẩn áp dụng',
      render: r => <span style={{ fontSize: '11.5px', color: '#333', fontStyle: 'italic' }}>{r.criteria}</span>,
    },
    {
      key: 'testDate',
      header: 'Ngày kiểm nghiệm',
      render: r => <span style={{ fontFamily: 'monospace', fontSize: '12px' }}>{r.testDate}</span>,
    },
    {
      key: 'testedBy',
      header: 'Kiểm nghiệm viên',
      render: r => <span style={{ fontSize: '12px' }}>{r.testedBy}</span>,
    },
    {
      key: 'result',
      header: 'Kết quả',
      render: r => <StatusBadge variant={r.result} />,
    },
    {
      key: 'certNo',
      header: 'Số chứng nhận',
      render: r => r.certNo
        ? <span style={{ fontFamily: 'monospace', fontSize: '12px', color: '#006400', fontWeight: 600 }}>{r.certNo}</span>
        : <span style={{ fontSize: '11px', color: '#CC0000' }}>Không đạt</span>,
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: () => (
        <ActionButtons>
          <GovBtn variant="secondary" size="sm" title="Xem chi tiết">
            <Eye style={{ width: 12, height: 12 }} />
          </GovBtn>
          <GovBtn variant="secondary" size="sm" title="In kết quả">
            <Printer style={{ width: 12, height: 12 }} />
          </GovBtn>
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
            <GovBtn variant="secondary"><RefreshCw style={{ width: 12, height: 12 }} /> Làm mới</GovBtn>
            <GovBtn variant="secondary"><Printer style={{ width: 12, height: 12 }} /> In báo cáo</GovBtn>
            <GovBtn variant="secondary"><FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel</GovBtn>
            <GovBtn variant="primary"><Plus style={{ width: 12, height: 12 }} /> Nhập kết quả mới</GovBtn>
          </ActionButtons>
        }
      />

      {failCount > 0 && (
        <AlertBanner
          type="danger"
          title={`${failCount} kết quả kiểm nghiệm KHÔNG ĐẠT. Cần lập biên bản xử lý vi phạm ngay.`}
        />
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Tổng kết quả" value={mockKetQua.length} color="neutral" />
        <MiniStat label="Đạt yêu cầu" value={passCount} color="green" />
        <MiniStat label="Không đạt" value={failCount} color="red" />
        <MiniStat label="Tỷ lệ đạt" value={`${Math.round((passCount / mockKetQua.length) * 100)}%`} color="blue" />
      </div>

      {/* Filter */}
      <FilterBar>
        <FilterField label="Tìm kiếm">
          <GovInput placeholder="Mã kết quả, mã mẫu, cơ sở..." value={search} onChange={setSearch} width={240} />
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
          <GovBtn variant="secondary" onClick={() => { setSearch(''); setResultFilter(''); }}>Xóa lọc</GovBtn>
        </div>
      </FilterBar>

      {/* Bảng kết quả */}
      <SectionCard
        title={`Tổng hợp kết quả kiểm nghiệm (${filtered.length} bản ghi)`}
        footer={<GovPagination info={`Hiển thị ${filtered.length} / ${mockKetQua.length} kết quả`} />}
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy kết quả kiểm nghiệm nào."
        />
      </SectionCard>

      {/* Mẫu không đạt */}
      {failCount > 0 && (
        <SectionCard title="Chi tiết mẫu không đạt yêu cầu">
          <div style={{ padding: '0' }}>
            {mockKetQua.filter(kq => kq.result === 'fail').map((kq, i) => (
              <div key={i} style={{ padding: '10px 12px', borderBottom: '1px solid #F0F0F0', borderLeft: '3px solid #CC0000' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <p style={{ fontSize: '13px', fontWeight: 600, color: '#CC0000' }}>{kq.businessName} — {kq.sampleType}</p>
                    <p style={{ fontSize: '12px', color: '#555', marginTop: '4px' }}>{kq.deviation}</p>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#888', flexShrink: 0 }}>{kq.testDate}</span>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>
      )}
    </div>
  );
}
