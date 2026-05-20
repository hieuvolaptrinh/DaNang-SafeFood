package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;

import java.time.LocalDate;

/**
 * Request tạo mới cơ sở kinh doanh.
 */
public record CoSoKinhDoanhCreateRequest(
        @NotBlank(message = "Tên cơ sở không được để trống") String tenCoSo,
        String soGiayPhep,
        LocalDate ngayHetHanGiayPhep,
        String maPX,
        String anhBia
) {
}
