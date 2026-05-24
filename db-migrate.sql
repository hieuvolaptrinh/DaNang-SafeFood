-- ============================================================================
-- DB MIGRATION (PostgreSQL) — Cập nhật schema mà KHÔNG xoá DB
-- Chạy lệnh này trên DB hiện tại trước khi restart backend với code mới.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- 1) co_so_kinh_doanh: thêm trangThaiKinhDoanh (enum)
-- ---------------------------------------------------------------------------

ALTER TABLE co_so_kinh_doanh
    ADD COLUMN IF NOT EXISTS trangThaiKinhDoanh VARCHAR(30);

-- Đặt giá trị mặc định cho data cũ
UPDATE co_so_kinh_doanh
SET trangThaiKinhDoanh = CASE
    WHEN LOWER(trangThai) LIKE '%hoat dong%'  THEN 'DANG_HOAT_DONG'
    WHEN LOWER(trangThai) LIKE '%hoạt động%'  THEN 'DANG_HOAT_DONG'
    WHEN LOWER(trangThai) LIKE '%tam dung%'   THEN 'BI_CAM'
    WHEN LOWER(trangThai) LIKE '%tạm dừng%'   THEN 'BI_CAM'
    ELSE 'DANG_DOI_PHE_DUYET'
END
WHERE trangThaiKinhDoanh IS NULL;

ALTER TABLE co_so_kinh_doanh
    ALTER COLUMN trangThaiKinhDoanh SET NOT NULL;

-- ---------------------------------------------------------------------------
-- 2) Đổi tên bảng giay_phep → giay_to (nếu cũ tồn tại)
-- ---------------------------------------------------------------------------

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables
               WHERE table_name = 'giay_phep') THEN
        EXECUTE 'ALTER TABLE giay_phep RENAME TO giay_to';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 3) giay_to: thêm các cột mới, bỏ FK cũ (maCoSo) và liên kết qua hồ sơ
-- ---------------------------------------------------------------------------

-- Drop UNIQUE constraint cũ nếu tồn tại
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints
               WHERE constraint_name = 'UQ_GiayPhep_CoSo_Loai') THEN
        EXECUTE 'ALTER TABLE giay_to DROP CONSTRAINT "UQ_GiayPhep_CoSo_Loai"';
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.table_constraints
               WHERE constraint_name = 'uq_giayphep_coso_loai') THEN
        EXECUTE 'ALTER TABLE giay_to DROP CONSTRAINT uq_giayphep_coso_loai';
    END IF;
END $$;

-- Thêm cột mới
ALTER TABLE giay_to
    ADD COLUMN IF NOT EXISTS tenGiayPhep VARCHAR(100),
    ADD COLUMN IF NOT EXISTS moTa        VARCHAR(255),
    ADD COLUMN IF NOT EXISTS loaiGiayTo  VARCHAR(40),
    ADD COLUMN IF NOT EXISTS urlFile     VARCHAR(500),
    ADD COLUMN IF NOT EXISTS maHoSo      VARCHAR(10);

-- Map từ loaiGiayPhep cũ (chuỗi tự do) sang enum loaiGiayTo
UPDATE giay_to
SET loaiGiayTo = CASE
    WHEN LOWER(COALESCE(loaiGiayPhep, '')) LIKE '%hop dong%' OR LOWER(COALESCE(loaiGiayPhep,'')) LIKE '%hợp đồng%' THEN 'HOP_DONG_THUE_MAT_BANG'
    WHEN LOWER(COALESCE(loaiGiayPhep, '')) LIKE '%attp%'     OR LOWER(COALESCE(loaiGiayPhep,'')) LIKE '%vệ sinh%' OR LOWER(COALESCE(loaiGiayPhep,'')) LIKE '%ve sinh%' THEN 'GIAY_PHEP_ATTP'
    WHEN LOWER(COALESCE(loaiGiayPhep, '')) LIKE '%pccc%'     OR LOWER(COALESCE(loaiGiayPhep,'')) LIKE '%phòng cháy%' THEN 'GIAY_TO_PCCC'
    ELSE 'GIAY_PHEP_KINH_DOANH'
END
WHERE loaiGiayTo IS NULL;

