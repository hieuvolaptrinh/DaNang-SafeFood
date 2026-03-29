'use client';


import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface FoodSafetyWarning {
  id: string;
  businessName: string;
  warningType: string;
  level: 'thấp' | 'trung bình' | 'cao';
  issueDate: string;
  expiryDate: string;
  status: 'active' | 'resolved' | 'expired';
  district: string;
}

const mockWarnings: FoodSafetyWarning[] = [
  {
    id: 'CB-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    warningType: 'Cảnh báo ô nhiễm vi sinh',
    level: 'cao',
    issueDate: '20/03/2025',
    expiryDate: '19/04/2025',
    status: 'active',
    district: 'Hải Châu',
  },
  {
    id: 'CB-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    warningType: 'Cảnh báo hạn sử dụng',
    level: 'trung bình',
    issueDate: '15/03/2025',
    expiryDate: '14/04/2025',
    status: 'resolved',
    district: 'Thanh Khê',
  },
  {
    id: 'CB-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    warningType: 'Cảnh báo nguồn gốc xuất xứ',
    level: 'thấp',
    issueDate: '25/03/2025',
    expiryDate: '24/04/2025',
    status: 'active',
    district: 'Ngũ Hành Sơn',
  },
  {
    id: 'CB-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    warningType: 'Cảnh báo hóa chất bảo quản',
    level: 'cao',
    issueDate: '18/03/2025',
    expiryDate: '17/04/2025',
    status: 'active',
    district: 'Sơn Trà',
  },
];

const LEVEL_CONFIG = {
  cao:        { label: 'Cao',        bg: 'bg-red-50',    text: 'text-red-700',    dot: 'bg-red-500',    border: 'border-red-200', icon: '🔴' },
  'trung bình': { label: 'Trung bình', bg: 'bg-amber-50',  text: 'text-amber-700',  dot: 'bg-amber-400',  border: 'border-amber-200', icon: '⚠️' },
  thấp:       { label: 'Thấp',       bg: 'bg-sky-50',    text: 'text-sky-700',    dot: 'bg-sky-400',    border: 'border-sky-200', icon: '⚡' },
};

const STATUS_CONFIG = {
  active:   { label: 'Đang hiệu lực', bg: 'bg-red-50',     text: 'text-red-700',     dot: 'bg-red-500',     border: 'border-red-200',     icon: '🔴' },
  resolved: { label: 'Đã xử lý',     bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200', icon: '✓' },
  expired:  { label: 'Hết hiệu lực', bg: 'bg-slate-50',   text: 'text-slate-500',   dot: 'bg-slate-400',   border: 'border-slate-200',   icon: '⏹' },
};

export default function CanhBaoDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [warning, setWarning] = useState<FoodSafetyWarning | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockWarnings.find(w => w.id === id);
    setWarning(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">Đang tải...</div>;
  }

  if (!warning) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy cảnh báo</h2>
        <p className="text-slate-500 mt-2 mb-8">Cảnh báo mã <span className="font-mono">{id}</span> không tồn tại.</p>
        <Link
          href="/canh-bao"
          className="px-6 py-3 bg-violet-600 text-white rounded-2xl font-medium hover:bg-violet-700 transition"
        >
          Quay về danh sách cảnh báo
        </Link>
      </div>
    );
  }

  const levelCfg = LEVEL_CONFIG[warning.level];
  const statusCfg = STATUS_CONFIG[warning.status];

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
                {warning.id}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-sm font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                <span>{statusCfg.icon}</span> {statusCfg.label}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {warning.businessName}
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-3 border border-slate-300 rounded-2xl text-sm font-medium hover:bg-white transition">
              📄 In cảnh báo
            </button>
            <button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-sm font-semibold transition">
              Cập nhật trạng thái
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Thông tin cảnh báo</h2>
              <div className="space-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Loại cảnh báo</p>
                  <p className="text-[17px] leading-relaxed text-slate-700">{warning.warningType}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Mức độ</p>
                    <span className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-base font-semibold border ${levelCfg.bg} ${levelCfg.text} ${levelCfg.border}`}>
                      <span className={`w-3 h-3 rounded-full ${levelCfg.dot}`} />
                      {levelCfg.label}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Ngày ban hành</p>
                    <p className="text-2xl font-semibold text-slate-900">{warning.issueDate}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Hiệu lực đến</p>
                    <p className="text-2xl font-semibold text-slate-900">{warning.expiryDate}</p>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Quận/Huyện</p>
                    <span className="inline-flex px-4 py-2 rounded-2xl text-sm font-semibold bg-slate-100 text-slate-700">
                      {warning.district}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Ghi chú cảnh báo</h2>
              <p className="text-slate-600 leading-relaxed">
                Cảnh báo này được ban hành nhằm yêu cầu cơ sở khẩn trương khắc phục vi phạm và báo cáo kết quả về Sở An toàn Thực phẩm Đà Nẵng trước ngày hết hiệu lực.
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-5">Trạng thái hiện tại</h3>
              <div className={`p-6 rounded-3xl ${statusCfg.bg} ${statusCfg.text} border ${statusCfg.border}`}>
                <div className="flex items-center gap-4 text-4xl mb-3">
                  {statusCfg.icon}
                </div>
                <p className="text-2xl font-semibold">{statusCfg.label}</p>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-5">Thông tin cơ sở</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Tên cơ sở</p>
                  <p className="font-medium text-slate-900">{warning.businessName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Địa chỉ</p>
                  <p className="text-slate-700">123 Nguyễn Thị Minh Khai, {warning.district}, Đà Nẵng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}