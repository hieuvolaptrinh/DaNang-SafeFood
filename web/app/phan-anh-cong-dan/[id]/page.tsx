'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, MessageSquare, Printer, CheckCircle } from 'lucide-react';
import {
  PageHeader, GovBtn, SectionCard, StatusBadge, ActionButtons, FormSection, FormField,
  FormLayout, GovSelect, FilterField,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';
import { mockFeedback, CitizenFeedback } from '@/data/mockData';

const statusVariant: Record<string, string> = {
  'open': 'open',
  'in-progress': 'in-progress',
  'resolved': 'resolved',
};
const statusLabel: Record<string, string> = {
  'open': 'Đang mở',
  'in-progress': 'Đang xử lý',
  'resolved': 'Đã giải quyết',
};

const typeStyle: Record<string, { bg: string; color: string; border: string }> = {
  'Khiếu nại vệ sinh': { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  'Hàng giả': { bg: '#F0E8FA', color: '#6200CC', border: '#D4A8F5' },
  'Ngộ độc thực phẩm': { bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  'Câu hỏi chung': { bg: '#F0F0F0', color: '#555', border: '#CCC' },
};

export default function PhanAnhDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [feedback, setFeedback] = useState<CitizenFeedback | null>(null);
  const [status, setStatus] = useState('');
  const [responseContent, setResponseContent] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    const found = mockFeedback.find(f => f.id === id);
    if (found) {
      setFeedback(found);
      setStatus(found.status);
    }
  }, [id]);

  if (!feedback) {
    return (
      <div>
        <PageHeader
          title="Không tìm thấy phản ánh"
          subtitle={`Không tìm thấy phản ánh mã: ${id}`}
          actions={
            <GovBtn variant="secondary" onClick={() => router.push('/phan-anh-cong-dan')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại danh sách
            </GovBtn>
          }
        />
      </div>
    );
  }

  const handleUpdate = async () => {
    if (!responseContent.trim()) {
      alert('Vui lòng nhập nội dung phản hồi.');
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      setFeedback(prev => prev ? { ...prev, status: status as CitizenFeedback['status'] } : null);
      setSuccess(true);
      setTimeout(() => router.push('/phan-anh-cong-dan'), 1500);
    } finally {
      setIsSubmitting(false);
    }
  };

  const tc = typeStyle[feedback.type] ?? { bg: '#F0F0F0', color: '#555', border: '#CCC' };

  return (
    <div>
      <PageHeader
        title={`Chi tiết phản ánh — ${feedback.id}`}
        subtitle={`Chi cục An toàn Thực phẩm TP. Đà Nẵng — Tiếp nhận và xử lý phản ánh từ người dân`}
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/phan-anh-cong-dan')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer style={{ width: 12, height: 12 }} /> In phiếu
            </GovBtn>
            <GovBtn variant="outline">
              <MessageSquare style={{ width: 12, height: 12 }} /> Gửi phản hồi SMS
            </GovBtn>
          </ActionButtons>
        }
      />

      {success && (
        <AlertBanner type="success" title="Đã cập nhật phản ánh thành công! Đang chuyển về danh sách..." />
      )}

      {/* Thông tin tổng quan */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        {[
          { label: 'Mã phản ánh', value: feedback.id, mono: true },
          { label: 'Ngày gửi', value: feedback.date, mono: true },
          { label: 'Người gửi', value: feedback.submitter },
          { label: 'Ưu tiên', value: feedback.priority === 'high' ? 'Cao' : feedback.priority === 'medium' ? 'Trung bình' : 'Thấp' },
        ].map((item) => (
          <div key={item.label} style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '1px', padding: '10px 14px' }}>
            <p style={{ fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '4px' }}>
              {item.label}
            </p>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#222', fontFamily: item.mono ? 'monospace' : 'inherit' }}>
              {item.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
        {/* Left: Chi tiết phản ánh */}
        <div>
          <SectionCard title="Thông tin phản ánh">
            <div style={{ padding: '14px 12px' }}>
              <FormSection title="Người gửi phản ánh">
                <FormField label="Họ và tên">
                  <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontWeight: 600 }}>
                    {feedback.submitter}
                  </div>
                </FormField>
                <FormField label="Ngày gửi">
                  <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontFamily: 'monospace' }}>
                    {feedback.date}
                  </div>
                </FormField>
                <FormField label="Loại phản ánh" fullWidth>
                  <div style={{ padding: '4px 8px', display: 'inline-block' }}>
                    <span style={{
                      display: 'inline-block', padding: '2px 8px', borderRadius: '2px',
                      border: `1px solid ${tc.border}`, background: tc.bg, color: tc.color,
                      fontSize: '12px', fontWeight: 500,
                    }}>
                      {feedback.type}
                    </span>
                  </div>
                </FormField>
              </FormSection>

              <FormSection title="Cơ sở bị phản ánh">
                <FormField label="Tên cơ sở" fullWidth>
                  <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontWeight: 600, color: '#CC0000' }}>
                    {feedback.businessReported}
                  </div>
                </FormField>
              </FormSection>
            </div>
          </SectionCard>
        </div>

        {/* Right: Xử lý */}
        <div>
          <SectionCard
            title="Cập nhật xử lý phản ánh"
            footer={
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <GovBtn variant="secondary" onClick={() => router.push('/phan-anh-cong-dan')} disabled={isSubmitting}>
                  Hủy
                </GovBtn>
                <GovBtn
                  variant="primary"
                  onClick={handleUpdate}
                  disabled={isSubmitting || !responseContent.trim()}
                >
                  <CheckCircle style={{ width: 12, height: 12 }} />
                  {isSubmitting ? 'Đang cập nhật...' : 'Cập nhật & Gửi thông báo'}
                </GovBtn>
              </div>
            }
          >
            <div style={{ padding: '12px' }}>
              {/* Trạng thái hiện tại */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#444', marginBottom: '4px' }}>TRẠNG THÁI HIỆN TẠI</p>
                <StatusBadge variant={statusVariant[feedback.status]} label={statusLabel[feedback.status]} />
              </div>

              {/* Đổi trạng thái */}
              <FilterField label="Trạng thái mới">
                <GovSelect
                  value={status}
                  onChange={setStatus}
                  options={[
                    { value: 'open', label: 'Đang mở' },
                    { value: 'in-progress', label: 'Đang xử lý' },
                    { value: 'resolved', label: 'Đã giải quyết' },
                  ]}
                  width="100%"
                />
              </FilterField>

              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#444', marginBottom: '4px' }}>
                  NỘI DUNG PHẢN HỒI <span style={{ color: '#CC0000' }}>*</span>
                </label>
                <textarea
                  value={responseContent}
                  onChange={e => setResponseContent(e.target.value)}
                  placeholder="Nhập nội dung phản hồi, hướng dẫn hoặc kết quả xử lý gửi đến người dân..."
                  rows={6}
                  disabled={isSubmitting}
                  style={{
                    width: '100%',
                    border: '1px solid #D6D6D6',
                    borderRadius: '2px',
                    padding: '8px',
                    fontSize: '13px',
                    fontFamily: 'inherit',
                    color: '#222',
                    resize: 'vertical',
                    outline: 'none',
                    boxSizing: 'border-box',
                  }}
                />
              </div>

              <p style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                Thông báo sẽ được gửi đến người dân qua ứng dụng/Zalo/SMS
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}