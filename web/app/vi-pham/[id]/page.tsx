'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useRole } from '@/lib/RoleContext';
import { ArrowLeft, Printer, FileSpreadsheet, Pencil } from 'lucide-react';
import {
  PageHeader, GovBtn, SectionCard, StatusBadge, ActionButtons, FormSection, FormField,
} from '@/components/GovUI';

interface Violation {
  id: string;
  businessName: string;
  violationType: string;
  severity: 'nhẹ' | 'trung bình' | 'nghiêm trọng';
  detectedDate: string;
  status: 'pending' | 'processing' | 'resolved';
  district: string;
  inspector: string;
  address: string;
  description: string;
}

const mockViolations: Violation[] = [
  {
    id: 'VP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh an toàn thực phẩm',
    severity: 'nghiêm trọng',
    detectedDate: '18/03/2025',
    status: 'processing',
    district: 'Hải Châu',
    inspector: 'Nguyễn Văn Trần',
    address: '123 Trần Phú, Hải Châu, Đà Nẵng',
    description: 'Cơ sở vi phạm quy định vệ sinh an toàn thực phẩm nghiêm trọng. Khu vực bảo quản không đảm bảo nhiệt độ, thực phẩm không có nhãn truy xuất nguồn gốc.',
  },
  {
    id: 'VP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá bán',
    severity: 'nhẹ',
    detectedDate: '15/03/2025',
    status: 'resolved',
    district: 'Thanh Khê',
    inspector: 'Lê Thị Mai',
    address: '45 Điện Biên Phủ, Thanh Khê, Đà Nẵng',
    description: 'Cơ sở không niêm yết bảng giá tại quầy phục vụ theo quy định.',
  },
  {
    id: 'VP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng chất cấm trong thực phẩm',
    severity: 'nghiêm trọng',
    detectedDate: '22/03/2025',
    status: 'pending',
    district: 'Ngũ Hành Sơn',
    inspector: 'Phạm Văn Đức',
    address: '78 Nguyễn Tất Thành, Ngũ Hành Sơn, Đà Nẵng',
    description: 'Phát hiện cơ sở sử dụng chất phụ gia thực phẩm vượt ngưỡng cho phép theo Thông tư 24/2019/TT-BYT.',
  },
  {
    id: 'VP-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    violationType: 'Bán hàng hết hạn sử dụng',
    severity: 'trung bình',
    detectedDate: '20/03/2025',
    status: 'processing',
    district: 'Sơn Trà',
    inspector: 'Nguyễn Văn Trần',
    address: '22 Hoàng Diệu, Sơn Trà, Đà Nẵng',
    description: 'Kiểm tra phát hiện 37 sản phẩm hết hạn sử dụng vẫn được bày bán trên kệ siêu thị.',
  },
];

const statusLabel: Record<string, string> = {
  pending: 'Chưa xử lý',
  processing: 'Đang xử lý',
  resolved: 'Đã xử lý',
};

