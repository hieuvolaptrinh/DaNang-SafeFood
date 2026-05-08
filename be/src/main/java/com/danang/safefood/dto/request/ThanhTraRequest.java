package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ThanhTraRequest(
        @NotBlank(message = "Mã cơ sở kinh doanh không được trống") String maCoSo,
        String noiDung,
        /** Mã NguoiDung phụ trách */
        String maNguoiPhuTrach
) {}
