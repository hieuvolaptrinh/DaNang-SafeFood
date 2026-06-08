'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Send } from 'lucide-react';
import { thongBaoApi, CreateThongBaoRequest } from '@/api/thongbao';
import {
  PageHeader, GovBtn, SectionCard, ActionButtons,
  FormSection, FormField, GovInput, GovSelect,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

const LOAI_OPTIONS = [
  { value: 'THONG_BAO', label: 'Thông báo' },
  { value: 'KHAN_CAP',  label: 'Khẩn cấp' },
  { value: 'HUONG_DAN', label: 'Hướng dẫn' },
];

const CONG_DONG_OPTIONS = [
  { value: 'true',  label: 'Cộng đồng (hiển thị công khai)' },
  { value: 'false', label: 'Nội bộ (chỉ cán bộ)' },
];

export default function TaoThongBaoPage() {
  const router = useRouter();

  const [tieuDe, setTieuDe]           = useState('');
  const [noiDung, setNoiDung]         = useState('');
  const [loai, setLoai]               = useState('THONG_BAO');
  const [isCongDong, setIsCongDong]   = useState('true');

  const [submitting, setSubmitting]   = useState(false);
  const [error, setError]             = useState<string | null>(null);
  const [success, setSuccess]         = useState(false);

  const isValid = tieuDe.trim() && noiDung.trim() && loai;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      const body: CreateThongBaoRequest = {
        tieuDe:       tieuDe.trim(),
        noiDung:      noiDung.trim(),
        loaiThongBao: loai,
        isCongDong:   isCongDong === 'true',
      };
      await thongBaoApi.create(body);
      setSuccess(true);
      setTimeout(() => router.push('/truyen-thong/thong-bao'), 1200);
    } catch (err: any) {
      setError(err.message || 'Không thể tạo thông báo. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Tạo thông báo mới"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Soạn và gửi thông báo đến cộng đồng hoặc nội bộ"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/truyen-thong/thong-bao')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
            </GovBtn>
            <GovBtn variant="primary" onClick={handleSubmit} disabled={submitting || !isValid}>
              <Send style={{ width: 12, height: 12 }} />
              {submitting ? 'Đang gửi...' : 'Gửi thông báo'}
            </GovBtn>
          </ActionButtons>
        }
      />

      {success && <AlertBanner type="success" title="Tạo thông báo thành công! Đang chuyển về danh sách..." />}
      {error   && <AlertBanner type="danger"   title={error} />}

      <SectionCard
        title="Nội dung thông báo"
        footer={
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
            <GovBtn variant="secondary" onClick={() => router.push('/truyen-thong/thong-bao')} disabled={submitting}>
              Hủy
            </GovBtn>
            <GovBtn variant="primary" onClick={handleSubmit} disabled={submitting || !isValid}>
              <Send style={{ width: 12, height: 12 }} />
              {submitting ? 'Đang gửi...' : 'Gửi thông báo'}
            </GovBtn>
          </div>
        }
      >
        <div style={{ padding: '14px 16px' }}>
          <FormSection title="Thông tin thông báo">
            <FormField label="Tiêu đề" required fullWidth>
              <GovInput
                placeholder="Nhập tiêu đề thông báo..."
                value={tieuDe}
                onChange={setTieuDe}
                disabled={submitting}
              />
            </FormField>

            <FormField label="Loại thông báo" required>
              <GovSelect
                value={loai}
                onChange={setLoai}
                options={LOAI_OPTIONS}
                width={220}
              />
            </FormField>

            <FormField label="Phạm vi" required>
              <GovSelect
                value={isCongDong}
                onChange={setIsCongDong}
                options={CONG_DONG_OPTIONS}
                width={280}
              />
            </FormField>

            <FormField label="Nội dung thông báo" required fullWidth>
              <textarea
                value={noiDung}
                onChange={e => setNoiDung(e.target.value)}
                placeholder="Nhập nội dung chi tiết của thông báo..."
                rows={10}
                disabled={submitting}
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
                  lineHeight: 1.7,
                }}
              />
            </FormField>
          </FormSection>
        </div>
      </SectionCard>
    </div>
  );
}