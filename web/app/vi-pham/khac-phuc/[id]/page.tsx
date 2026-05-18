'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Printer, ArrowLeft, FileSpreadsheet, CheckCircle, Upload } from 'lucide-react';
import {
  PageHeader, GovBtn, SectionCard, StatusBadge, ActionButtons, FormSection, FormField, MiniStat,
} from '@/components/GovUI';

interface ViolationFix {
  id: string;
  businessName: string;
  violationType: string;
  severity: 'nhẹ' | 'trung bình' | 'nghiêm trọng';
  fixStatus: 'pending' | 'in_progress' | 'completed';
  deadline: string;
  updatedDate: string;
  address: string;
  inspector: string;
  penaltyAmount: string;
  remediation: string;
}

const mockViolationFixes: ViolationFix[] = [
  {
    id: 'VP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh an toàn thực phẩm',
    severity: 'nghiêm trọng',
    fixStatus: 'in_progress',
    deadline: '15/04/2025',
    updatedDate: '22/03/2025',
    address: '123 Trần Phú, Hải Châu, Đà Nẵng',
    inspector: 'Nguyễn Văn Trần',
    penaltyAmount: '45.000.000 ₫',
    remediation: 'Cơ sở phải vệ sinh toàn bộ khu vực chế biến, sửa chữa hệ thống làm lạnh, bổ sung nhãn truy xuất nguồn gốc cho tất cả sản phẩm.',
  },
  {
    id: 'VP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá',
    severity: 'nhẹ',
    fixStatus: 'completed',
    deadline: '10/03/2025',
    updatedDate: '08/03/2025',
    address: '45 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
    inspector: 'Lê Thị Mai',
    penaltyAmount: '3.000.000 ₫',
    remediation: 'Cơ sở phải niêm yết bảng giá tại quầy phục vụ đúng quy định.',
  },
  {
    id: 'VP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng nguyên liệu hết hạn',
    severity: 'trung bình',
    fixStatus: 'pending',
    deadline: '30/03/2025',
    updatedDate: '25/03/2025',
    address: '78 Nguyễn Tất Thành, Ngũ Hành Sơn, Đà Nẵng',
    inspector: 'Phạm Văn Đức',
    penaltyAmount: '15.000.000 ₫',
    remediation: 'Loại bỏ toàn bộ nguyên liệu hết hạn, bổ sung quy trình kiểm soát hạn dùng hàng ngày.',
  },
  {
    id: 'VP-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    violationType: 'Thiếu giấy phép kinh doanh',
    severity: 'nghiêm trọng',
    fixStatus: 'in_progress',
    deadline: '20/04/2025',
    updatedDate: '18/03/2025',
    address: '22 Hoàng Diệu, Sơn Trà, Đà Nẵng',
    inspector: 'Nguyễn Văn Trần',
    penaltyAmount: '30.000.000 ₫',
    remediation: 'Hoàn thiện hồ sơ đăng ký kinh doanh và nộp đầy đủ các giấy tờ pháp lý theo quy định.',
  },
];

const fixStatusVariant: Record<string, string> = {
  pending: 'pending',
  in_progress: 'in-progress',
  completed: 'resolved',
};
const fixStatusLabel: Record<string, string> = {
  pending: 'Chờ khắc phục',
  in_progress: 'Đang khắc phục',
  completed: 'Đã hoàn thành',
};
const severityVariant: Record<string, string> = {
  'nghiêm trọng': 'high',
  'trung bình': 'medium',
  'nhẹ': 'low',
};

