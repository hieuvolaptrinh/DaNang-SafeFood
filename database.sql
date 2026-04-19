USE master;
GO
 
IF EXISTS (SELECT name FROM sys.databases WHERE name = N'DaNangSafeFood')
BEGIN
    ALTER DATABASE DaNangSafeFood SET SINGLE_USER WITH ROLLBACK IMMEDIATE;
    DROP DATABASE DaNangSafeFood;
END
GO
 
CREATE DATABASE DaNangSafeFood
    COLLATE Vietnamese_CI_AS;
GO
 
USE DaNangSafeFood;
GO

-- [1] QuyenHan
CREATE TABLE QuyenHan (
    maQuyenHan  VARCHAR(10)   NOT NULL,
    quyenHan    NVARCHAR(100) NOT NULL,
    CONSTRAINT PK_QuyenHan PRIMARY KEY (maQuyenHan)
);
GO
 
-- [2] NguoiDung
CREATE TABLE NguoiDung (
    maNguoiDung  VARCHAR(10)   NOT NULL,
    hoTen        NVARCHAR(100),
    email        VARCHAR(150),
    soDienThoai  VARCHAR(20),
    gioiTinh     NVARCHAR(10),
    matKhau      VARCHAR(255),
    CCCD         VARCHAR(20),
    CONSTRAINT PK_NguoiDung PRIMARY KEY (maNguoiDung)
);
GO
 
-- [3] QuyenHan_NguoiDung
CREATE TABLE QuyenHan_NguoiDung (
    maQuyenHan   VARCHAR(10) NOT NULL,
    maNguoiDung  VARCHAR(10) NOT NULL,
    CONSTRAINT PK_QuyenHan_NguoiDung PRIMARY KEY (maQuyenHan, maNguoiDung)
);
GO
 
-- [4] ThongBao
CREATE TABLE ThongBao (
    maThongBao   VARCHAR(10)    NOT NULL,
    tieuDe       NVARCHAR(200),
    noiDung      NVARCHAR(MAX),
    ngayGui      DATETIME,
    loaiThongBao NVARCHAR(50),
    isCongDong   BIT, -- 1 nếu thông báo dành cho cộng đồng (tất cả người dùng), 0 nếu chỉ dành cho nhóm quyền/cá nhân cụ thể
    CONSTRAINT PK_ThongBao PRIMARY KEY (maThongBao)
);
GO
 
-- [5] ThongBao_NguoiDung
CREATE TABLE ThongBao_NguoiDung (
    maNguoiDung  VARCHAR(10) NOT NULL,
    maThongBao   VARCHAR(10) NOT NULL,
    trangThai    NVARCHAR(30),
    CONSTRAINT PK_ThongBao_NguoiDung PRIMARY KEY (maNguoiDung, maThongBao)
);
GO
 
-- [6] Log
CREATE TABLE [Log] (
    maLog       VARCHAR(10) NOT NULL,
    ip          VARCHAR(50),
    [time]      DATETIME,
    maNguoiDung VARCHAR(10),
    CONSTRAINT PK_Log PRIMARY KEY (maLog)
);
GO
 
-- [7] PhuongXa
CREATE TABLE PhuongXa (
    maPX        VARCHAR(10)   NOT NULL,
    TenPhuongXa NVARCHAR(100),
    CONSTRAINT PK_PhuongXa PRIMARY KEY (maPX)
);
GO
 
-- [8] CoSoKinhDoanh
CREATE TABLE CoSoKinhDoanh (
    maCoSo              VARCHAR(10)   NOT NULL,
    tenCoSo             NVARCHAR(200),
    soGiayPhep          VARCHAR(50),
    maCoSoTrue          VARCHAR(10),       -- tự tham chiếu (chi nhánh → trụ sở)
    ngayHetHanGiayPhep  DATE,
    maChuSoHuu          VARCHAR(10),       -- FK → NguoiDung
    maPX                VARCHAR(10),       -- FK → PhuongXa
    CONSTRAINT PK_CoSoKinhDoanh PRIMARY KEY (maCoSo)
);
GO
 
-- [9] ChiNhanh
CREATE TABLE ChiNhanh (
    maChiNhanh            VARCHAR(10)   NOT NULL,
    diaChi                NVARCHAR(200),
    soDienThoai           VARCHAR(20),
    trangThai             NVARCHAR(30),
    maCoSo                VARCHAR(10),       -- FK → CoSoKinhDoanh
    lianThanhTraGanNhat   VARCHAR(10),       -- FK → LichThanhTra
    CONSTRAINT PK_ChiNhanh PRIMARY KEY (maChiNhanh)
);
GO
 
-- [10] LoaiHinhKinhDoanh
CREATE TABLE LoaiHinhKinhDoanh (
    maLoaiHinhKinhDoanh  VARCHAR(10)   NOT NULL,
    tenLoaiHinhKinhDoanh NVARCHAR(100),
    moTa                 NVARCHAR(MAX),
    CONSTRAINT PK_LoaiHinhKinhDoanh PRIMARY KEY (maLoaiHinhKinhDoanh)
);
GO
 
-- [11] CoSo_LoaiHinh
CREATE TABLE CoSo_LoaiHinh (
    maCoSo               VARCHAR(10) NOT NULL,
    maLoaiHinhKinhDoanh  VARCHAR(10) NOT NULL,
    CONSTRAINT PK_CoSo_LoaiHinh PRIMARY KEY (maCoSo, maLoaiHinhKinhDoanh)
);
GO
 
-- [12] LichThanhTra
CREATE TABLE LichThanhTra (
    maThanhTra       VARCHAR(10) NOT NULL,
    maCoSo           VARCHAR(10),   -- FK → CoSoKinhDoanh
    maNguoiThanhTra  VARCHAR(10),   -- FK → NguoiDung (người phụ trách chính)
    trangThai        NVARCHAR(30),
    noiDung          NVARCHAR(MAX),
    CONSTRAINT PK_LichThanhTra PRIMARY KEY (maThanhTra)
);
GO
 
-- [13] LichThanhTra_NguoiDung
CREATE TABLE LichThanhTra_NguoiDung (
    maThanhTra       VARCHAR(10) NOT NULL,
    maNguoiThanhTra  VARCHAR(10) NOT NULL,
    thoiGianTT       DATETIME,
    CONSTRAINT PK_LichThanhTra_NguoiDung PRIMARY KEY (maThanhTra, maNguoiThanhTra)
);
GO
 
-- [14] HoSoDangKiKinhDoanh
CREATE TABLE HoSoDangKiKinhDoanh (
    maHoSo    VARCHAR(10) NOT NULL,
    ngayNop   DATE,
    trangThai NVARCHAR(30),
    maCoSo    VARCHAR(10),   -- FK → CoSoKinhDoanh
    CONSTRAINT PK_HoSoDangKiKinhDoanh PRIMARY KEY (maHoSo)
);
GO
 
-- [15] ChungNhanATVSTP
CREATE TABLE ChungNhanATVSTP (
    maCN              VARCHAR(10)   NOT NULL,
    tenChungNhan      NVARCHAR(200),
    ngayBanHanh       DATE,
    ngayHetHan        DATE,
    maCoSoKinhDoanh   VARCHAR(10),   -- FK → CoSoKinhDoanh
    trangThai         NVARCHAR(30),
    CONSTRAINT PK_ChungNhanATVSTP PRIMARY KEY (maCN)
);
GO
 
-- [16] LoaiPhanAnh
CREATE TABLE LoaiPhanAnh (
    maLoaiPhanAnh  VARCHAR(10)   NOT NULL,
    tenLoaiPhanAnh NVARCHAR(100),
    CONSTRAINT PK_LoaiPhanAnh PRIMARY KEY (maLoaiPhanAnh)
);
GO
 
-- [17] PhanAnh
CREATE TABLE PhanAnh (
    maPhanAnh        VARCHAR(10) NOT NULL,
    maNguoiPhanAnh   VARCHAR(10),   -- FK → NguoiDung
    trangThaiPhanAnh NVARCHAR(30),
    maCoSo           VARCHAR(10),   -- FK → CoSoKinhDoanh
    lyDo             NVARCHAR(MAX),
    ngayGui          DATETIME,
    maLoaiPhanAnh    VARCHAR(10),   -- FK → LoaiPhanAnh
    CONSTRAINT PK_PhanAnh PRIMARY KEY (maPhanAnh)
);
GO
 
-- [18] GiayPhep
CREATE TABLE GiayPhep (
    maGiayPhep   VARCHAR(10) NOT NULL,
    loaiGiayPhep NVARCHAR(100),
    trangThai    NVARCHAR(30),
    ngayCap      DATE,
    ngayHetHan   DATE,
    maCoSo       VARCHAR(10),   -- FK → CoSoKinhDoanh
    CONSTRAINT PK_GiayPhep PRIMARY KEY (maGiayPhep)
);
GO
 
-- [19] HoSoThanhTra
CREATE TABLE HoSoThanhTra (
    maHoSo          VARCHAR(10) NOT NULL,
    maThanhTra      VARCHAR(10),   -- FK → LichThanhTra
    diem            FLOAT,
    tinhTrangViPham NVARCHAR(50),
    KetLuan         NVARCHAR(MAX),
    NhanXetChung    NVARCHAR(MAX),
    BienPhapXuLy    NVARCHAR(MAX),
    KienNghi        NVARCHAR(MAX),
    CONSTRAINT PK_HoSoThanhTra PRIMARY KEY (maHoSo)
);
GO
 
-- [20] LoaiViPham
CREATE TABLE LoaiViPham (
    maLoaiViPham  VARCHAR(10)   NOT NULL,
    tenLoaiViPham NVARCHAR(100),
    moTaThem      NVARCHAR(MAX),
    CONSTRAINT PK_LoaiViPham PRIMARY KEY (maLoaiViPham)
);
GO
 
-- [21] ViPham
CREATE TABLE ViPham (
    maViPham          VARCHAR(10) NOT NULL,
    maHoSo            VARCHAR(10),   -- FK → HoSoThanhTra
    maLoaiViPham      VARCHAR(10),   -- FK → LoaiViPham
    moTaThem          NVARCHAR(MAX),
    khacPhuc          NVARCHAR(MAX),
    trangThaiPheDuyet NVARCHAR(30),
    CONSTRAINT PK_ViPham PRIMARY KEY (maViPham)
);
GO
 
-- [22] HinhThucKhacPhuc
CREATE TABLE HinhThucKhacPhuc (
    maHinhThucKhacPhuc  VARCHAR(10)    NOT NULL,
    soTienKhacPhuc      DECIMAL(18, 2),
    tinhTrangKhacPhuc   NVARCHAR(50),
    CONSTRAINT PK_HinhThucKhacPhuc PRIMARY KEY (maHinhThucKhacPhuc)
);
GO
 
