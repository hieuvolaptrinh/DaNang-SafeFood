package com.danang.safefood.dto.response;

import java.time.LocalDate;

public record YeuCauKiemNghiemResponse(
        String maYeuCau,
        String tenCoSo,
        String loaiMau,
        LocalDate ngayYeuCau,
        LocalDate hanHoanThanh,
        String trangThai,
        String phongLab,
        String ketQuaKiemNghiem,
        String lyDoKhongDat,
        String noidungYeuCau,
        String chiTieuKiemDinh,
        String maMauLienQuan,
        LocalDate ngayTao,
        String maNguoiTao
) {
}
