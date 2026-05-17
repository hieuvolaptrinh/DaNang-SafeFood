package com.danang.safefood.dto.response;

import java.time.LocalDate;

public record KetQuaKiemNghiemItemResponse(
        String maKetQua,
        String maMau,
        String tenCoSo,
        String tenMau,
        String loaiMau,
        LocalDate ngayKiemNghiem,
        String phongLab,
        String ketQua,
        String chiTieu,
        Integer diem,
        String fileKetQua
) {
}