-- [23] MinhChungKhacPhuc
CREATE TABLE MinhChungKhacPhuc (
    maMinhChung  VARCHAR(10) NOT NULL,
    maViPham     VARCHAR(10),   -- FK → ViPham
    thoiGianGui  DATETIME,
    CONSTRAINT PK_MinhChungKhacPhuc PRIMARY KEY (maMinhChung)
);
GO
 
-- [24] KhieuNai
CREATE TABLE KhieuNai (
    maKhieuNai       VARCHAR(10) NOT NULL,
    trangThai        NVARCHAR(30),
    maCoSo           VARCHAR(10),   -- FK → CoSoKinhDoanh
    thoiGianKhieuNai DATETIME,
    moTaChiTiet      NVARCHAR(MAX),
    CONSTRAINT PK_KhieuNai PRIMARY KEY (maKhieuNai)
);
GO
 
-- [25] ChiTieuKiemNghiem
CREATE TABLE ChiTieuKiemNghiem (
    maChiTieu  VARCHAR(10)   NOT NULL,
    tenChiTieu NVARCHAR(200),
    CONSTRAINT PK_ChiTieuKiemNghiem PRIMARY KEY (maChiTieu)
);
GO
 
-- [26] MauKiemNghiem
CREATE TABLE MauKiemNghiem (
    maMau            VARCHAR(10) NOT NULL,
    tenMau           NVARCHAR(200),
    ngayThu          DATE,
    ngayKiemNghiem   DATE,
    trangThai        NVARCHAR(30),
    loaiMau          NVARCHAR(50),
    noiDung          NVARCHAR(MAX),
    ngayYeuCau       DATE,
    hanHoanThanh     DATE,
    CONSTRAINT PK_MauKiemNghiem PRIMARY KEY (maMau)
);
GO
 
-- [27] Mau_ChiTieu
CREATE TABLE Mau_ChiTieu (
    maMau      VARCHAR(10) NOT NULL,
    maChiTieu  VARCHAR(10) NOT NULL,
    ketQua     NVARCHAR(MAX),
    CONSTRAINT PK_Mau_ChiTieu PRIMARY KEY (maMau, maChiTieu)
);
GO
 
-- [28] DamNhanKiemNgiem
CREATE TABLE DamNhanKiemNgiem (
    maNguoiKiemNghiem VARCHAR(10) NOT NULL,
    maMau             VARCHAR(10) NOT NULL,
    CONSTRAINT PK_DamNhanKiemNgiem PRIMARY KEY (maNguoiKiemNghiem, maMau)
);
GO
 
-- [29] tieuChiDanhGia
CREATE TABLE tieuChiDanhGia (
    MaTieuChi  VARCHAR(10)   NOT NULL,
    TenTieuChi NVARCHAR(200),
    Nhom       NVARCHAR(100),
    ThuTu      INT,
    CONSTRAINT PK_tieuChiDanhGia PRIMARY KEY (MaTieuChi)
);
GO
 
-- [30] kqDanhGia
CREATE TABLE kqDanhGia (
    maHoSo         VARCHAR(10) NOT NULL,
    MaTieuChi      VARCHAR(10) NOT NULL,
    KetQuaDanhGia  NVARCHAR(MAX),
    CONSTRAINT PK_kqDanhGia PRIMARY KEY (maHoSo, MaTieuChi)
);
GO
 
-- [31] BaoCao
CREATE TABLE BaoCao (
    maBaoCao  VARCHAR(10) NOT NULL,
    maHoSo    VARCHAR(10),   -- FK → HoSoThanhTra
    NoiDung   NVARCHAR(MAX),
    nhanXet   NVARCHAR(MAX),
    CONSTRAINT PK_BaoCao PRIMARY KEY (maBaoCao)
);
GO
 
-- [32] FileDinhKem
CREATE TABLE FileDinhKem (
    maFile                  VARCHAR(10) NOT NULL,
    loaiFile                NVARCHAR(50),
    thoiGianGui             DATETIME,
    maMinhChung             VARCHAR(10),   -- FK → MinhChungKhacPhuc
    maPhanAnh               VARCHAR(10),   -- FK → PhanAnh
    maKhieuNai              VARCHAR(10),   -- FK → KhieuNai
    maThongBao              VARCHAR(10),   -- FK → ThongBao
    maHoSoDangKiKinhDoanh   VARCHAR(10),   -- FK → HoSoDangKiKinhDoanh
    maTinhTrangKhacPhuc     VARCHAR(10),   -- FK → HinhThucKhacPhuc
    CONSTRAINT PK_FileDinhKem PRIMARY KEY (maFile)
);
GO
 
-- ============================================================
-- BƯỚC 3: ALTER TABLE – THÊM FOREIGN KEY CONSTRAINTS
-- ============================================================
 
-- QuyenHan_NguoiDung
ALTER TABLE QuyenHan_NguoiDung
    ADD CONSTRAINT FK_QND_QuyenHan
        FOREIGN KEY (maQuyenHan) REFERENCES QuyenHan(maQuyenHan);
 
ALTER TABLE QuyenHan_NguoiDung
    ADD CONSTRAINT FK_QND_NguoiDung
        FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung);
GO
 
-- ThongBao_NguoiDung
ALTER TABLE ThongBao_NguoiDung
    ADD CONSTRAINT FK_TBND_NguoiDung
        FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung);
 
ALTER TABLE ThongBao_NguoiDung
    ADD CONSTRAINT FK_TBND_ThongBao
        FOREIGN KEY (maThongBao) REFERENCES ThongBao(maThongBao);
GO
 
-- Log
ALTER TABLE [Log]
    ADD CONSTRAINT FK_Log_NguoiDung
        FOREIGN KEY (maNguoiDung) REFERENCES NguoiDung(maNguoiDung);
GO
 
-- CoSoKinhDoanh
ALTER TABLE CoSoKinhDoanh
    ADD CONSTRAINT FK_CSKD_ChuSoHuu
        FOREIGN KEY (maChuSoHuu) REFERENCES NguoiDung(maNguoiDung);
 
ALTER TABLE CoSoKinhDoanh
    ADD CONSTRAINT FK_CSKD_PhuongXa
        FOREIGN KEY (maPX) REFERENCES PhuongXa(maPX);
 
ALTER TABLE CoSoKinhDoanh
    ADD CONSTRAINT FK_CSKD_TruSo
        FOREIGN KEY (maCoSoTrue) REFERENCES CoSoKinhDoanh(maCoSo);
GO
 
-- ChiNhanh
ALTER TABLE ChiNhanh
    ADD CONSTRAINT FK_CN_CoSo
        FOREIGN KEY (maCoSo) REFERENCES CoSoKinhDoanh(maCoSo);
 
ALTER TABLE ChiNhanh
    ADD CONSTRAINT FK_CN_LichThanhTra
        FOREIGN KEY (lianThanhTraGanNhat) REFERENCES LichThanhTra(maThanhTra);
GO
 
-- CoSo_LoaiHinh
ALTER TABLE CoSo_LoaiHinh
    ADD CONSTRAINT FK_CSLH_CoSo
        FOREIGN KEY (maCoSo) REFERENCES CoSoKinhDoanh(maCoSo);
 
ALTER TABLE CoSo_LoaiHinh
    ADD CONSTRAINT FK_CSLH_LoaiHinh
        FOREIGN KEY (maLoaiHinhKinhDoanh) REFERENCES LoaiHinhKinhDoanh(maLoaiHinhKinhDoanh);
GO
 
-- LichThanhTra
ALTER TABLE LichThanhTra
    ADD CONSTRAINT FK_LTT_CoSo
        FOREIGN KEY (maCoSo) REFERENCES CoSoKinhDoanh(maCoSo);
 
ALTER TABLE LichThanhTra
    ADD CONSTRAINT FK_LTT_NguoiPhuTrach
        FOREIGN KEY (maNguoiThanhTra) REFERENCES NguoiDung(maNguoiDung);
GO
 
-- LichThanhTra_NguoiDung
ALTER TABLE LichThanhTra_NguoiDung
    ADD CONSTRAINT FK_LTTND_LichThanhTra
        FOREIGN KEY (maThanhTra) REFERENCES LichThanhTra(maThanhTra);
 
ALTER TABLE LichThanhTra_NguoiDung
    ADD CONSTRAINT FK_LTTND_NguoiDung
        FOREIGN KEY (maNguoiThanhTra) REFERENCES NguoiDung(maNguoiDung);
GO
 
-- HoSoDangKiKinhDoanh
ALTER TABLE HoSoDangKiKinhDoanh
    ADD CONSTRAINT FK_HSDKKD_CoSo
        FOREIGN KEY (maCoSo) REFERENCES CoSoKinhDoanh(maCoSo);
GO
 
-- ChungNhanATVSTP
ALTER TABLE ChungNhanATVSTP
    ADD CONSTRAINT FK_CNATVS_CoSo
        FOREIGN KEY (maCoSoKinhDoanh) REFERENCES CoSoKinhDoanh(maCoSo);
GO
 
-- PhanAnh
ALTER TABLE PhanAnh
    ADD CONSTRAINT FK_PA_NguoiPhanAnh
        FOREIGN KEY (maNguoiPhanAnh) REFERENCES NguoiDung(maNguoiDung);
 
ALTER TABLE PhanAnh
    ADD CONSTRAINT FK_PA_CoSo
        FOREIGN KEY (maCoSo) REFERENCES CoSoKinhDoanh(maCoSo);
 
ALTER TABLE PhanAnh
    ADD CONSTRAINT FK_PA_LoaiPhanAnh
        FOREIGN KEY (maLoaiPhanAnh) REFERENCES LoaiPhanAnh(maLoaiPhanAnh);
GO
 
-- GiayPhep
ALTER TABLE GiayPhep
    ADD CONSTRAINT FK_GP_CoSo
        FOREIGN KEY (maCoSo) REFERENCES CoSoKinhDoanh(maCoSo);
GO
 
-- HoSoThanhTra
ALTER TABLE HoSoThanhTra
    ADD CONSTRAINT FK_HSTT_LichThanhTra
        FOREIGN KEY (maThanhTra) REFERENCES LichThanhTra(maThanhTra);
GO
 
-- ViPham
ALTER TABLE ViPham
    ADD CONSTRAINT FK_VP_HoSoThanhTra
        FOREIGN KEY (maHoSo) REFERENCES HoSoThanhTra(maHoSo);
 
