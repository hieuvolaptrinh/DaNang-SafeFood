'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { mockFeedback, CitizenFeedback } from '@/data/mockData';

const STATUS_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string; icon: string; label: string }> = {
  'open': { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-400', icon: '📬', label: 'Đang mở' },
  'in-progress': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500', icon: '🔄', label: 'Đang xử lý' },
  'resolved': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500', icon: '✓', label: 'Đã giải quyết' },
};

const TYPE_CONFIG: Record<string, { bg: string; text: string; border: string; dot: string }> = {
  'Khiếu nại vệ sinh': { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200', dot: 'bg-red-400' },
  'Hàng giả': { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-400' },
  'Ngộ độc thực phẩm': { bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-200', dot: 'bg-orange-400' },
  'Câu hỏi chung': { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' },
};

export default function PhanAnhDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [feedback, setFeedback] = useState<CitizenFeedback | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form state
  const [status, setStatus] = useState('');
  const [responseContent, setResponseContent] = useState('');

  useEffect(() => {
    const found = mockFeedback.find(f => f.id === id);
    if (found) {
      setFeedback(found);
      setStatus(found.status); // Khởi tạo trạng thái hiện tại
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex items-center justify-center">
        Đang tải...
      </div>
    );
  }

  if (!feedback) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy phản ánh</h2>
        <p className="text-slate-500 mt-2 mb-8">Phản ánh #{id} không tồn tại hoặc đã bị xóa.</p>
        <button 
          onClick={() => router.push('/phan-anh-cong-dan')}
          className="px-6 py-3 bg-violet-600 text-white rounded-2xl font-medium hover:bg-violet-700"
        >
          Quay về danh sách phản ánh
        </button>
      </div>
    );
  }

  const typeCfg = TYPE_CONFIG[feedback.type] || { bg: 'bg-slate-50', text: 'text-slate-600', border: 'border-slate-200', dot: 'bg-slate-400' };
  const currentStatusCfg = STATUS_CONFIG[status] || STATUS_CONFIG[feedback.status];

  const handleUpdate = async () => {
    if (!responseContent.trim()) {
      alert('Vui lòng nhập nội dung phản hồi trước khi cập nhật.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Giả lập gọi API lưu dữ liệu
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Cập nhật trạng thái trong state (thực tế sẽ gọi API)
      setFeedback(prev => prev ? { ...prev, status } : null);

      console.log('Cập nhật phản ánh:', {
        id: feedback.id,
        newStatus: status,
        responseContent,
        updatedAt: new Date().toISOString(),
      });

      alert('✅ Cập nhật phản ánh thành công!\nThông báo đã được gửi đến người dân.');

      // Quay về danh sách sau khi cập nhật thành công
      router.push('/phan-anh-cong-dan');
    } catch (error) {
      alert('❌ Có lỗi xảy ra khi cập nhật.');
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
            onClick={() => router.push('/phan-anh-cong-dan')}
            className="text-slate-500 hover:text-slate-700 flex items-center gap-2 text-sm font-medium"
          >
            ← Quay lại danh sách
          </button>
          <div className="h-4 w-px bg-slate-200 mx-2" />
          <span className="text-[11px] font-bold tracking-widest uppercase text-violet-500">
            SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
          </span>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-sm bg-slate-100 text-slate-500 px-3 py-1 rounded-lg font-semibold">
                #{feedback.id}
              </span>
              <span className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-2xl text-sm font-semibold border ${currentStatusCfg.bg} ${currentStatusCfg.text} ${currentStatusCfg.border}`}>
                <span>{currentStatusCfg.icon}</span> {currentStatusCfg.label}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-slate-900">Chi tiết phản ánh</h1>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Nội dung chính */}
          <div className="lg:col-span-8 space-y-6">
            {/* Thông tin người gửi */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-6 flex items-center gap-2">
                👤 Thông tin người gửi phản ánh
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Họ và tên</p>
                  <p className="text-xl font-semibold text-slate-900">{feedback.submitter}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Số điện thoại</p>
                  <p className="font-medium text-slate-800">0987 654 321</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Ngày gửi</p>
                  <p className="font-medium text-slate-800">{feedback.date}</p>
                </div>
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-400 mb-1">Loại phản ánh</p>
                  <span className={`inline-flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium border ${typeCfg.bg} ${typeCfg.text} ${typeCfg.border}`}>
                    <span className={`w-2.5 h-2.5 rounded-full ${typeCfg.dot}`} />
                    {feedback.type}
                  </span>
                </div>
              </div>
            </div>

            {/* Nội dung phản ánh */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Nội dung phản ánh</h2>
              <div className="text-[15.5px] leading-relaxed text-slate-700 whitespace-pre-line">
                {feedback.content}
              </div>
            </div>
          </div>

          {/* Sidebar - Form cập nhật */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100">
              <h3 className="font-bold text-slate-800 mb-6">Cập nhật xử lý phản ánh</h3>

              {/* Thay đổi trạng thái */}
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Trạng thái mới
                </label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500"
                  disabled={isSubmitting}
                >
                  <option value="open">Đang mở</option>
                  <option value="in-progress">Đang xử lý</option>
                  <option value="resolved">Đã giải quyết</option>
                </select>
              </div>

              {/* Nội dung phản hồi */}
              <div className="mb-6">
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Nội dung phản hồi <span className="text-red-500">*</span>
                </label>
                <textarea
                  value={responseContent}
                  onChange={(e) => setResponseContent(e.target.value)}
                  placeholder="Nhập nội dung phản hồi, hướng dẫn hoặc kết quả xử lý cho người dân..."
                  rows={7}
                  className="w-full px-4 py-3 border border-slate-200 rounded-2xl text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500 resize-y"
                  disabled={isSubmitting}
                />
              </div>

              {/* Nút hành động */}
              <div className="flex gap-3">
                <button
                  onClick={() => router.push('/phan-anh-cong-dan')}
                  disabled={isSubmitting}
                  className="flex-1 py-3 text-slate-600 font-semibold border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all"
                >
                  Hủy
                </button>

                <button
                  onClick={handleUpdate}
                  disabled={isSubmitting || !responseContent.trim()}
                  className="flex-1 py-3 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white font-semibold rounded-2xl transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <span className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                      Đang cập nhật...
                    </>
                  ) : (
                    'Cập nhật & Gửi thông báo'
                  )}
                </button>
              </div>

              <p className="text-[11px] text-slate-400 text-center mt-4">
                Thông báo thay đổi sẽ được gửi đến người dân qua ứng dụng/Zalo/SMS
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}