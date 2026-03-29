'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

interface LegalStatus {
  id: string;
  businessName: string;
  violationType: string;
  severity: 'nhẹ' | 'trung bình' | 'nghiêm trọng';
  processingStatus: string;
  updatedDate: string;
}

const mockLegalStatuses: LegalStatus[] = [
  {
    id: 'CS-001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    violationType: 'Vi phạm vệ sinh an toàn thực phẩm',
    severity: 'nghiêm trọng',
    processingStatus: 'Đang xử lý',
    updatedDate: '20/03/2025',
  },
  {
    id: 'CS-002',
    businessName: 'Quán Ăn Gia Đình Việt',
    violationType: 'Không niêm yết giá',
    severity: 'nhẹ',
    processingStatus: 'Đã hoàn tất',
    updatedDate: '15/03/2025',
  },
  {
    id: 'CS-003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    violationType: 'Sử dụng nguyên liệu không rõ nguồn gốc',
    severity: 'trung bình',
    processingStatus: 'Đang xử lý',
    updatedDate: '25/03/2025',
  },
  {
    id: 'CS-004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    violationType: 'Hạn sử dụng sản phẩm',
    severity: 'nhẹ',
    processingStatus: 'Đã hoàn tất',
    updatedDate: '10/03/2025',
  },
];

const SEVERITY_CONFIG = {
  'nghiêm trọng': {
    label: 'Nghiêm trọng',
    bg: 'bg-red-50',
    text: 'text-red-700',
    dot: 'bg-red-500',
    border: 'border-red-200',
    icon: '🚨',
  },
  'trung bình': {
    label: 'Trung bình',
    bg: 'bg-amber-50',
    text: 'text-amber-700',
    dot: 'bg-amber-400',
    border: 'border-amber-200',
    icon: '⚠️',
  },
  'nhẹ': {
    label: 'Nhẹ',
    bg: 'bg-sky-50',
    text: 'text-sky-700',
    dot: 'bg-sky-400',
    border: 'border-sky-200',
    icon: '⚡',
  },
};

const PROCESSING_CONFIG: Record<string, { bg: string; text: string; icon: string; label: string }> = {
  'Đang xử lý': { bg: 'bg-amber-50', text: 'text-amber-700', icon: '🔄', label: 'Đang xử lý' },
  'Đã hoàn tất': { bg: 'bg-emerald-50', text: 'text-emerald-700', icon: '✓', label: 'Đã hoàn tất' },
};

export default function PhapLyDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [record, setRecord] = useState<LegalStatus | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockLegalStatuses.find(item => item.id === id);
    setRecord(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">Đang tải...</div>;
  }

  if (!record) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy hồ sơ</h2>
        <p className="text-slate-500 mt-2 mb-8">Hồ sơ pháp lý mã <span className="font-mono">{id}</span> không tồn tại.</p>
        <Link
          href="/phap-ly"
          className="px-6 py-3 bg-violet-600 text-white rounded-2xl font-medium hover:bg-violet-700 transition"
        >
          Quay về danh sách
        </Link>
      </div>
    );
  }

  const severityCfg = SEVERITY_CONFIG[record.severity];
  const processingCfg = PROCESSING_CONFIG[record.processingStatus] || { bg: 'bg-slate-50', text: 'text-slate-600', icon: '•', label: record.processingStatus };

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

        <div className="flex flex-col lg:flex-row justify-between gap-6 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-semibold">
                {record.id}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-sm font-semibold border ${processingCfg.bg} ${processingCfg.text}`}>
                <span>{processingCfg.icon}</span> {processingCfg.label}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {record.businessName}
            </h1>
          </div>

          <div className="flex gap-3">
            <button className="px-5 py-3 border border-slate-300 rounded-2xl text-sm font-medium hover:bg-white transition">
              📄 In biên bản
            </button>
            <button className="px-6 py-3 bg-violet-600 hover:bg-violet-700 text-white rounded-2xl text-sm font-semibold transition flex items-center gap-2">
              ✏️ Cập nhật xử lý
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
                  <p className="text-[17px] leading-relaxed text-slate-700">{record.violationType}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Mức độ vi phạm</p>
                    <span className={`inline-flex items-center gap-2 px-5 py-3 rounded-2xl text-base font-semibold border ${severityCfg.bg} ${severityCfg.text} ${severityCfg.border}`}>
                      <span className={`w-3 h-3 rounded-full ${severityCfg.dot}`} />
                      {severityCfg.label}
                    </span>
                  </div>
                  <div>
                    <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Ngày cập nhật</p>
                    <p className="text-2xl font-semibold text-slate-900">{record.updatedDate}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Mô tả chi tiết vi phạm</h2>
              <div className="prose text-slate-700 text-[15.5px] leading-relaxed">
                Cơ sở {record.businessName} bị ghi nhận vi phạm {record.violationType.toLowerCase()}. 
                Vi phạm này thuộc mức độ <span className="font-semibold">{severityCfg.label.toLowerCase()}</span> theo quy định hiện hành.
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-5">Trạng thái xử lý</h3>
              <div className={`inline-flex items-center gap-3 px-6 py-4 rounded-3xl ${processingCfg.bg} ${processingCfg.text} border border-current/10`}>
                <span className="text-2xl">{processingCfg.icon}</span>
                <div>
                  <p className="font-semibold">{processingCfg.label}</p>
                  <p className="text-xs opacity-75">Cập nhật lần cuối: {record.updatedDate}</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-7 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-700 mb-5">Thông tin cơ sở</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Tên cơ sở</p>
                  <p className="font-medium text-slate-900">{record.businessName}</p>
                </div>
                <div>
                  <p className="text-slate-400 text-xs uppercase tracking-widest">Địa chỉ</p>
                  <p className="text-slate-700">123 Nguyễn Thị Minh Khai, Hải Châu, Đà Nẵng</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}