'use client';

import { useState } from 'react';

interface Penalty {
  id: string;
  businessName: string;
  violationType: string;
  penaltyAmount: string;
  decisionDate: string;
  status: 'pending' | 'paid' | 'overdue';
  district: string;
}

const mockPenalties: Penalty[] = [
  {
    id: 'XP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh ATTP mức nghiêm trọng',
    penaltyAmount: '45.000.000 ₫',
    decisionDate: '18/03/2025',
    status: 'paid',
    district: 'Hải Châu',
  },
  {
    id: 'XP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá',
    penaltyAmount: '8.000.000 ₫',
    decisionDate: '12/03/2025',
    status: 'pending',
    district: 'Thanh Khê',
  },
  {
    id: 'XP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng nguyên liệu không rõ nguồn gốc',
    penaltyAmount: '25.000.000 ₫',
    decisionDate: '25/03/2025',
    status: 'overdue',
    district: 'Ngũ Hành Sơn',
  },
];

const STATUS_CONFIG = {
  pending: { label: 'Chưa nộp',  bg: 'bg-amber-50',   text: 'text-amber-700',   icon: '⏳', dot: 'bg-amber-400',  border: 'border-amber-200' },
  paid:    { label: 'Đã nộp',    bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '✓',  dot: 'bg-emerald-500', border: 'border-emerald-200' },
  overdue: { label: 'Quá hạn',   bg: 'bg-red-50',     text: 'text-red-700',     icon: '🚨', dot: 'bg-red-500',    border: 'border-red-200' },
};

const totalAmount = mockPenalties.reduce((sum, p) => {
  const num = parseInt(p.penaltyAmount.replace(/\D/g, ''), 10);
  return sum + (isNaN(num) ? 0 : num);
}, 0);

const STATS = [
  { label: 'Tổng quyết định', value: String(mockPenalties.length),                                         icon: '📄', color: 'from-violet-600 to-purple-600' },
  { label: 'Chưa nộp',        value: String(mockPenalties.filter(p => p.status === 'pending').length),      icon: '⏳', color: 'from-amber-500 to-orange-500' },
  { label: 'Quá hạn',         value: String(mockPenalties.filter(p => p.status === 'overdue').length),      icon: '🚨', color: 'from-red-500 to-rose-600' },
  { label: 'Tổng tiền phạt',  value: (totalAmount / 1_000_000).toFixed(0) + 'M ₫',                         icon: '💰', color: 'from-emerald-500 to-teal-500' },
];

export default function XuPhatPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const districts = [...new Set(mockPenalties.map((p) => p.district))];

  const filtered = mockPenalties.filter((p) => {
    const matchSearch = !search || p.id.toLowerCase().includes(search.toLowerCase()) || p.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || p.status === statusFilter;
    const matchDistrict = !districtFilter || p.district === districtFilter;
    return matchSearch && matchStatus && matchDistrict;
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
            <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">Quản lý Xử phạt</h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">Quản lý các quyết định xử phạt vi phạm hành chính</p>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              📥 Xuất CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold transition-all shadow-sm">
              + Thêm quyết định
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
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Tỷ lệ thu phạt theo trạng thái</p>
          <div className="flex gap-2 h-2 rounded-full overflow-hidden">
            <div className="bg-emerald-500 rounded-full" style={{ flex: mockPenalties.filter(p => p.status === 'paid').length }} />
            <div className="bg-amber-400 rounded-full"   style={{ flex: mockPenalties.filter(p => p.status === 'pending').length }} />
            <div className="bg-red-500 rounded-full"     style={{ flex: mockPenalties.filter(p => p.status === 'overdue').length }} />
          </div>
          <div className="flex gap-5 mt-2.5">
            {[
              { color: 'bg-emerald-500', label: 'Đã nộp',  val: String(mockPenalties.filter(p => p.status === 'paid').length) },
              { color: 'bg-amber-400',   label: 'Chưa nộp', val: String(mockPenalties.filter(p => p.status === 'pending').length) },
              { color: 'bg-red-500',     label: 'Quá hạn', val: String(mockPenalties.filter(p => p.status === 'overdue').length) },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[12px] text-slate-500 font-medium">{item.label}</span>
                <span className="text-[12px] font-bold text-slate-700">{item.val} quyết định</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-slate-800">Tất cả quyết định xử phạt</h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[12px] font-bold text-slate-500">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm mã quyết định, tên cơ sở..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-[230px] transition-all"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer" onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chưa nộp</option>
                <option value="paid">Đã nộp</option>
                <option value="overdue">Quá hạn</option>
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
                {['Mã quyết định', 'Tên cơ sở', 'Loại vi phạm', 'Mức phạt', 'Ngày quyết định', 'Trạng thái', 'Quận/Huyện', 'Thao tác'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-[13px] text-slate-400">Không tìm thấy quyết định xử phạt nào</td></tr>
              ) : filtered.map((p) => {
                const st = STATUS_CONFIG[p.status];
                return (
                  <tr key={p.id} className="hover:bg-violet-50/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">{p.id}</span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-[11px] font-black text-violet-600 flex-shrink-0">
                          {p.businessName.charAt(0)}
                        </div>
                        <span className="font-semibold text-[13px] text-slate-800">{p.businessName}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-600 max-w-[180px]"><span className="line-clamp-1">{p.violationType}</span></td>
                    <td className="px-5 py-3.5">
                      <span className="font-bold text-[13px] text-slate-800">{p.penaltyAmount}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">{p.decisionDate}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className="text-[12px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">{p.district}</span>
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
              Hiển thị <strong className="text-slate-600">{filtered.length}</strong> trong tổng số <strong className="text-slate-600">{mockPenalties.length}</strong> quyết định
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