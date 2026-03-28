'use client';

import { useState } from 'react';
import { useRole } from '@/lib/RoleContext';   // Giả sử bạn đã có RoleContext

interface Certificate {
  id: string;
  businessName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
}

const mockCertificates: Certificate[] = [
  {
    id: 'CN-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    type: 'Chứng nhận ATTP',
    issueDate: '15/01/2025',
    expiryDate: '14/01/2026',
    status: 'approved',
    approver: 'Nguyễn Văn A',
  },
  {
    id: 'CN-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    type: 'Chứng nhận VSATTP',
    issueDate: '20/02/2025',
    expiryDate: '19/02/2026',
    status: 'pending',
    approver: '',
  },
  {
    id: 'CN-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    type: 'Chứng nhận ATTP',
    issueDate: '05/03/2025',
    expiryDate: '04/03/2026',
    status: 'rejected',
    approver: 'Trần Thị B',
  },
  {
    id: 'CN-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    type: 'Chứng nhận ATTP',
    issueDate: '10/01/2025',
    expiryDate: '09/01/2026',
    status: 'approved',
    approver: 'Lê Văn C',
  },
];

const STATUS_CONFIG = {
  approved: { label: 'Đã phê duyệt', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200' },
  pending:  { label: 'Chờ duyệt',    bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400',  border: 'border-amber-200' },
  rejected: { label: 'Từ chối',      bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500',    border: 'border-red-200' },
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

export default function PheDuyetChungNhanPage() {
  const { role } = useRole(); // Giả sử approver lấy từ role hoặc user hiện tại
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [data, setData] = useState(mockCertificates);

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCert, setSelectedCert] = useState<Certificate | null>(null);
  const [actionType, setActionType] = useState<'approved' | 'rejected' | null>(null);
  const [rejectReason, setRejectReason] = useState('');

  const filtered = data.filter((c) => {
    const matchSearch = !search ||
      c.id.toLowerCase().includes(search.toLowerCase()) ||
      c.businessName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || c.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const openActionModal = (cert: Certificate, type: 'approved' | 'rejected') => {
    setSelectedCert(cert);
    setActionType(type);
    setRejectReason('');
    setIsModalOpen(true);
  };

  const handleApproveReject = () => {
    if (!selectedCert || !actionType) return;

    const currentUser = role === 'AUTHORITY' ? 'Trần Thị Thẩm Quyền' : 'Nguyễn Văn Trần'; // Có thể lấy từ context user thật sau

    setData(prev => prev.map(item =>
      item.id === selectedCert.id
        ? {
            ...item,
            status: actionType,
            approver: currentUser
          }
        : item
    ));

    setIsModalOpen(false);
    setSelectedCert(null);
    setActionType(null);
    setRejectReason('');
  };

  const columns = [
    {
      key: 'id',
      header: 'Mã chứng nhận',
      render: (c: Certificate) => (
        <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
          {c.id}
        </span>
      ),
    },
    {
      key: 'businessName',
      header: 'Tên cơ sở',
      render: (c: Certificate) => (
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center text-sm font-black text-blue-600 flex-shrink-0">
            {c.businessName.charAt(0)}
          </div>
          <span className="font-semibold text-[13px] text-slate-800">{c.businessName}</span>
        </div>
      ),
    },
    { key: 'type', header: 'Loại chứng nhận', render: (c: Certificate) => <span className="text-slate-600">{c.type}</span> },
    { key: 'issueDate', header: 'Ngày cấp' },
    { key: 'expiryDate', header: 'Ngày hết hạn' },
    {
      key: 'status',
      header: 'Trạng thái',
      render: (c: Certificate) => <StatusBadge status={c.status} />,
    },
    {
      key: 'approver',
      header: 'Người duyệt',
      render: (c: Certificate) => (
        <span className="text-[13px] text-slate-600">
          {c.approver || <span className="text-slate-300 italic">—</span>}
        </span>
      ),
    },
    {
      key: 'actions',
      header: 'Thao tác',
      render: (c: Certificate) => {
        const isPending = c.status === 'pending';

        return (
          <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
            <button 
              className="w-8 h-8 flex items-center justify-center rounded-lg border border-slate-200 bg-white hover:bg-blue-50 hover:border-blue-300 text-base transition-all"
              title="Xem chi tiết"
            >
              👁
            </button>

            {isPending && (
              <>
                <button 
                  onClick={() => openActionModal(c, 'approved')}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-emerald-200 bg-emerald-50 hover:bg-emerald-100 hover:border-emerald-400 text-base transition-all"
                  title="Phê duyệt"
                >
                  ✅
                </button>
                <button 
                  onClick={() => openActionModal(c, 'rejected')}
                  className="w-8 h-8 flex items-center justify-center rounded-lg border border-red-200 bg-red-50 hover:bg-red-100 hover:border-red-400 text-base transition-all"
                  title="Từ chối"
                >
                  ❌
                </button>
              </>
            )}
          </div>
        );
      },
    },
  ];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400" />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-blue-500">
                SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
              </span>
            </div>
            <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">
              Phê duyệt Chứng nhận
            </h1>
            <p className="text-[13px] text-slate-400 mt-1 font-medium">
              Quản lý và phê duyệt các chứng nhận cho cơ sở kinh doanh
            </p>
          </div>

          <div className="flex gap-3 pt-1">
            <button className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white text-[13px] font-semibold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-all shadow-sm">
              📥 Xuất CSV
            </button>
            {/* Không có nút "Thêm chứng nhận" như yêu cầu */}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Tổng chứng nhận', value: '1.284', icon: '📋', color: 'from-blue-600 to-blue-700' },
            { label: 'Đã phê duyệt', value: '987', icon: '✅', color: 'from-emerald-500 to-emerald-600' },
            { label: 'Chờ duyệt', value: '156', icon: '⏳', color: 'from-amber-500 to-orange-500' },
            { label: 'Từ chối', value: '141', icon: '🚫', color: 'from-red-500 to-red-600' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2">{s.label}</p>
                  <p className="text-[30px] font-black text-slate-900 leading-none">{s.value}</p>
                </div>
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center text-xl shadow-sm`}>
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
              <h2 className="text-[15px] font-bold text-slate-800">Tất cả chứng nhận</h2>
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
                  className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-700 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 w-[240px]"
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <select
                className="px-3 py-2 rounded-xl border border-slate-200 bg-slate-50 text-[13px] text-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="">Tất cả trạng thái</option>
                <option value="pending">Chờ duyệt</option>
                <option value="approved">Đã phê duyệt</option>
                <option value="rejected">Từ chối</option>
              </select>
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Mã chứng nhận', 'Tên cơ sở', 'Loại chứng nhận', 'Ngày cấp', 'Ngày hết hạn', 'Trạng thái', 'Người duyệt', 'Thao tác'].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider whitespace-nowrap">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filtered.map((c) => (
                <tr key={c.id} className="hover:bg-blue-50/30 group transition-colors">
                  {/* Các cột render giống code cũ, nhưng dùng columns để dễ quản lý hơn nếu cần */}
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-[12px] text-slate-400 font-semibold bg-slate-100 px-2 py-0.5 rounded-md">
                      {c.id}
                    </span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-blue-100 to-cyan-200 flex items-center justify-center text-sm font-black text-blue-600 flex-shrink-0">
                        {c.businessName.charAt(0)}
                      </div>
                      <span className="font-semibold text-[13px] text-slate-800">{c.businessName}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-600">{c.type}</td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">{c.issueDate}</td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-500 font-mono">{c.expiryDate}</td>
                  <td className="px-5 py-3.5"><StatusBadge status={c.status} /></td>
                  <td className="px-5 py-3.5 text-[13px] text-slate-600">
                    {c.approver || <span className="text-slate-300 italic">—</span>}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex gap-1.5">
                      {/* Render actions từ columns logic */}
                      {columns[7].render(c)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="px-5 py-3.5 border-t border-slate-100 flex items-center justify-between bg-slate-50/50">
            <span className="text-[12px] text-slate-400 font-medium">
              Hiển thị <strong className="text-slate-600">{filtered.length}</strong> trong tổng số{' '}
              <strong className="text-slate-600">{mockCertificates.length}</strong> chứng nhận
            </span>
          </div>
        </div>
      </div>

      {/* Modal Phê duyệt / Từ chối */}
      {isModalOpen && selectedCert && actionType && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md mx-4 overflow-hidden">
            <div className="px-6 py-5 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                {actionType === 'approved' ? 'Phê duyệt chứng nhận' : 'Từ chối chứng nhận'}
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-3xl text-slate-400 hover:text-slate-600">×</button>
            </div>

            <div className="p-6 space-y-5">
              <div>
                <p className="text-sm text-slate-500">Cơ sở</p>
                <p className="font-semibold text-slate-800">{selectedCert.businessName}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500">Loại chứng nhận</p>
                <p className="font-medium">{selectedCert.type}</p>
              </div>

              {actionType === 'rejected' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Lý do từ chối <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectReason}
                    onChange={(e) => setRejectReason(e.target.value)}
                    placeholder="Nhập lý do từ chối..."
                    className="w-full h-28 border border-slate-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>
              )}
            </div>

            <div className="px-6 py-4 border-t bg-slate-50 flex gap-3 justify-end">
              <button
                onClick={() => setIsModalOpen(false)}
                className="px-5 py-2.5 text-slate-600 hover:bg-slate-100 rounded-xl font-medium"
              >
                Hủy
              </button>
              <button
                onClick={handleApproveReject}
                disabled={actionType === 'rejected' && !rejectReason.trim()}
                className={`px-6 py-2.5 font-semibold rounded-xl transition-colors ${
                  actionType === 'approved' 
                    ? 'bg-emerald-600 hover:bg-emerald-700 text-white' 
                    : 'bg-red-600 hover:bg-red-700 text-white'
                } disabled:opacity-50`}
              >
                {actionType === 'approved' ? 'Xác nhận phê duyệt' : 'Xác nhận từ chối'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}