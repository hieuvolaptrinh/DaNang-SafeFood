'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface BusinessProfile {
  id: string;
  businessName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
  legalStatus: 'active' | 'expired' | 'suspended' | 'revoked';
}

const mockCertificates: BusinessProfile[] = [
  {
    id: 'CN-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    type: 'Chứng nhận ATTP',
    issueDate: '15/01/2025',
    expiryDate: '14/01/2026',
    status: 'approved',
    approver: 'Nguyễn Văn A',
    legalStatus: 'active',
  },
  {
    id: 'CN-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    type: 'Chứng nhận VSATTP',
    issueDate: '20/02/2025',
    expiryDate: '19/02/2026',
    status: 'pending',
    approver: '',
    legalStatus: 'active',
  },
  // ... các bản ghi khác
];

const STATUS_CONFIG = {
  approved: { label: 'Đã phê duyệt', bg: 'bg-emerald-50', text: 'text-emerald-700', dot: 'bg-emerald-500', border: 'border-emerald-200', icon: '✅' },
  pending: { label: 'Chờ duyệt', bg: 'bg-amber-50', text: 'text-amber-700', dot: 'bg-amber-400', border: 'border-amber-200', icon: '⏳' },
  rejected: { label: 'Từ chối', bg: 'bg-red-50', text: 'text-red-700', dot: 'bg-red-500', border: 'border-red-200', icon: '❌' },
};

const ACTION_CONFIG = {
  'Cấp mới': { label: 'Cấp mới', color: 'bg-emerald-600 hover:bg-emerald-700', icon: '📋' },
  'Gia hạn': { label: 'Gia hạn', color: 'bg-blue-600 hover:bg-blue-700', icon: '🔄' },
  'Thu hồi': { label: 'Thu hồi', color: 'bg-red-600 hover:bg-red-700', icon: '⚠️' },
};

export default function BusinessCertificateDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [certificate, setCertificate] = useState<BusinessProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedAction, setSelectedAction] = useState<'Cấp mới' | 'Gia hạn' | 'Thu hồi' | ''>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [note, setNote] = useState('');

  useEffect(() => {
    const found = mockCertificates.find(c => c.id === id);
    setCertificate(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">Đang tải...</div>;
  }

  if (!certificate) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy hồ sơ</h2>
        <p className="text-slate-500 mt-2 mb-8">Hồ sơ mã <span className="font-mono">{id}</span> không tồn tại.</p>
        <button
          onClick={() => router.push('/phe-duyet-chung-nhan')}
          className="px-6 py-3 bg-violet-600 text-white rounded-2xl font-medium hover:bg-violet-700"
        >
          Quay về danh sách hồ sơ
        </button>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[certificate.status];

  const handleAction = async () => {
    if (!selectedAction) {
      alert('Vui lòng chọn một thao tác (Cấp mới, Gia hạn hoặc Thu hồi)');
      return;
    }

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200)); // Giả lập API

      // Cập nhật trạng thái pháp lý
      const newLegalStatus = selectedAction === 'Thu hồi' ? 'revoked' :
                            selectedAction === 'Gia hạn' ? 'active' : 'active';

      console.log('Quyết định được thực hiện:', {
        certificateId: certificate.id,
        action: selectedAction,
        newLegalStatus,
        note: note.trim() || 'Không có ghi chú',
        performedAt: new Date().toISOString(),
      });

      alert(`✅ ${selectedAction} thành công!\nTình trạng pháp lý của cơ sở đã được cập nhật.`);

      // Quay về danh sách sau khi thực hiện
      router.push('/phe-duyet-chung-nhan');
    } catch (error) {
      alert('❌ Có lỗi xảy ra khi thực hiện thao tác.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />

      <div className="max-w-[1100px] mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-3 mb-8">
          <button
            onClick={() => router.push('/phe-duyet-chung-nhan')}
            className="text-slate-500 hover:text-slate-700 flex items-center gap-2 text-sm font-medium"
          >
            ← Quay lại danh sách hồ sơ
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
                {certificate.id}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-sm font-semibold border ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}>
                <span className="text-base">{statusCfg.icon}</span> {statusCfg.label}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">
              {certificate.businessName}
            </h1>
            <p className="text-slate-500 mt-1">{certificate.type}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Thông tin chính */}
          <div className="lg:col-span-8 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6">Thông tin hồ sơ thẩm định</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Ngày cấp</p>
                  <p className="text-2xl font-semibold text-slate-900">{certificate.issueDate}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Ngày hết hạn</p>
                  <p className="text-2xl font-semibold text-slate-900">{certificate.expiryDate}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Loại chứng nhận</p>
                  <p className="text-xl font-medium text-slate-700">{certificate.type}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Người thẩm định</p>
                  <p className="text-xl font-medium text-slate-800">
                    {certificate.approver || 'Chưa có người thẩm định'}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Kết quả thẩm định</h2>
              <p className="text-slate-600 leading-relaxed">
                Hồ sơ đã được thẩm định đầy đủ theo quy định tại Nghị định 15/2018/NĐ-CP và Thông tư hướng dẫn của Bộ Y tế.
              </p>
            </div>
          </div>

          {/* Sidebar - Thao tác pháp lý */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6">Thao tác pháp lý</h3>

              <div className="space-y-3 mb-8">
                {(['Cấp mới', 'Gia hạn', 'Thu hồi'] as const).map((action) => (
                  <button
                    key={action}
                    onClick={() => setSelectedAction(action)}
                    className={`w-full flex items-center gap-3 px-5 py-4 rounded-2xl border transition-all text-left ${
                      selectedAction === action
                        ? 'border-violet-500 bg-violet-50'
                        : 'border-slate-200 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-2xl">{ACTION_CONFIG[action].icon}</span>
                    <div>
                      <p className="font-semibold text-slate-900">{action}</p>
                      <p className="text-xs text-slate-500">
                        {action === 'Thu hồi' ? 'Thu hồi giấy chứng nhận' : `${action} giấy chứng nhận`}
                      </p>
                    </div>
                  </button>
                ))}
              </div>

              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Ghi chú / Lý do
                </label>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Nhập lý do hoặc ghi chú cho quyết định..."
                  rows={4}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
                  disabled={isSubmitting}
                />
              </div>

              <button
                onClick={handleAction}
                disabled={!selectedAction || isSubmitting}
                className={`w-full py-3.5 rounded-2xl font-semibold text-white transition-all flex items-center justify-center gap-2 ${
                  selectedAction === 'Thu hồi'
                    ? 'bg-red-600 hover:bg-red-700'
                    : 'bg-violet-600 hover:bg-violet-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Đang xử lý...
                  </>
                ) : (
                  `Xác nhận ${selectedAction || 'thao tác'}`
                )}
              </button>

              <p className="text-center text-[11px] text-slate-400 mt-4">
                Hệ thống sẽ tự động cập nhật tình trạng pháp lý và lưu lịch sử quyết định
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}