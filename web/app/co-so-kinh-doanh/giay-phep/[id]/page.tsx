'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
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
    id: 'GP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '10/01/2025',
    expiryDate: '09/01/2026',
    status: 'valid',
    district: 'Hải Châu',
  },
  {
    id: 'GP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    type: 'Giấy phép VSATTP',
    issueDate: '15/02/2025',
    expiryDate: '14/02/2025',
    status: 'expired',
    district: 'Thanh Khê',
  },
  {
    id: 'GP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '20/03/2025',
    expiryDate: '19/03/2026',
    status: 'valid',
    district: 'Ngũ Hành Sơn',
  },
  {
    id: 'GP-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '05/01/2025',
    expiryDate: '04/01/2026',
    status: 'revoked',
    district: 'Sơn Trà',
  },
];

const STATUS_CONFIG = {
  valid: { label: 'Còn hiệu lực', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200', icon: '✅' },
  expired: { label: 'Hết hạn', bg: 'bg-slate-100', text: 'text-slate-500', dot: 'bg-slate-400', border: 'border-slate-200', icon: '⌛' },
  revoked: { label: 'Đã thu hồi', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', border: 'border-red-200', icon: '🚫' },
};

export default function GiayPhepDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockLicenses.find(l => l.id === id);
    setLicense(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (!license) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy giấy phép</h2>
        <p className="text-slate-500 mt-2 mb-8">Giấy phép mã <span className="font-mono">#{id}</span> không tồn tại.</p>
        <Link
          href="/giay-phep"
          className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-medium hover:bg-indigo-700 transition"
        >
          Quay về danh sách giấy phép
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[license.status];

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-indigo-600 via-blue-500 to-teal-400" />

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
          <span className="text-[11px] font-bold tracking-widest uppercase text-indigo-500">
            SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
          </span>
        </div>

        <div className="flex flex-col lg:flex-row justify-between items-start gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-semibold">
                {license.id}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-sm font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                <span>{statusCfg.icon}</span> {statusCfg.label}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {license.businessName}
            </h1>
            <p className="text-slate-500 mt-1">{license.type}</p>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-3 border border-slate-300 rounded-2xl text-sm font-medium hover:bg-white transition">
              📄 In giấy phép
            </button>
            <button className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl text-sm font-semibold transition flex items-center gap-2">
              ✏️ Gia hạn / Chỉnh sửa
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Thông tin giấy phép</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Ngày cấp</p>
                  <p className="text-2xl font-semibold text-slate-900">{license.issueDate}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Ngày hết hạn</p>
                  <p className={`text-2xl font-semibold ${license.status === 'expired' ? 'text-red-600' : 'text-slate-900'}`}>
                    {license.expiryDate}
                  </p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Quận/Huyện</p>
                  <span className={`inline-flex px-4 py-2 rounded-2xl text-sm font-semibold ${license.district === 'Hải Châu' ? 'bg-blue-100 text-blue-700' : license.district === 'Thanh Khê' ? 'bg-violet-100 text-violet-700' : license.district === 'Ngũ Hành Sơn' ? 'bg-teal-100 text-teal-700' : 'bg-orange-100 text-orange-700'}`}>
                    {license.district}
                  </span>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Trạng thái</p>
                  <span className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-base font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                    <span className={`w-3 h-3 rounded-full ${statusCfg.dot}`} />
                    {statusCfg.label}
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Ghi chú / Thông tin bổ sung</h2>
              <p className="text-slate-600 leading-relaxed">
                Giấy phép này được cấp theo quy định của Luật An toàn thực phẩm 2010 (sửa đổi, bổ sung). 
                Cơ sở kinh doanh cam kết tuân thủ nghiêm ngặt các quy định về vệ sinh an toàn thực phẩm.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-5">Thông tin liên hệ</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Tên cơ sở</p>
                  <p className="font-medium text-slate-900">{license.businessName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Địa chỉ</p>
                  <p className="text-slate-700">123 Nguyễn Thị Minh Khai, {license.district}, Đà Nẵng</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Số điện thoại</p>
                  <p className="font-medium text-slate-800">0236 123 4567</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-4">Lịch sử giấy phép</h3>
              <div className="text-sm space-y-5">
                <div className="flex gap-4">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 text-xs font-bold">✓</div>
                  <div>
                    <p>Giấy phép được cấp lần đầu</p>
                    <p className="text-xs text-slate-400 mt-0.5">{license.issueDate}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}