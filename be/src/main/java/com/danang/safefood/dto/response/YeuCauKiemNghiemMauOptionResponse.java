package com.danang.safefood.dto.response;

import java.time.LocalDate;

public record YeuCauKiemNghiemMauOptionResponse(
        String maMau,
        String maCoSo,
        String tenMau,
        String loaiMau,
        String tenCoSo,
        LocalDate ngayThu
) {
}
