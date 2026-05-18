'use client';

import { useState } from 'react';
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

// ─── Types ──────────────────────────────────────────────────────────────────

interface ChiTieuKiemNghiem {
  maChiTieu: string;
  tenChiTieu: string;
}

interface MauChiTieuRow {
  maChiTieu: string;
  tenChiTieu: string;
  giaTriDo: string;
  gioiHanChoPhep: string;
  ketQua: 'Đạt' | 'Không đạt' | '';
}

interface MauKiemNghiemDetail {
  maMau: string;
  businessName: string;
  sampleType: string;
  collectedDate: string;
  collectedBy: string;
  lab: string;
  status: 'received' | 'testing' | 'completed' | 'cancelled';
  inspectionId: string;
}

// ─── Mock data ───────────────────────────────────────────────────────────────

const mockMauDetail: MauKiemNghiemDetail = {
  maMau: 'MKN-2025001',
  businessName: 'Nhà hàng Phở Ba Miền',
  sampleType: 'Nước uống',
  collectedDate: '10/01/2025',
  collectedBy: 'Nguyễn Văn Trần',
  lab: 'Phòng xét nghiệm Sở Y tế',
  status: 'testing',
  inspectionId: 'INS-2847',
};

// Danh sách chỉ tiêu từ bảng chỉ tiêu (image 1)
const allChiTieu: ChiTieuKiemNghiem[] = [
  { maChiTieu: 'CT001', tenChiTieu: 'Chỉ tiêu vi sinh vật tổng số' },
  { maChiTieu: 'CT002', tenChiTieu: 'Coliform tổng số' },
  { maChiTieu: 'CT003', tenChiTieu: 'E.coli' },
  { maChiTieu: 'CT004', tenChiTieu: 'Salmonella' },
  { maChiTieu: 'CT005', tenChiTieu: 'Kim loại nặng (Pb, Hg, Cd)' },
];

// Dữ liệu hiện có (image 2 — mau_chi_tieu table)
const initialRows: MauChiTieuRow[] = [
  { maChiTieu: 'CT001', tenChiTieu: 'Chỉ tiêu vi sinh vật tổng số', giaTriDo: '10^3 CFU/g', gioiHanChoPhep: '<= 10^4 CFU/g', ketQua: 'Đạt' },
  { maChiTieu: 'CT003', tenChiTieu: 'E.coli', giaTriDo: 'Âm tính', gioiHanChoPhep: 'Âm tính', ketQua: 'Đạt' },
];

const statusVariant: Record<string, string> = {
  received: 'pending',
  testing: 'in-progress',
  completed: 'resolved',
  cancelled: 'expired',
};
const statusLabel: Record<string, string> = {
  received: 'Đã tiếp nhận',
  testing: 'Đang kiểm nghiệm',
  completed: 'Hoàn thành',
  cancelled: 'Hủy bỏ',
};

// ─── Component ───────────────────────────────────────────────────────────────

