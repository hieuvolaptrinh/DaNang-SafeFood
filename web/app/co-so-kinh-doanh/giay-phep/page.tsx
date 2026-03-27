'use client';

import { useState } from 'react';

interface License {
  id: string;
  businessName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'revoked';
  district: string;
}

const mockLicenses: License[] = [
  {
    id: 'GP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '10/01/2025',
    expiryDate: '09/01/2026',
    status: 'valid',
    district: 'Hải Châu',
  },
  {
    id: 'GP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    type: 'Giấy phép VSATTP',
    issueDate: '15/02/2025',
    expiryDate: '14/02/2025',
    status: 'expired',
    district: 'Thanh Khê',
  },
  {
    id: 'GP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '20/03/2025',
    expiryDate: '19/03/2026',
    status: 'valid',
    district: 'Ngũ Hành Sơn',
  },
  {
    id: 'GP-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '05/01/2025',
    expiryDate: '04/01/2026',
    status: 'revoked',
    district: 'Sơn Trà',
  },
];

const STATUS_CONFIG = {
  valid: {
    label: 'Còn hiệu lực',
    bg: 'bg-emerald-50',
    text: 'text-emerald-700',
    dot: 'bg-emerald-500',
    border: 'border-emerald-200',
  },
  expired: {
    label: 'Hết hạn',
    bg: 'bg-slate-100',
    text: 'text-slate-500',
    dot: 'bg-slate-400',
    border: 'border-slate-200',
  },
  revoked: {
    label: 'Đã thu hồi',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    border: 'border-red-200',
  },
};

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${cfg.bg} ${cfg.text} ${cfg.border}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

const DISTRICT_COLORS: Record<string, string> = {
  'Hải Châu': 'bg-blue-100 text-blue-700',
  'Thanh Khê': 'bg-violet-100 text-violet-700',
  'Ngũ Hành Sơn': 'bg-teal-100 text-teal-700',
  'Sơn Trà': 'bg-orange-100 text-orange-700',
};

const STATS = [
  { label: 'Tổng giấy phép', value: '1.245', icon: '📄', color: 'from-indigo-600 to-blue-600' },
  { label: 'Còn hiệu lực', value: '1.048', icon: '✅', color: 'from-emerald-500 to-teal-500' },
  { label: 'Hết hạn', value: '143', icon: '⌛', color: 'from-slate-500 to-slate-600' },
  { label: 'Đã thu hồi', value: '54', icon: '🚫', color: 'from-red-500 to-red-600' },
];

export default function GiayPhepPage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [districtFilter, setDistrictFilter] = useState('');

  const filtered = mockLicenses.filter((l) => {
    const matchSearch =
      !search ||
      l.id.toLowerCase().includes(search.toLowerCase()) ||
      l.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || l.status === statusFilter;
    const matchDistrict = !districtFilter || l.district === districtFilter;
    return matchSearch && matchStatus && matchDistrict;
  });

  const districts = [...new Set(mockLicenses.map((l) => l.district))];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400" />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-indigo-500">
                SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
              </span>
            </div>
            <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">
              Quản lý Giấy phép
            </h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">
              1.245 giấy phép đã cấp cho các cơ sở kinh doanh tại Đà Nẵng
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Xuất CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-700 text-white text-[13px] font-semibold hover:from-indigo-700 hover:to-blue-800 transition-all shadow-md shadow-indigo-200">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Cấp giấy phép mới
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{s.label}</p>
                  <p className="text-[30px] font-black text-slate-900 leading-none">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg shadow-sm`}>
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-slate-800">Tất cả giấy phép</h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[12px] font-bold text-slate-500">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm mã, tên cơ sở..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent w-[220px] transition-all"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="valid">Còn hiệu lực</option>
                <option value="expired">Hết hạn</option>
                <option value="revoked">Đã thu hồi</option>
              </select>
              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="">Tất cả quận/huyện</option>
                {districts.map((d) => (
                  <option key={d} value={d}>{d}</option>
                ))}
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Mã giấy phép', 'Tên cơ sở', 'Loại giấy phép', 'Ngày cấp', 'Ngày hết hạn', 'Trạng thái', 'Quận/Huyện', 'Thao tác'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((l, i) => (
                <tr key={l.id} className="hover:bg-indigo-50/30 transition-colors group">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                      {l.id}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 flex items-center justify-center text-[11px] font-black text-indigo-600 flex-shrink-0">
                        {l.businessName.charAt(0)}
                      </div>
                      <span className="font-semibold text-[13px] text-slate-800">{l.businessName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-600">{l.type}</td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">{l.issueDate}</td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">{l.expiryDate}</td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={l.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span className={`text-[11px] font-semibold px-2.5 py-1 rounded-full ${DISTRICT_COLORS[l.district] || 'bg-slate-100 text-slate-600'}`}>
                      {l.district}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-sm transition-all shadow-sm" title="Xem">👁</button>
                      <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-sm transition-all shadow-sm" title="Chỉnh sửa">✏️</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-[12px] text-slate-400 font-medium">
              Hiển thị <strong className="text-slate-600">{filtered.length}</strong> trong tổng số{' '}
              <strong className="text-slate-600">{mockLicenses.length}</strong> giấy phép
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-all ${
                    p === 1 ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}