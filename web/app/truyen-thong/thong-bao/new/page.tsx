'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  target: string;
  sendDate?: string;
  status: 'sent' | 'scheduled';
  recipientCount: number;
}

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
    if (!form.title.trim()) {
      alert('Vui lòng nhập tiêu đề');
      return;
    }

    if (!form.content.trim()) {
      alert('Vui lòng nhập nội dung');
      return;
    }

    if (!form.target) {
      alert('Vui lòng chọn đối tượng');
      return;
    }

    setLoading(true);

    const status = form.sendDate ? 'scheduled' : 'sent';

    const newNotification: Notification = {
      id: `TB-${Math.floor(1000 + Math.random() * 9000)}`,
      title: form.title,
      content: form.content,
      type: form.type,
      target: form.target,
      sendDate: form.sendDate || new Date().toLocaleDateString('vi-VN'),
      status,
      recipientCount: Math.floor(100 + Math.random() * 2000),
    };

    console.log('Notification:', newNotification);

    console.log('Sending push notification...');

    setTimeout(() => {
      alert('Gửi thông báo thành công');
      router.push('/thong-bao');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <div className="max-w-[800px] mx-auto px-6 py-8">

        {/* HEADER */}
        <div className="mb-8">
          <h1 className="text-[28px] font-black text-slate-900">
            Thông báo
          </h1>
          <p className="text-[13px] text-slate-400 mt-1">
            Tạo và gửi thông báo đến người dùng
          </p>
        </div>

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 space-y-5">

          {/* Tiêu đề */}
          <div>
            <label className="text-[13px] font-medium text-slate-700 mb-1 block">
              Tiêu đề
            </label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
              className="w-full bg-slate-50 p-3 rounded-xl text-[13px] outline-none"
              placeholder="Nhập tiêu đề thông báo"
            />
          </div>

          {/* Nội dung */}
          <div>
            <label className="text-[13px] font-medium text-slate-700 mb-1 block">
              Nội dung cảnh báo
            </label>
            <textarea
              rows={4}
              value={form.content}
              onChange={(e) => setForm({ ...form, content: e.target.value })}
              className="w-full bg-slate-50 p-3 rounded-xl text-[13px] outline-none"
              placeholder="Nhập nội dung..."
            />
          </div>

          {/* Loại thông báo */}
          <div>
            <label className="text-[13px] font-medium text-slate-700 mb-1 block">
              Loại thông báo
            </label>
            <select
              value={form.type}
              onChange={(e) => setForm({ ...form, type: e.target.value })}
              className="w-full bg-slate-50 p-3 rounded-xl text-[13px]"
            >
              <option value="">Chọn loại</option>
              <option value="Khẩn cấp">Khẩn cấp</option>
              <option value="Thông báo">Thông báo</option>
              <option value="Mời tham gia">Mời tham gia</option>
            </select>
          </div>

          {/* Đối tượng */}
          <div>
            <label className="text-[13px] font-medium text-slate-700 mb-1 block">
              Nhóm đối tượng nhận
            </label>
            <select
              value={form.target}
              onChange={(e) => setForm({ ...form, target: e.target.value })}
              className="w-full bg-slate-50 p-3 rounded-xl text-[13px]"
            >
              <option value="">Chọn đối tượng</option>
              <option value="Tất cả cơ sở kinh doanh">Tất cả cơ sở kinh doanh</option>
              <option value="Cơ sở kinh doanh thực phẩm">Cơ sở kinh doanh thực phẩm</option>
              <option value="Quản lý cơ sở">Quản lý cơ sở</option>
            </select>
          </div>

          {/* Ngày gửi */}
          <div>
            <label className="text-[13px] font-medium text-slate-700 mb-1 block">
              Ngày gửi (tùy chọn)
            </label>
            <input
              type="date"
              value={form.sendDate}
              onChange={(e) => setForm({ ...form, sendDate: e.target.value })}
              className="w-full bg-slate-50 p-3 rounded-xl text-[13px]"
            />
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="flex-1 bg-violet-600 hover:bg-violet-700 text-white py-3 rounded-xl text-[13px] font-semibold disabled:opacity-60"
            >
              {loading ? 'Đang gửi...' : 'Gửi thông báo'}
            </button>

            <button
              onClick={() => router.push('/thong-bao')}
              className="flex-1 border border-slate-200 py-3 rounded-xl text-[13px] font-semibold text-slate-600 hover:bg-slate-50"
            >
              Hủy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}