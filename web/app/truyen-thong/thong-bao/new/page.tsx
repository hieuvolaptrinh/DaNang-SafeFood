'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { PageHeader, SectionCard, GovBtn } from '@/components/GovUI';

export default function CreateNotificationPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    title: '',
    content: '',
    type: '',
    target: '',
    sendDate: '',
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!form.title.trim()) return alert('Vui lòng nhập tiêu đề');
    if (!form.content.trim()) return alert('Vui lòng nhập nội dung');
    if (!form.target) return alert('Vui lòng chọn đối tượng');

    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      console.log('Gửi thông báo:', form);
      alert('✅ Gửi thông báo thành công!');
      router.push('/thong-bao');
    } catch (error) {
      alert('❌ Có lỗi xảy ra');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-16">
      <PageHeader
        title="Tạo thông báo mới"
        subtitle="Gửi thông báo đến cơ sở kinh doanh"
        actions={
          <Link href="/truyen-thong/thong-bao">
            <GovBtn variant="secondary">
              <ArrowLeft size={16} /> Quay lại
            </GovBtn>
          </Link>
        }
      />

      <div className="max-w-[900px] mx-auto px-6 pt-8">
        <SectionCard title="Thông tin thông báo" className="shadow-sm">
          <div className="p-8 space-y-8">
            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                Tiêu đề thông báo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                placeholder="Nhập tiêu đề thông báo..."
                className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3 text-sm"
              />
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                Nội dung thông báo <span className="text-red-500">*</span>
              </label>
              <textarea
                rows={6}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                placeholder="Nhập nội dung thông báo..."
                className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-4 text-sm resize-y min-h-[160px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                  Loại thông báo
                </label>
                <select
                  value={form.type}
                  onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3 text-sm bg-white"
                >
                  <option value="">Chọn loại</option>
                  <option value="Khẩn cấp">Khẩn cấp</option>
                  <option value="Thông báo">Thông báo thường</option>
                  <option value="Mời tham gia">Mời tham gia</option>
                  <option value="Cảnh báo">Cảnh báo</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                  Đối tượng nhận <span className="text-red-500">*</span>
                </label>
                <select
                  value={form.target}
                  onChange={(e) => setForm({ ...form, target: e.target.value })}
                  className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3 text-sm bg-white"
                >
                  <option value="">Chọn đối tượng</option>
                  <option value="Tất cả cơ sở kinh doanh">Tất cả cơ sở kinh doanh</option>
                  <option value="Cơ sở kinh doanh thực phẩm">Cơ sở kinh doanh thực phẩm</option>
                  <option value="Người tiêu dùng">Người tiêu dùng</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">
                Ngày gửi (tùy chọn)
              </label>
              <input
                type="date"
                value={form.sendDate}
                onChange={(e) => setForm({ ...form, sendDate: e.target.value })}
                className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3 text-sm"
              />
            </div>

            <div className="flex justify-end gap-4 pt-6 border-t border-slate-100">
              <GovBtn 
                variant="secondary" 
                onClick={() => router.push('/thong-bao')}
              >
                Hủy
              </GovBtn>
              <GovBtn 
                variant="primary" 
                onClick={handleSubmit}
                disabled={loading}
              >
                {loading ? 'Đang gửi...' : 'Gửi thông báo'}
              </GovBtn>
            </div>
          </div>
        </SectionCard>
      </div>
    </div>
  );
}