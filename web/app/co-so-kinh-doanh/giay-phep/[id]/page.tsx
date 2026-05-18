'use client';
import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Pencil, Printer, MapPin, Phone } from 'lucide-react';
import { 
  PageHeader, 
  SectionCard, 
  GovBtn, 
  StatusBadge 
} from '@/components/GovUI';

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
  revoked: 'suspended',
};

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
    return <div className="min-h-screen flex items-center justify-center">Đang tải...</div>;
  }

  if (!license || !formData) {
    return (
      <div className="min-h-screen bg-[#f5f6fa] flex flex-col items-center justify-center py-20">
        <div className="text-7xl mb-6">😕</div>
        <h2 className="text-2xl font-bold text-slate-900">Không tìm thấy giấy phép</h2>
        <p className="text-slate-500 mt-2">Mã giấy phép <span className="font-mono">#{id}</span> không tồn tại.</p>
        <Link href="/giay-phep" className="mt-6">
          <GovBtn variant="primary">Quay về danh sách</GovBtn>
        </Link>
      </div>
    );
  }

  const handleSave = () => {
    setLicense(formData);
    setIsEditing(false);
    alert('✅ Đã lưu thay đổi thành công!');
  };

  return (
    <div className="min-h-screen bg-[#f5f6fa]">
      <PageHeader 
        title={license.businessName}
        subtitle={`Mã giấy phép: ${license.id} • ${license.type}`}
        actions={
          <>
            <GovBtn variant="secondary" onClick={() => router.back()}>
              <ArrowLeft size={16} /> Quay lại
            </GovBtn>
            <GovBtn 
              variant="secondary" 
              onClick={() => setIsEditing(!isEditing)}
            >
              <Pencil size={16} /> {isEditing ? 'Hủy' : 'Chỉnh sửa'}
            </GovBtn>
            <GovBtn variant="secondary">
              <Printer size={16} /> In giấy phép
            </GovBtn>
            {isEditing && (
              <GovBtn variant="primary" onClick={handleSave}>
                Lưu thay đổi
              </GovBtn>
            )}
          </>
        }
      />

      <div className="max-w-[1200px] mx-auto px-6 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Thông tin chính */}
          <div className="lg:col-span-8 space-y-6">
            <SectionCard title="Thông tin giấy phép">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Tên cơ sở</p>
                  {isEditing ? (
                    <input
                      type="text"
                      className="w-full border border-slate-300 rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500"
                      value={formData.businessName}
                      onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                    />
                  ) : (
                    <p className="font-semibold text-xl">{license.businessName}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Loại giấy phép</p>
                  {isEditing ? (
                    <select
                      className="w-full border border-slate-300 rounded-xl px-4 py-3"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    >
                      <option value="Giấy phép kinh doanh thực phẩm">Giấy phép kinh doanh thực phẩm</option>
                      <option value="Giấy phép VSATTP">Giấy phép VSATTP</option>
                      <option value="Giấy phép chế biến thực phẩm">Giấy phép chế biến thực phẩm</option>
                    </select>
                  ) : (
                    <p className="font-medium">{license.type}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Ngày cấp</p>
                  {isEditing ? (
                    <input type="date" className="w-full border border-slate-300 rounded-xl px-4 py-3" value={formData.issueDate} onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })} />
                  ) : (
                    <p className="font-mono text-lg">{license.issueDate}</p>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Ngày hết hạn</p>
                  {isEditing ? (
                    <input type="date" className="w-full border border-slate-300 rounded-xl px-4 py-3" value={formData.expiryDate} onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })} />
                  ) : (
                    <p className={`font-mono text-lg ${license.status === 'expired' ? 'text-red-600 font-bold' : ''}`}>
                      {license.expiryDate}
                    </p>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Quận/Huyện</p>
                  {isEditing ? (
                    <select
                      className="w-full border border-slate-300 rounded-xl px-4 py-3"
                      value={formData.district}
                      onChange={(e) => setFormData({ ...formData, district: e.target.value })}
                    >
                      <option value="Hải Châu">Hải Châu</option>
                      <option value="Thanh Khê">Thanh Khê</option>
                      <option value="Ngũ Hành Sơn">Ngũ Hành Sơn</option>
                      <option value="Sơn Trà">Sơn Trà</option>
                    </select>
                  ) : (
                    <div className="inline-flex items-center gap-2 px-5 py-2 bg-blue-50 text-blue-700 rounded-2xl font-medium">
                      <MapPin size={18} /> {license.district}
                    </div>
                  )}
                </div>

                <div>
                  <p className="text-xs uppercase tracking-widest text-slate-500 mb-1">Trạng thái</p>
                  <StatusBadge variant={licenseStatusMap[license.status]} />
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Ghi chú / Thông tin bổ sung">
              <p className="text-slate-600 leading-relaxed">
                Giấy phép được cấp theo quy định của Luật An toàn thực phẩm 2010 (sửa đổi, bổ sung). 
                Cơ sở kinh doanh cam kết tuân thủ nghiêm ngặt các quy định về vệ sinh an toàn thực phẩm.
              </p>
            </SectionCard>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <SectionCard title="Thông tin liên hệ">
              <div className="space-y-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mt-0.5">
                    <Phone size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Số điện thoại</p>
                    <p className="font-semibold">0236 123 4567</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 mt-0.5">
                    <MapPin size={22} />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500">Địa chỉ</p>
                    <p className="font-medium">123 Nguyễn Thị Minh Khai, {license.district}, TP. Đà Nẵng</p>
                  </div>
                </div>
              </div>
            </SectionCard>

            <SectionCard title="Lịch sử giấy phép">
              <div className="flex gap-4">
                <div className="w-6 h-6 rounded-full bg-emerald-100 flex-shrink-0 flex items-center justify-center text-emerald-600 text-sm">✓</div>
                <div>
                  <p className="font-medium">Cấp lần đầu</p>
                  <p className="text-sm text-slate-500">{license.issueDate}</p>
                </div>
              </div>
            </SectionCard>
          </div>
        </div>
      </div>
    </div>
  );
}