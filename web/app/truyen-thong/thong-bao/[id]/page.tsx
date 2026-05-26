'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save, Globe, Lock } from 'lucide-react';
import { thongBaoApi, ThongBaoItem, CreateThongBaoRequest } from '@/api/thongbao';
import {
  PageHeader, GovBtn, SectionCard, ActionButtons,
  FormSection, FormField, GovInput, GovSelect, StatusBadge,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

// ─── helpers ────────────────────────────────────────────────────
const LOAI_OPTIONS = [
  { value: 'THONG_BAO', label: 'Thông báo' },
  { value: 'KHAN_CAP',  label: 'Khẩn cấp' },
  { value: 'HUONG_DAN', label: 'Hướng dẫn' },
];
const CONG_DONG_OPTIONS = [
  { value: 'true',  label: 'Cộng đồng (hiển thị công khai)' },
  { value: 'false', label: 'Nội bộ (chỉ cán bộ)' },
];
const LOAI_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  KHAN_CAP:  { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
  THONG_BAO: { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
  HUONG_DAN: { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
};
const LOAI_LABEL: Record<string, string> = {
  KHAN_CAP: 'Khẩn cấp', THONG_BAO: 'Thông báo', HUONG_DAN: 'Hướng dẫn',
};
function formatDateTime(iso: string) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  } catch { return iso; }
}

// ─── component ──────────────────────────────────────────────────
export default function ThongBaoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem]       = useState<ThongBaoItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // form state
  const [tieuDe, setTieuDe]           = useState('');
  const [noiDung, setNoiDung]         = useState('');
  const [loai, setLoai]               = useState('THONG_BAO');
  const [isCongDong, setIsCongDong]   = useState('true');

  const [submitting, setSubmitting]   = useState(false);
  const [success, setSuccess]         = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    thongBaoApi.search({ page: 0, size: 100 })
      .then(res => {
        if (!mounted) return;
        // API không có getById, tìm trong danh sách hoặc thử trực tiếp
        const found = res.content.find(i => i.maThongBao === id);
        if (found) {
          setItem(found);
          setTieuDe(found.tieuDe);
          setNoiDung(found.noiDung);
          setLoai(found.loaiThongBao);
          setIsCongDong(String(found.isCongDong));
        } else {
          setError('Không tìm thấy thông báo.');
        }
        setLoading(false);
      })
      .catch((err: any) => {
        if (mounted) { setError(err.message || 'Không thể tải thông tin.'); setLoading(false); }
      });
    return () => { mounted = false; };
  }, [id]);

  const handleUpdate = async () => {
    if (!item) return;
    setSubmitting(true);
    setError(null);
    try {
      const body: CreateThongBaoRequest = {
        tieuDe:       tieuDe.trim(),
        noiDung:      noiDung.trim(),
        loaiThongBao: loai,
        isCongDong:   isCongDong === 'true',
      };
      const updated = await thongBaoApi.update(item.maThongBao, body);
      setItem(updated);
      setSuccess(true);
      setEditMode(false);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err.message || 'Cập nhật thất bại.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancelEdit = () => {
    if (!item) return;
    setTieuDe(item.tieuDe);
    setNoiDung(item.noiDung);
    setLoai(item.loaiThongBao);
    setIsCongDong(String(item.isCongDong));
    setEditMode(false);
    setError(null);
  };

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
      Đang tải thông báo...
    </div>
  );

  if (error && !item) return (
    <div>
      <PageHeader title="Không tìm thấy thông báo" subtitle={`Mã: ${id}`}
        actions={<GovBtn variant="secondary" onClick={() => router.push('/truyen-thong/thong-bao')}><ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại</GovBtn>}
      />
      <AlertBanner type="danger" title={error} />
    </div>
  );

  const loaiStyle = LOAI_STYLE[item!.loaiThongBao] ?? { bg: '#F0F0F0', color: '#555', border: '#CCC' };

  return (
    <div>
      <PageHeader
        title={editMode ? `Chỉnh sửa — ${item!.maThongBao}` : `Chi tiết thông báo — ${item!.maThongBao}`}
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Quản lý thông báo"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/truyen-thong/thong-bao')}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
            </GovBtn>
            {!editMode
              ? <GovBtn variant="primary" onClick={() => setEditMode(true)}>Chỉnh sửa</GovBtn>
              : <>
                  <GovBtn variant="secondary" onClick={handleCancelEdit} disabled={submitting}>Hủy</GovBtn>
                  <GovBtn variant="primary" onClick={handleUpdate} disabled={submitting}>
                    <Save style={{ width: 12, height: 12 }} />
                    {submitting ? 'Đang lưu...' : 'Lưu thay đổi'}
                  </GovBtn>
                </>
            }
          </ActionButtons>
        }
      />

      {success && <AlertBanner type="success" title="Cập nhật thông báo thành công!" />}
      {error   && <AlertBanner type="danger"   title={error} />}

      {/* Summary */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        {[
          { label: 'Mã thông báo', value: item!.maThongBao, mono: true },
          { label: 'Ngày gửi',     value: formatDateTime(item!.ngayGui), mono: true },
          { label: 'Loại',         value: LOAI_LABEL[item!.loaiThongBao] ?? item!.loaiThongBao },
          { label: 'Phạm vi',      value: item!.isCongDong ? 'Cộng đồng' : 'Nội bộ' },
        ].map(c => (
          <div key={c.label} style={{ background: '#fff', border: '1px solid #D6D6D6', padding: '10px 14px' }}>
            <p style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '4px' }}>{c.label}</p>
            <p style={{ fontSize: '13px', fontWeight: 700, color: '#222', fontFamily: c.mono ? 'monospace' : 'inherit' }}>{c.value}</p>
          </div>
        ))}
      </div>

      <SectionCard title={editMode ? 'Chỉnh sửa nội dung thông báo' : 'Nội dung thông báo'}>
        <div style={{ padding: '14px 16px' }}>
          {editMode ? (
            <FormSection title="Thông tin thông báo">
              <FormField label="Tiêu đề" required fullWidth>
                <GovInput placeholder="Tiêu đề thông báo..." value={tieuDe} onChange={setTieuDe} disabled={submitting} />
              </FormField>
              <FormField label="Loại thông báo" required>
                <GovSelect value={loai} onChange={setLoai} options={LOAI_OPTIONS} width={220} />
              </FormField>
              <FormField label="Phạm vi" required>
                <GovSelect value={isCongDong} onChange={setIsCongDong} options={CONG_DONG_OPTIONS} width={280} />
              </FormField>
              <FormField label="Nội dung" required fullWidth>
                <textarea
                  value={noiDung}
                  onChange={e => setNoiDung(e.target.value)}
                  rows={10}
                  disabled={submitting}
                  style={{ width: '100%', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '8px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.7 }}
                />
              </FormField>
            </FormSection>
          ) : (
            <>
              <div style={{ marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ padding: '2px 8px', borderRadius: '2px', border: `1px solid ${loaiStyle.border}`, background: loaiStyle.bg, color: loaiStyle.color, fontSize: '12px', fontWeight: 500 }}>
                  {LOAI_LABEL[item!.loaiThongBao] ?? item!.loaiThongBao}
                </span>
                {item!.isCongDong
                  ? <StatusBadge variant="active" label="Cộng đồng" />
                  : <StatusBadge variant="pending" label="Nội bộ" />
                }
              </div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>{item!.tieuDe}</h2>
              <div style={{ fontSize: '13px', lineHeight: 1.9, color: '#333', whiteSpace: 'pre-wrap', padding: '12px', background: '#F9F9F9', border: '1px solid #E8E8E8', borderRadius: '2px' }}>
                {item!.noiDung}
              </div>
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );
}