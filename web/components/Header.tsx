'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Bell, LogOut } from 'lucide-react';
import { useRole } from '@/lib/RoleContext';
import { useAuth } from '@/lib/AuthContext';
import { roleLabels } from '@/data/mockData';
import { cn } from '@/lib/utils';

const breadcrumbMap: Record<string, string[]> = {
  '/dashboard': ['Tổng quan'],
  '/co-so-kinh-doanh': ['Cơ sở kinh doanh', 'Danh sách cơ sở'],
  '/co-so-kinh-doanh/giay-phep': ['Cơ sở kinh doanh', 'Giấy phép'],
  '/co-so-kinh-doanh/phap-ly': ['Cơ sở kinh doanh', 'Tình trạng pháp lý'],
  '/co-so-kinh-doanh/chung-nhan': ['Cơ sở kinh doanh', 'Phê duyệt chứng nhận'],
  '/thanh-tra-kiem-dinh': ['Thanh tra & Kiểm định', 'Hồ sơ thanh tra'],
  '/thanh-tra-kiem-dinh/nhiem-vu': ['Thanh tra & Kiểm định', 'Nhiệm vụ kiểm tra'],
  '/thanh-tra-kiem-dinh/bao-cao': ['Thanh tra & Kiểm định', 'Báo cáo'],
  '/thanh-tra-kiem-dinh/yeu-cau': ['Thanh tra & Kiểm định', 'Yêu cầu kiểm nghiệm'],
  '/thanh-tra-kiem-dinh/ket-qua': ['Thanh tra & Kiểm định', 'Kết quả kiểm nghiệm'],
  '/thanh-tra-kiem-dinh/khieu-nai': ['Thanh tra & Kiểm định', 'Khiếu nại'],
  '/vi-pham': ['Vi phạm & Phản ánh', 'Danh sách vi phạm'],
  '/vi-pham/xu-phat': ['Vi phạm & Phản ánh', 'Xử phạt'],
  '/vi-pham/khac-phuc': ['Vi phạm & Phản ánh', 'Theo dõi khắc phục'],
  '/phan-anh-cong-dan': ['Vi phạm & Phản ánh', 'Phản ánh công dân'],
  '/truyen-thong': ['Truyền thông', 'Tổng quan'],
  '/truyen-thong/quy-dinh': ['Truyền thông', 'Quy định pháp luật'],
  '/truyen-thong/thong-bao': ['Truyền thông', 'Thông báo'],
  '/truyen-thong/canh-bao': ['Truyền thông', 'Cảnh báo'],
  '/cai-dat/nguoi-dung': ['Cài đặt hệ thống', 'Quản lý người dùng'],
  '/cai-dat/nhat-ky': ['Cài đặt hệ thống', 'Nhật ký hệ thống'],
  '/cai-dat/may-chu': ['Cài đặt hệ thống', 'Giám sát máy chủ'],
};

function formatDateTime() {
  return new Intl.DateTimeFormat('vi-VN', {
    weekday: 'short',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date());
}

export default function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { role } = useRole();
  const { user, logout } = useAuth();
  const crumbs = breadcrumbMap[pathname] ?? ['Hệ thống'];

  // Avatar initials: last 2 words of fullName
  const avatarInitials = user?.fullName
    ? user.fullName.split(' ').slice(-2).map((w) => w[0]).join('').toUpperCase()
    : '?';

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="h-11 bg-white border-b border-[#D6D6D6] flex items-center px-4 gap-4 shrink-0 z-30">
      {/* Breadcrumb */}
      <nav className="gov-breadcrumb flex-1 min-w-0" aria-label="Đường dẫn">
        <Link href="/dashboard" className="text-[#008000] hover:underline shrink-0">
          Trang chủ
        </Link>
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1 min-w-0">
            <span className="gov-breadcrumb-sep">›</span>
            <span
              className={cn(
                'truncate',
                i === crumbs.length - 1 ? 'text-[#222] font-semibold' : 'text-[#666]'
              )}
            >
              {c}
            </span>
          </span>
        ))}
      </nav>

      {/* Ngày giờ + version */}
      <div className="hidden lg:flex items-center gap-3 text-[11px] text-[#555] shrink-0">
        <span>{formatDateTime()}</span>
        <span className="text-[#D6D6D6]">|</span>
        <span>
          v<strong className="text-[#333]">2.1.0</strong>
        </span>
      </div>

      {/* Thông báo */}
      <button
        type="button"
        className="relative w-8 h-8 flex items-center justify-center border border-[#D6D6D6] rounded-sm text-[#555] hover:bg-[#F5F5F5] hover:text-[#222] shrink-0"
        aria-label="Thông báo"
      >
        <Bell className="w-4 h-4" strokeWidth={1.75} />
        <span className="absolute -top-1 -right-1 min-w-[14px] h-[14px] px-0.5 bg-[#CC0000] text-white text-[9px] font-bold rounded-sm flex items-center justify-center border border-white">
          3
        </span>
      </button>

      {/* User info + Logout */}
      <div className="flex items-center gap-2 pl-3 border-l border-[#D6D6D6] shrink-0">
        <div className="w-7 h-7 rounded-sm bg-[#006400] flex items-center justify-center text-[11px] font-semibold text-white">
          {avatarInitials}
        </div>
        <div className="hidden sm:block min-w-0">
          <p className="text-[11.5px] font-semibold text-[#222] leading-tight truncate max-w-[140px]">
            {user?.fullName ?? roleLabels[role]}
          </p>
          <p className="text-[10.5px] text-[#666] leading-tight truncate max-w-[140px]">
            {roleLabels[role]}
          </p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          title="Đăng xuất"
          className="w-7 h-7 flex items-center justify-center border border-[#D6D6D6] rounded-sm text-[#555] hover:bg-red-50 hover:text-[#CC0000] hover:border-[#CC0000] transition-colors ml-1"
          aria-label="Đăng xuất"
        >
          <LogOut className="w-3.5 h-3.5" strokeWidth={1.75} />
        </button>
      </div>
    </header>
  );
}
