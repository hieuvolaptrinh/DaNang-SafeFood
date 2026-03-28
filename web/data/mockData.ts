// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export type Role = 'ADMIN' | 'AUTHORITY' | 'INSPECTOR' | 'TESTER' | 'BUSINESS';

export type BusinessStatus = 'active' | 'suspended' | 'pending' | 'expired';
export type InspectionResult = 'pass' | 'fail' | 'scheduled';
export type Severity = 'high' | 'medium' | 'low';
export type RecordStatus = 'open' | 'in-progress' | 'resolved';
export type LogLevel = 'INFO' | 'WARN' | 'ERROR';

export interface Business {
  id: string;
  name: string;
  category: string;
  district: string;
  license: string;
  expiry: string;
  status: BusinessStatus;
  lastInspection: string;
}

export interface Inspection {
  id: string;
  business: string;
  type: string;
  inspector: string;
  date: string;
  result: InspectionResult;
  score: number;
}

export interface Violation {
  id: string;
  business: string;
  type: string;
  severity: Severity;
  date: string;
  inspector: string;
  penalty: string;
  status: RecordStatus;
}

export interface SystemUser {
  name: string;
  email: string;
  role: Role;
  department: string;
  lastLogin: string;
  status: 'active' | 'suspended';
}

export interface SystemLog {
  timestamp: string;
  level: LogLevel;
  service: string;
  user: string;
  message: string;
  ip: string;
}

export interface CitizenFeedback {
  id: string;
  submitter: string;
  businessReported: string;
  type: string;
  date: string;
  priority: Severity;
  status: RecordStatus;
}

// ─────────────────────────────────────────────
// BUSINESSES
// ─────────────────────────────────────────────
export const mockBusinesses: Business[] = [
  { id: 'BIZ-001', name: 'Nhà hàng Phở Ba Miền', category: 'Nhà hàng', district: 'Hải Châu', license: 'FSL-2024-0012', expiry: '2025-06-30', status: 'active', lastInspection: '10/01/2025' },
  { id: 'BIZ-002', name: 'Bánh Mì Hội An', category: 'Thức ăn đường phố', district: 'Sơn Trà', license: 'FSL-2024-0087', expiry: '2025-03-15', status: 'suspended', lastInspection: '20/12/2024' },
  { id: 'BIZ-003', name: 'Công ty Hải Sản Đà Nẵng', category: 'Chế biến thực phẩm', district: 'Thanh Khê', license: 'FSL-2023-0234', expiry: '2024-11-01', status: 'expired', lastInspection: '05/11/2024' },
  { id: 'BIZ-004', name: 'Chợ Tươi Đà Nẵng', category: 'Chợ bán lẻ', district: 'Ngũ Hành Sơn', license: 'FSL-2024-0145', expiry: '2025-12-31', status: 'active', lastInspection: '08/01/2025' },
  { id: 'BIZ-005', name: 'Mì Quảng Trâm', category: 'Nhà hàng', district: 'Liên Chiểu', license: 'FSL-2024-0290', expiry: '2025-09-30', status: 'active', lastInspection: '15/12/2024' },
  { id: 'BIZ-006', name: 'Bún Bò Huế 36', category: 'Nhà hàng', district: 'Hải Châu', license: 'FSL-2024-0310', expiry: '2025-08-20', status: 'active', lastInspection: '12/01/2025' },
  { id: 'BIZ-007', name: 'Lò Bánh Mì Thanh Khê', category: 'Chế biến thực phẩm', district: 'Thanh Khê', license: 'FSL-2023-0099', expiry: '2025-02-28', status: 'pending', lastInspection: '30/10/2024' },
  { id: 'BIZ-008', name: 'Công ty TNHH Ocean Catch', category: 'XNK thực phẩm', district: 'Sơn Trà', license: 'FSL-2024-0401', expiry: '2025-11-15', status: 'active', lastInspection: '06/01/2025' },
  { id: 'BIZ-009', name: 'Cà Phê Thu Hiền', category: 'Đồ uống', district: 'Ngũ Hành Sơn', license: 'FSL-2024-0198', expiry: '2025-07-01', status: 'active', lastInspection: '28/12/2024' },
  { id: 'BIZ-010', name: 'Grill House Đà Nẵng', category: 'Nhà hàng', district: 'Hải Châu', license: 'FSL-2024-0512', expiry: '2025-10-10', status: 'active', lastInspection: '11/01/2025' },
];

