'use client';

import { useState } from 'react';
import { useParams, useRouter, useSearchParams } from 'next/navigation';
import { FiArrowLeft, FiEdit3, FiFileText, FiMapPin, FiPhone, FiPrinter } from 'react-icons/fi';
import { LuBadgeCheck, LuBuilding2, LuCalendarClock, LuClipboardList, LuFileClock, LuShieldAlert } from 'react-icons/lu';
import { GovBtn, GovInput, GovSelect, PageHeader, SectionCard } from '@/components/GovUI';

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
  {
    id: 'GP-2025001',
    businessName: 'Nhà hàng Hải Sản Biển Xanh',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '10/01/2025',
    expiryDate: '09/01/2026',
    status: 'valid',
    district: 'Hải Châu',
  },
  {
    id: 'GP-2025002',
    businessName: 'Quán Ăn Gia Đình Việt',
    type: 'Giấy phép VSATTP',
    issueDate: '15/02/2025',
    expiryDate: '14/02/2025',
    status: 'expired',
    district: 'Thanh Khê',
  },
  {
    id: 'GP-2025003',
    businessName: 'Cửa hàng Thực phẩm Sạch Organic',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '20/03/2025',
    expiryDate: '19/03/2026',
    status: 'valid',
    district: 'Ngũ Hành Sơn',
  },
  {
    id: 'GP-2025004',
    businessName: 'Siêu thị Mini Mart Đà Nẵng',
    type: 'Giấy phép kinh doanh thực phẩm',
    issueDate: '05/01/2025',
    expiryDate: '04/01/2026',
    status: 'revoked',
    district: 'Sơn Trà',
  },
];

const STATUS_CONFIG = {
  valid: {
    label: 'Còn hiệu lực',
    icon: LuBadgeCheck,
    bg: '#E6F4E6',
    color: '#006400',
    border: '#94C994',
  },
  expired: {
    label: 'Hết hạn',
    icon: LuFileClock,
    bg: '#FFF4E5',
    color: '#CC6600',
    border: '#FFCC80',
  },
  revoked: {
    label: 'Đã thu hồi',
    icon: LuShieldAlert,
    bg: '#FDECEA',
    color: '#CC0000',
    border: '#F5BCBC',
  },
} as const;

function StatusBadge({ status }: { status: License['status'] }) {
  const config = STATUS_CONFIG[status];
  const Icon = config.icon;

  return (
    <span
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        height: '24px',
        padding: '0 10px',
        borderRadius: '2px',
        border: `1px solid ${config.border}`,
        background: config.bg,
        color: config.color,
        fontSize: '11px',
        fontWeight: 700,
        whiteSpace: 'nowrap',
      }}
    >
      <Icon style={{ width: '13px', height: '13px' }} />
      {config.label}
    </span>
  );
}

function InfoBox({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div
      style={{
        border: '1px solid #D6D6D6',
        background: '#FAFAFA',
        padding: '10px 12px',
      }}
    >
      <div
        style={{
          fontSize: '11px',
          fontWeight: 700,
          color: '#666',
          textTransform: 'uppercase',
          letterSpacing: '0.04em',
          marginBottom: '5px',
        }}
      >
        {label}
      </div>
      <div style={{ fontSize: '13px', fontWeight: 600, color: '#222', lineHeight: 1.6 }}>
        {value}
      </div>
    </div>
  );
}

