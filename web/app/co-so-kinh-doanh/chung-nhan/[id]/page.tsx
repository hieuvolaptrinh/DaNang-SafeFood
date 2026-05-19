'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Pencil, Printer, MapPin, Phone, Save, X,
  Building2, FileText, Calendar, CheckCircle2, AlertTriangle,
  CalendarClock, Shield, Hash, User, ClipboardList, Info, QrCode,
} from 'lucide-react';
import { PageHeader, SectionCard, GovBtn, StatusBadge } from '@/components/GovUI';

interface Certificate {
  id: string;
  businessName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'pending' | 'approved' | 'rejected';
  approver: string;
  district?: string;
}

const mockCertificates: Certificate[] = [
  {
    id: 'CN-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    type: 'Chứng nhận ATTP',
    issueDate: '15/01/2025',
    expiryDate: '14/01/2026',
    status: 'approved',
    approver: 'Nguyễn Văn A',
    district: 'Hải Châu'
  },
  {
    id: 'CN-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    type: 'Chứng nhận VSATTP',
    issueDate: '20/02/2025',
    expiryDate: '19/02/2026',
    status: 'pending',
    approver: '',
    district: 'Thanh Khê'
  },
  // ... thêm dữ liệu nếu cần
];

const statusMap = {
  approved: 'active',
  pending: 'pending',
  rejected: 'suspended',
};

const CERT_TYPES = ['Chứng nhận ATTP', 'Chứng nhận VSATTP', 'Chứng nhận GMP'];

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-1.5">
      {children}
    </p>
  );
}

function EditInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <input
      type="text"
      className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl px-4 py-3 text-slate-800 bg-white transition-all"
      value={value}
      onChange={e => onChange(e.target.value)}
    />
  );
}

function EditSelect({ value, onChange, options }: { value: string; onChange: (v: string) => void; options: string[] }) {
  return (
    <select
      className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl px-4 py-3 text-slate-800 bg-white transition-all"
      value={value}
      onChange={e => onChange(e.target.value)}
    >
      {options.map(o => <option key={o} value={o}>{o}</option>)}
    </select>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="w-9 h-9 rounded-xl bg-green-50 flex items-center justify-center text-green-600 flex-shrink-0">
        {icon}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">{label}</p>
        <p className="text-[15px] font-medium text-slate-800 mt-0.5 leading-snug">{value}</p>
      </div>
    </div>
  );
}

