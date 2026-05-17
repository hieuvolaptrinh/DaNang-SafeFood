
TRUNCATE TABLE file_dinh_kem, hinh_thuc_khac_phuc, minh_chung_khac_phuc, vi_pham, loai_vi_pham,
               bao_cao, kq_danh_gia, tieu_chi_danh_gia, dam_nhan_kiem_nghiem, mau_chi_tieu,
               mau_kiem_nghiem, chi_tieu_kiem_nghiem, khieu_nai, giay_phep, phan_anh,
               loai_phan_anh, chung_nhan_atvstp, ho_so_dang_ki_kinh_doanh, chi_nhanh,
               lich_thanh_tra_nguoi_dung, lich_thanh_tra, co_so_loai_hinh, co_so_kinh_doanh,
               loai_hinh_kinh_doanh, thong_bao_nguoi_dung, thong_bao, log,
               quyen_han_nguoi_dung, nguoi_dung, tai_khoan, phuong_xa, quyen_han CASCADE;

-- [1] Quyá»n háº¡n
INSERT INTO quyen_han (maQuyenHan, quyenHan) VALUES
('QTH', 'Quáº£n trá»‹ há»‡ thá»‘ng'),
('LD_ATVSTP', 'LÃ£nh Ä‘áº¡o ATVSTP'),
('CSKD', 'ChuyÃªn viÃªn Kinh doanh'),
('CB_THANH_TRA', 'CÃ¡n bá»™ Thanh tra'),
('CB_KIEM_DINH', 'CÃ¡n bá»™ Kiá»ƒm Ä‘á»‹nh'),
('NTD', 'NgÆ°á»i tiÃªu dÃ¹ng');

