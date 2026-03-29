"use client";

import Link from 'next/link';
import { useState } from 'react';
import { FiEdit, FiEye } from 'react-icons/fi';
import TableCard, { FilterSelect, Pagination, SearchInput } from '@/components/TableCard';
import DataTable from '@/components/DataTable';

interface Notification {
  id: string;
  title: string;
  type: string;
  target: string;
  sendDate: string;
  status: "sent" | "draft" | "scheduled";
  recipientCount: number;
}

const mockNotifications: Notification[] = [
  {
    id: "TB-2025001",
    title: "Cảnh báo khẩn cấp về lô thực phẩm nhiễm khuẩn",
    type: "Khẩn cấp",
    target: "Tất cả cơ sở kinh doanh",
    sendDate: "25/03/2025",
    status: "sent",
    recipientCount: 1842,
  },
  {
    id: "TB-2025002",
    title: "Hướng dẫn kiểm tra định kỳ quý II/2025",
    type: "Thông báo",
    target: "Cơ sở kinh doanh thực phẩm",
    sendDate: "20/03/2025",
    status: "sent",
    recipientCount: 1245,
  },
  {
    id: "TB-2025003",
    title: "Mời tham gia hội thảo an toàn thực phẩm",
    type: "Mời tham gia",
    target: "Quản lý cơ sở",
    sendDate: "22/03/2025",
    status: "scheduled",
    recipientCount: 350,
  },
];

const STATUS_CONFIG = {
  sent: {
    label: "Đã gửi",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
    icon: "✓",
  },
  draft: {
    label: "Bản nháp",
    bg: "bg-slate-50",
    text: "text-slate-500",
    dot: "bg-slate-400",
    border: "border-slate-200",
    icon: "✏️",
  },
  scheduled: {
    label: "Đã lên lịch",
    bg: "bg-blue-50",
    text: "text-blue-700",
    dot: "bg-blue-500",
    border: "border-blue-200",
    icon: "🗓",
  },
};

const TYPE_CONFIG: Record<
  string,
  { bg: string; text: string; border: string; icon: string }
> = {
  "Khẩn cấp": {
    bg: "bg-red-50",
    text: "text-red-700",
    border: "border-red-200",
    icon: "🚨",
  },
  "Thông báo": {
    bg: "bg-violet-50",
    text: "text-violet-700",
    border: "border-violet-200",
    icon: "📢",
  },
  "Mời tham gia": {
    bg: "bg-sky-50",
    text: "text-sky-700",
    border: "border-sky-200",
    icon: "🎫",
  },
};

const totalRecipients = mockNotifications.reduce(
  (s, n) => s + n.recipientCount,
  0,
);

const STATS = [
  {
    label: "Tổng thông báo",
    value: String(mockNotifications.length),
    icon: "📣",
    color: "from-violet-600 to-purple-600",
  },
  {
    label: "Đã gửi",
    value: String(mockNotifications.filter((n) => n.status === "sent").length),
    icon: "✅",
    color: "from-emerald-500 to-teal-500",
  },
  {
    label: "Đã lên lịch",
    value: String(
      mockNotifications.filter((n) => n.status === "scheduled").length,
    ),
    icon: "🗓",
    color: "from-blue-500 to-cyan-600",
  },
  {
    label: "Tổng người nhận",
    value: totalRecipients.toLocaleString(),
    icon: "👥",
    color: "from-amber-500 to-orange-500",
  },
];

const columns = [
  { key: "id", label: "Mã thông báo" },
  { key: "title", label: "Tiêu đề" },
  { key: "type", label: "Loại" },
  { key: "target", label: "Đối tượng" },
  { key: "sendDate", label: "Ngày gửi" },
  { key: "status", label: "Trạng thái" },
  { key: "recipientCount", label: "Số người nhận" },
];

