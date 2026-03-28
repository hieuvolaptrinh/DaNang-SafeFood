'use client';

import { useRole } from '@/lib/RoleContext';
import StatCard from '@/components/StatCard';
import TableCard from '@/components/TableCard';
import Badge from '@/components/Badge';

// ── Admin Dashboard ──
function AdminDashboard() {
  return (
    <>
      {/* Server metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label: 'CPU Load', value: '34%', color: 'bg-emerald-500', pct: 34, note: '8 lõi / Intel Xeon E5' },
          { label: 'Bộ nhớ', value: '72%', color: 'bg-amber-500', pct: 72, note: '28.8 GB / 40 GB đang dùng' },
          { label: 'Disk I/O', value: '18%', color: 'bg-blue-500', pct: 18, note: '2 TB SSD — 340 GB đã dùng' },
        ].map((m) => (
          <div key={m.label} className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
            <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">{m.label}</p>
            <p className="text-3xl font-extrabold text-slate-800 font-display mb-2">{m.value}</p>
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${m.color}`} style={{ width: `${m.pct}%` }} />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5">{m.note}</p>
          </div>
        ))}
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Người dùng hoạt động" value="148" color="green" trend="▲ 12%" trendUp trendNote="tuần này" />
        <StatCard label="API Requests" value="24.8K" color="blue" trend="▲ 5.3%" trendUp trendNote="hôm nay" />
        <StatCard label="Tỷ lệ lỗi" value="0.4%" color="orange" trend="▼ 0.1%" trendNote="vs tuần trước" />
        <StatCard label="Uptime" value="99.9%" color="purple" trend="● Online" trendUp trendNote="từ 01/01" />
      </div>

      {/* Recent logs */}
      <TableCard
        title="Nhật ký hệ thống gần đây"
        actions={
          <a href="/cai-dat/nhat-ky" className="text-[12px] font-semibold text-blue-600 hover:underline">Xem tất cả</a>
        }
      >
        <table className="w-full border-collapse">
          <thead>
            <tr>
              {['Thời gian', 'Mức độ', 'Dịch vụ', 'Nội dung'].map((h) => (
                <th key={h} className="bg-slate-50 px-4 py-2.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-200">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              { ts: '15/01/2025 14:32:01', level: 'INFO',  svc: 'Auth Service',  msg: 'Đăng nhập: inspector_tran@fsms.vn' },
              { ts: '15/01/2025 14:28:47', level: 'INFO',  svc: 'API Gateway',   msg: 'Hồ sơ thanh tra #INS-2847 đã tạo' },
              { ts: '15/01/2025 14:15:22', level: 'WARN',  svc: 'Database',      msg: 'Truy vấn chậm (>2s): inspection_records' },
              { ts: '15/01/2025 13:55:10', level: 'INFO',  svc: 'Scheduler',     msg: 'Sao lưu hàng ngày hoàn thành' },
              { ts: '15/01/2025 13:40:05', level: 'ERROR', svc: 'Email Service', msg: 'Gửi email thất bại: danangseafood@mail.vn' },
            ].map((r, i) => (
              <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 last:border-0">
                <td className="px-4 py-3 text-[12px] font-mono text-slate-500">{r.ts}</td>
                <td className="px-4 py-3"><Badge variant={r.level} /></td>
                <td className="px-4 py-3 text-[13px] text-slate-700">{r.svc}</td>
                <td className="px-4 py-3 text-[13px] text-slate-700">{r.msg}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </TableCard>
    </>
  );
}

// ── Authority / General Dashboard ──
function AuthorityDashboard() {
  return (
    <>
      {/* Stats */}
      <div className="grid grid-cols-5 gap-4 mb-6">
        <StatCard label="Cơ sở đăng ký" value="1,842" color="blue" trend="▲ 23" trendUp trendNote="tháng này" />
        <StatCard label="Đạt chuẩn" value="1,560" color="green" trend="▲ 84.7%" trendUp trendNote="tỷ lệ tuân thủ" />
        <StatCard label="Vi phạm đang xử lý" value="47" color="red" trend="▲ 5" trendNote="mới tuần này" />
        <StatCard label="Thanh tra (MTD)" value="312" color="orange" trend="▲ 18%" trendUp trendNote="vs tháng trước" />
        <StatCard label="Phản ánh công dân" value="86" color="purple" trend="23" trendNote="chờ xử lý" />
      </div>

      {/* Recent violations + activity */}
      <div className="grid grid-cols-2 gap-4">
        <TableCard title="Vi phạm gần đây" actions={<a href="/vi-pham" className="text-[12px] font-semibold text-blue-600 hover:underline">Xem tất cả</a>}>
          <table className="w-full border-collapse">
            <thead>
              <tr>
                {['Cơ sở', 'Loại', 'Mức độ', 'Trạng thái'].map((h) => (
                  <th key={h} className="bg-slate-50 px-4 py-2.5 text-left text-[11px] font-bold text-slate-500 uppercase tracking-wide border-b border-slate-200">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {[
                { biz: 'Phở Ba Miền', type: 'Vệ sinh', sev: 'high', status: 'open' },
                { biz: 'Bánh Mì Hội An', type: 'Giấy phép', sev: 'medium', status: 'in-progress' },
                { biz: 'Hải Sản Đà Nẵng', type: 'Bảo quản', sev: 'high', status: 'open' },
                { biz: 'Chợ Tươi DN', type: 'Nhãn mác', sev: 'low', status: 'resolved' },
              ].map((r, i) => (
                <tr key={i} className="border-b border-slate-100 hover:bg-slate-50/50 last:border-0">
                  <td className="px-4 py-3 text-[13px] font-semibold text-slate-800">{r.biz}</td>
                  <td className="px-4 py-3 text-[13px] text-slate-600">{r.type}</td>
                  <td className="px-4 py-3"><Badge variant={r.sev} /></td>
                  <td className="px-4 py-3"><Badge variant={r.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </TableCard>

        {/* Activity feed */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-200">
            <span className="text-sm font-bold text-slate-800">Hoạt động gần đây</span>
          </div>
          <div>
            {[
              { color: 'bg-blue-500',    text: 'Thanh tra viên Trần hoàn thành kiểm tra tại', place: 'Phở Ba Miền', time: 'Hôm nay, 14:30' },
              { color: 'bg-red-500',     text: 'Vi phạm MỨC CAO mới tại',                    place: 'Hải Sản Đà Nẵng', time: 'Hôm nay, 13:15' },
              { color: 'bg-emerald-500', text: 'Cấp chứng nhận ATTP cho',                    place: 'Chợ Tươi DN',  time: 'Hôm qua, 11:00' },
              { color: 'bg-amber-500',   text: 'Phản ánh công dân về',                       place: 'Hàng rong #SV-042', time: 'Hôm qua, 09:45' },
              { color: 'bg-blue-500',    text: 'Báo cáo kiểm tra tháng đã đăng cho',         place: 'Q1 2025',     time: '14/01, 08:00' },
            ].map((a, i) => (
              <div key={i} className="flex items-start gap-3 px-5 py-3 border-b border-slate-100 last:border-0">
                <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${a.color}`} />
                <div>
                  <p className="text-[13px] text-slate-700">{a.text} <span className="font-semibold">{a.place}</span></p>
                  <p className="text-[11px] text-slate-400 mt-0.5">{a.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

// ── Inspector Dashboard ──
function InspectorDashboard() {
  return (
    <>
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard label="Thanh tra tháng này" value="24" color="blue" trend="▲ 3" trendUp trendNote="so với tháng trước" />
        <StatCard label="Đã hoàn thành" value="19" color="green" trend="79.2%" trendUp trendNote="tỷ lệ hoàn thành" />
        <StatCard label="Đang lên lịch" value="5" color="orange" trend="2" trendNote="quá hạn" />
        <StatCard label="Vi phạm phát hiện" value="8" color="red" trend="▲ 2" trendNote="tháng này" />
      </div>
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-800">
        <strong>Lịch thanh tra sắp tới:</strong> Bạn có <strong>3 cuộc thanh tra định kỳ</strong> vào tuần tới. Vui lòng xem lại trong mục Hồ sơ thanh tra.
      </div>
    </>
  );
}

// ── Tester Dashboard ──
function TesterDashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Yêu cầu chờ xử lý" value="12" color="orange" trend="4" trendNote="mới hôm nay" />
      <StatCard label="Đã hoàn thành" value="38" color="green" trend="▲ 15%" trendUp trendNote="tháng này" />
      <StatCard label="Mẫu không đạt" value="3" color="red" trend="2" trendNote="chờ báo cáo" />
    </div>
  );
}

// ── Business Dashboard ──
function BusinessDashboard() {
  return (
    <div className="grid grid-cols-3 gap-4">
      <StatCard label="Điểm thanh tra gần nhất" value="88/100" color="green" trend="Đạt" trendUp />
      <StatCard label="Ngày hết hạn giấy phép" value="30/06/2025" color="orange" trend="167 ngày còn lại" trendUp />
      <StatCard label="Vi phạm đang mở" value="1" color="red" trend="Cần xử lý" />
    </div>
  );
}

// ── Page ──
export default function DashboardPage() {
  const { role } = useRole();

  const title: Record<string, string> = {
    ADMIN:     'Bảng điều hành hệ thống',
    AUTHORITY: 'Tổng quan thành phố Đà Nẵng',
    INSPECTOR: 'Bảng điều hành thanh tra viên',
    TESTER:    'Bảng điều hành kiểm nghiệm',
    BUSINESS:  'Bảng điều hành cơ sở',
  };
  const subtitle: Record<string, string> = {
    ADMIN:     'Tình trạng máy chủ & hệ thống — Quản trị viên',
    AUTHORITY: 'Tình trạng an toàn thực phẩm toàn thành phố',
    INSPECTOR: 'Lịch và hồ sơ thanh tra của bạn',
    TESTER:    'Yêu cầu và kết quả kiểm nghiệm',
    BUSINESS:  'Thông tin cơ sở và tuân thủ',
  };

  return (
    <div>
      {/* Page header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-[22px] font-extrabold text-slate-900 font-display">{title[role]}</h1>
          <p className="text-[13px] text-slate-500 mt-0.5">{subtitle[role]}</p>
        </div>
        <button className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
          Xuất báo cáo
        </button>
      </div>

      {role === 'ADMIN'      && <AdminDashboard />}
      {role === 'AUTHORITY'  && <AuthorityDashboard />}
      {role === 'INSPECTOR'  && <InspectorDashboard />}
      {role === 'TESTER'     && <TesterDashboard />}
      {role === 'BUSINESS'   && <BusinessDashboard />}
    </div>
  );
}