-- Tạm thời lấy 1 hồ sơ bất kỳ của cùng cơ sở để gán cho maHoSo
UPDATE giay_to gt
SET maHoSo = (
    SELECT h.maHoSo FROM ho_so_dang_ki_kinh_doanh h
    WHERE h.maCoSo = gt.maCoSo
    ORDER BY h.ngayNop DESC NULLS LAST
    LIMIT 1
)
WHERE gt.maHoSo IS NULL AND gt.maCoSo IS NOT NULL;

-- Drop FK cũ tới co_so_kinh_doanh, drop column maCoSo, loaiGiayPhep
DO $$
DECLARE
    fk_name TEXT;
BEGIN
    SELECT constraint_name INTO fk_name
    FROM information_schema.table_constraints
    WHERE table_name = 'giay_to' AND constraint_type = 'FOREIGN KEY'
      AND constraint_name LIKE '%macoso%' LIMIT 1;
    IF fk_name IS NOT NULL THEN
        EXECUTE 'ALTER TABLE giay_to DROP CONSTRAINT ' || quote_ident(fk_name);
    END IF;
END $$;

ALTER TABLE giay_to DROP COLUMN IF EXISTS maCoSo;
ALTER TABLE giay_to DROP COLUMN IF EXISTS loaiGiayPhep;

-- Set NOT NULL cho loaiGiayTo
ALTER TABLE giay_to ALTER COLUMN loaiGiayTo SET NOT NULL;

-- Thêm FK mới + UNIQUE constraint mới
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name = 'fk_giay_to_ho_so') THEN
        EXECUTE 'ALTER TABLE giay_to ADD CONSTRAINT fk_giay_to_ho_so
                 FOREIGN KEY (maHoSo) REFERENCES ho_so_dang_ki_kinh_doanh(maHoSo)';
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name = 'UQ_GiayTo_HoSo_Loai') THEN
        EXECUTE 'ALTER TABLE giay_to ADD CONSTRAINT "UQ_GiayTo_HoSo_Loai"
                 UNIQUE (maHoSo, loaiGiayTo)';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 4) ho_so_dang_ki_kinh_doanh: thêm ngayHetHan, ngayCap, urlFile, maLoaiGiayTo
-- ---------------------------------------------------------------------------
ALTER TABLE ho_so_dang_ki_kinh_doanh
    ADD COLUMN IF NOT EXISTS ngayHetHan   DATE,
    ADD COLUMN IF NOT EXISTS ngayCap      DATE,
    ADD COLUMN IF NOT EXISTS urlFile      VARCHAR(500),
    ADD COLUMN IF NOT EXISTS maLoaiGiayTo VARCHAR(30);

-- FK đến loai_giay_to (nếu chưa có)
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.table_constraints
                   WHERE constraint_name = 'fk_hsdk_loai_giay_to') THEN
        EXECUTE 'ALTER TABLE ho_so_dang_ki_kinh_doanh
                 ADD CONSTRAINT fk_hsdk_loai_giay_to
                 FOREIGN KEY (maLoaiGiayTo) REFERENCES loai_giay_to(maLoaiGiayTo)';
    END IF;
END $$;

-- ---------------------------------------------------------------------------
-- 5) hinh_thuc_khac_phuc: nếu data cũ có chuỗi tiếng Việt, chuẩn hoá về enum
-- ---------------------------------------------------------------------------
UPDATE hinh_thuc_khac_phuc
SET tinhTrangKhacPhuc = CASE
    WHEN tinhTrangKhacPhuc IN ('CHUA_KHAC_PHUC','DANG_KHAC_PHUC','DA_KHAC_PHUC') THEN tinhTrangKhacPhuc
    WHEN LOWER(tinhTrangKhacPhuc) LIKE '%đa khac%' OR LOWER(tinhTrangKhacPhuc) LIKE '%da khac%' OR LOWER(tinhTrangKhacPhuc) LIKE '%đã khắc%' THEN 'DA_KHAC_PHUC'
    WHEN LOWER(tinhTrangKhacPhuc) LIKE '%dang khac%' OR LOWER(tinhTrangKhacPhuc) LIKE '%đang khắc%' OR LOWER(tinhTrangKhacPhuc) LIKE '%danh_khac_phucc%' THEN 'DANG_KHAC_PHUC'
    ELSE 'CHUA_KHAC_PHUC'
END;
