package com.danang.safefood.controller.common;

import com.danang.safefood.config.security.jwt.JwtPrincipal;
import com.danang.safefood.dto.request.ChangePasswordRequest;
import com.danang.safefood.dto.request.UpdateProfileRequest;
import com.danang.safefood.dto.response.ApiResponse;
import com.danang.safefood.dto.response.ProfileResponse;
import com.danang.safefood.service.ProfileService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
@RequiredArgsConstructor
public class ProfileController {

    private final ProfileService profileService;

    /**
     * Lấy thông tin cá nhân của người dùng hiện tại.
     */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> getProfile(
            @AuthenticationPrincipal JwtPrincipal jwt) {
        return ResponseEntity.ok(ApiResponse.success(
                profileService.getProfile(jwt.userId())));
    }

    /**
     * Cập nhật thông tin cá nhân.
     */
    @PutMapping("/me")
    public ResponseEntity<ApiResponse<ProfileResponse>> updateProfile(
            @AuthenticationPrincipal JwtPrincipal jwt,
            @Valid @RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(
                "Cập nhật thông tin thành công.",
                profileService.updateProfile(jwt.userId(), request)));
    }

    /**
     * Đổi mật khẩu.
     */
    @PutMapping("/change-password")
    public ResponseEntity<ApiResponse<Void>> changePassword(
            @AuthenticationPrincipal JwtPrincipal jwt,
            @Valid @RequestBody ChangePasswordRequest request) {
        profileService.changePassword(jwt.userId(), request);
        return ResponseEntity.ok(ApiResponse.success("Đổi mật khẩu thành công.", null));
    }
}
