'use client';

import { useState } from 'react';
import Link from 'next/link';

interface FoodSafetyWarning {
  id: string;
  businessName: string;
  warningType: string;
  level: "thấp" | "trung bình" | "cao";
  issueDate: string;
  expiryDate: string;
  status: "active" | "resolved" | "expired";
  district: string;
}

const mockWarnings: FoodSafetyWarning[] = [
  {
    id: "CB-2025001",
    businessName: "Nhà hàng Hải Sản Biển Xanh",
    warningType: "Cảnh báo ô nhiễm vi sinh",
    level: "cao",
    issueDate: "20/03/2025",
    expiryDate: "19/04/2025",
    status: "active",
    district: "Hải Châu",
  },
  {
    id: "CB-2025002",
    businessName: "Quán Ăn Gia Đình Việt",
    warningType: "Cảnh báo hạn sử dụng",
    level: "trung bình",
    issueDate: "15/03/2025",
    expiryDate: "14/04/2025",
    status: "resolved",
    district: "Thanh Khê",
  },
  {
    id: "CB-2025003",
    businessName: "Cửa hàng Thực phẩm Sạch Organic",
    warningType: "Cảnh báo nguồn gốc xuất xứ",
    level: "thấp",
    issueDate: "25/03/2025",
    expiryDate: "24/04/2025",
    status: "active",
    district: "Ngũ Hành Sơn",
  },
  {
    id: "CB-2025004",
    businessName: "Siêu thị Mini Mart Đà Nẵng",
    warningType: "Cảnh báo hóa chất bảo quản",
    level: "cao",
    issueDate: "18/03/2025",
    expiryDate: "17/04/2025",
    status: "active",
    district: "Sơn Trà",
  },
];

