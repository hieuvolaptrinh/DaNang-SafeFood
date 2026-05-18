package com.danang.safefood.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.Size;

public record UpdateProfileRequest(
        @Size(max = 150, message = "Họ tên không được vượt quá 150 ký tự")
        String fullName,

        @Email(message = "Email không hợp lệ")
        String email,

        @Size(max = 20, message = "Số điện thoại không được vượt quá 20 ký tự")
        String phone
) {}
