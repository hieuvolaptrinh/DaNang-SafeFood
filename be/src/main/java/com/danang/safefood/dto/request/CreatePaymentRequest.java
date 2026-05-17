package com.danang.safefood.dto.request;

import jakarta.validation.constraints.NotBlank;

/**
 * Request tạo link thanh toán cho 1 vi phạm
 */
public record CreatePaymentRequest(
        @NotBlank(message = "Mã vi phạm không được trống") String maViPham,
        String description
) {
}
