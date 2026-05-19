'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Pencil, Printer, Save, X, AlertTriangle,
  Calendar, User, Building2, FileText, Info, QrCode
} from 'lucide-react';
import { PageHeader, SectionCard, GovBtn, StatusBadge } from '@/components/GovUI';

interface Regulation {
  id: string;
  title: string;
  category: string;
  issueDate: string;
  effectiveDate: string;
  authority: string;
  status: 'active' | 'draft' | 'expired';
  content: string;
  attachment?: string;
}

const mockRegulations: Regulation[] = [
  {
    id: 'QD-2025-001',
    title: 'Quy định về kiểm soát an toàn thực phẩm tại các cơ sở kinh doanh',
    category: 'An toàn thực phẩm',
    issueDate: '10/01/2025',
    effectiveDate: '01/02/2025',
    authority: 'Chi cục An toàn Thực phẩm TP. Đà Nẵng',
    status: 'active',
    content: 'Cơ sở kinh doanh thực phẩm phải đảm bảo vệ sinh, nguồn gốc nguyên liệu rõ ràng...',
    attachment: 'QD-2025001.pdf'
  },
  // Thêm dữ liệu khác nếu cần
];

export default function RegulationDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [regulation, setRegulation] = useState<Regulation | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Regulation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const found = mockRegulations.find(r => r.id === id);
    if (found) {
      setRegulation(found);
      setFormData({ ...found });
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin mx-auto" />
          <p className="mt-3 text-slate-500">Đang tải thông tin quy định...</p>
        </div>
      </div>
    );
  }

  if (!regulation || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy quy định</h2>
        <p className="text-slate-500 mt-2">Mã <span className="font-mono">{id}</span> không tồn tại.</p>
        <Link href="/quy-dinh" className="mt-6">
          <GovBtn variant="primary">Quay về danh sách</GovBtn>
        </Link>
      </div>
    );
  }

  const patch = (key: keyof Regulation, value: string) => {
    setFormData(prev => prev ? { ...prev, [key]: value } : prev);
  };

  const handleSave = () => {
    setRegulation(formData);
    setIsEditing(false);
    alert('✅ Đã lưu thay đổi thành công!');
  };

  const handleCancel = () => {
    setFormData({ ...regulation });
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-16">
      <PageHeader
        title={regulation.title}
        subtitle={`Mã quy định: ${regulation.id}`}
        badge={<StatusBadge variant={regulation.status} />}
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
                  <Printer size={16} /> In quy định
                </GovBtn>
              </>
            )}
          </>
        }
      />

      {isEditing && (
        <div className="max-w-[1200px] mx-auto px-6 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3 text-amber-800 text-sm">
            <AlertTriangle size={20} />
            Đang ở chế độ chỉnh sửa. Nhấn <strong>Lưu thay đổi</strong> để áp dụng.
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">

            <SectionCard title="Thông tin quy định" className="shadow-sm">
              <div className="p-8 space-y-8">
                <div>
                  <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">Tiêu đề quy định</label>
                  {isEditing ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => patch('title', e.target.value)}
                      className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3 text-lg font-medium"
                    />
                  ) : (
                    <h2 className="text-2xl font-bold text-slate-900 leading-tight">{regulation.title}</h2>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">Danh mục</label>
                    {isEditing ? (
                      <select value={formData.category} onChange={(e) => patch('category', e.target.value)} className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3">
                        <option value="An toàn thực phẩm">An toàn thực phẩm</option>
                        <option value="Giấy phép">Giấy phép</option>
                        <option value="Xử phạt">Xử phạt</option>
                      </select>
                    ) : (
                      <p className="text-lg font-medium">{regulation.category}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">Cơ quan ban hành</label>
                    <p className="text-lg font-medium">{regulation.authority}</p>
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">Ngày ban hành</label>
                    {isEditing ? (
                      <input type="date" value={formData.issueDate} onChange={(e) => patch('issueDate', e.target.value)} className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3" />
                    ) : (
                      <p className="font-mono text-lg">{regulation.issueDate}</p>
                    )}
                  </div>

                  <div>
                    <label className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5 block">Ngày hiệu lực</label>
                    {isEditing ? (
                      <input type="date" value={formData.effectiveDate} onChange={(e) => patch('effectiveDate', e.target.value)} className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl px-5 py-3" />
                    ) : (
                      <p className="font-mono text-lg">{regulation.effectiveDate}</p>
                    )}
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Nội dung quy định" className="shadow-sm">
              <div className="p-8">
                {isEditing ? (
                  <textarea
                    value={formData.content}
                    onChange={(e) => patch('content', e.target.value)}
                    className="w-full h-96 border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-2xl p-5 text-[15px]"
                  />
                ) : (
                  <div className="prose text-[15px] leading-relaxed text-slate-700">
                    {regulation.content}
                  </div>
                )}
              </div>
            </SectionCard>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">
            <SectionCard title="Thông tin khác" className="shadow-sm">
              <div className="p-6 space-y-6">
                <div className="flex justify-center">
                  <div className="bg-white p-6 rounded-2xl shadow">
                    <QrCode size={120} className="text-slate-700" />
                  </div>
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">File đính kèm</p>
                  <p className="text-sm font-medium text-green-600 hover:underline cursor-pointer">
                    {regulation.attachment || 'Không có file'}
                  </p>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Lịch sử" className="shadow-sm">
              <div className="p-6 text-sm space-y-4">
                <div className="flex gap-4">
                  <div className="w-6 h-6 bg-emerald-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Calendar size={14} className="text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-medium">Ban hành</p>
                    <p className="text-xs text-slate-500">{regulation.issueDate}</p>
                  </div>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}