// ─────────────────────────────────────────────
// INSPECTIONS
// ─────────────────────────────────────────────
export const mockInspections: Inspection[] = [
  { id: 'INS-2847', business: 'Nhà hàng Phở Ba Miền', type: 'Định kỳ', inspector: 'Nguyễn Văn Trần', date: '10/01/2025', result: 'pass', score: 88 },
  { id: 'INS-2846', business: 'Công ty Hải Sản Đà Nẵng', type: 'Tái kiểm tra', inspector: 'Lê Thị Mai', date: '09/01/2025', result: 'fail', score: 52 },
  { id: 'INS-2845', business: 'Chợ Tươi Đà Nẵng', type: 'Định kỳ', inspector: 'Phạm Văn Đức', date: '08/01/2025', result: 'pass', score: 95 },
  { id: 'INS-2844', business: 'Công ty TNHH Ocean Catch', type: 'Đột xuất', inspector: 'Nguyễn Văn Trần', date: '06/01/2025', result: 'pass', score: 91 },
  { id: 'INS-2843', business: 'Grill House Đà Nẵng', type: 'Định kỳ', inspector: 'Lê Thị Mai', date: '05/01/2025', result: 'pass', score: 84 },
  { id: 'INS-2842', business: 'Bánh Mì Hội An', type: 'Theo phản ánh', inspector: 'Phạm Văn Đức', date: '20/12/2024', result: 'fail', score: 41 },
  { id: 'INS-2841', business: 'Cà Phê Thu Hiền', type: 'Định kỳ', inspector: 'Nguyễn Văn Trần', date: '28/12/2024', result: 'pass', score: 78 },
  { id: 'INS-2840', business: 'Mì Quảng Trâm', type: 'Định kỳ', inspector: 'Lê Thị Mai', date: '15/12/2024', result: 'pass', score: 82 },
];

// ─────────────────────────────────────────────
// VIOLATIONS
// ─────────────────────────────────────────────
export const mockViolations: Violation[] = [
  { id: 'VIO-047', business: 'Nhà hàng Phở Ba Miền', type: 'Vi phạm vệ sinh', severity: 'high', date: '10/01/2025', inspector: 'Nguyễn Văn Trần', penalty: '15.000.000 đ', status: 'open' },
  { id: 'VIO-046', business: 'Bánh Mì Hội An', type: 'Giấy phép hết hạn', severity: 'medium', date: '20/12/2024', inspector: 'Phạm Văn Đức', penalty: '8.000.000 đ', status: 'in-progress' },
  { id: 'VIO-045', business: 'Công ty Hải Sản Đà Nẵng', type: 'Lỗi dây chuyền lạnh', severity: 'high', date: '05/11/2024', inspector: 'Lê Thị Mai', penalty: '25.000.000 đ', status: 'open' },
  { id: 'VIO-044', business: 'Chợ Tươi Đà Nẵng', type: 'Thiếu nhãn mác', severity: 'low', date: '08/01/2025', inspector: 'Nguyễn Văn Trần', penalty: '2.000.000 đ', status: 'resolved' },
  { id: 'VIO-043', business: 'Lò Bánh Mì Thanh Khê', type: 'Kiểm soát dịch hại', severity: 'medium', date: '30/10/2024', inspector: 'Phạm Văn Đức', penalty: '5.000.000 đ', status: 'in-progress' },
  { id: 'VIO-042', business: 'Công ty TNHH Ocean Catch', type: 'Hồ sơ không đầy đủ', severity: 'low', date: '06/01/2025', inspector: 'Nguyễn Văn Trần', penalty: '1.500.000 đ', status: 'resolved' },
  { id: 'VIO-041', business: 'Bún Bò Huế 36', type: 'Nhãn chất gây dị ứng', severity: 'medium', date: '12/01/2025', inspector: 'Lê Thị Mai', penalty: '4.000.000 đ', status: 'open' },
];

// ─────────────────────────────────────────────
// USERS
// ─────────────────────────────────────────────
export const mockUsers: SystemUser[] = [
  { name: 'Nguyễn Văn Admin', email: 'admin@fsms.danang.gov.vn', role: 'ADMIN', department: 'Phòng CNTT', lastLogin: '15/01/2025 14:30', status: 'active' },
  { name: 'Trần Thị Thẩm Quyền', email: 'authority01@fsms.danang.gov.vn', role: 'AUTHORITY', department: 'Phòng ATTP', lastLogin: '15/01/2025 09:15', status: 'active' },
  { name: 'Nguyễn Văn Trần', email: 'inspector.tran@fsms.danang.gov.vn', role: 'INSPECTOR', department: 'Đội thanh tra', lastLogin: '15/01/2025 14:32', status: 'active' },
  { name: 'Lê Thị Mai', email: 'inspector.mai@fsms.danang.gov.vn', role: 'INSPECTOR', department: 'Đội thanh tra', lastLogin: '15/01/2025 11:00', status: 'active' },
  { name: 'Phạm Văn Đức', email: 'inspector.duc@fsms.danang.gov.vn', role: 'INSPECTOR', department: 'Đội thanh tra', lastLogin: '14/01/2025 16:45', status: 'active' },
  { name: 'Hoàng Kiểm Nghiệm', email: 'tester01@fsms.danang.gov.vn', role: 'TESTER', department: 'Phòng xét nghiệm', lastLogin: '15/01/2025 08:30', status: 'active' },
  { name: 'Phở Ba Miền (Chủ)', email: 'pbm.owner@mail.vn', role: 'BUSINESS', department: 'Bên ngoài', lastLogin: '13/01/2025 10:20', status: 'active' },
  { name: 'Tài khoản Hải Sản DN', email: 'danangseafood@mail.vn', role: 'BUSINESS', department: 'Bên ngoài', lastLogin: '10/01/2025 15:00', status: 'suspended' },
];