ALTER TABLE ViPham
    ADD CONSTRAINT FK_VP_LoaiViPham
        FOREIGN KEY (maLoaiViPham) REFERENCES LoaiViPham(maLoaiViPham);
GO
 
-- MinhChungKhacPhuc
ALTER TABLE MinhChungKhacPhuc
    ADD CONSTRAINT FK_MCKP_ViPham
        FOREIGN KEY (maViPham) REFERENCES ViPham(maViPham);
GO
 
-- KhieuNai
ALTER TABLE KhieuNai
    ADD CONSTRAINT FK_KN_CoSo
        FOREIGN KEY (maCoSo) REFERENCES CoSoKinhDoanh(maCoSo);
GO
 
-- Mau_ChiTieu
ALTER TABLE Mau_ChiTieu
    ADD CONSTRAINT FK_MCT_Mau
        FOREIGN KEY (maMau) REFERENCES MauKiemNghiem(maMau);
 
ALTER TABLE Mau_ChiTieu
    ADD CONSTRAINT FK_MCT_ChiTieu
        FOREIGN KEY (maChiTieu) REFERENCES ChiTieuKiemNghiem(maChiTieu);
GO
 
-- DamNhanKiemNgiem
ALTER TABLE DamNhanKiemNgiem
    ADD CONSTRAINT FK_DNKN_NguoiDung
        FOREIGN KEY (maNguoiKiemNghiem) REFERENCES NguoiDung(maNguoiDung);
 
ALTER TABLE DamNhanKiemNgiem
    ADD CONSTRAINT FK_DNKN_Mau
        FOREIGN KEY (maMau) REFERENCES MauKiemNghiem(maMau);
GO
 
-- kqDanhGia
ALTER TABLE kqDanhGia
    ADD CONSTRAINT FK_KQDG_HoSoThanhTra
        FOREIGN KEY (maHoSo) REFERENCES HoSoThanhTra(maHoSo);
 
ALTER TABLE kqDanhGia
    ADD CONSTRAINT FK_KQDG_TieuChi
        FOREIGN KEY (MaTieuChi) REFERENCES tieuChiDanhGia(MaTieuChi);
GO
 
-- BaoCao
ALTER TABLE BaoCao
    ADD CONSTRAINT FK_BC_HoSoThanhTra
        FOREIGN KEY (maHoSo) REFERENCES HoSoThanhTra(maHoSo);
GO
 
-- FileDinhKem
ALTER TABLE FileDinhKem
    ADD CONSTRAINT FK_FDK_MinhChung
        FOREIGN KEY (maMinhChung) REFERENCES MinhChungKhacPhuc(maMinhChung);
 
ALTER TABLE FileDinhKem
    ADD CONSTRAINT FK_FDK_PhanAnh
        FOREIGN KEY (maPhanAnh) REFERENCES PhanAnh(maPhanAnh);
 
ALTER TABLE FileDinhKem
    ADD CONSTRAINT FK_FDK_KhieuNai
        FOREIGN KEY (maKhieuNai) REFERENCES KhieuNai(maKhieuNai);
 
ALTER TABLE FileDinhKem
    ADD CONSTRAINT FK_FDK_ThongBao
        FOREIGN KEY (maThongBao) REFERENCES ThongBao(maThongBao);
 
ALTER TABLE FileDinhKem
    ADD CONSTRAINT FK_FDK_HoSoDKKD
        FOREIGN KEY (maHoSoDangKiKinhDoanh) REFERENCES HoSoDangKiKinhDoanh(maHoSo);
 
ALTER TABLE FileDinhKem
    ADD CONSTRAINT FK_FDK_HinhThucKhacPhuc
        FOREIGN KEY (maTinhTrangKhacPhuc) REFERENCES HinhThucKhacPhuc(maHinhThucKhacPhuc);
GO
 
-- ============================================================
-- BƯỚC 4: INSERT DỮ LIỆU MOCK (3–5 BẢN GHI MỖI BẢNG)
-- Thứ tự: bảng cha trước, bảng con sau
-- ============================================================
 
-- [1] QuyenHan
INSERT INTO QuyenHan (maQuyenHan, quyenHan) VALUES
    ('ADMIN', N'Quản trị hệ thống'),
    ('CHICUCATVSTP', N'Chi cục an toàn vệ sinh thực phẩm'),
    ('TTV', N'Thanh tra viên'),
    ('CBCD', N'Cán bộ kiểm nghiệm'),
    ('CSKD', N'Chủ cơ sở kinh doanh'),
    ('USER', N'Người dùng thông thường');
GO
 
-- [2] NguoiDung
INSERT INTO NguoiDung (maNguoiDung, hoTen, email, soDienThoai, gioiTinh, matKhau, CCCD) VALUES
    ('ND001', N'Nguyễn Văn An',    'an.nguyen@danang.gov.vn',  '0901234561', N'Nam',  'hash_pw_001', '048200001234'),
    ('ND002', N'Trần Thị Bình',    'binh.tran@danang.gov.vn',  '0901234562', N'Nữ',   'hash_pw_002', '048200005678'),
    ('ND003', N'Lê Minh Cường',    'cuong.le@danang.gov.vn',   '0901234563', N'Nam',  'hash_pw_003', '048200009012'),
    ('ND004', N'Phạm Thị Dung',    'dung.pham@email.com',      '0912345671', N'Nữ',   'hash_pw_004', '048200003456'),
    ('ND005', N'Hoàng Văn Em',     'em.hoang@email.com',       '0912345672', N'Nam',  'hash_pw_005', '048200007890');
GO
 
-- [3] PhuongXa
INSERT INTO PhuongXa (maPX, TenPhuongXa) VALUES
    ('PX001', N'Phường Hải Châu 1'),
    ('PX002', N'Phường Hải Châu 2'),
    ('PX003', N'Phường Thanh Khê'),
    ('PX004', N'Phường Sơn Trà'),
    ('PX005', N'Phường Ngũ Hành Sơn');
GO
 
-- [4] CoSoKinhDoanh (maCoSoTrue NULL cho trụ sở chính)
INSERT INTO CoSoKinhDoanh (maCoSo, tenCoSo, soGiayPhep, maCoSoTrue, ngayHetHanGiayPhep, maChuSoHuu, maPX) VALUES
    ('CS001', N'Nhà hàng Sông Hàn',          'GP-2022-001', NULL,    '2025-12-31', 'ND004', 'PX001'),
    ('CS002', N'Quán Cơm Miền Trung',         'GP-2022-002', NULL,    '2025-06-30', 'ND005', 'PX002'),
    ('CS003', N'Cơ sở chế biến Thủy Sản ABC', 'GP-2023-003', NULL,    '2026-03-15', 'ND004', 'PX003'),
    ('CS004', N'Nhà hàng Sông Hàn – CN1',     'GP-2023-004', 'CS001', '2025-12-31', 'ND004', 'PX004'),
    ('CS005', N'Bánh mỳ Đà Nẵng Express',     'GP-2023-005', NULL,    '2026-01-20', 'ND005', 'PX005');
GO
 
-- [5] QuyenHan_NguoiDung
INSERT INTO QuyenHan_NguoiDung (maQuyenHan, maNguoiDung) VALUES
    ('ADMIN', 'ND001'),
    ('TTV', 'ND002'),
    ('TTV', 'ND003'),
    ('CSKD', 'ND004'),
    ('CSKD', 'ND005');
GO
 
-- [6] ThongBao
INSERT INTO ThongBao (maThongBao, tieuDe, noiDung, ngayGui, loaiThongBao, isCongDong) VALUES
    ('TB001', N'Lịch thanh tra tháng 6',        N'Đề nghị chuẩn bị hồ sơ cho đợt thanh tra tháng 6/2025.',     '2025-05-28 08:00:00', N'Hành chính', 0),
    ('TB002', N'Gia hạn giấy phép',             N'Giấy phép của cơ sở CS002 sắp hết hạn, vui lòng gia hạn.',  '2025-05-30 09:00:00', N'Nhắc nhở', 0),
    ('TB003', N'Kết quả kiểm nghiệm mẫu MK001', N'Mẫu kiểm nghiệm MK001 đã có kết quả, vui lòng xem chi tiết.','2025-06-01 10:00:00', N'Kết quả', 0),
    ('TB004', N'Phân ánh mới từ người dân',      N'Có 2 phản ánh mới cần xử lý về cơ sở CS001.',               '2025-06-02 14:00:00', N'Phản ánh', 1),
    ('TB005', N'Cập nhật chứng nhận ATVS',       N'Chứng nhận ATVS của CS₀₀₃ đã được cấp mới.',                '2025-06-03 08:30:00', N'Thông báo', 1);
GO
 
-- [7] ThongBao_NguoiDung
INSERT INTO ThongBao_NguoiDung (maNguoiDung, maThongBao, trangThai) VALUES
    ('ND001', 'TB001', N'Đã đọc'),
    ('ND002', 'TB001', N'Chưa đọc'),
    ('ND004', 'TB002', N'Đã đọc'),
    ('ND002', 'TB003', N'Đã đọc'),
    ('ND003', 'TB004', N'Chưa đọc');
GO
 
-- [8] Log
INSERT INTO [Log] (maLog, ip, [time], maNguoiDung) VALUES
    ('LOG001', '192.168.1.10', '2025-06-01 08:05:00', 'ND001'),
    ('LOG002', '192.168.1.11', '2025-06-01 09:10:00', 'ND002'),
    ('LOG003', '10.0.0.5',     '2025-06-02 10:20:00', 'ND003'),
    ('LOG004', '203.113.4.21', '2025-06-02 11:35:00', 'ND004'),
    ('LOG005', '203.113.4.22', '2025-06-03 14:00:00', 'ND005');
GO
 
-- [9] LoaiHinhKinhDoanh
INSERT INTO LoaiHinhKinhDoanh (maLoaiHinhKinhDoanh, tenLoaiHinhKinhDoanh, moTa) VALUES
    ('LH001', N'Nhà hàng ăn uống',      N'Cơ sở kinh doanh dịch vụ ăn uống tại chỗ'),
    ('LH002', N'Quán ăn bình dân',      N'Cơ sở bán thức ăn đường phố, giá bình dân'),
    ('LH003', N'Cơ sở chế biến thực phẩm', N'Sản xuất và chế biến thực phẩm đóng gói'),
    ('LH004', N'Siêu thị – cửa hàng',   N'Bán lẻ thực phẩm có hạn sử dụng'),
    ('LH005', N'Bếp ăn tập thể',        N'Phục vụ bữa ăn cho tập thể, trường học, xí nghiệp');
GO
 
