'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import {
  PageHeader, GovBtn, SectionCard, StatusBadge, ActionButtons, FormSection, FormField,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';
import { viPhamApi, type ViPhamItem } from '@/api/vipham';

const MUC_DO_VARIANT: Record<string, string> = {
  'Nghiêm trọng': 'expired',
  'Trung bình': 'pending',
  'Nhẹ': 'processing',
};

const TRANG_THAI_VARIANT: Record<string, string> = {
  'Đã Duyệt': 'active',
  'Chờ Duyệt': 'pending',
  'Từ Chối': 'expired',
};

function formatCurrency(amount: number) {
  if (!amount) return '—';
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);
}

function InfoCard({ label, value, mono = false }: { label: string; value: React.ReactNode; mono?: boolean }) {
  return (
    <div style={{ background: '#fff', border: '1px solid #D6D6D6', padding: '10px 14px' }}>
      <p style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '4px' }}>
        {label}
      </p>
      <div style={{ fontSize: '14px', fontWeight: 700, color: '#222', fontFamily: mono ? 'monospace' : 'inherit' }}>
        {value}
      </div>
    </div>
  );
}

export default function ViPhamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const maViPham = params.id as string;

  const [item, setItem] = useState<ViPhamItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    viPhamApi.getById(maViPham)
      .then(data => { if (mounted) { setItem(data); setLoading(false); } })
      .catch(() => { if (mounted) { setNotFound(true); setLoading(false); } });
    return () => { mounted = false; };
  }, [maViPham]);

  const handleDecision = async (trangThai: 'Đã Duyệt' | 'Từ Chối') => {
    if (!item) return;
    setActionLoading(true);
    setSuccessMessage('');
    setErrorMessage('');
    try {
      const updated = await viPhamApi.pheDuyet(item.maViPham, trangThai);
      setItem(updated);
      setSuccessMessage(
        trangThai === 'Đã Duyệt'
          ? `Đã phê duyệt vi phạm ${item.maViPham} thành công`
          : `Đã từ chối vi phạm ${item.maViPham}`,
      );
    } catch (err: any) {
      setErrorMessage(err.message || 'Không thể cập nhật trạng thái');
    } finally {
      setActionLoading(false);
    }
  };

  /* ──── Loading ──── */
  if (loading) {
    return (
      <div style={{ padding: '40px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
        Đang tải thông tin vi phạm...
      </div>
    );
  }

  /* ──── Not found ──── */
  if (notFound || !item) {
    return (
      <div>
        <PageHeader
          title="Không tìm thấy vi phạm"
          subtitle={`Không tìm thấy hồ sơ vi phạm mã: ${maViPham}`}
          actions={
            <GovBtn variant="secondary" onClick={() => router.push('/vi-pham')}>
              <ArrowLeft style={{ width: 13, height: 13 }} /> Quay lại danh sách
            </GovBtn>
          }
        />
      </div>
    );
  }

  const isPending = item.trangThaiPheDuyet === 'Chờ Duyệt';

  return (
    <div>
      <PageHeader
        title={`Chi tiết vi phạm — ${item.maViPham}`}
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Hồ sơ vi phạm cơ sở kinh doanh thực phẩm"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/vi-pham')}>
              <ArrowLeft style={{ width: 13, height: 13 }} /> Quay lại
            </GovBtn>
            <GovBtn variant="secondary" onClick={() => window.print()}>
              <Printer style={{ width: 13, height: 13 }} /> In biên bản
            </GovBtn>
            {isPending && (
              <>
                <GovBtn
                  variant="secondary"
                  onClick={() => void handleDecision('Từ Chối')}
                  disabled={actionLoading}
                >
                  <XCircle style={{ width: 13, height: 13 }} /> Từ chối
                </GovBtn>
                <GovBtn
                  variant="primary"
                  onClick={() => void handleDecision('Đã Duyệt')}
                  disabled={actionLoading}
                >
                  <CheckCircle style={{ width: 13, height: 13 }} />
                  {actionLoading ? 'Đang xử lý...' : 'Phê duyệt'}
                </GovBtn>
              </>
            )}
          </ActionButtons>
        }
      />

      {successMessage && <AlertBanner type="success" title={successMessage} />}
      {errorMessage && <AlertBanner type="danger" title={errorMessage} />}

      {/* ── Stat cards ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
        <InfoCard label="Mã vi phạm" value={item.maViPham} mono />
        <InfoCard label="Mã hồ sơ" value={item.maHoSo} mono />
        <InfoCard label="Tổng tiền phạt" value={
          <span style={{ color: '#CC0000' }}>{formatCurrency(item.tongTienPhat)}</span>
        } />
        <InfoCard label="Trạng thái phê duyệt" value={
          <StatusBadge variant={TRANG_THAI_VARIANT[item.trangThaiPheDuyet] ?? 'pending'} label={item.trangThaiPheDuyet} />
        } />
      </div>

      {/* ── Status + Severity ── */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
        <SectionCard title="Trạng thái phê duyệt">
          <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StatusBadge
              variant={TRANG_THAI_VARIANT[item.trangThaiPheDuyet] ?? 'pending'}
              label={item.trangThaiPheDuyet}
            />
            <span style={{ fontSize: '12px', color: '#555' }}>
              {item.trangThaiPheDuyet === 'Chờ Duyệt'
                ? 'Hồ sơ đang chờ lãnh đạo xem xét và phê duyệt.'
                : item.trangThaiPheDuyet === 'Đã Duyệt'
                ? 'Hồ sơ đã được phê duyệt và có hiệu lực.'
                : 'Hồ sơ đã bị từ chối, cần xem xét lại.'}
            </span>
          </div>
        </SectionCard>

        <SectionCard title="Mức độ vi phạm">
          <div style={{ padding: '14px 12px', display: 'flex', alignItems: 'center', gap: '12px' }}>
            <StatusBadge variant={MUC_DO_VARIANT[item.mucDo] ?? 'pending'} label={item.mucDo} />
            <span style={{ fontSize: '12px', color: '#555' }}>
              {item.mucDo === 'Nghiêm trọng'
                ? 'Vi phạm cần xử lý khẩn cấp và áp dụng mức phạt cao nhất.'
                : item.mucDo === 'Trung bình'
                ? 'Vi phạm ở mức trung bình, cần khắc phục trong thời gian sớm.'
                : 'Vi phạm nhẹ, yêu cầu nhắc nhở và chấn chỉnh.'}
            </span>
          </div>
        </SectionCard>
      </div>

      {/* ── Detail ── */}
      <SectionCard title="Thông tin chi tiết vi phạm">
        <div style={{ padding: '14px 12px' }}>
          <FormSection title="Thông tin cơ sở kinh doanh">
            <FormField label="Tên cơ sở">
              <div style={{ padding: '6px 10px', background: '#F5F5F5', border: '1px solid #D6D6D6', fontSize: '13px', fontWeight: 600 }}>
                {item.tenCoSo}
              </div>
            </FormField>
            <FormField label="Mã cơ sở">
              <div style={{ padding: '6px 10px', background: '#F5F5F5', border: '1px solid #D6D6D6', fontSize: '13px', fontFamily: 'monospace', color: '#005A9E' }}>
                {item.maCoSo}
              </div>
            </FormField>
          </FormSection>

          <FormSection title="Nội dung vi phạm">
            <FormField label="Loại vi phạm" fullWidth>
              <div style={{ padding: '6px 10px', background: '#FFF4F4', border: '1px solid #FCA5A5', fontSize: '13px', fontWeight: 600, color: '#CC0000' }}>
                {item.tenLoaiViPham}
              </div>
            </FormField>

            {item.moTaThem && (
              <FormField label="Mô tả thêm" fullWidth>
                <div style={{ padding: '8px 10px', background: '#F5F5F5', border: '1px solid #D6D6D6', fontSize: '13px', lineHeight: 1.7, minHeight: '60px' }}>
                  {item.moTaThem}
                </div>
              </FormField>
            )}
          </FormSection>

          <FormSection title="Yêu cầu & Khắc phục">
            {item.yeuCauKhacPhuc && (
              <FormField label="Yêu cầu khắc phục" fullWidth>
                <div style={{ padding: '8px 10px', background: '#FFF9F0', border: '1px solid #FCD34D', fontSize: '13px', lineHeight: 1.7 }}>
                  {item.yeuCauKhacPhuc}
                </div>
              </FormField>
            )}
            {item.khacPhuc && (
              <FormField label="Kết quả khắc phục" fullWidth>
                <div style={{ padding: '8px 10px', background: '#F0FDF4', border: '1px solid #86EFAC', fontSize: '13px', lineHeight: 1.7 }}>
                  {item.khacPhuc}
                </div>
              </FormField>
            )}
            {item.lyDo && (
              <FormField label="Lý do" fullWidth>
                <div style={{ padding: '8px 10px', background: '#F5F5F5', border: '1px solid #D6D6D6', fontSize: '13px', lineHeight: 1.7 }}>
                  {item.lyDo}
                </div>
              </FormField>
            )}
          </FormSection>
        </div>
      </SectionCard>

      {/* ── Bottom approval bar (nếu còn pending) ── */}
      {isPending && (
        <div style={{
          marginTop: '16px',
          background: '#FFFBEB',
          border: '1px solid #FCD34D',
          borderRadius: '2px',
          padding: '14px 18px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '12px',
        }}>
          <div>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#92400E' }}>Hồ sơ đang chờ phê duyệt</p>
            <p style={{ fontSize: '12px', color: '#B45309', marginTop: '2px' }}>
              Vui lòng xem xét thông tin và quyết định phê duyệt hoặc từ chối hồ sơ vi phạm này.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '8px', flexShrink: 0 }}>
            <GovBtn variant="secondary" onClick={() => void handleDecision('Từ Chối')} disabled={actionLoading}>
              <XCircle style={{ width: 13, height: 13 }} /> Từ chối
            </GovBtn>
            <GovBtn variant="primary" onClick={() => void handleDecision('Đã Duyệt')} disabled={actionLoading}>
              <CheckCircle style={{ width: 13, height: 13 }} />
              {actionLoading ? 'Đang xử lý...' : 'Phê duyệt hồ sơ'}
            </GovBtn>
          </div>
        </div>
      )}
    </div>
  );
}