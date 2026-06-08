'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Printer, CheckCircle, XCircle, Clock, MapPin, User, Building2 } from 'lucide-react';
import { phanAnhApi, PhanAnhItem, TrangThaiPhanAnh } from '@/api/phananh';
import {
  PageHeader, GovBtn, SectionCard, StatusBadge, ActionButtons,
  FormSection, FormField, GovSelect, FilterField,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

// ─── helpers ────────────────────────────────────────────────────
const TRANG_THAI_OPTIONS: { value: TrangThaiPhanAnh | string; label: string }[] = [
  { value: 'CHO_XU_LY',  label: 'Chờ xử lý' },
  { value: 'DANG_XU_LY', label: 'Đang xử lý' },
  { value: 'DA_XU_LY',   label: 'Đã xử lý' },
  { value: 'TU_CHOI',    label: 'Từ chối' },
];

const trangThaiVariant: Record<string, string> = {
  CHO_XU_LY:  'open',
  DANG_XU_LY: 'in-progress',
  DA_XU_LY:   'resolved',
  TU_CHOI:    'rejected',
};
const trangThaiLabel: Record<string, string> = {
  CHO_XU_LY:  'Chờ xử lý',
  DANG_XU_LY: 'Đang xử lý',
  DA_XU_LY:   'Đã xử lý',
  TU_CHOI:    'Từ chối',
};

function formatDateTime(iso: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit',
    });
  } catch {
    return iso;
  }
}

