package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDateTime;

public record PhanCongKiemTraRequest(
        @NotBlank(message = "Mã lịch thanh tra không được trống") String maThanhTra,
        @NotBlank(message = "Mã người được phân công không được trống") String maNguoiThanhTra,
        LocalDateTime thoiGianTT
) {}
