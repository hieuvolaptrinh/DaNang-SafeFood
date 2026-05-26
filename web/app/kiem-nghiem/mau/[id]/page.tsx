'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  ArrowLeft, Save, FlaskConical, CheckCircle2, XCircle,
  Clock, RefreshCw, Plus, Trash2, ChevronDown,
} from 'lucide-react';
import {
  PageHeader, GovBtn, SectionCard, StatusBadge, ActionButtons,
} from '@/components/GovUI';
import AlertBanner from '@/components/AlertBanner';
import { mauKiemNghiemApi, MauKiemNghiemItem } from '@/api/maukiemnghiem';

interface MauChiTieuRow {
  maChiTieu: string;
  tenChiTieu: string;
  giaTriDo: string;
  gioiHanChoPhep: string;
  ketQua: 'Đạt' | 'Không đạt' | '';
}

interface ChiTieuKiemNghiem {
  maChiTieu: string;
  tenChiTieu: string;
}

const allChiTieu: ChiTieuKiemNghiem[] = [
  { maChiTieu: 'CT001', tenChiTieu: 'Chỉ tiêu vi sinh vật tổng số' },
  { maChiTieu: 'CT002', tenChiTieu: 'Coliform tổng số' },
  { maChiTieu: 'CT003', tenChiTieu: 'E.coli' },
  { maChiTieu: 'CT004', tenChiTieu: 'Salmonella' },
  { maChiTieu: 'CT005', tenChiTieu: 'Kim loại nặng (Pb, Hg, Cd)' },
];

const initialRows: MauChiTieuRow[] = [
  { maChiTieu: 'CT001', tenChiTieu: 'Chỉ tiêu vi sinh vật tổng số', giaTriDo: '10^3 CFU/g', gioiHanChoPhep: '<= 10^4 CFU/g', ketQua: 'Đạt' },
  { maChiTieu: 'CT003', tenChiTieu: 'E.coli', giaTriDo: 'Âm tính', gioiHanChoPhep: 'Âm tính', ketQua: 'Đạt' },
];

const statusVariant: Record<string, string> = {
  'Chưa kiểm nghiệm': 'pending',
  'Đang kiểm nghiệm': 'in-progress',
  'Hoàn thành': 'resolved',
  'Đã tiếp nhận': 'pending',
  'received': 'pending',
  'testing': 'in-progress',
  'completed': 'resolved',
  'cancelled': 'expired',
};

const statusLabel: Record<string, string> = {
  'Chưa kiểm nghiệm': 'Chưa kiểm nghiệm',
  'Đang kiểm nghiệm': 'Đang kiểm nghiệm',
  'Hoàn thành': 'Hoàn thành',
  'Đã tiếp nhận': 'Đã tiếp nhận',
  'received': 'Đã tiếp nhận',
  'testing': 'Đang kiểm nghiệm',
  'completed': 'Hoàn thành',
  'cancelled': 'Hủy bỏ',
};

