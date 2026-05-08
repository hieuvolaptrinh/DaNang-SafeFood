
TRUNCATE TABLE file_dinh_kem, hinh_thuc_khac_phuc, minh_chung_khac_phuc, vi_pham, loai_vi_pham,
               bao_cao, kq_danh_gia, tieu_chi_danh_gia, dam_nhan_kiem_ngiem, mau_chi_tieu,
               mau_kiem_nghiem, chi_tieu_kiem_nghiem, khieu_nai, giay_phep, phan_anh,
               loai_phan_anh, chung_nhan_atvstp, ho_so_dang_ki_kinh_doanh, chi_nhanh,
               lich_thanh_tra_nguoi_dung, lich_thanh_tra, co_so_loai_hinh, co_so_kinh_doanh,
               loai_hinh_kinh_doanh, thong_bao_nguoi_dung, thong_bao, log,
               quyen_han_nguoi_dung, nguoi_dung, tai_khoan, phuong_xa, quyen_han CASCADE;

-- [1] Quyền hạn
INSERT INTO quyen_han (maQuyenHan, quyenHan) VALUES
('QTH', 'Quản trị hệ thống'),
('LD_ATVSTP', 'Lãnh đạo ATVSTP'),
('CSKD', 'Chuyên viên Kinh doanh'),
('CB_THANH_TRA', 'Cán bộ Thanh tra'),
('CB_KIEM_DINH', 'Cán bộ Kiểm định'),
('NTD', 'Người tiêu dùng');

