package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;

public record KhieuNaiKiemTraRequest(
        @NotBlank(message = "Tóm tắt kiểm tra không được để trống")
        String tomTatKiemTra
) {
}
