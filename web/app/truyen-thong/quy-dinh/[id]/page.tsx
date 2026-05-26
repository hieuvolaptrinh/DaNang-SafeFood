'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import { quyDinhApi, QuyDinhItem, CreateQuyDinhRequest } from '@/api/quidinh';
import {
  PageHeader, GovBtn, SectionCard, ActionButtons,
  FormSection, FormField, GovInput, GovSelect, StatusBadge,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';

// ─── helpers ────────────────────────────────────────────────────
const LOAI_OPTIONS = [
  { value: 'QUY_DINH',  label: 'Quy định' },
  { value: 'HUONG_DAN', label: 'Hướng dẫn' },
  { value: 'THONG_TU',  label: 'Thông tư' },
  { value: 'NGHI_DINH', label: 'Nghị định' },
];
const TRANG_THAI_OPTIONS = [
  { value: 'NHAP',         label: 'Bản nháp' },
  { value: 'HIEU_LUC',     label: 'Đang hiệu lực' },
  { value: 'HET_HIEU_LUC', label: 'Hết hiệu lực' },
];
const TRANG_THAI_VARIANT: Record<string, string> = {
  NHAP: 'pending', HIEU_LUC: 'active', HET_HIEU_LUC: 'expired',
};
const TRANG_THAI_LABEL: Record<string, string> = {
  NHAP: 'Bản nháp', HIEU_LUC: 'Đang hiệu lực', HET_HIEU_LUC: 'Hết hiệu lực',
};
const LOAI_STYLE: Record<string, { bg: string; color: string; border: string }> = {
  QUY_DINH:  { bg: '#EAF7EA', color: '#006400', border: '#94C994' },
  HUONG_DAN: { bg: '#E3EFFA', color: '#005A9E', border: '#9FC3E0' },
  THONG_TU:  { bg: '#FFF4E5', color: '#CC6600', border: '#FFCC80' },
  NGHI_DINH: { bg: '#FDECEA', color: '#CC0000', border: '#F5BCBC' },
};
const LOAI_LABEL: Record<string, string> = {
  QUY_DINH: 'Quy định', HUONG_DAN: 'Hướng dẫn', THONG_TU: 'Thông tư', NGHI_DINH: 'Nghị định',
};
function formatDate(d: string) {
  if (!d) return '—';
  try { return new Date(d).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }); }
  catch { return d; }
}