export default function ViPhamDetailPage() {
  const { role } = useRole();
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [violation, setViolation] = useState<Violation | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'pending' | 'processing' | 'resolved'>('processing');
  const [isApproving, setIsApproving] = useState(false);

  useEffect(() => {
    const found = mockViolations.find(v => v.id === id);
    setViolation(found || null);
  }, [id]);

  if (!violation) {
    return (
      <div>
        <PageHeader
          title="Không tìm thấy vi phạm"
          subtitle={`Không tìm thấy hồ sơ vi phạm mã: ${id}`}
          actions={
            <GovBtn variant="secondary" onClick={() => router.push('/vi-pham')}>
              <ArrowLeft /> Quay lại danh sách
            </GovBtn>
          }
        />
      </div>
    );
  }

  const isAuthority = role === 'AUTHORITY';

  const handleUpdateStatus = () => {
    setIsApproving(true);

    setTimeout(() => {
      setViolation(prev => prev ? { ...prev, status: selectedStatus } : null);
      setShowModal(false);
      setIsApproving(false);
      alert('✅ Đã cập nhật trạng thái xử lý thành công!');
    }, 800);
  };

  const handleApproveDecision = () => {
    setIsApproving(true);

    setTimeout(() => {
      setViolation(prev => prev ? { ...prev, status: 'resolved' } : null);
      setShowModal(false);
      setIsApproving(false);
      alert('✅ Đã phê duyệt quyết định xử phạt và chuyển trạng thái thành ĐÃ XỬ LÝ!');
    }, 800);
  };

  return (
    <div>
      <PageHeader
        title={`Chi tiết vi phạm — ${violation.id}`}
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Hồ sơ vi phạm cơ sở kinh doanh thực phẩm"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/vi-pham')}>
              <ArrowLeft /> Quay lại
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer /> In biên bản
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet /> Xuất Excel
            </GovBtn>

            {isAuthority && (
              <GovBtn variant="primary" onClick={() => setShowModal(true)}>
                <Pencil /> Cập nhật xử lý
              </GovBtn>
            )}
          </ActionButtons>
        }
      />

      {/* Phần nội dung cũ giữ nguyên hoàn toàn */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        {[
          { label: 'Mã vi phạm', value: violation.id, mono: true },
          { label: 'Ngày phát hiện', value: violation.detectedDate, mono: true },
          { label: 'Quận/Huyện', value: violation.district },
          { label: 'Thanh tra viên', value: violation.inspector },
        ].map((item) => (
          <div key={item.label} style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '1px', padding: '10px 14px' }}>
            <p style={{ fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '4px' }}>
              {item.label}
            </p>
            <p style={{ fontSize: '14px', fontWeight: 700, color: '#222', fontFamily: item.mono ? 'monospace' : 'inherit' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      {/* Trạng thái & Mức độ */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '12px' }}>
        <SectionCard title="Trạng thái xử lý">
          <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StatusBadge variant={violation.status} label={statusLabel[violation.status]} />
            <span style={{ fontSize: '12px', color: '#555' }}>
              {violation.status === 'pending' ? 'Hồ sơ đang chờ xem xét và phân công xử lý.' :
                violation.status === 'processing' ? 'Đang trong quá trình xử lý vi phạm.' :
                  'Vi phạm đã được xử lý và hoàn tất hồ sơ.'}
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Mức độ vi phạm">
          <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StatusBadge variant={violation.severity} label={violation.severity.charAt(0).toUpperCase() + violation.severity.slice(1)} />
            <span style={{ fontSize: '12px', color: '#555' }}>
              {violation.severity === 'nghiêm trọng' ? 'Vi phạm cần xử lý khẩn cấp và áp dụng mức phạt cao nhất.' :
                violation.severity === 'trung bình' ? 'Vi phạm ở mức trung bình, cần khắc phục trong thời gian sớm.' :
                  'Vi phạm nhẹ, yêu cầu cơ sở nhắc nhở và chấn chỉnh.'}
            </span>
          </div>
        </SectionCard>
      </div>

      {/* Các phần còn lại giữ nguyên như code cũ của bạn */}
      <SectionCard title="Thông tin chi tiết vi phạm">
        <div style={{ padding: '14px 12px' }}>
          <FormSection title="Thông tin cơ sở">
            <FormField label="Tên cơ sở kinh doanh">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontWeight: 600 }}>
                {violation.businessName}
              </div>
            </FormField>
            <FormField label="Địa chỉ cơ sở">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px' }}>
                {violation.address}
              </div>
            </FormField>
            {/* ... giữ nguyên các FormField khác */}
          </FormSection>

          <FormSection title="Nội dung vi phạm">
            <FormField label="Loại vi phạm" fullWidth>
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontWeight: 600, color: '#CC0000' }}>
                {violation.violationType}
              </div>
            </FormField>
            <FormField label="Mô tả chi tiết" fullWidth>
              <div style={{ padding: '8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', lineHeight: 1.6, minHeight: '80px' }}>
                {violation.description}
              </div>
            </FormField>
          </FormSection>
        </div>
      </SectionCard>

      {/* ====================== MODAL ====================== */}
      {showModal && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-3xl w-full max-w-lg mx-4 overflow-hidden">
            <div className="p-8 border-b">
              <h3 className="text-xl font-semibold">Cập nhật xử lý vi phạm</h3>
            </div>

            <div className="p-8 space-y-8">
              {/* Phần 1: Thay đổi trạng thái */}
              <div>
                <p className="font-medium mb-3">1. Thay đổi trạng thái xử lý</p>
                <select
                  value={selectedStatus}
                  onChange={(e) => setSelectedStatus(e.target.value as any)}
                  className="w-full border border-slate-300 rounded-2xl px-4 py-3"
                >
                  <option value="pending">Chưa xử lý</option>
                  <option value="processing">Đang xử lý</option>
                  <option value="resolved">Đã xử lý</option>
                </select>
              </div>

              {/* Phần 2: Phê duyệt quyết định */}
              <div>
                <p className="font-medium mb-3">2. Phê duyệt quyết định xử phạt</p>
                <GovBtn
                  variant="primary"
                  className="w-full"
                  onClick={handleApproveDecision}
                  disabled={isApproving}
                >
                  {isApproving ? 'Đang phê duyệt...' : 'Phê duyệt quyết định xử phạt'}
                </GovBtn>
                <p className="text-xs text-slate-500 mt-2 text-center">
                  Khi phê duyệt, trạng thái sẽ tự động chuyển sang <strong>ĐÃ XỬ LÝ</strong>
                </p>
              </div>
            </div>

            <div className="p-6 border-t flex gap-3 justify-end bg-slate-50">
              <GovBtn variant="secondary" onClick={() => setShowModal(false)}>
                Đóng
              </GovBtn>
              <GovBtn
                variant="primary"
                onClick={handleUpdateStatus}
                disabled={isApproving}
              >
                Cập nhật trạng thái
              </GovBtn>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}