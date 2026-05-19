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

interface License {
  id: string;
  businessName: string;
  type: string;
  issueDate: string;
  expiryDate: string;
  status: 'valid' | 'expired' | 'revoked';
  district: string;
}

const mockLicenses: License[] = [
  { id: 'GP-2025001', businessName: 'Nhà hàng Hải Sản Biển Xanh', type: 'Giấy phép kinh doanh thực phẩm', issueDate: '10/01/2025', expiryDate: '09/01/2026', status: 'valid', district: 'Hải Châu' },
  { id: 'GP-2025002', businessName: 'Quán Ăn Gia Đình Việt', type: 'Giấy phép VSATTP', issueDate: '15/02/2025', expiryDate: '14/02/2025', status: 'expired', district: 'Thanh Khê' },
  { id: 'GP-2025003', businessName: 'Cửa hàng Thực phẩm Organic', type: 'Giấy phép kinh doanh thực phẩm', issueDate: '20/03/2025', expiryDate: '19/03/2026', status: 'valid', district: 'Ngũ Hành Sơn' },
  { id: 'GP-2025004', businessName: 'Siêu thị Mini Mart Đà Nẵng', type: 'Giấy phép kinh doanh thực phẩm', issueDate: '05/01/2025', expiryDate: '04/01/2026', status: 'revoked', district: 'Sơn Trà' },
];

const licenseStatusMap: Record<string, string> = {
  valid: 'active',
  expired: 'expired',
  revoked: 'suspended'
};

const LICENSE_TYPES = ['Giấy phép kinh doanh thực phẩm', 'Giấy phép VSATTP', 'Giấy phép chế biến thực phẩm'];
const DISTRICTS = ['Hải Châu', 'Thanh Khê', 'Ngũ Hành Sơn', 'Sơn Trà'];

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