// ─────────────────────────────────────────────
// SYSTEM LOGS
// ─────────────────────────────────────────────
export const mockLogs: SystemLog[] = [
  { timestamp: '15/01/2025 14:32:01', level: 'INFO', service: 'Auth Service', user: 'inspector.tran', message: 'Đăng nhập thành công', ip: '192.168.1.42' },
  { timestamp: '15/01/2025 14:28:47', level: 'INFO', service: 'API Gateway', user: 'inspector.tran', message: 'POST /api/inspections — 201 Created', ip: '192.168.1.42' },
  { timestamp: '15/01/2025 14:15:22', level: 'WARN', service: 'Database', user: 'system', message: 'Truy vấn chậm (2340ms): SELECT * FROM inspection_records', ip: '127.0.0.1' },
  { timestamp: '15/01/2025 13:55:10', level: 'INFO', service: 'Scheduler', user: 'system', message: 'Sao lưu hàng ngày hoàn thành', ip: '127.0.0.1' },
  { timestamp: '15/01/2025 13:40:05', level: 'ERROR', service: 'Email Service', user: 'system', message: 'SMTP timeout gửi tới: danangseafood@mail.vn', ip: '127.0.0.1' },
  { timestamp: '15/01/2025 12:30:00', level: 'INFO', service: 'Auth Service', user: 'authority01', message: 'Đăng nhập thành công', ip: '10.0.0.15' },
  { timestamp: '15/01/2025 11:05:33', level: 'INFO', service: 'API Gateway', user: 'inspector.mai', message: 'PUT /api/violations/047 — 200 OK', ip: '192.168.1.55' },
  { timestamp: '15/01/2025 10:00:01', level: 'INFO', service: 'Scheduler', user: 'system', message: 'Khởi tạo báo cáo Q1 2025', ip: '127.0.0.1' },
];

// ─────────────────────────────────────────────
// CITIZEN FEEDBACK
// ─────────────────────────────────────────────
export const mockFeedback: CitizenFeedback[] = [
  { id: 'FB-086', submitter: 'Ẩn danh', businessReported: 'Bánh Mì Hội An', type: 'Khiếu nại vệ sinh', date: '14/01/2025', priority: 'high', status: 'open' },
  { id: 'FB-085', submitter: 'Nguyễn Thị Lan', businessReported: 'Công ty Hải Sản Đà Nẵng', type: 'Ngộ độc thực phẩm', date: '13/01/2025', priority: 'high', status: 'in-progress' },
  { id: 'FB-084', submitter: 'Ẩn danh', businessReported: 'Hàng rong #SV-042', type: 'Khiếu nại vệ sinh', date: '12/01/2025', priority: 'medium', status: 'open' },
  { id: 'FB-083', submitter: 'Trần Văn Minh', businessReported: 'Chợ Tươi Đà Nẵng', type: 'Hàng giả', date: '11/01/2025', priority: 'medium', status: 'in-progress' },
  { id: 'FB-082', submitter: 'Lê Phương Anh', businessReported: 'Nhà hàng Phở Ba Miền', type: 'Câu hỏi chung', date: '10/01/2025', priority: 'low', status: 'resolved' },
  { id: 'FB-081', submitter: 'Ẩn danh', businessReported: 'Lò Bánh Mì Thanh Khê', type: 'Khiếu nại vệ sinh', date: '09/01/2025', priority: 'high', status: 'open' },
];

// ─────────────────────────────────────────────
// ROLE CONFIGS
// ─────────────────────────────────────────────
export interface NavItem {
  label: string;
  href?: string;
  icon: string;
  children?: { label: string; href: string }[];
}