export default function ChungNhanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [cert, setCert] = useState<Certificate | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<Certificate | null>(null);

  useEffect(() => {
    const found = mockCertificates.find(c => c.id === id);
    if (found) {
      setCert(found);
      setFormData({ ...found });
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p>Đang tải thông tin chứng nhận...</p>
        </div>
      </div>
    );
  }

  if (!cert || !formData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy chứng nhận</h2>
        <p className="text-slate-500 mt-2">Mã <span className="font-mono">#{id}</span> không tồn tại.</p>
        <Link href="/phe-duyet-chung-nhan" className="mt-6">
          <GovBtn variant="primary">Quay về danh sách</GovBtn>
        </Link>
      </div>
    );
  }

  const patch = (key: keyof Certificate, v: string) => {
    setFormData(p => p ? { ...p, [key]: v } : p);
  };

  const handleSave = () => {
    setCert(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...cert });
    setIsEditing(false);
  };

  const historyEvents = [
    {
      icon: <CheckCircle2 size={16} />,
      color: 'bg-emerald-500',
      label: 'Nộp hồ sơ',
      date: cert.issueDate,
      note: 'Hệ thống tiếp nhận'
    },
    ...(cert.status === 'approved' ? [{
      icon: <CheckCircle2 size={16} />,
      color: 'bg-emerald-500',
      label: 'Đã phê duyệt',
      date: cert.issueDate,
      note: cert.approver
    }] : []),
    ...(cert.status === 'rejected' ? [{
      icon: <X size={16} />,
      color: 'bg-red-500',
      label: 'Từ chối',
      date: cert.issueDate,
      note: 'Lý do: Không đạt tiêu chuẩn ATTP'
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-16">
      <PageHeader
        title={cert.businessName}
        subtitle={`Mã chứng nhận: ${cert.id}`}
        badge={<StatusBadge variant={statusMap[cert.status]} />}
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
                  <Printer size={16} /> In chứng nhận
                </GovBtn>
              </>
            )}
          </>
        }
      />

      {isEditing && (
        <div className="max-w-[1200px] mx-auto px-6 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3 text-amber-800 text-sm">
            <AlertTriangle size={20} className="text-amber-500" />
            Đang chỉnh sửa — Nhấn <strong>Lưu thay đổi</strong> để áp dụng
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">

            <SectionCard title="Thông tin chứng nhận" className="shadow-sm">
              <div className="p-8">
                <div className="mb-8">
                  <Label>Tên cơ sở kinh doanh</Label>
                  {isEditing ? (
                    <EditInput value={formData.businessName} onChange={v => patch('businessName', v)} />
                  ) : (
                    <p className="text-3xl font-bold text-slate-900 leading-tight">{cert.businessName}</p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div>
                    <Label>Loại chứng nhận</Label>
                    {isEditing ? (
                      <EditSelect value={formData.type} onChange={v => patch('type', v)} options={CERT_TYPES} />
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-[15px] font-medium">
                        <Shield size={18} /> {cert.type}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Mã chứng nhận</Label>
                    <p className="font-mono text-2xl font-bold text-green-700 tracking-wider">{cert.id}</p>
                  </div>

                  <div>
                    <Label>Ngày cấp</Label>
                    {isEditing ? (
                      <input type="date" className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl px-4 py-3" value={formData.issueDate} onChange={e => patch('issueDate', e.target.value)} />
                    ) : (
                      <p className="text-xl font-semibold text-slate-800">{cert.issueDate}</p>
                    )}
                  </div>

                  <div>
                    <Label>Ngày hết hạn</Label>
                    {isEditing ? (
                      <input type="date" className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl px-4 py-3" value={formData.expiryDate} onChange={e => patch('expiryDate', e.target.value)} />
                    ) : (
                      <p className={`text-xl font-semibold ${cert.status === 'rejected' ? 'text-red-600' : ''}`}>{cert.expiryDate}</p>
                    )}
                  </div>

                  <div>
                    <Label>Quận / Huyện</Label>
                    {isEditing ? (
                      <EditSelect value={formData.district || ''} onChange={v => patch('district', v)} options={['Hải Châu', 'Thanh Khê', 'Ngũ Hành Sơn', 'Sơn Trà']} />
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl text-[15px] font-medium">
                        <MapPin size={18} /> {cert.district}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Trạng thái</Label>
                    <StatusBadge variant={statusMap[cert.status]} size="lg" />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Thông tin bổ sung" className="shadow-sm">
              <div className="p-8 space-y-6 text-[15px] text-slate-600 leading-relaxed">
                <p>Chứng nhận này được cấp theo quy định Luật An toàn thực phẩm 2010 (sửa đổi, bổ sung năm 2018).</p>
                <p>Cơ sở cam kết duy trì các điều kiện về an toàn thực phẩm trong suốt thời gian hiệu lực.</p>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">

            <SectionCard title="Thông tin liên hệ" className="shadow-sm">
              <div className="divide-y divide-slate-100 px-2">
                <MetaRow icon={<Phone size={18} />} label="Số điện thoại" value="0236 123 4567" />
                <MetaRow icon={<MapPin size={18} />} label="Địa chỉ" value={`123 Nguyễn Thị Minh Khai, ${cert.district}, TP. Đà Nẵng`} />
                <MetaRow icon={<Building2 size={18} />} label="Cơ quan cấp" value="Chi cục An toàn Thực phẩm TP. Đà Nẵng" />
                <MetaRow icon={<User size={18} />} label="Người phê duyệt" value={cert.approver || '—'} />
              </div>
            </SectionCard>

            <SectionCard title="Mã QR & Hiệu lực" className="shadow-sm">
              <div className="flex justify-center py-8 bg-slate-50 rounded-2xl mb-6">
                <div className="bg-white p-5 rounded-2xl shadow">
                  <QrCode size={110} className="text-slate-700" />
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${cert.status === 'approved' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <CalendarClock size={22} />
                <p className="uppercase text-xs font-bold tracking-widest text-slate-500 mt-3">Hiệu lực đến</p>
                <p className={`text-3xl font-bold font-mono mt-1 ${cert.status === 'rejected' ? 'text-red-600' : 'text-green-700'}`}>
                  {cert.expiryDate}
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Lịch sử chứng nhận" className="shadow-sm">
              <div className="relative pl-10 py-4">
                <div className="absolute left-6 top-6 bottom-6 w-px bg-slate-200" />
                {historyEvents.map((e, i) => (
                  <div key={i} className="relative mb-8 last:mb-0">
                    <div className={`absolute -left-10 w-9 h-9 rounded-2xl ${e.color} flex items-center justify-center text-white shadow`}>
                      {e.icon}
                    </div>
                    <div>
                      <p className="font-semibold text-slate-800">{e.label}</p>
                      <p className="text-xs font-mono text-slate-400 mt-0.5">{e.date}</p>
                      <p className="text-sm text-slate-600 mt-1">{e.note}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}