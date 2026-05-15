-- ============================================================================
-- DỮ LIỆU MẪU (PostgreSQL) — DaNang SafeFood
-- ============================================================================

TRUNCATE TABLE file_dinh_kem, hinh_thuc_khac_phuc, minh_chung_khac_phuc, vi_pham, loai_vi_pham,
               bao_cao, kq_danh_gia, tieu_chi_danh_gia, dam_nhan_kiem_nghiem, mau_chi_tieu,
               mau_kiem_nghiem, chi_tieu_kiem_nghiem, khieu_nai, phan_anh,
               loai_phan_anh, chung_nhan_atvstp, ho_so_dang_ki_kinh_doanh, loai_giay_to, chi_nhanh,
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
(6, 'kinhdoanh1', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Nguyễn Văn B', 'vndhieuak@gmail.com', '0987654322', true, NOW(), NOW());

SELECT setval('tai_khoan_id_seq', (SELECT MAX(id) FROM tai_khoan));

-- [3] Người dùng
INSERT INTO nguoi_dung (maNguoiDung, hoTen, gioiTinh, CCCD, taiKhoanId) VALUES
('ND001', 'Administrator',     'Nam', '012345678901', 1),
('ND002', 'Lãnh đạo ATVSTP',   'Nữ',  '012345678902', 2),
('ND003', 'Cán bộ Thanh tra',  'Nam', '012345678903', 3),
('ND004', 'Cán bộ Kiểm định',  'Nam', '012345678904', 4),
('ND005', 'Nguyễn Văn A',      'Nam', '012345678905', 5),
('ND006', 'Nguyễn Văn B',      'Nam', '012345678906', 6);

-- [4] Phân quyền
INSERT INTO quyen_han_nguoi_dung (maQuyenHan, taiKhoanId) VALUES
('QTH', 1), ('LD_ATVSTP', 2), ('CB_THANH_TRA', 3),
('CB_KIEM_DINH', 4), ('NTD', 5), ('CSKD', 6);

-- [5] Phường xã
INSERT INTO phuong_xa (maPX, TenPhuongXa) VALUES
('PX001', 'Hải Châu 1'),
('PX002', 'Hải Châu 2'),
('PX003', 'Thanh Khê'),
('PX004', 'Sơn Trà'),
('PX005', 'Ngũ Hành Sơn');

-- [6] Cơ sở kinh doanh
-- trangThai: legacy chuỗi tự do
-- trangThaiKinhDoanh: enum (DANG_HOAT_DONG | DANG_DOI_PHE_DUYET | THIEU_HO_SO | CANH_CAO_VI_PHAM | BI_CAM)
INSERT INTO co_so_kinh_doanh (maCoSo, tenCoSo, soGiayPhep, maCoSoTrue, ngayHetHanGiayPhep, trangThai, trangThaiKinhDoanh, maChuSoHuu, anhBia, maPX) VALUES
('CS001', 'Nhà hàng Sông Hàn',            'GP-2022-001', 'CS001', '2025-12-31', 'Hoat dong', 'DANG_HOAT_DONG',     'ND006',
 'https://res.cloudinary.com/dt7ekojue/image/upload/v1778601100/bien-quang-cao-quan-an-sang-1_qnxymu.jpg', 'PX001'),
('CS002', 'Quán Cơm Miền Trung',          'GP-2022-002', 'CS002', '2025-06-30', 'Hoat dong', 'CANH_CAO_VI_PHAM',   'ND006',
 'https://res.cloudinary.com/dt7ekojue/image/upload/v1778601101/2-bien-quang-cao-quan-an-sang-co-day-du-thong-tin-ve-mon-an-va-ten-quan_lldjkh.jpg', 'PX002'),
('CS003', 'Cơ sở chế biến Thủy Sản ABC',  'GP-2023-003', 'CS003', '2026-03-15', 'Hoat dong', 'DANG_DOI_PHE_DUYET', 'ND006',
 'https://res.cloudinary.com/dt7ekojue/image/upload/v1778601108/truong-cd-sp-kt-da-nang_difjjv.png', 'PX003');

-- [7] Loại hình kinh doanh
INSERT INTO loai_hinh_kinh_doanh (maLoaiHinhKinhDoanh, tenLoaiHinhKinhDoanh, moTa) VALUES
('LH001', 'Nhà hàng ăn uống',              'Cơ sở kinh doanh dịch vụ ăn uống tại chỗ'),
('LH002', 'Quán ăn bình dân',              'Cơ sở bán thức ăn đường phố, giá bình dân'),
('LH003', 'Cơ sở chế biến thực phẩm',     'Sản xuất và chế biến thực phẩm đóng gói'),
('LH004', 'Siêu thị – cửa hàng',           'Bán lẻ thực phẩm có hạn sử dụng'),
('LH005', 'Bếp ăn tập thể',                'Phục vụ bữa ăn cho tập thể');

INSERT INTO co_so_loai_hinh (maCoSo, maLoaiHinhKinhDoanh) VALUES
('CS001', 'LH001'),
('CS002', 'LH002'),
('CS003', 'LH003');

-- [11] LichThanhTra
INSERT INTO lich_thanh_tra (maThanhTra, maCoSo, maNguoiThanhTra, trangThai, noiDung) VALUES
('LTT001', 'CS001', 'ND002', 'Đã hoàn thành',   'Thanh tra định kỳ quý II/2025 tại nhà hàng Sông Hàn'),
('LTT002', 'CS002', 'ND002', 'Đang thực hiện',  'Thanh tra đột xuất theo phản ánh người dân'),
('LTT003', 'CS003', 'ND003', 'Đã hoàn thành',   'Thanh tra định kỳ cơ sở chế biến thủy sản');

INSERT INTO lich_thanh_tra_nguoi_dung (maThanhTra, maNguoiThanhTra, thoiGianTT) VALUES
('LTT001', 'ND002', '2025-04-15 08:00:00'),
('LTT001', 'ND003', '2025-04-15 08:00:00'),
('LTT002', 'ND002', '2025-05-20 09:00:00'),
('LTT003', 'ND003', '2025-05-10 08:30:00');

INSERT INTO chi_nhanh (maChiNhanh, diaChi, soDienThoai, trangThai, maCoSo, lianThanhTraGanNhat) VALUES
('CN001', '123 Bạch Đằng, Hải Châu, Đà Nẵng', '02363456789', 'Đang hoạt động', 'CS001', 'LTT001'),
('CN002', '45 Nguyễn Văn Linh, Thanh Khê',     '02363456790', 'Đang hoạt động', 'CS002', 'LTT002'),
('CN003', '78 Trần Phú, Sơn Trà, Đà Nẵng',     '02363456791', 'Tạm dừng',       'CS003', 'LTT003');

-- [14] Loại giấy tờ (bảng danh mục — 4 loại cố định)
INSERT INTO loai_giay_to (maLoaiGiayTo, tenLoaiGiayTo, moTa) VALUES
('HOP_DONG_THUE_MAT_BANG', 'Hợp đồng thuê mặt bằng', 'Hợp đồng thuê/mượn mặt bằng kinh doanh'),
('GIAY_PHEP_ATTP',         'Giấy phép ATTP',          'Giấy chứng nhận đủ điều kiện an toàn thực phẩm'),
('GIAY_TO_PCCC',           'Giấy tờ PCCC',            'Giấy xác nhận đủ điều kiện phòng cháy chữa cháy'),
('GIAY_PHEP_KINH_DOANH',  'Giấy phép kinh doanh',    'Giấy chứng nhận đăng ký kinh doanh');

-- [15] HoSoDangKiKinhDoanh (giấy tờ thực tế của CSKD, mỗi cái thuộc 1 loại + 1 cơ sở)
-- CS001 (Nhà hàng Sông Hàn) — đủ 4 loại → DANG_HOAT_DONG
-- CS002 (Quán Cơm Miền Trung) — đủ 4 loại nhưng có giấy hết hạn → CANH_CAO_VI_PHAM
-- CS003 (Thủy Sản ABC) — chỉ có 2 loại → THIEU_HO_SO / DANG_DOI_PHE_DUYET
INSERT INTO ho_so_dang_ki_kinh_doanh (maHoSo, ngayNop, ngayCap, ngayHetHan, trangThai, maCoSo, maLoaiGiayTo) VALUES
-- CS001 đủ 4 loại
('HSD001', '2022-01-10', '2022-01-15', '2027-01-15', 'Đã duyệt', 'CS001', 'HOP_DONG_THUE_MAT_BANG'),
('HSD002', '2022-01-10', '2023-01-05', '2026-01-05', 'Đã duyệt', 'CS001', 'GIAY_PHEP_ATTP'),
('HSD003', '2022-01-10', '2022-02-01', '2027-02-01', 'Đã duyệt', 'CS001', 'GIAY_TO_PCCC'),
('HSD004', '2022-01-10', '2022-01-15', '2025-12-31', 'Đã duyệt', 'CS001', 'GIAY_PHEP_KINH_DOANH'),

-- CS002 đủ 4 loại nhưng 2 cái hết hạn
('HSD005', '2022-03-15', '2022-03-15', '2027-03-15', 'Đã duyệt', 'CS002', 'HOP_DONG_THUE_MAT_BANG'),
('HSD006', '2022-03-15', '2022-06-01', '2025-06-01', 'Hết hạn',  'CS002', 'GIAY_PHEP_ATTP'),
('HSD007', '2022-03-15', '2022-04-01', '2027-04-01', 'Đã duyệt', 'CS002', 'GIAY_TO_PCCC'),
('HSD008', '2022-03-15', '2022-03-20', '2025-03-20', 'Hết hạn',  'CS002', 'GIAY_PHEP_KINH_DOANH'),

-- CS003 chỉ có 2 loại → thiếu hồ sơ
('HSD009', '2023-02-20', '2023-02-20', '2028-02-20', 'Đã duyệt', 'CS003', 'HOP_DONG_THUE_MAT_BANG'),
('HSD010', '2023-02-20', '2023-02-25', '2026-02-25', 'Đã duyệt', 'CS003', 'GIAY_PHEP_KINH_DOANH');

-- [15] ChungNhanATVSTP
INSERT INTO chung_nhan_atvstp (maCN, tenChungNhan, ngayBanHanh, ngayHetHan, maCoSoKinhDoanh, trangThai) VALUES
('CN001', 'Chứng nhận ATVS – Nhà hàng Sông Hàn',         '2023-01-05', '2026-01-05', 'CS001', 'Còn hiệu lực'),
('CN002', 'Chứng nhận ATVS – Quán Cơm Miền Trung',       '2022-06-01', '2025-06-01', 'CS002', 'Hết hạn'),
('CN003', 'Chứng nhận ATVS – Cơ sở Thủy Sản ABC',        '2023-03-20', '2026-03-20', 'CS003', 'Còn hiệu lực');

-- [16] LoaiPhanAnh
INSERT INTO loai_phan_anh (maLoaiPhanAnh, tenLoaiPhanAnh) VALUES
('LPA001', 'Vệ sinh an toàn thực phẩm'),
('LPA002', 'Chất lượng thực phẩm'),
('LPA003', 'Thái độ phục vụ'),
('LPA004', 'Giấy phép kinh doanh'),
('LPA005', 'Khác');

-- [17] PhanAnh
INSERT INTO phan_anh (maPhanAnh, maNguoiPhanAnh, trangThaiPhanAnh, maCoSo, lyDo, ngayGui, maLoaiPhanAnh) VALUES
('PA001', 'ND004', 'Đang xử lý', 'CS002', 'Quán ăn không đảm bảo vệ sinh, bàn ghế bẩn',  '2025-05-25 10:00:00', 'LPA001'),
('PA002', 'ND005', 'Đã xử lý',   'CS001', 'Thực phẩm có mùi lạ, nghi ngờ không tươi',     '2025-05-20 14:30:00', 'LPA002'),
('PA003', 'ND004', 'Chưa xử lý', 'CS003', 'Xưởng chế biến không có lưới chắn côn trùng', '2025-06-01 09:00:00', 'LPA001'),
('PA004', 'ND005', 'Đang xử lý', 'CS001', 'Khiếu nại về chất lượng thực phẩm phục vụ',    '2025-05-28 11:00:00', 'LPA002'),
('PA005', 'ND006', 'Chưa xử lý', 'CS002', 'Phản ánh nhân viên không đội nón, khẩu trang', '2025-06-05 15:30:00', 'LPA003');

-- [19] HoSoThanhTra
INSERT INTO ho_so_thanh_tra (maHoSo, maThanhTra, diem, tinhTrangViPham, KetLuan, NhanXetChung, BienPhapXuLy, KienNghi) VALUES
('HSTT001', 'LTT001', 85.0, 'Có vi phạm nhỏ',       'Cơ sở đạt tiêu chuẩn nhưng cần khắc phục một số điểm nhỏ', 'Nhìn chung vệ sinh tốt',         'Yêu cầu bổ sung biển cảnh báo', 'Tăng cường kiểm tra định kỳ'),
('HSTT002', 'LTT002', 60.0, 'Vi phạm nghiêm trọng', 'Cơ sở vi phạm nhiều điều khoản về vệ sinh',                'Nhiều hạng mục không đạt chuẩn', 'Đình chỉ hoạt động tạm thời',   'Kiểm tra lại sau 30 ngày'),
('HSTT003', 'LTT003', 92.0, 'Không vi phạm',        'Cơ sở đạt xuất sắc các tiêu chí',                          'Hệ thống VSATTP được duy trì tốt','Không cần biện pháp xử lý',     'Tiếp tục duy trì');

-- [20] LoaiViPham
INSERT INTO loai_vi_pham (maLoaiViPham, tenLoaiViPham, moTaThem) VALUES
('LVP001', 'Vi phạm vệ sinh cơ sở',        'Không đảm bảo điều kiện vệ sinh nhà xưởng, khu chế biến'),
('LVP002', 'Vi phạm về nguồn gốc thực phẩm','Sử dụng nguyên liệu không rõ nguồn gốc, không có hóa đơn'),
('LVP003', 'Vi phạm bảo quản thực phẩm',   'Nhiệt độ bảo quản không đúng quy định'),
('LVP004', 'Vi phạm về nhân sự',           'Người lao động không có chứng chỉ tập huấn ATVS'),
('LVP005', 'Vi phạm về giấy tờ pháp lý',   'Kinh doanh khi giấy phép đã hết hạn'),
('LVP006', 'Vi phạm hành chính',           'Vi phạm hành chính');

-- [21] ViPham
INSERT INTO vi_pham (maViPham, maHoSo, maLoaiViPham, maCoSo, moTaThem, khacPhuc, trangThaiPheDuyet, mucDo) VALUES
('VP001', 'HSTT001', 'LVP001', 'CS001', 'Sàn nhà khu chế biến còn ướt và trơn',          'Lau khô sàn, lắp thêm tấm chống trơn',           'Đã Duyệt',  'Trung binh'),
('VP002', 'HSTT002', 'LVP002', 'CS002', 'Phát hiện 5kg thịt heo không có giấy kiểm dịch','Tiêu hủy lô hàng, cam kết nhập từ nguồn hợp lệ', 'Đã Duyệt',  'Trung binh'),
('VP003', 'HSTT002', 'LVP004', 'CS002', 'Hai nhân viên bếp không có chứng chỉ ATVS',     'Đăng ký tập huấn trong vòng 30 ngày',            'Chờ Duyệt', 'Trung binh');

-- [22] HinhThucKhacPhuc — dùng enum: CHUA_KHAC_PHUC | DANG_KHAC_PHUC | DA_KHAC_PHUC
INSERT INTO hinh_thuc_khac_phuc (maHinhThucKhacPhuc, soTienKhacPhuc, tinhTrangKhacPhuc, maViPham) VALUES
('HT001', 2000000.00,  'DA_KHAC_PHUC',   'VP001'),
('HT002', 5000000.00,  'DANG_KHAC_PHUC', 'VP002'),
('HT003', 0.00,        'CHUA_KHAC_PHUC', 'VP001'),
('HT004', 10000000.00, 'CHUA_KHAC_PHUC', 'VP003');

-- [23] MinhChungKhacPhuc
INSERT INTO minh_chung_khac_phuc (maMinhChung, maViPham, thoiGianGui) VALUES
('MC001', 'VP001', '2025-04-20 08:00:00'),
('MC002', 'VP002', '2025-05-25 10:30:00'),
('MC003', 'VP003', '2025-06-05 09:00:00'),
('MC004', 'VP002', '2025-06-08 11:00:00'),
('MC005', 'VP001', '2025-04-22 14:00:00');

-- [24] KhieuNai
INSERT INTO khieu_nai (maKhieuNai, trangThai, maCoSo, thoiGianKhieuNai, moTaChiTiet) VALUES
('KN001', 'Đang xử lý',   'CS002', '2025-05-28 09:00:00', 'Khiếu nại kết quả thanh tra, cho rằng đoàn thanh tra đánh giá không công bằng'),
('KN002', 'Đã giải quyết','CS001', '2025-04-20 14:00:00', 'Khiếu nại về mức phạt tiền quá cao so với tính chất vi phạm'),
('KN003', 'Chưa xử lý',   'CS003', '2025-06-02 10:00:00', 'Yêu cầu xem xét lại biên bản vi phạm ngày 10/05/2025'),
('KN004', 'Đang xử lý',   'CS003', '2025-06-04 08:30:00', 'Khiếu nại quyết định đình chỉ tạm thời hoạt động chi nhánh'),
('KN005', 'Đã giải quyết','CS001', '2025-05-15 11:00:00', 'Khiếu nại về việc cán bộ thanh tra không thông báo trước 48 giờ');

-- [25] ChiTieuKiemNghiem
INSERT INTO chi_tieu_kiem_nghiem (maChiTieu, tenChiTieu) VALUES
('CT001', 'Chỉ tiêu vi sinh vật tổng số'),
('CT002', 'Coliform tổng số'),
('CT003', 'E.coli'),
('CT004', 'Salmonella'),
('CT005', 'Kim loại nặng (Pb, Hg, Cd)');

-- [26] MauKiemNghiem
INSERT INTO mau_kiem_nghiem (maMau, tenMau, ngayThu, ngayKiemNghiem, trangThai, loaiMau, noiDung, ngayYeuCau, hanHoanThanh) VALUES
('MK001', 'Mẫu thịt heo cơ sở CS001',    '2025-04-15', '2025-04-17', 'Có kết quả',     'Thực phẩm', 'Lấy mẫu ngẫu nhiên tại kho lạnh', '2025-04-15', '2025-04-20'),
('MK002', 'Mẫu rau sống cơ sở CS002',    '2025-05-20', '2025-05-22', 'Có kết quả',     'Thực phẩm', 'Lấy mẫu rau ăn sống',             '2025-05-20', '2025-05-25'),
('MK003', 'Mẫu chả cá cơ sở CS003',      '2025-05-10', '2025-05-12', 'Có kết quả',     'Thực phẩm', 'Lấy mẫu sản phẩm đóng gói',       '2025-05-10', '2025-05-15'),
('MK004', 'Mẫu nước uống cơ sở CS004',   '2025-06-01', '2025-06-03', 'Đang xét nghiệm','Nước',      'Kiểm tra chất lượng nước uống',   '2025-06-01', '2025-06-07'),
('MK005', 'Mẫu bánh mỳ cơ sở CS005',     '2025-06-03', '2025-06-08', 'Chờ xét nghiệm', 'Thực phẩm', 'Kiểm tra vi sinh và phụ gia',     '2025-06-03', '2025-06-10');

INSERT INTO mau_chi_tieu (maMau, maChiTieu, ketQua) VALUES
('MK001', 'CT001', '10^3 CFU/g – Đạt'),
('MK001', 'CT003', 'Âm tính – Đạt'),
('MK002', 'CT001', '10^5 CFU/g – Không đạt'),
('MK002', 'CT002', '150 MPN/100g – Không đạt'),
('MK003', 'CT004', 'Âm tính – Đạt');

INSERT INTO dam_nhan_kiem_nghiem (maNguoiKiemNghiem, maMau) VALUES
('ND003', 'MK001'),
('ND003', 'MK002'),
('ND002', 'MK003'),
('ND003', 'MK003'),
('ND002', 'MK004');

INSERT INTO tieu_chi_danh_gia (MaTieuChi, TenTieuChi, Nhom, ThuTu) VALUES
('TC001', 'Điều kiện vệ sinh cơ sở vật chất',   'Cơ sở',    1),
('TC002', 'Điều kiện trang thiết bị, dụng cụ',  'Cơ sở',    2),
('TC003', 'Điều kiện về con người',             'Nhân sự',  3),
('TC004', 'Nguồn gốc và chất lượng nguyên liệu','Nguyên liệu', 4),
('TC005', 'Hồ sơ pháp lý, giấy tờ liên quan',   'Pháp lý',  5);

INSERT INTO kq_danh_gia (maHoSo, MaTieuChi, KetQuaDanhGia) VALUES
('HSTT001', 'TC001', 'Đạt – 20/20 điểm'),
('HSTT001', 'TC003', 'Đạt – 18/20 điểm'),
('HSTT002', 'TC001', 'Không đạt – 10/20 điểm'),
('HSTT002', 'TC004', 'Không đạt – 8/20 điểm'),
('HSTT003', 'TC005', 'Đạt – 20/20 điểm');

INSERT INTO bao_cao (maBaoCao, maHoSo, NoiDung, nhanXet) VALUES
('BC001', 'HSTT001', 'Báo cáo đợt thanh tra tháng 4 năm 2025 tại Nhà hàng Sông Hàn. Kết quả đạt 85/100 điểm.',         'Cơ sở hoạt động tốt, cần cải thiện khu vực sàn'),
('BC002', 'HSTT002', 'Báo cáo đợt thanh tra đột xuất tháng 5 năm 2025 tại Quán Cơm Miền Trung. Nhiều vi phạm.',       'Kiến nghị đình chỉ tạm thời để khắc phục'),
('BC003', 'HSTT003', 'Báo cáo đợt thanh tra định kỳ tháng 5 năm 2025 tại Cơ sở Thủy Sản ABC. Đạt xuất sắc.',         'Đây là mô hình điển hình về VSATTP');

INSERT INTO thong_bao (maThongBao, tieuDe, noiDung, ngayGui, loaiThongBao, isCongDong) VALUES
('TB001', 'Thông báo kiểm tra định kỳ', 'Lịch kiểm tra định kỳ quý II/2025',    '2025-04-10 08:00:00', 'PHAP_QUY',  true),
('TB002', 'Thông báo nhắc nhở',         'Nhắc nhở bổ sung hồ sơ kinh doanh',    '2025-05-01 09:30:00', 'TIN_TUC',   false),
('TB003', 'Thông báo kết quả kiểm nghiệm','Kết quả kiểm nghiệm mẫu MK002',      '2025-05-23 14:00:00', 'KHAN_CAP',  false),
('TB004', 'Thông báo xử lý phản ánh',   'Phản ánh PA004 đang được xử lý',       '2025-06-04 10:15:00', 'KHAN_CAP',  false),
('TB005', 'Thông báo chung',            'Cập nhật quy định an toàn thực phẩm',  '2025-06-06 16:30:00', 'KHAN_CAP',  true);

INSERT INTO thong_bao_nguoi_dung (maNguoiDung, maThongBao, trangThai) VALUES
('ND005', 'TB002', 'Chưa đọc'),
('ND005', 'TB003', 'Chưa đọc'),
('ND006', 'TB002', 'Đã đọc'),
('ND006', 'TB003', 'Chưa đọc'),
('ND006', 'TB004', 'Chưa đọc');

-- [32] FileDinhKem
INSERT INTO file_dinh_kem (maFile, urlFile, loaiFile, thoiGianGui, maMinhChung, maPhanAnh, maKhieuNai, maThongBao, maHoSoDangKiKinhDoanh, maTinhTrangKhacPhuc) VALUES
('FD001', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'image/jpeg',     '2025-04-20 08:05:00', 'MC001', 'PA001', 'KN001', 'TB001', 'HSD001', 'HT001'),
('FD002', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'image/png',      '2025-05-25 10:35:00', 'MC002', 'PA002', 'KN002', 'TB002', 'HSD005', 'HT002'),
('FD003', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'application/pdf','2025-05-25 14:00:00', 'MC003', 'PA003', 'KN003', 'TB003', 'HSD009', 'HT003');
