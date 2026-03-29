'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface FormData {
  title: string;
  content: string;
  category: string;
  issueDate: string;
  effectiveDate: string;
  authority: string;
  attachment: File | null;
}

export default function NewRegulationPage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState<FormData>({
    title: '',
    content: '',
    category: 'An toàn thực phẩm',
    issueDate: '',
    effectiveDate: '',
    authority: '',
    attachment: null,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Xóa lỗi khi người dùng bắt đầu nhập
    if (errors[name as keyof FormData]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setFormData(prev => ({ ...prev, attachment: file }));
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Tiêu đề không được để trống';
    }

    if (!formData.content.trim()) {
      newErrors.content = 'Nội dung không được để trống';
    }

    if (!formData.issueDate) {
      newErrors.issueDate = 'Vui lòng chọn ngày ban hành';
    }

    if (!formData.effectiveDate) {
      newErrors.effectiveDate = 'Vui lòng chọn ngày hiệu lực';
    }

    if (!formData.authority.trim()) {
      newErrors.authority = 'Cơ quan ban hành không được để trống';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Giả lập API call
      await new Promise(resolve => setTimeout(resolve, 1200));

      console.log('Dữ liệu quy định mới:', {
        ...formData,
        attachment: formData.attachment ? formData.attachment.name : null,
      });

      alert('✅ Ban hành quy định thành công!');

      // Redirect về trang danh sách
      router.push('/quy-dinh');
    } catch (error) {
      alert('❌ Có lỗi xảy ra khi ban hành quy định');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    router.push('/quy-dinh');
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa] font-sans">
      {/* Top gradient bar */}
      <div className="h-1 w-full bg-gradient-to-r from-violet-600 via-purple-500 to-pink-400" />

      <div className="max-w-[820px] mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold tracking-[0.12em] uppercase text-violet-500">
              SỞ AN TOÀN THỰC PHẨM • ĐÀ NẴNG
            </span>
          </div>
          <h1 className="text-[28px] font-black text-slate-900 tracking-tight leading-tight">
            Quy định Pháp luật
          </h1>
          <p className="text-[13px] text-slate-400 mt-1 font-medium">
            Ban hành quy định mới
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Tiêu đề */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Tiêu đề quy định <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề quy định..."
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                disabled={isSubmitting}
              />
              {errors.title && (
                <p className="mt-1 text-[12px] text-red-500">{errors.title}</p>
              )}
            </div>

            {/* Nội dung */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                Nội dung quy định <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                placeholder="Nhập nội dung chi tiết của quy định..."
                rows={8}
                className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all resize-y min-h-[180px]"
                disabled={isSubmitting}
              />
              {errors.content && (
                <p className="mt-1 text-[12px] text-red-500">{errors.content}</p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Danh mục */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Danh mục
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all bg-white"
                  disabled={isSubmitting}
                >
                  <option value="An toàn thực phẩm">An toàn thực phẩm</option>
                  <option value="Giấy phép">Giấy phép</option>
                  <option value="Xử phạt">Xử phạt</option>
                </select>
              </div>

              {/* Cơ quan ban hành */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Cơ quan ban hành <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="authority"
                  value={formData.authority}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Sở Y tế Đà Nẵng"
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
                {errors.authority && (
                  <p className="mt-1 text-[12px] text-red-500">{errors.authority}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Ngày ban hành */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Ngày ban hành <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
                {errors.issueDate && (
                  <p className="mt-1 text-[12px] text-red-500">{errors.issueDate}</p>
                )}
              </div>

              {/* Ngày hiệu lực */}
              <div>
                <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                  Ngày hiệu lực <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-slate-200 rounded-xl text-[13px] focus:outline-none focus:ring-2 focus:ring-violet-500 focus:border-transparent transition-all"
                  disabled={isSubmitting}
                />
                {errors.effectiveDate && (
                  <p className="mt-1 text-[12px] text-red-500">{errors.effectiveDate}</p>
                )}
              </div>
            </div>

            {/* File đính kèm */}
            <div>
              <label className="block text-[13px] font-semibold text-slate-700 mb-2">
                File đính kèm
              </label>
              <div className="border border-dashed border-slate-300 rounded-xl p-6 text-center hover:border-violet-300 transition-colors">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isSubmitting}
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer flex flex-col items-center justify-center"
                >
                  <div className="w-10 h-10 bg-violet-100 rounded-full flex items-center justify-center mb-3">
                    📎
                  </div>
                  <p className="text-[13px] font-medium text-slate-600">
                    {formData.attachment ? formData.attachment.name : 'Chọn file đính kèm (PDF, DOCX, JPG...)'}
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">Kích thước tối đa 10MB</p>
                </label>
              </div>
            </div>

            {/* Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t border-slate-100">
              <button
                type="button"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="px-6 py-2.5 text-[13px] font-semibold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50"
              >
                Hủy
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-8 py-2.5 bg-violet-600 hover:bg-violet-700 disabled:bg-violet-400 text-white text-[13px] font-semibold rounded-xl transition-all shadow-sm flex items-center gap-2 min-w-[140px] justify-center"
              >
                {isSubmitting ? (
                  <>
                    <span className="animate-spin inline-block w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Đang ban hành...
                  </>
                ) : (
                  'Ban hành quy định'
                )}
              </button>
            </div>
          </form>
        </div>

        <div className="text-center mt-8">
          <p className="text-[11px] text-slate-400">
            Các trường có dấu <span className="text-red-500">*</span> là bắt buộc
          </p>
        </div>
      </div>
    </div>
  );
}