export default function MauChiTieuPage() {
  const params = useParams();
  const maMau = (params?.id as string) ?? mockMauDetail.maMau;

  const [rows, setRows] = useState<MauChiTieuRow[]>(initialRows);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const [addingNew, setAddingNew] = useState(false);
  const [newChiTieu, setNewChiTieu] = useState('');
  const [newGiaTri, setNewGiaTri] = useState('');
  const [newGioiHan, setNewGioiHan] = useState('');
  const [newKetQua, setNewKetQua] = useState<'Đạt' | 'Không đạt' | ''>('');

  const mauDetail = mockMauDetail;

  // ── Helpers ──────────────────────────────────────────────────────────────

  const availableChiTieu = allChiTieu.filter(
    ct => !rows.some(r => r.maChiTieu === ct.maChiTieu),
  );

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
    const ct = allChiTieu.find(c => c.maChiTieu === newChiTieu)!;
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

  const handleSave = async () => {
    setError('');
    if (rows.some(r => !r.giaTriDo || !r.gioiHanChoPhep || !r.ketQua)) {
      setError('Vui lòng điền đầy đủ giá trị đo, giới hạn và kết quả cho tất cả chỉ tiêu.');
      return;
    }
    setSaving(true);
    try {
      // PUT /api/mau-kiem-nghiem/{maMau}/chi-tieu
      const body = {
        chiTieus: rows.map(r => ({
          maChiTieu: r.maChiTieu,
          giaTriDo: r.giaTriDo,
          gioiHanChoPhep: r.gioiHanChoPhep,
          ketQua: r.ketQua,
        })),
      };
      // Simulated API call
      await new Promise(res => setTimeout(res, 800));
      console.log(`PUT /api/mau-kiem-nghiem/${maMau}/chi-tieu`, body);
      setSaved(true);
    } catch {
      setError('Lưu thất bại. Vui lòng thử lại.');
    } finally {
      setSaving(false);
    }
  };

  const overallKetQua = rows.length > 0
    ? rows.every(r => r.ketQua === 'Đạt') ? 'pass' : 'fail'
    : null;

  // ── Render ───────────────────────────────────────────────────────────────

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
            <GovBtn variant="secondary" onClick={() => setRows(initialRows)}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Đặt lại
            </GovBtn>
            <GovBtn variant="primary" onClick={handleSave} disabled={saving}>
              {saving
                ? <><RefreshCw style={{ width: 12, height: 12, animation: 'spin 1s linear infinite' }} /> Đang lưu...</>
                : <><Save style={{ width: 12, height: 12 }} /> Lưu kết quả</>
              }
            </GovBtn>
          </ActionButtons>
        }
      />

      {/* Alerts */}
      {saved && (
        <AlertBanner type="success" title="Kết quả chỉ tiêu đã được cập nhật thành công." />
      )}
      {error && (
        <AlertBanner type="warning" title={error} />
      )}

      {/* Mau info */}
      <SectionCard title="Thông tin mẫu kiểm nghiệm">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: '12px 24px',
          padding: '4px 0',
        }}>
          <InfoRow label="Mã mẫu" value={mauDetail.maMau} mono />
          <InfoRow label="Mã thanh tra" value={mauDetail.inspectionId} mono />
          <InfoRow label="Trạng thái">
            <StatusBadge variant={statusVariant[mauDetail.status]} label={statusLabel[mauDetail.status]} />
          </InfoRow>
          <InfoRow label="Cơ sở lấy mẫu" value={mauDetail.businessName} />
          <InfoRow label="Loại mẫu">
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 4, fontSize: 12 }}>
              <FlaskConical style={{ width: 12, height: 12, color: '#005A9E' }} />
              {mauDetail.sampleType}
            </span>
          </InfoRow>
          <InfoRow label="Ngày lấy mẫu" value={mauDetail.collectedDate} mono />
          <InfoRow label="Người lấy mẫu" value={mauDetail.collectedBy} />
          <InfoRow label="Đơn vị kiểm nghiệm" value={mauDetail.lab} />
          {overallKetQua && (
            <InfoRow label="Kết quả tổng hợp">
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

      {/* Chi tieu table */}
      <SectionCard
        title={`Chỉ tiêu kiểm nghiệm (${rows.length} chỉ tiêu)`}
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', padding: '6px 0' }}>
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
            {/* Mã chỉ tiêu */}
            <span style={{ fontFamily: 'monospace', fontWeight: 600, color: '#005A9E', fontSize: 12 }}>
              {row.maChiTieu}
            </span>

            {/* Tên chỉ tiêu */}
            <span style={{ fontSize: 12, color: '#222' }}>{row.tenChiTieu}</span>

            {/* Giá trị đo */}
            <input
              value={row.giaTriDo}
              onChange={e => updateRow(i, 'giaTriDo', e.target.value)}
              placeholder="VD: 10^3 CFU/g"
              style={inputStyle}
            />

            {/* Giới hạn */}
            <input
              value={row.gioiHanChoPhep}
              onChange={e => updateRow(i, 'gioiHanChoPhep', e.target.value)}
              placeholder="VD: <= 10^4 CFU/g"
              style={inputStyle}
            />

            {/* Kết quả */}
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

            {/* Xóa */}
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

        {/* Add new row */}
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
            {/* Select chỉ tiêu */}
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

        {/* Summary row */}
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

// ─── Small helpers ───────────────────────────────────────────────────────────

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