-- [2] Tài khoản
INSERT INTO tai_khoan (id, username, password, fullName, email, phone, enabled, createdAt, updatedAt) VALUES
(1, 'admin', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Administrator', 'admin@safefood.vn', '0901234567', true, NOW(), NOW()),
(2, 'ld1', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Lãnh đạo ATVSTP', 'ld@safefood.vn', '0901234568', true, NOW(), NOW()),
(3, 'thanhtra', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Cán bộ Thanh tra', 'thanhtra@safefood.vn', '0901234569', true, NOW(), NOW()),
(4, 'kiemdinh', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Cán bộ Kiểm định', 'kiemdinh@safefood.vn', '0901234570', true, NOW(), NOW()),
(5, 'user1', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Nguyễn Văn A', 'user1@gmail.com', '0987654321', true, NOW(), NOW()),
(6, 'kinhdoanh1', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Nguyễn Văn B', 'kinhdoanh1@gmail.com', '0987654322', true, NOW(), NOW());

-- Reset sequence cho ID tự tăng của tài khoản
SELECT setval('tai_khoan_id_seq', (SELECT MAX(id) FROM tai_khoan));

-- [3] Người dùng (Tham chiếu tai_khoan_id)
INSERT INTO nguoi_dung (maNguoiDung, hoTen, soDienThoai, gioiTinh, CCCD, taiKhoanId) VALUES
('ND001', 'Administrator', '0901234567', 'Nam', '012345678901', 1),
('ND002', 'Lãnh đạo ATVSTP', '0901234568', 'Nữ', '012345678902', 2),
('ND003', 'Cán bộ Thanh tra', '0901234569', 'Nam', '012345678903', 3),
('ND004', 'Cán bộ Kiểm định', '0901234570', 'Nam', '012345678904', 4),
('ND005', 'Nguyễn Văn A', '0987654321', 'Nam', '012345678905', 5),
('ND006', 'Nguyễn Văn B', '0987654322', 'Nam', '012345678906', 6);

-- [4] Phân quyền người dùng (Phải đủ dấu phẩy)
INSERT INTO quyen_han_nguoi_dung (maQuyenHan, taiKhoanId) VALUES
('QTH', 1),
('LD_ATVSTP', 2),
('CB_THANH_TRA', 3),
('CB_KIEM_DINH', 4),
('NTD', 5),
('CSKD', 6);

-- [5] Phường xã
INSERT INTO phuong_xa (maPX, TenPhuongXa) VALUES
('PX001', 'Phường Hải Châu 1'),
('PX002', 'Phường Hải Châu 2'),
('PX003', 'Phường Thanh Khê'),
('PX004', 'Phường Sơn Trà'),
('PX005', 'Phường Ngũ Hành Sơn');

-- [6] Cơ sở kinh doanh (Bảng Cha)
-- Lưu ý: ND004, ND005, ND006 và các PX00x đều đã tồn tại ở trên
INSERT INTO co_so_kinh_doanh (maCoSo, tenCoSo, soGiayPhep, maCoSoTrue, ngayHetHanGiayPhep, trangThai, maChuSoHuu, maPX) VALUES
('CS001', 'Nhà hàng Sông Hàn', 'GP-2022-001', 'CS001', '2025-12-31', 'Hoat dong', 'ND004', 'PX001'),
('CS002', 'Quán Cơm Miền Trung', 'GP-2022-002', 'CS002', '2025-06-30', 'Hoat dong', 'ND005', 'PX002'),
('CS003', 'Cơ sở chế biến Thủy Sản ABC', 'GP-2023-003', 'CS003', '2026-03-15', 'Hoat dong', 'ND004', 'PX003'),
('CS004', 'Nhà hàng Sông Hàn – CN1', 'GP-2023-004', 'CS001', '2025-12-31', 'Hoat dong', 'ND006', 'PX004'),
('CS005', 'Bánh mỳ Đà Nẵng Express', 'GP-2023-005', 'CS005', '2026-01-20', 'Hoat dong', 'ND006', 'PX005');

-- [7] Loại hình kinh doanh
INSERT INTO loai_hinh_kinh_doanh (maLoaiHinhKinhDoanh, tenLoaiHinhKinhDoanh, moTa) VALUES
('LH001', 'Nhà hàng ăn uống', 'Cơ sở kinh doanh dịch vụ ăn uống tại chỗ'),
('LH002', 'Quán ăn bình dân', 'Cơ sở bán thức ăn đường phố, giá bình dân'),
('LH003', 'Cơ sở chế biến thực phẩm', 'Sản xuất và chế biến thực phẩm đóng gói'),
('LH004', 'Siêu thị – cửa hàng', 'Bán lẻ thực phẩm có hạn sử dụng'),
('LH005', 'Bếp ăn tập thể', 'Phục vụ bữa ăn cho tập thể');

-- [8] Mapping (Bảng Con - Tham chiếu từ CS001 đến CS005)
INSERT INTO co_so_loai_hinh (maCoSo, maLoaiHinhKinhDoanh) VALUES
('CS001', 'LH001'),
('CS002', 'LH002'),
('CS003', 'LH003'),
('CS004', 'LH001'),
('CS005', 'LH002');

-- [11] LichThanhTra
INSERT INTO lich_thanh_tra (maThanhTra, maCoSo, maNguoiThanhTra, trangThai, noiDung) VALUES
    ('LTT001', 'CS001', 'ND002', 'Đã hoàn thành', 'Thanh tra định kỳ quý II/2025 tại nhà hàng Sông Hàn'),
    ('LTT002', 'CS002', 'ND002', 'Đang thực hiện', 'Thanh tra đột xuất theo phản ánh người dân'),
    ('LTT003', 'CS003', 'ND003', 'Đã hoàn thành', 'Thanh tra định kỳ cơ sở chế biến thủy sản'),
    ('LTT004', 'CS004', 'ND002', 'Lên kế hoạch',  'Thanh tra chi nhánh Nhà hàng Sông Hàn'),
    ('LTT005', 'CS005', 'ND003', 'Lên kế hoạch',  'Thanh tra định kỳ quý III/2025');

-- [12] LichThanhTra_NguoiDung
INSERT INTO lich_thanh_tra_nguoi_dung (maThanhTra, maNguoiThanhTra, thoiGianTT) VALUES
    ('LTT001', 'ND002', '2025-04-15 08:00:00'),
    ('LTT001', 'ND003', '2025-04-15 08:00:00'),
    ('LTT002', 'ND002', '2025-05-20 09:00:00'),
    ('LTT003', 'ND003', '2025-05-10 08:30:00'),
    ('LTT004', 'ND002', '2025-07-01 08:00:00');

-- [13] ChiNhanh
INSERT INTO chi_nhanh (maChiNhanh, diaChi, soDienThoai, trangThai, maCoSo, lianThanhTraGanNhat) VALUES
    ('CN001', '123 Bạch Đằng, Hải Châu, Đà Nẵng',  '02363456789', 'Đang hoạt động', 'CS001', 'LTT001'),
    ('CN002', '45 Nguyễn Văn Linh, Thanh Khê',      '02363456790', 'Đang hoạt động', 'CS002', 'LTT002'),
    ('CN003', '78 Trần Phú, Sơn Trà, Đà Nẵng',      '02363456791', 'Tạm dừng',       'CS003', 'LTT003'),
    ('CN004', '12 Hoàng Diệu, Hải Châu, Đà Nẵng',   '02363456792', 'Đang hoạt động', 'CS004', 'LTT004'),
    ('CN005', '99 Lê Duẩn, Hải Châu, Đà Nẵng',      '02363456793', 'Đang hoạt động', 'CS005', 'LTT005');

-- [14] HoSoDangKiKinhDoanh
INSERT INTO ho_so_kinh_doanh (maHoSo, ngayNop, trangThai, maCoSo) VALUES
    ('HSD001', '2022-01-10', 'Đã duyệt','CS001'),
    ('HSD002', '2022-03-15', 'Đã duyệt','CS002'),
    ('HSD003', '2023-02-20', 'Đã duyệt','CS003'),
    ('HSD004', '2023-05-05', 'Chờ duyệt',    'CS004'),
    ('HSD005', '2023-08-12', 'Đã duyệt','CS005');

-- [15] ChungNhanATVSTP
INSERT INTO chung_nhan_atvstp (maCN, tenChungNhan, ngayBanHanh, ngayHetHan, maCoSoKinhDoanh, trangThai) VALUES
    ('CN001', 'Chứng nhận ATVS – Nhà hàng Sông Hàn','2023-01-05', '2026-01-05', 'CS001', 'Còn hiệu lực'),
    ('CN002', 'Chứng nhận ATVS – Quán Cơm Miền Trung','2022-06-01', '2025-06-01', 'CS002', 'Hết hạn'),
    ('CN003', 'Chứng nhận ATVS – Cơ sở Thủy Sản ABC', '2023-03-20', '2026-03-20', 'CS003', 'Còn hiệu lực'),
    ('CN004', 'Chứng nhận ATVS – Nhà hàng Sông Hàn CN1',      '2023-05-10', '2026-05-10', 'CS004', 'Còn hiệu lực'),
    ('CN005', 'Chứng nhận ATVS – Bánh mỳ Đà Nẵng Express',    '2023-02-14', '2026-02-14', 'CS005', 'Còn hiệu lực');

-- [16] LoaiPhanAnh
INSERT INTO loai_phan_anh (maLoaiPhanAnh, tenLoaiPhanAnh) VALUES
    ('LPA001', 'Vệ sinh an toàn thực phẩm'),
    ('LPA002', 'Chất lượng thực phẩm'),
    ('LPA003', 'Thái độ phục vụ'),
    ('LPA004', 'Giấy phép kinh doanh'),
    ('LPA005', 'Khác');

-- [17] PhanAnh
INSERT INTO phan_anh (maPhanAnh, maNguoiPhanAnh, trangThaiPhanAnh, maCoSo, lyDo, ngayGui, maLoaiPhanAnh) VALUES
    ('PA001', 'ND004', 'Đang xử lý',   'CS002', 'Quán ăn không đảm bảo vệ sinh, bàn ghế bẩn',  '2025-05-25 10:00:00', 'LPA001'),
    ('PA002', 'ND005', 'Đã xử lý',     'CS001', 'Thực phẩm có mùi lạ, nghi ngờ không tươi',      '2025-05-20 14:30:00', 'LPA002'),
    ('PA003', 'ND004', 'Chưa xử lý',   'CS003', 'Xưởng chế biến không có lưới chắn côn trùng',  '2025-06-01 09:00:00', 'LPA001'),
    ('PA004', 'ND005', 'Đang xử lý',   'CS005', 'Nhân viên không đeo khẩu trang khi làm việc',   '2025-06-03 11:00:00', 'LPA003'),
    ('PA005', 'ND004', 'Đã xử lý',     'CS004', 'Cơ sở không trưng bày giấy phép kinh doanh',   '2025-04-10 08:00:00', 'LPA004');

-- [18] GiayPhep
INSERT INTO giay_phep (maGiayPhep, loaiGiayPhep, trangThai, ngayCap, ngayHetHan, maCoSo) VALUES
    ('GP001', 'Giấy phép kinh doanh',            'Còn hiệu lực', '2022-01-15', '2025-12-31', 'CS001'),
    ('GP002', 'Giấy phép vệ sinh an toàn thực phẩm', 'Hết hạn', '2022-03-20', '2025-03-20', 'CS002'),
    ('GP003', 'Giấy phép sản xuất thực phẩm',    'Còn hiệu lực', '2023-02-25', '2026-02-25', 'CS003'),
    ('GP004', 'Giấy phép kinh doanh',            'Còn hiệu lực', '2023-05-10', '2026-05-10', 'CS004'),
    ('GP005', 'Giấy phép kinh doanh',            'Còn hiệu lực', '2023-08-20', '2026-08-20', 'CS005');

-- [19] HoSoThanhTra
INSERT INTO ho_so_thanh_tra (maHoSo, maThanhTra, diem, tinhTrangViPham, KetLuan, NhanXetChung, BienPhapXuLy, KienNghi) VALUES
    ('HSTT001', 'LTT001', 85.0, 'Có vi phạm nhỏ',   'Cơ sở đạt tiêu chuẩn nhưng cần khắc phục một số điểm nhỏ', 'Nhìn chung vệ sinh tốt',         'Yêu cầu bổ sung biển cảnh báo',     'Tăng cường kiểm tra định kỳ'),
    ('HSTT002', 'LTT002', 60.0, 'Vi phạm nghiêm trọng', 'Cơ sở vi phạm nhiều điều khoản về vệ sinh',             'Nhiều hạng mục không đạt chuẩn',  'Đình chỉ hoạt động tạm thời',       'Kiểm tra lại sau 30 ngày'),
    ('HSTT003', 'LTT003', 92.0, 'Không vi phạm',    'Cơ sở đạt xuất sắc các tiêu chí',                          'Hệ thống VSATTP được duy trì tốt', 'Không cần biện pháp xử lý',        'Tiếp tục duy trì'),
    ('HSTT004', 'LTT004', 75.0, 'Có vi phạm',       'Chi nhánh cần cải thiện điều kiện bảo quản thực phẩm',     'Một số tủ lạnh không đủ nhiệt độ', 'Yêu cầu nâng cấp trang thiết bị',  'Kiểm tra sau 14 ngày'),
    ('HSTT005', 'LTT005', 88.0, 'Có vi phạm nhỏ',   'Cơ sở hoạt động tốt, vi phạm không đáng kể',              'Khu vực chế biến gọn gàng',       'Nhắc nhở về vệ sinh tay',           'Theo dõi trong 6 tháng');

-- [20] LoaiViPham
INSERT INTO loai_vi_pham (maLoaiViPham, tenLoaiViPham, moTaThem) VALUES
    ('LVP001', 'Vi phạm vệ sinh cơ sở',        'Không đảm bảo điều kiện vệ sinh nhà xưởng, khu chế biến'),
    ('LVP002', 'Vi phạm về nguồn gốc thực phẩm', 'Sử dụng nguyên liệu không rõ nguồn gốc, không có hóa đơn'),
    ('LVP003', 'Vi phạm bảo quản thực phẩm',   'Nhiệt độ bảo quản không đúng quy định'),
    ('LVP004', 'Vi phạm về nhân sự',            'Người lao động không có chứng chỉ tập huấn ATVS'),
    ('LVP005', 'Vi phạm về giấy tờ pháp lý',   'Kinh doanh khi giấy phép đã hết hạn');

-- [21] ViPham
INSERT INTO vi_pham (maViPham, maHoSo, maLoaiViPham, moTaThem, khacPhuc, trangThaiPheDuyet, mucDo) VALUES
    ('VP001', 'HSTT001', 'LVP001', 'Sàn nhà khu chế biến còn ướt và trơn',                'Lau khô sàn, lắp thêm tấm chống trơn',          'Đã phê duyệt', 'Trung binh'),
    ('VP002', 'HSTT002', 'LVP002', 'Phát hiện 5kg thịt heo không có giấy kiểm dịch',     'Tiêu hủy lô hàng, cam kết nhập từ nguồn hợp lệ', 'Đã phê duyệt', 'Trung binh'),
    ('VP003', 'HSTT002', 'LVP004', 'Hai nhân viên bếp không có chứng chỉ ATVS',          'Đăng ký tập huấn trong vòng 30 ngày',            'Chờ phê duyệt', 'Trung binh'),
    ('VP004', 'HSTT004', 'LVP003', 'Tủ lạnh bảo quản thịt sống đang ở +8°C (quá chuẩn)','Kiểm tra và thay thế tủ lạnh',                   'Đã phê duyệt', 'Trung binh'),
    ('VP005', 'HSTT005', 'LVP001', 'Nhân viên không đeo găng tay khi tiếp xúc thực phẩm','Cấp phát và yêu cầu sử dụng đồ bảo hộ',         'Đã phê duyệt', 'Trung binh');

-- [22] HinhThucKhacPhuc
INSERT INTO hinh_thuc_khac_phuc (maHinhThucKhacPhuc, soTienKhacPhuc, tinhTrangKhacPhuc) VALUES
    ('HT001', 2000000.00,  'Đã khắc phục'),
    ('HT002', 5000000.00,  'Đang khắc phục'),
    ('HT003', 0.00,        'Đã khắc phục'),
    ('HT004', 10000000.00, 'Chưa khắc phục'),
    ('HT005', 500000.00,   'Đã khắc phục');

-- [23] MinhChungKhacPhuc
INSERT INTO minh_chung_khac_phuc (maMinhChung, maViPham, thoiGianGui) VALUES
    ('MC001', 'VP001', '2025-04-20 08:00:00'),
    ('MC002', 'VP002', '2025-05-25 10:30:00'),
    ('MC003', 'VP004', '2025-06-05 09:00:00'),
    ('MC004', 'VP005', '2025-06-08 11:00:00'),
    ('MC005', 'VP001', '2025-04-22 14:00:00');

-- [24] KhieuNai
INSERT INTO khieu_nai (maKhieuNai, trangThai, maCoSo, thoiGianKhieuNai, moTaChiTiet) VALUES
    ('KN001', 'Đang xử lý',  'CS002', '2025-05-28 09:00:00', 'Khiếu nại kết quả thanh tra, cho rằng đoàn thanh tra đánh giá không công bằng'),
    ('KN002', 'Đã giải quyết','CS001', '2025-04-20 14:00:00', 'Khiếu nại về mức phạt tiền quá cao so với tính chất vi phạm'),
    ('KN003', 'Chưa xử lý',  'CS003', '2025-06-02 10:00:00', 'Yêu cầu xem xét lại biên bản vi phạm ngày 10/05/2025'),
    ('KN004', 'Đang xử lý',  'CS004', '2025-06-04 08:30:00', 'Khiếu nại quyết định đình chỉ tạm thời hoạt động chi nhánh'),
    ('KN005', 'Đã giải quyết','CS005', '2025-05-15 11:00:00', 'Khiếu nại về việc cán bộ thanh tra không thông báo trước 48 giờ');

-- [25] ChiTieuKiemNghiem
INSERT INTO chi_tieu_kiem_nghiem (maChiTieu, tenChiTieu) VALUES
    ('CT001', 'Chỉ tiêu vi sinh vật tổng số'),
    ('CT002', 'Coliform tổng số'),
    ('CT003', 'E.coli'),
    ('CT004', 'Salmonella'),
    ('CT005', 'Kim loại nặng (Pb, Hg, Cd)');

-- [26] MauKiemNghiem
INSERT INTO mau_kiem_nghiem (maMau, tenMau, ngayThu, ngayKiemNghiem, trangThai, loaiMau, noiDung, ngayYeuCau, hanHoanThanh) VALUES
    ('MK001', 'Mẫu thịt heo cơ sở CS001',    '2025-04-15', '2025-04-17', 'Có kết quả',  'Thực phẩm', 'Lấy mẫu ngẫu nhiên tại kho lạnh', '2025-04-15', '2025-04-20'),
    ('MK002', 'Mẫu rau sống cơ sở CS002',    '2025-05-20', '2025-05-22', 'Có kết quả',  'Thực phẩm', 'Lấy mẫu rau ăn sống',             '2025-05-20', '2025-05-25'),
    ('MK003', 'Mẫu chả cá cơ sở CS003',      '2025-05-10', '2025-05-12', 'Có kết quả',  'Thực phẩm', 'Lấy mẫu sản phẩm đóng gói',       '2025-05-10', '2025-05-15'),
    ('MK004', 'Mẫu nước uống cơ sở CS004',   '2025-06-01', '2025-06-03', 'Đang xét nghiệm', 'Nước',  'Kiểm tra chất lượng nước uống',   '2025-06-01', '2025-06-07'),
    ('MK005', 'Mẫu bánh mỳ cơ sở CS005',     '2025-06-03', '2025-06-08',  'Chờ xét nghiệm',  'Thực phẩm', 'Kiểm tra vi sinh và phụ gia',  '2025-06-03', '2025-06-10');

-- [27] Mau_ChiTieu
INSERT INTO mau_chi_tieu (maMau, maChiTieu, ketQua) VALUES
    ('MK001', 'CT001', '10^3 CFU/g – Đạt'),
    ('MK001', 'CT003', 'Âm tính – Đạt'),
    ('MK002', 'CT001', '10^5 CFU/g – Không đạt'),
    ('MK002', 'CT002', '150 MPN/100g – Không đạt'),
    ('MK003', 'CT004', 'Âm tính – Đạt');

-- [28] DamNhanKiemNgiem
INSERT INTO dam_nhan_kiem_nghiem (maNguoiKiemNghiem, maMau) VALUES
    ('ND003', 'MK001'),
    ('ND003', 'MK002'),
    ('ND002', 'MK003'),
    ('ND003', 'MK003'),
    ('ND002', 'MK004');

-- [29] tieuChiDanhGia
INSERT INTO tieu_chi_danh_gia (MaTieuChi, TenTieuChi, Nhom, ThuTu) VALUES
    ('TC001', 'Điều kiện vệ sinh cơ sở vật chất',    'Cơ sở', 1),
    ('TC002', 'Điều kiện trang thiết bị, dụng cụ',   'Cơ sở', 2),
    ('TC003', 'Điều kiện về con người',               'Nhân sự', 3),
    ('TC004', 'Nguồn gốc và chất lượng nguyên liệu',  'Nguyên liệu', 4),
    ('TC005', 'Hồ sơ pháp lý, giấy tờ liên quan',    'Pháp lý', 5);

-- [30] kqDanhGia
INSERT INTO kq_danh_gia (maHoSo, MaTieuChi, KetQuaDanhGia) VALUES
    ('HSTT001', 'TC001', 'Đạt – 20/20 điểm'),
    ('HSTT001', 'TC003', 'Đạt – 18/20 điểm'),
    ('HSTT002', 'TC001', 'Không đạt – 10/20 điểm'),
    ('HSTT002', 'TC004', 'Không đạt – 8/20 điểm'),
    ('HSTT003', 'TC005', 'Đạt – 20/20 điểm');

-- [31] BaoCao
INSERT INTO bao_cao (maBaoCao, maHoSo, NoiDung, nhanXet) VALUES
    ('BC001', 'HSTT001', 'Báo cáo đợt thanh tra tháng 4 năm 2025 tại Nhà hàng Sông Hàn. Kết quả đạt 85/100 điểm.',         'Cơ sở hoạt động tốt, cần cải thiện khu vực sàn'),
    ('BC002', 'HSTT002', 'Báo cáo đợt thanh tra đột xuất tháng 5 năm 2025 tại Quán Cơm Miền Trung. Nhiều vi phạm.',       'Kiến nghị đình chỉ tạm thời để khắc phục'),
    ('BC003', 'HSTT003', 'Báo cáo đợt thanh tra định kỳ tháng 5 năm 2025 tại Cơ sở Thủy Sản ABC. Đạt xuất sắc.',         'Đây là mô hình điển hình về VSATTP'),
    ('BC004', 'HSTT004', 'Báo cáo đợt thanh tra chi nhánh tháng 6 năm 2025. Phát hiện vi phạm bảo quản lạnh.',            'Yêu cầu khắc phục thiết bị trong 14 ngày'),
    ('BC005', 'HSTT005', 'Báo cáo sơ bộ đợt thanh tra quý III/2025 tại Bánh mỳ Đà Nẵng Express.',                         'Nhìn chung tốt, vi phạm nhỏ đã được nhắc nhở');

-- [31.5] ThongBao
INSERT INTO thong_bao (maThongBao, tieuDe, noiDung, ngayGui, loaiThongBao, isCongDong) VALUES
    ('TB001', 'Thông báo kiểm tra định kỳ', 'Lịch kiểm tra định kỳ quý II/2025', '2025-04-10 08:00:00', 'Thanh tra', true),
    ('TB002', 'Thông báo nhắc nhở', 'Nhắc nhở bổ sung hồ sơ kinh doanh', '2025-05-01 09:30:00', 'Hồ sơ', false),
    ('TB003', 'Thông báo kết quả kiểm nghiệm', 'Kết quả kiểm nghiệm mẫu MK002', '2025-05-23 14:00:00', 'Kiểm nghiệm', false),
    ('TB004', 'Thông báo xử lý phản ánh', 'Phản ánh PA004 đang được xử lý', '2025-06-04 10:15:00', 'Phản ánh', false),
    ('TB005', 'Thông báo chung', 'Cập nhật quy định an toàn thực phẩm', '2025-06-06 16:30:00', 'Quy định', true);

-- [32] FileDinhKem
-- ĐÃ FIX: Thêm dấu phẩy bị thiếu, gộp các chuỗi URL lại thành 1 chuỗi hợp lệ (nếu cần thiết, hoặc chỉ để 1 URL đại diện).
INSERT INTO file_dinh_kem (maFile, urlFile, loaiFile, thoiGianGui, maMinhChung, maPhanAnh, maKhieuNai, maThongBao, maHoSoDangKiKinhDoanh, maTinhTrangKhacPhuc) VALUES
    ('FD001', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'image/jpeg', '2025-04-20 08:05:00', 'MC001', 'PA001', 'KN001', 'TB001', 'HSD001', 'HT001'),
    ('FD002', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'image/png', '2025-05-25 10:35:00', 'MC002', 'PA002', 'KN002', 'TB002', 'HSD002', 'HT002'),
    ('FD003', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'application/pdf', '2025-05-25 14:00:00', 'MC003', 'PA003', 'KN003', 'TB003', 'HSD003', 'HT003'),
    ('FD004', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'application/pdf', '2025-05-28 09:10:00', 'MC004', 'PA004', 'KN004', 'TB004', 'HSD004', 'HT004'),
    ('FD005', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'application/pdf', '2022-01-10 10:00:00', 'MC005', 'PA005', 'KN005', 'TB005', 'HSD005', 'HT005');
