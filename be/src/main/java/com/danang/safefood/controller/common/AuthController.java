package com.danang.safefood.controller.common;

import com.danang.safefood.dto.auth.AuthRequest;
import com.danang.safefood.dto.auth.AuthResponse;
import com.danang.safefood.dto.auth.MobileAuthRequest;
import com.danang.safefood.dto.auth.RefreshTokenRequest;
import com.danang.safefood.dto.request.ForgotPasswordRequest;
import com.danang.safefood.dto.request.ResetPasswordRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.service.AuthenticationService;
import com.danang.safefood.service.ForgotPasswordService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthenticationService authenticationService;
    private final ForgotPasswordService forgotPasswordService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(@Valid @RequestBody AuthRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authenticationService.login(request.username(), request.password())));
    }

    @PostMapping("/login-mobile")
    public ResponseEntity<ApiResponse<AuthResponse>> loginMobile(@Valid @RequestBody MobileAuthRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authenticationService.loginMobile(request.identifier(), request.password())));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authenticationService.refreshToken(request.refreshToken())));
    }

    /**
     * Gửi mã OTP về email.
     */
    @PostMapping("/forgot-password/send-otp")
    public ResponseEntity<ApiResponse<String>> sendOtp(@Valid @RequestBody ForgotPasswordRequest request) {
        try {
            String email = forgotPasswordService.sendOtp(request.email());
            return ResponseEntity.ok(ApiResponse.success("Mã OTP đã được gửi đến email của bạn.", email));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    /**
     * Xác thực OTP và đặt lại mật khẩu.
     */
    @PostMapping("/forgot-password/reset")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        try {
            forgotPasswordService.verifyOtpAndResetPassword(
                    request.email(), request.otp(), request.newPassword()
            );
            return ResponseEntity.ok(ApiResponse.success("Đặt lại mật khẩu thành công.", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }
}