// ─── component ──────────────────────────────────────────────────
export default function QuyDinhDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [item, setItem]         = useState<QuyDinhItem | null>(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [editMode, setEditMode] = useState(false);

  // form state — sync from item
  const [tieuDe, setTieuDe]           = useState('');
  const [noiDung, setNoiDung]         = useState('');
  const [loai, setLoai]               = useState('QUY_DINH');
  const [trangThai, setTrangThai]     = useState('NHAP');
  const [ngayBanHanh, setNgayBanHanh] = useState('');

  const [submitting, setSubmitting]   = useState(false);
  const [success, setSuccess]         = useState(false);

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    setLoading(true);
    quyDinhApi.search({ page: 0, size: 100 })
      .then(res => {
        if (!mounted) return;
        const found = res.content.find(i => i.maQuyDinh === id);
        if (found) {
          setItem(found);
          setTieuDe(found.tieuDe);
          setNoiDung(found.noiDung);
          setLoai(found.loai);
          setTrangThai(found.trangThai);
          setNgayBanHanh(found.ngayBanHanh); // YYYY-MM-DD
        } else {
          setError('Không tìm thấy văn bản quy định.');
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
      const body: CreateQuyDinhRequest = {
        tieuDe:      tieuDe.trim(),
        noiDung:     noiDung.trim(),
        loai,
        trangThai,
        ngayBanHanh,
      };
      const updated = await quyDinhApi.update(item.maQuyDinh, body);
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
    setLoai(item.loai);
    setTrangThai(item.trangThai);
    setNgayBanHanh(item.ngayBanHanh);
    setEditMode(false);
    setError(null);
  };

  if (loading) return (
    <div style={{ padding: '60px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
      Đang tải văn bản quy định...
    </div>
  );

  if (error && !item) return (
    <div>
      <PageHeader title="Không tìm thấy văn bản" subtitle={`Mã: ${id}`}
        actions={<GovBtn variant="secondary" onClick={() => router.push('/truyen-thong/quy-dinh')}><ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại</GovBtn>}
      />
      <AlertBanner type="error" title={error} />
    </div>
  );

  const loaiStyle = LOAI_STYLE[item!.loai] ?? { bg: '#F0F0F0', color: '#555', border: '#CCC' };

  return (
    <div>
      <PageHeader
        title={editMode ? `Chỉnh sửa — ${item!.maQuyDinh}` : `Chi tiết văn bản — ${item!.maQuyDinh}`}
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Thư viện văn bản quy phạm pháp luật"
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={() => router.push('/truyen-thong/quy-dinh')}>
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

      {success && <AlertBanner type="success" title="Cập nhật văn bản quy định thành công!" />}
      {error   && <AlertBanner type="error"   title={error} />}

      {/* Summary cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '12px' }}>
        {[
          { label: 'Mã quy định',    value: item!.maQuyDinh, mono: true },
          { label: 'Ngày ban hành',  value: formatDate(item!.ngayBanHanh), mono: true },
          { label: 'Người tạo',      value: item!.createdBy || '—' },
          { label: 'Trạng thái',     value: <StatusBadge variant={TRANG_THAI_VARIANT[item!.trangThai] ?? 'pending'} label={TRANG_THAI_LABEL[item!.trangThai] ?? item!.trangThai} /> },
        ].map((c, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #D6D6D6', padding: '10px 14px' }}>
            <p style={{ fontSize: '10.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '4px' }}>{c.label}</p>
            <div style={{ fontSize: '13px', fontWeight: 700, color: '#222', fontFamily: c.mono ? 'monospace' : 'inherit' }}>{c.value}</div>
          </div>
        ))}
      </div>

      <SectionCard title={editMode ? 'Chỉnh sửa nội dung văn bản' : 'Nội dung văn bản quy định'}>
        <div style={{ padding: '14px 16px' }}>
          {editMode ? (
            <FormSection title="Thông tin văn bản">
              <FormField label="Tiêu đề" required fullWidth>
                <GovInput placeholder="Tiêu đề văn bản..." value={tieuDe} onChange={setTieuDe} disabled={submitting} />
              </FormField>
              <FormField label="Loại văn bản" required>
                <GovSelect value={loai} onChange={setLoai} options={LOAI_OPTIONS} width={200} />
              </FormField>
              <FormField label="Trạng thái" required>
                <GovSelect value={trangThai} onChange={setTrangThai} options={TRANG_THAI_OPTIONS} width={200} />
              </FormField>
              <FormField label="Ngày ban hành" required>
                <GovInput type="date" value={ngayBanHanh} onChange={setNgayBanHanh} disabled={submitting} width={180} />
              </FormField>
              <FormField label="Nội dung" required fullWidth>
                <textarea
                  value={noiDung}
                  onChange={e => setNoiDung(e.target.value)}
                  rows={12}
                  disabled={submitting}
                  style={{ width: '100%', border: '1px solid #D6D6D6', borderRadius: '2px', padding: '8px', fontSize: '13px', fontFamily: 'inherit', resize: 'vertical', outline: 'none', boxSizing: 'border-box', lineHeight: 1.7 }}
                />
              </FormField>
            </FormSection>
          ) : (
            <>
              <div style={{ marginBottom: '12px', display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ padding: '2px 8px', borderRadius: '2px', border: `1px solid ${loaiStyle.border}`, background: loaiStyle.bg, color: loaiStyle.color, fontSize: '12px', fontWeight: 500 }}>
                  {LOAI_LABEL[item!.loai] ?? item!.loai}
                </span>
                <StatusBadge variant={TRANG_THAI_VARIANT[item!.trangThai] ?? 'pending'} label={TRANG_THAI_LABEL[item!.trangThai] ?? item!.trangThai} />
              </div>
              <h2 style={{ fontSize: '15px', fontWeight: 700, color: '#111', marginBottom: '12px' }}>{item!.tieuDe}</h2>
              <div style={{ fontSize: '13px', lineHeight: 1.9, color: '#333', whiteSpace: 'pre-wrap', padding: '12px', background: '#F9F9F9', border: '1px solid #E8E8E8', borderRadius: '2px' }}>
                {item!.noiDung}
              </div>
              <p style={{ fontSize: '11px', color: '#999', marginTop: '12px' }}>
                Cập nhật lần cuối: {formatDate(item!.updatedAt)} — Người tạo: {item!.createdBy || '—'}
              </p>
            </>
          )}
        </div>
      </SectionCard>
    </div>
  );
}