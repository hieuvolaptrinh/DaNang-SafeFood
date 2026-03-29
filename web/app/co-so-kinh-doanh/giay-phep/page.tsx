'use client';

import { useState } from 'react';
import Link from 'next/link';

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
    id: "GP-2025001",
    businessName: "Nhà hàng Hải Sản Biển Xanh",
    type: "Giấy phép kinh doanh thực phẩm",
    issueDate: "10/01/2025",
    expiryDate: "09/01/2026",
    status: "valid",
    district: "Hải Châu",
  },
  {
    id: "GP-2025002",
    businessName: "Quán Ăn Gia Đình Việt",
    type: "Giấy phép VSATTP",
    issueDate: "15/02/2025",
    expiryDate: "14/02/2025",
    status: "expired",
    district: "Thanh Khê",
  },
  {
    id: "GP-2025003",
    businessName: "Cửa hàng Thực phẩm Sạch Organic",
    type: "Giấy phép kinh doanh thực phẩm",
    issueDate: "20/03/2025",
    expiryDate: "19/03/2026",
    status: "valid",
    district: "Ngũ Hành Sơn",
  },
  {
    id: "GP-2025004",
    businessName: "Siêu thị Mini Mart Đà Nẵng",
    type: "Giấy phép kinh doanh thực phẩm",
    issueDate: "05/01/2025",
    expiryDate: "04/01/2026",
    status: "revoked",
    district: "Sơn Trà",
  },
];

const STATUS_CONFIG = {
  valid: {
    label: "Còn hiệu lực",
    bg: "bg-emerald-50",
    text: "text-emerald-700",
    dot: "bg-emerald-500",
    border: "border-emerald-200",
  },
  expired: {
    label: "Hết hạn",
    bg: "bg-slate-100",
    text: "text-slate-500",
    dot: "bg-slate-400",
    border: "border-slate-200",
  },
  revoked: {
    label: "Đã thu hồi",
    bg: "bg-red-50",
    text: "text-red-700",
    dot: "bg-red-500",
    border: "border-red-200",
  },
};

const DISTRICT_COLORS: Record<string, string> = {
  "Hải Châu": "bg-blue-100 text-blue-700",
  "Thanh Khê": "bg-violet-100 text-violet-700",
  "Ngũ Hành Sơn": "bg-teal-100 text-teal-700",
  "Sơn Trà": "bg-orange-100 text-orange-700",
};

const STATS = [
  { label: "Tổng giấy phép", value: "1.245", icon: "📄", color: "from-indigo-600 to-blue-600" },
  { label: "Còn hiệu lực", value: "1.048", icon: "✅", color: "from-emerald-500 to-teal-500" },
  { label: "Hết hạn", value: "143", icon: "⌛", color: "from-slate-500 to-slate-600" },
  { label: "Đã thu hồi", value: "54", icon: "🚫", color: "from-red-500 to-red-600" },
];

