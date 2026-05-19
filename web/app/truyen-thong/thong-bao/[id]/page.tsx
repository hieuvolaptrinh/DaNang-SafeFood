'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Pencil, Printer, Save, X, AlertTriangle
} from 'lucide-react';
import { PageHeader, SectionCard, GovBtn, StatusBadge } from '@/components/GovUI';

interface Notification {
  id: string;
  title: string;
  content: string;
  type: string;
  target: string;
  sendDate: string;
  status: 'sent' | 'scheduled';
  recipientCount: number;
}

const mockNotifications: Notification[] = [
  {
    id: 'TB-2025001',
    title: 'Cảnh báo khẩn cấp về lô thực phẩm nhiễm khuẩn',
    content: 'Yêu cầu các cơ sở kinh doanh thực phẩm tăng cường kiểm soát nhiệt độ bảo quản, kiểm tra nguồn gốc nguyên liệu chặt chẽ để tránh ngộ độc thực phẩm trong mùa hè.',
    type: 'Cảnh báo',
    target: 'Tất cả cơ sở kinh doanh',
    sendDate: '18/03/2025',
    status: 'sent',
    recipientCount: 1248
  },
];

export default function NotificationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [notification, setNotification] = useState<Notification | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Notification | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockNotifications.find(n => n.id === id);
    if (found) {
      setNotification(found);
      setFormData({ ...found });
    }
    setLoading(false);
  }, [id]);

  if (loading || !notification || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        Không tìm thấy thông báo
      </div>
    );
  }

  const patch = (key: keyof Notification, value: string) => {
    setFormData(p => p ? { ...p, [key]: value } : p);
  };

  const handleSave = () => {
    setNotification(formData);
    setIsEditing(false);
    alert('✅ Đã lưu thay đổi thành công!');
  };

  const handleCancel = () => {
    setFormData({ ...notification });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-16">
      <PageHeader
        title={notification.title}
        subtitle={`Mã TB: ${notification.id}`}
        badge={<StatusBadge variant={notification.status} />}
        actions={
          <>
            <GovBtn variant="secondary" onClick={() => router.back()}>
              <ArrowLeft size={16} /> Quay lại
            </GovBtn>

            {isEditing ? (
              <>
                <GovBtn variant="secondary" onClick={handleCancel}>
                  <X size={16} /> Hủy
                </GovBtn>
                <GovBtn variant="primary" onClick={handleSave}>
                  <Save size={16} /> Lưu thay đổi
                </GovBtn>
              </>
            ) : (
              <>
                <GovBtn variant="secondary" onClick={() => setIsEditing(true)}>
                  <Pencil size={16} /> Chỉnh sửa
                </GovBtn>
                <GovBtn variant="secondary" onClick={() => window.print()}>
                  <Printer size={16} /> In thông báo
                </GovBtn>
              </>
            )}
          </>
        }
      />

      {isEditing && (
        <div className="max-w-[1200px] mx-auto px-6 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3 text-amber-800 text-sm">
            <AlertTriangle size={20} /> Đang ở chế độ chỉnh sửa — Nhấn <strong>Lưu thay đổi</strong> để áp dụng
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT - Nội dung chính */}
          <div className="lg:col-span-8 space-y-8">

            {/* Tiêu đề */}
            <SectionCard title="Tiêu đề thông báo" className="shadow-sm">
              <div className="p-8">
                {isEditing ? (
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => patch('title', e.target.value)}
                    className="w-full text-2xl font-bold border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-4"
                  />
                ) : (
                  <h2 className="text-2xl font-bold text-slate-900 leading-tight">
                    {notification.title}
                  </h2>
                )}
              </div>
            </SectionCard>

            {/* Nội dung */}
            <SectionCard title="Nội dung thông báo" className="shadow-sm">
              <div className="p-8">
                {isEditing ? (
                  <textarea
                    value={formData.content}
                    onChange={(e) => patch('content', e.target.value)}
                    className="w-full min-h-[260px] border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-4 text-[15px] leading-relaxed"
                  />
                ) : (
                  <p className="text-[15px] leading-relaxed text-slate-700 whitespace-pre-line">
                    {notification.content}
                  </p>
                )}
              </div>
            </SectionCard>
          </div>

          {/* RIGHT - Thông tin chi tiết */}
          <div className="lg:col-span-4 space-y-8">

            <SectionCard title="Thông tin chi tiết" className="shadow-sm">
              <div className="p-8 space-y-8">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">Loại thông báo</label>
                  {isEditing ? (
                    <select
                      value={formData.type}
                      onChange={(e) => patch('type', e.target.value)}
                      className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3"
                    >
                      <option value="Cảnh báo">Cảnh báo</option>
                      <option value="Thông báo">Thông báo</option>
                      <option value="Khẩn cấp">Khẩn cấp</option>
                    </select>
                  ) : (
                    <p className="text-lg font-medium">{notification.type}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">Đối tượng nhận</label>
                  {isEditing ? (
                    <select
                      value={formData.target}
                      onChange={(e) => patch('target', e.target.value)}
                      className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3"
                    >
                      <option value="Tất cả cơ sở kinh doanh">Tất cả cơ sở kinh doanh</option>
                      <option value="Cơ sở kinh doanh thực phẩm">Cơ sở kinh doanh thực phẩm</option>
                      <option value="Quản lý cơ sở">Quản lý cơ sở</option>
                    </select>
                  ) : (
                    <p className="text-lg font-medium">{notification.target}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">Ngày gửi</label>
                  {isEditing ? (
                    <input
                      type="date"
                      value={formData.sendDate}
                      onChange={(e) => patch('sendDate', e.target.value)}
                      className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3"
                    />
                  ) : (
                    <p className="font-mono text-lg">{notification.sendDate}</p>
                  )}
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">Số người nhận</label>
                  <p className="text-2xl font-bold text-green-600">{notification.recipientCount.toLocaleString()}</p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}