const LEVEL_CONFIG = {
  cao: { label: 'Cao', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', border: 'border-red-200' },
  'trung bình': { label: 'Trung bình', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', border: 'border-amber-200' },
  thấp: { label: 'Thấp', bg: 'bg-sky-50', text: 'text-sky-700', dot: 'bg-sky-400', border: 'border-sky-200' },
};

const STATUS_CONFIG = {
  active: { label: 'Đang hiệu lực', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', border: 'border-red-200', icon: '🔴' },
  resolved: { label: 'Đã xử lý', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200', icon: '✓' },
  expired: { label: 'Hết hiệu lực', bg: 'bg-slate-50', text: 'text-slate-500', dot: 'bg-slate-400', border: 'border-slate-200', icon: '⏹' },
};

const STATS = [
  { label: 'Tổng cảnh báo', value: String(mockWarnings.length), icon: '🚨', color: 'from-violet-600 to-purple-600' },
  { label: 'Đang hiệu lực', value: String(mockWarnings.filter(w => w.status === 'active').length), icon: '🔴', color: 'from-red-500 to-rose-600' },
  { label: 'Mức độ cao', value: String(mockWarnings.filter(w => w.level === 'cao').length), icon: '⚠️', color: 'from-amber-500 to-orange-500' },
  { label: 'Đã xử lý', value: String(mockWarnings.filter(w => w.status === 'resolved').length), icon: '✅', color: 'from-emerald-500 to-teal-500' },
];

export default function CanhBaoPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  const districts = [...new Set(mockWarnings.map((w) => w.district))];

  const filtered = mockWarnings.filter((w) => {
    const matchSearch =
      !search ||
      w.id.toLowerCase().includes(search.toLowerCase()) ||
      w.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || w.status === statusFilter;
    const matchLevel = !levelFilter || w.level === levelFilter;
    const matchDistrict = !districtFilter || w.district === districtFilter;
    return matchSearch && matchStatus && matchLevel && matchDistrict;
  });

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-violet-500">
                SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
              </span>
            </div>
            <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">
              Cảnh báo An toàn Thực phẩm
            </h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">
              Theo dõi và quản lý các cảnh báo an toàn thực phẩm tại Đà Nẵng
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              📥 Xuất CSV
            </button>
            <Link 
              href="/truyen-thong/canh-bao/new" 
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold transition-all shadow-sm"
            >
              + Tạo cảnh báo mới
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                    {s.label}
                  </p>
                  <p className="text-[30px] font-black text-slate-900 leading-none">
                    {s.value}
                  </p>
                </div>
                <div
                  className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-lg shadow-sm`}
                >
                  {s.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Tỷ lệ cảnh báo */}
        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-slate-100">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Tỷ lệ cảnh báo theo mức độ
          </p>
          <div className="flex gap-2 h-2 rounded-full overflow-hidden">
            <div className="bg-red-500 rounded-full" style={{ flex: mockWarnings.filter(w => w.level === 'cao').length }} />
            <div className="bg-amber-400 rounded-full" style={{ flex: mockWarnings.filter(w => w.level === 'trung bình').length }} />
            <div className="bg-sky-400 rounded-full" style={{ flex: mockWarnings.filter(w => w.level === 'thấp').length }} />
          </div>
          <div className="flex gap-5 mt-2.5">
            {[
              { color: 'bg-red-500', label: 'Cao', val: String(mockWarnings.filter(w => w.level === 'cao').length) },
              { color: 'bg-amber-400', label: 'Trung bình', val: String(mockWarnings.filter(w => w.level === 'trung bình').length) },
              { color: 'bg-sky-400', label: 'Thấp', val: String(mockWarnings.filter(w => w.level === 'thấp').length) },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[12px] text-slate-500 font-medium">{item.label}</span>
                <span className="text-[12px] font-bold text-slate-700">{item.val} cảnh báo</span>
              </div>
            ))}
          </div>
        </div>

        {/* Bảng chính */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-slate-800">Tất cả cảnh báo</h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[12px] font-bold text-slate-500">
                {filtered.length}
              </span>
            </div>

            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm mã cảnh báo, tên cơ sở..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-[230px] transition-all"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                onChange={(e) => setLevelFilter(e.target.value)}
              >
                <option value="">Tất cả mức độ</option>
                <option value="thấp">Thấp</option>
                <option value="trung bình">Trung bình</option>
                <option value="cao">Cao</option>
              </select>

              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang hiệu lực</option>
                <option value="resolved">Đã xử lý</option>
                <option value="expired">Hết hiệu lực</option>
              </select>

              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="">Tất cả quận/huyện</option>
                {districts.map((d) => (
                  <option key={d} value={d}>
                    {d}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "Mã cảnh báo",
                  "Tên cơ sở",
                  "Loại cảnh báo",
                  "Mức độ",
                  "Ngày ban hành",
                  "Hiệu lực đến",
                  "Trạng thái",
                  "Quận/Huyện",
                  "Thao tác",
                ].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={9} className="px-5 py-12 text-center text-[13px] text-slate-400">
                    Không tìm thấy cảnh báo nào
                  </td>
                </tr>
              ) : (
                filtered.map((w) => {
                  const lv = LEVEL_CONFIG[w.level];
                  const st = STATUS_CONFIG[w.status];

                  return (
                    <tr key={w.id} className="hover:bg-violet-50/30 transition-colors group">
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                          {w.id}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-[11px] font-black text-violet-600 flex-shrink-0">
                            {w.businessName.charAt(0)}
                          </div>
                          <span className="font-semibold text-[13px] text-slate-800">
                            {w.businessName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-600 max-w-[160px]">
                        <span className="line-clamp-1">{w.warningType}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${lv.bg} ${lv.text} ${lv.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${lv.dot}`} />{lv.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">{w.issueDate}</td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">{w.expiryDate}</td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${st.dot}`} />{st.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">{w.district}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Link
                            href={`/truyen-thong/canh-bao/${w.id}`}
                            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-300 text-sm flex items-center justify-center transition-all shadow-sm"
                            title="Xem chi tiết"
                          >
                            👁
                          </Link>
                          <button 
                            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-sm transition-all shadow-sm" 
                            title="Chỉnh sửa"
                          >
                            ✏️
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>

          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-[12px] text-slate-400 font-medium">
              Hiển thị <strong className="text-slate-600">{filtered.length}</strong> trong tổng số <strong className="text-slate-600">{mockWarnings.length}</strong> cảnh báo
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-all ${p === 1 ? "bg-violet-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"}`}
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