package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record BaoCaoRequest(
        @NotBlank(message = "Mã cơ sở không được để trống")
        String facilityId,

        @NotBlank(message = "Ngày kiểm tra không được để trống")
        String inspectionDate,

        @NotBlank(message = "Loại thanh tra không được để trống")
        String inspectionType,

        @NotBlank(message = "Nội dung không được để trống")
        String content,

        @NotBlank(message = "Nhận xét không được để trống")
        String comment,

        @NotBlank(message = "Kết quả không được để trống")
        String result,

        @NotNull(message = "Điểm không được để trống")
        Double score,

        String fileName,

        Boolean hasInspectionRecord
) {
}
