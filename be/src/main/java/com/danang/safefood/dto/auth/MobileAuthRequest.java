package com.danang.safefood.dto.auth;

import jakarta.validation.constraints.NotBlank;

public record MobileAuthRequest(
        @NotBlank(message = "Vui lòng nhập email hoặc số điện thoại")
        String identifier,

        @NotBlank(message = "Vui lòng nhập mật khẩu")
        String password
) {
}
