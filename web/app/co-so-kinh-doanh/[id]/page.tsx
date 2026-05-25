'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  ArrowLeft, Building2, CalendarDays, FileClock,
  FileSpreadsheet, Printer, RefreshCw, User,
  CheckCircle2, AlertTriangle, Shield,
} from 'lucide-react';
import {
  PageHeader, SectionCard, StatusBadge, GovBtn, ActionButtons, MiniStat,
} from '@/components/GovUI';
import {
  coSoKinhDoanhApi,
  type CoSoKinhDoanhItem,
  type GiayChungNhanItem,
} from '@/api/api';

// ─── Fallback ─────────────────────────────────────────────────────
const FALLBACK_ITEM: CoSoKinhDoanhItem = {
  maCoSo: '—', tenCoSo: 'Không tìm thấy cơ sở', soGiayPhep: '—',
  ngayHetHanGiayPhep: '', trangThai: 'HOAT_DONG',
  maPX: '—', tenPhuongXa: '—', maChuSoHuu: '—', tenChuSoHuu: '—',
};

const TRANG_THAI_VARIANT: Record<string, string> = {
  HOAT_DONG: 'active',
  HET_HAN:   'expired',
  DINH_CHI:  'suspended',
  CHO_DUYET: 'pending',
};

function formatDate(iso?: string | null) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
}

// ─── Sub-components ───────────────────────────────────────────────
function InfoRow({ label, value, mono }: { label: React.ReactNode; value: React.ReactNode; mono?: boolean }) {
  return (
    <tr style={{ borderBottom: '1px solid #F0F0F0' }}>
      <td style={{ padding: '8px 12px', fontSize: 12, fontWeight: 600, color: '#555', width: 180, background: '#FAFAFA', whiteSpace: 'nowrap' }}>
        {label}
      </td>
      <td style={{ padding: '8px 12px', fontSize: 13, color: '#222', fontFamily: mono ? 'monospace' : 'inherit' }}>
        {value}
      </td>
    </tr>
  );
}

