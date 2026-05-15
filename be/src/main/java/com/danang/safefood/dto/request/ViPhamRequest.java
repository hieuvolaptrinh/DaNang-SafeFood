package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

/**
 * Request tạo đơn vi phạm từ kiểm định viên.
 * trangThaiPheDuyet mặc định = "Chờ Duyệt"
 */
public record ViPhamRequest(
                @NotBlank(message = "Mã hồ sơ thanh tra không được trống") String maHoSo,

                @NotBlank(message = "Mã loại vi phạm không được trống") String maLoaiViPham,

                String moTaThem,

                String khacPhuc,

                @Pattern(regexp = "Nhẹ|Trung bình|Nghiêm trọng|Rất nghiêm trọng", message = "Mức độ không hợp lệ. Chọn: Nhẹ | Trung bình | Nghiêm trọng | Rất nghiêm trọng") String mucDo) {
}
