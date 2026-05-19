'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { PageHeader, SectionCard, GovBtn } from '@/components/GovUI';

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

    if (!formData.title.trim()) newErrors.title = 'Tiêu đề không được để trống';
    if (!formData.content.trim()) newErrors.content = 'Nội dung không được để trống';
    if (!formData.issueDate) newErrors.issueDate = 'Vui lòng chọn ngày ban hành';
    if (!formData.effectiveDate) newErrors.effectiveDate = 'Vui lòng chọn ngày hiệu lực';
    if (!formData.authority.trim()) newErrors.authority = 'Cơ quan ban hành không được để trống';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      console.log('✅ Ban hành quy định:', {
        ...formData,
        attachment: formData.attachment?.name || null,
      });

      alert('✅ Ban hành quy định thành công!');
      router.push('/quy-dinh');
    } catch (error) {
      alert('❌ Có lỗi xảy ra');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-16">
      <PageHeader
        title="Ban hành quy định mới"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng"
        actions={
          <Link href="/truyen-thong/quy-dinh">
            <GovBtn variant="secondary">
              <ArrowLeft size={16} /> Quay lại
            </GovBtn>
          </Link>
        }
      />

      <div className="max-w-[900px] mx-auto px-6 pt-8">
        <SectionCard title="Thông tin quy định" className="shadow-sm">
          <form onSubmit={handleSubmit} className="p-8 space-y-8">
            
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                Tiêu đề quy định <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="Nhập tiêu đề quy định..."
                className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3 text-sm"
                disabled={isSubmitting}
              />
              {errors.title && <p className="mt-1 text-sm text-red-500">{errors.title}</p>}
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                Nội dung quy định <span className="text-red-500">*</span>
              </label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                rows={10}
                placeholder="Nhập nội dung chi tiết của quy định..."
                className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-4 text-sm resize-y min-h-[220px]"
                disabled={isSubmitting}
              />
              {errors.content && <p className="mt-1 text-sm text-red-500">{errors.content}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                  Danh mục
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3 text-sm bg-white"
                  disabled={isSubmitting}
                >
                  <option value="An toàn thực phẩm">An toàn thực phẩm</option>
                  <option value="Giấy phép">Giấy phép</option>
                  <option value="Xử phạt">Xử phạt vi phạm</option>
                  <option value="Vệ sinh">Vệ sinh môi trường</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                  Cơ quan ban hành <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="authority"
                  value={formData.authority}
                  onChange={handleInputChange}
                  placeholder="Ví dụ: Chi cục An toàn Thực phẩm TP. Đà Nẵng"
                  className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3 text-sm"
                  disabled={isSubmitting}
                />
                {errors.authority && <p className="mt-1 text-sm text-red-500">{errors.authority}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                  Ngày ban hành <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="issueDate"
                  value={formData.issueDate}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3 text-sm"
                  disabled={isSubmitting}
                />
                {errors.issueDate && <p className="mt-1 text-sm text-red-500">{errors.issueDate}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                  Ngày hiệu lực <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="effectiveDate"
                  value={formData.effectiveDate}
                  onChange={handleInputChange}
                  className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3 text-sm"
                  disabled={isSubmitting}
                />
                {errors.effectiveDate && <p className="mt-1 text-sm text-red-500">{errors.effectiveDate}</p>}
              </div>
            </div>

            {/* File đính kèm */}
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                File đính kèm
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-green-400 rounded-2xl p-8 text-center transition-all">
                <input
                  type="file"
                  onChange={handleFileChange}
                  className="hidden"
                  id="file-upload"
                  disabled={isSubmitting}
                />
                <label htmlFor="file-upload" className="cursor-pointer block">
                  <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-3 text-2xl">
                    📎
                  </div>
                  <p className="font-medium text-slate-700">
                    {formData.attachment ? formData.attachment.name : 'Chọn file đính kèm'}
                  </p>
                  <p className="text-xs text-slate-400 mt-1">PDF, Word, JPG (tối đa 10MB)</p>
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t">
              <GovBtn 
                variant="secondary" 
                onClick={() => router.push('/quy-dinh')}
                disabled={isSubmitting}
              >
                Hủy
              </GovBtn>

              <GovBtn 
                variant="primary" 
                type="submit"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Đang ban hành...' : 'Ban hành quy định'}
              </GovBtn>
            </div>
          </form>
        </SectionCard>
      </div>
    </div>
  );
}