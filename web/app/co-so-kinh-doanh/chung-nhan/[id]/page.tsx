'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Printer, MapPin, Building2, Calendar, CheckCircle2,
  CalendarClock, Shield, User, ClipboardList, Info, QrCode, RefreshCw
} from 'lucide-react';
import { PageHeader, SectionCard, GovBtn, StatusBadge } from '@/components/GovUI';
import { giayChungNhanApi, coSoKinhDoanhApi, type GiayChungNhanItem, type CoSoKinhDoanhItem } from '@/api/api';

function formatDate(dateStr?: string) {
  if (!dateStr) return '—';
  try {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year}`;
  } catch {
    return dateStr;
  }
}

const mapStatusToVariant = (status: string) => {
  const s = String(status || '').trim().toLowerCase();
  if (s === 'còn hiệu lực' || s === 'cap moi' || s === 'gia han' || s === 'hoat_dong') return 'active'; 
  if (s === 'hết hạn' || s === 'expired') return 'expired'; 
  if (s === 'thu hoi' || s === 'suspended' || s === 'dinh_chi') return 'suspended'; 
  return 'pending'; 
};

const mapStatusToLabel = (status: string) => {
  const s = String(status || '').trim();
  if (s === 'Cap moi') return 'Cấp mới';
  if (s === 'Gia han') return 'Gia hạn';
  if (s === 'Thu hoi') return 'Thu hồi';
  return s;
};

function Label({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', marginBottom: '6px' }}>
      {children}
    </p>
  );
}

function MetaRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '16px', padding: '12px 0', borderBottom: '1px solid #F0F0F0' }}>
      <div style={{ width: '36px', height: '36px', borderRadius: '4px', background: '#F0F8F0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#008000', flexShrink: 0 }}>
        {icon}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', margin: 0 }}>{label}</p>
        <p style={{ fontSize: '14px', fontWeight: 500, color: '#222', marginTop: '2px', lineHeight: 1.3 }}>{value}</p>
      </div>
    </div>
  );
}

export default function ChungNhanDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [cert, setCert] = useState<GiayChungNhanItem | null>(null);
  const [business, setBusiness] = useState<CoSoKinhDoanhItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    giayChungNhanApi.getById(id)
      .then(async (cData) => {
        setCert(cData);
        if (cData.maCoSo) {
          try {
            const bData = await coSoKinhDoanhApi.getById(cData.maCoSo);
            setBusiness(bData);
          } catch (err) {
            console.error('Lỗi tải thông tin cơ sở:', err);
          }
        }
      })
      .catch(err => {
        console.error('Lỗi tải chứng nhận:', err);
        setError('Không tìm thấy giấy chứng nhận hoặc lỗi kết nối.');
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <div style={{ minHeight: '300px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyStyle: 'center', justifyContent: 'center', gap: '12px', color: '#888' }}>
        <RefreshCw style={{ width: '24px', height: '24px', animation: 'spin 1.5s linear infinite' }} />
        <p>Đang tải thông tin chứng nhận...</p>
      </div>
    );
  }

  if (error || !cert) {
    return (
      <div style={{ padding: '40px 20px', textAlign: 'center' }}>
        <div style={{ fontSize: '48px', marginBottom: '16px' }}>😕</div>
        <h2 style={{ fontSize: '20px', fontWeight: 700, color: '#222', margin: '0 0 8px' }}>Không tìm thấy chứng nhận</h2>
        <p style={{ color: '#666', margin: '0 0 20px' }}>Mã chứng nhận <span style={{ fontFamily: 'monospace', fontWeight: 600 }}>#{id}</span> không tồn tại hoặc có lỗi xảy ra.</p>
        <Link href="/co-so-kinh-doanh/chung-nhan">
          <GovBtn variant="primary">Quay về danh sách</GovBtn>
        </Link>
      </div>
    );
  }

  const historyEvents = (() => {
    const banHanhDate = new Date(cert.ngayBanHanh);
    if (isNaN(banHanhDate.getTime())) return [];

    const formatDateObj = (d: Date) => {
      const day = String(d.getDate()).padStart(2, '0');
      const month = String(d.getMonth() + 1).padStart(2, '0');
      const year = d.getFullYear();
      return `${day}/${month}/${year}`;
    };

    const ngayNop = new Date(banHanhDate);
    ngayNop.setDate(banHanhDate.getDate() - 15);

    const ngayKiemTra = new Date(banHanhDate);
    ngayKiemTra.setDate(banHanhDate.getDate() - 7);

    return [
      {
        icon: <CheckCircle2 size={16} />,
        color: '#10B981',
        label: 'Nộp hồ sơ cấp chứng nhận',
        date: formatDateObj(ngayNop),
        note: 'Tiếp nhận hồ sơ qua cổng Dịch vụ công'
      },
      {
        icon: <ClipboardList size={16} />,
        color: '#3B82F6',
        label: 'Đoàn thanh tra thẩm định',
        date: formatDateObj(ngayKiemTra),
        note: 'Đánh giá điều kiện vệ sinh thực tế đạt yêu cầu'
      },
      {
        icon: <Shield size={16} />,
        color: '#059669',
        label: 'Phê duyệt & Ban hành',
        date: formatDate(cert.ngayBanHanh),
        note: `Trạng thái: ${mapStatusToLabel(cert.trangThai)}`
      }
    ];
  })();

  const isExpired = cert.ngayHetHan && new Date(cert.ngayHetHan) < new Date();

  return (
    <div>
      <PageHeader
        title={cert.tenCoSo || 'Chi tiết chứng nhận'}
        subtitle={`Mã chứng nhận: ${cert.maCN}`}
        badge={<StatusBadge variant={mapStatusToVariant(cert.trangThai)} label={mapStatusToLabel(cert.trangThai)} />}
        actions={
          <>
            <Link href="/co-so-kinh-doanh/chung-nhan">
              <GovBtn variant="secondary">
                <ArrowLeft size={12} /> Quay lại danh sách
              </GovBtn>
            </Link>
            <GovBtn variant="secondary" onClick={() => window.print()}>
              <Printer size={12} /> In chứng nhận
            </GovBtn>
          </>
        }
      />

      <div style={{ display: 'grid', gridTemplateColumns: '8fr 4fr', gap: '20px', marginTop: '16px' }}>
        {/* LEFT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SectionCard title="Thông tin chứng nhận">
            <div style={{ padding: '20px' }}>
              <div style={{ marginBottom: '24px' }}>
                <Label>Cơ sở kinh doanh được cấp</Label>
                <p style={{ fontSize: '22px', fontWeight: 800, color: '#111', margin: 0 }}>
                  {cert.tenCoSo || '—'}
                </p>
                {cert.maCoSo && (
                  <p style={{ fontSize: '12px', color: '#555', margin: '4px 0 0' }}>
                    Mã số cơ sở: <strong style={{ color: '#005A9E' }}>{cert.maCoSo}</strong>
                  </p>
                )}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <Label>Tên chứng nhận</Label>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#F5F5F5', padding: '6px 12px', borderRadius: '2px', fontSize: '13px', fontWeight: 600, color: '#333' }}>
                    <Shield size={14} style={{ color: '#008000' }} /> {cert.tenChungNhan}
                  </div>
                </div>

                <div>
                  <Label>Mã chứng nhận</Label>
                  <p style={{ fontFamily: 'monospace', fontSize: '18px', fontWeight: 700, color: '#005A9E', margin: 0 }}>
                    {cert.maCN}
                  </p>
                </div>

                <div>
                  <Label>Ngày cấp / Ngày ban hành</Label>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: '#333', margin: 0 }}>
                    {formatDate(cert.ngayBanHanh)}
                  </p>
                </div>

                <div>
                  <Label>Ngày hết hạn hiệu lực</Label>
                  <p style={{ fontSize: '15px', fontWeight: 600, color: isExpired ? '#CC0000' : '#333', margin: 0 }}>
                    {formatDate(cert.ngayHetHan)} {isExpired && <span style={{ fontSize: '11px', color: '#CC0000' }}>(Hết hiệu lực)</span>}
                  </p>
                </div>

                {business && (
                  <>
                    <div>
                      <Label>Số đăng ký kinh doanh</Label>
                      <p style={{ fontFamily: 'monospace', fontSize: '14px', color: '#333', margin: 0 }}>
                        {business.soGiayPhep || '—'}
                      </p>
                    </div>
                    <div>
                      <Label>Chủ sở hữu cơ sở</Label>
                      <p style={{ fontSize: '14px', color: '#333', margin: 0 }}>
                        {business.tenChuSoHuu || '—'}
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Quy định an toàn thực phẩm liên quan">
            <div style={{ padding: '20px', fontSize: '13px', color: '#555', lineHeight: '1.6' }}>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'flex-start', background: '#FAFAFA', border: '1px solid #E8E8E8', padding: '12px', marginBottom: '12px' }}>
                <Info size={18} style={{ color: '#005A9E', flexShrink: 0, marginTop: '2px' }} />
                <div>
                  <strong style={{ color: '#222', display: 'block', marginBottom: '4px' }}>Nghĩa vụ của cơ sở được cấp giấy chứng nhận:</strong>
                  1. Phải duy trì liên tục các điều kiện vệ sinh an toàn thực phẩm đối với trang thiết bị, nhân sự và quy trình chế biến sản xuất.<br />
                  2. Trưng bày công khai bản gốc Giấy chứng nhận tại địa điểm kinh doanh.<br />
                  3. Thực hiện thủ tục gia hạn ít nhất 01 tháng trước khi hết thời hạn hiệu lực ghi trên chứng nhận.
                </div>
              </div>
              <p style={{ margin: 0 }}>
                Mọi hành vi tẩy xóa, sửa chữa thông tin trên Giấy chứng nhận hoặc không tuân thủ các quy chuẩn kỹ thuật quốc gia về ATTP sẽ bị xử phạt hành chính hoặc thu hồi chứng nhận theo quy định pháp luật hiện hành.
              </p>
            </div>
          </SectionCard>
        </div>

        {/* RIGHT COLUMN */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <SectionCard title="Cơ quan quản lý">
            <div style={{ padding: '0 16px' }}>
              <MetaRow icon={<Building2 size={16} />} label="Cơ quan ban hành" value="Chi cục An toàn Vệ sinh Thực phẩm Đà Nẵng" />
              {business && (
                <MetaRow icon={<MapPin size={16} />} label="Địa bàn trực thuộc" value={business.tenPhuongXa || '—'} />
              )}
              <MetaRow icon={<User size={16} />} label="Phân hệ cấp" value="Lãnh đạo ATVSTP TP. Đà Nẵng" />
            </div>
          </SectionCard>

          <SectionCard title="Xác minh số & Mã QR">
            <div style={{ padding: '16px', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', padding: '12px', background: '#FFF', border: '1px solid #D6D6D6', borderRadius: '4px', marginBottom: '16px' }}>
                <QrCode size={110} style={{ color: '#333' }} />
              </div>
              <div style={{ background: isExpired ? '#FFF0F0' : '#F0FBF0', border: `1px solid ${isExpired ? '#F5C2C2' : '#C2F5C2'}`, padding: '12px', borderRadius: '2px' }}>
                <CalendarClock size={18} style={{ color: isExpired ? '#CC0000' : '#008000', display: 'inline-block', marginBottom: '6px' }} />
                <p style={{ fontSize: '10px', textTransform: 'uppercase', fontWeight: 600, color: '#666', margin: '0 0 2px' }}>Hiệu lực giấy phép</p>
                <p style={{ fontSize: '18px', fontWeight: 700, fontFamily: 'monospace', color: isExpired ? '#CC0000' : '#006400', margin: 0 }}>
                  {formatDate(cert.ngayHetHan)}
                </p>
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Tiến trình phê duyệt hồ sơ">
            <div style={{ padding: '16px' }}>
              {historyEvents.length === 0 ? (
                <div style={{ color: '#888', fontSize: '12.5px' }}>Không có lịch sử phê duyệt.</div>
              ) : (
                <div style={{ position: 'relative', paddingLeft: '24px' }}>
                  <div style={{ position: 'absolute', left: '7px', top: '8px', bottom: '8px', width: '2px', background: '#E8E8E8' }} />
                  {historyEvents.map((ev, i) => (
                    <div key={i} style={{ position: 'relative', marginBottom: '16px' }}>
                      <div
                        style={{
                          position: 'absolute', left: '-24px', top: '2px',
                          width: '16px', height: '16px', borderRadius: '50%',
                          background: ev.color, display: 'flex', alignItems: 'center', justifyContent: 'center',
                          color: '#FFF', fontSize: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}
                      >
                        {ev.icon}
                      </div>
                      <div>
                        <p style={{ fontSize: '12.5px', fontWeight: 600, color: '#333', margin: 0 }}>{ev.label}</p>
                        <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#888', margin: '2px 0' }}>{ev.date}</p>
                        <p style={{ fontSize: '12px', color: '#666', margin: 0 }}>{ev.note}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
}