-- Test workflow: INSERT -> UPDATE to approved -> Check notifications
USE DaNangSafeFood;

SET NOCOUNT OFF;

PRINT N'===== TEST TRIGGER: TRG_PhanAnh_KhanCapOnApprove (Workflow with Approval) =====';
DECLARE @LKH_maPhanAnh_KC VARCHAR(10) = 'PA_APPROV_TEST';
DECLARE @LKH_maNguoiPhanAnh_KC VARCHAR(10) = 'ND004';

-- Clean up first if exists
IF EXISTS (SELECT 1 FROM PhanAnh WHERE maPhanAnh = @LKH_maPhanAnh_KC)
BEGIN
    DELETE FROM FileDinhKem WHERE maPhanAnh = @LKH_maPhanAnh_KC;
    
    DELETE tbnd FROM ThongBao_NguoiDung tbnd
    JOIN ThongBao tb ON tb.maThongBao = tbnd.maThongBao
    WHERE tb.noiDung LIKE N'%' + @LKH_maPhanAnh_KC + N'%';
    
    DELETE FROM ThongBao WHERE noiDung LIKE N'%' + @LKH_maPhanAnh_KC + N'%';
    DELETE FROM PhanAnh WHERE maPhanAnh = @LKH_maPhanAnh_KC;
    
    PRINT N'[CLEANUP] Da xoa test data cu';
END

PRINT N'';
PRINT N'[STEP 1] INSERT phan anh voi status = "Chua xu ly" (chua duyet)';
PRINT N'';

INSERT INTO PhanAnh (maPhanAnh, maNguoiPhanAnh, trangThaiPhanAnh, maCoSo, lyDo, ngayGui, maLoaiPhanAnh)
VALUES (@LKH_maPhanAnh_KC, @LKH_maNguoiPhanAnh_KC, N'Chua xu ly', 'CS001', N'Nghi ngo ngo doc thuc pham, can cap cuu gap', GETDATE(), 'LPA001');

PRINT N'[STEP 1 RESULT] Danh sach thong bao sau INSERT (status = Chua xu ly):';
PRINT N'Expected: CHI 1 thong bao tu TRG_PhanAnh_AutoThongBaoChiCuc (Chi cuc duoc thong bao)';
PRINT N'KHONG co canh bao khan cap vi phan anh chua duoc duyet!';
PRINT N'';

SELECT 
    tb.maThongBao, 
    tb.tieuDe, 
    tb.loaiThongBao, 
    tb.isCongDong,
    nd.tenNguoiDung as NguoiNhan
FROM ThongBao tb
LEFT JOIN ThongBao_NguoiDung tbnd ON tb.maThongBao = tbnd.maThongBao
LEFT JOIN NguoiDung nd ON nd.maNguoiDung = tbnd.maNguoiDung
WHERE tb.noiDung LIKE N'%' + @LKH_maPhanAnh_KC + N'%'
ORDER BY tb.ngayGui DESC;

PRINT N'';
PRINT N'[STEP 2] UPDATE status = "Da duyet" (Phe duyet phan anh)';
PRINT N'';

UPDATE PhanAnh
SET trangThaiPhanAnh = N'Đã duyệt'
WHERE maPhanAnh = @LKH_maPhanAnh_KC;

PRINT N'[STEP 2 RESULT] Danh sach thong bao SAU UPDATE (status = Da duyet):';
PRINT N'Expected: THEM 1 canh bao khan cap tu TRG_PhanAnh_KhanCapOnApprove (Cong khai cho toan dan)';
PRINT N'Vay tong cong se la 2 thong bao';
PRINT N'';

SELECT 
    tb.maThongBao, 
    tb.tieuDe, 
    tb.loaiThongBao, 
    tb.isCongDong,
    nd.tenNguoiDung as NguoiNhan
FROM ThongBao tb
LEFT JOIN ThongBao_NguoiDung tbnd ON tb.maThongBao = tbnd.maThongBao
LEFT JOIN NguoiDung nd ON nd.maNguoiDung = tbnd.maNguoiDung
WHERE tb.noiDung LIKE N'%' + @LKH_maPhanAnh_KC + N'%'
ORDER BY tb.maThongBao DESC, tb.ngayGui DESC;

PRINT N'';
PRINT N'[CLEANUP] Xoa test data';
DELETE FROM FileDinhKem WHERE maPhanAnh = @LKH_maPhanAnh_KC;

DELETE tbnd FROM ThongBao_NguoiDung tbnd
JOIN ThongBao tb ON tb.maThongBao = tbnd.maThongBao
WHERE tb.noiDung LIKE N'%' + @LKH_maPhanAnh_KC + N'%';

DELETE FROM ThongBao WHERE noiDung LIKE N'%' + @LKH_maPhanAnh_KC + N'%';
DELETE FROM PhanAnh WHERE maPhanAnh = @LKH_maPhanAnh_KC;

PRINT N'[DONE]';