export default function KhacPhucViPhamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [record, setRecord] = useState<ViolationFix | null>(null);

  useEffect(() => {
    const found = mockViolationFixes.find(v => v.id === id);
    setRecord(found || null);
  }, [id]);

  if (!record) {
    return (
      <div>
        <PageHeader
          title="Không tìm thấy hồ sơ"
          subtitle={`Không tìm thấy hồ sơ khắc phục mã: ${id}`}
          actions={
            <GovBtn variant="secondary" onClick={() => router.push('/vi-pham/khac-phuc')}>
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
        title={`Hồ sơ khắc phục — ${record.id}`}
        subtitle={`Chi cục An toàn Thực phẩm TP. Đà Nẵng — Theo dõi tiến độ khắc phục vi phạm`}
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/vi-pham/khac-phuc')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer style={{ width: 12, height: 12 }} /> In biên bản
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
            </GovBtn>
            <GovBtn variant="outline">
              <Upload style={{ width: 12, height: 12 }} /> Cập nhật tiến độ
            </GovBtn>
            {record.fixStatus !== 'completed' && (
              <GovBtn variant="primary">
                <CheckCircle style={{ width: 12, height: 12 }} /> Xác nhận hoàn thành
              </GovBtn>
            )}
          </ActionButtons>
        }
      />

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        <MiniStat label="Mã vi phạm" value={record.id} color="neutral" />
        <MiniStat label="Mức phạt" value={record.penaltyAmount} color="red" />
        <MiniStat label="Hạn khắc phục" value={record.deadline} color="orange" />
        <MiniStat label="Cập nhật lần cuối" value={record.updatedDate} color="blue" />
      </div>

      {/* Trạng thái */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <SectionCard title="Trạng thái khắc phục">
          <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StatusBadge variant={fixStatusVariant[record.fixStatus]} label={fixStatusLabel[record.fixStatus]} />
            <span style={{ fontSize: '12px', color: '#555' }}>
              {record.fixStatus === 'pending' ? 'Cơ sở chưa bắt đầu thực hiện khắc phục.' :
               record.fixStatus === 'in_progress' ? 'Cơ sở đang tiến hành khắc phục vi phạm.' :
               'Cơ sở đã hoàn tất khắc phục. Chờ xác nhận lần cuối.'}
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Mức độ vi phạm">
          <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StatusBadge variant={severityVariant[record.severity]} label={record.severity.charAt(0).toUpperCase() + record.severity.slice(1)} />
            <span style={{ fontSize: '12px', color: '#555' }}>
              {record.severity === 'nghiêm trọng' ? 'Vi phạm nghiêm trọng — cần giám sát chặt chẽ tiến độ khắc phục.' :
               record.severity === 'trung bình' ? 'Vi phạm mức trung bình — theo dõi định kỳ.' :
               'Vi phạm nhẹ — nhắc nhở và kiểm tra lại.'}
            </span>
          </div>
        </SectionCard>
      </div>

      {/* Chi tiết */}
      <SectionCard title="Thông tin chi tiết hồ sơ khắc phục">
        <div style={{ padding: '14px 12px' }}>
          <FormSection title="Thông tin cơ sở">
            <FormField label="Tên cơ sở kinh doanh">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontWeight: 600 }}>
                {record.businessName}
              </div>
            </FormField>
            <FormField label="Địa chỉ">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px' }}>
                {record.address}
              </div>
            </FormField>
            <FormField label="Thanh tra viên phụ trách">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px' }}>
                {record.inspector}
              </div>
            </FormField>
            <FormField label="Mức phạt áp dụng">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontWeight: 700, color: '#CC0000' }}>
                {record.penaltyAmount}
              </div>
            </FormField>
          </FormSection>

          <FormSection title="Nội dung khắc phục">
            <FormField label="Loại vi phạm" fullWidth>
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontWeight: 600 }}>
                {record.violationType}
              </div>
            </FormField>
            <FormField label="Yêu cầu khắc phục" fullWidth>
              <div style={{ padding: '8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', lineHeight: 1.6, minHeight: '80px' }}>
                {record.remediation}
              </div>
            </FormField>
          </FormSection>
        </div>
      </SectionCard>

      {/* Lịch trình kiểm tra */}
      <SectionCard title="Lịch sử theo dõi khắc phục">
        <div style={{ padding: '0' }}>
          {[
            { date: record.updatedDate, event: 'Cập nhật tiến độ khắc phục', user: record.inspector, note: `Trạng thái: ${fixStatusLabel[record.fixStatus]}` },
            { date: record.deadline, event: 'Hạn khắc phục tối đa', user: 'Hệ thống', note: 'Cơ sở phải hoàn thành trước ngày này' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', padding: '10px 12px', borderBottom: i < 1 ? '1px solid #F0F0F0' : 'none' }}>
              <span style={{ fontSize: '12px', fontFamily: 'monospace', color: '#555', flexShrink: 0, width: '100px' }}>{item.date}</span>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: '13px', fontWeight: 600, color: '#222', marginBottom: '2px' }}>{item.event}</p>
                <p style={{ fontSize: '12px', color: '#666' }}>{item.note} — <em>{item.user}</em></p>
              </div>
            </div>
          ))}
        </div>
      </SectionCard>

      <p style={{ fontSize: '11.5px', color: '#888', textAlign: 'center', marginTop: '8px' }}>
        Hồ sơ khắc phục được lưu trữ theo Quy chế lưu trữ hồ sơ ATTP — Chi cục An toàn Thực phẩm TP. Đà Nẵng
      </p>
    </div>
  );
}