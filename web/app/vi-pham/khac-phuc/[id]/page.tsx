'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, ArrowUpRight, Printer } from 'lucide-react';
import Link from 'next/link';
import { khacPhucApi, KhacPhucItem } from '@/api/khacphuc';
import {
  PageHeader, GovBtn, SectionCard, StatusBadge, ActionButtons, FormSection, FormField,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

// ─── helpers ────────────────────────────────────────────────────
const TINH_TRANG_VARIANT: Record<string, string> = {
  CHUA_KHAC_PHUC: 'expired',
  DANG_KHAC_PHUC: 'in-progress',
  DA_KHAC_PHUC:   'active',
};
const TINH_TRANG_LABEL: Record<string, string> = {
  CHUA_KHAC_PHUC: 'Chưa khắc phục',
  DANG_KHAC_PHUC: 'Đang khắc phục',
  DA_KHAC_PHUC:   'Đã khắc phục',
};
const TINH_TRANG_DESC: Record<string, string> = {
  CHUA_KHAC_PHUC: 'Cơ sở chưa thực hiện bất kỳ biện pháp khắc phục nào. Cần đôn đốc và yêu cầu thực hiện ngay.',
  DANG_KHAC_PHUC: 'Cơ sở đang trong quá trình thực hiện khắc phục. Cần tiếp tục giám sát và đánh giá kết quả.',
  DA_KHAC_PHUC:   'Cơ sở đã hoàn thành việc khắc phục theo yêu cầu. Hình thức xử phạt được xem là hoàn tất.',
};
const TINH_TRANG_BG: Record<string, { bg: string; border: string; color: string }> = {
  CHUA_KHAC_PHUC: { bg: '#FEF2F2', border: '#FECACA', color: '#991B1B' },
  DANG_KHAC_PHUC: { bg: '#EFF6FF', border: '#BFDBFE', color: '#1E40AF' },
  DA_KHAC_PHUC:   { bg: '#F0FDF4', border: '#BBF7D0', color: '#166534' },
};

function formatCurrency(amount: number) {
  if (!amount && amount !== 0) return '—';
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

// ─── component ──────────────────────────────────────────────────
export default function KhacPhucViPhamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem]       = useState<KhacPhucItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    setError(null);
    khacPhucApi
      .getById(id)
      .then(data => { if (mounted) { setItem(data); setLoading(false); } })
      .catch((err: any) => {
        if (mounted) {
          setError(err.message || 'Không thể tải thông tin khắc phục.');
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, [id]);

  // ── Loading ──
  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
        Đang tải thông tin khắc phục...
      </div>
    );
  }

  // ── Error / Not found ──
  if (error || !item) {
    return (
      <div>
        <PageHeader
          title="Không tìm thấy thông tin khắc phục"
          subtitle={`Mã: ${id}`}
          actions={
            <GovBtn variant="secondary" onClick={() => router.push('/vi-pham/khac-phuc')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại danh sách
            </GovBtn>
          }
        />
        {error && <AlertBanner type="danger" title={error} />}
      </div>
    );
  }

  const tinhTrang = item.tinhTrangKhacPhuc;
  const bgStyle   = TINH_TRANG_BG[tinhTrang] ?? { bg: '#F5F5F5', border: '#D6D6D6', color: '#333' };

  return (
    <div>
      <PageHeader
        title={`Chi tiết khắc phục — ${item.maHinhThucKhacPhuc}`}
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Theo dõi tiến độ thực hiện khắc phục vi phạm"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/vi-pham/khac-phuc')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
            </GovBtn>
            <GovBtn variant="secondary" onClick={() => window.print()}>
              <Printer style={{ width: 12, height: 12 }} /> In biên bản
            </GovBtn>
            <Link href={`/vi-pham/${item.maViPham}`}>
              <GovBtn variant="outline">
                <ArrowUpRight style={{ width: 12, height: 12 }} /> Xem vi phạm
              </GovBtn>
            </Link>
          </ActionButtons>
        }
      />

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
        <InfoCard label="Mã khắc phục" value={item.maHinhThucKhacPhuc} mono />
        <InfoCard
          label="Mã vi phạm"
          value={
            <Link
              href={`/vi-pham/${item.maViPham}`}
              style={{ color: '#CC0000', fontFamily: 'monospace', textDecoration: 'none' }}
            >
              {item.maViPham}
            </Link>
          }
        />
        <InfoCard
          label="Số tiền khắc phục"
          value={
            <span style={{ color: item.soTienKhacPhuc > 0 ? '#CC0000' : '#666' }}>
              {formatCurrency(item.soTienKhacPhuc)}
            </span>
          }
        />
        <InfoCard
          label="Tình trạng"
          value={
            <StatusBadge
              variant={TINH_TRANG_VARIANT[tinhTrang] ?? 'pending'}
              label={TINH_TRANG_LABEL[tinhTrang] ?? tinhTrang}
            />
          }
        />
      </div>

      {/* Tình trạng banner */}
      <div style={{
        background: bgStyle.bg,
        border: `1px solid ${bgStyle.border}`,
        borderRadius: '2px',
        padding: '14px 18px',
        marginBottom: '12px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
      }}>
        <StatusBadge
          variant={TINH_TRANG_VARIANT[tinhTrang] ?? 'pending'}
          label={TINH_TRANG_LABEL[tinhTrang] ?? tinhTrang}
        />
        <p style={{ fontSize: '13px', color: bgStyle.color, fontWeight: 500, margin: 0 }}>
          {TINH_TRANG_DESC[tinhTrang] ?? 'Không có mô tả trạng thái.'}
        </p>
      </div>

      {/* Chi tiết */}
      <SectionCard title="Thông tin chi tiết hình thức khắc phục">
        <div style={{ padding: '14px 16px' }}>
          <FormSection title="Thông tin cơ bản">
            <FormField label="Mã hình thức KP">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontFamily: 'monospace', fontWeight: 600, color: '#005A9E' }}>
                {item.maHinhThucKhacPhuc}
              </div>
            </FormField>
            <FormField label="Liên kết vi phạm">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px' }}>
                <Link href={`/vi-pham/${item.maViPham}`} style={{ color: '#CC0000', fontFamily: 'monospace', fontWeight: 700, textDecoration: 'none' }}>
                  {item.maViPham} ↗
                </Link>
              </div>
            </FormField>
            <FormField label="Số tiền khắc phục">
              <div style={{ padding: '6px 8px', background: '#F5F5F5', border: '1px solid #D6D6D6', borderRadius: '2px', fontSize: '13px', fontWeight: 700, color: item.soTienKhacPhuc > 0 ? '#CC0000' : '#666', fontFamily: 'monospace' }}>
                {formatCurrency(item.soTienKhacPhuc)}
              </div>
            </FormField>
            <FormField label="Tình trạng">
              <div style={{ padding: '6px 8px' }}>
                <StatusBadge
                  variant={TINH_TRANG_VARIANT[tinhTrang] ?? 'pending'}
                  label={TINH_TRANG_LABEL[tinhTrang] ?? tinhTrang}
                />
              </div>
            </FormField>
          </FormSection>

          <FormSection title="Nội dung khắc phục">
            <FormField label="Nội dung" fullWidth>
              {item.noiDungKhacPhuc ? (
                <div style={{
                  padding: '10px 12px',
                  background: '#F5F5F5',
                  border: '1px solid #D6D6D6',
                  borderRadius: '2px',
                  fontSize: '13px',
                  lineHeight: 1.8,
                  minHeight: '60px',
                  whiteSpace: 'pre-wrap',
                }}>
                  {item.noiDungKhacPhuc}
                </div>
              ) : (
                <div style={{
                  padding: '14px 16px',
                  background: '#FFFBEA',
                  border: '1px solid #FDE68A',
                  borderRadius: '2px',
                  fontSize: '13px',
                  color: '#92400E',
                  fontStyle: 'italic',
                }}>
                  Chưa có nội dung khắc phục được ghi nhận. Cán bộ phụ trách cần cập nhật sau khi kiểm tra thực tế.
                </div>
              )}
            </FormField>
          </FormSection>
        </div>
      </SectionCard>

      <p style={{ fontSize: '11.5px', color: '#888', textAlign: 'center', marginTop: '8px' }}>
        Hồ sơ khắc phục được lưu trữ theo Quy chế lưu trữ hồ sơ ATTP — Chi cục An toàn Thực phẩm TP. Đà Nẵng
      </p>
    </div>
  );
}