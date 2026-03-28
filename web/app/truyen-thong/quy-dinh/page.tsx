"use client";

import DataTable from "@/components/DataTable";
import TableCard, {
  FilterSelect,
  Pagination,
  SearchInput,
} from "@/components/TableCard";
import { useState } from "react";

interface Regulation {
  id: string;
  title: string;
  category: string;
  issueDate: string;
  effectiveDate: string;
  status: "active" | "draft" | "expired";
  authority: string;
}

const mockRegulations: Regulation[] = [
  {
    id: "QD-2025-001",
    title: "Quy định về kiểm tra an toàn thực phẩm năm 2025",
    category: "An toàn thực phẩm",
    issueDate: "01/01/2025",
    effectiveDate: "01/02/2025",
    status: "active",
    authority: "Sở Y tế Đà Nẵng",
  },
  {
    id: "QD-2025-002",
    title: "Hướng dẫn cấp giấy phép kinh doanh thực phẩm",
    category: "Giấy phép",
    issueDate: "15/02/2025",
    effectiveDate: "01/03/2025",
    status: "active",
    authority: "UBND TP. Đà Nẵng",
  },
  {
    id: "QD-2024-015",
    title: "Quy định xử phạt vi phạm hành chính lĩnh vực ATTP",
    category: "Xử phạt",
    issueDate: "10/12/2024",
    effectiveDate: "01/01/2025",
    status: "active",
    authority: "Chính phủ",
  },
];

const STATUS_CONFIG = {
  active: {
    label: "Đang hiệu lực",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
    icon: "✓",
  },
  draft: {
    label: "Bản nháp",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-200",
    icon: "✏️",
  },
  expired: {
    label: "Hết hiệu lực",
    bg: "bg-slate-50",
    text: "text-slate-500",
    dot: "bg-slate-400",
    border: "border-slate-200",
    icon: "⏹",
  },
};

const CATEGORY_COLORS: Record<
  string,
  { bg: string; text: string; border: string }
> = {
  "An toàn thực phẩm": {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
  },
  "Giấy phép": {
    bg: "bg-blue-50",
    text: "text-blue-700",
    border: "border-blue-200",
  },
  "Xử phạt": {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
  },
};

const AUTHORITY_ICONS: Record<string, string> = {
  "Sở Y tế Đà Nẵng": "🏥",
  "UBND TP. Đà Nẵng": "🏛️",
  "Chính phủ": "⚖️",
};

const STATS = [
  {
    label: "Tổng quy định",
    value: String(mockRegulations.length),
    icon: "📜",
    color: "from-violet-600 to-purple-600",
  },
  {
    label: "Đang hiệu lực",
    value: String(mockRegulations.filter((r) => r.status === "active").length),
    icon: "✅",
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Bản nháp",
    value: String(mockRegulations.filter((r) => r.status === "draft").length),
    icon: "✏️",
    color: "from-amber-500 to-orange-500",
  },
  {
    label: "Hết hiệu lực",
    value: String(mockRegulations.filter((r) => r.status === "expired").length),
    icon: "📁",
    color: "from-slate-400 to-slate-500",
  },
];