-- [10] CoSo_LoaiHinh
INSERT INTO CoSo_LoaiHinh (maCoSo, maLoaiHinhKinhDoanh) VALUES
    ('CS001', 'LH001'),
    ('CS002', 'LH002'),
    ('CS003', 'LH003'),
    ('CS004', 'LH001'),
    ('CS005', 'LH002');
GO
 
-- [11] LichThanhTra
INSERT INTO LichThanhTra (maThanhTra, maCoSo, maNguoiThanhTra, trangThai, noiDung) VALUES
    ('LTT001', 'CS001', 'ND002', N'Đã hoàn thành', N'Thanh tra định kỳ quý II/2025 tại nhà hàng Sông Hàn'),
    ('LTT002', 'CS002', 'ND002', N'Đang thực hiện', N'Thanh tra đột xuất theo phản ánh người dân'),
    ('LTT003', 'CS003', 'ND003', N'Đã hoàn thành', N'Thanh tra định kỳ cơ sở chế biến thủy sản'),
    ('LTT004', 'CS004', 'ND002', N'Lên kế hoạch',  N'Thanh tra chi nhánh Nhà hàng Sông Hàn'),
    ('LTT005', 'CS005', 'ND003', N'Lên kế hoạch',  N'Thanh tra định kỳ quý III/2025');
GO
 
-- [12] LichThanhTra_NguoiDung
INSERT INTO LichThanhTra_NguoiDung (maThanhTra, maNguoiThanhTra, thoiGianTT) VALUES
    ('LTT001', 'ND002', '2025-04-15 08:00:00'),
    ('LTT001', 'ND003', '2025-04-15 08:00:00'),
    ('LTT002', 'ND002', '2025-05-20 09:00:00'),
    ('LTT003', 'ND003', '2025-05-10 08:30:00'),
    ('LTT004', 'ND002', '2025-07-01 08:00:00');
GO
 
-- [13] ChiNhanh
INSERT INTO ChiNhanh (maChiNhanh, diaChi, soDienThoai, trangThai, maCoSo, lianThanhTraGanNhat) VALUES
    ('CN001', N'123 Bạch Đằng, Hải Châu, Đà Nẵng',  '02363456789', N'Đang hoạt động', 'CS001', 'LTT001'),
    ('CN002', N'45 Nguyễn Văn Linh, Thanh Khê',      '02363456790', N'Đang hoạt động', 'CS002', 'LTT002'),
    ('CN003', N'78 Trần Phú, Sơn Trà, Đà Nẵng',      '02363456791', N'Tạm dừng',       'CS003', 'LTT003'),
    ('CN004', N'12 Hoàng Diệu, Hải Châu, Đà Nẵng',   '02363456792', N'Đang hoạt động', 'CS004', 'LTT004'),
    ('CN005', N'99 Lê Duẩn, Hải Châu, Đà Nẵng',      '02363456793', N'Đang hoạt động', 'CS005', NULL);
GO
 
-- [14] HoSoDangKiKinhDoanh
INSERT INTO HoSoDangKiKinhDoanh (maHoSo, ngayNop, trangThai, maCoSo) VALUES
    ('HSD001', '2022-01-10', N'Đã duyệt',     'CS001'),
    ('HSD002', '2022-03-15', N'Đã duyệt',     'CS002'),
    ('HSD003', '2023-02-20', N'Đã duyệt',     'CS003'),
    ('HSD004', '2023-05-05', N'Chờ duyệt',    'CS004'),
    ('HSD005', '2023-08-12', N'Đã duyệt',     'CS005');
GO
 
-- [15] ChungNhanATVSTP
INSERT INTO ChungNhanATVSTP (maCN, tenChungNhan, ngayBanHanh, ngayHetHan, maCoSoKinhDoanh, trangThai) VALUES
    ('CN001', N'Chứng nhận ATVS – Nhà hàng Sông Hàn',          '2023-01-05', '2026-01-05', 'CS001', N'Còn hiệu lực'),
    ('CN002', N'Chứng nhận ATVS – Quán Cơm Miền Trung',        '2022-06-01', '2025-06-01', 'CS002', N'Hết hạn'),
    ('CN003', N'Chứng nhận ATVS – Cơ sở Thủy Sản ABC',         '2023-03-20', '2026-03-20', 'CS003', N'Còn hiệu lực'),
    ('CN004', N'Chứng nhận ATVS – Nhà hàng Sông Hàn CN1',      '2023-05-10', '2026-05-10', 'CS004', N'Còn hiệu lực'),
    ('CN005', N'Chứng nhận ATVS – Bánh mỳ Đà Nẵng Express',    '2023-02-14', '2026-02-14', 'CS005', N'Còn hiệu lực');
GO
 
-- [16] LoaiPhanAnh
INSERT INTO LoaiPhanAnh (maLoaiPhanAnh, tenLoaiPhanAnh) VALUES
    ('LPA001', N'Vệ sinh an toàn thực phẩm'),
    ('LPA002', N'Chất lượng thực phẩm'),
    ('LPA003', N'Thái độ phục vụ'),
    ('LPA004', N'Giấy phép kinh doanh'),
    ('LPA005', N'Khác');
GO
 
-- [17] PhanAnh
INSERT INTO PhanAnh (maPhanAnh, maNguoiPhanAnh, trangThaiPhanAnh, maCoSo, lyDo, ngayGui, maLoaiPhanAnh) VALUES
    ('PA001', 'ND004', N'Đang xử lý',   'CS002', N'Quán ăn không đảm bảo vệ sinh, bàn ghế bẩn',          '2025-05-25 10:00:00', 'LPA001'),
    ('PA002', 'ND005', N'Đã xử lý',     'CS001', N'Thực phẩm có mùi lạ, nghi ngờ không tươi',              '2025-05-20 14:30:00', 'LPA002'),
    ('PA003', 'ND004', N'Chưa xử lý',   'CS003', N'Xưởng chế biến không có lưới chắn côn trùng',          '2025-06-01 09:00:00', 'LPA001'),
    ('PA004', 'ND005', N'Đang xử lý',   'CS005', N'Nhân viên không đeo khẩu trang khi làm việc',           '2025-06-03 11:00:00', 'LPA003'),
    ('PA005', 'ND004', N'Đã xử lý',     'CS004', N'Cơ sở không trưng bày giấy phép kinh doanh',           '2025-04-10 08:00:00', 'LPA004');
GO
 
-- [18] GiayPhep
INSERT INTO GiayPhep (maGiayPhep, loaiGiayPhep, trangThai, ngayCap, ngayHetHan, maCoSo) VALUES
    ('GP001', N'Giấy phép kinh doanh',            N'Còn hiệu lực', '2022-01-15', '2025-12-31', 'CS001'),
    ('GP002', N'Giấy phép vệ sinh an toàn thực phẩm', N'Hết hạn', '2022-03-20', '2025-03-20', 'CS002'),
    ('GP003', N'Giấy phép sản xuất thực phẩm',    N'Còn hiệu lực', '2023-02-25', '2026-02-25', 'CS003'),
    ('GP004', N'Giấy phép kinh doanh',            N'Còn hiệu lực', '2023-05-10', '2026-05-10', 'CS004'),
    ('GP005', N'Giấy phép kinh doanh',            N'Còn hiệu lực', '2023-08-20', '2026-08-20', 'CS005');
GO
 
-- [19] HoSoThanhTra
INSERT INTO HoSoThanhTra (maHoSo, maThanhTra, diem, tinhTrangViPham, KetLuan, NhanXetChung, BienPhapXuLy, KienNghi) VALUES
    ('HSTT001', 'LTT001', 85.0, N'Có vi phạm nhỏ',   N'Cơ sở đạt tiêu chuẩn nhưng cần khắc phục một số điểm nhỏ', N'Nhìn chung vệ sinh tốt',         N'Yêu cầu bổ sung biển cảnh báo',     N'Tăng cường kiểm tra định kỳ'),
    ('HSTT002', 'LTT002', 60.0, N'Vi phạm nghiêm trọng', N'Cơ sở vi phạm nhiều điều khoản về vệ sinh',             N'Nhiều hạng mục không đạt chuẩn',  N'Đình chỉ hoạt động tạm thời',       N'Kiểm tra lại sau 30 ngày'),
    ('HSTT003', 'LTT003', 92.0, N'Không vi phạm',    N'Cơ sở đạt xuất sắc các tiêu chí',                          N'Hệ thống VSATTP được duy trì tốt', N'Không cần biện pháp xử lý',        N'Tiếp tục duy trì'),
    ('HSTT004', 'LTT004', 75.0, N'Có vi phạm',       N'Chi nhánh cần cải thiện điều kiện bảo quản thực phẩm',     N'Một số tủ lạnh không đủ nhiệt độ', N'Yêu cầu nâng cấp trang thiết bị',  N'Kiểm tra sau 14 ngày'),
    ('HSTT005', 'LTT005', 88.0, N'Có vi phạm nhỏ',   N'Cơ sở hoạt động tốt, vi phạm không đáng kể',              N'Khu vực chế biến gọn gàng',       N'Nhắc nhở về vệ sinh tay',           N'Theo dõi trong 6 tháng');
GO
 
-- [20] LoaiViPham
INSERT INTO LoaiViPham (maLoaiViPham, tenLoaiViPham, moTaThem) VALUES
    ('LVP001', N'Vi phạm vệ sinh cơ sở',        N'Không đảm bảo điều kiện vệ sinh nhà xưởng, khu chế biến'),
    ('LVP002', N'Vi phạm về nguồn gốc thực phẩm', N'Sử dụng nguyên liệu không rõ nguồn gốc, không có hóa đơn'),
    ('LVP003', N'Vi phạm bảo quản thực phẩm',   N'Nhiệt độ bảo quản không đúng quy định'),
    ('LVP004', N'Vi phạm về nhân sự',            N'Người lao động không có chứng chỉ tập huấn ATVS'),
    ('LVP005', N'Vi phạm về giấy tờ pháp lý',   N'Kinh doanh khi giấy phép đã hết hạn');
GO
 
-- [21] ViPham
INSERT INTO ViPham (maViPham, maHoSo, maLoaiViPham, moTaThem, khacPhuc, trangThaiPheDuyet) VALUES
    ('VP001', 'HSTT001', 'LVP001', N'Sàn nhà khu chế biến còn ướt và trơn',                N'Lau khô sàn, lắp thêm tấm chống trơn',          N'Đã phê duyệt'),
    ('VP002', 'HSTT002', 'LVP002', N'Phát hiện 5kg thịt heo không có giấy kiểm dịch',     N'Tiêu hủy lô hàng, cam kết nhập từ nguồn hợp lệ', N'Đã phê duyệt'),
    ('VP003', 'HSTT002', 'LVP004', N'Hai nhân viên bếp không có chứng chỉ ATVS',          N'Đăng ký tập huấn trong vòng 30 ngày',            N'Chờ phê duyệt'),
    ('VP004', 'HSTT004', 'LVP003', N'Tủ lạnh bảo quản thịt sống đang ở +8°C (quá chuẩn)',N'Kiểm tra và thay thế tủ lạnh',                   N'Đã phê duyệt'),
    ('VP005', 'HSTT005', 'LVP001', N'Nhân viên không đeo găng tay khi tiếp xúc thực phẩm',N'Cấp phát và yêu cầu sử dụng đồ bảo hộ',         N'Đã phê duyệt');
