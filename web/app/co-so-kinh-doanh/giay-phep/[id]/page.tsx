'use client';

import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import {
  FiArrowLeft,
  FiEdit3,
  FiFileText,
  FiMapPin,
  FiPhone,
  FiPrinter,
} from 'react-icons/fi';
import {
  LuBadgeCheck,
  LuBuilding2,
  LuCalendarClock,
  LuClipboardList,
  LuFileClock,
  LuShieldAlert,
} from 'react-icons/lu';

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
    badgeClassName: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    panelClassName: 'border-emerald-200 bg-emerald-50/80',
    icon: LuBadgeCheck,
  },
  expired: {
    label: 'Hết hạn',
    badgeClassName: 'border-amber-200 bg-amber-50 text-amber-700',
    panelClassName: 'border-amber-200 bg-amber-50/80',
    icon: LuFileClock,
  },
  revoked: {
    label: 'Đã thu hồi',
    badgeClassName: 'border-rose-200 bg-rose-50 text-rose-700',
    panelClassName: 'border-rose-200 bg-rose-50/80',
    icon: LuShieldAlert,
  },
} as const;

function InfoField({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
        {label}
      </p>
      <div className="text-[14px] font-semibold text-slate-800">{value}</div>
    </div>
  );
}

function SectionBlock({
  icon,
  title,
  description,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start gap-3">
        <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-sky-100 to-teal-100 text-sky-700">
          {icon}
        </div>
        <div>
          <h2 className="text-[16px] font-bold text-slate-900">{title}</h2>
          <p className="mt-1 text-[13px] text-slate-500">{description}</p>
        </div>
      </div>
      {children}
    </section>
  );
}