const InfoRow = ({ label, value, mono = false }: { label: string; value: string; mono?: boolean }) => (
  <div style={{ padding: '6px 0', borderBottom: '1px solid #F0F0F0', display: 'flex', gap: '12px' }}>
    <span style={{ fontSize: '11.5px', fontWeight: 600, color: '#666', width: 140, flexShrink: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
      {label}
    </span>
    <span style={{ fontSize: '13px', fontWeight: 500, color: '#222', fontFamily: mono ? 'monospace' : 'inherit', flex: 1 }}>
      {value || '—'}
    </span>
  </div>
);

// ─── component ──────────────────────────────────────────────────
export default function PhanAnhDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem]             = useState<PhanAnhItem | null>(null);
  const [loading, setLoading]       = useState(true);
  const [error, setError]           = useState<string | null>(null);

  const [newStatus, setNewStatus]   = useState<string>('');
  const [ghiChu, setGhiChu]         = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess]       = useState(false);

  // ── Fetch chi tiết ──
  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    phanAnhApi
      .getById(id)
      .then((data) => {
        setItem(data);
        setNewStatus(data.trangThaiPhanAnh);
        setGhiChu(data.ghiChu ?? '');
      })
      .catch((err: any) => {
        setError(err.message || 'Không thể tải thông tin phản ánh.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  // ── Submit cập nhật ──
  const handleUpdate = async () => {
    if (!ghiChu.trim()) {
      alert('Vui lòng nhập ghi chú xử lý trước khi cập nhật.');
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const updated = await phanAnhApi.update(id, {
        trangThaiPhanAnh: newStatus,
        ghiChu: ghiChu.trim(),
      });
      setItem(updated);
      setSuccess(true);
      setTimeout(() => router.push('/phan-anh-cong-dan'), 1500);
    } catch (err: any) {
      setError(err.message || 'Cập nhật thất bại. Vui lòng thử lại.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Loading / Error states ──
  if (loading) {
    return (
      <div>
        <PageHeader title="Đang tải..." subtitle="Phản ánh công dân" />
        <div style={{ textAlign: 'center', padding: '60px', color: '#888', fontSize: '14px' }}>
          Đang tải dữ liệu phản ánh...
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div>
        <PageHeader
          title="Lỗi tải dữ liệu"
          subtitle={`Mã: ${id}`}
          actions={
            <GovBtn variant="secondary" onClick={() => router.push('/phan-anh-cong-dan')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại danh sách
            </GovBtn>
          }
        />
        <AlertBanner type="error" title={error} />
      </div>
    );
  }

  if (!item) {
    return (
      <div>
        <PageHeader
          title="Không tìm thấy phản ánh"
          subtitle={`Mã: ${id}`}
          actions={
            <GovBtn variant="secondary" onClick={() => router.push('/phan-anh-cong-dan')}>
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
        title={`Chi tiết phản ánh — ${item.maPhanAnh}`}
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Tiếp nhận và xử lý phản ánh từ người dân"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/phan-anh-cong-dan')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer style={{ width: 12, height: 12 }} /> In phiếu
            </GovBtn>
          </ActionButtons>
        }
      />

      {success && (
        <AlertBanner type="success" title="Đã cập nhật phản ánh thành công! Đang chuyển về danh sách..." />
      )}
      {error && <AlertBanner type="error" title={error} />}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        {[
          { label: 'Mã phản ánh', value: item.maPhanAnh, mono: true },
          { label: 'Ngày gửi',    value: formatDateTime(item.ngayGui), mono: true },
          { label: 'Người gửi',   value: item.tenNguoiPhanAnh },
          { label: 'Trạng thái',  value: trangThaiLabel[item.trangThaiPhanAnh] ?? item.trangThaiPhanAnh },
        ].map((c) => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #D6D6D6', borderRadius: '1px', padding: '10px 14px' }}>
            <p style={{ fontSize: '10.5px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '4px' }}>
              {c.label}
            </p>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#222', fontFamily: c.mono ? 'monospace' : 'inherit' }}>
              {c.value}
            </p>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '12px' }}>
        {/* ── Left: Chi tiết ── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {/* Người phản ánh */}
          <SectionCard title="Thông tin người gửi phản ánh">
            <div style={{ padding: '12px 14px' }}>
              <InfoRow label="Mã người dùng"  value={item.maNguoiPhanAnh} mono />
              <InfoRow label="Họ và tên"       value={item.tenNguoiPhanAnh} />
            </div>
          </SectionCard>

          {/* Nội dung phản ánh */}
          <SectionCard title="Nội dung phản ánh">
            <div style={{ padding: '12px 14px' }}>
              <InfoRow label="Tiêu đề"  value={item.tieuDe} />
              <InfoRow label="Lý do"    value={item.lyDo} />
              <InfoRow label="Địa điểm" value={item.diaDiem} />
              {item.ghiChu && (
                <div style={{ marginTop: '8px', padding: '8px 10px', background: '#FFFBEA', border: '1px solid #FFE082', borderRadius: '2px' }}>
                  <p style={{ fontSize: '11px', fontWeight: 600, color: '#7B6000', marginBottom: '4px' }}>GHI CHÚ CŨ</p>
                  <p style={{ fontSize: '13px', color: '#333' }}>{item.ghiChu}</p>
                </div>
              )}
            </div>
          </SectionCard>

          {/* Cơ sở bị phản ánh */}
          <SectionCard title="Cơ sở bị phản ánh">
            <div style={{ padding: '12px 14px' }}>
              <InfoRow label="Mã cơ sở"  value={item.maCoSo} mono />
              <InfoRow label="Tên cơ sở" value={item.tenCoSo} />
            </div>
          </SectionCard>
        </div>

        {/* ── Right: Xử lý ── */}
        <div>
          <SectionCard
            title="Cập nhật xử lý phản ánh"
            footer={
              <div style={{ display: 'flex', gap: '6px', justifyContent: 'flex-end' }}>
                <GovBtn
                  variant="secondary"
                  onClick={() => router.push('/phan-anh-cong-dan')}
                  disabled={submitting}
                >
                  Hủy
                </GovBtn>
                <GovBtn
                  variant="primary"
                  onClick={handleUpdate}
                  disabled={submitting || !ghiChu.trim()}
                >
                  <CheckCircle style={{ width: 12, height: 12 }} />
                  {submitting ? 'Đang cập nhật...' : 'Lưu cập nhật'}
                </GovBtn>
              </div>
            }
          >
            <div style={{ padding: '12px' }}>
              {/* Trạng thái hiện tại */}
              <div style={{ marginBottom: '12px' }}>
                <p style={{ fontSize: '11.5px', fontWeight: 600, color: '#444', marginBottom: '4px' }}>
                  TRẠNG THÁI HIỆN TẠI
                </p>
                <StatusBadge
                  variant={trangThaiVariant[item.trangThaiPhanAnh] ?? 'default'}
                  label={trangThaiLabel[item.trangThaiPhanAnh] ?? item.trangThaiPhanAnh}
                />
              </div>

              {/* Chọn trạng thái mới */}
              <FilterField label="Trạng thái mới">
                <GovSelect
                  value={newStatus}
                  onChange={setNewStatus}
                  options={TRANG_THAI_OPTIONS}
                  width="100%"
                />
              </FilterField>

              {/* Ghi chú xử lý */}
              <div style={{ marginTop: '10px' }}>
                <label style={{ display: 'block', fontSize: '11.5px', fontWeight: 600, color: '#444', marginBottom: '4px' }}>
                  GHI CHÚ XỬ LÝ <span style={{ color: '#CC0000' }}>*</span>
                </label>
                <textarea
                  value={ghiChu}
                  onChange={e => setGhiChu(e.target.value)}
                  placeholder="Nhập kết quả xử lý, lý do từ chối hoặc hướng dẫn gửi đến người dân..."
                  rows={6}
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
                  }}
                />
              </div>

              <p style={{ fontSize: '11px', color: '#888', marginTop: '8px' }}>
                Ghi chú sẽ được lưu vào hồ sơ phản ánh và thông báo đến người dân.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}