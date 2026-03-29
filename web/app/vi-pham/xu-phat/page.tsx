"use client";

import { useState } from 'react';
import { useRole } from '@/lib/RoleContext';

interface ViolationApproval {
  id: string;
  businessName: string;
  violation: string;
  inspectionReport: string;
  proposedPenalty: string;
  date: string;
  status: 'pending' | 'approved';
}

const initialMockData: ViolationApproval[] = [
  {
    id: 'VP-2025004',
    businessName: 'Quán Bún Chả Hà Nội',
    violation: 'Bán thực phẩm không đảm bảo an toàn, sử dụng nguyên liệu không rõ nguồn gốc',
    inspectionReport: 'BB-KD-280325',
    proposedPenalty: '32.000.000 ₫',
    date: '28/03/2025',
    status: 'pending',
  },
  {
    id: 'VP-2025005',
    businessName: 'Siêu thị Mini Mart ABC',
    violation: 'Hàng hóa hết hạn vẫn bày bán trên kệ',
    inspectionReport: 'BB-KD-290325',
    proposedPenalty: '18.000.000 ₫',
    date: '29/03/2025',
    status: 'pending',
  },
  {
    id: 'VP-2025007',
    businessName: 'Nhà hàng Hải Sản Đại Dương',
    violation: 'Vi phạm vệ sinh an toàn thực phẩm mức nghiêm trọng',
    inspectionReport: 'BB-KD-300325',
    proposedPenalty: '50.000.000 ₫',
    date: '30/03/2025',
    status: 'pending',
  },
];

