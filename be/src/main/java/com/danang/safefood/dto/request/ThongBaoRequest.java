package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;

public record ThongBaoRequest(
        @NotBlank(message = "Tiêu đề không được trống") String tieuDe,
        String noiDung,
        /** "An toan thuc pham", "Canh bao", "Thong tin chung" */
        String loaiThongBao,
        Boolean isCongDong
) {}