function ChungNhanCard({ cn }: { cn: GiayChungNhanItem }) {
  const expired = cn.ngayHetHan && new Date(cn.ngayHetHan) < new Date();
  return (
    <div style={{ border: '1px solid #D6D6D6', background: expired ? '#FFF8F8' : '#FAFAFA', padding: '10px 12px', borderLeft: `3px solid ${expired ? '#CC0000' : '#008000'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div>
          <p style={{ fontWeight: 700, fontSize: 13, color: '#222', margin: '0 0 4px' }}>{cn.tenChungNhan}</p>
          <p style={{ fontFamily: 'monospace', fontSize: 11.5, color: '#005A9E', margin: 0 }}>{cn.maCN}</p>
        </div>
        <StatusBadge variant={TRANG_THAI_VARIANT[cn.trangThai] ?? cn.trangThai} />
      </div>
      <div style={{ marginTop: 8, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 4, fontSize: 12, color: '#555' }}>
        <span>Ngày ban hành: <strong style={{ color: '#222' }}>{formatDate(cn.ngayBanHanh)}</strong></span>
        <span>Hết hạn: <strong style={{ color: expired ? '#CC0000' : '#222' }}>{formatDate(cn.ngayHetHan)}</strong></span>
      </div>
    </div>
  );
}

export default function CoSoKinhDoanhDetailPage() {
  const params   = useParams();
  const router   = useRouter();
  const id       = params?.id as string;

  const [coSo, setCoSo]         = useState<CoSoKinhDoanhItem | null>(null);
  const [chungNhan, setChungNhan] = useState<GiayChungNhanItem[]>([]);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState<string | null>(null);
  const [loadingCN, setLoadingCN] = useState(true);

  useEffect(() => {
    if (!id) return;

    // Load chi tiết cơ sở
    coSoKinhDoanhApi.getById(id)
      .then(data => setCoSo(data))
      .catch(() => {
        setCoSo({ ...FALLBACK_ITEM, maCoSo: id });
        setError('Không thể tải dữ liệu từ server — hiển thị thông tin mẫu');
      })
      .finally(() => setLoading(false));

    // Load chứng nhận song song
    coSoKinhDoanhApi.getGiayChungNhan(id)
      .then(setChungNhan)
      .catch(() => setChungNhan([]))
      .finally(() => setLoadingCN(false));
  }, [id]);

  const handleRefresh = () => {
    setLoading(true);
    setLoadingCN(true);
    setError(null);
    coSoKinhDoanhApi.getById(id)
      .then(setCoSo).catch(() => setError('Lỗi tải lại dữ liệu'))
      .finally(() => setLoading(false));
    coSoKinhDoanhApi.getGiayChungNhan(id)
      .then(setChungNhan).catch(() => {})
      .finally(() => setLoadingCN(false));
  };

  if (loading) {
    return (
      <div>
        <PageHeader title="Chi tiết cơ sở kinh doanh" subtitle="Đang tải dữ liệu..." />
        <div style={{ padding: 40, textAlign: 'center', color: '#888' }}>
          <RefreshCw style={{ width: 24, height: 24, display: 'inline-block', marginBottom: 8 }} />
          <p>Đang tải thông tin cơ sở...</p>
        </div>
      </div>
    );
  }

  if (!coSo) return null;

  const isExpired  = coSo.ngayHetHanGiayPhep && new Date(coSo.ngayHetHanGiayPhep) < new Date();
  const cnHieuLuc  = chungNhan.filter(c => c.trangThai === 'HOAT_DONG' || c.trangThai === 'HIU_LUC').length;
  const cnHetHan   = chungNhan.filter(c => c.trangThai === 'HET_HAN').length;

  return (
    <div>
      <PageHeader
        title={`Chi tiết cơ sở — ${coSo.tenCoSo}`}
        subtitle={`Mã cơ sở: ${coSo.maCoSo} | Phường/Xã: ${coSo.tenPhuongXa}`}
        actions={
          <ActionButtons>
            <GovBtn variant="secondary" onClick={handleRefresh}>
              <RefreshCw style={{ width: 12, height: 12 }} /> Làm mới
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer style={{ width: 12, height: 12 }} /> In hồ sơ
            </GovBtn>
            <GovBtn variant="secondary">
              <FileSpreadsheet style={{ width: 12, height: 12 }} /> Xuất Excel
            </GovBtn>
            <GovBtn variant="secondary" onClick={() => router.back()}>
              <ArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
            </GovBtn>
          </ActionButtons>
        }
      />

      {error && (
        <div style={{ background: '#FFF4E5', border: '1px solid #FFCC80', borderLeft: '4px solid #CC6600', borderRadius: 2, padding: '8px 12px', marginBottom: 10, fontSize: 12.5, color: '#7a3e00' }}>
          ⚠ {error}
        </div>
      )}

      {/* Hero banner */}
      <div style={{ background: 'linear-gradient(135deg, #F4FBF4 0%, #fff 100%)', border: '1px solid #CFE6CF', borderRadius: 2, padding: '16px 18px', marginBottom: 12 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8, flexWrap: 'wrap' }}>
              <span style={{ fontFamily: 'monospace', fontWeight: 700, fontSize: 12, color: '#005A9E', background: '#EAF3FB', border: '1px solid #C7DDF0', padding: '3px 8px' }}>
                {coSo.maCoSo}
              </span>
              <StatusBadge variant={TRANG_THAI_VARIANT[coSo.trangThai] ?? coSo.trangThai} />
              {isExpired && (
                <span style={{ fontSize: 11, color: '#CC0000', fontWeight: 600, background: '#FDECEA', border: '1px solid #F5BCBC', padding: '2px 7px', borderRadius: 2 }}>
                  ⚠ Giấy phép hết hạn
                </span>
              )}
            </div>
            <h2 style={{ margin: '0 0 4px', fontSize: 20, fontWeight: 800, color: '#1F2937' }}>
              {coSo.tenCoSo}
            </h2>
            <p style={{ margin: 0, fontSize: 13, color: '#555' }}>
              Chủ sở hữu: <strong>{coSo.tenChuSoHuu}</strong> &nbsp;·&nbsp; Phường/Xã: <strong>{coSo.tenPhuongXa}</strong>
            </p>
          </div>

          {/* Quick stats */}
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <div style={{ border: '1px solid #D6E8D6', background: '#fff', padding: '10px 14px', minWidth: 110, textAlign: 'center' }}>
              <Shield style={{ width: 16, height: 16, color: '#008000', display: 'block', margin: '0 auto 4px' }} />
              <p style={{ fontSize: 11, color: '#666', margin: '0 0 2px', textTransform: 'uppercase', fontWeight: 600 }}>Chứng nhận</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: '#006400', margin: 0 }}>{cnHieuLuc}</p>
            </div>
            <div style={{ border: '1px solid #D6D6D6', background: '#fff', padding: '10px 14px', minWidth: 110, textAlign: 'center' }}>
              <AlertTriangle style={{ width: 16, height: 16, color: '#CC6600', display: 'block', margin: '0 auto 4px' }} />
              <p style={{ fontSize: 11, color: '#666', margin: '0 0 2px', textTransform: 'uppercase', fontWeight: 600 }}>CN hết hạn</p>
              <p style={{ fontSize: 20, fontWeight: 800, color: cnHetHan > 0 ? '#CC0000' : '#222', margin: 0 }}>{cnHetHan}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid 2 cột */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 12 }}>

        {/* Thông tin cơ sở */}
        <SectionCard title="Thông tin cơ sở kinh doanh">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <InfoRow label={<><Building2 style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />Mã cơ sở</>} value={coSo.maCoSo} mono />
              <InfoRow label="Tên cơ sở" value={<strong>{coSo.tenCoSo}</strong>} />
              <InfoRow label="Phường/Xã" value={coSo.tenPhuongXa || '—'} />
              <InfoRow label="Mã phường/xã" value={coSo.maPX || '—'} mono />
              <InfoRow label="Trạng thái" value={<StatusBadge variant={TRANG_THAI_VARIANT[coSo.trangThai] ?? coSo.trangThai} />} />
            </tbody>
          </table>
        </SectionCard>

        {/* Pháp lý */}
        <SectionCard title="Tình trạng pháp lý & giấy phép">
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <tbody>
              <InfoRow label={<><FileClock style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />Số giấy phép</>} value={coSo.soGiayPhep || '—'} mono />
              <InfoRow
                label={<><CalendarDays style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />Ngày hết hạn</>}
                value={
                  <span style={{ fontFamily: 'monospace', color: isExpired ? '#CC0000' : '#222', fontWeight: isExpired ? 700 : 400 }}>
                    {formatDate(coSo.ngayHetHanGiayPhep)}
                    {isExpired && ' (Đã hết hạn)'}
                  </span>
                }
              />
              <InfoRow
                label={<><User style={{ width: 12, height: 12, display: 'inline', marginRight: 4 }} />Chủ sở hữu</>}
                value={coSo.tenChuSoHuu || '—'}
              />
              <InfoRow label="Mã chủ sở hữu" value={coSo.maChuSoHuu || '—'} mono />
            </tbody>
          </table>
        </SectionCard>
      </div>

      {/* Giấy chứng nhận */}
      <SectionCard
        title={`Giấy chứng nhận ATTP (${chungNhan.length})`}
        actions={
          <Link href={`/co-so-kinh-doanh/chung-nhan`}>
            <GovBtn variant="outline" size="sm">Xem tất cả chứng nhận</GovBtn>
          </Link>
        }
      >
        <div style={{ padding: 12 }}>
          {loadingCN ? (
            <div style={{ padding: 20, textAlign: 'center', color: '#888', fontSize: 13 }}>
              Đang tải danh sách chứng nhận...
            </div>
          ) : chungNhan.length === 0 ? (
            <div style={{ padding: 20, border: '1px dashed #CFCFCF', background: '#FAFAFA', color: '#888', fontSize: 13, textAlign: 'center' }}>
              <CheckCircle2 style={{ width: 20, height: 20, display: 'block', margin: '0 auto 8px', color: '#CCC' }} />
              Cơ sở này chưa có giấy chứng nhận nào được ghi nhận.
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: chungNhan.length > 1 ? '1fr 1fr' : '1fr', gap: 10 }}>
              {chungNhan.map(cn => <ChungNhanCard key={cn.maCN} cn={cn} />)}
            </div>
          )}
        </div>
      </SectionCard>

      <p style={{ fontSize: 11.5, color: '#888', textAlign: 'center', marginTop: 8 }}>
        Hồ sơ cơ sở kinh doanh — Chi cục An toàn Thực phẩm TP. Đà Nẵng | Mã: {coSo.maCoSo}
      </p>
    </div>
  );
}