export default function PheDuyetDonViPhamPage() {
  const { role } = useRole();

  const [violations, setViolations] = useState<ViolationApproval[]>(initialMockData);
  const [search, setSearch] = useState('');
  const [approvingId, setApprovingId] = useState<string | null>(null);

  const pendingViolations = violations.filter(v => v.status === 'pending');

  const filteredViolations = pendingViolations.filter(v =>
    !search ||
    v.id.toLowerCase().includes(search.toLowerCase()) ||
    v.businessName.toLowerCase().includes(search.toLowerCase()) ||
    v.violation.toLowerCase().includes(search.toLowerCase())
  );

  const isAuthority = role === 'AUTHORITY';
  
  // === TEXT THEO ROLE ===
  const pageTitle = isAuthority ? 'Phê duyệt đơn vi phạm' : 'Gửi kết quả kiểm tra vi phạm';
  const pageSubtitle = isAuthority 
    ? 'Xem xét và ban hành quyết định xử phạt' 
    : 'Xử lý và gửi kết quả vi phạm đến cơ quan thẩm quyền';

  const actionText = isAuthority ? 'ban hành quyết định' : 'gửi kết quả';
  const successMessage = isAuthority 
    ? 'Đã phê duyệt và ban hành quyết định xử phạt thành công!' 
    : 'Đã gửi kết quả thành công!';

  const buttonText = isAuthority ? '✅ Phê duyệt & Ban hành' : '📤 Gửi kết quả';
  const buttonColor = isAuthority ? 'bg-emerald-600 hover:bg-emerald-700' : 'bg-blue-600 hover:bg-blue-700';

  const handleAction = async (id: string) => {
    const violation = violations.find(v => v.id === id);
    if (!violation) return;

    if (!confirm(`Bạn có chắc muốn ${actionText} cho "${violation.businessName}"?`)) {
      return;
    }

    setApprovingId(id);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));

      console.log(`[${role.toUpperCase()}] ${isAuthority ? 'Phê duyệt & Ban hành' : 'Gửi kết quả'}:`, {
        id: violation.id,
        businessName: violation.businessName,
        penalty: violation.proposedPenalty,
        actionBy: role,
        timestamp: new Date().toLocaleString('vi-VN'),
      });

      setViolations(prev => prev.filter(v => v.id !== id));

      alert(`✅ ${successMessage}`);
    } catch (error) {
      alert('❌ Có lỗi xảy ra khi thực hiện');
    } finally {
      setApprovingId(null);
    }
  };

  const handleViewDetail = (violation: ViolationApproval) => {
    alert(`Chi tiết đơn vi phạm:\n\n` +
      `Mã đơn: ${violation.id}\n` +
      `Cơ sở: ${violation.businessName}\n` +
      `Vi phạm: ${violation.violation}\n` +
      `Biên bản: ${violation.inspectionReport}\n` +
      `Mức phạt đề xuất: ${violation.proposedPenalty}\n` +
      `Ngày lập: ${violation.date}`);
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />

      <div className="max-w-[1200px] mx-auto px-6 py-8">
        {/* Header - Đổi theo role */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-violet-500">
              SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
            </span>
          </div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">
            {pageTitle}
          </h1>
          <p className="text-[13px] text-slate-400 mt-1 font-medium">
            {pageSubtitle}
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2">
                  Đơn chờ xử lý
                </p>
                <p className="text-[30px] font-black text-slate-900">{pendingViolations.length}</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-lg shadow-sm">⏳</div>
            </div>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-[12px] font-semibold text-slate-400 uppercase tracking-wide mb-2">Tổng mức phạt đề xuất</p>
                <p className="text-[30px] font-black text-slate-900">
                  {(pendingViolations.reduce((sum, v) => {
                    const num = parseInt(v.proposedPenalty.replace(/\D/g, ''), 10);
                    return sum + (isNaN(num) ? 0 : num);
                  }, 0) / 1000000).toFixed(0)}M ₫
                </p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center text-lg shadow-sm">⚖️</div>
            </div>
          </div>
        </div>

        {/* Bảng giữ nguyên cấu trúc */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <h2 className="text-[15px] font-bold text-slate-800">Đơn xử phạt chờ xử lý</h2>
              <span className="px-2 py-0.5 rounded-md bg-amber-100 text-amber-700 text-[12px] font-bold">
                {filteredViolations.length} đơn
              </span>
            </div>

            <div className="relative w-80">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              <input
                type="text"
                placeholder="Tìm theo mã đơn hoặc tên cơ sở..."
                className="pl-9 pr-4 py-2 w-full rounded-xl border border-slate-200 bg-slate-50 text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <table className="w-full">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {['Mã đơn', 'Tên cơ sở', 'Nội dung vi phạm', 'Biên bản', 'Mức phạt đề xuất', 'Ngày lập', 'Thao tác'].map((header) => (
                  <th key={header} className="px-5 py-3 text-left text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredViolations.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-16 text-center text-slate-400 text-[13px]">
                    Không có đơn vi phạm nào chờ xử lý
                  </td>
                </tr>
              ) : (
                filteredViolations.map((violation) => {
                  const isApproving = approvingId === violation.id;

                  return (
                    <tr key={violation.id} className="hover:bg-violet-50/30 transition-colors group">
                      <td className="px-5 py-4">
                        <span className="font-mono text-[12px] font-semibold bg-slate-100 px-2.5 py-1 rounded-md text-slate-500">
                          {violation.id}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="font-semibold text-slate-800">{violation.businessName}</div>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-600 max-w-[260px]">
                        <span className="line-clamp-2">{violation.violation}</span>
                      </td>
                      <td className="px-5 py-4 font-mono text-[13px] text-slate-500">
                        {violation.inspectionReport}
                      </td>
                      <td className="px-5 py-4">
                        <span className="font-bold text-slate-800">{violation.proposedPenalty}</span>
                      </td>
                      <td className="px-5 py-4 text-[13px] text-slate-500 font-mono">
                        {violation.date}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleViewDetail(violation)}
                            className="px-4 py-1.5 text-[13px] font-medium border border-slate-200 hover:bg-slate-50 rounded-xl transition-all"
                          >
                            👁 Xem chi tiết
                          </button>

                          <button
                            onClick={() => handleAction(violation.id)}
                            disabled={isApproving}
                            className={`px-5 py-1.5 text-white text-[13px] font-semibold rounded-xl transition-all flex items-center gap-2 shadow-sm ${buttonColor} disabled:opacity-70`}
                          >
                            {isApproving ? (
                              <>
                                <span className="animate-spin w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full" />
                                Đang xử lý...
                              </>
                            ) : (
                              buttonText
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        <div className="text-center mt-6 text-[12px] text-slate-400">
          Chỉ hiển thị các đơn đang chờ xử lý • Hệ thống sẽ tự động lưu lịch sử khi thực hiện
        </div>
      </div>

      <TableCard
        title="Tất cả quyết định xử phạt"
        controls={
          <>
            <SearchInput
              placeholder="Tìm mã quyết định, tên cơ sở..."
              onChange={setSearch}
            />
            <FilterSelect
              options={[
                { value: "", label: "Tất cả trạng thái" },
                { value: "pending", label: "Chưa nộp" },
                { value: "paid", label: "Đã nộp" },
                { value: "overdue", label: "Quá hạn" },
              ]}
              onChange={setStatusFilter}
            />
            <FilterSelect
              options={[
                { value: "", label: "Tất cả quận/huyện" },
                ...districts.map((d) => ({ value: d, label: d })),
              ]}
              onChange={setDistrictFilter}
            />
          </>
        }
        footer={
          <Pagination
            info={`Hiển thị 1–${filtered.length} trong tổng số ${mockPenalties.length} quyết định`}
          />
        }
      >
        <DataTable
          columns={columns}
          data={filtered}
          emptyMessage="Không tìm thấy quyết định xử phạt nào"
        />
      </TableCard>
    </div>
  );
}
