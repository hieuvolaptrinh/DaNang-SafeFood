"use client";

import DataTable from "@/components/DataTable";
import TableCard, {
  FilterSelect,
  Pagination,
  SearchInput,
} from "@/components/TableCard";
import { useState } from "react";
import { FiEdit, FiEye } from "react-icons/fi";

interface ViolationFix {
  id: string;
  businessName: string;
  violationType: string;
  severity: "nhẹ" | "trung bình" | "nghiêm trọng";
  fixStatus: "pending" | "in_progress" | "completed";
  deadline: string;
  updatedDate: string;
}

const mockViolationFixes: ViolationFix[] = [
  {
    id: "VP-2025001",
    businessName: "Nhà hàng Hải Sản Biển Xanh",
    violationType: "Vi phạm vệ sinh an toàn thực phẩm",
    severity: "nghiêm trọng",
    fixStatus: "in_progress",
    deadline: "15/04/2025",
    updatedDate: "22/03/2025",
  },
  {
    id: "VP-2025002",
    businessName: "Quán Ăn Gia Đình Việt",
    violationType: "Không niêm yết giá",
    severity: "nhẹ",
    fixStatus: "completed",
    deadline: "10/03/2025",
    updatedDate: "08/03/2025",
  },
  {
    id: "VP-2025003",
    businessName: "Cửa hàng Thực phẩm Sạch Organic",
    violationType: "Sử dụng nguyên liệu hết hạn",
    severity: "trung bình",
    fixStatus: "pending",
    deadline: "30/03/2025",
    updatedDate: "25/03/2025",
  },
  {
    id: "VP-2025004",
    businessName: "Siêu thị Mini Mart Đà Nẵng",
    violationType: "Thiếu giấy phép kinh doanh",
    severity: "nghiêm trọng",
    fixStatus: "in_progress",
    deadline: "20/04/2025",
    updatedDate: "18/03/2025",
  },
];

const SEVERITY_CONFIG = {
  "nghiêm trọng": {
    label: "Nghiêm trọng",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-200",
  },
  "trung bình": {
    label: "Trung bình",
    bg: "bg-amber-50",
    text: "text-amber-700",
    dot: "bg-amber-400",
    border: "border-amber-200",
  },
  nhẹ: {
    label: "Nhẹ",
    bg: "bg-sky-50",
    text: "text-sky-700",
    dot: "bg-sky-400",
    border: "border-sky-200",
  },
};

const FIX_STATUS_CONFIG = {
  pending: {
    label: "Chờ khắc phục",
    bg: "bg-slate-50",
    text: "text-slate-600",
    icon: "⏸",
  },
  in_progress: {
    label: "Đang khắc phục",
    bg: "bg-blue-50",
    text: "text-blue-700",
    icon: "🔄",
  },
  completed: {
    label: "Đã hoàn thành",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    icon: "✓",
  },
};

const STATS = [
  {
    label: "Tổng hồ sơ",
    value: String(mockViolationFixes.length),
    icon: "📋",
    color: "from-violet-600 to-purple-600",
  },
  {
    label: "Chờ khắc phục",
    value: String(
      mockViolationFixes.filter((v) => v.fixStatus === "pending").length,
    ),
    icon: "⏸",
    color: "from-slate-500 to-slate-600",
  },
  {
    label: "Đang khắc phục",
    value: String(
      mockViolationFixes.filter((v) => v.fixStatus === "in_progress").length,
    ),
    icon: "🔄",
    color: "from-blue-500 to-cyan-600",
  },
  {
    label: "Đã hoàn thành",
    value: String(
      mockViolationFixes.filter((v) => v.fixStatus === "completed").length,
    ),
    icon: "✅",
    color: "from-emerald-500 to-teal-500",
  },
];

