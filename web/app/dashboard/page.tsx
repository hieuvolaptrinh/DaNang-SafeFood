'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Building2, CheckCircle2, AlertTriangle, FileClock,
  ClipboardList, RefreshCw,
  Printer, FileSpreadsheet,
} from 'lucide-react';
import { useRole } from '@/lib/RoleContext';
import StatCard from '@/components/StatCard';
import TableCard, { Pagination } from '@/components/TableCard';
import DistrictStats from '@/components/dashboard/DistrictStats';
import ViolationChart from '@/components/dashboard/ViolationChart';
import PendingRecords from '@/components/dashboard/PendingRecords';
import ExpiryAlerts from '@/components/dashboard/ExpiryAlerts';
import { thongKeApi, DashboardSummary } from '@/api/api';
import { ketQuaKiemNghiemApi } from '@/api/ketquakiemnghiem';
import { mauKiemNghiemApi } from '@/api/maukiemnghiem';
import { nhiemVuApi, type NhiemVuDashboardResponse } from '@/api/nhiemvu';
import { getAccessToken } from '@/utils/storage';

const GovBadge = ({ variant }: { variant: string }) => {
  const map: Record<string, { label: string; style: React.CSSProperties }> = {
    high: { label: 'Nghiêm trọng', style: { background: '#FDECEA', color: '#CC0000', border: '1px solid #F5BCBC' } },
    medium: { label: 'Trung bình', style: { background: '#FFF4E5', color: '#CC6600', border: '1px solid #FFCC80' } },
    low: { label: 'Nhẹ', style: { background: '#F0F0F0', color: '#555', border: '1px solid #CCC' } },
    open: { label: 'Đang mở', style: { background: '#FDECEA', color: '#CC0000', border: '1px solid #F5BCBC' } },
    'in-progress': { label: 'Đang xử lý', style: { background: '#FFF4E5', color: '#CC6600', border: '1px solid #FFCC80' } },
    resolved: { label: 'Đã xử lý', style: { background: '#E6F4E6', color: '#006400', border: '1px solid #94C994' } },
    INFO: { label: 'INFO', style: { background: '#E3EFFA', color: '#005A9E', border: '1px solid #9FC3E0' } },
    WARN: { label: 'CẢNH BÁO', style: { background: '#FFF4E5', color: '#CC6600', border: '1px solid #FFCC80' } },
    ERROR: { label: 'LỖI', style: { background: '#FDECEA', color: '#CC0000', border: '1px solid #F5BCBC' } },
  };
  const cfg = map[variant] ?? { label: variant, style: { background: '#F0F0F0', color: '#555', border: '1px solid #CCC' } };
  return (
    <span style={{ ...cfg.style, padding: '1px 7px', borderRadius: '2px', fontSize: '11px', fontWeight: 500, display: 'inline-block', whiteSpace: 'nowrap' }}>
      {cfg.label}
    </span>
  );
};

const TH = ({ children }: { children: React.ReactNode }) => (
  <th style={{ background: '#E8E8E8', border: '1px solid #D6D6D6', padding: '5px 10px', fontSize: '12px', fontWeight: 600, color: '#333', whiteSpace: 'nowrap', textAlign: 'left' }}>
    {children}
  </th>
);
const TD = ({ children, mono }: { children: React.ReactNode; mono?: boolean }) => (
  <td style={{ border: '1px solid #D6D6D6', padding: '4px 10px', fontSize: '12.5px', color: '#222', fontFamily: mono ? 'monospace' : undefined }}>
    {children}
  </td>
);

function SectionTitle({ label }: { label: string }) {
  return (
    <div style={{ borderLeft: '4px solid #008000', paddingLeft: '8px', marginBottom: '10px' }}>
      <h2 style={{ fontSize: '14px', fontWeight: 700, color: '#006400', textTransform: 'uppercase', letterSpacing: '0.04em', margin: 0 }}>{label}</h2>
    </div>
  );
}

