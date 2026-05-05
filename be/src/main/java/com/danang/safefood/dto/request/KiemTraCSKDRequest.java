package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;

public record KiemTraCSKDRequest(
        String noiDung,
        @NotBlank(message = "Mã người phụ trách không được trống") String maNguoiPhuTrach
) {}
