package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record UpdateKetQuaKiemNghiemRequest(
        @NotBlank(message = "Kết quả kiểm nghiệm không được để trống")
        String ketQuaKiemNghiem,

        @NotBlank(message = "Trạng thái không được để trống")
        String trangThai,

        String lyDoKhongDat,

        String fileCoDauMoc
) {
}
