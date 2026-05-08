-- =============================================
-- DATA.SQL - Dữ liệu test SafeFood
-- =============================================

-- 1. Quyền hạn
INSERT INTO quyen_han (maQuyenHan, quyenHan)
VALUES
    ('QTH', 'Quản trị hệ thống'),
    ('LD_ATVSTP', 'Lãnh đạo ATVSTP'),
    ('CSKD', 'Chuyên viên Kinh doanh'),
    ('CB_THANH_TRA', 'Cán bộ Thanh tra'),
    ('CB_KIEM_DINH', 'Cán bộ Kiểm định'),
    ('NTD', 'Người tiêu dùng')
    ON CONFLICT (maQuyenHan) DO NOTHING;


-- 2. Tài khoản test
-- password = 123456

INSERT INTO tai_khoan (
    id,
    username,
    password,
    full_name,
    email,
    phone,
    enabled,
    created_at,
    updated_at
)
VALUES
    (
        1,
        'admin',
        '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq',
        'Administrator',
        'admin@safefood.vn',
        '0901234567',
        true,
        NOW(),
        NOW()
    ),

    (
        2,
        'ld1',
        '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq',
        'Lãnh đạo ATVSTP',
        'ld@safefood.vn',
        '0901234568',
        true,
        NOW(),
        NOW()
    ),

    (
        3,
        'thanhtra',
        '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq',
        'Cán bộ Thanh tra',
        'thanhtra@safefood.vn',
        '0901234569',
        true,
        NOW(),
        NOW()
    ),

    (
        4,
        'user1',
        '$2a$10$v3eu725GjfHQ34OHA43qN.oddPUR.Be6qDjfVo3iSErVaWpH5OuTq',
        'Nguyễn Văn A',
        'user1@gmail.com',
        '0987654321',
        true,
        NOW(),
        NOW()
    )

    ON CONFLICT (id) DO NOTHING;


-- 3. Phân quyền tài khoản
INSERT INTO quyen_han_nguoi_dung (
    maQuyenHan,
    tai_khoan_id
)
VALUES
    ('QTH', 1),
    ('LD_ATVSTP', 2),
    ('CB_THANH_TRA', 3),
    ('NTD', 4)
    ON CONFLICT DO NOTHING;


-- 4. Người dùng
INSERT INTO nguoi_dung (
    maNguoiDung,
    hoTen,
    soDienThoai,
    gioiTinh,
    cccd,
    tai_khoan_id
)
VALUES
    ('ND001', 'Administrator', '0901234567', 'Nam', '012345678901', 1),
    ('ND002', 'Lãnh đạo ATVSTP', '0901234568', 'Nữ', '012345678902', 2),
    ('ND003', 'Cán bộ Thanh tra', '0901234569', 'Nam', '012345678903', 3),
    ('ND004', 'Nguyễn Văn A', '0987654321', 'Nam', '012345678904', 4)

    ON CONFLICT DO NOTHING;


-- Reset sequence
ALTER SEQUENCE tai_khoan_id_seq RESTART WITH 5;