'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

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

export default function XuPhatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [penalty, setPenalty] = useState<Penalty | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockPenalties.find(p => p.id === id);
    setPenalty(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">Đang tải...</div>;
  }

  if (!penalty) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy quyết định xử phạt</h2>
        <p className="text-slate-500 mt-2 mb-8">Quyết định mã <span className="font-mono">{id}</span> không tồn tại.</p>
        <Link
          href="/xu-phat"
          className="px-6 py-3 bg-violet-600 text-white rounded-2xl font-medium hover:bg-violet-700 transition"
        >
          Quay về danh sách xử phạt
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[penalty.status];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.back()}
            className="text-slate-500 hover:text-slate-700 flex items-center gap-2 text-sm font-medium"
          >
            ← Quay lại danh sách
          </button>
          <div className="h-4 w-px bg-slate-200 mx-2" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-violet-500">
            SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
          </span>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-semibold">
                {penalty.id}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-sm font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                <span className="text-base">{statusCfg.icon}</span>
                {statusCfg.label}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {penalty.businessName}
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-3 border border-slate-300 rounded-2xl text-sm font-medium hover:bg-white transition">
              📄 In quyết định xử phạt
            </button>
            <button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-sm font-semibold transition">
              Cập nhật tình trạng
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Thông tin quyết định xử phạt</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Loại vi phạm</p>
                  <p className="text-[17px] leading-relaxed text-slate-700">{penalty.violationType}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Mức phạt</p>
                  <p className="text-3xl font-bold text-slate-900 tracking-tight">{penalty.penaltyAmount}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Ngày quyết định</p>
                  <p className="text-2xl font-semibold text-slate-900">{penalty.decisionDate}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Quận/Huyện</p>
                  <span className="inline-flex px-4 py-2 rounded-2xl text-sm font-semibold bg-slate-100 text-slate-700">
                    {penalty.district}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Ghi chú</h2>
              <p className="text-slate-600 leading-relaxed">
                Quyết định xử phạt hành chính theo Nghị định 128/2020/NĐ-CP. 
                Cơ sở phải thực hiện nộp phạt trong thời hạn quy định.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-5">Trạng thái thanh toán</h3>
              <div className={`p-6 rounded-3xl ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
                <div className="flex items-center gap-4 text-4xl mb-3">
                  {statusCfg.icon}
                </div>
                <p className="text-2xl font-semibold">{statusCfg.label}</p>
                {penalty.status === 'paid' && (
                  <p className="text-sm mt-2">Đã nộp ngày {penalty.decisionDate}</p>
                )}
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-5">Thông tin cơ sở</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Tên cơ sở</p>
                  <p className="font-medium text-slate-900">{penalty.businessName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Địa chỉ</p>
                  <p className="text-slate-700">123 Nguyễn Thị Minh Khai, {penalty.district}, Đà Nẵng</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Số tiền phải nộp</p>
                  <p className="text-2xl font-bold text-slate-800">{penalty.penaltyAmount}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}