GO
 
-- [22] HinhThucKhacPhuc
INSERT INTO HinhThucKhacPhuc (maHinhThucKhacPhuc, soTienKhacPhuc, tinhTrangKhacPhuc) VALUES
    ('HT001', 2000000.00,  N'Đã khắc phục'),
    ('HT002', 5000000.00,  N'Đang khắc phục'),
    ('HT003', 0.00,        N'Đã khắc phục'),
    ('HT004', 10000000.00, N'Chưa khắc phục'),
    ('HT005', 500000.00,   N'Đã khắc phục');
GO
 
-- [23] MinhChungKhacPhuc
INSERT INTO MinhChungKhacPhuc (maMinhChung, maViPham, thoiGianGui) VALUES
    ('MC001', 'VP001', '2025-04-20 08:00:00'),
    ('MC002', 'VP002', '2025-05-25 10:30:00'),
    ('MC003', 'VP004', '2025-06-05 09:00:00'),
    ('MC004', 'VP005', '2025-06-08 11:00:00'),
    ('MC005', 'VP001', '2025-04-22 14:00:00');
GO
 
-- [24] KhieuNai
INSERT INTO KhieuNai (maKhieuNai, trangThai, maCoSo, thoiGianKhieuNai, moTaChiTiet) VALUES
    ('KN001', N'Đang xử lý',  'CS002', '2025-05-28 09:00:00', N'Khiếu nại kết quả thanh tra, cho rằng đoàn thanh tra đánh giá không công bằng'),
    ('KN002', N'Đã giải quyết','CS001', '2025-04-20 14:00:00', N'Khiếu nại về mức phạt tiền quá cao so với tính chất vi phạm'),
    ('KN003', N'Chưa xử lý',  'CS003', '2025-06-02 10:00:00', N'Yêu cầu xem xét lại biên bản vi phạm ngày 10/05/2025'),
    ('KN004', N'Đang xử lý',  'CS004', '2025-06-04 08:30:00', N'Khiếu nại quyết định đình chỉ tạm thời hoạt động chi nhánh'),
    ('KN005', N'Đã giải quyết','CS005', '2025-05-15 11:00:00', N'Khiếu nại về việc cán bộ thanh tra không thông báo trước 48 giờ');
GO
 
-- [25] ChiTieuKiemNghiem
INSERT INTO ChiTieuKiemNghiem (maChiTieu, tenChiTieu) VALUES
    ('CT001', N'Chỉ tiêu vi sinh vật tổng số'),
    ('CT002', N'Coliform tổng số'),
    ('CT003', N'E.coli'),
    ('CT004', N'Salmonella'),
    ('CT005', N'Kim loại nặng (Pb, Hg, Cd)');
GO
 
-- [26] MauKiemNghiem
INSERT INTO MauKiemNghiem (maMau, tenMau, ngayThu, ngayKiemNghiem, trangThai, loaiMau, noiDung, ngayYeuCau, hanHoanThanh) VALUES
    ('MK001', N'Mẫu thịt heo cơ sở CS001',    '2025-04-15', '2025-04-17', N'Có kết quả',  N'Thực phẩm', N'Lấy mẫu ngẫu nhiên tại kho lạnh', '2025-04-15', '2025-04-20'),
    ('MK002', N'Mẫu rau sống cơ sở CS002',    '2025-05-20', '2025-05-22', N'Có kết quả',  N'Thực phẩm', N'Lấy mẫu rau ăn sống',             '2025-05-20', '2025-05-25'),
    ('MK003', N'Mẫu chả cá cơ sở CS003',      '2025-05-10', '2025-05-12', N'Có kết quả',  N'Thực phẩm', N'Lấy mẫu sản phẩm đóng gói',       '2025-05-10', '2025-05-15'),
    ('MK004', N'Mẫu nước uống cơ sở CS004',   '2025-06-01', '2025-06-03', N'Đang xét nghiệm', N'Nước',  N'Kiểm tra chất lượng nước uống',   '2025-06-01', '2025-06-07'),
    ('MK005', N'Mẫu bánh mỳ cơ sở CS005',     '2025-06-03', NULL,         N'Chờ xét nghiệm',  N'Thực phẩm', N'Kiểm tra vi sinh và phụ gia',  '2025-06-03', '2025-06-10');
GO
 
-- [27] Mau_ChiTieu
INSERT INTO Mau_ChiTieu (maMau, maChiTieu, ketQua) VALUES
    ('MK001', 'CT001', N'10^3 CFU/g – Đạt'),
    ('MK001', 'CT003', N'Âm tính – Đạt'),
    ('MK002', 'CT001', N'10^5 CFU/g – Không đạt'),
    ('MK002', 'CT002', N'150 MPN/100g – Không đạt'),
    ('MK003', 'CT004', N'Âm tính – Đạt');
GO
 
-- [28] DamNhanKiemNgiem
INSERT INTO DamNhanKiemNgiem (maNguoiKiemNghiem, maMau) VALUES
    ('ND003', 'MK001'),
    ('ND003', 'MK002'),
    ('ND002', 'MK003'),
    ('ND003', 'MK003'),
    ('ND002', 'MK004');
GO
 
-- [29] tieuChiDanhGia
INSERT INTO tieuChiDanhGia (MaTieuChi, TenTieuChi, Nhom, ThuTu) VALUES
    ('TC001', N'Điều kiện vệ sinh cơ sở vật chất',    N'Cơ sở', 1),
    ('TC002', N'Điều kiện trang thiết bị, dụng cụ',   N'Cơ sở', 2),
    ('TC003', N'Điều kiện về con người',               N'Nhân sự', 3),
    ('TC004', N'Nguồn gốc và chất lượng nguyên liệu',  N'Nguyên liệu', 4),
    ('TC005', N'Hồ sơ pháp lý, giấy tờ liên quan',    N'Pháp lý', 5);
GO
 
-- [30] kqDanhGia
INSERT INTO kqDanhGia (maHoSo, MaTieuChi, KetQuaDanhGia) VALUES
    ('HSTT001', 'TC001', N'Đạt – 20/20 điểm'),
    ('HSTT001', 'TC003', N'Đạt – 18/20 điểm'),
    ('HSTT002', 'TC001', N'Không đạt – 10/20 điểm'),
    ('HSTT002', 'TC004', N'Không đạt – 8/20 điểm'),
    ('HSTT003', 'TC005', N'Đạt – 20/20 điểm');
GO
 
-- [31] BaoCao
INSERT INTO BaoCao (maBaoCao, maHoSo, NoiDung, nhanXet) VALUES
    ('BC001', 'HSTT001', N'Báo cáo đợt thanh tra tháng 4 năm 2025 tại Nhà hàng Sông Hàn. Kết quả đạt 85/100 điểm.',         N'Cơ sở hoạt động tốt, cần cải thiện khu vực sàn'),
    ('BC002', 'HSTT002', N'Báo cáo đợt thanh tra đột xuất tháng 5 năm 2025 tại Quán Cơm Miền Trung. Nhiều vi phạm.',       N'Kiến nghị đình chỉ tạm thời để khắc phục'),
    ('BC003', 'HSTT003', N'Báo cáo đợt thanh tra định kỳ tháng 5 năm 2025 tại Cơ sở Thủy Sản ABC. Đạt xuất sắc.',         N'Đây là mô hình điển hình về VSATTP'),
    ('BC004', 'HSTT004', N'Báo cáo đợt thanh tra chi nhánh tháng 6 năm 2025. Phát hiện vi phạm bảo quản lạnh.',            N'Yêu cầu khắc phục thiết bị trong 14 ngày'),
    ('BC005', 'HSTT005', N'Báo cáo sơ bộ đợt thanh tra quý III/2025 tại Bánh mỳ Đà Nẵng Express.',                         N'Nhìn chung tốt, vi phạm nhỏ đã được nhắc nhở');
GO
 
-- [32] FileDinhKem
INSERT INTO FileDinhKem (maFile, loaiFile, thoiGianGui, maMinhChung, maPhanAnh, maKhieuNai, maThongBao, maHoSoDangKiKinhDoanh, maTinhTrangKhacPhuc) VALUES
    ('FD001', N'image/jpeg', '2025-04-20 08:05:00', 'MC001', NULL,   NULL,   NULL,   NULL,   'HT001'),
    ('FD002', N'image/png',  '2025-05-25 10:35:00', 'MC002', NULL,   NULL,   NULL,   NULL,   'HT002'),
    ('FD003', N'application/pdf', '2025-05-25 14:00:00', NULL, 'PA001', NULL, NULL,  NULL,   NULL),
    ('FD004', N'application/pdf', '2025-05-28 09:10:00', NULL, NULL, 'KN001', NULL,  NULL,   NULL),
    ('FD005', N'application/pdf', '2022-01-10 10:00:00', NULL, NULL,  NULL,  NULL,   'HSD001', NULL);
GO
 

---------------------------------- TRIGGER VÀ PROCEDURE CỦA HIẾU VÕ------------------------------------------------------------
--1. TRIGGER: Validate dữ liệu người dùng khi INSERT/UPDATE
IF OBJECT_ID('TRG_NguoiDung_Validate', 'TR') IS NOT NULL
    DROP TRIGGER TRG_NguoiDung_Validate;
GO

