package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

/**
 * Request tạo / cập nhật hồ sơ đăng kí kinh doanh.
 */
public record HoSoDangKiRequest(
        @NotBlank(message = "Mã cơ sở không được để trống") String maCoSo,
        LocalDate ngayNop,
        String trangThai
) {
}
