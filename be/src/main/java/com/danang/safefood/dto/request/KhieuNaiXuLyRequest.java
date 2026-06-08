package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;

public record KhieuNaiXuLyRequest(
        @NotBlank(message = "Kết quả xử lý không được để trống")
        String ketQuaXuLy,

        @NotBlank(message = "Trạng thái không được để trống")
        String trangThai
) {
}
