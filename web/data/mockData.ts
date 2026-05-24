// ─────────────────────────────────────────────
// TYPES
// ─────────────────────────────────────────────
export type Role = 'ADMIN' | 'LD_ATVSTP' | 'INSPECTOR' | 'TESTER';

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

export type ComplaintStatus = 'pending' | 'processing' | 'resolved';

export interface ComplaintEvidence {
  id: string;
  label: string;
  kind: 'image' | 'file';
  note: string;
}

export interface ComplaintRecord {
  id: string;
  title: string;
  submitter: string;
  submittedAt: string;
  status: ComplaintStatus;
  content: string;
  submitterInfo: {
    fullName: string;
    phone: string;
    email: string;
    address: string;
  };
  evidence: ComplaintEvidence[];
  handlingResult?: string;
  inspectionSummary?: string;
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

export const mockComplaints: ComplaintRecord[] = [
  {
    id: 'KN-2026-001',
    title: 'Nghi ngờ thực phẩm bảo quản không đúng nhiệt độ',
    submitter: 'Nguyễn Thị Hồng',
    submittedAt: '25/03/2026',
    status: 'pending',
    content:
      'Người dân phản ánh quầy hải sản tại Chợ Tươi Đà Nẵng để thực phẩm ngoài thùng lạnh quá lâu, có mùi lạ vào cuối buổi chiều và không có nhãn truy xuất nguồn gốc.',
    submitterInfo: {
      fullName: 'Nguyễn Thị Hồng',
      phone: '0905 123 456',
      email: 'hong.nguyen@gmail.com',
      address: 'An Hải Bắc, Sơn Trà, Đà Nẵng',
    },
    evidence: [
      { id: 'EV-001', label: 'Anh_quay_hai_san.jpg', kind: 'image', note: 'Ảnh chụp khu vực bảo quản lúc 17:40' },
      { id: 'EV-002', label: 'bien-ban-phan-anh.pdf', kind: 'file', note: 'Bản mô tả chi tiết của người gửi' },
    ],
  },
  {
    id: 'KN-2026-002',
    title: 'Phản ánh dầu chiên tái sử dụng nhiều lần',
    submitter: 'Trần Văn Đức',
    submittedAt: '24/03/2026',
    status: 'processing',
    content:
      'Người gửi cho biết cơ sở Bánh Mì Hội An sử dụng dầu chiên có màu sẫm, mùi khét, nghi đã tái sử dụng trong nhiều ngày liên tiếp trong giờ cao điểm buổi tối.',
    submitterInfo: {
      fullName: 'Trần Văn Đức',
      phone: '0917 668 220',
      email: 'duc.tv@gmail.com',
      address: 'Hòa Cường Bắc, Hải Châu, Đà Nẵng',
    },
    evidence: [
      { id: 'EV-003', label: 'mau-dau-chien.png', kind: 'image', note: 'Ảnh màu dầu trong chảo chiên' },
      { id: 'EV-004', label: 'ghi-am-nguoi-gui.mp3', kind: 'file', note: 'Tệp ghi âm mô tả thời điểm phát hiện' },
    ],
    inspectionSummary:
      'Đã kiểm tra hiện trường, ghi nhận dầu chiên sẫm màu và yêu cầu cơ sở thay toàn bộ mẻ dầu trong ngày.',
    handlingResult:
      'Đã lập biên bản nhắc nhở và yêu cầu cơ sở thay dầu chiên, lưu mẫu dầu để kiểm nghiệm lại trong đợt tái kiểm.',
  },
  {
    id: 'KN-2026-003',
    title: 'Khiếu nại bao bì thực phẩm không có hạn sử dụng',
    submitter: 'Lê Minh Anh',
    submittedAt: '22/03/2026',
    status: 'resolved',
    content:
      'Người dân phản ánh tại cửa hàng thực phẩm đóng gói có nhiều sản phẩm không in hạn sử dụng rõ ràng, gây khó xác định thời điểm an toàn để dùng.',
    submitterInfo: {
      fullName: 'Lê Minh Anh',
      phone: '0935 770 112',
      email: 'minhanh.le@mail.vn',
      address: 'Thanh Khê Tây, Thanh Khê, Đà Nẵng',
    },
    evidence: [
      { id: 'EV-005', label: 'nhan-san-pham.jpeg', kind: 'image', note: 'Ảnh chụp nhãn sản phẩm thiếu thông tin' },
      { id: 'EV-006', label: 'ket-luan-xu-ly.docx', kind: 'file', note: 'Tài liệu tổng hợp hướng xử lý đã ban hành' },
    ],
    inspectionSummary:
      'Đã đối chiếu hồ sơ nhập hàng và kiểm tra ngẫu nhiên 12 sản phẩm tại quầy trưng bày.',
    handlingResult:
      'Đã yêu cầu cơ sở thu hồi lô hàng vi phạm, bổ sung nhãn phụ đúng quy định và hoàn tất xác nhận khắc phục trong ngày 23/03/2026.',
  },
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

  LD_ATVSTP: [
    { label: 'Tổng quan', href: '/dashboard', icon: 'grid' },
    {
      label: 'Cơ sở kinh doanh', icon: 'building', children: [
        { label: 'Danh sách cơ sở', href: '/co-so-kinh-doanh' },
        { label: 'Giấy phép', href: '/co-so-kinh-doanh/giay-phep' },
        { label: 'Phê duyệt chứng nhận', href: '/co-so-kinh-doanh/chung-nhan' },
      ]
    },
    {
      label: 'Thanh tra', icon: 'clipboard', children: [
        { label: 'Tạo lịch thanh tra', href: '/thanh-tra-kiem-dinh/thanh-tra' }
        ]
    },
    {
      label: 'Vi phạm & Phản ánh', icon: 'alert', children: [
        { label: 'Danh sách vi phạm', href: '/vi-pham' },
        { label: 'Phản ánh công dân', href: '/phan-anh-cong-dan' },
        { label: 'Theo dõi khắc phục', href: '/vi-pham/khac-phuc' }
      ]
    },
    {
      label: 'Truyền thông', icon: 'megaphone', children: [
        { label: 'Quy định pháp luật', href: '/truyen-thong/quy-dinh' },
        { label: 'Thông báo', href: '/truyen-thong/thong-bao' },
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
      label: 'Thanh tra', icon: 'clipboard', children: [
        { label: 'Hồ sơ thanh tra', href: '/thanh-tra-kiem-dinh' },
        { label: 'Nhiệm vụ kiểm tra', href: '/thanh-tra-kiem-dinh/nhiem-vu' },
        { label: 'Báo cáo thanh tra', href: '/thanh-tra-kiem-dinh/bao-cao' },
        { label: 'Yêu cầu kiểm nghiệm', href: '/thanh-tra-kiem-dinh/yeu-cau' },
        { label: 'Kết quả kiểm nghiệm', href: '/thanh-tra-kiem-dinh/ket-qua' },
        { label: 'Khiếu nại', href: '/thanh-tra-kiem-dinh/khieu-nai' },
        { label: 'Tiêu chí đánh giá', href: '/thanh-tra-kiem-dinh/tieu-chi' }
      ]
    }
  ],
  TESTER: [
    {
      label: 'Kiểm nghiệm', icon: 'inspection', children: [
        { label: 'Tổng quan kiểm nghiệm', href: '/kiem-nghiem' },
        { label: 'Mẫu kiểm nghiệm', href: '/kiem-nghiem/mau' },
        { label: 'Kết quả kiểm nghiệm', href: '/kiem-nghiem/ket-qua' }
        
      ]
    },
    {
      label: 'Vi phạm & Phản ánh', icon: 'alert', children: [
        { label: 'Danh sách vi phạm', href: '/vi-pham' }
      ]
    },
  ],
};

export const roleLabels: Record<Role, string> = {
  ADMIN:     'Quản trị hệ thống',     // QTH
  LD_ATVSTP: 'Lãnh đạo ATVSTP',
  INSPECTOR: 'Cán bộ Thanh tra',      // CB_THANH_TRA
  TESTER:    'Cán bộ Kiểm định',      // CB_KIEM_DINH
};

export const roleColors: Record<Role, string> = {
  ADMIN:     'bg-[#1B5E20] text-white',
  LD_ATVSTP: 'bg-[#1565C0] text-white',
  INSPECTOR: 'bg-[#ED6C02] text-white',
  TESTER:    'bg-[#0288D1] text-white',
};

export type InspectionReportResult = 'pass' | 'fail' | 'scheduled';

export interface InspectionReport {
  id: string;
  tenCoSo: string;
  loaiThanhTra: string;
  thanhTraVien: string;
  ngay: string;
  ketQua: InspectionReportResult;
  diem: number;
  quanHuyen: string;
  noiDung: string;
  nhanXet: string;
  tepDinhKem?: string;
}

export const mockInspectionReports: InspectionReport[] = [
  {
    id: 'BC-001',
    tenCoSo: 'Cơ sở A',
    loaiThanhTra: 'Thanh tra định kỳ',
    thanhTraVien: 'Nguyễn Văn Trần',
    ngay: '2026-03-20',
    ketQua: 'pass',
    diem: 92,
    quanHuyen: 'Hải Châu',
    noiDung: 'Đã kiểm tra khu vực sơ chế, kho bảo quản và hồ sơ nguồn gốc nguyên liệu của cơ sở.',
    nhanXet: 'Cơ sở đáp ứng tốt yêu cầu an toàn thực phẩm, cần duy trì việc lưu mẫu đúng quy định.',
    tepDinhKem: 'bao-cao-bc-001.pdf',
  },
  {
    id: 'BC-002',
    tenCoSo: 'Cơ sở B',
    loaiThanhTra: 'Thanh tra đột xuất',
    thanhTraVien: 'Lê Thị Mai',
    ngay: '2026-03-18',
    ketQua: 'fail',
    diem: 54,
    quanHuyen: 'Thanh Khê',
    noiDung: 'Phát hiện khu vực bảo quản thực phẩm chưa tách biệt rõ giữa thực phẩm sống và chín.',
    nhanXet: 'Yêu cầu khắc phục ngay việc bố trí kho và bổ sung nhật ký vệ sinh theo ngày.',
    tepDinhKem: 'bao-cao-bc-002.pdf',
  },
  {
    id: 'BC-003',
    tenCoSo: 'Cơ sở C',
    loaiThanhTra: 'Thanh tra định kỳ',
    thanhTraVien: 'Phạm Văn Đức',
    ngay: '2026-03-21',
    ketQua: 'pass',
    diem: 88,
    quanHuyen: 'Ngũ Hành Sơn',
    noiDung: 'Đã đối chiếu hồ sơ pháp lý, nhãn mác sản phẩm và điều kiện vệ sinh tại khu chế biến.',
    nhanXet: 'Cơ sở vận hành ổn định, hồ sơ đầy đủ và nhân sự thực hiện đúng quy trình đã ban hành.',
    tepDinhKem: 'bao-cao-bc-003.pdf',
  },
  {
    id: 'BC-004',
    tenCoSo: 'Cơ sở D',
    loaiThanhTra: 'Thanh tra theo phản ánh',
    thanhTraVien: 'Nguyễn Văn Trần',
    ngay: '2026-03-25',
    ketQua: 'scheduled',
    diem: 0,
    quanHuyen: 'Sơn Trà',
    noiDung: 'Đã tiếp nhận phản ánh và lên lịch kiểm tra thực tế, báo cáo chi tiết sẽ bổ sung sau.',
    nhanXet: 'Chờ hoàn tất biên bản kiểm tra để cập nhật kết quả cuối cùng.',
    tepDinhKem: 'bao-cao-bc-004.pdf',
  },
];

export type ThanhTraStatus = 'Dang xu ly' | 'Hoan thanh' | 'Huy';
 
export interface NguoiThanhTra {
  maNguoiDung: string;
  hoTen: string;
  chucVu: string;
  email: string;
  soDienThoai: string;
}
 
export interface CoSoKinhDoanh {
  maCoSo: string;
  tenCoSo: string;
  diaChi: string;
  loaiHinh: string;
}
 
export interface LichThanhTra {
  maThanhTra: string;
  trangThai: ThanhTraStatus;
  noiDung: string;
  ngayTao: string;
  maCoSo: string;
  tenCoSo: string;
  diaChi: string;
  maNguoiPhuTrach: string | null;
  tenNguoiPhuTrach: string | null;
  ketQuaKiemTra?: string;
}
 
export const mockNguoiThanhTra: NguoiThanhTra[] = [
  {
    maNguoiDung: 'ND001',
    hoTen: 'Nguyễn Văn An',
    chucVu: 'Cán bộ thanh tra',
    email: 'an.nguyen@danang.gov.vn',
    soDienThoai: '0905 123 456',
  },
  {
    maNguoiDung: 'ND002',
    hoTen: 'Trần Thị Bình',
    chucVu: 'Trưởng đoàn thanh tra',
    email: 'binh.tran@danang.gov.vn',
    soDienThoai: '0905 234 567',
  },
  {
    maNguoiDung: 'ND003',
    hoTen: 'Lê Quang Cường',
    chucVu: 'Cán bộ thanh tra',
    email: 'cuong.le@danang.gov.vn',
    soDienThoai: '0905 345 678',
  },
  {
    maNguoiDung: 'ND004',
    hoTen: 'Phạm Thị Dung',
    chucVu: 'Phó trưởng đoàn',
    email: 'dung.pham@danang.gov.vn',
    soDienThoai: '0905 456 789',
  },
  {
    maNguoiDung: 'ND005',
    hoTen: 'Hoàng Văn Em',
    chucVu: 'Cán bộ thanh tra',
    email: 'em.hoang@danang.gov.vn',
    soDienThoai: '0905 567 890',
  },
];
 
export const mockCoSo: CoSoKinhDoanh[] = [
  {
    maCoSo: 'CS001',
    tenCoSo: 'Nhà hàng Hải Sản Biển Xanh',
    diaChi: '12 Trần Phú, Hải Châu, Đà Nẵng',
    loaiHinh: 'Nhà hàng',
  },
  {
    maCoSo: 'CS002',
    tenCoSo: 'Quán Cơm Bà Lan',
    diaChi: '45 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng',
    loaiHinh: 'Quán ăn',
  },
  {
    maCoSo: 'CS003',
    tenCoSo: 'Siêu thị Mini Phúc Lộc',
    diaChi: '78 Hoàng Diệu, Hải Châu, Đà Nẵng',
    loaiHinh: 'Siêu thị',
  },
];
 
export const mockLichThanhTra: LichThanhTra[] = [
  {
    maThanhTra: 'TT-20250101',
    trangThai: 'Dang xu ly',
    noiDung: 'Kiểm tra điều kiện vệ sinh an toàn thực phẩm định kỳ quý I/2025.',
    ngayTao: '2025-01-10',
    maCoSo: 'CS001',
    tenCoSo: 'Nhà hàng Hải Sản Biển Xanh',
    diaChi: '12 Trần Phú, Hải Châu, Đà Nẵng',
    maNguoiPhuTrach: 'ND002',
    tenNguoiPhuTrach: 'Trần Thị Bình',
  },
  {
    maThanhTra: 'TT-20250102',
    trangThai: 'Hoan thanh',
    noiDung: 'Kiểm tra sau xử lý vi phạm lần trước về điều kiện bảo quản thực phẩm.',
    ngayTao: '2025-01-15',
    maCoSo: 'CS002',
    tenCoSo: 'Quán Cơm Bà Lan',
    diaChi: '45 Nguyễn Văn Linh, Thanh Khê, Đà Nẵng',
    maNguoiPhuTrach: 'ND001',
    tenNguoiPhuTrach: 'Nguyễn Văn An',
    ketQuaKiemTra: 'Cơ sở đã khắc phục đầy đủ các vi phạm. Đủ điều kiện hoạt động.',
  },
  {
    maThanhTra: 'TT-20250103',
    trangThai: 'Huy',
    noiDung: 'Thanh tra đột xuất theo phản ánh của người dân về vệ sinh môi trường.',
    ngayTao: '2025-01-20',
    maCoSo: 'CS003',
    tenCoSo: 'Siêu thị Mini Phúc Lộc',
    diaChi: '78 Hoàng Diệu, Hải Châu, Đà Nẵng',
    maNguoiPhuTrach: null,
    tenNguoiPhuTrach: null,
  },
  {
    maThanhTra: 'TT-20250104',
    trangThai: 'Dang xu ly',
    noiDung: 'Kiểm tra định kỳ theo kế hoạch năm 2025 của Chi cục ATVSTP.',
    ngayTao: '2025-02-05',
    maCoSo: 'CS001',
    tenCoSo: 'Nhà hàng Hải Sản Biển Xanh',
    diaChi: '12 Trần Phú, Hải Châu, Đà Nẵng',
    maNguoiPhuTrach: 'ND003',
    tenNguoiPhuTrach: 'Lê Quang Cường',
  },
];