export default function GiayPhepDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;
  const license = mockLicenses.find((item) => item.id === id) ?? null;

  if (!license) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f3f7f5] px-6 py-20 text-center">
        <div className="flex h-20 w-20 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-sm">
          <LuFileClock className="text-[32px]" />
        </div>
        <h2 className="mt-6 text-2xl font-black tracking-tight text-slate-900">
          Không tìm thấy giấy phép
        </h2>
        <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
          Hồ sơ giấy phép mã <span className="font-mono font-semibold text-slate-700">{id}</span>{' '}
          hiện không tồn tại hoặc đã bị xóa khỏi danh sách hiển thị.
        </p>
        <Link
          href="/co-so-kinh-doanh/giay-phep"
          className="mt-8 inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-5 py-3 text-sm font-semibold text-white transition hover:bg-sky-800"
        >
          <FiArrowLeft className="text-[15px]" />
          Quay về danh sách giấy phép
        </Link>
      </div>
    );
  }

  const statusCfg = STATUS_CONFIG[license.status];
  const StatusIcon = statusCfg.icon;

  return (
    <div className="min-h-screen bg-[#f3f7f5]">
      <div className="h-1 w-full bg-gradient-to-r from-sky-700 via-teal-600 to-emerald-500" />

      <div className="mx-auto max-w-[1180px] px-6 py-8">
        <div className="mb-7 flex flex-wrap items-center gap-3 text-sm">
          <button
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50"
          >
            <FiArrowLeft className="text-[14px]" />
            Quay lại danh sách
          </button>
          <div className="h-4 w-px bg-slate-300" />
          <span className="text-[11px] font-bold uppercase tracking-[0.16em] text-sky-700">
            Sở An Toàn Thực Phẩm • Đà Nẵng
          </span>
        </div>

        <section className="overflow-hidden rounded-[28px] border border-sky-100 bg-gradient-to-br from-sky-50 via-white to-teal-50 shadow-sm">
          <div className="flex flex-col gap-6 p-7 lg:flex-row lg:items-start lg:justify-between">
            <div className="space-y-4">
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full border border-sky-200 bg-white px-3 py-1 font-mono text-[12px] font-semibold text-sky-700">
                  {license.id}
                </span>
                <span
                  className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-[12px] font-semibold ${statusCfg.badgeClassName}`}
                >
                  <StatusIcon className="text-[14px]" />
                  {statusCfg.label}
                </span>
              </div>

              <div>
                <h1 className="text-[28px] font-black tracking-tight text-slate-900">
                  {license.businessName}
                </h1>
                <p className="mt-1 text-[14px] text-slate-600">{license.type}</p>
              </div>

              <div className="grid gap-3 md:grid-cols-3">
                <InfoField label="Ngày cấp" value={license.issueDate} />
                <InfoField label="Ngày hết hạn" value={license.expiryDate} />
                <InfoField label="Quận/Huyện" value={license.district} />
              </div>
            </div>

            <div className="grid min-w-[290px] gap-3">
              <div className={`rounded-3xl border p-4 shadow-sm ${statusCfg.panelClassName}`}>
                <div className="flex items-start gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/80 text-slate-700">
                    <StatusIcon className="text-[20px]" />
                  </div>
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">
                      Tình trạng giấy phép
                    </p>
                    <p className="mt-1 text-[15px] font-bold text-slate-900">
                      {statusCfg.label}
                    </p>
                    <p className="mt-1 text-[13px] leading-6 text-slate-600">
                      Hồ sơ hiện đang ở trạng thái pháp lý tương ứng với thời hạn và quyết định quản lý hiện tại.
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-wrap gap-3">
                <button className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 shadow-sm transition hover:bg-slate-50">
                  <FiPrinter className="text-[15px]" />
                  In giấy phép
                </button>
                <button className="inline-flex items-center gap-2 rounded-2xl bg-sky-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-sky-800">
                  <FiEdit3 className="text-[15px]" />
                  Gia hạn / Chỉnh sửa
                </button>
              </div>
            </div>
          </div>
        </section>

        <div className="mt-7 grid grid-cols-1 gap-6 lg:grid-cols-12">
          <div className="space-y-6 lg:col-span-8">
            <SectionBlock
              icon={<LuFileClock className="text-[18px]" />}
              title="Thông Tin Giấy Phép"
              description="Các thông tin pháp lý cốt lõi của giấy phép kinh doanh thực phẩm."
            >
              <div className="grid gap-4 md:grid-cols-2">
                <InfoField label="Mã giấy phép" value={<span className="font-mono">{license.id}</span>} />
                <InfoField label="Loại giấy phép" value={license.type} />
                <InfoField label="Ngày cấp" value={license.issueDate} />
                <InfoField
                  label="Ngày hết hạn"
                  value={
                    <span className={license.status === 'expired' ? 'text-rose-600' : 'text-slate-800'}>
                      {license.expiryDate}
                    </span>
                  }
                />
                <InfoField label="Trạng thái" value={<span>{statusCfg.label}</span>} />
                <InfoField label="Khu vực quản lý" value={license.district} />
              </div>
            </SectionBlock>

            <SectionBlock
              icon={<LuClipboardList className="text-[18px]" />}
              title="Ghi Chú Và Cam Kết"
              description="Tóm tắt bối cảnh cấp phép và nghĩa vụ tuân thủ của cơ sở."
            >
              <div className="rounded-2xl border border-slate-200 bg-slate-50 px-5 py-4 text-[14px] leading-7 text-slate-700">
                Giấy phép này được cấp theo quy định về an toàn thực phẩm hiện hành. Cơ sở phải duy trì điều
                kiện vệ sinh, hồ sơ nguồn gốc, khu vực chế biến và nhân sự đáp ứng đúng tiêu chuẩn trong suốt
                thời gian hiệu lực của giấy phép.
              </div>
            </SectionBlock>
          </div>

          <div className="space-y-6 lg:col-span-4">
            <SectionBlock
              icon={<LuBuilding2 className="text-[18px]" />}
              title="Thông Tin Liên Hệ"
              description="Dữ liệu cơ sở phục vụ đối chiếu hồ sơ và kiểm tra thực địa."
            >
              <div className="space-y-3">
                <InfoField label="Tên cơ sở" value={license.businessName} />
                <InfoField
                  label="Địa chỉ"
                  value={
                    <span className="inline-flex items-start gap-2">
                      <FiMapPin className="mt-0.5 text-[14px] text-slate-500" />
                      <span>123 Nguyễn Thị Minh Khai, {license.district}, Đà Nẵng</span>
                    </span>
                  }
                />
                <InfoField
                  label="Điện thoại"
                  value={
                    <span className="inline-flex items-center gap-2">
                      <FiPhone className="text-[14px] text-slate-500" />
                      0236 123 4567
                    </span>
                  }
                />
              </div>
            </SectionBlock>

            <SectionBlock
              icon={<FiFileText className="text-[18px]" />}
              title="Lịch Sử Hồ Sơ"
              description="Các mốc chính liên quan đến quá trình hình thành và quản lý giấy phép."
            >
              <div className="space-y-4">
                <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    <LuBadgeCheck className="text-[15px]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">
                      Giấy phép được cấp lần đầu
                    </p>
                    <p className="mt-1 text-[12px] text-slate-500">{license.issueDate}</p>
                  </div>
                </div>

                <div className="flex gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-4">
                  <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-sky-700">
                    <LuCalendarClock className="text-[15px]" />
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-slate-800">
                      Mốc rà soát hiệu lực tiếp theo
                    </p>
                    <p className="mt-1 text-[12px] text-slate-500">{license.expiryDate}</p>
                  </div>
                </div>
              </div>
            </SectionBlock>
          </div>
        </div>
      </div>
    </div>
  );
}
