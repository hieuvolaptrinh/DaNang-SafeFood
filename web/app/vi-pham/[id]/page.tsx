'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface Violation {
  id: string;
  businessName: string;
  violationType: string;
  severity: 'nhẹ' | 'trung bình' | 'nghiêm trọng';
  detectedDate: string;
  status: 'pending' | 'processing' | 'resolved';
  district: string;
}

const mockViolations: Violation[] = [
  {
    id: 'VP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh an toàn thực phẩm',
    severity: 'nghiêm trọng',
    detectedDate: '18/03/2025',
    status: 'processing',
    district: 'Hải Châu',
  },
  {
    id: 'VP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá bán',
    severity: 'nhẹ',
    detectedDate: '15/03/2025',
    status: 'resolved',
    district: 'Thanh Khê',
  },
  {
    id: 'VP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng chất cấm trong thực phẩm',
    severity: 'nghiêm trọng',
    detectedDate: '22/03/2025',
    status: 'pending',
    district: 'Ngũ Hành Sơn',
  },
  {
    id: 'VP-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    violationType: 'Bán hàng hết hạn sử dụng',
    severity: 'trung bình',
    detectedDate: '20/03/2025',
    status: 'processing',
    district: 'Sơn Trà',
  },
];

const SEVERITY_CONFIG = {
  'nghiêm trọng': { label: 'Nghiêm trọng', bg: 'bg-red-50',   text: 'text-red-700',   dot: 'bg-red-500',   border: 'border-red-200', icon: '🚨' },
  'trung bình':   { label: 'Trung bình',   bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', border: 'border-amber-200', icon: '⚠️' },
  'nhẹ':          { label: 'Nhẹ',          bg: 'bg-sky-50',   text: 'text-sky-700',   dot: 'bg-sky-400',   border: 'border-sky-200', icon: '⚡' },
};

const STATUS_CONFIG = {
  pending:    { label: 'Chưa xử lý', bg: 'bg-slate-50',   text: 'text-slate-600',   icon: '⏸', dot: 'bg-slate-400',   border: 'border-slate-200' },
  processing: { label: 'Đang xử lý', bg: 'bg-blue-50',    text: 'text-blue-700',    icon: '🔄', dot: 'bg-blue-500',    border: 'border-blue-200' },
  resolved:   { label: 'Đã xử lý',   bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '✓',  dot: 'bg-emerald-500', border: 'border-emerald-200' },
};

export default function DanhSachViPhamDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [violation, setViolation] = useState<Violation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockViolations.find(v => v.id === id);
    setViolation(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">Đang tải...</div>;
  }

  if (!violation) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy vi phạm</h2>
        <p className="text-slate-500 mt-2 mb-8">Vi phạm mã <span className="font-mono">{id}</span> không tồn tại.</p>
        <Link
          href="/danh-sach-vi-pham"
          className="px-6 py-3 bg-violet-600 text-white rounded-2xl font-medium hover:bg-violet-700 transition"
        >
          Quay về danh sách vi phạm
        </Link>
      </div>
    );
  }

  const sevCfg = SEVERITY_CONFIG[violation.severity];
  const statCfg = STATUS_CONFIG[violation.status];

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
                {violation.id}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-sm font-semibold border ${statCfg.bg} ${statCfg.text} ${statCfg.border}`}>
                <span>{statCfg.icon}</span> {statCfg.label}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {violation.businessName}
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-3 border border-slate-300 rounded-2xl text-sm font-medium hover:bg-white transition">
              📄 In biên bản vi phạm
            </button>
            <button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-sm font-semibold transition">
              Cập nhật xử lý
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Thông tin vi phạm</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Loại vi phạm</p>
                  <p className="text-[17px] leading-relaxed text-slate-700">{violation.violationType}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Mức độ</p>
                    <span className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-base font-semibold border ${sevCfg.bg} ${sevCfg.text} ${sevCfg.border}`}>
                      <span className={`w-3 h-3 rounded-full ${sevCfg.dot}`} />
                      {sevCfg.label}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Ngày phát hiện</p>
                    <p className="text-2xl font-semibold text-slate-900">{violation.detectedDate}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Quận/Huyện</p>
                    <span className="inline-flex px-4 py-2 rounded-2xl text-sm font-semibold bg-slate-100 text-slate-700">
                      {violation.district}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Mô tả chi tiết</h2>
              <div className="prose text-[15.5px] text-slate-700 leading-relaxed">
                Vi phạm được ghi nhận tại cơ sở {violation.businessName} vào ngày {violation.detectedDate}. 
                Đây là vi phạm thuộc mức độ <span className="font-semibold">{sevCfg.label.toLowerCase()}</span>.
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-5">Trạng thái xử lý</h3>
              <div className={`p-6 rounded-3xl ${statCfg.bg} ${statCfg.text} border ${statCfg.border}`}>
                <div className="flex items-center gap-4 text-4xl mb-3">
                  {statCfg.icon}
                </div>
                <p className="text-2xl font-semibold">{statCfg.label}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-5">Thông tin cơ sở</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Tên cơ sở</p>
                  <p className="font-medium text-slate-900">{violation.businessName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Địa chỉ</p>
                  <p className="text-slate-700">123 Nguyễn Thị Minh Khai, {violation.district}, Đà Nẵng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
