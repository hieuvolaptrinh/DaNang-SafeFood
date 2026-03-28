'use client';

import { useState } from 'react';

interface Violation {
  id: string;
  businessName: string;
  violationType: string;
  severity: 'nhẹ' | 'trung bình' | 'nghiêm trọng';
  detectedDate: string;
  status: 'pending' | 'processing' | 'resolved';
  district: string;
}

const mockViolations: Violation[] = [
  {
    id: 'VP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh an toàn thực phẩm',
    severity: 'nghiêm trọng',
    detectedDate: '18/03/2025',
    status: 'processing',
    district: 'Hải Châu',
  },
  {
    id: 'VP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá bán',
    severity: 'nhẹ',
    detectedDate: '15/03/2025',
    status: 'resolved',
    district: 'Thanh Khê',
  },
  {
    id: 'VP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng chất cấm trong thực phẩm',
    severity: 'nghiêm trọng',
    detectedDate: '22/03/2025',
    status: 'pending',
    district: 'Ngũ Hành Sơn',
  },
  {
    id: 'VP-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    violationType: 'Bán hàng hết hạn sử dụng',
    severity: 'trung bình',
    detectedDate: '20/03/2025',
    status: 'processing',
    district: 'Sơn Trà',
  },
];

const SEVERITY_CONFIG = {
  'nghiêm trọng': { label: 'Nghiêm trọng', bg: 'bg-red-50',   text: 'text-red-700',   dot: 'bg-red-500',   border: 'border-red-200' },
  'trung bình':   { label: 'Trung bình',   bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', border: 'border-amber-200' },
  'nhẹ':          { label: 'Nhẹ',          bg: 'bg-sky-50',   text: 'text-sky-700',   dot: 'bg-sky-400',   border: 'border-sky-200' },
};

const STATUS_CONFIG = {
  pending:    { label: 'Chưa xử lý', bg: 'bg-slate-50',   text: 'text-slate-600',   icon: '⏸', dot: 'bg-slate-400',   border: 'border-slate-200' },
  processing: { label: 'Đang xử lý', bg: 'bg-blue-50',    text: 'text-blue-700',    icon: '🔄', dot: 'bg-blue-500',    border: 'border-blue-200' },
  resolved:   { label: 'Đã xử lý',   bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '✓',  dot: 'bg-emerald-500', border: 'border-emerald-200' },
};

const STATS = [
  { label: 'Tổng vi phạm',  value: String(mockViolations.length),                                          icon: '📋', color: 'from-violet-600 to-purple-600' },
  { label: 'Nghiêm trọng',  value: String(mockViolations.filter(v => v.severity === 'nghiêm trọng').length), icon: '🚨', color: 'from-red-500 to-rose-600' },
  { label: 'Đang xử lý',    value: String(mockViolations.filter(v => v.status === 'processing').length),    icon: '🔄', color: 'from-blue-500 to-cyan-600' },
  { label: 'Đã xử lý',      value: String(mockViolations.filter(v => v.status === 'resolved').length),      icon: '✅', color: 'from-emerald-500 to-teal-500' },
];

export default function DanhSachViPhamPage() {
  const [search, setSearch] = useState('');
  const [severityFilter, setSeverityFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const districts = [...new Set(mockViolations.map((v) => v.district))];

  const filtered = mockViolations.filter((v) => {
    const matchSearch = !search || v.id.toLowerCase().includes(search.toLowerCase()) || v.businessName.toLowerCase().includes(search.toLowerCase());
    const matchSeverity = !severityFilter || v.severity === severityFilter;
    const matchStatus = !statusFilter || v.status === statusFilter;
    const matchDistrict = !districtFilter || v.district === districtFilter;
    return matchSearch && matchSeverity && matchStatus && matchDistrict;
  });

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-violet-500">SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG</span>
            </div>
            <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">Danh sách Vi phạm</h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">Danh sách các vi phạm được ghi nhận tại các cơ sở kinh doanh trên địa bàn Đà Nẵng</p>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              📥 Xuất CSV
            </button>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{s.label}</p>
                  <p className="text-[30px] font-black text-slate-900 leading-none">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg shadow-sm`}>{s.icon}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-slate-100">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Tỷ lệ vi phạm theo mức độ</p>
          <div className="flex gap-2 h-2 rounded-full overflow-hidden">
            <div className="bg-red-500 rounded-full"  style={{ flex: mockViolations.filter(v => v.severity === 'nghiêm trọng').length }} />
            <div className="bg-amber-400 rounded-full" style={{ flex: mockViolations.filter(v => v.severity === 'trung bình').length }} />
            <div className="bg-sky-400 rounded-full"  style={{ flex: mockViolations.filter(v => v.severity === 'nhẹ').length }} />
          </div>
          <div className="flex gap-5 mt-2.5">
            {[
              { color: 'bg-red-500',  label: 'Nghiêm trọng', val: String(mockViolations.filter(v => v.severity === 'nghiêm trọng').length) },
              { color: 'bg-amber-400', label: 'Trung bình',  val: String(mockViolations.filter(v => v.severity === 'trung bình').length) },
              { color: 'bg-sky-400',  label: 'Nhẹ',          val: String(mockViolations.filter(v => v.severity === 'nhẹ').length) },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[12px] text-slate-500 font-medium">{item.label}</span>
                <span className="text-[12px] font-bold text-slate-700">{item.val} vi phạm</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-slate-800">Tất cả vi phạm</h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[12px] font-bold text-slate-500">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm mã vi phạm, tên cơ sở..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-[220px] transition-all"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer" onChange={(e) => setSeverityFilter(e.target.value)}>
                <option value="">Tất cả mức độ</option>
                <option value="nhẹ">Nhẹ</option>
                <option value="trung bình">Trung bình</option>
                <option value="nghiêm trọng">Nghiêm trọng</option>
              </select>
              <select className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer" onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chưa xử lý</option>
                <option value="processing">Đang xử lý</option>
                <option value="resolved">Đã xử lý</option>
              </select>
              <select className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer" onChange={(e) => setDistrictFilter(e.target.value)}>
                <option value="">Tất cả quận/huyện</option>
                {districts.map((d) => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Mã vi phạm', 'Tên cơ sở', 'Loại vi phạm', 'Mức độ', 'Ngày phát hiện', 'Trạng thái', 'Quận/Huyện', 'Thao tác'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-[13px] text-slate-400">Không tìm thấy vi phạm nào</td></tr>
              ) : filtered.map((v) => {
                const sev = SEVERITY_CONFIG[v.severity];
                const st  = STATUS_CONFIG[v.status];
                return (
                  <tr key={v.id} className="hover:bg-violet-50/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">{v.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-[11px] font-black text-violet-600 flex-shrink-0">
                          {v.businessName.charAt(0)}
                        </div>
                        <span className="font-semibold text-[13px] text-slate-800">{v.businessName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-600 max-w-[180px]"><span className="line-clamp-1">{v.violationType}</span></td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${sev.bg} ${sev.text} ${sev.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${sev.dot}`} />{sev.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">{v.detectedDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">{v.district}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-300 text-sm transition-all shadow-sm" title="Xem">👁</button>
                        <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-sm transition-all shadow-sm" title="Chỉnh sửa">✏️</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-[12px] text-slate-400 font-medium">
              Hiển thị <strong className="text-slate-600">{filtered.length}</strong> trong tổng số <strong className="text-slate-600">{mockViolations.length}</strong> vi phạm
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((p) => (
                <button key={p} className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-all ${p === 1 ? 'bg-violet-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'}`}>{p}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}