export default function QuyDinhPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  const categories = [...new Set(mockRegulations.map((r) => r.category))];

  const filtered = mockRegulations.filter((r) => {
    const matchSearch =
      !search ||
      r.id.toLowerCase().includes(search.toLowerCase()) ||
      r.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || r.status === statusFilter;
    const matchCategory = !categoryFilter || r.category === categoryFilter;
    return matchSearch && matchStatus && matchCategory;
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
              Quy định Pháp luật
            </h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">
              Danh sách các quy định, văn bản pháp luật liên quan đến an toàn
              thực phẩm
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              📥 Xuất CSV
            </button>
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold transition-all shadow-sm">
              + Thêm quy định mới
            </button>
          </div>
        </div>

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

        <div className="bg-white rounded-2xl p-5 mb-4 shadow-sm border border-slate-100">
          <p className="text-[12px] font-bold text-slate-400 uppercase tracking-wider mb-3">
            Phân bổ theo danh mục
          </p>
          <div className="flex gap-2 h-2 rounded-full overflow-hidden">
            <div
              className="bg-violet-500 rounded-full"
              style={{
                flex: mockRegulations.filter(
                  (r) => r.category === "An toàn thực phẩm",
                ).length,
              }}
            />
            <div
              className="bg-blue-500 rounded-full"
              style={{
                flex: mockRegulations.filter((r) => r.category === "Giấy phép")
                  .length,
              }}
            />
            <div
              className="bg-red-500 rounded-full"
              style={{
                flex: mockRegulations.filter((r) => r.category === "Xử phạt")
                  .length,
              }}
            />
          </div>
          <div className="flex gap-5 mt-2.5">
            {[
              {
                color: "bg-violet-500",
                label: "An toàn thực phẩm",
                val: String(
                  mockRegulations.filter(
                    (r) => r.category === "An toàn thực phẩm",
                  ).length,
                ),
              },
              {
                color: "bg-blue-500",
                label: "Giấy phép",
                val: String(
                  mockRegulations.filter((r) => r.category === "Giấy phép")
                    .length,
                ),
              },
              {
                color: "bg-red-500",
                label: "Xử phạt",
                val: String(
                  mockRegulations.filter((r) => r.category === "Xử phạt")
                    .length,
                ),
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[12px] text-slate-500 font-medium">
                  {item.label}
                </span>
                <span className="text-[12px] font-bold text-slate-700">
                  {item.val} văn bản
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-slate-800">
                Tất cả quy định
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[12px] font-bold text-slate-500">
                {filtered.length}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
                <input
                  type="text"
                  placeholder="Tìm mã, tiêu đề quy định..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-[220px] transition-all"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                onChange={(e) => setCategoryFilter(e.target.value)}
              >
                <option value="">Tất cả danh mục</option>
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="active">Đang hiệu lực</option>
                <option value="draft">Bản nháp</option>
                <option value="expired">Hết hiệu lực</option>
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "Mã quy định",
                  "Tiêu đề",
                  "Danh mục",
                  "Ngày ban hành",
                  "Ngày hiệu lực",
                  "Trạng thái",
                  "Cơ quan ban hành",
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
                  <td
                    colSpan={8}
                    className="px-5 py-12 text-center text-[13px] text-slate-400"
                  >
                    Không tìm thấy quy định nào
                  </td>
                </tr>
              ) : (
                filtered.map((r) => {
                  const st = STATUS_CONFIG[r.status];
                  const cat = CATEGORY_COLORS[r.category] || {
                    bg: "bg-slate-50",
                    text: "text-slate-600",
                    border: "border-slate-200",
                  };
                  const authIcon = AUTHORITY_ICONS[r.authority] || "📋";
                  return (
                    <tr
                      key={r.id}
                      className="hover:bg-violet-50/30 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                          {r.id}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-[240px]">
                        <p className="font-semibold text-[13px] text-slate-800 line-clamp-2 leading-snug">
                          {r.title}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-semibold border ${cat.bg} ${cat.text} ${cat.border}`}
                        >
                          {r.category}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">
                        {r.issueDate}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">
                        {r.effectiveDate}
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${st.bg} ${st.text} ${st.border}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${st.dot}`}
                          />
                          {st.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className="text-base">{authIcon}</span>
                          <span className="text-[12px] text-slate-600 font-medium">
                            {r.authority}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-300 text-sm transition-all shadow-sm"
                            title="Xem"
                          >
                            👁
                          </button>
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
              Hiển thị{" "}
              <strong className="text-slate-600">{filtered.length}</strong>{" "}
              trong tổng số{" "}
              <strong className="text-slate-600">
                {mockRegulations.length}
              </strong>{" "}
              quy định
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
      <TableCard
        title="Tất cả quy định"
        controls={
          <>
            <SearchInput
              placeholder="Tìm mã, tiêu đề quy định..."
              onChange={setSearch}
            />
            <FilterSelect
              options={[
                { value: "", label: "Tất cả danh mục" },
                ...categories.map((c) => ({ value: c, label: c })),
              ]}
              onChange={setCategoryFilter}
            />
            <FilterSelect
              options={[
                { value: "", label: "Tất cả trạng thái" },
                { value: "active", label: "Đang hiệu lực" },
                { value: "draft", label: "Bản nháp" },
                { value: "expired", label: "Hết hiệu lực" },
              ]}
              onChange={setStatusFilter}
            />
          </>
        }
        footer={
          <Pagination
            info={`Hiển thị 1–${filtered.length} trong tổng số ${mockRegulations.length} quy định`}
          />
        }
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy quy định nào"
        />
      </TableCard>
    </div>
  );
}
