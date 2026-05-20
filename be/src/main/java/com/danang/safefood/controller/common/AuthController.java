package com.danang.safefood.controller.common;

import com.danang.safefood.dto.auth.AuthRequest;
import com.danang.safefood.dto.auth.AuthResponse;
import com.danang.safefood.dto.auth.MobileAuthRequest;
import com.danang.safefood.dto.auth.RefreshTokenRequest;
import com.danang.safefood.dto.request.ForgotPasswordRequest;
import com.danang.safefood.dto.request.RegisterSendOtpRequest;
import com.danang.safefood.dto.request.RegisterVerifyRequest;
import com.danang.safefood.dto.request.ResetPasswordRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.service.AuthenticationService;
import com.danang.safefood.service.ForgotPasswordService;
import com.danang.safefood.service.RegisterService;
import com.danang.safefood.util.RequestUtils;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import jakarta.servlet.http.HttpServletRequest;
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
    private final RegisterService registerService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<AuthResponse>> login(
            @Valid @RequestBody AuthRequest request,
            HttpServletRequest httpRequest) {
        String ip = RequestUtils.getClientIp(httpRequest);
        String device = RequestUtils.resolveDevice(null, httpRequest);
        return ResponseEntity
                .ok(ApiResponse.success(authenticationService.login(
                        request.username(),
                        request.password(),
                        ip,
                        null,
                        device)));
    }

    @PostMapping("/login-mobile")
    public ResponseEntity<ApiResponse<AuthResponse>> loginMobile(
            @Valid @RequestBody MobileAuthRequest request,
            HttpServletRequest httpRequest) {
        String ip = RequestUtils.getClientIp(httpRequest);
        String device = RequestUtils.resolveDevice(request.device(), httpRequest);
        return ResponseEntity
                .ok(ApiResponse.success(authenticationService.loginMobile(
                        request.identifier(),
                        request.password(),
                        ip,
                        request.location(),
                        device)));
    }

    @PostMapping("/refresh-token")
    public ResponseEntity<ApiResponse<AuthResponse>> refreshToken(@Valid @RequestBody RefreshTokenRequest request) {
        return ResponseEntity.ok(ApiResponse.success(authenticationService.refreshToken(request.refreshToken())));
    }

    /**
     * Gửi OTP xác nhận đăng ký.
     */
    @PostMapping("/register/send-otp")
    public ResponseEntity<ApiResponse<String>> sendRegisterOtp(@Valid @RequestBody RegisterSendOtpRequest request) {
        try {
            String email = registerService.sendOtp(request.email());
            return ResponseEntity.ok(ApiResponse.success("Mã OTP đã được gửi đến email của bạn.", email));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }

    /**
     * Xác thực OTP và tạo tài khoản.
     */
    @PostMapping("/register/verify")
    public ResponseEntity<ApiResponse<AuthResponse>> verifyRegister(
            @Valid @RequestBody RegisterVerifyRequest request) {
        try {
            AuthResponse response = registerService.verifyOtpAndRegister(request);
            return ResponseEntity.ok(ApiResponse.success("Đăng ký thành công.", response));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
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
                    request.email(), request.otp(), request.newPassword());
            return ResponseEntity.ok(ApiResponse.success("Đặt lại mật khẩu thành công.", null));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(ApiResponse.error(400, e.getMessage()));
        }
    }
}