function AlertBox({ type, children }: { type: 'info' | 'warn' | 'danger'; children: React.ReactNode }) {
  const styles = {
    info: { bg: '#E3EFFA', border: '#005A9E', text: '#003d73', leftBar: '#005A9E' },
    warn: { bg: '#FFF4E5', border: '#CC6600', text: '#7a3e00', leftBar: '#CC6600' },
    danger: { bg: '#FDECEA', border: '#CC0000', text: '#7a0000', leftBar: '#CC0000' },
  }[type];
  return (
    <div style={{ background: styles.bg, border: `1px solid ${styles.border}`, borderLeft: `4px solid ${styles.leftBar}`, borderRadius: '2px', padding: '8px 12px', marginBottom: '10px', fontSize: '12.5px', color: styles.text }}>
      {children}
    </div>
  );
}

// ─── Role Dashboards ──────────────────────────────────────────────────────────

function AdminDashboard() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '14px' }}>
        {[
          { label: 'CPU', value: '34%', pct: 34, note: '8 lõi / Intel Xeon', color: 'green' as const },
          { label: 'Bộ nhớ RAM', value: '72%', pct: 72, note: '28.8 / 40 GB đang dùng', color: 'orange' as const },
          { label: 'Ổ cứng', value: '18%', pct: 18, note: '340 / 2.000 GB đã dùng', color: 'neutral' as const },
        ].map((m) => (
          <div key={m.label} className="bg-white" style={{ border: '1px solid #D6D6D6', borderTop: `3px solid ${m.color === 'green' ? '#008000' : m.color === 'orange' ? '#CC6600' : '#888'}`, borderRadius: '1px', padding: '10px 14px' }}>
            <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#555', marginBottom: '4px' }}>{m.label}</p>
            <p style={{ fontSize: '26px', fontWeight: 700, color: '#222', margin: '0 0 6px 0' }}>{m.value}</p>
            <div style={{ height: '4px', background: '#E8E8E8', borderRadius: '2px', overflow: 'hidden', marginBottom: '4px' }}>
              <div style={{ width: `${m.pct}%`, height: '100%', background: m.color === 'green' ? '#008000' : m.color === 'orange' ? '#CC6600' : '#888' }} />
            </div>
            <p style={{ fontSize: '11px', color: '#777' }}>{m.note}</p>
          </div>
        ))}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '14px' }}>
        <StatCard label="Người dùng hoạt động" value="148" color="green" trend="+12 tuần này" trendUp />
        <StatCard label="Yêu cầu API" value="24.8K" color="blue" trend="+5.3% hôm nay" trendUp />
        <StatCard label="Tỷ lệ lỗi" value="0.4%" color="orange" trend="-0.1% vs tuần trước" />
        <StatCard label="Uptime hệ thống" value="99.9%" color="neutral" trend="Online từ 01/01" trendUp />
      </div>
      <TableCard title="Nhật ký hệ thống gần đây" actions={
        <Link href="/cai-dat/nhat-ky" className="gov-btn gov-btn-outline" style={{ fontSize: '12px', height: '26px' }}>Xem tất cả</Link>
      }>
        <table className="gov-table">
          <thead><tr>{['Thời gian', 'Mức độ', 'Dịch vụ', 'Nội dung'].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {[
              { ts: '15/05/2026 14:32', level: 'INFO', svc: 'Auth', msg: 'Đăng nhập: inspector_tran@fsms.vn' },
              { ts: '15/05/2026 14:28', level: 'INFO', svc: 'API', msg: 'Tạo hồ sơ thanh tra #INS-2847' },
              { ts: '15/05/2026 14:15', level: 'WARN', svc: 'DB', msg: 'Truy vấn chậm: inspection_records' },
              { ts: '15/05/2026 13:55', level: 'INFO', svc: 'Scheduler', msg: 'Sao lưu hàng ngày hoàn thành' },
              { ts: '15/05/2026 13:40', level: 'ERROR', svc: 'Email', msg: 'Gửi email thất bại — SMTP timeout' },
            ].map((r, i) => (
              <tr key={i}>
                <TD mono>{r.ts}</TD>
                <TD><GovBadge variant={r.level} /></TD>
                <TD>{r.svc}</TD>
                <TD>{r.msg}</TD>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}

function AuthorityDashboard() {
  const [summary, setSummary] = useState<DashboardSummary | null>(null);

  useEffect(() => {
    thongKeApi.getDashboard()
      .then(setSummary)
      .catch(() => {/* giữ null → hiển thị fallback */});
  }, []);

  // Giá trị fallback khi API chưa trả về
  const total       = summary?.tongCoSoKinhDoanh ?? 1842;
  const hoatDong    = summary?.coSoHoatDong      ?? 1560;
  const phanAnh     = summary?.phanAnhChuaXuLy   ?? 128;
  const thanhTra    = summary?.thanhTraDangXuLy   ?? 47;
  const chungNhan   = summary?.chungNhanHieuLuc   ?? 312;
  const tyLe        = total > 0 ? Math.round((hoatDong / total) * 1000) / 10 : 84.7;

  return (
    <>
      {phanAnh > 0 && (
        <AlertBox type="warn">
          <strong>⚠ Cảnh báo:</strong> Có{' '}
          <strong>{phanAnh} phản ánh công dân chưa xử lý</strong>{' '}
          và <strong>{thanhTra} cuộc thanh tra đang xử lý</strong>. Vui lòng kiểm tra và xử lý kịp thời.
        </AlertBox>
      )}

      {/* Stat widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '14px' }}>
        <StatCard label="Tổng cơ sở ATTP"  value={total.toLocaleString('vi-VN')}        color="green"   icon={Building2}     progress={100}  trend="Cơ sở đăng ký"   trendUp />
        <StatCard label="Cơ sở hoạt động"  value={hoatDong.toLocaleString('vi-VN')}   color="green"   icon={CheckCircle2}  progress={tyLe} trend={`${tyLe}% tỷ lệ`}  trendUp />
        <StatCard label="Thanh tra đang xử lý" value={thanhTra}                              color="orange"  icon={AlertTriangle}  progress={0}    trend="Hoạt động" />
        <StatCard label="Phản ánh chưa xử lý"  value={phanAnh}                               color="red"     icon={FileClock}      progress={0}    trend="Cần xử lý ngay" />
        <StatCard label="Chứng nhận hiệu lực" value={chungNhan}                              color="blue"    icon={ClipboardList}  progress={0}    trend="Đang hiệu lực" trendUp />
        <StatCard label="Tỷ lệ đạt chuẩn"    value={`${tyLe}%`}                             color="green"   icon={CheckCircle2}  progress={tyLe} trend="Theo kỳ báo cáo" trendUp />
      </div>

      {/* Charts row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '10px' }}>
        <TableCard title="Thống kê theo quận/huyện">
          <DistrictStats />
        </TableCard>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '10px' }}>
        <TableCard title="Số vụ vi phạm theo tháng">
          <ViolationChart />
        </TableCard>
        <TableCard title="Giấy phép sắp hết hạn">
          <ExpiryAlerts />
        </TableCard>
      </div>

      <TableCard
        title="Vi phạm gần đây"
        actions={<Link href="/vi-pham" className="gov-btn gov-btn-outline" style={{ fontSize: '12px', height: '26px' }}>Xem tất cả</Link>}
      >
        <PendingRecords />
      </TableCard>
    </>
  );
}

function InspectorDashboard() {
  const [data, setData] = useState<NhiemVuDashboardResponse | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    nhiemVuApi.getDashboard(5)
      .then((res) => {
        if (mounted) setData(res);
      })
      .catch(() => {
        if (mounted) setData(null);
      })
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => { mounted = false; };
  }, []);

  const lichTuanToi = data?.lichTuanToi ?? 0;
  const thanhTraThangNay = data?.thanhTraThangNay ?? 0;
  const daHoanThanh = data?.daHoanThanhThangNay ?? 0;
  const dangLenLich = data?.dangLenLichThangNay ?? 0;
  const quaHan = data?.quaHanThangNay ?? 0;
  const viPham = data?.viPhamPhatHienThangNay ?? 0;
  const tyLeHoanThanh = thanhTraThangNay > 0 ? Math.round((daHoanThanh / thanhTraThangNay) * 1000) / 10 : 0;
  const list = data?.nhiemVuGanNhat ?? [];

  const formatDate = (value?: string) => {
    if (!value) return '—';
    const d = new Date(value);
    if (Number.isNaN(d.getTime())) return value;
    return new Intl.DateTimeFormat('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(d);
  };

  const mapTrangThaiToBadge = (trangThai?: string) => {
    const t = (trangThai || '').toLowerCase();
    if (t.includes('hoàn thành') || t.includes('hoan thanh')) return 'resolved';
    if (t.includes('đã nhận') || t.includes('da nhan') || t.includes('đang thực hiện') || t.includes('dang thuc hien')) return 'in-progress';
    return 'open';
  };

  return (
    <>
      <AlertBox type="info">
        <strong>ℹ Lịch thanh tra:</strong> Bạn có{' '}
        <strong>{loading ? '…' : lichTuanToi} cuộc thanh tra</strong> trong tuần tới.{' '}
        <Link href="/thanh-tra-kiem-dinh/nhiem-vu" style={{ color: '#005A9E', fontWeight: 600, textDecoration: 'underline' }}>Xem nhiệm vụ</Link>
      </AlertBox>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '14px' }}>
        <StatCard label="Thanh tra tháng này" value={loading ? '…' : thanhTraThangNay} color="blue" trend="Trong tháng hiện tại" />
        <StatCard label="Đã hoàn thành" value={loading ? '…' : daHoanThanh} color="green" trend={`${tyLeHoanThanh}% tỷ lệ`} />
        <StatCard label="Đang lên lịch" value={loading ? '…' : dangLenLich} color="orange" trend={`${quaHan} quá hạn`} />
        <StatCard label="Vi phạm phát hiện" value={loading ? '…' : viPham} color="red" trend="Tháng này" />
      </div>
      <TableCard title="Nhiệm vụ thanh tra được phân công" actions={
        <Link href="/thanh-tra-kiem-dinh/nhiem-vu" className="gov-btn gov-btn-primary" style={{ fontSize: '12px', height: '26px' }}>Xem tất cả nhiệm vụ</Link>
      }>
        <table className="gov-table">
          <thead><tr>{['Mã nhiệm vụ', 'Cơ sở', 'Loại thanh tra', 'Ngày dự kiến', 'Trạng thái', 'Thao tác'].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Đang tải...</td>
              </tr>
            ) : list.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Không có nhiệm vụ nào trong tháng.</td>
              </tr>
            ) : (
              list.map((r, i) => (
                <tr key={i}>
                  <TD><span style={{ color: '#005A9E', fontWeight: 500 }}>{r.maThanhTra}</span></TD>
                  <TD>{r.tenCoSo}</TD>
                  <TD>{r.loaiThanhTra}</TD>
                  <TD mono>{formatDate(r.thoiGianTT)}</TD>
                  <TD><GovBadge variant={mapTrangThaiToBadge(r.trangThai)} /></TD>
                  <TD>
                    <Link href="/thanh-tra-kiem-dinh/nhiem-vu">
                      <button className="gov-btn gov-btn-primary" style={{ height: '22px', fontSize: '11px', padding: '0 8px' }}>Thực hiện</button>
                    </Link>
                  </TD>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}

function TesterDashboard() {
  const [stats, setStats] = useState<any>(null);
  const [pendingSamples, setPendingSamples] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      try {
        const [statsData, samplesRes] = await Promise.all([
          ketQuaKiemNghiemApi.getStats().catch(() => null),
          mauKiemNghiemApi.getList({ page: 0, size: 5 }).catch(() => ({ content: [] }))
        ]);
        if (statsData) {
          setStats(statsData);
        }
        if (samplesRes && samplesRes.content) {
          // Filter to show received/testing samples first
          const pending = samplesRes.content.filter(s => 
            s.trangThai === 'Chưa kiểm nghiệm' || 
            s.trangThai === 'Đang kiểm nghiệm' ||
            s.trangThai === 'testing' ||
            s.trangThai === 'received'
          );
          setPendingSamples(pending.length > 0 ? pending : samplesRes.content.slice(0, 3));
        }
      } catch (e) {
        console.error('Error loading Tester Dashboard:', e);
      } finally {
        setLoading(false);
      }
    };
    loadDashboardData();
  }, []);

  const choXuLy = stats?.choKetQua ?? 12;
  const daHoanThanh = stats ? (stats.datChuan + stats.khongDat) : 38;
  const khongDat = stats?.khongDat ?? 3;

  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '14px' }}>
        <StatCard label="Yêu cầu chờ xử lý" value={choXuLy} color="orange" trend="Cần thực hiện kiểm nghiệm" />
        <StatCard label="Đã hoàn thành" value={daHoanThanh} color="green" trend="Mẫu đã có kết quả" trendUp />
        <StatCard label="Mẫu không đạt" value={khongDat} color="red" trend="Yêu cầu lập biên bản vi phạm" />
      </div>
      <TableCard title="Danh sách mẫu kiểm nghiệm gần đây" actions={
        <Link href="/kiem-nghiem/mau" className="gov-btn gov-btn-primary" style={{ fontSize: '12px', height: '26px' }}>Xem tất cả mẫu</Link>
      }>
        <table className="gov-table">
          <thead><tr>{['Mã mẫu', 'Tên mẫu', 'Loại mẫu', 'Hạn hoàn thành', 'Trạng thái', 'Thao tác'].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Đang tải danh sách mẫu...</td>
              </tr>
            ) : pendingSamples.length === 0 ? (
              <tr>
                <td colSpan={6} style={{ textAlign: 'center', padding: '20px', color: '#888' }}>Không có mẫu nào cần xử lý.</td>
              </tr>
            ) : (
              pendingSamples.map((r, i) => (
                <tr key={i}>
                  <TD><span style={{ color: '#005A9E', fontWeight: 500, fontFamily: 'monospace' }}>{r.maMau}</span></TD>
                  <TD>{r.tenMau}</TD>
                  <TD>{r.loaiMau}</TD>
                  <TD mono>{r.hanHoanThanh || '—'}</TD>
                  <TD>
                    <GovBadge variant={
                      r.trangThai === 'Hoàn thành' || r.trangThai === 'completed'
                        ? 'resolved'
                        : r.trangThai === 'Đang kiểm nghiệm' || r.trangThai === 'testing'
                          ? 'in-progress'
                          : 'open'
                    } />
                  </TD>
                  <TD>
                    <Link href={`/kiem-nghiem/mau/${r.maMau}`}>
                      <button className="gov-btn gov-btn-primary" style={{ height: '22px', fontSize: '11px', padding: '0 8px' }}>
                        Cập nhật
                      </button>
                    </Link>
                  </TD>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}

function BusinessDashboard() {
  return (
    <>
      <AlertBox type="warn">
        <strong>⚠ Lưu ý:</strong> Giấy phép ATTP của cơ sở sẽ <strong>hết hạn vào 30/06/2026</strong> (còn 46 ngày). Vui lòng làm thủ tục gia hạn tại Chi cục ATTP hoặc liên hệ{' '}
        <a href="tel:02363819879" style={{ color: '#CC6600', fontWeight: 600 }}>(0236) 3.819.879</a>.
      </AlertBox>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '14px' }}>
        <StatCard label="Điểm thanh tra gần nhất" value="88/100" color="green" progress={88} trend="Đạt chuẩn ATTP" trendUp />
        <StatCard label="Hết hạn giấy phép" value="30/06/2026" color="orange" trend="Còn 46 ngày" />
        <StatCard label="Vi phạm đang mở" value="1" color="red" trend="Cần xử lý ngay" />
      </div>
      <TableCard title="Lịch sử thanh tra cơ sở">
        <table className="gov-table">
          <thead><tr>{['Mã thanh tra', 'Loại', 'Thanh tra viên', 'Ngày', 'Điểm', 'Kết quả'].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {[
              { id: 'INS-2847', type: 'Định kỳ', inspector: 'Nguyễn Văn Trần', date: '10/01/2025', score: 88, result: 'pass' },
              { id: 'INS-2801', type: 'Định kỳ', inspector: 'Lê Thị Mai', date: '10/07/2024', score: 82, result: 'pass' },
              { id: 'INS-2756', type: 'Đột xuất', inspector: 'Phạm Văn Đức', date: '15/01/2024', score: 65, result: 'in-progress' },
            ].map((r, i) => (
              <tr key={i}>
                <TD><span style={{ color: '#005A9E', fontWeight: 500 }}>{r.id}</span></TD>
                <TD>{r.type}</TD>
                <TD>{r.inspector}</TD>
                <TD mono>{r.date}</TD>
                <TD><strong style={{ color: r.score >= 80 ? '#006400' : r.score >= 60 ? '#CC6600' : '#CC0000' }}>{r.score}</strong></TD>
                <TD><GovBadge variant={r.result === 'pass' ? 'resolved' : 'in-progress'} /></TD>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const { role } = useRole();
  const [exporting, setExporting] = useState(false);

  const handleExportExcel = async () => {
    if (exporting) return;
    setExporting(true);
    try {
      const token = getAccessToken();
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api";
      const response = await fetch(`${apiUrl}/v1/thongke/export-excel`, {
        method: 'GET',
        headers: {
          'Authorization': token ? `Bearer ${token}` : '',
        },
      });
      if (!response.ok) {
        throw new Error('Không thể tải file excel từ server');
      }
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      // Get filename from content-disposition if possible
      const contentDisposition = response.headers.get('content-disposition');
      let filename = 'BaoCaoTongHop_ATVSTP.xlsx';
      if (contentDisposition) {
        const matches = /filename="([^"]+)"/.exec(contentDisposition);
        if (matches && matches[1]) {
          filename = matches[1];
        }
      }
      link.setAttribute('download', filename);
      document.body.appendChild(link);
      link.click();
      link.parentNode?.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (err: any) {
      console.error('Error exporting excel:', err);
      alert(err.message || 'Có lỗi xảy ra khi xuất file Excel');
    } finally {
      setExporting(false);
    }
  };

  const pageTitle: Record<string, string> = {
    ADMIN:     'Bảng điều hành hệ thống',
    LD_ATVSTP: 'Tổng quan quản lý an toàn thực phẩm',
    INSPECTOR: 'Bảng điều hành cán bộ thanh tra',
    TESTER:    'Bảng điều hành cán bộ kiểm định',
  };

  const pageSubtitle: Record<string, string> = {
    ADMIN:     'Giám sát hạ tầng và vận hành hệ thống thông tin',
    LD_ATVSTP: 'Chi cục An toàn Thực phẩm TP. Đà Nẵng — Cập nhật 15/05/2026',
    INSPECTOR: 'Lịch và hồ sơ thanh tra được phân công đến tôi',
    TESTER:    'Yêu cầu và kết quả kiểm định mẫu thực phẩm',
  };

  return (
    <div>
      {/* Page heading */}
      <div
        className="bg-white mb-4"
        style={{
          border: '1px solid #D6D6D6',
          borderLeft: '4px solid #008000',
          borderRadius: '1px',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <div>
          <h1
            style={{
              fontSize: '16px',
              fontWeight: 700,
              color: '#006400',
              textTransform: 'uppercase',
              letterSpacing: '0.04em',
              margin: 0,
            }}
          >
            {pageTitle[role]}
          </h1>
          <p style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
            {pageSubtitle[role]}
          </p>
        </div>
        {role === 'LD_ATVSTP' && (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button className="gov-btn gov-btn-secondary" style={{ height: '28px', fontSize: '12px' }}>
              <RefreshCw style={{ width: '13px', height: '13px' }} />
              Làm mới
            </button>
            <button className="gov-btn gov-btn-secondary" style={{ height: '28px', fontSize: '12px' }}>
              <Printer style={{ width: '13px', height: '13px' }} />
              In báo cáo
            </button>
            <button 
              className="gov-btn gov-btn-primary" 
              style={{ height: '28px', fontSize: '12px' }}
              onClick={handleExportExcel}
              disabled={exporting}
            >
              <FileSpreadsheet style={{ width: '13px', height: '13px' }} />
              {exporting ? 'Đang xuất...' : 'Xuất Excel'}
            </button>
          </div>
        )}
      </div>

      {role === 'ADMIN' && <AdminDashboard />}
      {role === 'LD_ATVSTP' && <AuthorityDashboard />}
      {role === 'INSPECTOR' && <InspectorDashboard />}
      {role === 'TESTER' && <TesterDashboard />}
    </div>
  );
}