function SectionTitle({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div style={{ marginBottom: '12px' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
        <span style={{ color: '#008000', display: 'inline-flex', alignItems: 'center' }}>{icon}</span>
        <h3 style={{ margin: 0, fontSize: '13px', fontWeight: 700, color: '#006400', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          {title}
        </h3>
      </div>
      <p style={{ margin: 0, fontSize: '12px', color: '#666' }}>{description}</p>
    </div>
  );
}

export default function GiayPhepDetailPage() {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = params.id as string;
  const initialLicense = mockLicenses.find((item) => item.id === id) ?? null;
  const [license, setLicense] = useState<License | null>(initialLicense);
  const [viewMode, setViewMode] = useState<'detail' | 'edit'>(
    searchParams.get('mode') === 'edit' ? 'edit' : 'detail'
  );
  const [editForm, setEditForm] = useState<License | null>(initialLicense);

  if (!license) {
    return (
      <div>
        <PageHeader
          title="Hồ sơ giấy phép"
          subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng"
          actions={
            <GovBtn variant="secondary" onClick={() => router.push('/co-so-kinh-doanh/giay-phep')}>
              <FiArrowLeft style={{ width: 12, height: 12 }} /> Quay lại
            </GovBtn>
          }
        />

        <SectionCard title="Không tìm thấy hồ sơ">
          <div style={{ padding: '16px', fontSize: '13px', color: '#444', lineHeight: 1.7 }}>
            Không tìm thấy giấy phép với mã <span style={{ fontFamily: 'monospace', fontWeight: 700 }}>{id}</span>.
            Hồ sơ có thể không tồn tại hoặc không còn trong danh sách hiển thị.
          </div>
        </SectionCard>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title="Hồ sơ giấy phép kinh doanh thực phẩm"
        subtitle="Chi cục An toàn Thực phẩm TP. Đà Nẵng — thông tin chi tiết giấy phép của cơ sở"
        actions={
          <>
            <GovBtn variant="secondary" onClick={() => router.back()}>
              <FiArrowLeft style={{ width: 12, height: 12 }} /> Quay lại danh sách
            </GovBtn>
            <GovBtn variant="secondary">
              <FiPrinter style={{ width: 12, height: 12 }} /> In giấy phép
            </GovBtn>
            <GovBtn
              variant="primary"
              onClick={() => {
                setEditForm({ ...license });
                setViewMode('edit');
              }}
            >
              <FiEdit3 style={{ width: 12, height: 12 }} /> Gia hạn / Chỉnh sửa
            </GovBtn>
          </>
        }
      />

      {viewMode === 'detail' ? (
        <>
      <SectionCard title="Tổng quan hồ sơ">
        <div style={{ padding: '14px' }}>
          <div
            style={{
              border: '1px solid #CFE6CF',
              background: '#F8FBF8',
              padding: '14px',
              marginBottom: '12px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                gap: '12px',
                alignItems: 'flex-start',
                flexWrap: 'wrap',
              }}
            >
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px', flexWrap: 'wrap' }}>
                  <span
                    style={{
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      fontWeight: 700,
                      color: '#005A9E',
                      background: '#EAF3FB',
                      border: '1px solid #C7DDF0',
                      padding: '4px 8px',
                    }}
                  >
                    {license.id}
                  </span>
                  <StatusBadge status={license.status} />
                </div>
                <div style={{ fontSize: '22px', fontWeight: 800, color: '#1F2937', marginBottom: '4px' }}>
                  {license.businessName}
                </div>
                <div style={{ fontSize: '13px', color: '#555' }}>{license.type}</div>
              </div>

              <div
                style={{
                  minWidth: '250px',
                  border: '1px solid #D6D6D6',
                  background: '#fff',
                  padding: '12px',
                }}
              >
                <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '8px' }}>
                  Đánh giá nhanh
                </div>
                <div style={{ fontSize: '13px', color: '#222', lineHeight: 1.7 }}>
                  <div>Trạng thái hiện tại: <strong>{STATUS_CONFIG[license.status].label}</strong></div>
                  <div>Ngày cấp: <strong>{license.issueDate}</strong></div>
                  <div>Ngày hết hạn: <strong>{license.expiryDate}</strong></div>
                </div>
              </div>
            </div>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, minmax(0, 1fr))',
              gap: '10px',
            }}
          >
            <InfoBox label="Ngày cấp" value={license.issueDate} />
            <InfoBox label="Ngày hết hạn" value={license.expiryDate} />
            <InfoBox label="Quận/Huyện" value={license.district} />
          </div>
        </div>
      </SectionCard>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.05fr 0.95fr',
          gap: '12px',
        }}
      >
        <div>
          <SectionCard title="Thông tin giấy phép">
            <div style={{ padding: '14px' }}>
              <SectionTitle
                icon={<LuFileClock style={{ width: 14, height: 14 }} />}
                title="Thông tin pháp lý"
                description="Các trường dữ liệu pháp lý cốt lõi của hồ sơ giấy phép."
              />

              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(2, minmax(0, 1fr))',
                  gap: '10px',
                }}
              >
                <InfoBox label="Mã giấy phép" value={<span style={{ fontFamily: 'monospace' }}>{license.id}</span>} />
                <InfoBox label="Loại giấy phép" value={license.type} />
                <InfoBox label="Ngày cấp" value={license.issueDate} />
                <InfoBox label="Ngày hết hạn" value={license.expiryDate} />
                <InfoBox label="Trạng thái" value={<StatusBadge status={license.status} />} />
                <InfoBox label="Khu vực quản lý" value={license.district} />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Ghi chú và cam kết">
            <div style={{ padding: '14px' }}>
              <SectionTitle
                icon={<LuClipboardList style={{ width: 14, height: 14 }} />}
                title="Nội dung hồ sơ"
                description="Ghi chú tổng hợp và nghĩa vụ tuân thủ của cơ sở trong thời gian giấy phép còn hiệu lực."
              />

              <div
                style={{
                  border: '1px solid #D6D6D6',
                  background: '#FAFAFA',
                  padding: '12px 14px',
                  fontSize: '13px',
                  color: '#333',
                  lineHeight: 1.8,
                }}
              >
                Giấy phép này được cấp theo quy định về an toàn thực phẩm hiện hành. Cơ sở phải duy trì điều
                kiện vệ sinh, hồ sơ nguồn gốc, khu vực chế biến và nhân sự đáp ứng đúng tiêu chuẩn trong suốt
                thời gian hiệu lực của giấy phép. Khi gần đến hạn, hồ sơ cần được rà soát để thực hiện gia hạn
                hoặc cập nhật lại thông tin pháp lý nếu có thay đổi.
              </div>
            </div>
          </SectionCard>
        </div>

        <div>
          <SectionCard title="Thông tin cơ sở">
            <div style={{ padding: '14px' }}>
              <SectionTitle
                icon={<LuBuilding2 style={{ width: 14, height: 14 }} />}
                title="Thông tin liên hệ"
                description="Dữ liệu nhận diện cơ sở phục vụ đối chiếu hồ sơ và kiểm tra thực địa."
              />

              <div style={{ display: 'grid', gap: '10px' }}>
                <InfoBox label="Tên cơ sở" value={license.businessName} />
                <InfoBox
                  label="Địa chỉ"
                  value={
                    <span style={{ display: 'inline-flex', gap: '6px', alignItems: 'flex-start' }}>
                      <FiMapPin style={{ width: 14, height: 14, color: '#666', marginTop: '2px' }} />
                      <span>123 Nguyễn Thị Minh Khai, {license.district}, Đà Nẵng</span>
                    </span>
                  }
                />
                <InfoBox
                  label="Điện thoại"
                  value={
                    <span style={{ display: 'inline-flex', gap: '6px', alignItems: 'center' }}>
                      <FiPhone style={{ width: 14, height: 14, color: '#666' }} />
                      <span>0236 123 4567</span>
                    </span>
                  }
                />
              </div>
            </div>
          </SectionCard>

          <SectionCard title="Lịch sử hồ sơ">
            <div style={{ padding: '14px' }}>
              <SectionTitle
                icon={<FiFileText style={{ width: 14, height: 14 }} />}
                title="Mốc quản lý"
                description="Các mốc chính liên quan đến quá trình tạo lập và theo dõi hiệu lực giấy phép."
              />

              <div style={{ display: 'grid', gap: '10px' }}>
                <div
                  style={{
                    border: '1px solid #D6D6D6',
                    background: '#FAFAFA',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <LuBadgeCheck style={{ width: 14, height: 14, color: '#008000' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#222' }}>
                      Giấy phép được cấp lần đầu
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{license.issueDate}</div>
                </div>

                <div
                  style={{
                    border: '1px solid #D6D6D6',
                    background: '#FAFAFA',
                    padding: '12px 14px',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                    <LuCalendarClock style={{ width: 14, height: 14, color: '#005A9E' }} />
                    <span style={{ fontSize: '13px', fontWeight: 700, color: '#222' }}>
                      Mốc rà soát hiệu lực tiếp theo
                    </span>
                  </div>
                  <div style={{ fontSize: '12px', color: '#666' }}>{license.expiryDate}</div>
                </div>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
        </>
      ) : editForm ? (
        <SectionCard
          title={`Chỉnh sửa giấy phép: ${editForm.id}`}
          actions={
            <>
              <GovBtn
                variant="secondary"
                onClick={() => {
                  setEditForm({ ...license });
                  setViewMode('detail');
                }}
              >
                <FiArrowLeft style={{ width: 12, height: 12 }} /> Hủy chỉnh sửa
              </GovBtn>
              <GovBtn
                variant="primary"
                onClick={() => {
                  setLicense({ ...editForm });
                  setViewMode('detail');
                }}
              >
                <FiEdit3 style={{ width: 12, height: 12 }} /> Lưu cập nhật
              </GovBtn>
            </>
          }
        >
          <div style={{ padding: '14px' }}>
            <div
              style={{
                border: '1px solid #D6D6D6',
                background: '#F8FBF8',
                padding: '12px 14px',
                marginBottom: '12px',
                fontSize: '13px',
                color: '#444',
                lineHeight: 1.7,
              }}
            >
              Chỉnh sửa nhanh hồ sơ giấy phép ngay trên trang hiện tại. Khi lưu, phần thông tin chi tiết sẽ
              cập nhật ngay mà không cần mở popup hay chuyển sang màn khác.
            </div>

            <div
              style={{
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '12px',
              }}
            >
              <SectionCard title="Thông tin giấy phép">
                <div style={{ padding: '14px', display: 'grid', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Mã giấy phép
                    </div>
                    <GovInput value={editForm.id} onChange={() => {}} width="100%" />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Loại giấy phép
                    </div>
                    <GovInput
                      value={editForm.type}
                      onChange={(value) => setEditForm((current) => current ? { ...current, type: value } : current)}
                      width="100%"
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Ngày cấp
                    </div>
                    <GovInput
                      value={editForm.issueDate}
                      onChange={(value) => setEditForm((current) => current ? { ...current, issueDate: value } : current)}
                      width="100%"
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Ngày hết hạn
                    </div>
                    <GovInput
                      value={editForm.expiryDate}
                      onChange={(value) => setEditForm((current) => current ? { ...current, expiryDate: value } : current)}
                      width="100%"
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Trạng thái
                    </div>
                    <GovSelect
                      value={editForm.status}
                      onChange={(value) =>
                        setEditForm((current) => current ? { ...current, status: value as License['status'] } : current)
                      }
                      options={[
                        { value: 'valid', label: 'Còn hiệu lực' },
                        { value: 'expired', label: 'Hết hạn' },
                        { value: 'revoked', label: 'Đã thu hồi' },
                      ]}
                      width="100%"
                    />
                  </div>
                </div>
              </SectionCard>

              <SectionCard title="Thông tin cơ sở">
                <div style={{ padding: '14px', display: 'grid', gap: '12px' }}>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Tên cơ sở
                    </div>
                    <GovInput
                      value={editForm.businessName}
                      onChange={(value) => setEditForm((current) => current ? { ...current, businessName: value } : current)}
                      width="100%"
                    />
                  </div>
                  <div>
                    <div style={{ fontSize: '11px', fontWeight: 700, color: '#666', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '4px' }}>
                      Quận/Huyện
                    </div>
                    <GovSelect
                      value={editForm.district}
                      onChange={(value) => setEditForm((current) => current ? { ...current, district: value } : current)}
                      options={[
                        { value: 'Hải Châu', label: 'Hải Châu' },
                        { value: 'Thanh Khê', label: 'Thanh Khê' },
                        { value: 'Ngũ Hành Sơn', label: 'Ngũ Hành Sơn' },
                        { value: 'Sơn Trà', label: 'Sơn Trà' },
                      ]}
                      width="100%"
                    />
                  </div>
                  <div
                    style={{
                      border: '1px solid #D6D6D6',
                      background: '#FAFAFA',
                      padding: '12px 14px',
                      fontSize: '13px',
                      color: '#333',
                      lineHeight: 1.8,
                    }}
                  >
                    Thao tác này hiện đang chỉnh sửa dữ liệu mock ở frontend để hoàn thiện luồng giao diện.
                    Nếu bạn muốn, mình có thể nối tiếp form này với backend/API ở bước sau.
                  </div>
                </div>
              </SectionCard>
            </div>
          </div>
        </SectionCard>
      ) : null}
    </div>
  );
}