export default function KhacPhucPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");

  const filtered = mockViolationFixes.filter((v) => {
    const matchSearch =
      !search ||
      v.id.toLowerCase().includes(search.toLowerCase()) ||
      v.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || v.fixStatus === statusFilter;
    const matchSeverity = !severityFilter || v.severity === severityFilter;
    return matchSearch && matchStatus && matchSeverity;
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
              Theo dõi Khắc phục Vi phạm
            </h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">
              Theo dõi tiến độ khắc phục vi phạm của các cơ sở kinh doanh tại Đà
              Nẵng
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              📥 Xuất CSV
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
            Tỷ lệ khắc phục theo mức độ vi phạm
          </p>
          <div className="flex gap-2 h-2 rounded-full overflow-hidden">
            <div
              className="bg-red-500 rounded-full"
              style={{
                flex: mockViolationFixes.filter(
                  (v) => v.severity === "nghiêm trọng",
                ).length,
              }}
            />
            <div
              className="bg-amber-400 rounded-full"
              style={{
                flex: mockViolationFixes.filter(
                  (v) => v.severity === "trung bình",
                ).length,
              }}
            />
            <div
              className="bg-sky-400 rounded-full"
              style={{
                flex: mockViolationFixes.filter((v) => v.severity === "nhẹ")
                  .length,
              }}
            />
          </div>
          <div className="flex gap-5 mt-2.5">
            {[
              {
                color: "bg-red-500",
                label: "Nghiêm trọng",
                val: String(
                  mockViolationFixes.filter(
                    (v) => v.severity === "nghiêm trọng",
                  ).length,
                ),
              },
              {
                color: "bg-amber-400",
                label: "Trung bình",
                val: String(
                  mockViolationFixes.filter((v) => v.severity === "trung bình")
                    .length,
                ),
              },
              {
                color: "bg-sky-400",
                label: "Nhẹ",
                val: String(
                  mockViolationFixes.filter((v) => v.severity === "nhẹ").length,
                ),
              },
            ].map((item) => (
              <div key={item.label} className="flex items-center gap-1.5">
                <span className={`w-2 h-2 rounded-full ${item.color}`} />
                <span className="text-[12px] text-slate-500 font-medium">
                  {item.label}
                </span>
                <span className="text-[12px] font-bold text-slate-700">
                  {item.val} hồ sơ
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-slate-800">
                Tất cả yêu cầu khắc phục
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
                  placeholder="Tìm mã vi phạm, tên cơ sở..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-[220px] transition-all"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                onChange={(e) => setSeverityFilter(e.target.value)}
              >
                <option value="">Tất cả mức độ</option>
                <option value="nhẹ">Nhẹ</option>
                <option value="trung bình">Trung bình</option>
                <option value="nghiêm trọng">Nghiêm trọng</option>
              </select>
              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ khắc phục</option>
                <option value="in_progress">Đang khắc phục</option>
                <option value="completed">Đã hoàn thành</option>
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "Mã vi phạm",
                  "Tên cơ sở",
                  "Loại vi phạm",
                  "Mức độ",
                  "Trạng thái",
                  "Hạn khắc phục",
                  "Ngày cập nhật",
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
                    Không tìm thấy hồ sơ khắc phục nào
                  </td>
                </tr>
              ) : (
                filtered.map((v) => {
                  const sev = SEVERITY_CONFIG[v.severity];
                  const fix = FIX_STATUS_CONFIG[v.fixStatus];
                  return (
                    <tr
                      key={v.id}
                      className="hover:bg-violet-50/30 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                          {v.id}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-2.5">
                          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-100 to-purple-200 flex items-center justify-center text-[11px] font-black text-violet-600 flex-shrink-0">
                            {v.businessName.charAt(0)}
                          </div>
                          <span className="font-semibold text-[13px] text-slate-800">
                            {v.businessName}
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-600 max-w-[180px]">
                        <span className="line-clamp-1">{v.violationType}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold tracking-wide border ${sev.bg} ${sev.text} ${sev.border}`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${sev.dot}`}
                          />
                          {sev.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold ${fix.bg} ${fix.text}`}
                        >
                          <span className="text-[10px]">{fix.icon}</span>
                          {fix.label}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">
                        {v.deadline}
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">
                        {v.updatedDate}
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-violet-50 hover:border-violet-300 text-sm transition-all shadow-sm"
                            title="Xem"
                          >
                            <FiEye size={16} className="mx-auto" />
                          </button>
                          <button
                            className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-sm transition-all shadow-sm"
                            title="Chỉnh sửa"
                          >
                            <FiEdit size={16} className="mx-auto" />
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
                {mockViolationFixes.length}
              </strong>{" "}
              hồ sơ
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
        title="Tất cả yêu cầu khắc phục"
        controls={
          <>
            <SearchInput
              placeholder="Tìm mã vi phạm, tên cơ sở..."
              onChange={setSearch}
            />
            <FilterSelect
              options={[
                { value: "", label: "Tất cả mức độ" },
                { value: "nhẹ", label: "Nhẹ" },
                { value: "trung bình", label: "Trung bình" },
                { value: "nghiêm trọng", label: "Nghiêm trọng" },
              ]}
              onChange={setSeverityFilter}
            />
            <FilterSelect
              options={[
                { value: "", label: "Tất cả trạng thái" },
                { value: "pending", label: "Chờ xử lý" },
                { value: "in_progress", label: "Đang khắc phục" },
                { value: "completed", label: "Đã hoàn thành" },
              ]}
              onChange={setStatusFilter}
            />
          </>
        }
        footer={
          <Pagination
            info={`Hiển thị 1–${filtered.length} trong tổng số ${mockViolationFixes.length} hồ sơ`}
          />
        }
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy hồ sơ khắc phục nào"
        />
      </TableCard>
    </div>
  );
}