-- [2] TÃ i khoáº£n
INSERT INTO tai_khoan (id, username, password, fullName, email, phone, enabled, createdAt, updatedAt) VALUES
(1, 'admin', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Administrator', 'admin@safefood.vn', '0901234567', true, NOW(), NOW()),
(2, 'ld1', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'LÃ£nh Ä‘áº¡o ATVSTP', 'ld@safefood.vn', '0901234568', true, NOW(), NOW()),
(3, 'thanhtra', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'CÃ¡n bá»™ Thanh tra', 'thanhtra@safefood.vn', '0901234569', true, NOW(), NOW()),
(4, 'kiemdinh', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'CÃ¡n bá»™ Kiá»ƒm Ä‘á»‹nh', 'kiemdinh@safefood.vn', '0901234570', true, NOW(), NOW()),
(5, 'user1', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Nguyá»…n VÄƒn A', 'user1@gmail.com', '0987654321', true, NOW(), NOW()),
(6, 'kinhdoanh1', '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq', 'Nguyá»…n VÄƒn B', 'vndhieuak@gmail.com', '0987654322', true, NOW(), NOW());

-- Reset sequence cho ID tá»± tÄƒng cá»§a tÃ i khoáº£n
SELECT setval('tai_khoan_id_seq', (SELECT MAX(id) FROM tai_khoan));

-- [3] NgÆ°á»i dÃ¹ng (Tham chiáº¿u tai_khoan_id)
INSERT INTO nguoi_dung (maNguoiDung, hoTen,  gioiTinh, CCCD, taiKhoanId) VALUES
('ND001', 'Administrator',  'Nam', '012345678901', 1),
('ND002', 'LÃ£nh Ä‘áº¡o ATVSTP',  'Ná»¯', '012345678902', 2),
('ND003', 'CÃ¡n bá»™ Thanh tra',  'Nam', '012345678903', 3),
('ND004', 'CÃ¡n bá»™ Kiá»ƒm Ä‘á»‹nh', 'Nam', '012345678904', 4),
('ND005', 'Nguyá»…n VÄƒn A',  'Nam', '012345678905', 5),
('ND006', 'Nguyá»…n VÄƒn B',  'Nam', '012345678906', 6);

-- [4] PhÃ¢n quyá»n ngÆ°á»i dÃ¹ng (Pháº£i Ä‘á»§ dáº¥u pháº©y)
INSERT INTO quyen_han_nguoi_dung (maQuyenHan, taiKhoanId) VALUES
('QTH', 1),
('LD_ATVSTP', 2),
('CB_THANH_TRA', 3),
('CB_KIEM_DINH', 4),
('NTD', 5),
('CSKD', 6);

-- [5] PhÆ°á»ng xÃ£
INSERT INTO phuong_xa (maPX, TenPhuongXa) VALUES
('PX001', 'Háº£i ChÃ¢u 1'),
('PX002', 'Háº£i ChÃ¢u 2'),
('PX003', 'Thanh KhÃª'),
('PX004', 'SÆ¡n TrÃ '),
('PX005', 'NgÅ© HÃ nh SÆ¡n');

-- [6] CÆ¡ sá»Ÿ kinh doanh (Báº£ng Cha)
-- LÆ°u Ã½: ND004, ND005, ND006 vÃ  cÃ¡c PX00x Ä‘á»u Ä‘Ã£ tá»“n táº¡i á»Ÿ trÃªn
INSERT INTO co_so_kinh_doanh (maCoSo, tenCoSo, soGiayPhep, maCoSoTrue, ngayHetHanGiayPhep, trangThai, maChuSoHuu,anhBia, maPX) VALUES
('CS001', 'NhÃ  hÃ ng SÃ´ng HÃ n', 'GP-2022-001', 'CS001', '2025-12-31', 'Hoat dong', 'ND006', 'https://res.cloudinary.com/dt7ekojue/image/upload/v1778601100/bien-quang-cao-quan-an-sang-1_qnxymu.jpg', 'PX001'),
('CS002', 'QuÃ¡n CÆ¡m Miá»n Trung', 'GP-2022-002', 'CS002', '2025-06-30', 'Hoat dong', 'ND006', 'https://res.cloudinary.com/dt7ekojue/image/upload/v1778601101/2-bien-quang-cao-quan-an-sang-co-day-du-thong-tin-ve-mon-an-va-ten-quan_lldjkh.jpg', 'PX002'),
('CS003', 'CÆ¡ sá»Ÿ cháº¿ biáº¿n Thá»§y Sáº£n ABC', 'GP-2023-003', 'CS003', '2026-03-15', 'Hoat dong', 'ND006', 'https://res.cloudinary.com/dt7ekojue/image/upload/v1778601108/truong-cd-sp-kt-da-nang_difjjv.png', 'PX003'),
('CS004', 'Chi nhÃ¡nh NhÃ  hÃ ng SÃ´ng HÃ n', 'GP-2023-004', 'CS001', '2026-06-30', 'Hoat dong', 'ND006', 'https://res.cloudinary.com/dt7ekojue/image/upload/v1778601100/bien-quang-cao-quan-an-sang-1_qnxymu.jpg', 'PX001'),
('CS005', 'QuÃ¡n Äƒn bÃ¬nh dÃ¢n Tháº§n Tá»‘c', 'GP-2023-005', 'CS005', '2026-09-30', 'Hoat dong', 'ND006', 'https://res.cloudinary.com/dt7ekojue/image/upload/v1778601101/2-bien-quang-cao-quan-an-sang-co-day-du-thong-tin-ve-mon-an-va-ten-quan_lldjkh.jpg', 'PX002');

-- [7] Loáº¡i hÃ¬nh kinh doanh
INSERT INTO loai_hinh_kinh_doanh (maLoaiHinhKinhDoanh, tenLoaiHinhKinhDoanh, moTa) VALUES
('LH001', 'NhÃ  hÃ ng Äƒn uá»‘ng', 'CÆ¡ sá»Ÿ kinh doanh dá»‹ch vá»¥ Äƒn uá»‘ng táº¡i chá»—'),
('LH002', 'QuÃ¡n Äƒn bÃ¬nh dÃ¢n', 'CÆ¡ sá»Ÿ bÃ¡n thá»©c Äƒn Ä‘Æ°á»ng phá»‘, giÃ¡ bÃ¬nh dÃ¢n'),
('LH003', 'CÆ¡ sá»Ÿ cháº¿ biáº¿n thá»±c pháº©m', 'Sáº£n xuáº¥t vÃ  cháº¿ biáº¿n thá»±c pháº©m Ä‘Ã³ng gÃ³i'),
('LH004', 'SiÃªu thá»‹ â€“ cá»­a hÃ ng', 'BÃ¡n láº» thá»±c pháº©m cÃ³ háº¡n sá»­ dá»¥ng'),
('LH005', 'Báº¿p Äƒn táº­p thá»ƒ', 'Phá»¥c vá»¥ bá»¯a Äƒn cho táº­p thá»ƒ');

-- [8] Mapping (Báº£ng Con - Tham chiáº¿u tá»« CS001 Ä‘áº¿n CS005)
INSERT INTO co_so_loai_hinh (maCoSo, maLoaiHinhKinhDoanh) VALUES
('CS001', 'LH001'),
('CS002', 'LH002'),
('CS003', 'LH003'),
('CS004', 'LH001'),
('CS005', 'LH002');

-- [11] LichThanhTra
INSERT INTO lich_thanh_tra (maThanhTra, maCoSo, maNguoiThanhTra, trangThai, noiDung) VALUES
    ('LTT001', 'CS001', 'ND002', 'HoÃ n thÃ nh', 'Thanh tra Ä‘á»‹nh ká»³ quÃ½ II/2025 táº¡i nhÃ  hÃ ng SÃ´ng HÃ n'),
    ('LTT002', 'CS002', 'ND002', 'Äang thá»±c hiá»‡n', 'Thanh tra Ä‘á»™t xuáº¥t theo pháº£n Ã¡nh ngÆ°á»i dÃ¢n'),
    ('LTT003', 'CS003', 'ND003', 'HoÃ n thÃ nh', 'Thanh tra Ä‘á»‹nh ká»³ cÆ¡ sá»Ÿ cháº¿ biáº¿n thá»§y sáº£n'),
    ('LTT004', 'CS004', 'ND002', 'ChÆ°a nháº­n',  'Thanh tra chi nhÃ¡nh NhÃ  hÃ ng SÃ´ng HÃ n'),
    ('LTT005', 'CS005', 'ND003', 'ChÆ°a nháº­n',  'Thanh tra Ä‘á»‹nh ká»³ quÃ½ III/2025');

-- [12] LichThanhTra_NguoiDung
INSERT INTO lich_thanh_tra_nguoi_dung (maThanhTra, maNguoiThanhTra, thoiGianTT, trangThai, ghiChu) VALUES
    ('LTT001', 'ND002', '2025-04-15 08:00:00', 'ÄÃ£ nháº­n', NULL),
    ('LTT001', 'ND003', '2025-04-15 08:00:00', 'ChÆ°a nháº­n', NULL),
    ('LTT002', 'ND002', '2025-05-20 09:00:00', 'Äang thá»±c hiá»‡n', NULL),
    ('LTT003', 'ND003', '2025-05-10 08:30:00', 'HoÃ n thÃ nh', NULL);

-- [13] ChiNhanh
INSERT INTO chi_nhanh (maChiNhanh, diaChi, soDienThoai, trangThai, maCoSo, lianThanhTraGanNhat) VALUES
    ('CN001', '123 Báº¡ch Äáº±ng, Háº£i ChÃ¢u, ÄÃ  Náºµng',  '02363456789', 'Äang hoáº¡t Ä‘á»™ng', 'CS001', 'LTT001'),
    ('CN002', '45 Nguyá»…n VÄƒn Linh, Thanh KhÃª',      '02363456790', 'Äang hoáº¡t Ä‘á»™ng', 'CS002', 'LTT002'),
    ('CN003', '78 Tráº§n PhÃº, SÆ¡n TrÃ , ÄÃ  Náºµng',      '02363456791', 'Táº¡m dá»«ng',       'CS003', 'LTT003');

-- [14] HoSoDangKiKinhDoanh
INSERT INTO ho_so_dang_ki_kinh_doanh (maHoSo, ngayNop, trangThai, maCoSo) VALUES
    ('HSD001', '2022-01-10', 'ÄÃ£ duyá»‡t','CS001'),
    ('HSD002', '2022-03-15', 'ÄÃ£ duyá»‡t','CS002'),
    ('HSD003', '2023-02-20', 'ÄÃ£ duyá»‡t','CS003'),
    ('HSD004', '2023-05-18', 'ÄÃ£ duyá»‡t','CS001');

-- [15] ChungNhanATVSTP
INSERT INTO chung_nhan_atvstp (maCN, tenChungNhan, ngayBanHanh, ngayHetHan, maCoSoKinhDoanh, trangThai) VALUES
    ('CN001', 'Chá»©ng nháº­n ATVS â€“ NhÃ  hÃ ng SÃ´ng HÃ n','2023-01-05', '2026-01-05', 'CS001', 'CÃ²n hiá»‡u lá»±c'),
    ('CN002', 'Chá»©ng nháº­n ATVS â€“ QuÃ¡n CÆ¡m Miá»n Trung','2022-06-01', '2025-06-01', 'CS002', 'Háº¿t háº¡n'),
    ('CN003', 'Chá»©ng nháº­n ATVS â€“ CÆ¡ sá»Ÿ Thá»§y Sáº£n ABC', '2023-03-20', '2026-03-20', 'CS003', 'CÃ²n hiá»‡u lá»±c');

-- [16] LoaiPhanAnh
INSERT INTO loai_phan_anh (maLoaiPhanAnh, tenLoaiPhanAnh) VALUES
    ('LPA001', 'Vá»‡ sinh an toÃ n thá»±c pháº©m'),
    ('LPA002', 'Cháº¥t lÆ°á»£ng thá»±c pháº©m'),
    ('LPA003', 'ThÃ¡i Ä‘á»™ phá»¥c vá»¥'),
    ('LPA004', 'Giáº¥y phÃ©p kinh doanh'),
    ('LPA005', 'KhÃ¡c');

-- [17] PhanAnh
INSERT INTO phan_anh (maPhanAnh, maNguoiPhanAnh, trangThaiPhanAnh, maCoSo, lyDo, ngayGui, maLoaiPhanAnh) VALUES
    ('PA001', 'ND004', 'Äang xá»­ lÃ½',   'CS002', 'QuÃ¡n Äƒn khÃ´ng Ä‘áº£m báº£o vá»‡ sinh, bÃ n gháº¿ báº©n',  '2025-05-25 10:00:00', 'LPA001'),
    ('PA002', 'ND005', 'ÄÃ£ xá»­ lÃ½',     'CS001', 'Thá»±c pháº©m cÃ³ mÃ¹i láº¡, nghi ngá» khÃ´ng tÆ°Æ¡i',      '2025-05-20 14:30:00', 'LPA002'),
    ('PA003', 'ND004', 'ChÆ°a xá»­ lÃ½',   'CS003', 'XÆ°á»Ÿng cháº¿ biáº¿n khÃ´ng cÃ³ lÆ°á»›i cháº¯n cÃ´n trÃ¹ng',  '2025-06-01 09:00:00', 'LPA001'),
    ('PA004', 'ND005', 'Äang xá»­ lÃ½',   'CS001', 'Khiáº¿u náº¡i vá» cháº¥t lÆ°á»£ng thá»±c pháº©m phá»¥c vá»¥',       '2025-05-28 11:00:00', 'LPA002'),
    ('PA005', 'ND006', 'ChÆ°a xá»­ lÃ½',   'CS002', 'Pháº£n Ã¡nh nhÃ¢n viÃªn khÃ´ng Ä‘á»™i nÃ³n, kháº©u trang',    '2025-06-05 15:30:00', 'LPA003') ;

-- [18] GiayPhep
INSERT INTO giay_phep (maGiayPhep, loaiGiayPhep, trangThai, ngayCap, ngayHetHan, maCoSo) VALUES
    ('GP001', 'Giáº¥y phÃ©p kinh doanh',            'CÃ²n hiá»‡u lá»±c', '2022-01-15', '2025-12-31', 'CS001'),
    ('GP002', 'Giáº¥y phÃ©p vá»‡ sinh an toÃ n thá»±c pháº©m', 'Háº¿t háº¡n', '2022-03-20', '2025-03-20', 'CS002'),
    ('GP003', 'Giáº¥y phÃ©p sáº£n xuáº¥t thá»±c pháº©m',    'CÃ²n hiá»‡u lá»±c', '2023-02-25', '2026-02-25', 'CS003');

-- [19] HoSoThanhTra
INSERT INTO ho_so_thanh_tra (maHoSo, maThanhTra, diem, tinhTrangViPham, KetLuan, NhanXetChung, BienPhapXuLy, KienNghi, thoiGianKiemTra) VALUES
    ('HSTT001', 'LTT001', 85.0, 'CÃ³ vi pháº¡m nhá»',   'CÆ¡ sá»Ÿ Ä‘áº¡t tiÃªu chuáº©n nhÆ°ng cáº§n kháº¯c phá»¥c má»™t sá»‘ Ä‘iá»ƒm nhá»', 'NhÃ¬n chung vá»‡ sinh tá»‘t',         'YÃªu cáº§u bá»• sung biá»ƒn cáº£nh bÃ¡o',     'TÄƒng cÆ°á»ng kiá»ƒm tra Ä‘á»‹nh ká»³', '2025-04-15 08:30:00'),
    ('HSTT002', 'LTT002', 60.0, 'Vi pháº¡m nghiÃªm trá»ng', 'CÆ¡ sá»Ÿ vi pháº¡m nhiá»u Ä‘iá»u khoáº£n vá» vá»‡ sinh',             'Nhiá»u háº¡ng má»¥c khÃ´ng Ä‘áº¡t chuáº©n',  'ÄÃ¬nh chá»‰ hoáº¡t Ä‘á»™ng táº¡m thá»i',       'Kiá»ƒm tra láº¡i sau 30 ngÃ y', '2025-05-20 09:15:00'),
    ('HSTT003', 'LTT003', 92.0, 'KhÃ´ng vi pháº¡m',    'CÆ¡ sá»Ÿ Ä‘áº¡t xuáº¥t sáº¯c cÃ¡c tiÃªu chÃ­',                          'Há»‡ thá»‘ng VSATTP Ä‘Æ°á»£c duy trÃ¬ tá»‘t', 'KhÃ´ng cáº§n biá»‡n phÃ¡p xá»­ lÃ½',        'Tiáº¿p tá»¥c duy trÃ¬', '2025-05-10 09:00:00'),
    ('HSTT004', 'LTT004', 78.0, 'CÃ³ vi pháº¡m nhá»',   'Chi nhÃ¡nh Ä‘áº¡t tiÃªu chuáº©n nhÆ°ng cáº§n kháº¯c phá»¥c báº£o quáº£n láº¡nh', 'Thiáº¿t bá»‹ báº£o quáº£n cáº§n báº£o trÃ¬',  'YÃªu cáº§u kiá»ƒm tra thiáº¿t bá»‹ trong 14 ngÃ y', 'Kiá»ƒm tra láº¡i sau 14 ngÃ y', '2025-06-01 08:45:00'),
    ('HSTT005', 'LTT005', 88.0, 'CÃ³ vi pháº¡m nhá»',   'CÆ¡ sá»Ÿ Ä‘áº¡t tiÃªu chuáº©n tá»‘t, chá»‰ cÃ³ vi pháº¡m nhá» láº»',          'Vi pháº¡m nhá» Ä‘Ã£ Ä‘Æ°á»£c nháº¯c nhá»Ÿ',   'KhÃ´ng cáº§n biá»‡n phÃ¡p xá»­ lÃ½',         'Tiáº¿p tá»¥c duy trÃ¬ cháº¥t lÆ°á»£ng', '2025-06-03 08:00:00');
-- [20] LoaiViPham
INSERT INTO loai_vi_pham (maLoaiViPham, tenLoaiViPham, moTaThem) VALUES
    ('LVP001', 'Vi pháº¡m vá»‡ sinh cÆ¡ sá»Ÿ',        'KhÃ´ng Ä‘áº£m báº£o Ä‘iá»u kiá»‡n vá»‡ sinh nhÃ  xÆ°á»Ÿng, khu cháº¿ biáº¿n'),
    ('LVP002', 'Vi pháº¡m vá» nguá»“n gá»‘c thá»±c pháº©m', 'Sá»­ dá»¥ng nguyÃªn liá»‡u khÃ´ng rÃµ nguá»“n gá»‘c, khÃ´ng cÃ³ hÃ³a Ä‘Æ¡n'),
    ('LVP003', 'Vi pháº¡m báº£o quáº£n thá»±c pháº©m',   'Nhiá»‡t Ä‘á»™ báº£o quáº£n khÃ´ng Ä‘Ãºng quy Ä‘á»‹nh'),
    ('LVP004', 'Vi pháº¡m vá» nhÃ¢n sá»±',            'NgÆ°á»i lao Ä‘á»™ng khÃ´ng cÃ³ chá»©ng chá»‰ táº­p huáº¥n ATVS'),
    ('LVP005', 'Vi pháº¡m vá» giáº¥y tá» phÃ¡p lÃ½',   'Kinh doanh khi giáº¥y phÃ©p Ä‘Ã£ háº¿t háº¡n'),
    ('LVP006', 'Vi pháº¡m hÃ nh chÃ­nh',            'Vi pháº¡m hÃ nh chÃ­nh');

-- [21] ViPham
INSERT INTO vi_pham (maViPham, maHoSo, maLoaiViPham, maCoSo, moTaThem, khacPhuc, trangThaiPheDuyet, mucDo) VALUES
    ('VP001', 'HSTT001', 'LVP001', 'CS001', 'SÃ n nhÃ  khu cháº¿ biáº¿n cÃ²n Æ°á»›t vÃ  trÆ¡n',                'Lau khÃ´ sÃ n, láº¯p thÃªm táº¥m chá»‘ng trÆ¡n',          'ÄÃ£ Duyá»‡t', 'Trung binh'),
    ('VP002', 'HSTT002', 'LVP002', 'CS002', 'PhÃ¡t hiá»‡n 5kg thá»‹t heo khÃ´ng cÃ³ giáº¥y kiá»ƒm dá»‹ch',     'TiÃªu há»§y lÃ´ hÃ ng, cam káº¿t nháº­p tá»« nguá»“n há»£p lá»‡', 'ÄÃ£ Duyá»‡t', 'Trung binh'),
    ('VP003', 'HSTT002', 'LVP004', 'CS002', 'Hai nhÃ¢n viÃªn báº¿p khÃ´ng cÃ³ chá»©ng chá»‰ ATVS',          'ÄÄƒng kÃ½ táº­p huáº¥n trong vÃ²ng 30 ngÃ y',            'Chá» Duyá»‡t', 'Trung binh');

-- [22] HinhThucKhacPhuc
INSERT INTO hinh_thuc_khac_phuc (maHinhThucKhacPhuc, soTienKhacPhuc, tinhTrangKhacPhuc, maViPham) VALUES
    ('HT001', 2000000.00,  'ÄÃ£ kháº¯c phá»¥c', 'VP001'),
    ('HT002', 5000000.00,  'Äang kháº¯c phá»¥c', 'VP002'),
    ('HT003', 0.00,        'ÄÃ£ kháº¯c phá»¥c', 'VP001'),
    ('HT004', 10000000.00, 'ChÆ°a kháº¯c phá»¥c', 'VP003');

-- [23] MinhChungKhacPhuc
INSERT INTO minh_chung_khac_phuc (maMinhChung, maViPham, thoiGianGui) VALUES
    ('MC001', 'VP001', '2025-04-20 08:00:00'),
    ('MC002', 'VP002', '2025-05-25 10:30:00'),
    ('MC003', 'VP003', '2025-06-05 09:00:00'),
    ('MC004', 'VP002', '2025-06-08 11:00:00'),
    ('MC005', 'VP001', '2025-04-22 14:00:00');

-- [24] KhieuNai
INSERT INTO khieu_nai (maKhieuNai, trangThai, maCoSo, thoiGianKhieuNai, moTaChiTiet) VALUES
    ('KN001', 'Äang xá»­ lÃ½',  'CS002', '2025-05-28 09:00:00', 'Khiáº¿u náº¡i káº¿t quáº£ thanh tra, cho ráº±ng Ä‘oÃ n thanh tra Ä‘Ã¡nh giÃ¡ khÃ´ng cÃ´ng báº±ng'),
    ('KN002', 'ÄÃ£ giáº£i quyáº¿t','CS001', '2025-04-20 14:00:00', 'Khiáº¿u náº¡i vá» má»©c pháº¡t tiá»n quÃ¡ cao so vá»›i tÃ­nh cháº¥t vi pháº¡m'),
    ('KN003', 'ChÆ°a xá»­ lÃ½',  'CS003', '2025-06-02 10:00:00', 'YÃªu cáº§u xem xÃ©t láº¡i biÃªn báº£n vi pháº¡m ngÃ y 10/05/2025'),
    ('KN004', 'Äang xá»­ lÃ½',  'CS003', '2025-06-04 08:30:00', 'Khiáº¿u náº¡i quyáº¿t Ä‘á»‹nh Ä‘Ã¬nh chá»‰ táº¡m thá»i hoáº¡t Ä‘á»™ng chi nhÃ¡nh'),
    ('KN005', 'ÄÃ£ giáº£i quyáº¿t','CS001', '2025-05-15 11:00:00', 'Khiáº¿u náº¡i vá» viá»‡c cÃ¡n bá»™ thanh tra khÃ´ng thÃ´ng bÃ¡o trÆ°á»›c 48 giá»');

-- [25] ChiTieuKiemNghiem
INSERT INTO chi_tieu_kiem_nghiem (maChiTieu, tenChiTieu) VALUES
    ('CT001', 'Chá»‰ tiÃªu vi sinh váº­t tá»•ng sá»‘'),
    ('CT002', 'Coliform tá»•ng sá»‘'),
    ('CT003', 'E.coli'),
    ('CT004', 'Salmonella'),
    ('CT005', 'Kim loáº¡i náº·ng (Pb, Hg, Cd)');

-- [26] MauKiemNghiem
INSERT INTO mau_kiem_nghiem (
    maMau, tenMau, ngayThu, ngayKiemNghiem, trangThai, loaiMau, noiDung, ngayYeuCau, hanHoanThanh,
    maCoSo, phongLab, ketQuaKiemNghiem, lyDoKhongDat, chiTieuKiemDinh
) VALUES
    ('MK001', 'Mẫu thịt heo cơ sở CS001',    '2025-04-15', '2025-04-17', 'Có kết quả',    'Thực phẩm', 'Lấy mẫu ngẫu nhiên tại kho lạnh', '2025-04-15', '2025-04-20', 'CS001', 'Trung tâm Kiểm nghiệm Đà Nẵng',      'Đạt tiêu chuẩn',        NULL,                                 'Chỉ tiêu vi sinh vật tổng số, E.coli'),
    ('MK002', 'Mẫu rau sống cơ sở CS002',    '2025-05-20', '2025-05-22', 'Có kết quả',    'Thực phẩm', 'Lấy mẫu rau ăn sống',             '2025-05-20', '2025-05-25', 'CS002', 'Trung tâm Kiểm nghiệm Đà Nẵng',      'Không đạt tiêu chuẩn',  'Coliform vượt ngưỡng cho phép',      'Chỉ tiêu vi sinh vật tổng số, Coliform tổng số'),
    ('MK003', 'Mẫu chả cá cơ sở CS003',      '2025-05-10', '2025-05-12', 'Có kết quả',    'Thực phẩm', 'Lấy mẫu sản phẩm đóng gói',       '2025-05-10', '2025-05-15', 'CS003', 'Lab Việt Nam',                      'Đạt tiêu chuẩn',        NULL,                                 'Salmonella'),
    ('MK004', 'Mẫu nước uống cơ sở CS004',   '2025-06-01', '2025-06-03', 'Đang xét nghiệm', 'Nước',      'Kiểm tra chất lượng nước uống',   '2025-06-01', '2025-06-07', 'CS004', 'Trung tâm Kiểm nghiệm miền Trung',  NULL,                    NULL,                                 'Coliform tổng số, E.coli'),
    ('MK005', 'Mẫu bánh mỳ cơ sở CS005',     '2025-06-03', '2025-06-08', 'Chờ xét nghiệm',  'Thực phẩm', 'Kiểm tra vi sinh và phụ gia',      '2025-06-03', '2025-06-10', 'CS005', 'Trung tâm Kiểm nghiệm Đà Nẵng',      NULL,                    NULL,                                 'Chỉ tiêu vi sinh vật tổng số, Kim loại nặng (Pb, Hg, Cd)');
-- [27] Mau_ChiTieu
INSERT INTO mau_chi_tieu (maMau, maChiTieu, giaTriDo, gioiHanChoPhep, ketQua) VALUES
    ('MK001', 'CT001', '10^3 CFU/g',   '<= 10^4 CFU/g',   'Đạt'),
    ('MK001', 'CT003', 'Âm tính',     'Âm tính',        'Đạt'),
    ('MK002', 'CT001', '10^5 CFU/g',   '<= 10^4 CFU/g',   'Không đạt'),
    ('MK002', 'CT002', '150 MPN/100g', '<= 100 MPN/100g', 'Không đạt'),
    ('MK003', 'CT004', 'Âm tính',     'Âm tính',        'Đạt');


-- [28] DamNhanKiemNgiem
INSERT INTO dam_nhan_kiem_nghiem (maNguoiKiemNghiem, maMau) VALUES
    ('ND003', 'MK001'),
    ('ND003', 'MK002'),
    ('ND002', 'MK003'),
    ('ND003', 'MK003'),
    ('ND002', 'MK004');

-- [29] tieuChiDanhGia
INSERT INTO tieu_chi_danh_gia (MaTieuChi, TenTieuChi, Nhom, ThuTu) VALUES
    ('TC001', 'Äiá»u kiá»‡n vá»‡ sinh cÆ¡ sá»Ÿ váº­t cháº¥t',    'CÆ¡ sá»Ÿ', 1),
    ('TC002', 'Äiá»u kiá»‡n trang thiáº¿t bá»‹, dá»¥ng cá»¥',   'CÆ¡ sá»Ÿ', 2),
    ('TC003', 'Äiá»u kiá»‡n vá» con ngÆ°á»i',               'NhÃ¢n sá»±', 3),
    ('TC004', 'Nguá»“n gá»‘c vÃ  cháº¥t lÆ°á»£ng nguyÃªn liá»‡u',  'NguyÃªn liá»‡u', 4),
    ('TC005', 'Há»“ sÆ¡ phÃ¡p lÃ½, giáº¥y tá» liÃªn quan',    'PhÃ¡p lÃ½', 5);

-- [30] kqDanhGia
INSERT INTO kq_danh_gia (maHoSo, MaTieuChi, KetQuaDanhGia) VALUES
    ('HSTT001', 'TC001', 'Äáº¡t â€“ 20/20 Ä‘iá»ƒm'),
    ('HSTT001', 'TC003', 'Äáº¡t â€“ 18/20 Ä‘iá»ƒm'),
    ('HSTT002', 'TC001', 'KhÃ´ng Ä‘áº¡t â€“ 10/20 Ä‘iá»ƒm'),
    ('HSTT002', 'TC004', 'KhÃ´ng Ä‘áº¡t â€“ 8/20 Ä‘iá»ƒm'),
    ('HSTT003', 'TC005', 'Äáº¡t â€“ 20/20 Ä‘iá»ƒm');

-- [31] BaoCao
INSERT INTO bao_cao (maBaoCao, maHoSo, NoiDung, nhanXet, tepDinhKem) VALUES
    ('BC001', 'HSTT001', 'BÃ¡o cÃ¡o Ä‘á»£t thanh tra thÃ¡ng 4 nÄƒm 2025 táº¡i NhÃ  hÃ ng SÃ´ng HÃ n. Káº¿t quáº£ Ä‘áº¡t 85/100 Ä‘iá»ƒm.',         'CÆ¡ sá»Ÿ hoáº¡t Ä‘á»™ng tá»‘t, cáº§n cáº£i thiá»‡n khu vá»±c sÃ n', NULL),
    ('BC002', 'HSTT002', 'BÃ¡o cÃ¡o Ä‘á»£t thanh tra Ä‘á»™t xuáº¥t thÃ¡ng 5 nÄƒm 2025 táº¡i QuÃ¡n CÆ¡m Miá»n Trung. Nhiá»u vi pháº¡m.',       'Kiáº¿n nghá»‹ Ä‘Ã¬nh chá»‰ táº¡m thá»i Ä‘á»ƒ kháº¯c phá»¥c', NULL),
    ('BC003', 'HSTT003', 'BÃ¡o cÃ¡o Ä‘á»£t thanh tra Ä‘á»‹nh ká»³ thÃ¡ng 5 nÄƒm 2025 táº¡i CÆ¡ sá»Ÿ Thá»§y Sáº£n ABC. Äáº¡t xuáº¥t sáº¯c.',         'ÄÃ¢y lÃ  mÃ´ hÃ¬nh Ä‘iá»ƒn hÃ¬nh vá» VSATTP', NULL),
    ('BC004', 'HSTT004', 'BÃ¡o cÃ¡o Ä‘á»£t thanh tra chi nhÃ¡nh thÃ¡ng 6 nÄƒm 2025. PhÃ¡t hiá»‡n vi pháº¡m báº£o quáº£n láº¡nh.',            'YÃªu cáº§u kháº¯c phá»¥c thiáº¿t bá»‹ trong 14 ngÃ y', NULL),
    ('BC005', 'HSTT005', 'BÃ¡o cÃ¡o sÆ¡ bá»™ Ä‘á»£t thanh tra quÃ½ III/2025 táº¡i BÃ¡nh má»³ ÄÃ  Náºµng Express.',                         'NhÃ¬n chung tá»‘t, vi pháº¡m nhá» Ä‘Ã£ Ä‘Æ°á»£c nháº¯c nhá»Ÿ', NULL);

-- [31.5] ThongBao
INSERT INTO thong_bao (maThongBao, tieuDe, noiDung, ngayGui, loaiThongBao, isCongDong) VALUES
    ('TB001', 'ThÃ´ng bÃ¡o kiá»ƒm tra Ä‘á»‹nh ká»³', 'Lá»‹ch kiá»ƒm tra Ä‘á»‹nh ká»³ quÃ½ II/2025', '2025-04-10 08:00:00', 'PHAP_QUY', true),
    ('TB002', 'ThÃ´ng bÃ¡o nháº¯c nhá»Ÿ', 'Nháº¯c nhá»Ÿ bá»• sung há»“ sÆ¡ kinh doanh', '2025-05-01 09:30:00', 'TIN_TUC', false),
    ('TB003', 'ThÃ´ng bÃ¡o káº¿t quáº£ kiá»ƒm nghiá»‡m', 'Káº¿t quáº£ kiá»ƒm nghiá»‡m máº«u MK002', '2025-05-23 14:00:00', 'KHAN_CAP', false),
    ('TB004', 'ThÃ´ng bÃ¡o xá»­ lÃ½ pháº£n Ã¡nh', 'Pháº£n Ã¡nh PA004 Ä‘ang Ä‘Æ°á»£c xá»­ lÃ½', '2025-06-04 10:15:00', 'KHAN_CAP', false),
    ('TB005', 'ThÃ´ng bÃ¡o chung', 'Cáº­p nháº­t quy Ä‘á»‹nh an toÃ n thá»±c pháº©m', '2025-06-06 16:30:00', 'KHAN_CAP', true);

-- [31.6] ThongBaoNguoiDung (ThÃ´ng bÃ¡o cÃ¡ nhÃ¢n gá»­i Ä‘áº¿n ngÆ°á»i dÃ¹ng cá»¥ thá»ƒ)
INSERT INTO thong_bao_nguoi_dung (maNguoiDung, maThongBao, trangThai) VALUES
    ('ND005', 'TB002', 'ChÆ°a Ä‘á»c'),
    ('ND005', 'TB003', 'ChÆ°a Ä‘á»c'),
    ('ND006', 'TB002', 'ÄÃ£ Ä‘á»c'),
    ('ND006', 'TB003', 'ChÆ°a Ä‘á»c'),
    ('ND006', 'TB004', 'ChÆ°a Ä‘á»c');

-- [32] FileDinhKem
-- ÄÃƒ FIX: ThÃªm dáº¥u pháº©y bá»‹ thiáº¿u, gá»™p cÃ¡c chuá»—i URL láº¡i thÃ nh 1 chuá»—i há»£p lá»‡ (náº¿u cáº§n thiáº¿t, hoáº·c chá»‰ Ä‘á»ƒ 1 URL Ä‘áº¡i diá»‡n).
INSERT INTO file_dinh_kem (maFile, urlFile, loaiFile, thoiGianGui, maMinhChung, maPhanAnh, maKhieuNai, maThongBao, maHoSoDangKiKinhDoanh, maTinhTrangKhacPhuc) VALUES
    ('FD001', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'image/jpeg', '2025-04-20 08:05:00', 'MC001', 'PA001', 'KN001', 'TB001', 'HSD001', 'HT001'),
    ('FD002', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'image/png', '2025-05-25 10:35:00', 'MC002', 'PA002', 'KN002', 'TB002', 'HSD002', 'HT002'),
    ('FD003', 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSrUKPcm7to2GV5DVWnkHgfwiZQPT2A3f3xZw&s', 'application/pdf', '2025-05-25 14:00:00', 'MC003', 'PA003', 'KN003', 'TB003', 'HSD003', 'HT003');