export const roleNavMap: Record<Role, NavItem[]> = {
  ADMIN: [
    { label: 'Tổng quan', href: '/dashboard', icon: 'grid' },
    {
      label: 'Cài đặt hệ thống', icon: 'settings', children: [
        { label: 'Quản lý người dùng', href: '/cai-dat/nguoi-dung' },
        { label: 'Nhật ký hệ thống', href: '/cai-dat/nhat-ky' },
        { label: 'Giám sát máy chủ', href: '/cai-dat/may-chu' },
      ]
    },
  ],
  AUTHORITY: [
    { label: 'Tổng quan', href: '/dashboard', icon: 'grid' },
    {
      label: 'Cơ sở kinh doanh', icon: 'building', children: [
        { label: 'Danh sách cơ sở', href: '/co-so-kinh-doanh' },
        { label: 'Giấy phép', href: '/co-so-kinh-doanh/giay-phep' },
        { label: 'Tình trạng pháp lý', href: '/co-so-kinh-doanh/phap-ly' },
        { label: 'Phê duyệt chứng nhận', href: '/co-so-kinh-doanh/chung-nhan' },
      ]
    },
    {
      label: 'Vi phạm & Phản ánh', icon: 'alert', children: [
        { label: 'Danh sách vi phạm', href: '/vi-pham' },
        { label: 'Phản ánh công dân', href: '/phan-anh-cong-dan' },
        { label: 'Xử phạt', href: '/vi-pham/xu-phat' },
        { label: 'Theo dõi khắc phục', href: '/vi-pham/khac-phuc' },
      ]
    },
    {
      label: 'Truyền thông', icon: 'megaphone', children: [
        { label: 'Quy định pháp luật', href: '/truyen-thong/quy-dinh' },
        { label: 'Thông báo', href: '/truyen-thong/thong-bao' },
        { label: 'Cảnh báo', href: '/truyen-thong/canh-bao' },
      ]
    },
  ],
  INSPECTOR: [
    {
      label: 'Cơ sở kinh doanh', icon: 'building', children: [
        { label: 'Danh sách cơ sở', href: '/co-so-kinh-doanh' },
        { label: 'Giấy phép', href: '/co-so-kinh-doanh/giay-phep' },
      ]
    },
    {
      label: 'Thanh tra & Kiểm định', icon: 'clipboard', children: [
        { label: 'Hồ sơ thanh tra', href: '/thanh-tra-kiem-dinh' },
        { label: 'Báo cáo thanh tra', href: '/thanh-tra-kiem-dinh/bao-cao' },
        { label: 'Yêu cầu kiểm nghiệm', href: '/thanh-tra-kiem-dinh/yeu-cau' },
        { label: 'Kết quả kiểm nghiệm', href: '/thanh-tra-kiem-dinh/ket-qua' },
      ]
    },
  ],
  TESTER: [
    {
      label: 'Thanh tra & Kiểm định', icon: 'clipboard', children: [
        { label: 'Yêu cầu kiểm nghiệm', href: '/thanh-tra-kiem-dinh/yeu-cau' },
        { label: 'Kết quả kiểm nghiệm', href: '/thanh-tra-kiem-dinh/ket-qua' },
        { label: 'Hồ sơ thanh tra', href: '/thanh-tra-kiem-dinh' },
      ]
    },
    {
      label: 'Vi phạm & Phản ánh', icon: 'alert', children: [
        { label: 'Danh sách vi phạm', href: '/vi-pham' },
        { label: 'Xử phạt', href: '/vi-pham/xu-phat' },
      ]
    },
  ],
  BUSINESS: [
    {
      label: 'Cơ sở của tôi', icon: 'building', children: [
        { label: 'Hồ sơ cơ sở', href: '/co-so-kinh-doanh/ho-so' },
        { label: 'Giấy phép của tôi', href: '/co-so-kinh-doanh/giay-phep' },
        { label: 'Chứng nhận', href: '/co-so-kinh-doanh/chung-nhan' },
      ]
    },
    {
      label: 'Thanh tra & Kiểm định', icon: 'clipboard', children: [
        { label: 'Lịch sử thanh tra', href: '/thanh-tra-kiem-dinh' },
        { label: 'Kết quả kiểm nghiệm', href: '/thanh-tra-kiem-dinh/ket-qua' },
      ]
    },
    {
      label: 'Vi phạm', icon: 'alert', children: [
        { label: 'Vi phạm của tôi', href: '/vi-pham' },
        { label: 'Theo dõi khắc phục', href: '/vi-pham/khac-phuc' },
      ]
    },
  ],
};

export const roleLabels: Record<Role, string> = {
  ADMIN: 'Quản trị viên',
  AUTHORITY: 'Cơ quan thẩm quyền',
  INSPECTOR: 'Thanh tra viên',
  TESTER: 'Kiểm nghiệm viên',
  BUSINESS: 'Chủ cơ sở',
};

export const roleColors: Record<Role, string> = {
  ADMIN: 'bg-blue-700 text-white',
  AUTHORITY: 'bg-emerald-800 text-white',
  INSPECTOR: 'bg-amber-800 text-white',
  TESTER: 'bg-violet-700 text-white',
  BUSINESS: 'bg-cyan-700 text-white',
};
