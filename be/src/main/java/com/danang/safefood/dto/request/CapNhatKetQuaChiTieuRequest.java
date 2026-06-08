package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.util.List;

/**
 * Request cập nhật kết quả nhiều chỉ tiêu của một mẫu kiểm định.
 */
public record CapNhatKetQuaChiTieuRequest(
        @NotNull(message = "Danh sách chỉ tiêu không được trống")
        List<ChiTieuKetQua> chiTieus
) {
    /**
     * Kết quả cho một chỉ tiêu kiểm nghiệm.
     */
    public record ChiTieuKetQua(
            @NotBlank(message = "Mã chỉ tiêu không được trống")
            String maChiTieu,

            @NotBlank(message = "Gia tri do khong duoc de trong")
            String giaTriDo,

            @NotBlank(message = "Gioi han cho phep khong duoc de trong")
            String gioiHanChoPhep,

            @NotBlank(message = "Ket qua khong duoc de trong")
            String ketQua
    ) {}
}