export default function ThongBaoPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const filtered = mockNotifications.filter((n) => {
    const matchSearch =
      !search ||
      n.id.toLowerCase().includes(search.toLowerCase()) ||
      n.title.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || n.status === statusFilter;
    const matchType = !typeFilter || n.type === typeFilter;
    return matchSearch && matchStatus && matchType;
  });

  const totalFilteredRecipients = filtered.reduce(
    (s, n) => s + n.recipientCount,
    0,
  );

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
              Thông báo
            </h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">
              Quản lý và gửi thông báo đến các cơ sở kinh doanh
            </p>
          </div>
          <div className="flex gap-2 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              📥 Xuất CSV
            </button>
            <Link href="/truyen-thong/thong-bao/new" className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-violet-600 hover:bg-violet-700 text-white text-[13px] font-semibold transition-all shadow-sm">
              + Tạo thông báo mới
            </Link>
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
            Phân bổ theo loại thông báo
          </p>
          <div className="flex gap-2 h-2 rounded-full overflow-hidden">
            <div
              className="bg-red-500 rounded-full"
              style={{
                flex: mockNotifications.filter((n) => n.type === "Khẩn cấp")
                  .length,
              }}
            />
            <div
              className="bg-violet-500 rounded-full"
              style={{
                flex: mockNotifications.filter((n) => n.type === "Thông báo")
                  .length,
              }}
            />
            <div
              className="bg-sky-400 rounded-full"
              style={{
                flex: mockNotifications.filter((n) => n.type === "Mời tham gia")
                  .length,
              }}
            />
          </div>
          <div className="flex gap-5 mt-2.5">
            {[
              {
                color: "bg-red-500",
                label: "Khẩn cấp",
                val: String(
                  mockNotifications.filter((n) => n.type === "Khẩn cấp").length,
                ),
              },
              {
                color: "bg-violet-500",
                label: "Thông báo",
                val: String(
                  mockNotifications.filter((n) => n.type === "Thông báo")
                    .length,
                ),
              },
              {
                color: "bg-sky-400",
                label: "Mời tham gia",
                val: String(
                  mockNotifications.filter((n) => n.type === "Mời tham gia")
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
                  {item.val} thông báo
                </span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between flex-wrap gap-3">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-slate-800">
                Tất cả thông báo
              </h2>
              <span className="px-2 py-0.5 rounded-md bg-slate-100 text-[12px] font-bold text-slate-500">
                {filtered.length}
              </span>
              {filtered.length > 0 && (
                <span className="text-[12px] text-slate-400 font-medium">
                  ·{" "}
                  <strong className="text-violet-600">
                    {totalFilteredRecipients.toLocaleString()}
                  </strong>{" "}
                  người nhận
                </span>
              )}
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
                  placeholder="Tìm mã, tiêu đề thông báo..."
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent w-[220px] transition-all"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                onChange={(e) => setTypeFilter(e.target.value)}
              >
                <option value="">Tất cả loại</option>
                <option value="Khẩn cấp">Khẩn cấp</option>
                <option value="Thông báo">Thông báo</option>
                <option value="Mời tham gia">Mời tham gia</option>
              </select>
              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="sent">Đã gửi</option>
                <option value="draft">Bản nháp</option>
                <option value="scheduled">Đã lên lịch</option>
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {[
                  "Mã thông báo",
                  "Tiêu đề",
                  "Loại",
                  "Đối tượng",
                  "Ngày gửi",
                  "Trạng thái",
                  "Số người nhận",
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
                    Không tìm thấy thông báo nào
                  </td>
                </tr>
              ) : (
                filtered.map((n) => {
                  const st = STATUS_CONFIG[n.status];
                  const typ = TYPE_CONFIG[n.type] || {
                    bg: "bg-slate-50",
                    text: "text-slate-600",
                    border: "border-slate-200",
                    icon: "📋",
                  };
                  return (
                    <tr
                      key={n.id}
                      className="hover:bg-violet-50/30 transition-colors group"
                    >
                      <td className="px-5 py-3.5">
                        <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                          {n.id}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 max-w-[240px]">
                        <p className="font-semibold text-[13px] text-slate-800 line-clamp-2 leading-snug">
                          {n.title}
                        </p>
                      </td>
                      <td className="px-5 py-3.5">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold border ${typ.bg} ${typ.text} ${typ.border}`}
                        >
                          <span className="text-[10px]">{typ.icon}</span>
                          {n.type}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="text-[12px] text-slate-500 bg-slate-100 px-2 py-0.5 rounded-md font-medium">
                          {n.target}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">
                        {n.sendDate}
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
                          <span className="text-[13px] font-black text-slate-800">
                            {n.recipientCount.toLocaleString()}
                          </span>
                          <span className="text-[11px] text-slate-400 font-medium">
                            người
                          </span>
                        </div>
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
                {mockNotifications.length}
              </strong>{" "}
              thông báo
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
        title="Tất cả thông báo"
        controls={
          <>
            <SearchInput
              placeholder="Tìm mã, tiêu đề thông báo..."
              onChange={setSearch}
            />
            <FilterSelect
              options={[
                { value: "", label: "Tất cả loại" },
                { value: "Khẩn cấp", label: "Khẩn cấp" },
                { value: "Thông báo", label: "Thông báo" },
                { value: "Mời tham gia", label: "Mời tham gia" },
              ]}
              onChange={setTypeFilter}
            />
            <FilterSelect
              options={[
                { value: "", label: "Tất cả trạng thái" },
                { value: "sent", label: "Đã gửi" },
                { value: "draft", label: "Bản nháp" },
                { value: "scheduled", label: "Đã lên lịch" },
              ]}
              onChange={setStatusFilter}
            />
          </>
        }
        footer={
          <Pagination
            info={`Hiển thị 1–${filtered.length} trong tổng số ${mockNotifications.length} thông báo`}
          />
        }
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy thông báo nào"
        />
      </TableCard>
    </div>
  );
}
