package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;

/**
 * Request tạo đơn vi phạm từ kiểm định viên.
 * trangThaiPheDuyet mặc định = "Chờ Duyệt"
 */
public record ViPhamRequest(
                @NotBlank(message = "Mã mẫu không được trống") String maMau,

                @NotBlank(message = "Mã loại vi phạm không được trống") String maLoaiViPham,

                @NotNull
                @Positive
                BigDecimal soTienPhat,

                String moTaThem,

                String khacPhuc,

                @Pattern(regexp = "Nhẹ|Trung bình|Nghiêm trọng|Rất nghiêm trọng", message = "Mức độ không hợp lệ. Chọn: Nhẹ | Trung bình | Nghiêm trọng | Rất nghiêm trọng") String mucDo) {
}
