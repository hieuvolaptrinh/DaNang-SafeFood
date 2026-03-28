'use client';

import { useState } from 'react';
import { mockFeedback, CitizenFeedback } from '@/data/mockData';

const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Khiếu nại vệ sinh': { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-400' },
  'Hàng giả':          { bg: 'bg-purple-50',  text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400' },
  'Ngộ độc thực phẩm': { bg: 'bg-orange-50',  text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-400' },
  'Câu hỏi chung':     { bg: 'bg-slate-50',   text: 'text-slate-600',  border: 'border-slate-200',  dot: 'bg-slate-400' },
};

const PRIORITY_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string; label: string }> = {
  high:   { bg: 'bg-red-50',    text: 'text-red-700',    border: 'border-red-200',    dot: 'bg-red-500',    label: 'Cao' },
  medium: { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400',  label: 'Trung bình' },
  low:    { bg: 'bg-sky-50',    text: 'text-sky-700',    border: 'border-sky-200',    dot: 'bg-sky-400',    label: 'Thấp' },
};

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string; icon: string; label: string }> = {
  'open':        { bg: 'bg-amber-50',  text: 'text-amber-700',  border: 'border-amber-200',  dot: 'bg-amber-400',  icon: '📬', label: 'Đang mở' },
  'in-progress': { bg: 'bg-blue-50',   text: 'text-blue-700',   border: 'border-blue-200',   dot: 'bg-blue-500',   icon: '🔄', label: 'Đang xử lý' },
  'resolved':    { bg: 'bg-emerald-50',text: 'text-emerald-700',border: 'border-emerald-200',dot: 'bg-emerald-500',icon: '✓',  label: 'Đã giải quyết' },
};

export default function PhanAnhCongDanPage() {
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const filtered = mockFeedback.filter((f: CitizenFeedback) => {
    const matchSearch = !search || f.businessReported.toLowerCase().includes(search.toLowerCase()) || f.submitter.toLowerCase().includes(search.toLowerCase());
    const matchType   = !typeFilter   || f.type   === typeFilter;
    const matchStatus = !statusFilter || f.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const STATS = [
    { label: 'Tổng phản ánh',   value: String(mockFeedback.length),                                          icon: '📣', color: 'from-violet-600 to-purple-600' },
    { label: 'Đang mở',         value: String(mockFeedback.filter((f: CitizenFeedback) => f.status === 'open').length),        icon: '📬', color: 'from-amber-500 to-orange-500' },
    { label: 'Đang xử lý',      value: String(mockFeedback.filter((f: CitizenFeedback) => f.status === 'in-progress').length), icon: '🔄', color: 'from-blue-500 to-cyan-600' },
    { label: 'Đã giải quyết',   value: String(mockFeedback.filter((f: CitizenFeedback) => f.status === 'resolved').length),    icon: '✅', color: 'from-emerald-500 to-teal-500' },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />
      <div className="max-w-[1200px] mx-auto px-6 py-8">

        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-violet-500">SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG</span>
            </div>
            <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">Phản ánh Công dân</h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">Báo cáo và khiếu nại từ người dân về các cơ sở kinh doanh thực phẩm</p>
          </div>
        </div>

        {/* Alert banner */}
        <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-2xl px-5 py-4 mb-6">
          <span className="text-xl mt-0.5">ℹ️</span>
          <div>
            <p className="text-[13px] font-bold text-blue-800">23 phản ánh chờ xem xét</p>
            <p className="text-[12px] text-blue-600 mt-0.5">Phản ánh mới cần được xem xét và phản hồi trong vòng 5 ngày làm việc.</p>
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
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">Tỷ lệ theo trạng thái xử lý</p>
          <div className="flex gap-2 h-2 rounded-full overflow-hidden">
            <div className="bg-amber-400 rounded-full"  style={{ flex: mockFeedback.filter((f: CitizenFeedback) => f.status === 'open').length }} />
            <div className="bg-blue-500 rounded-full"   style={{ flex: mockFeedback.filter((f: CitizenFeedback) => f.status === 'in-progress').length }} />
            <div className="bg-emerald-500 rounded-full" style={{ flex: mockFeedback.filter((f: CitizenFeedback) => f.status === 'resolved').length }} />
          </div>
          <div className="flex gap-5 mt-2.5">
            {[
              { color: 'bg-amber-400',   label: 'Đang mở',       val: String(mockFeedback.filter((f: CitizenFeedback) => f.status === 'open').length) },
              { color: 'bg-blue-500',    label: 'Đang xử lý',    val: String(mockFeedback.filter((f: CitizenFeedback) => f.status === 'in-progress').length) },
              { color: 'bg-emerald-500', label: 'Đã giải quyết', val: String(mockFeedback.filter((f: CitizenFeedback) => f.status === 'resolved').length) },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[12px] text-slate-500 font-medium">{item.label}</span>
                <span className="text-[12px] font-bold text-slate-700">{item.val} phản ánh</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-slate-800">Tất cả phản ánh</h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[12px] font-bold text-slate-500">{filtered.length}</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm phản ánh..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-[200px] transition-all"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer" onChange={(e) => setTypeFilter(e.target.value)}>
                <option value="">Tất cả loại</option>
                <option value="Khiếu nại vệ sinh">Khiếu nại vệ sinh</option>
                <option value="Hàng giả">Hàng giả</option>
                <option value="Ngộ độc thực phẩm">Ngộ độc thực phẩm</option>
                <option value="Câu hỏi chung">Câu hỏi chung</option>
              </select>
              <select className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer" onChange={(e) => setStatusFilter(e.target.value)}>
                <option value="">Tất cả trạng thái</option>
                <option value="open">Đang mở</option>
                <option value="in-progress">Đang xử lý</option>
                <option value="resolved">Đã giải quyết</option>
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Mã phản ánh', 'Người gửi', 'Cơ sở bị phản ánh', 'Loại phản ánh', 'Ngày gửi', 'Ưu tiên', 'Trạng thái', 'Thao tác'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-[13px] text-slate-400">Không có phản ánh nào</td></tr>
              ) : filtered.map((f: CitizenFeedback) => {
                const typeCfg  = TYPE_CONFIG[f.type]     || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' };
                const prioCfg  = PRIORITY_CONFIG[f.priority] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400', label: f.priority };
                const statCfg  = STATUS_CONFIG[f.status]  || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400', icon: '•', label: f.status };
                return (
                  <tr key={f.id} className="hover:bg-violet-50/30 transition-colors group">
                    <td className="px-5 py-3.5">
                      <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">{f.id}</span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-700 font-medium">{f.submitter}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-[11px] font-black text-violet-600 flex-shrink-0">
                          {f.businessReported.charAt(0)}
                        </div>
                        <span className="font-semibold text-[13px] text-slate-800">{f.businessReported}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${typeCfg.dot}`} />{f.type}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">{f.date}</td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${prioCfg.bg} ${prioCfg.text} ${prioCfg.border}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${prioCfg.dot}`} />{prioCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${statCfg.bg} ${statCfg.text} ${statCfg.border}`}>
                        <span className="text-[10px]">{statCfg.icon}</span>{statCfg.label}
                      </span>
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-300 text-sm transition-all shadow-sm" title="Xem">👁</button>
                        <button className="w-7 h-7 rounded-lg border border-blue-200 bg-blue-600 hover:bg-blue-700 text-white text-sm transition-all shadow-sm" title="Phản hồi">💬</button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-[12px] text-slate-400 font-medium">
              Hiển thị <strong className="text-slate-600">{filtered.length}</strong> trong tổng số <strong className="text-slate-600">86</strong> phản ánh
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