export default function MauChiTieuPage() {
  const nextParams = useParams();
  const maMau = nextParams?.id as string;

  const [mauDetail, setMauDetail] = useState<MauKiemNghiemItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  
  // Status form fields
  const [selectedStatus, setSelectedStatus] = useState('Chưa kiểm nghiệm');
  const [ghiChu, setGhiChu] = useState('');

  // Local criteria rows
  const [rows, setRows] = useState<MauChiTieuRow[]>([]);
  const [addingNew, setAddingNew] = useState(false);
  const [newChiTieu, setNewChiTieu] = useState('');
  const [newGiaTri, setNewGiaTri] = useState('');
  const [newGioiHan, setNewGioiHan] = useState('');
  const [newKetQua, setNewKetQua] = useState<'Đạt' | 'Không đạt' | ''>('');
  
  // Catalog list of criteria from API
  const [danhMucChiTieu, setDanhMucChiTieu] = useState<ChiTieuKiemNghiem[]>([]);

  const fetchDetailAndCriteria = async () => {
    if (!maMau) return;
    setLoading(true);
    setError('');
    try {
      const [detailData, criteriaList, catalogList] = await Promise.all([
        mauKiemNghiemApi.getById(maMau),
        mauKiemNghiemApi.getChiTieuList(maMau),
        mauKiemNghiemApi.getDanhMucChiTieu().catch(() => []) // gracefully handle catalog fetch errors
      ]);
      setMauDetail(detailData);
      setSelectedStatus(detailData.trangThai || 'Chưa kiểm nghiệm');
      
      // Load catalog from API, fallback to default hardcoded catalog if empty
      const catalog = (catalogList && catalogList.length > 0) ? catalogList : allChiTieu;
      setDanhMucChiTieu(catalog);

      if (criteriaList && criteriaList.length > 0) {
        setRows(criteriaList.map(item => ({
          maChiTieu: item.maChiTieu,
          tenChiTieu: item.tenChiTieu || '',
          giaTriDo: item.giaTriDo || '',
          gioiHanChoPhep: item.gioiHanChoPhep || '',
          ketQua: (item.ketQua === 'Đạt' || item.ketQua === 'Không đạt') ? item.ketQua : '',
        })));
      } else {
        setRows([]);
      }
    } catch (err: any) {
      setError(err.message || 'Không thể tải thông tin mẫu kiểm nghiệm.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDetailAndCriteria();
  }, [maMau]);

  const updateRow = (index: number, field: keyof MauChiTieuRow, value: string) => {
    setRows(prev => prev.map((r, i) => i === index ? { ...r, [field]: value } : r));
    setSaved(false);
  };

  const removeRow = (index: number) => {
    setRows(prev => prev.filter((_, i) => i !== index));
    setSaved(false);
  };

  const addRow = () => {
    if (!newChiTieu || !newGiaTri || !newGioiHan || !newKetQua) {
      setError('Vui lòng điền đầy đủ thông tin chỉ tiêu mới.');
      return;
    }
    const ct = danhMucChiTieu.find(c => c.maChiTieu === newChiTieu)!;
    setRows(prev => [...prev, {
      maChiTieu: ct.maChiTieu,
      tenChiTieu: ct.tenChiTieu,
      giaTriDo: newGiaTri,
      gioiHanChoPhep: newGioiHan,
      ketQua: newKetQua,
    }]);
    setNewChiTieu('');
    setNewGiaTri('');
    setNewGioiHan('');
    setNewKetQua('');
    setAddingNew(false);
    setError('');
    setSaved(false);
  };

  const handleSaveStatus = async () => {
    if (!maMau) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const updated = await mauKiemNghiemApi.updateTrangThai(maMau, {
        trangThai: selectedStatus,
        ghiChu: ghiChu || 'Cập nhật từ trang chi tiết',
      });
      setMauDetail(updated);
      setSaved(true);
      setGhiChu('');
    } catch (err: any) {
      setError(err.message || 'Không thể cập nhật trạng thái.');
    } finally {
      setSaving(false);
    }
  };

  const handleSaveChiTieu = async () => {
    if (!maMau) return;
    setSaving(true);
    setError('');
    setSaved(false);
    try {
      const body = {
        chiTieus: rows.map(r => ({
          maChiTieu: r.maChiTieu,
          giaTriDo: r.giaTriDo,
          gioiHanChoPhep: r.gioiHanChoPhep,
          ketQua: r.ketQua,
        }))
      };
      const updatedList = await mauKiemNghiemApi.updateChiTieuList(maMau, body);
      setRows(updatedList.map(item => ({
        maChiTieu: item.maChiTieu,
        tenChiTieu: item.tenChiTieu || '',
        giaTriDo: item.giaTriDo || '',
        gioiHanChoPhep: item.gioiHanChoPhep || '',
        ketQua: (item.ketQua === 'Đạt' || item.ketQua === 'Không đạt') ? item.ketQua : '',
      })));
      setSaved(true);
    } catch (err: any) {
      setError(err.message || 'Không thể lưu danh sách chỉ tiêu.');
    } finally {
      setSaving(false);
    }
  };

  const availableChiTieu = danhMucChiTieu.filter(
    ct => !rows.some(r => r.maChiTieu === ct.maChiTieu),
  );

  const overallKetQua = rows.length > 0
    ? rows.every(r => r.ketQua === 'Đạt') ? 'pass' : 'fail'
    : null;

  if (loading) {
    return (
      <div style={{ padding: '60px', textAlign: 'center', color: '#888', fontSize: '13px' }}>
        Đang tải thông tin mẫu kiểm nghiệm...
      </div>
    );
  }

  if (error && !mauDetail) {
    return (
      <div>
        <PageHeader
          title="Lỗi tải mẫu kiểm nghiệm"
          subtitle="Không tìm thấy thông tin hoặc đã xảy ra lỗi."
          actions={
            <Link href="/kiem-nghiem/mau">
              <GovBtn variant="secondary">
                <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
              </GovBtn>
            </Link>
          }
        />
        <AlertBanner type="danger" title={error} />
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={`Kết quả kiểm nghiệm — ${maMau}`}
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — Nhập và cập nhật kết quả từng chỉ tiêu kiểm nghiệm"
        actions={
          <ActionButtons>
            <Link href="/kiem-nghiem/mau">
              <GovBtn variant="secondary">
                <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
              </GovBtn>
            </Link>
            <GovBtn variant="secondary" onClick={fetchDetailAndCriteria}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Tải lại
            </GovBtn>
          </ActionButtons>
        }
      />

      {saved && (
        <AlertBanner type="success" title="Trạng thái mẫu đã được cập nhật thành công." />
      )}
      {error && (
        <AlertBanner type="warning" title={error} />
      )}

      {/* Mau info */}
      <div style={{ display: 'grid', gridTemplateColumns: '3fr 1.5fr', gap: '16px', marginBottom: '16px' }}>
        <SectionCard title="Thông tin mẫu kiểm nghiệm">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: '12px 24px',
            padding: '4px 0',
          }}>
            <InfoRow label="Mã mẫu" value={mauDetail?.maMau} mono />
            <InfoRow label="Tên mẫu" value={mauDetail?.tenMau} />
            <InfoRow label="Loại mẫu">
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
                <FlaskConical style={{ width: 12, height: 12, color: '#005A9E' }} />
                {mauDetail?.loaiMau}
              </span>
            </InfoRow>
            <InfoRow label="Ngày thu mẫu" value={mauDetail?.ngayThu} mono />
            <InfoRow label="Ngày kiểm nghiệm" value={mauDetail?.ngayKiemNghiem || 'Chưa thực hiện'} mono />
            <InfoRow label="Ngày yêu cầu" value={mauDetail?.ngayYeuCau} mono />
            <InfoRow label="Hạn hoàn thành" value={mauDetail?.hanHoanThanh} mono />
            <InfoRow label="Nội dung / Mô tả" value={mauDetail?.noiDung || '—'} />
            <InfoRow label="Trạng thái hiện tại">
              <StatusBadge variant={statusVariant[mauDetail?.trangThai || '']} label={statusLabel[mauDetail?.trangThai || '']} />
            </InfoRow>
            {overallKetQua && (
              <InfoRow label="Kết quả tổng hợp (Chỉ tiêu)">
                {overallKetQua === 'pass'
                  ? <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#15803d', fontWeight: 600, fontSize: 12 }}>
                      <CheckCircle2 style={{ width: 14, height: 14 }} /> Đạt yêu cầu ATTP
                    </span>
                  : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, color: '#b91c1c', fontWeight: 600, fontSize: 12 }}>
                      <XCircle style={{ width: 14, height: 14 }} /> Không đạt yêu cầu ATTP
                    </span>
                }
              </InfoRow>
            )}
          </div>
        </SectionCard>

        <SectionCard title="Cập nhật trạng thái mẫu">
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div>
              <label style={{ fontSize: '11px', color: '#555', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Trạng thái kiểm nghiệm</label>
              <select
                value={selectedStatus}
                onChange={e => setSelectedStatus(e.target.value)}
                style={inputStyle}
              >
                <option value="Chưa kiểm nghiệm">Chưa kiểm nghiệm</option>
                <option value="Đang kiểm nghiệm">Đang kiểm nghiệm</option>
                <option value="Hoàn thành">Hoàn thành</option>
              </select>
            </div>
            <div>
              <label style={{ fontSize: '11px', color: '#555', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Ghi chú kiểm nghiệm</label>
              <textarea
                value={ghiChu}
                onChange={e => setGhiChu(e.target.value)}
                placeholder="Nhập kết luận hoặc ghi chú..."
                rows={3}
                style={{ ...inputStyle, resize: 'none' }}
              />
            </div>
            <GovBtn variant="primary" onClick={handleSaveStatus} disabled={saving} style={{ marginTop: '4px' }}>
              {saving ? 'Đang lưu...' : 'Lưu trạng thái'}
            </GovBtn>
          </div>
        </SectionCard>
      </div>

      {/* Chi tieu table */}
      <SectionCard
        title={`Chỉ tiêu kiểm nghiệm thực tế (${rows.length} chỉ tiêu)`}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', padding: '6px 0' }}>
            <GovBtn variant="primary" onClick={handleSaveChiTieu} disabled={saving}>
              <Save style={{ width: 12, height: 12 }} /> Lưu chỉ tiêu
            </GovBtn>
            {availableChiTieu.length > 0 && (
              <GovBtn variant="secondary" onClick={() => setAddingNew(v => !v)}>
                <Plus style={{ width: 12, height: 12 }} /> Thêm chỉ tiêu
              </GovBtn>
            )}
          </div>
        }
      >
        {/* Table header */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '110px 1fr 140px 160px 100px 36px',
          gap: '0 8px',
          padding: '6px 8px',
          background: '#f0f4f8',
          borderBottom: '1px solid #d0d9e4',
          fontSize: 11,
          fontWeight: 700,
          color: '#444',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
        }}>
          <span>Mã chỉ tiêu</span>
          <span>Tên chỉ tiêu</span>
          <span>Giá trị đo được</span>
          <span>Giới hạn cho phép</span>
          <span>Kết quả</span>
          <span></span>
        </div>

        {/* Rows */}
        {rows.length === 0 && (
          <div style={{ padding: '24px', textAlign: 'center', color: '#888', fontSize: 13 }}>
            Chưa có chỉ tiêu kiểm nghiệm nào. Nhấn "Thêm chỉ tiêu" để bắt đầu.
          </div>
        )}
        {rows.map((row, i) => (
          <div
            key={row.maChiTieu}
            style={{
              display: 'grid',
              gridTemplateColumns: '110px 1fr 140px 160px 100px 36px',
              gap: '0 8px',
              padding: '8px 8px',
              borderBottom: '1px solid #eef1f5',
              alignItems: 'center',
              background: i % 2 === 0 ? '#fff' : '#fafbfc',
            }}
          >
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E', fontSize: 12 }}>
              {row.maChiTieu}
            </span>
            <span style={{ fontSize: 12, color: '#222' }}>{row.tenChiTieu}</span>
            <input
              value={row.giaTriDo}
              onChange={e => updateRow(i, 'giaTriDo', e.target.value)}
              placeholder="VD: 10^3 CFU/g"
              style={inputStyle}
            />
            <input
              value={row.gioiHanChoPhep}
              onChange={e => updateRow(i, 'gioiHanChoPhep', e.target.value)}
              placeholder="VD: <= 10^4 CFU/g"
              style={inputStyle}
            />
            <div style={{ position: 'relative' }}>
              <select
                value={row.ketQua}
                onChange={e => updateRow(i, 'ketQua', e.target.value as 'Đạt' | 'Không đạt')}
                style={{
                  ...inputStyle,
                  width: '100%',
                  appearance: 'none',
                  paddingRight: 20,
                  color: row.ketQua === 'Đạt' ? '#15803d' : row.ketQua === 'Không đạt' ? '#b91c1c' : '#333',
                  fontWeight: row.ketQua ? 600 : 400,
                }}
              >
                <option value="">-- Chọn --</option>
                <option value="Đạt">Đạt</option>
                <option value="Không đạt">Không đạt</option>
              </select>
              <ChevronDown style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: '#888', pointerEvents: 'none' }} />
            </div>
            <button
              onClick={() => removeRow(i)}
              style={{
                border: 'none', background: 'none', cursor: 'pointer',
                color: '#b91c1c', padding: 4, borderRadius: 4,
                display: 'flex', alignItems: 'center',
              }}
              title="Xóa chỉ tiêu"
            >
              <Trash2 style={{ width: 13, height: 13 }} />
            </button>
          </div>
        ))}

        {addingNew && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '110px 1fr 140px 160px 100px 36px',
            gap: '0 8px',
            padding: '10px 8px',
            borderBottom: '1px solid #eef1f5',
            alignItems: 'center',
            background: '#f0f7ff',
            borderTop: '2px dashed #93c5fd',
          }}>
            <div style={{ position: 'relative', gridColumn: '1 / 3' }}>
              <select
                value={newChiTieu}
                onChange={e => setNewChiTieu(e.target.value)}
                style={{ ...inputStyle, width: '100%', appearance: 'none', paddingRight: 20 }}
              >
                <option value="">-- Chọn chỉ tiêu --</option>
                {availableChiTieu.map(ct => (
                  <option key={ct.maChiTieu} value={ct.maChiTieu}>
                    {ct.maChiTieu} — {ct.tenChiTieu}
                  </option>
                ))}
              </select>
              <ChevronDown style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: '#888', pointerEvents: 'none' }} />
            </div>
            <input
              value={newGiaTri}
              onChange={e => setNewGiaTri(e.target.value)}
              placeholder="Giá trị đo"
              style={inputStyle}
            />
            <input
              value={newGioiHan}
              onChange={e => setNewGioiHan(e.target.value)}
              placeholder="Giới hạn cho phép"
              style={inputStyle}
            />
            <div style={{ position: 'relative' }}>
              <select
                value={newKetQua}
                onChange={e => setNewKetQua(e.target.value as 'Đạt' | 'Không đạt')}
                style={{ ...inputStyle, width: '100%', appearance: 'none', paddingRight: 20 }}
              >
                <option value="">-- Kết quả --</option>
                <option value="Đạt">Đạt</option>
                <option value="Không đạt">Không đạt</option>
              </select>
              <ChevronDown style={{ position: 'absolute', right: 4, top: '50%', transform: 'translateY(-50%)', width: 12, height: 12, color: '#888', pointerEvents: 'none' }} />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              <button
                onClick={addRow}
                style={{
                  border: '1px solid #005A9E', background: '#005A9E', color: '#fff',
                  borderRadius: 4, cursor: 'pointer', padding: '3px 6px', fontSize: 11, fontWeight: 600,
                }}
              >
                Thêm
              </button>
              <button
                onClick={() => { setAddingNew(false); setError(''); }}
                style={{
                  border: '1px solid #ccc', background: '#fff', color: '#555',
                  borderRadius: 4, cursor: 'pointer', padding: '3px 6px', fontSize: 11,
                }}
              >
                Hủy
              </button>
            </div>
          </div>
        )}

        {rows.length > 0 && (
          <div style={{
            display: 'flex',
            gap: 16,
            padding: '10px 8px',
            background: '#f8f9fb',
            borderTop: '2px solid #e2e8f0',
            fontSize: 12,
          }}>
            <SummaryChip
              icon={<CheckCircle2 style={{ width: 12, height: 12 }} />}
              count={rows.filter(r => r.ketQua === 'Đạt').length}
              label="Đạt"
              color="#15803d"
              bg="#dcfce7"
            />
            <SummaryChip
              icon={<XCircle style={{ width: 12, height: 12 }} />}
              count={rows.filter(r => r.ketQua === 'Không đạt').length}
              label="Không đạt"
              color="#b91c1c"
              bg="#fee2e2"
            />
            <SummaryChip
              icon={<Clock style={{ width: 12, height: 12 }} />}
              count={rows.filter(r => !r.ketQua).length}
              label="Chưa có kết quả"
              color="#92400e"
              bg="#fef3c7"
            />
          </div>
        )}
      </SectionCard>
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  width: '100%',
  border: '1px solid #d0d9e4',
  borderRadius: 4,
  padding: '4px 6px',
  fontSize: 12,
  color: '#222',
  background: '#fff',
  outline: 'none',
  boxSizing: 'border-box',
};

function InfoRow({
  label,
  value,
  mono,
  children,
}: {
  label: string;
  value?: string;
  mono?: boolean;
  children?: React.ReactNode;
}) {
  return (
    <div>
      <p style={{ fontSize: 11, color: '#777', marginBottom: 2, fontWeight: 500 }}>{label}</p>
      {children ?? (
        <p style={{ fontSize: 13, color: '#111', fontFamily: mono ? 'monospace' : undefined, fontWeight: mono ? 600 : 400 }}>
          {value ?? '—'}
        </p>
      )}
    </div>
  );
}

function SummaryChip({
  icon, count, label, color, bg,
}: {
  icon: React.ReactNode;
  count: number;
  label: string;
  color: string;
  bg: string;
}) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      padding: '3px 10px', borderRadius: 12,
      background: bg, color, fontWeight: 600, fontSize: 11,
    }}>
      {icon}
      {count} {label}
    </span>
  );
}