export default function GiayPhepDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [license, setLicense] = useState<License | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState<License | null>(null);

  useEffect(() => {
    const found = mockLicenses.find(l => l.id === id);
    if (found) {
      setLicense(found);
      setFormData({ ...found });
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f6fa]">
        <div className="flex flex-col items-center gap-3 text-slate-400">
          <div className="w-8 h-8 border-4 border-green-200 border-t-green-600 rounded-full animate-spin" />
          <p className="text-sm">Đang tải thông tin giấy phép...</p>
        </div>
      </div>
    );
  }

  if (!license || !formData) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy giấy phép</h2>
        <p className="text-slate-500 mt-2">Mã <span className="font-mono">#{id}</span> không tồn tại.</p>
        <Link href="/giay-phep" className="mt-6">
          <GovBtn variant="primary">Quay về danh sách</GovBtn>
        </Link>
      </div>
    );
  }

  const patch = (key: keyof License, v: string) => {
    setFormData(p => p ? { ...p, [key]: v } : p);
  };

  const handleSave = () => {
    setLicense(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData({ ...license });
    setIsEditing(false);
  };

  const historyEvents = [
    { 
      icon: <CheckCircle2 size={16} />, 
      color: 'bg-emerald-500', 
      label: 'Cấp lần đầu', 
      date: license.issueDate, 
      note: 'Ban Quản lý ATTP TP. Đà Nẵng' 
    },
    ...(license.status === 'revoked' ? [{ 
      icon: <X size={16} />, 
      color: 'bg-red-500', 
      label: 'Thu hồi giấy phép', 
      date: license.expiryDate, 
      note: 'Vi phạm quy định ATTP' 
    }] : []),
    ...(license.status === 'expired' ? [{ 
      icon: <Calendar size={16} />, 
      color: 'bg-amber-500', 
      label: 'Hết hiệu lực', 
      date: license.expiryDate, 
      note: 'Chưa gia hạn' 
    }] : []),
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-16">
      <PageHeader
        title={license.businessName}
        subtitle={`Mã giấy phép: ${license.id}`}
        badge={<StatusBadge variant={licenseStatusMap[license.status]} className="text-sm" />}
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
                  <Printer size={16} /> In giấy phép
                </GovBtn>
              </>
            )}
          </>
        }
      />

      {isEditing && (
        <div className="max-w-[1200px] mx-auto px-6 mt-4">
          <div className="bg-amber-50 border border-amber-200 rounded-2xl px-5 py-3.5 flex items-center gap-3 text-amber-800 text-sm">
            <AlertTriangle size={20} className="text-amber-500 flex-shrink-0" />
            <span>Đang ở chế độ chỉnh sửa. Nhấn <strong>Lưu thay đổi</strong> để áp dụng.</span>
          </div>
        </div>
      )}

      <div className="max-w-[1200px] mx-auto px-6 pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-8 space-y-8">

            <SectionCard title="Thông tin giấy phép" className="shadow-sm">
              <div className="p-8">
                <div className="mb-8">
                  <Label>Tên cơ sở kinh doanh</Label>
                  {isEditing ? (
                    <EditInput value={formData.businessName} onChange={v => patch('businessName', v)} />
                  ) : (
                    <p className="text-3xl font-bold text-slate-900 leading-tight">
                      {license.businessName}
                    </p>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                  <div>
                    <Label>Loại giấy phép</Label>
                    {isEditing ? (
                      <EditSelect value={formData.type} onChange={v => patch('type', v)} options={LICENSE_TYPES} />
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-slate-100 text-slate-700 px-4 py-2.5 rounded-xl text-[15px] font-medium">
                        <FileText size={18} className="text-slate-500" />
                        {license.type}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Mã giấy phép</Label>
                    <p className="font-mono text-2xl font-bold text-green-700 tracking-wider">{license.id}</p>
                  </div>

                  <div>
                    <Label>Ngày cấp</Label>
                    {isEditing ? (
                      <input
                        type="date"
                        className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl px-4 py-3 text-slate-800"
                        value={formData.issueDate}
                        onChange={e => patch('issueDate', e.target.value)}
                      />
                    ) : (
                      <p className="text-xl font-semibold text-slate-800">{license.issueDate}</p>
                    )}
                  </div>

                  <div>
                    <Label>Ngày hết hạn</Label>
                    {isEditing ? (
                      <input
                        type="date"
                        className="w-full border border-slate-300 focus:border-green-500 focus:ring-2 focus:ring-green-200 rounded-xl px-4 py-3 text-slate-800"
                        value={formData.expiryDate}
                        onChange={e => patch('expiryDate', e.target.value)}
                      />
                    ) : (
                      <p className={`text-xl font-semibold ${license.status === 'expired' ? 'text-red-600' : 'text-slate-800'}`}>
                        {license.expiryDate}
                      </p>
                    )}
                  </div>

                  <div>
                    <Label>Quận / Huyện</Label>
                    {isEditing ? (
                      <EditSelect value={formData.district} onChange={v => patch('district', v)} options={DISTRICTS} />
                    ) : (
                      <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2.5 rounded-xl text-[15px] font-medium">
                        <MapPin size={18} /> {license.district}
                      </div>
                    )}
                  </div>

                  <div>
                    <Label>Trạng thái</Label>
                    <StatusBadge variant={licenseStatusMap[license.status]} size="lg" />
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Điều kiện & Phạm vi hoạt động" className="shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-8">
                {[
                  { icon: <Shield size={22} />, label: 'Tiêu chuẩn áp dụng', value: 'TCVN 5603:2023 — GMP thực phẩm' },
                  { icon: <ClipboardList size={22} />, label: 'Phạm vi kinh doanh', value: 'Chế biến & kinh doanh thực phẩm tươi sống, chín' },
                  { icon: <User size={22} />, label: 'Người đại diện pháp luật', value: 'Nguyễn Văn Minh' },
                  { icon: <Hash size={22} />, label: 'Mã số thuế', value: '0401 234 567' },
                ].map((item, i) => (
                  <div key={i} className="flex gap-5 bg-slate-50 hover:bg-white transition-all rounded-2xl p-6 border border-slate-100">
                    <div className="w-12 h-12 rounded-2xl bg-white shadow flex items-center justify-center text-green-600 flex-shrink-0">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-widest text-slate-400">{item.label}</p>
                      <p className="text-[15px] leading-snug mt-1.5 font-medium text-slate-700">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </SectionCard>

            <SectionCard title="Ghi chú / Thông tin bổ sung" className="shadow-sm">
              <div className="flex gap-5 p-8">
                <Info size={26} className="text-slate-400 mt-1 flex-shrink-0" />
                <p className="text-[15px] leading-relaxed text-slate-600">
                  Giấy phép được cấp theo quy định của Luật An toàn thực phẩm 2010 (sửa đổi, bổ sung năm 2018). 
                  Cơ sở kinh doanh cam kết tuân thủ nghiêm ngặt các quy định về vệ sinh an toàn thực phẩm, 
                  chịu sự kiểm tra, giám sát định kỳ của Chi cục ATTP TP. Đà Nẵng.
                </p>
              </div>
            </SectionCard>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="lg:col-span-4 space-y-8">

            <SectionCard title="Thông tin liên hệ" className="shadow-sm">
              <div className="divide-y divide-slate-100 px-2">
                <MetaRow icon={<Phone size={18} />} label="Số điện thoại" value="0236 123 4567" />
                <MetaRow 
                  icon={<MapPin size={18} />} 
                  label="Địa chỉ" 
                  value={`123 Nguyễn Thị Minh Khai, ${license.district}, TP. Đà Nẵng`} 
                />
                <MetaRow icon={<Building2 size={18} />} label="Cơ quan cấp phép" value="Chi cục An toàn Thực phẩm TP. Đà Nẵng" />
                <MetaRow icon={<User size={18} />} label="Cán bộ phụ trách" value="Trần Thị Hương — P. Cấp phép" />
              </div>
            </SectionCard>

            <SectionCard title="Mã QR & Trạng thái hiệu lực" className="shadow-sm">
              <div className="flex justify-center py-8 bg-slate-50 rounded-2xl mb-6">
                <div className="bg-white p-5 rounded-2xl shadow">
                  <QrCode size={110} className="text-slate-700" />
                </div>
              </div>

              <div className={`p-6 rounded-2xl ${license.status === 'valid' ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'}`}>
                <CalendarClock size={22} className="mb-3" />
                <p className="uppercase text-xs font-bold tracking-widest text-slate-500">Hiệu lực đến</p>
                <p className={`text-3xl font-bold font-mono mt-2 ${license.status === 'expired' ? 'text-red-600' : 'text-green-700'}`}>
                  {license.expiryDate}
                </p>
              </div>
            </SectionCard>

            <SectionCard title="Lịch sử giấy phép" className="shadow-sm">
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