function StatusBadge({ status }: { status: keyof typeof STATUS_CONFIG }) {
  const cfg = STATUS_CONFIG[status];
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${cfg.bg} ${cfg.text} ${cfg.border}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${cfg.dot}`} />
      {cfg.label}
    </span>
  );
}

export default function GiayPhepPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [districtFilter, setDistrictFilter] = useState("");

  const filtered = mockLicenses.filter((license) => {
    const matchSearch =
      !search ||
      license.id.toLowerCase().includes(search.toLowerCase()) ||
      license.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || license.status === statusFilter;
    const matchDistrict = !districtFilter || license.district === districtFilter;

    return matchSearch && matchStatus && matchDistrict;
  });

  const districts = [...new Set(mockLicenses.map((license) => license.district))];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400" />

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        <div className="mb-8 flex items-start justify-between">
          <div>
            <div className="mb-1 flex items-center gap-2">
              <span className="text-[11px] font-bold uppercase tracking-[0.12em] text-indigo-500">
                SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
              </span>
            </div>
            <h1 className="text-[28px] font-black leading-tight tracking-tight text-slate-900">
              Quản lý Giấy phép
            </h1>
            <p className="mt-1 text-[13px] font-medium text-slate-400">
              1.245 giấy phép đã cấp cho các cơ sở kinh doanh tại Đà Nẵng
            </p>
          </div>

          <div className="flex gap-2 pt-1">
            <button className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[13px] font-semibold text-slate-600 shadow-sm transition-all hover:border-slate-300 hover:bg-slate-50">
              📥 Xuất CSV
            </button>
            <button className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-700 px-4 py-2.5 text-[13px] font-semibold text-white shadow-md shadow-indigo-200 transition-all hover:from-indigo-700 hover:to-blue-800">
              + Cấp giấy phép mới
            </button>
          </div>
        </div>

        {/* Stats */}
        <div className="mb-8 grid grid-cols-4 gap-4">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
            >
              <div className="flex items-start justify-between">
                <div>
                  <p className="mb-2 text-[12px] font-semibold uppercase tracking-wide text-slate-400">
                    {stat.label}
                  </p>
                  <p className="text-[30px] font-black leading-none text-slate-900">
                    {stat.value}
                  </p>
                </div>
                <div
                  className={`flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br text-lg shadow-sm ${stat.color}`}
                >
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
          <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-slate-800">Tất cả giấy phép</h2>
              <span className="rounded-md bg-slate-100 px-2 py-0.5 text-[12px] font-bold text-slate-500">
                {filtered.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              <div className="relative">
                <svg
                  className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
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
                  placeholder="Tìm mã, tên cơ sở..."
                  className="w-[220px] rounded-xl border border-slate-200 bg-slate-50 py-2 pr-4 pl-9 text-[13px] text-slate-700 placeholder-slate-400 transition-all focus:border-transparent focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>

              <select
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="valid">Còn hiệu lực</option>
                <option value="expired">Hết hạn</option>
                <option value="revoked">Đã thu hồi</option>
              </select>

              <select
                className="cursor-pointer rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-[13px] text-slate-600 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                onChange={(e) => setDistrictFilter(e.target.value)}
              >
                <option value="">Tất cả quận/huyện</option>
                {districts.map((district) => (
                  <option key={district} value={district}>
                    {district}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50">
                {[
                  "Mã giấy phép",
                  "Tên cơ sở",
                  "Loại giấy phép",
                  "Ngày cấp",
                  "Ngày hết hạn",
                  "Trạng thái",
                  "Quận/Huyện",
                  "Thao tác",
                ].map((heading) => (
                  <th
                    key={heading}
                    className="whitespace-nowrap px-5 py-3 text-left text-[11px] font-bold uppercase tracking-wider text-slate-400"
                  >
                    {heading}
                  </th>
                ))}
              </tr>
            </thead>

            <tbody className="divide-y divide-slate-50">
              {filtered.map((license) => (
                <tr key={license.id} className="group transition-colors hover:bg-indigo-50/30">
                  <td className="px-5 py-3.5">
                    <span className="rounded-md bg-slate-100 px-2 py-0.5 font-mono text-[12px] font-semibold text-slate-400">
                      {license.id}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-indigo-100 to-indigo-200 text-[11px] font-black text-indigo-600">
                        {license.businessName.charAt(0)}
                      </div>
                      <span className="text-[13px] font-semibold text-slate-800">
                        {license.businessName}
                      </span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-600">
                    {license.type}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[13px] text-slate-500">
                    {license.issueDate}
                  </td>
                  <td className="px-5 py-3.5 font-mono text-[13px] text-slate-500">
                    {license.expiryDate}
                  </td>
                  <td className="px-5 py-3.5">
                    <StatusBadge status={license.status} />
                  </td>
                  <td className="px-5 py-3.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        DISTRICT_COLORS[license.district] || "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {license.district}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Link
                        href={`/co-so-kinh-doanh/giay-phep/${license.id}`}   // ← Sửa từ l.id thành license.id
                        className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-indigo-50 hover:border-indigo-300 text-sm flex items-center justify-center transition-all shadow-sm"
                        title="Xem chi tiết"
                      >
                        👁
                      </Link>
                      <button
                        className="w-7 h-7 rounded-lg border border-slate-200 bg-white hover:bg-amber-50 hover:border-amber-300 text-sm flex items-center justify-center transition-all shadow-sm"
                        title="Chỉnh sửa"
                      >
                        ✏️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex items-center justify-between border-t border-slate-100 bg-slate-50/50 px-5 py-3.5">
            <span className="text-[12px] font-medium text-slate-400">
              Hiển thị <strong className="text-slate-600">{filtered.length}</strong> trong tổng số <strong className="text-slate-600">{mockLicenses.length}</strong> giấy phép
            </span>
            <div className="flex gap-1">
              {[1, 2, 3].map((p) => (
                <button
                  key={p}
                  className={`w-7 h-7 rounded-lg text-[12px] font-semibold transition-all ${
                    p === 1 ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:bg-slate-100"
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