CREATE TRIGGER TRG_NguoiDung_Validate
ON NguoiDung
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;

    -- SĐT: bắt buộc 10-11 ký tự và chỉ chứa số
    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE soDienThoai IS NULL
           OR LEN(soDienThoai) NOT BETWEEN 10 AND 11
           OR soDienThoai LIKE '%[^0-9]%'
    )
    BEGIN
        RAISERROR (N'Số điện thoại phải có 10-11 chữ số và chỉ gồm ký tự số.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Email: định dạng cơ bản XXX@XXX.XXX
    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE email IS NULL
           OR email NOT LIKE '%_@_%._%'
           OR email LIKE '% %'
    )
    BEGIN
        RAISERROR (N'Email không đúng định dạng XXX@XXX.XXX.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END

    -- Mật khẩu: > 6 ký tự, có chữ và số
    IF EXISTS (
        SELECT 1
        FROM inserted
        WHERE matKhau IS NULL
           OR LEN(matKhau) < 7
           OR matKhau NOT LIKE '%[A-Za-z]%'
           OR matKhau NOT LIKE '%[0-9]%'
    )
    BEGIN
        RAISERROR (N'Mật khẩu phải dài trên 6 ký tự và bao gồm cả chữ lẫn số.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END
GO

-- TEST TRIGGER 1
PRINT N'===== TEST TRIGGER 1: TRG_NguoiDung_Validate =====';
BEGIN TRY
    INSERT INTO NguoiDung (maNguoiDung, hoTen, email, soDienThoai, gioiTinh, matKhau, CCCD)
    VALUES ('NDT001', N'Test Invalid', 'sai_dinh_dang', '09123ABC', N'Nam', '12345', '999999999999');
    PRINT N'[FAILED] Dữ liệu sai nhưng vẫn insert được.';
END TRY
BEGIN CATCH
    PRINT N'[PASSED] Chặn đúng dữ liệu sai: ' + ERROR_MESSAGE();
END CATCH;

BEGIN TRY
    INSERT INTO NguoiDung (maNguoiDung, hoTen, email, soDienThoai, gioiTinh, matKhau, CCCD)
    VALUES ('NDT002', N'Test Valid', 'test.valid@email.com', '0912345678', N'Nữ', 'abc12345', '999999999998');
    PRINT N'[PASSED] Insert dữ liệu hợp lệ thành công.';
END TRY
BEGIN CATCH
    PRINT N'[FAILED] Dữ liệu hợp lệ nhưng bị lỗi: ' + ERROR_MESSAGE();
END CATCH;

DELETE FROM NguoiDung WHERE maNguoiDung IN ('NDT001', 'NDT002');
GO


--2. TRIGGER: Khi INSERT ViPham -> tự tạo ThongBao cộng đồng (isCongDong = 1)
IF OBJECT_ID('TRG_ViPham_AutoThongBaoCongDong', 'TR') IS NOT NULL
    DROP TRIGGER TRG_ViPham_AutoThongBaoCongDong;
GO

CREATE TRIGGER TRG_ViPham_AutoThongBaoCongDong
ON ViPham
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @maxSo INT;
    SELECT @maxSo = ISNULL(MAX(TRY_CAST(SUBSTRING(maThongBao, 3, 10) AS INT)), 0)
    FROM ThongBao
    WHERE maThongBao LIKE 'TB%';

    ;WITH Nguon AS (
        SELECT
            i.maViPham,
            cs.tenCoSo,
            ROW_NUMBER() OVER (ORDER BY i.maViPham) AS rn
        FROM inserted i
        LEFT JOIN HoSoThanhTra hs ON hs.maHoSo = i.maHoSo
        LEFT JOIN LichThanhTra ltt ON ltt.maThanhTra = hs.maThanhTra
        LEFT JOIN CoSoKinhDoanh cs ON cs.maCoSo = ltt.maCoSo
    )
    INSERT INTO ThongBao (maThongBao, tieuDe, noiDung, ngayGui, loaiThongBao, isCongDong)
    SELECT
        'TB' + RIGHT(REPLICATE('0', 6) + CAST(@maxSo + rn AS VARCHAR(10)), 6),
        N'Cảnh báo vi phạm ATTP',
        N'Cơ sở ' + ISNULL(tenCoSo, N'(không xác định)') + N' phát sinh vi phạm mã ' + maViPham + N'.',
        GETDATE(),
        N'Vi phạm',
        1
    FROM Nguon;
END
GO

-- TEST TRIGGER 2
PRINT N'===== TEST TRIGGER 2: TRG_ViPham_AutoThongBaoCongDong =====';
INSERT INTO ViPham (maViPham, maHoSo, maLoaiViPham, moTaThem, khacPhuc, trangThaiPheDuyet)
VALUES ('VPTEST1', 'HSTT001', 'LVP001', N'Test vi phạm để tạo thông báo', N'Test khắc phục', N'Chờ phê duyệt');

SELECT TOP 1 *
FROM ThongBao
WHERE tieuDe = N'Cảnh báo vi phạm ATTP'
  AND noiDung LIKE N'%VPTEST1%'
ORDER BY ngayGui DESC;

DELETE FROM ViPham WHERE maViPham = 'VPTEST1';
DELETE FROM ThongBao WHERE tieuDe = N'Cảnh báo vi phạm ATTP' AND noiDung LIKE N'%VPTEST1%';
GO


--3. TRIGGER: Khi INSERT PhanAnh -> tạo ThongBao cho nhóm CHICUCATVSTP
IF OBJECT_ID('TRG_PhanAnh_AutoThongBaoChiCuc', 'TR') IS NOT NULL
    DROP TRIGGER TRG_PhanAnh_AutoThongBaoChiCuc;
GO

CREATE TRIGGER TRG_PhanAnh_AutoThongBaoChiCuc
ON PhanAnh
AFTER INSERT
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @maxSo INT;
    DECLARE @ThongBaoMoi TABLE (maThongBao VARCHAR(10));

    SELECT @maxSo = ISNULL(MAX(TRY_CAST(SUBSTRING(maThongBao, 3, 10) AS INT)), 0)
    FROM ThongBao
    WHERE maThongBao LIKE 'TB%';

    ;WITH Nguon AS (
        SELECT
            i.maPhanAnh,
            cs.tenCoSo,
            ROW_NUMBER() OVER (ORDER BY i.maPhanAnh) AS rn
        FROM inserted i
        LEFT JOIN CoSoKinhDoanh cs ON cs.maCoSo = i.maCoSo
    )
    INSERT INTO ThongBao (maThongBao, tieuDe, noiDung, ngayGui, loaiThongBao, isCongDong)
    OUTPUT inserted.maThongBao INTO @ThongBaoMoi(maThongBao)
    SELECT
        'TB' + RIGHT(REPLICATE('0', 6) + CAST(@maxSo + rn AS VARCHAR(10)), 6),
        N'Phản ánh mới cần xử lý',
        N'Có phản ánh mã ' + maPhanAnh + N' liên quan cơ sở ' + ISNULL(tenCoSo, N'(không xác định)') + N'.',
        GETDATE(),
        N'Phản ánh',
        0
    FROM Nguon src;

    INSERT INTO ThongBao_NguoiDung (maNguoiDung, maThongBao, trangThai)
    SELECT qnd.maNguoiDung, tb.maThongBao, N'Chưa đọc'
    FROM @ThongBaoMoi tb
    CROSS JOIN (
        SELECT maNguoiDung
        FROM QuyenHan_NguoiDung
        WHERE maQuyenHan = 'CHICUCATVSTP'
    ) qnd;
END
GO

-- TEST TRIGGER 3
PRINT N'===== TEST TRIGGER 3: TRG_PhanAnh_AutoThongBaoChiCuc =====';
INSERT INTO PhanAnh (maPhanAnh, maNguoiPhanAnh, trangThaiPhanAnh, maCoSo, lyDo, ngayGui, maLoaiPhanAnh)
VALUES ('PATEST1', 'ND004', N'Chưa xử lý', 'CS001', N'Test phản ánh mới', GETDATE(), 'LPA001');

SELECT TOP 1 *
FROM ThongBao
WHERE tieuDe = N'Phản ánh mới cần xử lý'
  AND noiDung LIKE N'%PATEST1%'
ORDER BY ngayGui DESC;

SELECT tbnd.*
FROM ThongBao_NguoiDung tbnd
JOIN ThongBao tb ON tb.maThongBao = tbnd.maThongBao
WHERE tb.tieuDe = N'Phản ánh mới cần xử lý'
  AND tb.noiDung LIKE N'%PATEST1%';

DELETE tbnd
FROM ThongBao_NguoiDung tbnd
JOIN ThongBao tb ON tb.maThongBao = tbnd.maThongBao
WHERE tb.tieuDe = N'Phản ánh mới cần xử lý'
  AND tb.noiDung LIKE N'%PATEST1%';

DELETE FROM ThongBao
WHERE tieuDe = N'Phản ánh mới cần xử lý'
  AND noiDung LIKE N'%PATEST1%';

DELETE FROM PhanAnh WHERE maPhanAnh = 'PATEST1';
GO


--4. PROCEDURE: Danh sách cơ sở sắp hết hạn giấy phép
IF OBJECT_ID('PRC_DanhSachCoSoSapHetHanGiayPhep', 'P') IS NOT NULL
    DROP PROCEDURE PRC_DanhSachCoSoSapHetHanGiayPhep;
GO

CREATE PROCEDURE PRC_DanhSachCoSoSapHetHanGiayPhep
    @soNgayCanhBao INT = 30
AS
BEGIN
    SET NOCOUNT ON;

    SELECT
        maCoSo,
        tenCoSo,
        soGiayPhep,
        ngayHetHanGiayPhep,
        DATEDIFF(DAY, CAST(GETDATE() AS DATE), ngayHetHanGiayPhep) AS soNgayConLai
    FROM CoSoKinhDoanh
    WHERE ngayHetHanGiayPhep BETWEEN CAST(GETDATE() AS DATE)
                                AND DATEADD(DAY, @soNgayCanhBao, CAST(GETDATE() AS DATE))
    ORDER BY ngayHetHanGiayPhep ASC;
END
GO

-- TEST PROCEDURE 1
PRINT N'===== TEST PROCEDURE 1: PRC_DanhSachCoSoSapHetHanGiayPhep =====';
EXEC PRC_DanhSachCoSoSapHetHanGiayPhep @soNgayCanhBao = 400;
GO


--5. PROCEDURE: Tạo thông báo cộng đồng thủ công
IF OBJECT_ID('PRC_TaoThongBaoCongDong', 'P') IS NOT NULL
    DROP PROCEDURE PRC_TaoThongBaoCongDong;
GO

CREATE PROCEDURE PRC_TaoThongBaoCongDong
    @tieuDe NVARCHAR(200),
    @noiDung NVARCHAR(MAX),
    @loaiThongBao NVARCHAR(50) = N'Hệ thống'
AS
BEGIN
    SET NOCOUNT ON;

    DECLARE @maxSo INT;
    DECLARE @maThongBaoMoi VARCHAR(10);

    SELECT @maxSo = ISNULL(MAX(TRY_CAST(SUBSTRING(maThongBao, 3, 10) AS INT)), 0)
    FROM ThongBao
    WHERE maThongBao LIKE 'TB%';

    SET @maThongBaoMoi = 'TB' + RIGHT(REPLICATE('0', 6) + CAST(@maxSo + 1 AS VARCHAR(10)), 6);

    INSERT INTO ThongBao (maThongBao, tieuDe, noiDung, ngayGui, loaiThongBao, isCongDong)
    VALUES (@maThongBaoMoi, @tieuDe, @noiDung, GETDATE(), @loaiThongBao, 1);

    SELECT @maThongBaoMoi AS maThongBaoDaTao;
END
GO

-- TEST PROCEDURE 2
PRINT N'===== TEST PROCEDURE 2: PRC_TaoThongBaoCongDong =====';
EXEC PRC_TaoThongBaoCongDong
    @tieuDe = N'[TEST] Thông báo cộng đồng',
    @noiDung = N'Test tạo thông báo cộng đồng từ procedure.',
    @loaiThongBao = N'Test';

SELECT TOP 1 *
FROM ThongBao
WHERE tieuDe = N'[TEST] Thông báo cộng đồng'
ORDER BY ngayGui DESC;

DELETE FROM ThongBao WHERE tieuDe = N'[TEST] Thông báo cộng đồng';
GO


--6. PROCEDURE: Cập nhật trạng thái phản ánh và thông báo cho người gửi
IF OBJECT_ID('PRC_CapNhatTrangThaiPhanAnh', 'P') IS NOT NULL
    DROP PROCEDURE PRC_CapNhatTrangThaiPhanAnh;
GO

CREATE PROCEDURE PRC_CapNhatTrangThaiPhanAnh
    @maPhanAnh VARCHAR(10),
    @trangThaiMoi NVARCHAR(30)
AS
BEGIN
    SET NOCOUNT ON;

    IF NOT EXISTS (SELECT 1 FROM PhanAnh WHERE maPhanAnh = @maPhanAnh)
    BEGIN
        RAISERROR (N'Không tìm thấy phản ánh cần cập nhật.', 16, 1);
        RETURN;
    END

    UPDATE PhanAnh
    SET trangThaiPhanAnh = @trangThaiMoi
    WHERE maPhanAnh = @maPhanAnh;

    DECLARE @nguoiGui VARCHAR(10);
    DECLARE @maxSo INT;
    DECLARE @maThongBaoMoi VARCHAR(10);

    SELECT @nguoiGui = maNguoiPhanAnh
    FROM PhanAnh
    WHERE maPhanAnh = @maPhanAnh;

    SELECT @maxSo = ISNULL(MAX(TRY_CAST(SUBSTRING(maThongBao, 3, 10) AS INT)), 0)
    FROM ThongBao
    WHERE maThongBao LIKE 'TB%';

    SET @maThongBaoMoi = 'TB' + RIGHT(REPLICATE('0', 6) + CAST(@maxSo + 1 AS VARCHAR(10)), 6);

    INSERT INTO ThongBao (maThongBao, tieuDe, noiDung, ngayGui, loaiThongBao, isCongDong)
    VALUES (
        @maThongBaoMoi,
        N'Cập nhật trạng thái phản ánh',
        N'Phản ánh mã ' + @maPhanAnh + N' đã được cập nhật trạng thái: ' + @trangThaiMoi + N'.',
        GETDATE(),
        N'Phản ánh',
        0
    );

    IF @nguoiGui IS NOT NULL
    BEGIN
        INSERT INTO ThongBao_NguoiDung (maNguoiDung, maThongBao, trangThai)
        VALUES (@nguoiGui, @maThongBaoMoi, N'Chưa đọc');
    END
END
GO

-- TEST PROCEDURE 3
PRINT N'===== TEST PROCEDURE 3: PRC_CapNhatTrangThaiPhanAnh =====';
INSERT INTO PhanAnh (maPhanAnh, maNguoiPhanAnh, trangThaiPhanAnh, maCoSo, lyDo, ngayGui, maLoaiPhanAnh)
VALUES ('PATEST2', 'ND005', N'Chưa xử lý', 'CS002', N'Test procedure cập nhật trạng thái', GETDATE(), 'LPA002');

EXEC PRC_CapNhatTrangThaiPhanAnh @maPhanAnh = 'PATEST2', @trangThaiMoi = N'Đã xử lý';

SELECT * FROM PhanAnh WHERE maPhanAnh = 'PATEST2';

SELECT tb.*
FROM ThongBao tb
WHERE tb.tieuDe = N'Cập nhật trạng thái phản ánh'
  AND tb.noiDung LIKE N'%PATEST2%';

SELECT tbnd.*
FROM ThongBao_NguoiDung tbnd
JOIN ThongBao tb ON tb.maThongBao = tbnd.maThongBao
WHERE tb.tieuDe = N'Cập nhật trạng thái phản ánh'
  AND tb.noiDung LIKE N'%PATEST2%';

DELETE tbnd
FROM ThongBao_NguoiDung tbnd
JOIN ThongBao tb ON tb.maThongBao = tbnd.maThongBao
WHERE tb.noiDung LIKE N'%PATEST2%';

DELETE FROM ThongBao WHERE noiDung LIKE N'%PATEST2%';
DELETE FROM PhanAnh WHERE maPhanAnh = 'PATEST2';
GO


-- Ý tưởng thêm 3 trigger dùng trong backend
-- 1 Trigger audit bảng ViPham/PhanAnh: ghi lịch sử trước-sau vào bảng nhật ký để backend hiển thị timeline xử lý.
-- 2 Trigger chống trạng thái sai quy trình: ví dụ PhanAnh chỉ cho chuyển Chưa xử lý -> Đang xử lý -> Đã xử lý.
-- 3 Trigger cảnh báo giấy phép sắp hết hạn: khi còn <= 30 ngày thì tự tạo sự kiện để backend gửi push/email định kỳ.
--  4 . TỰ động ghi log khi người dùng đăng nhập

GO
 

-- Tuấn : Liệt kê 3 trigger, 3 procedure và code trong sql. Liệt kê 4 trigger khi triển khai sẽ code trong backend 
-- sau này cho các table đã làm dưới các giao diện actor (ADMIN, Kiểm định viên ) ở tuần trước.


-- ============================================================
-- TRIGGER 1: Validate dữ liệu
-- Ràng buộc ngày kiểm nghiệm không được nhỏ hơn ngày thu mẫu
-- ============================================================
 
IF OBJECT_ID('TRG_MauKiemNghiem_ValidateNgay', 'TR') IS NOT NULL
    DROP TRIGGER TRG_MauKiemNghiem_ValidateNgay;
GO
 
CREATE TRIGGER TRG_MauKiemNghiem_ValidateNgay
ON MauKiemNghiem
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
 
    IF EXISTS (
        SELECT 1 FROM inserted
        WHERE ngayKiemNghiem IS NOT NULL
          AND ngayThu IS NOT NULL
          AND ngayKiemNghiem < ngayThu
    )
    BEGIN
        RAISERROR (N'Ngày kiểm nghiệm không được nhỏ hơn ngày thu mẫu.', 16, 1);
        ROLLBACK TRANSACTION;
        RETURN;
    END
END
GO
 
-- TEST TRIGGER 1
PRINT N'===== TEST TRIGGER 1: TRG_MauKiemNghiem_ValidateNgay =====';
BEGIN TRY
    INSERT INTO MauKiemNghiem (maMau, tenMau, ngayThu, ngayKiemNghiem, trangThai, loaiMau, noiDung, ngayYeuCau, hanHoanThanh)
    VALUES ('MTEST01', N'Mẫu test lỗi', '2024-06-10', '2024-06-05', N'Chờ xét nghiệm', N'Thực phẩm', N'Test validate', '2024-06-01', '2024-06-20');
    PRINT N'[FAILED] Dữ liệu sai nhưng vẫn insert được.';
END TRY
BEGIN CATCH
    PRINT N'[PASSED] Chặn đúng dữ liệu sai: ' + ERROR_MESSAGE();
END CATCH;
 
BEGIN TRY
    INSERT INTO MauKiemNghiem (maMau, tenMau, ngayThu, ngayKiemNghiem, trangThai, loaiMau, noiDung, ngayYeuCau, hanHoanThanh)
    VALUES ('MTEST02', N'Mẫu test hợp lệ', '2024-06-01', '2024-06-10', N'Chờ xét nghiệm', N'Thực phẩm', N'Test validate', '2024-05-30', '2024-06-20');
    PRINT N'[PASSED] Insert dữ liệu hợp lệ thành công.';
END TRY
BEGIN CATCH
    PRINT N'[FAILED] Dữ liệu hợp lệ nhưng bị lỗi: ' + ERROR_MESSAGE();
END CATCH;
 
DELETE FROM MauKiemNghiem WHERE maMau IN ('MTEST01', 'MTEST02');
GO
 
 
-- ============================================================
-- TRIGGER 2: Tự động cập nhật trạng thái
-- Đổi trạng thái mẫu thành "Có kết quả" khi nhập kết quả chỉ tiêu
-- ============================================================
 
IF OBJECT_ID('TRG_MauChiTieu_AutoUpdateTrangThai', 'TR') IS NOT NULL
    DROP TRIGGER TRG_MauChiTieu_AutoUpdateTrangThai;
GO
 
CREATE TRIGGER TRG_MauChiTieu_AutoUpdateTrangThai
ON Mau_ChiTieu
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
 
    UPDATE MauKiemNghiem
    SET trangThai = N'Có kết quả'
    WHERE maMau IN (
        SELECT DISTINCT maMau FROM inserted
        WHERE ketQua IS NOT NULL AND ketQua <> ''
    );
END
GO
 
-- TEST TRIGGER 2
PRINT N'===== TEST TRIGGER 2: TRG_MauChiTieu_AutoUpdateTrangThai =====';
 
-- Cần dữ liệu mẫu hỗ trợ test
INSERT INTO MauKiemNghiem (maMau, tenMau, ngayThu, ngayKiemNghiem, trangThai, loaiMau, noiDung, ngayYeuCau, hanHoanThanh)
VALUES ('MTEST03', N'Mẫu test tự động', '2024-06-01', '2024-06-10', N'Chờ xét nghiệm', N'Thực phẩm', N'Test auto update', '2024-05-30', '2024-06-20');
 
INSERT INTO ChiTieuKiemNghiem (maChiTieu, tenChiTieu)
VALUES ('CTTEST1', N'Chỉ tiêu test');
 
INSERT INTO Mau_ChiTieu (maMau, maChiTieu, ketQua)
VALUES ('MTEST03', 'CTTEST1', N'Đạt');
 
SELECT maMau, trangThai FROM MauKiemNghiem WHERE maMau = 'MTEST03';
 
DELETE FROM Mau_ChiTieu WHERE maMau = 'MTEST03' AND maChiTieu = 'CTTEST1';
DELETE FROM MauKiemNghiem WHERE maMau = 'MTEST03';
DELETE FROM ChiTieuKiemNghiem WHERE maChiTieu = 'CTTEST1';
GO
 
 
-- ============================================================
-- TRIGGER 3: Logging
-- Ghi log tự động khi thay đổi quyền hạn của người dùng
-- ============================================================
 
IF OBJECT_ID('TRG_QuyenHan_NguoiDung_GhiLog', 'TR') IS NOT NULL
    DROP TRIGGER TRG_QuyenHan_NguoiDung_GhiLog;
GO
 
CREATE TRIGGER TRG_QuyenHan_NguoiDung_GhiLog
ON QuyenHan_NguoiDung
AFTER INSERT, UPDATE
AS
BEGIN
    SET NOCOUNT ON;
 
    DECLARE @maxSo INT;
    SELECT @maxSo = ISNULL(MAX(TRY_CAST(SUBSTRING(maLog, 2, 10) AS INT)), 0)
    FROM [Log]
    WHERE maLog LIKE 'L%';
 
    INSERT INTO [Log] (maLog, ip, [time], maNguoiDung)
    SELECT
        'L' + RIGHT(REPLICATE('0', 8) + CAST(@maxSo + ROW_NUMBER() OVER (ORDER BY maNguoiDung) AS VARCHAR(10)), 8),
        N'System Trigger',
        GETDATE(),
        maNguoiDung
    FROM inserted;
END
GO
 
-- TEST TRIGGER 3
PRINT N'===== TEST TRIGGER 3: TRG_QuyenHan_NguoiDung_GhiLog =====';
 
-- Cần dữ liệu hỗ trợ
INSERT INTO NguoiDung (maNguoiDung, hoTen, email, soDienThoai, gioiTinh, matKhau, CCCD)
VALUES ('NDLOG01', N'Test Log User', 'logtest@email.com', '0912345679', N'Nam', 'pass12345', '000000000001');
 
INSERT INTO QuyenHan (maQuyenHan, quyenHan)
VALUES ('QHTEST1', N'Quyền test log');
 
INSERT INTO QuyenHan_NguoiDung (maQuyenHan, maNguoiDung)
VALUES ('QHTEST1', 'NDLOG01');
 
SELECT TOP 1 * FROM [Log] WHERE maNguoiDung = 'NDLOG01' ORDER BY [time] DESC;
 
DELETE FROM QuyenHan_NguoiDung WHERE maNguoiDung = 'NDLOG01' AND maQuyenHan = 'QHTEST1';
DELETE FROM [Log] WHERE maNguoiDung = 'NDLOG01';
DELETE FROM NguoiDung WHERE maNguoiDung = 'NDLOG01';
DELETE FROM QuyenHan WHERE maQuyenHan = 'QHTEST1';
GO
 
 
-- ============================================================
-- FUNCTION 1: Lấy danh sách mẫu chờ kiểm định của một cán bộ
-- ============================================================
 
IF OBJECT_ID('FN_LayMauChoKiemDinh', 'TF') IS NOT NULL
    DROP FUNCTION FN_LayMauChoKiemDinh;
GO
 
CREATE FUNCTION FN_LayMauChoKiemDinh (@maNguoiKiemNghiem VARCHAR(10))
RETURNS TABLE
AS
RETURN (
    SELECT
        m.maMau,
        m.tenMau,
        m.ngayThu,
        m.trangThai
    FROM MauKiemNghiem m
    JOIN DamNhanKiemNgiem d ON m.maMau = d.maMau
    WHERE d.maNguoiKiemNghiem = @maNguoiKiemNghiem
      AND m.trangThai = N'Chờ xét nghiệm'
);
GO
 
-- TEST FUNCTION 1
PRINT N'===== TEST FUNCTION 1: FN_LayMauChoKiemDinh =====';
SELECT * FROM FN_LayMauChoKiemDinh('ND001');
GO
 
 
-- ============================================================
-- PROCEDURE 2: Cập nhật kết quả một chỉ tiêu kiểm nghiệm
-- Nếu đã có thì UPDATE, chưa có thì INSERT
-- ============================================================
 
IF OBJECT_ID('PRC_CapNhatKetQuaChiTieu', 'P') IS NOT NULL
    DROP PROCEDURE PRC_CapNhatKetQuaChiTieu;
GO
 
CREATE PROCEDURE PRC_CapNhatKetQuaChiTieu
    @maMau      VARCHAR(10),
    @maChiTieu  VARCHAR(10),
    @ketQua     NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
 
    IF NOT EXISTS (SELECT 1 FROM MauKiemNghiem WHERE maMau = @maMau)
    BEGIN
        RAISERROR (N'Không tìm thấy mã mẫu kiểm nghiệm.', 16, 1);
        RETURN;
    END
 
    IF NOT EXISTS (SELECT 1 FROM ChiTieuKiemNghiem WHERE maChiTieu = @maChiTieu)
    BEGIN
        RAISERROR (N'Không tìm thấy mã chỉ tiêu kiểm nghiệm.', 16, 1);
        RETURN;
    END
 
    IF EXISTS (SELECT 1 FROM Mau_ChiTieu WHERE maMau = @maMau AND maChiTieu = @maChiTieu)
    BEGIN
        UPDATE Mau_ChiTieu
        SET ketQua = @ketQua
        WHERE maMau = @maMau AND maChiTieu = @maChiTieu;
    END
    ELSE
    BEGIN
        INSERT INTO Mau_ChiTieu (maMau, maChiTieu, ketQua)
        VALUES (@maMau, @maChiTieu, @ketQua);
    END
END
GO
 
-- TEST PROCEDURE 2
PRINT N'===== TEST PROCEDURE 2: PRC_CapNhatKetQuaChiTieu =====';
 
INSERT INTO MauKiemNghiem (maMau, tenMau, ngayThu, ngayKiemNghiem, trangThai, loaiMau, noiDung, ngayYeuCau, hanHoanThanh)
VALUES ('MTEST04', N'Mẫu test procedure', '2024-06-01', '2024-06-10', N'Chờ xét nghiệm', N'Thực phẩm', N'Test proc', '2024-05-30', '2024-06-20');
 
INSERT INTO ChiTieuKiemNghiem (maChiTieu, tenChiTieu)
VALUES ('CTTEST2', N'Chỉ tiêu test 2');
 
-- Test INSERT mới
EXEC PRC_CapNhatKetQuaChiTieu @maMau = 'MTEST04', @maChiTieu = 'CTTEST2', @ketQua = N'Đạt';
SELECT * FROM Mau_ChiTieu WHERE maMau = 'MTEST04' AND maChiTieu = 'CTTEST2';
 
-- Test UPDATE
EXEC PRC_CapNhatKetQuaChiTieu @maMau = 'MTEST04', @maChiTieu = 'CTTEST2', @ketQua = N'Không đạt';
SELECT * FROM Mau_ChiTieu WHERE maMau = 'MTEST04' AND maChiTieu = 'CTTEST2';
 
DELETE FROM Mau_ChiTieu WHERE maMau = 'MTEST04';
DELETE FROM MauKiemNghiem WHERE maMau = 'MTEST04';
DELETE FROM ChiTieuKiemNghiem WHERE maChiTieu = 'CTTEST2';
GO
 
 
-- ============================================================
-- PROCEDURE 3: Tạo đơn vi phạm từ kết quả kiểm định
-- ============================================================
 
IF OBJECT_ID('PRC_TaoViPhamTuKiemDinh', 'P') IS NOT NULL
    DROP PROCEDURE PRC_TaoViPhamTuKiemDinh;
GO
 
CREATE PROCEDURE PRC_TaoViPhamTuKiemDinh
    @maViPham       VARCHAR(10),
    @maHoSo         VARCHAR(10),
    @maLoaiViPham   VARCHAR(10),
    @moTa           NVARCHAR(MAX)
AS
BEGIN
    SET NOCOUNT ON;
 
    IF EXISTS (SELECT 1 FROM ViPham WHERE maViPham = @maViPham)
    BEGIN
        RAISERROR (N'Mã vi phạm đã tồn tại.', 16, 1);
        RETURN;
    END
 
    IF NOT EXISTS (SELECT 1 FROM HoSoThanhTra WHERE maHoSo = @maHoSo)
    BEGIN
        RAISERROR (N'Không tìm thấy hồ sơ thanh tra tương ứng.', 16, 1);
        RETURN;
    END
 
    IF NOT EXISTS (SELECT 1 FROM LoaiViPham WHERE maLoaiViPham = @maLoaiViPham)
    BEGIN
        RAISERROR (N'Không tìm thấy loại vi phạm tương ứng.', 16, 1);
        RETURN;
    END
 
    INSERT INTO ViPham (maViPham, maHoSo, maLoaiViPham, moTaThem, trangThaiPheDuyet)
    VALUES (@maViPham, @maHoSo, @maLoaiViPham, @moTa, N'Chờ phê duyệt');
 
    SELECT @maViPham AS maViPhamDaTao;
END
GO
 
-- TEST PROCEDURE 3
PRINT N'===== TEST PROCEDURE 3: PRC_TaoViPhamTuKiemDinh =====';
EXEC PRC_TaoViPhamTuKiemDinh
    @maViPham     = 'VPTEST2',
    @maHoSo       = 'HSTT001',
    @maLoaiViPham = 'LVP001',
    @moTa         = N'Vi phạm phát sinh từ kết quả kiểm nghiệm mẫu thực phẩm.';
 
SELECT * FROM ViPham WHERE maViPham = 'VPTEST2';
 
DELETE FROM ViPham WHERE maViPham = 'VPTEST2';
GO

-- 4 Trigger nghiệp vụ viết ở Backend (Spring Boot) Sử dụng JPA @PrePersist, @PreUpdate hoặc Spring @EventListener thay vì DB Trigger:
-- Mã hóa mật khẩu tự động: Bắt sự kiện @PrePersist trên entity NguoiDung để gọi Bcrypt băm mật khẩu trước khi lưu xuống DB.
-- Gửi Notification khi có kết quả mẫu: Sử dụng @AfterCommit (Spring ApplicationEvent) khi lưu thành công Mau_ChiTieu để bắn Push Notification cho Cán bộ thanh tra.
-- Audit Log phức tạp: Bắt sự kiện tạo ViPham để ghi log bao gồm thông tin chi tiết (ai tạo, tạo vì lý do gì, metadata JSON) vào Elasticsearch hoặc File log thay vì lưu DB quan hệ.
-- Khóa tài khoản Admin: Lắng nghe sự kiện AuthenticationFailureBadCredentialsEvent của Spring Security, nếu sai pass 5 lần thì update cờ isLocked trên bảng NguoiDung.
