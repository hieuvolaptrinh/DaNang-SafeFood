'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Plus } from 'lucide-react';
import { quyDinhApi, CreateQuyDinhRequest } from '@/api/quidinh';
import {
  PageHeader, GovBtn, SectionCard, ActionButtons,
  FormSection, FormField, GovInput, GovSelect,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

const LOAI_OPTIONS = [
  { value: 'QUY_DINH',  label: 'Quy định' },
  { value: 'HUONG_DAN', label: 'Hướng dẫn' },
  { value: 'THONG_TU',  label: 'Thông tư' },
  { value: 'NGHI_DINH', label: 'Nghị định' },
];

const TRANG_THAI_OPTIONS = [
  { value: 'NHAP',     label: 'Bản nháp' },
  { value: 'HIEU_LUC', label: 'Đang hiệu lực' },
];

export default function TaoQuyDinhPage() {
  const router = useRouter();

  const [tieuDe, setTieuDe]             = useState('');
  const [noiDung, setNoiDung]           = useState('');
  const [loai, setLoai]                 = useState('QUY_DINH');
  const [trangThai, setTrangThai]       = useState('NHAP');
  const [ngayBanHanh, setNgayBanHanh]   = useState('');

  const [submitting, setSubmitting]     = useState(false);
  const [error, setError]               = useState<string | null>(null);
  const [success, setSuccess]           = useState(false);

  const isValid = tieuDe.trim() && noiDung.trim() && loai && trangThai && ngayBanHanh;

  const handleSubmit = async () => {
    if (!isValid) return;
    setSubmitting(true);
    setError(null);
    try {
      const body: CreateQuyDinhRequest = {
        tieuDe:      tieuDe.trim(),
        noiDung:     noiDung.trim(),
        loai,
        trangThai,
        ngayBanHanh, // YYYY-MM-DD from date input
      };
      await quyDinhApi.create(body);
      setSuccess(true);
      setTimeout(() => router.push('/truyen-thong/quy-dinh'), 1200);
    } catch (err: any) {
      setError(err.message || 'Không thể tạo quy định. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <PageHeader
        title="Tạo văn bản quy định mới"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Nhập và ban hành văn bản quy phạm pháp luật"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/truyen-thong/quy-dinh')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
            </GovBtn>
            <GovBtn variant="primary" onClick={handleSubmit} disabled={submitting || !isValid}>
              <Plus style={{ width: 12, height: 12 }} />
              {submitting ? 'Đang lưu...' : 'Lưu quy định'}
            </GovBtn>
          </ActionButtons>
        }
      />

      {success && <AlertBanner type="success" title="Tạo văn bản quy định thành công! Đang chuyển về danh sách..." />}
      {error   && <AlertBanner type="error"   title={error} />}

      <SectionCard
        title="Thông tin văn bản quy định"
        footer={
          <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
            <GovBtn variant="secondary" onClick={() => router.push('/truyen-thong/quy-dinh')} disabled={submitting}>
              Hủy
            </GovBtn>
            <GovBtn variant="primary" onClick={handleSubmit} disabled={submitting || !isValid}>
              {submitting ? 'Đang lưu...' : 'Lưu quy định'}
            </GovBtn>
          </div>
        }
      >
        <div style={{ padding: '14px 16px' }}>
          <FormSection title="Thông tin cơ bản">
            <FormField label="Tiêu đề văn bản" required fullWidth>
              <GovInput
                placeholder="VD: Quy định về kiểm tra an toàn thực phẩm năm 2026..."
                value={tieuDe}
                onChange={setTieuDe}
                disabled={submitting}
              />
            </FormField>

            <FormField label="Loại văn bản" required>
              <GovSelect
                value={loai}
                onChange={setLoai}
                options={LOAI_OPTIONS}
                width={200}
              />
            </FormField>

            <FormField label="Trạng thái" required>
              <GovSelect
                value={trangThai}
                onChange={setTrangThai}
                options={TRANG_THAI_OPTIONS}
                width={200}
              />
            </FormField>

            <FormField label="Ngày ban hành" required>
              <GovInput
                type="date"
                value={ngayBanHanh}
                onChange={setNgayBanHanh}
                disabled={submitting}
                width={180}
              />
            </FormField>

            <FormField label="Nội dung văn bản" required fullWidth>
              <textarea
                value={noiDung}
                onChange={e => setNoiDung(e.target.value)}
                placeholder="Nhập nội dung chi tiết của văn bản quy định..."
                rows={12}
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