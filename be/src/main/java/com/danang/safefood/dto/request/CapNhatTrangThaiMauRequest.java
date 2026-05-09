package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Request cập nhật trạng thái mẫu kiểm định.
 * trangThai hợp lệ: Chờ xử lý | Chờ xét nghiệm | Đang kiểm nghiệm | Đang xét nghiệm | Hoàn thành | Có kết quả | Hủy
 */
public record CapNhatTrangThaiMauRequest(
        @NotBlank(message = "Trạng thái không được trống")
        @Pattern(
                regexp = "Chờ xử lý|Chờ xét nghiệm|Đang kiểm nghiệm|Đang xét nghiệm|Hoàn thành|Có kết quả|Hủy",
                message = "Trạng thái không hợp lệ"
        )
        String trangThai,

        String ghiChu
) {}
