package com.danang.safefood.dto.response;

import java.time.LocalDate;
import java.util.List;

public record KetQuaKiemNghiemDetailResponse(
        String maKetQua,
        String maMau,
        String tenCoSo,
        String tenMau,
        String loaiMau,
        LocalDate ngayKiemNghiem,
        String phongLab,
        String ketQua,
        String ketQuaKiemNghiem,
        String lyDoKhongDat,
        String chiTieu,
        Integer diem,
        String fileKetQua,
        List<KetQuaKiemNghiemChiTieuResponse> chiTietChiTieu
) {
}
