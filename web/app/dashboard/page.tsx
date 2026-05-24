'use client';

import Link from 'next/link';
import {
  Building2, CheckCircle2, AlertTriangle, FileClock,
  ClipboardList, FileWarning, Download, RefreshCw,
  Printer, FileSpreadsheet,
} from 'lucide-react';
import { useRole } from '@/lib/RoleContext';
import StatCard from '@/components/StatCard';
import TableCard, { Pagination } from '@/components/TableCard';
import DistrictStats from '@/components/dashboard/DistrictStats';
import ViolationChart from '@/components/dashboard/ViolationChart';
import PendingRecords from '@/components/dashboard/PendingRecords';
import ExpiryAlerts from '@/components/dashboard/ExpiryAlerts';

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
  return (
    <>
      <AlertBox type="warn">
        <strong>⚠ Cảnh báo:</strong> Có <strong>3 giấy phép ATTP sắp hết hạn</strong> trong 30 ngày tới và <strong>2 vụ vi phạm nghiêm trọng</strong> đang chờ xử lý. Vui lòng kiểm tra và xử lý kịp thời.
      </AlertBox>

      {/* Stat widgets */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6,1fr)', gap: '10px', marginBottom: '14px' }}>
        <StatCard label="Tổng cơ sở ATTP" value="1.842" color="green" icon={Building2} progress={100} trend="+23 tháng này" trendUp />
        <StatCard label="Cơ sở đạt chuẩn" value="1.560" color="green" icon={CheckCircle2} progress={84.7} trend="84,7% tỷ lệ" trendUp />
        <StatCard label="Cơ sở vi phạm" value="47" color="red" icon={AlertTriangle} progress={2.5} trend="+5 tuần này" />
        <StatCard label="Hồ sơ chờ duyệt" value="128" color="orange" icon={FileClock} progress={7} trend="42 ưu tiên cao" />
        <StatCard label="Kiểm tra tháng" value="312" color="blue" icon={ClipboardList} progress={78} trend="+18% vs T3" trendUp />
        <StatCard label="Tỷ lệ đạt chuẩn" value="84,7%" color="green" icon={CheckCircle2} progress={84.7} trend="+1,2% so T3" trendUp />
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
        footer={<Pagination info="Hiển thị 4 / 47 bản ghi" />}
      >
        <table className="gov-table">
          <thead>
            <tr>{['STT', 'Cơ sở', 'Loại vi phạm', 'Mức độ', 'Trạng thái', 'Thao tác'].map(h => <TH key={h}>{h}</TH>)}</tr>
          </thead>
          <tbody>
            {[
              { biz: 'Phở Ba Miền', type: 'Vi phạm vệ sinh', sev: 'high', status: 'open' },
              { biz: 'Bánh Mì Hội An', type: 'Giấy phép hết hạn', sev: 'medium', status: 'in-progress' },
              { biz: 'Hải Sản Đà Nẵng', type: 'Lỗi dây chuyền lạnh', sev: 'high', status: 'open' },
              { biz: 'Chợ Tươi Đà Nẵng', type: 'Thiếu nhãn mác', sev: 'low', status: 'resolved' },
            ].map((r, i) => (
              <tr key={i}>
                <TD>{i + 1}</TD>
                <TD><span style={{ fontWeight: 500 }}>{r.biz}</span></TD>
                <TD>{r.type}</TD>
                <TD><GovBadge variant={r.sev} /></TD>
                <TD><GovBadge variant={r.status} /></TD>
                <TD>
                  <div style={{ display: 'flex', gap: '4px' }}>
                    <button className="gov-btn gov-btn-secondary" style={{ height: '22px', fontSize: '11px', padding: '0 6px' }}>Xem</button>
                    <button className="gov-btn gov-btn-primary" style={{ height: '22px', fontSize: '11px', padding: '0 6px' }}>Xử lý</button>
                  </div>
                </TD>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}

function InspectorDashboard() {
  return (
    <>
      <AlertBox type="info">
        <strong>ℹ Lịch thanh tra:</strong> Bạn có <strong>3 cuộc thanh tra định kỳ</strong> trong tuần tới.{' '}
        <Link href="/thanh-tra-kiem-dinh/nhiem-vu" style={{ color: '#005A9E', fontWeight: 600, textDecoration: 'underline' }}>Xem nhiệm vụ</Link>
      </AlertBox>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: '10px', marginBottom: '14px' }}>
        <StatCard label="Thanh tra tháng này" value="24" color="blue" trend="+3 so với T3" trendUp />
        <StatCard label="Đã hoàn thành" value="19" color="green" progress={79} trend="79,2% tỷ lệ" trendUp />
        <StatCard label="Đang lên lịch" value="5" color="orange" trend="2 quá hạn" />
        <StatCard label="Vi phạm phát hiện" value="8" color="red" trend="+2 tháng này" />
      </div>
      <TableCard title="Nhiệm vụ thanh tra được phân công" actions={
        <Link href="/thanh-tra-kiem-dinh/nhiem-vu" className="gov-btn gov-btn-primary" style={{ fontSize: '12px', height: '26px' }}>Xem tất cả nhiệm vụ</Link>
      }>
        <table className="gov-table">
          <thead><tr>{['Mã nhiệm vụ', 'Cơ sở', 'Loại thanh tra', 'Ngày dự kiến', 'Trạng thái', 'Thao tác'].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {[
              { id: 'NV-001', biz: 'Nhà hàng Phở Ba Miền', type: 'Định kỳ', date: '20/05/2026', status: 'open' },
              { id: 'NV-002', biz: 'Chợ Tươi Đà Nẵng', type: 'Đột xuất', date: '22/05/2026', status: 'in-progress' },
              { id: 'NV-003', biz: 'Cà Phê Thu Hiền', type: 'Định kỳ', date: '25/05/2026', status: 'open' },
            ].map((r, i) => (
              <tr key={i}>
                <TD><span style={{ color: '#005A9E', fontWeight: 500 }}>{r.id}</span></TD>
                <TD>{r.biz}</TD>
                <TD>{r.type}</TD>
                <TD mono>{r.date}</TD>
                <TD><GovBadge variant={r.status} /></TD>
                <TD><button className="gov-btn gov-btn-primary" style={{ height: '22px', fontSize: '11px', padding: '0 8px' }}>Thực hiện</button></TD>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}

function TesterDashboard() {
  return (
    <>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '10px', marginBottom: '14px' }}>
        <StatCard label="Yêu cầu chờ xử lý" value="12" color="orange" trend="4 mới hôm nay" />
        <StatCard label="Đã hoàn thành" value="38" color="green" trend="+15% tháng này" trendUp />
        <StatCard label="Mẫu không đạt" value="3" color="red" trend="2 chờ báo cáo" />
      </div>
      <TableCard title="Yêu cầu kiểm nghiệm chờ xử lý" actions={
        <Link href="/thanh-tra-kiem-dinh/yeu-cau" className="gov-btn gov-btn-primary" style={{ fontSize: '12px', height: '26px' }}>Xem tất cả</Link>
      }>
        <table className="gov-table">
          <thead><tr>{['Mã yêu cầu', 'Cơ sở', 'Loại mẫu', 'Ngày nhận', 'Trạng thái', 'Thao tác'].map(h => <TH key={h}>{h}</TH>)}</tr></thead>
          <tbody>
            {[
              { id: 'YC-2026-045', biz: 'Hải Sản Đà Nẵng', type: 'Mẫu vi sinh', date: '14/05/2026', status: 'open' },
              { id: 'YC-2026-044', biz: 'Bánh Mì Hội An', type: 'Dầu chiên', date: '13/05/2026', status: 'in-progress' },
              { id: 'YC-2026-043', biz: 'Chợ Tươi ĐN', type: 'Rau củ', date: '12/05/2026', status: 'resolved' },
            ].map((r, i) => (
              <tr key={i}>
                <TD><span style={{ color: '#005A9E', fontWeight: 500 }}>{r.id}</span></TD>
                <TD>{r.biz}</TD>
                <TD>{r.type}</TD>
                <TD mono>{r.date}</TD>
                <TD><GovBadge variant={r.status} /></TD>
                <TD><button className="gov-btn gov-btn-primary" style={{ height: '22px', fontSize: '11px', padding: '0 8px' }}>Nhập kết quả</button></TD>
              </tr>
            ))}
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
            <button className="gov-btn gov-btn-primary" style={{ height: '28px', fontSize: '12px' }}>
              <FileSpreadsheet style={{ width: '13px', height: '13px' }} />
              Xuất Excel
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
