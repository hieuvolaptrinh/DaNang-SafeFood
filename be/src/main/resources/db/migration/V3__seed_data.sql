-- -- =============================================
-- -- DATA.SQL - Dữ liệu test SafeFood
-- -- =============================================
--
-- -- [1] Quyền hạn
-- INSERT INTO quyen_han (maQuyenHan, quyenHan) VALUES
--                                                  ('QTH', 'Quản trị hệ thống'),
--                                                  ('LD_ATVSTP', 'Lãnh đạo ATVSTP'),
--                                                  ('CSKD', 'Chuyên viên Kinh doanh'),
--                                                  ('CB_THANH_TRA', 'Cán bộ Thanh tra'),
--                                                  ('CB_KIEM_DINH', 'Cán bộ Kiểm định'),
--                                                  ('NTD', 'Người tiêu dùng');
--
-- -- [2] Tài khoản test
-- -- password = 123456 (đã mã hóa bằng BCrypt)
-- INSERT INTO tai_khoan (id, username, password, full_name, email, phone, enabled, created_at, updated_at) VALUES
--                                                                                                              (1, 'admin', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Administrator', 'admin@safefood.vn', '0901234567', true, NOW(), NOW()),
--                                                                                                              (2, 'ld1', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Lãnh đạo ATVSTP', 'ld@safefood.vn', '0901234568', true, NOW(), NOW()),
--                                                                                                              (3, 'thanhtra', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Cán bộ Thanh tra', 'thanhtra@safefood.vn', '0901234569', true, NOW(), NOW()),
--                                                                                                              (4, 'kiemdinh', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Cán bộ Kiểm định', 'kiemdinh@safefood.vn', '0901234570', true, NOW(), NOW()),
--                                                                                                              (5, 'user1', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Nguyễn Văn A', 'user1@gmail.com', '0987654321', true, NOW(), NOW());
--
-- -- [3] Người dùng
-- INSERT INTO nguoi_dung (maNguoiDung, hoTen, soDienThoai, gioiTinh, CCCD, tai_khoan_id) VALUES
--                                                                                            ('ND001', 'Administrator', '0901234567', 'Nam', '012345678901', 1),
--                                                                                            ('ND002', 'Lãnh đạo ATVSTP', '0901234568', 'Nữ', '012345678902', 2),
--                                                                                            ('ND003', 'Cán bộ Thanh tra', '0901234569', 'Nam', '012345678903', 3),
--                                                                                            ('ND004', 'Cán bộ Kiểm định', '0901234570', 'Nam', '012345678904', 4),
--                                                                                            ('ND005', 'Nguyễn Văn A', '0987654321', 'Nam', '012345678905', 5);
--
-- -- [5] PhuongXa
-- INSERT INTO phuong_xa (maPX, TenPhuongXa) VALUES
--                                               ('PX001', 'Phường Hải Châu 1'),
--                                               ('PX002', 'Phường Hải Châu 2'),
--                                               ('PX003', 'Phường Thanh Khê'),
--                                               ('PX004', 'Phường Sơn Trà'),
--                                               ('PX005', 'Phường Ngũ Hành Sơn');
--
-- -- [6] CoSoKinhDoanh (maCoSoTrue NULL cho trụ sở chính)
-- INSERT INTO co_so_kinh_doanh (maCoSo, tenCoSo, soGiayPhep, maCoSoTrue, ngayHetHanGiayPhep, maChuSoHuu, maPX) VALUES
--                                                                                                                  ('CS001', 'Nhà hàng Sông Hàn',          'GP-2022-001', NULL,    '2025-12-31', 'ND004', 'PX001'),
--                                                                                                                  ('CS002', 'Quán Cơm Miền Trung',         'GP-2022-002', NULL,    '2025-06-30', 'ND005', 'PX002'),
--                                                                                                                  ('CS003', 'Cơ sở chế biến Thủy Sản ABC', 'GP-2023-003', NULL,    '2026-03-15', 'ND004', 'PX003'),
--                                                                                                                  ('CS004', 'Nhà hàng Sông Hàn – CN1',     'GP-2023-004', 'CS001', '2025-12-31', 'ND004', 'PX004'),
--                                                                                                                  ('CS005', 'Bánh mỳ Đà Nẵng Express',     'GP-2023-005', NULL,    '2026-01-20', 'ND005', 'PX005');
--
-- -- [4] Phân quyền tài khoản
-- INSERT INTO quyen_han_nguoi_dung (maQuyenHan, tai_khoan_id) VALUES
--                                                                 ('QTH', 1),
--                                                                 ('LD_ATVSTP', 2),
--                                                                 ('CB_THANH_TRA', 3),
--                                                                 ('CB_KIEM_DINH', 4),
--                                                                 ('NTD', 5);
--
-- -- Reset sequence cho tai_khoan
-- ALTER SEQUENCE tai_khoan_id_seq RESTART WITH 6;

-- [7] ThongBao
INSERT INTO thong_bao (maThongBao, tieuDe, noiDung, ngayGui, loaiThongBao) VALUES
                                                                               ('TB001', N'Lịch thanh tra tháng 6',        N'Đề nghị chuẩn bị hồ sơ cho đợt thanh tra tháng 6/2025.',     '2025-05-28 08:00:00', N'Hành chính'),
                                                                               ('TB002', N'Gia hạn giấy phép',             N'Giấy phép của cơ sở CS002 sắp hết hạn, vui lòng gia hạn.',  '2025-05-30 09:00:00', N'Nhắc nhở'),
                                                                               ('TB003', N'Kết quả kiểm nghiệm mẫu MK001', N'Mẫu kiểm nghiệm MK001 đã có kết quả, vui lòng xem chi tiết.','2025-06-01 10:00:00', N'Kết quả'),
                                                                               ('TB004', N'Phân ánh mới từ người dân',      N'Có 2 phản ánh mới cần xử lý về cơ sở CS001.',               '2025-06-02 14:00:00', N'Phản ánh'),
                                                                               ('TB005', N'Cập nhật chứng nhận ATVS',       N'Chứng nhận ATVS của CS003 đã được cấp mới.',                '2025-06-03 08:30:00', N'Thông báo');

-- [7] ThongBao_NguoiDung
INSERT INTO thong_bao_nguoi_dung (maNguoiDung, maThongBao, trangThai) VALUES
                                                                          ('ND001', 'TB001', 'Đã đọc'),
                                                                          ('ND002', 'TB001', 'Chưa đọc'),
                                                                          ('ND004', 'TB002', 'Đã đọc'),
                                                                          ('ND002', 'TB003', 'Đã đọc'),
                                                                          ('ND003', 'TB004', 'Chưa đọc');

-- [8] Log
INSERT INTO log (maLog, ip, "time", maNguoiDung) VALUES
                                                     ('LOG001', '192.168.1.10', '2025-06-01 08:05:00', 'ND001'),
                                                     ('LOG002', '192.168.1.11', '2025-06-01 09:10:00', 'ND002'),
                                                     ('LOG003', '10.0.0.5',     '2025-06-02 10:20:00', 'ND003'),
                                                     ('LOG004', '203.113.4.21', '2025-06-02 11:35:00', 'ND004'),
                                                     ('LOG005', '203.113.4.22', '2025-06-03 14:00:00', 'ND005');

-- [9] LoaiHinhKinhDoanh
INSERT INTO loai_hinh_kinh_doanh (maLoaiHinhKinhDoanh, tenLoaiHinhKinhDoanh, moTa) VALUES
                                                                                       ('LH001', N'Nhà hàng ăn uống',      N'Cơ sở kinh doanh dịch vụ ăn uống tại chỗ'),
                                                                                       ('LH002', N'Quán ăn bình dân',      N'Cơ sở bán thức ăn đường phố, giá bình dân'),
                                                                                       ('LH003', N'Cơ sở chế biến thực phẩm', N'Sản xuất và chế biến thực phẩm đóng gói'),
                                                                                       ('LH004', N'Siêu thị – cửa hàng',   N'Bán lẻ thực phẩm có hạn sử dụng'),
                                                                                       ('LH005', N'Bếp ăn tập thể',        N'Phục vụ bữa ăn cho tập thể, trường học, xí nghiệp');
GO

-- [10] CoSo_LoaiHinh
INSERT INTO co_so_loai_hinh (maCoSo, maLoaiHinhKinhDoanh) VALUES
    ('CS001', 'LH001'),
    ('CS002', 'LH002'),
    ('CS003', 'LH003'),
    ('CS004', 'LH001'),
    ('CS005', 'LH002');
GO

-- [11] LichThanhTra
INSERT INTO lich_thanh_tra (maThanhTra, maCoSo, maNguoiThanhTra, trangThai, noiDung) VALUES
    ('LTT001', 'CS001', 'ND002', N'Đã hoàn thành', N'Thanh tra định kỳ quý II/2025 tại nhà hàng Sông Hàn'),
    ('LTT002', 'CS002', 'ND002', N'Đang thực hiện', N'Thanh tra đột xuất theo phản ánh người dân'),
    ('LTT003', 'CS003', 'ND003', N'Đã hoàn thành', N'Thanh tra định kỳ cơ sở chế biến thủy sản'),
    ('LTT004', 'CS004', 'ND002', N'Lên kế hoạch',  N'Thanh tra chi nhánh Nhà hàng Sông Hàn'),
    ('LTT005', 'CS005', 'ND003', N'Lên kế hoạch',  N'Thanh tra định kỳ quý III/2025');
GO

-- [12] LichThanhTra_NguoiDung
INSERT INTO lich_thanh_tra_nguoi_dung (maThanhTra, maNguoiThanhTra, thoiGianTT) VALUES
    ('LTT001', 'ND002', '2025-04-15 08:00:00'),
    ('LTT001', 'ND003', '2025-04-15 08:00:00'),
    ('LTT002', 'ND002', '2025-05-20 09:00:00'),
    ('LTT003', 'ND003', '2025-05-10 08:30:00'),
    ('LTT004', 'ND002', '2025-07-01 08:00:00');
GO

-- [13] ChiNhanh
INSERT INTO chi_nhanh (maChiNhanh, diaChi, soDienThoai, trangThai, maCoSo, lianThanhTraGanNhat) VALUES
    ('CN001', N'123 Bạch Đằng, Hải Châu, Đà Nẵng',  '02363456789', N'Đang hoạt động', 'CS001', 'LTT001'),
    ('CN002', N'45 Nguyễn Văn Linh, Thanh Khê',      '02363456790', N'Đang hoạt động', 'CS002', 'LTT002'),
    ('CN003', N'78 Trần Phú, Sơn Trà, Đà Nẵng',      '02363456791', N'Tạm dừng',       'CS003', 'LTT003'),
    ('CN004', N'12 Hoàng Diệu, Hải Châu, Đà Nẵng',   '02363456792', N'Đang hoạt động', 'CS004', 'LTT004'),
    ('CN005', N'99 Lê Duẩn, Hải Châu, Đà Nẵng',      '02363456793', N'Đang hoạt động', 'CS005', NULL);
GO

-- [14] HoSoDangKiKinhDoanh
INSERT INTO ho_so_dang_ki_kinh_doanh (maHoSo, ngayNop, trangThai, maCoSo) VALUES
    ('HSD001', '2022-01-10', N'Đã duyệt',     'CS001'),
    ('HSD002', '2022-03-15', N'Đã duyệt',     'CS002'),
    ('HSD003', '2023-02-20', N'Đã duyệt',     'CS003'),
    ('HSD004', '2023-05-05', N'Chờ duyệt',    'CS004'),
    ('HSD005', '2023-08-12', N'Đã duyệt',     'CS005');
GO

-- [15] ChungNhanATVSTP
INSERT INTO chung_nhan_atvstp (maCN, tenChungNhan, ngayBanHanh, ngayHetHan, maCoSoKinhDoanh, trangThai) VALUES
    ('CN001', N'Chứng nhận ATVS – Nhà hàng Sông Hàn',          '2023-01-05', '2026-01-05', 'CS001', N'Còn hiệu lực'),
    ('CN002', N'Chứng nhận ATVS – Quán Cơm Miền Trung',        '2022-06-01', '2025-06-01', 'CS002', N'Hết hạn'),
    ('CN003', N'Chứng nhận ATVS – Cơ sở Thủy Sản ABC',         '2023-03-20', '2026-03-20', 'CS003', N'Còn hiệu lực'),
    ('CN004', N'Chứng nhận ATVS – Nhà hàng Sông Hàn CN1',      '2023-05-10', '2026-05-10', 'CS004', N'Còn hiệu lực'),
    ('CN005', N'Chứng nhận ATVS – Bánh mỳ Đà Nẵng Express',    '2023-02-14', '2026-02-14', 'CS005', N'Còn hiệu lực');
GO

-- [16] LoaiPhanAnh
INSERT INTO loai_phan_anh (maLoaiPhanAnh, tenLoaiPhanAnh) VALUES
    ('LPA001', N'Vệ sinh an toàn thực phẩm'),
    ('LPA002', N'Chất lượng thực phẩm'),
    ('LPA003', N'Thái độ phục vụ'),
    ('LPA004', N'Giấy phép kinh doanh'),
    ('LPA005', N'Khác');
GO

-- [17] PhanAnh
INSERT INTO phan_anh (maPhanAnh, maNguoiPhanAnh, trangThaiPhanAnh, maCoSo, lyDo, ngayGui, maLoaiPhanAnh) VALUES
    ('PA001', 'ND004', N'Đang xử lý',   'CS002', N'Quán ăn không đảm bảo vệ sinh, bàn ghế bẩn',          '2025-05-25 10:00:00', 'LPA001'),
    ('PA002', 'ND005', N'Đã xử lý',     'CS001', N'Thực phẩm có mùi lạ, nghi ngờ không tươi',              '2025-05-20 14:30:00', 'LPA002'),
    ('PA003', 'ND004', N'Chưa xử lý',   'CS003', N'Xưởng chế biến không có lưới chắn côn trùng',          '2025-06-01 09:00:00', 'LPA001'),
    ('PA004', 'ND005', N'Đang xử lý',   'CS005', N'Nhân viên không đeo khẩu trang khi làm việc',           '2025-06-03 11:00:00', 'LPA003'),
    ('PA005', 'ND004', N'Đã xử lý',     'CS004', N'Cơ sở không trưng bày giấy phép kinh doanh',           '2025-04-10 08:00:00', 'LPA004');
GO

-- [18] GiayPhep
INSERT INTO giay_phep (maGiayPhep, loaiGiayPhep, trangThai, ngayCap, ngayHetHan, maCoSo) VALUES
    ('GP001', N'Giấy phép kinh doanh',            N'Còn hiệu lực', '2022-01-15', '2025-12-31', 'CS001'),
    ('GP002', N'Giấy phép vệ sinh an toàn thực phẩm', N'Hết hạn', '2022-03-20', '2025-03-20', 'CS002'),
    ('GP003', N'Giấy phép sản xuất thực phẩm',    N'Còn hiệu lực', '2023-02-25', '2026-02-25', 'CS003'),
    ('GP004', N'Giấy phép kinh doanh',            N'Còn hiệu lực', '2023-05-10', '2026-05-10', 'CS004'),
    ('GP005', N'Giấy phép kinh doanh',            N'Còn hiệu lực', '2023-08-20', '2026-08-20', 'CS005');
GO

-- [19] HoSoThanhTra
INSERT INTO ho_so_thanh_tra (maHoSo, maThanhTra, diem, tinhTrangViPham, KetLuan, NhanXetChung, BienPhapXuLy, KienNghi) VALUES
    ('HSTT001', 'LTT001', 85.0, N'Có vi phạm nhỏ',   N'Cơ sở đạt tiêu chuẩn nhưng cần khắc phục một số điểm nhỏ', N'Nhìn chung vệ sinh tốt',         N'Yêu cầu bổ sung biển cảnh báo',     N'Tăng cường kiểm tra định kỳ'),
    ('HSTT002', 'LTT002', 60.0, N'Vi phạm nghiêm trọng', N'Cơ sở vi phạm nhiều điều khoản về vệ sinh',             N'Nhiều hạng mục không đạt chuẩn',  N'Đình chỉ hoạt động tạm thời',       N'Kiểm tra lại sau 30 ngày'),
    ('HSTT003', 'LTT003', 92.0, N'Không vi phạm',    N'Cơ sở đạt xuất sắc các tiêu chí',                          N'Hệ thống VSATTP được duy trì tốt', N'Không cần biện pháp xử lý',        N'Tiếp tục duy trì'),
    ('HSTT004', 'LTT004', 75.0, N'Có vi phạm',       N'Chi nhánh cần cải thiện điều kiện bảo quản thực phẩm',     N'Một số tủ lạnh không đủ nhiệt độ', N'Yêu cầu nâng cấp trang thiết bị',  N'Kiểm tra sau 14 ngày'),
    ('HSTT005', 'LTT005', 88.0, N'Có vi phạm nhỏ',   N'Cơ sở hoạt động tốt, vi phạm không đáng kể',              N'Khu vực chế biến gọn gàng',       N'Nhắc nhở về vệ sinh tay',           N'Theo dõi trong 6 tháng');
GO

-- [20] LoaiViPham
INSERT INTO loai_vi_pham (maLoaiViPham, tenLoaiViPham, moTaThem) VALUES
    ('LVP001', N'Vi phạm vệ sinh cơ sở',        N'Không đảm bảo điều kiện vệ sinh nhà xưởng, khu chế biến'),
    ('LVP002', N'Vi phạm về nguồn gốc thực phẩm', N'Sử dụng nguyên liệu không rõ nguồn gốc, không có hóa đơn'),
    ('LVP003', N'Vi phạm bảo quản thực phẩm',   N'Nhiệt độ bảo quản không đúng quy định'),
    ('LVP004', N'Vi phạm về nhân sự',            N'Người lao động không có chứng chỉ tập huấn ATVS'),
    ('LVP005', N'Vi phạm về giấy tờ pháp lý',   N'Kinh doanh khi giấy phép đã hết hạn');
GO

-- [21] ViPham
INSERT INTO vi_pham (maViPham, maHoSo, maLoaiViPham, moTaThem, khacPhuc, trangThaiPheDuyet) VALUES
    ('VP001', 'HSTT001', 'LVP001', N'Sàn nhà khu chế biến còn ướt và trơn',                N'Lau khô sàn, lắp thêm tấm chống trơn',          N'Đã phê duyệt'),
    ('VP002', 'HSTT002', 'LVP002', N'Phát hiện 5kg thịt heo không có giấy kiểm dịch',     N'Tiêu hủy lô hàng, cam kết nhập từ nguồn hợp lệ', N'Đã phê duyệt'),
    ('VP003', 'HSTT002', 'LVP004', N'Hai nhân viên bếp không có chứng chỉ ATVS',          N'Đăng ký tập huấn trong vòng 30 ngày',            N'Chờ phê duyệt'),
    ('VP004', 'HSTT004', 'LVP003', N'Tủ lạnh bảo quản thịt sống đang ở +8°C (quá chuẩn)',N'Kiểm tra và thay thế tủ lạnh',                   N'Đã phê duyệt'),
    ('VP005', 'HSTT005', 'LVP001', N'Nhân viên không đeo găng tay khi tiếp xúc thực phẩm',N'Cấp phát và yêu cầu sử dụng đồ bảo hộ',         N'Đã phê duyệt');
GO

-- [22] HinhThucKhacPhuc
INSERT INTO hinh_thuc_khac_phuc (maHinhThucKhacPhuc, soTienKhacPhuc, tinhTrangKhacPhuc) VALUES
    ('HT001', 2000000.00,  N'Đã khắc phục'),
    ('HT002', 5000000.00,  N'Đang khắc phục'),
    ('HT003', 0.00,        N'Đã khắc phục'),
    ('HT004', 10000000.00, N'Chưa khắc phục'),
    ('HT005', 500000.00,   N'Đã khắc phục');
GO

-- [23] MinhChungKhacPhuc
INSERT INTO minh_chung_khac_phuc (maMinhChung, maViPham, thoiGianGui) VALUES
    ('MC001', 'VP001', '2025-04-20 08:00:00'),
    ('MC002', 'VP002', '2025-05-25 10:30:00'),
    ('MC003', 'VP004', '2025-06-05 09:00:00'),
    ('MC004', 'VP005', '2025-06-08 11:00:00'),
    ('MC005', 'VP001', '2025-04-22 14:00:00');
GO

-- [24] KhieuNai
INSERT INTO khieu_nai (maKhieuNai, trangThai, maCoSo, thoiGianKhieuNai, moTaChiTiet) VALUES
    ('KN001', N'Đang xử lý',  'CS002', '2025-05-28 09:00:00', N'Khiếu nại kết quả thanh tra, cho rằng đoàn thanh tra đánh giá không công bằng'),
    ('KN002', N'Đã giải quyết','CS001', '2025-04-20 14:00:00', N'Khiếu nại về mức phạt tiền quá cao so với tính chất vi phạm'),
    ('KN003', N'Chưa xử lý',  'CS003', '2025-06-02 10:00:00', N'Yêu cầu xem xét lại biên bản vi phạm ngày 10/05/2025'),
    ('KN004', N'Đang xử lý',  'CS004', '2025-06-04 08:30:00', N'Khiếu nại quyết định đình chỉ tạm thời hoạt động chi nhánh'),
    ('KN005', N'Đã giải quyết','CS005', '2025-05-15 11:00:00', N'Khiếu nại về việc cán bộ thanh tra không thông báo trước 48 giờ');
GO

-- [25] ChiTieuKiemNghiem
INSERT INTO chi_tieu_kiem_nghiem (maChiTieu, tenChiTieu) VALUES
    ('CT001', N'Chỉ tiêu vi sinh vật tổng số'),
    ('CT002', N'Coliform tổng số'),
    ('CT003', N'E.coli'),
    ('CT004', N'Salmonella'),
    ('CT005', N'Kim loại nặng (Pb, Hg, Cd)');
GO

-- [26] MauKiemNghiem
INSERT INTO mau_kiem_nghiem (maMau, tenMau, ngayThu, ngayKiemNghiem, trangThai, loaiMau, noiDung, ngayYeuCau, hanHoanThanh) VALUES
    ('MK001', N'Mẫu thịt heo cơ sở CS001',    '2025-04-15', '2025-04-17', N'Có kết quả',  N'Thực phẩm', N'Lấy mẫu ngẫu nhiên tại kho lạnh', '2025-04-15', '2025-04-20'),
    ('MK002', N'Mẫu rau sống cơ sở CS002',    '2025-05-20', '2025-05-22', N'Có kết quả',  N'Thực phẩm', N'Lấy mẫu rau ăn sống',             '2025-05-20', '2025-05-25'),
    ('MK003', N'Mẫu chả cá cơ sở CS003',      '2025-05-10', '2025-05-12', N'Có kết quả',  N'Thực phẩm', N'Lấy mẫu sản phẩm đóng gói',       '2025-05-10', '2025-05-15'),
    ('MK004', N'Mẫu nước uống cơ sở CS004',   '2025-06-01', '2025-06-03', N'Đang xét nghiệm', N'Nước',  N'Kiểm tra chất lượng nước uống',   '2025-06-01', '2025-06-07'),
    ('MK005', N'Mẫu bánh mỳ cơ sở CS005',     '2025-06-03', NULL,         N'Chờ xét nghiệm',  N'Thực phẩm', N'Kiểm tra vi sinh và phụ gia',  '2025-06-03', '2025-06-10');
GO

-- [27] Mau_ChiTieu
INSERT INTO mau_chi_tieu (maMau, maChiTieu, ketQua) VALUES
    ('MK001', 'CT001', N'10^3 CFU/g – Đạt'),
    ('MK001', 'CT003', N'Âm tính – Đạt'),
    ('MK002', 'CT001', N'10^5 CFU/g – Không đạt'),
    ('MK002', 'CT002', N'150 MPN/100g – Không đạt'),
    ('MK003', 'CT004', N'Âm tính – Đạt');
GO

-- [28] DamNhanKiemNgiem
INSERT INTO dam_nhan_kiem_nghiem (maNguoiKiemNghiem, maMau) VALUES
    ('ND003', 'MK001'),
    ('ND003', 'MK002'),
    ('ND002', 'MK003'),
    ('ND003', 'MK003'),
    ('ND002', 'MK004');
GO

-- [29] tieuChiDanhGia
INSERT INTO tieu_chi_danh_gia (MaTieuChi, TenTieuChi, Nhom, ThuTu) VALUES
    ('TC001', N'Điều kiện vệ sinh cơ sở vật chất',    N'Cơ sở', 1),
    ('TC002', N'Điều kiện trang thiết bị, dụng cụ',   N'Cơ sở', 2),
    ('TC003', N'Điều kiện về con người',               N'Nhân sự', 3),
    ('TC004', N'Nguồn gốc và chất lượng nguyên liệu',  N'Nguyên liệu', 4),
    ('TC005', N'Hồ sơ pháp lý, giấy tờ liên quan',    N'Pháp lý', 5);
GO

-- [30] kqDanhGia
INSERT INTO kq_danh_gia (maHoSo, MaTieuChi, KetQuaDanhGia) VALUES
    ('HSTT001', 'TC001', N'Đạt – 20/20 điểm'),
    ('HSTT001', 'TC003', N'Đạt – 18/20 điểm'),
    ('HSTT002', 'TC001', N'Không đạt – 10/20 điểm'),
    ('HSTT002', 'TC004', N'Không đạt – 8/20 điểm'),
    ('HSTT003', 'TC005', N'Đạt – 20/20 điểm');
GO

-- [31] BaoCao
INSERT INTO bao_cao (maBaoCao, maHoSo, NoiDung, nhanXet) VALUES
    ('BC001', 'HSTT001', N'Báo cáo đợt thanh tra tháng 4 năm 2025 tại Nhà hàng Sông Hàn. Kết quả đạt 85/100 điểm.',         N'Cơ sở hoạt động tốt, cần cải thiện khu vực sàn'),
    ('BC002', 'HSTT002', N'Báo cáo đợt thanh tra đột xuất tháng 5 năm 2025 tại Quán Cơm Miền Trung. Nhiều vi phạm.',       N'Kiến nghị đình chỉ tạm thời để khắc phục'),
    ('BC003', 'HSTT003', N'Báo cáo đợt thanh tra định kỳ tháng 5 năm 2025 tại Cơ sở Thủy Sản ABC. Đạt xuất sắc.',         N'Đây là mô hình điển hình về VSATTP'),
    ('BC004', 'HSTT004', N'Báo cáo đợt thanh tra chi nhánh tháng 6 năm 2025. Phát hiện vi phạm bảo quản lạnh.',            N'Yêu cầu khắc phục thiết bị trong 14 ngày'),
    ('BC005', 'HSTT005', N'Báo cáo sơ bộ đợt thanh tra quý III/2025 tại Bánh mỳ Đà Nẵng Express.',                         N'Nhìn chung tốt, vi phạm nhỏ đã được nhắc nhở');
GO

-- [32] FileDinhKem
INSERT INTO file_dinh_kem (maFile, loaiFile, thoiGianGui, maMinhChung, maPhanAnh, maKhieuNai, maThongBao, maHoSoDangKiKinhDoanh, maTinhTrangKhacPhuc) VALUES
    ('FD001', N'image/jpeg', '2025-04-20 08:05:00', 'MC001', NULL,   NULL,   NULL,   NULL,   'HT001'),
    ('FD002', N'image/png',  '2025-05-25 10:35:00', 'MC002', NULL,   NULL,   NULL,   NULL,   'HT002'),
    ('FD003', N'application/pdf', '2025-05-25 14:00:00', NULL, 'PA001', NULL, NULL,  NULL,   NULL),
    ('FD004', N'application/pdf', '2025-05-28 09:10:00', NULL, NULL, 'KN001', NULL,  NULL,   NULL),
    ('FD005', N'application/pdf', '2022-01-10 10:00:00', NULL, NULL,  NULL,  NULL,   'HSD001', NULL);
GO