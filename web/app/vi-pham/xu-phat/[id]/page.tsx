'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, FileSpreadsheet, Pencil, CreditCard } from 'lucide-react';
import {
  PageHeader, GovBtn, SectionCard, StatusBadge, ActionButtons, FormSection, FormField, MiniStat,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

interface Penalty {
  id: string;
  businessName: string;
  violationType: string;
  penaltyAmount: string;
  decisionDate: string;
  paymentDeadline: string;
  status: 'pending' | 'paid' | 'overdue';
  district: string;
  address: string;
  inspector: string;
  decisionNumber: string;
  legalBasis: string;
}

const mockPenalties: Penalty[] = [
  {
    id: 'XP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh ATTP mức nghiêm trọng',
    penaltyAmount: '45.000.000 ₫',
    decisionDate: '18/03/2025',
    paymentDeadline: '01/04/2025',
    status: 'paid',
    district: 'Hải Châu',
    address: '123 Trần Phú, Hải Châu, Đà Nẵng',
    inspector: 'Nguyễn Văn Trần',
    decisionNumber: 'QĐ-XP-2025/HC-001',
    legalBasis: 'Điều 5, Nghị định 115/2018/NĐ-CP',
  },
  {
    id: 'XP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá',
    penaltyAmount: '8.000.000 ₫',
    decisionDate: '12/03/2025',
    paymentDeadline: '26/03/2025',
    status: 'pending',
    district: 'Thanh Khê',
    address: '45 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
    inspector: 'Lê Thị Mai',
    decisionNumber: 'QĐ-XP-2025/HC-002',
    legalBasis: 'Điều 18, Nghị định 115/2018/NĐ-CP',
  },
  {
    id: 'XP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng nguyên liệu không rõ nguồn gốc',
    penaltyAmount: '25.000.000 ₫',
    decisionDate: '25/03/2025',
    paymentDeadline: '08/04/2025',
    status: 'overdue',
    district: 'Ngũ Hành Sơn',
    address: '78 Nguyễn Tất Thành, Ngũ Hành Sơn, Đà Nẵng',
    inspector: 'Phạm Văn Đức',
    decisionNumber: 'QĐ-XP-2025/HC-003',
    legalBasis: 'Điều 10, Nghị định 115/2018/NĐ-CP',
  },
];

const statusVariant: Record<string, string> = {
  pending: 'pending',
  paid: 'resolved',
  overdue: 'open',
};
const statusLabel: Record<string, string> = {
  pending: 'Chưa nộp phạt',
  paid: 'Đã nộp phạt',
  overdue: 'Quá hạn nộp',
};

export default function XuPhatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [penalty, setPenalty] = useState<Penalty | null>(null);

  useEffect(() => {
    const found = mockPenalties.find(p => p.id === id);
    setPenalty(found || null);
  }, [id]);

  if (!penalty) {
    return (
      <div>
        <PageHeader
          title="Không tìm thấy quyết định xử phạt"
          subtitle={`Không tìm thấy quyết định mã: ${id}`}
          actions={
            <GovBtn variant="secondary" onClick={() => router.push('/vi-pham/xu-phat')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại danh sách
            </GovBtn>
          }
        />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Quyết định xử phạt — ${penalty.id}`}
        subtitle={`Chi cục An toàn Thực phẩm TP. Đà Nẵng — ${penalty.decisionNumber}`}
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/vi-pham/xu-phat')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer style={{ width: 12, height: 12 }} /> In quyết định
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất PDF
            </GovBtn>
            <GovBtn variant="outline">
              <Pencil style={{ width: 12, height: 12 }} /> Chỉnh sửa
            </GovBtn>
            {penalty.status !== 'paid' && (
              <GovBtn variant="primary">
                <CreditCard style={{ width: 12, height: 12 }} /> Xác nhận đã nộp
              </GovBtn>
            )}
          </ActionButtons>
        }
      />

      {penalty.status === 'overdue' && (
        <AlertBanner
          type="danger"
          title={`Quyết định xử phạt ${penalty.id} đã quá hạn nộp phạt! Cần xử lý khẩn cấp.`}
        />
      )}

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Số quyết định" value={penalty.decisionNumber} color="neutral" />
        <MiniStat label="Mức phạt" value={penalty.penaltyAmount} color="red" />
        <MiniStat label="Ngày ra quyết định" value={penalty.decisionDate} color="blue" />
        <MiniStat label="Hạn nộp phạt" value={penalty.paymentDeadline} color={penalty.status === 'overdue' ? 'red' : 'orange'} />
      </div>

      {/* Trạng thái */}
      <SectionCard title="Trạng thái thanh toán">
        <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
          <StatusBadge variant={statusVariant[penalty.status]} label={statusLabel[penalty.status]} />
          <span style={{ fontSize: '12px', color: '#555' }}>
            {penalty.status === 'pending' ? `Cơ sở phải nộp phạt trước ngày ${penalty.paymentDeadline}.` :
             penalty.status === 'paid' ? 'Cơ sở đã hoàn thành nghĩa vụ nộp phạt theo quyết định.' :
             `Đã quá hạn nộp phạt (${penalty.paymentDeadline}). Cần áp dụng biện pháp cưỡng chế.`}
          </span>
        </div>
      </SectionCard>

      {/* Chi tiết quyết định */}
      <SectionCard title="Thông tin chi tiết quyết định xử phạt">
        <div style={{ padding: '14px 12px' }}>
          <FormSection title="Thông tin cơ sở vi phạm">
            <FormField label="Tên cơ sở kinh doanh">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontWeight: 600 }}>
                {penalty.businessName}
              </div>
            </FormField>
            <FormField label="Địa chỉ cơ sở">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px' }}>
                {penalty.address}
              </div>
            </FormField>
            <FormField label="Quận/Huyện">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px' }}>
                {penalty.district}
              </div>
            </FormField>
            <FormField label="Người ký quyết định">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px' }}>
                {penalty.inspector}
              </div>
            </FormField>
          </FormSection>

          <FormSection title="Nội dung xử phạt">
            <FormField label="Hành vi vi phạm" fullWidth>
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontWeight: 600 }}>
                {penalty.violationType}
              </div>
            </FormField>
            <FormField label="Mức phạt tiền">
              <div style={{ padding: '6px 8px', background: '#FFF0F0', border: '1px solid #F5BCBC', borderRadius: '2px', fontSize: '16px', fontWeight: 700, color: '#CC0000' }}>
                {penalty.penaltyAmount}
              </div>
            </FormField>
            <FormField label="Căn cứ pháp lý">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontStyle: 'italic' }}>
                {penalty.legalBasis}
              </div>
            </FormField>
            <FormField label="Ngày ra quyết định">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600 }}>
                {penalty.decisionDate}
              </div>
            </FormField>
            <FormField label="Hạn nộp phạt">
              <div style={{
                padding: '6px 8px',
                background: penalty.status === 'overdue' ? '#FFF0F0' : '#F5F5F5',
                border: `1px solid ${penalty.status === 'overdue' ? '#F5BCBC' : '#D6D6D6'}`,
                borderRadius: '2px', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600,
                color: penalty.status === 'overdue' ? '#CC0000' : '#222',
              }}>
                {penalty.paymentDeadline}
              </div>
            </FormField>
          </FormSection>
        </div>
      </SectionCard>

      {/* Căn cứ pháp lý */}
      <SectionCard title="Căn cứ pháp lý ban hành quyết định">
        <div style={{ padding: '12px' }}>
          {[
            'Luật An toàn thực phẩm số 55/2010/QH12 ngày 17/6/2010',
            'Nghị định số 115/2018/NĐ-CP quy định xử phạt vi phạm hành chính về an toàn thực phẩm',
            'Nghị định số 128/2020/NĐ-CP sửa đổi, bổ sung một số điều của Nghị định 115/2018/NĐ-CP',
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '8px', padding: '6px 0', borderBottom: i < 2 ? '1px solid #F0F0F0' : 'none' }}>
              <span style={{ width: '6px', height: '6px', background: '#008000', borderRadius: '1px', flexShrink: 0, marginTop: '5px' }} />
              <span style={{ fontSize: '12.5px', color: '#333' }}>{item}</span>
            </div>
          ))}
        </div>
      </SectionCard>

      <p style={{ fontSize: '11.5px', color: '#888', textAlign: 'center', marginTop: '8px' }}>
        Quyết định xử phạt được ban hành theo thẩm quyền của Chi cục trưởng Chi cục An toàn Thực phẩm TP. Đà Nẵng
      </p>
    </div>
  );
}