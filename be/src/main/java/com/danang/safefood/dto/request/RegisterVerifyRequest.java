package com.danang.safefood.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterVerifyRequest(
        @NotBlank(message = "Họ tên không được để trống")
        String fullName,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        String email,

        String phone,

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
        String password,

        @NotBlank(message = "Mã OTP không được để trống")
        @Size(min = 6, max = 6, message = "Mã OTP phải gồm 6 chữ số")
        String otp,

        String role,

        String businessName
) {
}
package com.danang.safefood.dto.request;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record RegisterVerifyRequest(
        @NotBlank(message = "Họ tên không được để trống")
        String fullName,

        @NotBlank(message = "Email không được để trống")
        @Email(message = "Email không hợp lệ")
        String email,

        String phone,

        @NotBlank(message = "Mã OTP không được để trống")
        @Size(min = 6, max = 6, message = "Mã OTP phải gồm 6 chữ số")
        String otp,

        @NotBlank(message = "Mật khẩu không được để trống")
        @Size(min = 6, message = "Mật khẩu phải có ít nhất 6 ký tự")
        String password,

        String role,
        String businessName
) {
}
