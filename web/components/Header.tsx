'use client';

import { usePathname } from 'next/navigation';
import { useRole } from '@/lib/RoleContext';
import { Role, roleLabels } from '@/data/mockData';
import { cn } from '@/lib/utils';

// Map pathname → breadcrumb labels
const breadcrumbMap: Record<string, string[]> = {
  '/dashboard':                        ['Tổng quan'],
  '/co-so-kinh-doanh':                 ['Cơ sở kinh doanh', 'Danh sách cơ sở'],
  '/co-so-kinh-doanh/giay-phep':       ['Cơ sở kinh doanh', 'Giấy phép'],
  '/co-so-kinh-doanh/phap-ly':         ['Cơ sở kinh doanh', 'Tình trạng pháp lý'],
  '/co-so-kinh-doanh/chung-nhan':      ['Cơ sở kinh doanh', 'Phê duyệt chứng nhận'],
  '/thanh-tra-kiem-dinh':              ['Thanh tra & Kiểm định', 'Hồ sơ thanh tra'],
  '/thanh-tra-kiem-dinh/nhiem-vu':     ['Thanh tra & Kiểm định', 'Nhiệm vụ kiểm tra'],
  '/thanh-tra-kiem-dinh/bao-cao':      ['Thanh tra & Kiểm định', 'Báo cáo'],
  '/thanh-tra-kiem-dinh/yeu-cau':      ['Thanh tra & Kiểm định', 'Yêu cầu kiểm nghiệm'],
  '/thanh-tra-kiem-dinh/ket-qua':      ['Thanh tra & Kiểm định', 'Kết quả kiểm nghiệm'],
  // '/vi-pham':                          ['Vi phạm & Phản ánh'],
  // '/vi-pham/danh-sach-vi-pham':        ['Vi phạm & Phản ánh', 'Danh sách vi phạm'],
  '/vi-pham/xu-phat':                  ['Vi phạm & Phản ánh', 'Xử phạt'],
  '/vi-pham/khac-phuc':                ['Vi phạm & Phản ánh', 'Theo dõi khắc phục'],
  '/phan-anh-cong-dan':                ['Vi phạm & Phản ánh', 'Phản ánh công dân'],
  '/truyen-thong/quy-dinh':            ['Truyền thông', 'Quy định pháp luật'],
  '/truyen-thong/thong-bao':           ['Truyền thông', 'Thông báo'],
  '/truyen-thong/canh-bao':            ['Truyền thông', 'Cảnh báo'],
  '/cai-dat/nguoi-dung':               ['Cài đặt hệ thống', 'Quản lý người dùng'],
  '/cai-dat/nhat-ky':                  ['Cài đặt hệ thống', 'Nhật ký hệ thống'],
  '/cai-dat/may-chu':                  ['Cài đặt hệ thống', 'Giám sát máy chủ'],
};

const roleBadgeStyle: Record<Role, string> = {
  ADMIN:      'bg-blue-700 text-white',
  AUTHORITY:  'bg-emerald-800 text-white',
  INSPECTOR:  'bg-amber-700 text-white',
  TESTER:     'bg-violet-700 text-white',
  BUSINESS:   'bg-cyan-700 text-white',
};

const ALL_ROLES: Role[] = ['ADMIN', 'AUTHORITY', 'INSPECTOR', 'TESTER', 'BUSINESS'];

export default function Header() {
  const pathname = usePathname();
  const { role, setRole } = useRole();

  const crumbs = breadcrumbMap[pathname] ?? [pathname.split('/').pop() ?? 'Trang'];
  const avatar = { ADMIN:'A', AUTHORITY:'T', INSPECTOR:'T', TESTER:'H', BUSINESS:'P' }[role];

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center px-6 gap-4 sticky top-0 z-40 shadow-sm">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 flex-1">
        {crumbs.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span className="text-slate-300 text-base">›</span>}
            <span className={cn('text-[13px]', i === crumbs.length - 1 ? 'text-slate-800 font-semibold' : 'text-slate-400')}>
              {c}
            </span>
          </span>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <svg
          className="absolute left-2.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"
          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"
        >
          <circle cx="11" cy="11" r="8" /><path d="M21 21l-4.35-4.35" />
        </svg>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          className="bg-slate-50 border border-slate-200 rounded-lg pl-9 pr-3 py-2 text-[13px] text-slate-800 outline-none focus:border-blue-500 w-60 transition-colors"
        />
      </div>

      {/* Notification */}
      <button className="relative w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:bg-slate-50 hover:text-slate-700 transition-colors">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-[18px] h-[18px]">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
        </svg>
        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
      </button>

      {/* Role switcher */}
      <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wide">Vai trò:</span>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as Role)}
          className="bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-[12px] font-medium text-slate-700 outline-none focus:border-blue-500 cursor-pointer"
        >
          {ALL_ROLES.map((r) => (
            <option key={r} value={r}>{roleLabels[r]}</option>
          ))}
        </select>
        <span className={cn('inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold tracking-wide uppercase', roleBadgeStyle[role])}>
          {role}
        </span>
      </div>

      {/* Avatar */}
      <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 to-emerald-500 flex items-center justify-center text-[13px] font-bold text-white cursor-pointer flex-shrink-0">
        {avatar}
      </div>
    </header>
  );
}
